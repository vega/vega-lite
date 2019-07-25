import {isArray} from 'vega-util';
import {isFieldDef, isValueDef, vgField} from '../../channeldef';
import {MAIN} from '../../data';
import {isAggregate, pathGroupingFields} from '../../encoding';
import {AREA, isPathMark, LINE, Mark, TRAIL} from '../../mark';
import {isSortField} from '../../sort';
import {contains, getFirstDefined, isNullOrFalse} from '../../util';
import {VgCompare} from '../../vega.schema';
import {getMarkConfig, getStyles, sortParams} from '../common';
import {UnitModel} from '../unit';
import {area} from './area';
import {bar} from './bar';
import {MarkCompiler} from './base';
import {geoshape} from './geoshape';
import {line, trail} from './line';
import {circle, point, square} from './point';
import {rect} from './rect';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';

const markCompiler: {[m in Mark]: MarkCompiler} = {
  area,
  bar,
  circle,
  geoshape,
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
    return parsePathMark(model);
  } else {
    return getMarkGroups(model);
  }
}

const FACETED_PATH_PREFIX = 'faceted_path_';

function parsePathMark(model: UnitModel) {
  const details = pathGroupingFields(model.mark, model.encoding);

  const pathMarks = getMarkGroups(model, {
    // If has subfacet for line/area group, need to use faceted data from below.
    fromPrefix: details.length > 0 ? FACETED_PATH_PREFIX : ''
  });

  if (details.length > 0) {
    // have level of details - need to facet line into subgroups
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

    return [
      {
        name: model.getName('pathgroup'),
        type: 'group',
        from: {
          facet: {
            name: FACETED_PATH_PREFIX + model.requestDataName(MAIN),
            data: model.requestDataName(MAIN),
            groupby: details
          }
        },
        encode: {
          update: {
            width: {field: {group: 'width'}},
            height: {field: {group: 'height'}}
          }
        },
        marks: pathMarks
      }
    ];
  } else {
    return pathMarks;
  }
}

export function getSort(model: UnitModel): VgCompare {
  const {encoding, stack, mark, markDef, config} = model;
  const order = encoding.order;
  if (
    (!isArray(order) && isValueDef(order) && isNullOrFalse(order.value)) ||
    ((!order && isNullOrFalse(markDef.order)) || isNullOrFalse(getMarkConfig('order', markDef, config)))
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
      } else {
        return {
          field: vgField(dimensionChannelDef, {
            // For stack with imputation, we only have bin_mid
            binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
            expr: 'datum'
          })
        };
      }
    }
    return undefined;
  }
  return undefined;
}

function getMarkGroups(
  model: UnitModel,
  opt: {
    fromPrefix: string;
  } = {fromPrefix: ''}
) {
  const mark = model.mark;

  const clip = getFirstDefined(model.markDef.clip, scaleClip(model), projectionClip(model));
  const style = getStyles(model.markDef);
  const key = model.encoding.key;
  const sort = getSort(model);

  const postEncodingTransform = markCompiler[mark].postEncodingTransform
    ? markCompiler[mark].postEncodingTransform(model)
    : null;

  return [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip ? {clip: true} : {}),
      ...(style ? {style} : {}),
      ...(key ? {key: {field: key.field}} : {}),
      ...(sort ? {sort} : {}),
      from: {data: opt.fromPrefix + model.requestDataName(MAIN)},
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
 * by the domainRaw property, which gets added during scale parsing.
 */
function scaleClip(model: UnitModel) {
  const xScale = model.getScaleComponent('x');
  const yScale = model.getScaleComponent('y');
  return (xScale && xScale.get('domainRaw')) || (yScale && yScale.get('domainRaw')) ? true : undefined;
}

/**
 * If we use a custom projection with auto-fitting to the geodata extent,
 * we need to clip to ensure the chart size doesn't explode.
 */
function projectionClip(model: UnitModel) {
  const projection = model.component.projection;
  return projection && !projection.isFit ? true : undefined;
}
