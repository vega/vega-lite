import {isArray} from 'vega-util';
import {LEVEL_OF_DETAIL_CHANNELS} from '../../channel';
import {X, Y} from '../../channel';
import {MAIN} from '../../data';
import {isAggregate} from '../../encoding';
import {field, getFieldDef} from '../../fielddef';
import {AREA, LINE} from '../../mark';
import {isSelectionDomain} from '../../scale';
import {isSortField} from '../../sort';
import {contains} from '../../util';
import {sortParams} from '../common';
import {FacetModel} from '../facet';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {area} from './area';
import {bar} from './bar';
import {MarkCompiler} from './base';
import {normalizeMarkDef} from './init';
import {line} from './line';
import {circle, point, square} from './point';
import {rect} from './rect';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';


const markCompiler: {[type: string]: MarkCompiler} = {
  area: area,
  bar: bar,
  line: line,
  point: point,
  text: text,
  tick: tick,
  rect: rect,
  rule: rule,
  circle: circle,
  square: square
};

export function parseMarkDef(model: Model) {
  if (model instanceof UnitModel) {
    normalizeMarkDef(model.markDef, model.encoding, model.component.scales, model.config);
  } else {
    for (const child of model.children) {
      parseMarkDef(child);
    }
  }
}

export function parseMarkGroup(model: UnitModel): any[] {
  if (contains([LINE, AREA], model.mark())) {
    return parsePathMark(model);
  } else {
    return parseNonPathMark(model);
  }
}

const FACETED_PATH_PREFIX = 'faceted_path_';

function parsePathMark(model: UnitModel) {
  const mark = model.mark();
  // FIXME: replace this with more general case for composition
  const details = detailFields(model);

  const clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
  const role = model.markDef.role || markCompiler[mark].defaultRole;
  const sort = getPathSort(model);

  const pathMarks: any = [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip ? {clip: true} : {}),
      ...(role? {role} : {}),
      ...(sort? {sort} : {}),
      // If has subfacet for line/area group, need to use faceted data from below.
      // FIXME: support sorting path order (in connected scatterplot)
      from: {data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + model.requestDataName(MAIN)},
      encode: {update: markCompiler[mark].encodeEntry(model)}
    }
  ];

  if (details.length > 0) { // have level of details - need to facet line into subgroups
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

    return [{
      name: model.getName('pathgroup'),
      type: 'group',
      from: {
        facet: {
          name: FACETED_PATH_PREFIX + model.requestDataName(MAIN),
          data: model.requestDataName(MAIN),
          groupby: details,
        }
      },
      encode: {
        update: {
          width: {field: {group: 'width'}},
          height: {field: {group: 'height'}}
        }
      },
      marks: pathMarks
    }];
  } else {
    return pathMarks;
  }
}

export function getPathSort(model: UnitModel) {
  if (model.mark() === 'line' && model.channelHasField('order')) {
    // For only line, sort by the order field if it is specified.
    return sortParams(model.encoding.order, {expr: 'datum'});
  } else {
    // For both line and area, we sort values based on dimension by default
    const dimensionChannel: 'x' | 'y' = model.markDef.orient === 'horizontal' ? 'y' : 'x';
    const s = model.sort(dimensionChannel);
    const sortField = isSortField(s) ?
      field({
        // FIXME: this op might not already exist?
        // FIXME: what if dimensionChannel (x or y) contains custom domain?
        aggregate: isAggregate(model.encoding) ? s.op : undefined,
        field: s.field
      }, {expr: 'datum'}) :
      model.field(dimensionChannel, {
        // For stack with imputation, we only have bin_mid
        binSuffix: model.stack && model.stack.impute ? 'mid' : 'start',
        expr: 'datum'
      });

    return {
      field: sortField,
      order: 'descending'
    };
  }
}

function parseNonPathMark(model: UnitModel) {
  const mark = model.mark();

  const role = model.markDef.role || markCompiler[mark].defaultRole;
  const clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);

  const marks: any[] = []; // TODO: vgMarks

  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  marks.push({
    name: model.getName('marks'),
    type: markCompiler[mark].vgMark,
    ...(clip ? {clip: true} : {}),
    ...(role? {role} : {}),
    from: {data: model.requestDataName(MAIN)},
    encode: {update: markCompiler[mark].encodeEntry(model)}
  });

  return marks;
}

/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model: UnitModel): string[] {
  return LEVEL_OF_DETAIL_CHANNELS.reduce(function(details, channel) {
    const {encoding} = model;
    if (channel === 'detail' || channel === 'order') {
      const channelDef = encoding[channel];
      if (channelDef) {
        (isArray(channelDef) ? channelDef : [channelDef]).forEach((fieldDef) => {
          if (!fieldDef.aggregate) {
            details.push(field(fieldDef, {binSuffix: 'start'}));
          }
        });
      }
    } else {
      const fieldDef = getFieldDef<string>(encoding[channel]);
      if (fieldDef && !fieldDef.aggregate) {
        details.push(field(fieldDef, {binSuffix: 'start'}));
      }
    }
    return details;
  }, []);
}

/**
 * If scales are bound to interval selections, we want to automatically clip
 * marks to account for panning/zooming interactions. We identify bound scales
 * by the domainRaw property, which gets added during scale parsing.
 */
function scaleClip(model: UnitModel) {
  const xScale = model.getScaleComponent('x');
  const yScale = model.getScaleComponent('y');
  return (xScale && xScale.get('domainRaw')) ||
    (yScale && yScale.get('domainRaw')) ? true : false;
}
