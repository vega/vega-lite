import {X, Y, COLOR, TEXT, SHAPE, OPACITY, DETAIL} from '../../channel';
import {AREA, LINE, TEXT as TEXTMARK} from '../../mark';
import {contains} from '../../util';

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

const markCompiler = {
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
  const parent = model.parent();
  if (parent && parent.isFacet()) {
    return (parent as FacetModel).facetedTable();
  }
  if (model.stack()) {
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
      name: model.name('marks'),
      type: markCompiler[mark].markType(),
      // If has subfacet for line/area group, need to use faceted data from below.
      // FIXME: support sorting path order (in connected scatterplot)
      from: {data: (details.length > 0 ? FACETED_PATH_PREFIX : '') + dataFrom(model)},
      encode: { update: markCompiler[mark].properties(model) }
    }
  ];

  if (details.length > 0) { // have level of details - need to facet line into subgroups
    // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

    return [{
      name: model.name('pathgroup'),
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
          width: { field: { group: 'width' } },
          height: { field: { group: 'height' } }
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

  let marks: any[] = []; // TODO: vgMarks
  if (mark === TEXTMARK &&
    model.has(COLOR) &&
    model.config().text.applyColorToBackground && !model.has(X) && !model.has(Y)
  ) {
    // add background to 'text' marks if has color
    marks.push({
      name: model.name('background'),
      type: 'rect',
      from: {data: dataFrom(model)},
      encode: { update: text.background(model) }
    });
  }

  // TODO: for non-stacked plot, map order to zindex. (Maybe rename order for layer to zindex?)

  marks.push({
    name: model.name('marks'),
    type: markCompiler[mark].markType(),
    from: {data: dataFrom(model)},
    encode: { update: markCompiler[mark].properties(model)}
  });

  return marks;
}

/**
 * Returns list of detail fields (for 'color', 'shape', or 'detail' channels)
 * that the model's spec contains.
 */
function detailFields(model: UnitModel): string[] {
  // FIXME This is probably not a comprehensive list of detail fields.
  return [COLOR, DETAIL, OPACITY, SHAPE].reduce(function(details, channel) {
    if (model.has(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}
