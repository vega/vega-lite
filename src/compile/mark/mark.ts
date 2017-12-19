import {isArray} from 'vega-util';
import {MAIN} from '../../data';
import {Encoding, isAggregate} from '../../encoding';
import {getFieldDef, vgField} from '../../fielddef';
import {AREA, LINE} from '../../mark';
import {isSortField} from '../../sort';
import {contains, keys} from '../../util';
import {getStyles, sortParams} from '../common';
import {UnitModel} from '../unit';
import {area} from './area';
import {bar} from './bar';
import {MarkCompiler} from './base';
import {geoshape} from './geoshape';
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
  square: square,
  geoshape: geoshape
};


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
  const details = pathGroupingFields(model.encoding);

  const postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;

  const clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);
  const style = getStyles(model.markDef);
  const sort = getPathSort(model);

  const pathMarks: any = [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip ? {clip: true} : {}),
      ...(style? {style} : {}),
      ...(sort? {sort} : {}),
      // If has subfacet for line/area group, need to use faceted data from below.
      // FIXME: support sorting path order (in connected scatterplot)
      from: {data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + model.requestDataName(MAIN)},
      encode: {update: markCompiler[mark].encodeEntry(model)},
      ...postEncodingTransform ? {transform: postEncodingTransform} : {}
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
      vgField({
        // FIXME: this op might not already exist?
        // FIXME: what if dimensionChannel (x or y) contains custom domain?
        aggregate: isAggregate(model.encoding) ? s.op : undefined,
        field: s.field
      }, {expr: 'datum'}) :
      model.vgField(dimensionChannel, {
        // For stack with imputation, we only have bin_mid
        binSuffix: model.stack && model.stack.impute ? 'mid' : undefined,
        expr: 'datum'
      });

    return sortField ?
      {
        field: sortField,
        order: 'descending'
      } :
      undefined;
  }
}

function parseNonPathMark(model: UnitModel) {
  const mark = model.mark();

  const style = getStyles(model.markDef);
  const clip = model.markDef.clip !== undefined ? !!model.markDef.clip : scaleClip(model);

  const postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;

  const marks: any[] = []; // TODO: vgMarks

  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  marks.push({
    name: model.getName('marks'),
    type: markCompiler[mark].vgMark,
    ...(clip ? {clip: true} : {}),
    ...(style? {style} : {}),
    from: {data: model.requestDataName(MAIN)},
    encode: {update: markCompiler[mark].encodeEntry(model)},
    ...(postEncodingTransform ? {transform: postEncodingTransform} : {})
  });

  return marks;
}

/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export function pathGroupingFields(encoding: Encoding<string>): string[] {
  return keys(encoding).reduce((details, channel) => {
    switch (channel) {
      // x, y, x2, y2, order, tooltip, href, cursor should not cause lines to group
      case 'x':
      case 'y':
      case 'order':
      case 'tooltip':
      case 'href':
      case 'x2':
      case 'y2':
      // TODO: case 'cursor':

      // text, shape, shouldn't be a part of line/area
      case 'text':
      case 'shape':
        return details;

      case 'detail':
        const channelDef = encoding[channel];
        if (channelDef) {
          (isArray(channelDef) ? channelDef : [channelDef]).forEach((fieldDef) => {
            if (!fieldDef.aggregate) {
              details.push(vgField(fieldDef, {}));
            }
          });
        }
        return details;
      case 'color':
      case 'size':
      case 'opacity':
      // TODO strokeDashOffset:
        const fieldDef = getFieldDef<string>(encoding[channel]);
        if (fieldDef && !fieldDef.aggregate) {
          details.push(vgField(fieldDef, {}));
        }
        return details;
      default:
        throw new Error(`Bug: Channel ${channel} unimplemented for line mark`);
    }
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
