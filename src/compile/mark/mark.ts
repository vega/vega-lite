import {NONSPATIAL_CHANNELS, Channel} from '../../channel';
import {AREA, LINE} from '../../mark';
import {contains, without} from '../../util';

import {MarkCompiler} from './base';
import {area} from './area';
import {bar} from './bar';
import {line} from './line';
import {point, circle, square} from './point';
import {rect} from './rect';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';

import {FacetModel} from '../facet';
import {UnitModel} from '../unit';

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

// FIXME: maybe this should not be here.  Need re-think and refactor, esp. after having all composition in.
function dataFrom(model: UnitModel): string {
  const parent = model.parent;
  if (parent && parent.isFacet()) {
    return (parent as FacetModel).facetedTable();
  }
  if (model.stack) {
    return model.dataName('stacked');
  }
  return model.dataTable();
}

const FACETED_PATH_PREFIX = 'faceted-path-';

function parsePathMark(model: UnitModel) {
  const mark = model.mark();
  // FIXME: replace this with more general case for composition
  const details = detailFields(model);

  let pathMarks: any = [
    {
      name: model.getName('marks'),
      type: markCompiler[mark].vgMark,
      // If has subfacet for line/area group, need to use faceted data from below.
      // FIXME: support sorting path order (in connected scatterplot)
      from: {data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + dataFrom(model)},
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
          name: FACETED_PATH_PREFIX + dataFrom(model),
          data: dataFrom(model),
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

  const role = markCompiler[mark].role;

  let marks: any[] = []; // TODO: vgMarks

  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  marks.push({
    name: model.getName('marks'),
    type: markCompiler[mark].vgMark,
    ...(role? {role} : {}),
    from: {data: dataFrom(model)},
    encode: {update: markCompiler[mark].encodeEntry(model)}
  });

  return marks;
}

const NONSPATIAL_CHANNELS_EXCEPT_ORDER = without(NONSPATIAL_CHANNELS, ['order'] as Channel[]);

/**
 * Returns list of detail (group-by) fields
 * that the model's spec contains.
 */
function detailFields(model: UnitModel): string[] {
  return NONSPATIAL_CHANNELS_EXCEPT_ORDER.reduce(function(details, channel) {
    if (model.channelHasField(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}
