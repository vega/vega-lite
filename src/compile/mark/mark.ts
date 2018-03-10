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
    return getMarkGroups(model);
  }
}

const FACETED_PATH_PREFIX = 'faceted_path_';

function parsePathMark(model: UnitModel) {
  const details = pathGroupingFields(model.encoding);

  const pathMarks = getMarkGroups(model, {
    // If has subfacet for line/area group, need to use faceted data from below.
    fromPrefix: (details.length > 0 ? FACETED_PATH_PREFIX : '')
  });

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

export function getSort(model: UnitModel) {
  if (model.channelHasField('order') && !model.stack) {
    // Sort by the order field if it is specified and the field is not stacked. (For stacked field, order specify stack order.)
    return sortParams(model.encoding.order, {expr: 'datum'});
  } else if (contains(['line', 'area'], model.mark())) {
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
  return undefined;
}

function getMarkGroups(model: UnitModel, opt: {
  fromPrefix: string
} = {fromPrefix: ''}) {
  const mark = model.mark();

  const clip = model.markDef.clip !== undefined ?
    !!model.markDef.clip : scaleClip(model);
  const style = getStyles(model.markDef);
  const key = model.encoding.key;
  const sort = getSort(model);

  const postEncodingTransform = markCompiler[mark].postEncodingTransform ? markCompiler[mark].postEncodingTransform(model) : null;

  return [{
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
    ...(postEncodingTransform ? {
      transform: postEncodingTransform
    } : {})
  }];

}

/**
 * Returns list of path grouping fields
 * that the model's spec contains.
 */
export function pathGroupingFields(encoding: Encoding<string>): string[] {
  return keys(encoding).reduce((details, channel) => {
    switch (channel) {
      // x, y, x2, y2, lat, long, lat1, long2, order, tooltip, href, cursor should not cause lines to group
      case 'x':
      case 'y':
      case 'order':
      case 'tooltip':
      case 'href':
      case 'x2':
      case 'y2':

      case 'latitude':
      case 'longitude':
      case 'latitude2':
      case 'longitude2':
      // TODO: case 'cursor':

      // text, shape, shouldn't be a part of line/area
      case 'text':
      case 'shape':
        return details;

      case 'detail':
      case 'key':
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
      case 'fill':
      case 'stroke':
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
