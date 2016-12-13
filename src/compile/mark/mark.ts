import {X, Y, COLOR, TEXT, SHAPE, PATH, ORDER, OPACITY, DETAIL} from '../../channel';
import {isAggregate} from '../../encoding';
import {OrderChannelDef, field} from '../../fielddef';
import {AREA, LINE, TEXT as TEXTMARK} from '../../mark';
import {isSortField} from '../../sort';
import {contains, extend, isArray} from '../../util';

import {area} from './area';
import {bar} from './bar';
import {sortField} from '../common';
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

function parsePathMark(model: UnitModel) { // TODO: extract this into compilePathMark
  const mark = model.mark();
  // TODO: replace this with more general case for composition
  const details = detailFields(model);

  let pathMarks: any = [
    {
      name: model.name('marks'),
      type: markCompiler[mark].markType(),
      from: extend(
        // If has facet, `from.data` will be added in the cell group.
        // If has subfacet for line/area group, `from.data` will be added in the outer subfacet group below.
        // If has no subfacet, add from.data.
        details.length > 0 ? {} : {data: dataFrom(model)},

        // FIXME(@domoritz): this has to be extracted as inline data source before doing data transform
        // sort transform
        {transform: [{ type: 'sort', by: sortPathBy(model)}]}
      ),
      encode: { update: markCompiler[mark].properties(model) }
    }
  ];

  if (details.length > 0) { // have level of details - need to facet line into subgroups
    // FIXME: replace this with facet directive
    const facetTransform = { type: 'facet', groupby: details };
    const transform: any[] = model.stack() ?
      // (Mark layer order does not matter for stacked charts)
      [facetTransform] :
      // For non-stacked path (line/area), we need to facet and possibly sort
      [].concat(
        facetTransform,
        // if model has `order`, then sort mark's layer order by `order` field(s)
        model.has(ORDER) ? [{type:'sort', by: sortBy(model)}] : []
      );

    return [{
      name: model.name('pathgroup'),
      type: 'group',
      from: {
        data: dataFrom(model),
        transform: transform
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

  marks.push({
    name: model.name('marks'),
    type: markCompiler[mark].markType(),
    from: extend(
      {data: dataFrom(model)},
      !model.stack() && model.has(ORDER) ?
        // if non-stacked, detail field determines the layer order of each mark
        { transform: [{type:'sort', by: sortBy(model)}] } :
        {}
    ),
    encode: { update: markCompiler[mark].properties(model)}
  });

  return marks;
}

function sortBy(model: UnitModel): string | string[] {
  if (model.has(ORDER)) {
    let channelDef = model.encoding().order;
    if (channelDef instanceof Array) {
      // sort by multiple fields
      return channelDef.map(sortField);
    } else {
      // sort by one field
      return sortField(channelDef as OrderChannelDef); // have to add OrderChannelDef to make tsify not complaining
    }
  }
  return null; // use default order
}

/**
 * Return path order for sort transform's by property
 */
function sortPathBy(model: UnitModel): string | string[] {
  if (model.mark() === LINE && model.has(PATH)) {
    // For only line, sort by the path field if it is specified.
    const channelDef = model.encoding().path;
    if (channelDef instanceof Array) {
      // sort by multiple fields
      return channelDef.map(sortField);
    } else {
      // sort by one field
      return sortField(channelDef as OrderChannelDef); // have to add OrderChannelDef to make tsify not complaining
    }
  } else {
    // For both line and area, we sort values based on dimension by default
    const dimensionChannel = model.config().mark.orient === 'horizontal' ? Y : X;
    const sort = model.sort(dimensionChannel);
    if (isSortField(sort)) {
      return '-' + field({
        aggregate: isAggregate(model.encoding()) ? sort.op : undefined,
        field: sort.field
      });
    } else {
      return '-' + model.field(dimensionChannel, {binSuffix: 'start'});
    }
  }
}

/**
 * Returns list of detail fields (for 'color', 'shape', or 'detail' channels)
 * that the model's spec contains.
 */
function detailFields(model: UnitModel): string[] {
  return [COLOR, DETAIL, OPACITY, SHAPE].reduce(function(details, channel) {
    if (model.has(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}
