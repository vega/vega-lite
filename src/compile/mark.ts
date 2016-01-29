import {Model} from './Model';
import {X, Y, COLOR, TEXT, SHAPE, PATH, DETAIL, ROW, COLUMN, LABEL} from '../channel';
import {field} from '../fielddef';
import {AREA, LINE, TEXT as TEXTMARK} from '../mark';
import {imputeTransform, stackTransform} from './stack';
import {contains, extend, isArray} from '../util';
import {area} from './mark-area';
import {bar} from './mark-bar';
import {line} from './mark-line';
import {point, circle, square} from './mark-point';
import {text} from './mark-text';
import {tick} from './mark-tick';

import {FieldDef} from '../schema/fielddef.schema';

const markCompiler = {
  area: area,
  bar: bar,
  line: line,
  point: point,
  text: text,
  tick: tick,
  circle: circle,
  square: square
};

export function compileMark(model: Model): any[] {
  if (contains([LINE, AREA], model.mark())) {
    return compilePathMark(model);
  } else {
    return compileNonPathMark(model);
  }
}

function compilePathMark(model: Model) { // TODO: extract this into compilePathMark
  const mark = model.mark();
  const name = model.spec().name;
  const isFaceted = model.has(ROW) || model.has(COLUMN);
  const dataFrom = {data: model.dataTable()};
  const details = detailFields(model);

  let pathMarks: any = [extend(
    name ? { name: name + '-marks' } : {},
    {
      type: markCompiler[mark].markType(),
      from: extend(
        // If has facet, `from.data` will be added in the cell group.
        // If has subfacet for line/area group, `from.data` will be added in the outer subfacet group below.
        // If has no subfacet, add from.data.
        isFaceted || details.length > 0 ? {} : dataFrom,

        // sort transform
        {transform: [{ type: 'sort', by: sortPathBy(model)}]}
      ),
      properties: { update: markCompiler[mark].properties(model) }
    }
  )];

  if (details.length > 0) { // have level of details - need to facet line into subgroups
    const facetTransform = { type: 'facet', groupby: details };
    const transform: any[] = mark === AREA && model.stack() ?
      // For stacked area, we need to impute missing tuples and stack values
      // (Mark layer order does not matter for stacked charts)
      [imputeTransform(model), stackTransform(model), facetTransform] :
      // For non-stacked path (line/area), we need to facet and possibly sort
      [].concat(
        facetTransform,
        // if model has detail, then sort mark's layer order by detail field(s)
        model.has(DETAIL) ? [{type:'sort', by: sortBy(model)}] : []
      );

    return [{
      name: (name ? name + '-' : '') + mark + '-facet',
      type: 'group',
      from: extend(
        // If has facet, `from.data` will be added in the cell group.
        // Otherwise, add it here.
        isFaceted ? {} : dataFrom,
        {transform: transform}
      ),
      properties: {
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

function compileNonPathMark(model: Model) {
  const mark = model.mark();
  const name = model.spec().name;
  const isFaceted = model.has(ROW) || model.has(COLUMN);
  const dataFrom = {data: model.dataTable()};

  let marks = []; // TODO: vgMarks
  if (mark === TEXTMARK &&
    model.has(COLOR) &&
    model.config().mark.applyColorToBackground && !model.has(X) && !model.has(Y)
  ) {
    // add background to 'text' marks if has color
    marks.push(extend(
      name ? { name: name + '-background' } : {},
      { type: 'rect' },
      // If has facet, `from.data` will be added in the cell group.
      // Otherwise, add it here.
      isFaceted ? {} : {from: dataFrom},
      // Properties
      { properties: { update: text.background(model) } }
    ));
  }

  marks.push(extend(
    name ? { name: name + '-marks' } : {},
    { type: markCompiler[mark].markType() },
    // Add `from` if needed
    (!isFaceted || model.stack() || model.has(DETAIL)) ? {
      from: extend(
        // If faceted, `from.data` will be added in the cell group.
        // Otherwise, add it here
        isFaceted ? {} : dataFrom,
        // `from.transform`
        model.stack() ? // Stacked Chart need stack transform
          { transform: [stackTransform(model)] } :
        model.has(DETAIL) ?
          // if non-stacked, detail field determines the layer order of each mark
          { transform: [{type:'sort', by: sortBy(model)}] } :
          {}
      )
    } : {},
    // properties groups
    { properties: { update: markCompiler[mark].properties(model) } }
  ));

  if (model.has(LABEL) && markCompiler[mark].labels) {
    const labelProperties = markCompiler[mark].labels(model);

    // check if we have label method for current mark type.
    if (labelProperties !== undefined) { // If label is supported
      // add label group
      marks.push(extend(
        name ? { name: name + '-label' } : {},
        {type: 'text'},
        // If has facet, `from.data` will be added in the cell group.
        // Otherwise, add it here.
        isFaceted ? {} : {from: dataFrom},
        // Properties
        { properties: { update: labelProperties } }
      ));
    }
  }

  return marks;
}

function sortBy(model: Model) {
  if (model.has(DETAIL)) {
    var channelEncoding = model.spec().encoding[DETAIL];
    return isArray(channelEncoding) ?
      channelEncoding.map(sortField) : // sort by multiple fields
      sortField(channelEncoding);      // sort by one field
  }
  return null; // use default order
}

/**
 * Return path order for sort transform's by property
 */
function sortPathBy(model: Model) {
  if (model.mark() === LINE && model.has(PATH)) {
    // For only line, sort by the path field if it is specified.
    const channelEncoding = model.spec().encoding[PATH];
    return isArray(channelEncoding) ?
      channelEncoding.map(sortField) : // sort by multiple fields
      sortField(channelEncoding);
  } else {
    // For both line and area, we sort values based on dimension by default
    return '-' + model.field(model.config().mark.orient === 'horizontal' ? Y : X);
  }
}

/** Add "-" prefix for descending */
function sortField(fieldDef: FieldDef) {
  return (fieldDef.sort === 'descending' ? '-' : '') + field(fieldDef);
}

/**
 * Returns list of detail fields (for 'color', 'shape', or 'detail' channels)
 * that the model's spec contains.
 */
function detailFields(model: Model): string[] {
  return [COLOR, DETAIL, SHAPE].reduce(function(details, channel) {
    if (model.has(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}
