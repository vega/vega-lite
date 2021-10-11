import {isArray} from 'vega-util';
import {FieldRefOption, isFieldDef, isValueDef, vgField} from '../../channeldef';
import {DataSourceType} from '../../data';
import {isAggregate, pathGroupingFields} from '../../encoding';
import {AREA, BAR, isPathMark, LINE, Mark, TRAIL} from '../../mark';
import {isSortByEncoding, isSortField} from '../../sort';
import {contains, getFirstDefined, isNullOrFalse, keys, omit, pick} from '../../util';
import {VgCompare, VgEncodeEntry, VG_CORNERRADIUS_CHANNELS} from '../../vega.schema';
import {getMarkConfig, getMarkPropOrConfig, getStyles, signalOrValueRef, sortParams} from '../common';
import {UnitModel} from '../unit';
import {arc} from './arc';
import {area} from './area';
import {bar} from './bar';
import {MarkCompiler} from './base';
import {geoshape} from './geoshape';
import {image} from './image';
import {line, trail} from './line';
import {circle, point, square} from './point';
import {rect} from './rect';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';

const markCompiler: Record<Mark, MarkCompiler> = {
  arc,
  area,
  bar,
  circle,
  geoshape,
  image,
  line,
  point,
  rect,
  rule,
  square,
  text,
  tick,
  trail
};

export function parseMarkGroups(model: UnitModel): any[] {
  if (contains([LINE, AREA, TRAIL], model.mark)) {
    const details = pathGroupingFields(model.mark, model.encoding);
    if (details.length > 0) {
      return getPathGroups(model, details);
    }
    // otherwise use standard mark groups
  } else if (model.mark === BAR) {
    const hasCornerRadius = VG_CORNERRADIUS_CHANNELS.some(prop =>
      getMarkPropOrConfig(prop, model.markDef, model.config)
    );
    if (model.stack && !model.fieldDef('size') && hasCornerRadius) {
      return getGroupsForStackedBarWithCornerRadius(model);
    }
  }

  return getMarkGroup(model);
}

const FACETED_PATH_PREFIX = 'faceted_path_';

function getPathGroups(model: UnitModel, details: string[]) {
  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  return [
    {
      name: model.getName('pathgroup'),
      type: 'group',
      from: {
        facet: {
          name: FACETED_PATH_PREFIX + model.requestDataName(DataSourceType.Main),
          data: model.requestDataName(DataSourceType.Main),
          groupby: details
        }
      },
      encode: {
        update: {
          width: {field: {group: 'width'}},
          height: {field: {group: 'height'}}
        }
      },
      // With subfacet for line/area group, need to use faceted data from above.
      marks: getMarkGroup(model, {fromPrefix: FACETED_PATH_PREFIX})
    }
  ];
}

const STACK_GROUP_PREFIX = 'stack_group_';

/**
 * We need to put stacked bars into groups in order to enable cornerRadius for stacks.
 * If stack is used and the model doesn't have size encoding, we put the mark into groups,
 * and apply cornerRadius properties at the group.
 */
function getGroupsForStackedBarWithCornerRadius(model: UnitModel) {
  // Generate the mark
  const [mark] = getMarkGroup(model, {fromPrefix: STACK_GROUP_PREFIX});

  // Get the scale for the stacked field
  const fieldScale = model.scaleName(model.stack.fieldChannel);
  const stackField = (opt: FieldRefOption = {}) => model.vgField(model.stack.fieldChannel, opt);
  // Find the min/max of the pixel value on the stacked direction
  const stackFieldGroup = (func: 'min' | 'max', expr: 'datum' | 'parent') => {
    const vgFieldMinMax = [
      stackField({prefix: 'min', suffix: 'start', expr}),
      stackField({prefix: 'max', suffix: 'start', expr}),
      stackField({prefix: 'min', suffix: 'end', expr}),
      stackField({prefix: 'max', suffix: 'end', expr})
    ];
    return `${func}(${vgFieldMinMax.map(field => `scale('${fieldScale}',${field})`).join(',')})`;
  };

  let groupUpdate: VgEncodeEntry;
  let innerGroupUpdate: VgEncodeEntry;

  // Build the encoding for group and an inner group
  if (model.stack.fieldChannel === 'x') {
    // Move cornerRadius, y/yc/y2/height properties to group
    // Group x/x2 should be the min/max of the marks within
    groupUpdate = {
      ...pick(mark.encode.update, ['y', 'yc', 'y2', 'height', ...VG_CORNERRADIUS_CHANNELS]),
      x: {signal: stackFieldGroup('min', 'datum')},
      x2: {signal: stackFieldGroup('max', 'datum')},
      clip: {value: true}
    };
    // Inner group should revert the x translation, and pass height through
    innerGroupUpdate = {
      x: {field: {group: 'x'}, mult: -1},
      height: {field: {group: 'height'}}
    };
    // The marks should use the same height as group, without y/yc/y2 properties (because it's already done by group)
    // This is why size encoding is not supported yet
    mark.encode.update = {
      ...omit(mark.encode.update, ['y', 'yc', 'y2']),
      height: {field: {group: 'height'}}
    };
  } else {
    groupUpdate = {
      ...pick(mark.encode.update, ['x', 'xc', 'x2', 'width']),
      y: {signal: stackFieldGroup('min', 'datum')},
      y2: {signal: stackFieldGroup('max', 'datum')},
      clip: {value: true}
    };
    innerGroupUpdate = {
      y: {field: {group: 'y'}, mult: -1},
      width: {field: {group: 'width'}}
    };
    mark.encode.update = {
      ...omit(mark.encode.update, ['x', 'xc', 'x2']),
      width: {field: {group: 'width'}}
    };
  }

  // Deal with cornerRadius properties
  for (const key of VG_CORNERRADIUS_CHANNELS) {
    const configValue = getMarkConfig(key, model.markDef, model.config);
    // Move from mark to group
    if (mark.encode.update[key]) {
      groupUpdate[key] = mark.encode.update[key];
      delete mark.encode.update[key];
    } else if (configValue) {
      groupUpdate[key] = signalOrValueRef(configValue);
    }
    // Overwrite any cornerRadius on mark set by config --- they are already moved to the group
    if (configValue) {
      mark.encode.update[key] = {value: 0};
    }
  }

  const groupby: string[] = [];

  if (model.stack.groupbyChannels?.length > 0) {
    for (const groupbyChannel of model.stack.groupbyChannels) {
      // For bin and time unit, we have to add bin/timeunit -end channels.
      const groupByField = model.fieldDef(groupbyChannel);
      const field = vgField(groupByField);
      if (field) {
        groupby.push(field);
      }

      if (groupByField?.bin || groupByField?.timeUnit) {
        groupby.push(vgField(groupByField, {binSuffix: 'end'}));
      }
    }
  }

  const strokeProperties = [
    'stroke',
    'strokeWidth',
    'strokeJoin',
    'strokeCap',
    'strokeDash',
    'strokeDashOffset',
    'strokeMiterLimit',
    'strokeOpacity'
  ] as const;

  // Generate stroke properties for the group
  groupUpdate = strokeProperties.reduce((encode, prop) => {
    if (mark.encode.update[prop]) {
      return {...encode, [prop]: mark.encode.update[prop]};
    } else {
      const configValue = getMarkConfig(prop, model.markDef, model.config);
      if (configValue !== undefined) {
        return {...encode, [prop]: signalOrValueRef(configValue)};
      } else {
        return encode;
      }
    }
  }, groupUpdate);

  // Apply strokeForeground and strokeOffset if stroke is used
  if (groupUpdate.stroke) {
    groupUpdate.strokeForeground = {value: true};
    groupUpdate.strokeOffset = {value: 0};
  }

  return [
    {
      type: 'group',
      from: {
        facet: {
          data: model.requestDataName(DataSourceType.Main),
          name: STACK_GROUP_PREFIX + model.requestDataName(DataSourceType.Main),
          groupby,
          aggregate: {
            fields: [
              stackField({suffix: 'start'}),
              stackField({suffix: 'start'}),
              stackField({suffix: 'end'}),
              stackField({suffix: 'end'})
            ],
            ops: ['min', 'max', 'min', 'max']
          }
        }
      },
      encode: {
        update: groupUpdate
      },
      marks: [
        {
          type: 'group',
          encode: {update: innerGroupUpdate},
          marks: [mark]
        }
      ]
    }
  ];
}

export function getSort(model: UnitModel): VgCompare {
  const {encoding, stack, mark, markDef, config} = model;
  const order = encoding.order;
  if (
    (!isArray(order) && isValueDef(order) && isNullOrFalse(order.value)) ||
    (!order && isNullOrFalse(getMarkPropOrConfig('order', markDef, config)))
  ) {
    return undefined;
  } else if ((isArray(order) || isFieldDef(order)) && !stack) {
    // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
    return sortParams(order, {expr: 'datum'});
  } else if (isPathMark(mark)) {
    // For both line and area, we sort values based on dimension by default
    const dimensionChannel = markDef.orient === 'horizontal' ? 'y' : 'x';
    const dimensionChannelDef = encoding[dimensionChannel];
    if (isFieldDef(dimensionChannelDef)) {
      const s = dimensionChannelDef.sort;

      if (isArray(s)) {
        return {
          field: vgField(dimensionChannelDef, {prefix: dimensionChannel, suffix: 'sort_index', expr: 'datum'})
        };
      } else if (isSortField(s)) {
        return {
          field: vgField(
            {
              // FIXME: this op might not already exist?
              // FIXME: what if dimensionChannel (x or y) contains custom domain?
              aggregate: isAggregate(model.encoding) ? s.op : undefined,
              field: s.field
            },
            {expr: 'datum'}
          )
        };
      } else if (isSortByEncoding(s)) {
        const fieldDefToSort = model.fieldDef(s.encoding);
        return {
          field: vgField(fieldDefToSort, {expr: 'datum'}),
          order: s.order
        };
      } else if (s === null) {
        return undefined;
      } else {
        return {
          field: vgField(dimensionChannelDef, {
            // For stack with imputation, we only have bin_mid
            binSuffix: model.stack?.impute ? 'mid' : undefined,
            expr: 'datum'
          })
        };
      }
    }
    return undefined;
  }
  return undefined;
}

function getMarkGroup(model: UnitModel, opt: {fromPrefix: string} = {fromPrefix: ''}) {
  const {mark, markDef, encoding, config} = model;

  const clip = getFirstDefined(markDef.clip, scaleClip(model), projectionClip(model));
  const style = getStyles(markDef);
  const key = encoding.key;
  const sort = getSort(model);
  const interactive = interactiveFlag(model);
  const aria = getMarkPropOrConfig('aria', markDef, config);

  const postEncodingTransform = markCompiler[mark].postEncodingTransform
    ? markCompiler[mark].postEncodingTransform(model)
    : null;

  return [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip ? {clip: true} : {}),
      ...(style ? {style} : {}),
      ...(key ? {key: key.field} : {}),
      ...(sort ? {sort} : {}),
      ...(interactive ? interactive : {}),
      ...(aria === false ? {aria} : {}),
      from: {data: opt.fromPrefix + model.requestDataName(DataSourceType.Main)},
      encode: {
        update: markCompiler[mark].encodeEntry(model)
      },
      ...(postEncodingTransform
        ? {
            transform: postEncodingTransform
          }
        : {})
    }
  ];
}

/**
 * If scales are bound to interval selections, we want to automatically clip
 * marks to account for panning/zooming interactions. We identify bound scales
 * by the selectionExtent property, which gets added during scale parsing.
 */
function scaleClip(model: UnitModel) {
  const xScale = model.getScaleComponent('x');
  const yScale = model.getScaleComponent('y');
  return xScale?.get('selectionExtent') || yScale?.get('selectionExtent') ? true : undefined;
}

/**
 * If we use a custom projection with auto-fitting to the geodata extent,
 * we need to clip to ensure the chart size doesn't explode.
 */
function projectionClip(model: UnitModel) {
  const projection = model.component.projection;
  return projection && !projection.isFit ? true : undefined;
}

/**
 * Only output interactive flags if we have selections defined somewhere in our model hierarchy.
 */
function interactiveFlag(model: UnitModel) {
  if (!model.component.selection) return null;
  const unitCount = keys(model.component.selection).length;
  let parentCount = unitCount;
  let parent = model.parent;
  while (parent && parentCount === 0) {
    parentCount = keys(parent.component.selection).length;
    parent = parent.parent;
  }
  return parentCount
    ? {
        interactive: unitCount > 0 || !!model.encoding.tooltip
      }
    : null;
}
