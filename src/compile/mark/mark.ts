import {isArray} from 'vega-util';
import {LEVEL_OF_DETAIL_CHANNELS} from '../../channel';
import {X, Y} from '../../channel';
import {MAIN} from '../../data';
import {field, getFieldDef} from '../../fielddef';
import {AREA, LINE} from '../../mark';
import {isSelectionDomain} from '../../scale';
import {contains} from '../../util';
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
    normalizeMarkDef(model.markDef, model.encoding, model.scales, model.config);
  } else {
    for (const child of model.children) {
      parseMarkDef(child);
    }
  }
}

export function parseMark(model: UnitModel): any[] {
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

  const role = model.markDef.role || markCompiler[mark].defaultRole;

  const pathMarks: any = [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip(model)),
      ...(role? {role} : {}),
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

function parseNonPathMark(model: UnitModel) {
  const mark = model.mark();

  const role = model.markDef.role || markCompiler[mark].defaultRole;

  const marks: any[] = []; // TODO: vgMarks

  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  marks.push({
    name: model.getName('marks'),
    type: markCompiler[mark].vgMark,
    ...(clip(model)),
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

function clip(model: UnitModel) {
  const xScaleDomain = model.scaleDomain(X);
  const yScaleDomain = model.scaleDomain(Y);
  return (xScaleDomain && isSelectionDomain(xScaleDomain)) ||
    (yScaleDomain && isSelectionDomain(yScaleDomain)) ? {clip: true} : {};
}
