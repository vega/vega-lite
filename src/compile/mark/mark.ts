import {LEVEL_OF_DETAIL_CHANNELS} from '../../channel';
import {AREA, LINE} from '../../mark';
import {contains} from '../../util';

import {area} from './area';
import {bar} from './bar';
import {MarkCompiler} from './base';
import {line} from './line';
import {circle, point, square} from './point';
import {rect} from './rect';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';

import {MAIN} from '../../data';
import {FacetModel} from '../facet';
import {UnitModel} from '../unit';

import {X, Y} from '../../channel';
import {isSelectionDomain} from '../../scale';

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

  const pathMarks: any = [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      ...(clip(model)),
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
    if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}

function clip(model: UnitModel) {
  const xscale = model.scale(X), yscale = model.scale(Y);
  return (xscale && isSelectionDomain(xscale.domain)) ||
    (yscale && isSelectionDomain(yscale.domain)) ? {clip: true} : {};
}
