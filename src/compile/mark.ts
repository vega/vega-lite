import {Model} from './Model';
import {X, Y, COLOR, TEXT, SHAPE, PATH, DETAIL, ROW, COLUMN, LABEL} from '../channel';
import {AREA, LINE, TEXT as TEXTMARK} from '../mark';
import {imputeTransform, stackTransform} from './stack';
import {extend, isArray} from '../util';
import {area} from './mark-area';
import {bar} from './mark-bar';
import {line} from './mark-line';
import {point, circle, square} from './mark-point';
import {text} from './mark-text';
import {tick} from './mark-tick';

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
  const mark = model.mark();
  const name = model.spec().name;
  const isFaceted = model.has(ROW) || model.has(COLUMN);
  const dataFrom = {data: model.dataTable()};
  const markConfig = model.config().mark;
  const sortBy = markConfig.sortBy;

  if (mark === LINE || mark === AREA) { // TODO: extract this into compilePathMark
    const details = detailFields(model);

    const pathOrder = getPathOrder(model);

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
          {transform: [{ type: 'sort', by: pathOrder}]}
        ),
        properties: { update: markCompiler[mark].properties(model) }
      }
    )];

    if (details.length > 0) { // have level of details - need to facet line into subgroups
      const facetTransform = { type: 'facet', groupby: details };
      const transform: any[] = [].concat(
        (sortBy ? [{type: 'sort', by: sortBy}] : []),
        mark === AREA && model.stack() ?
          // For stacked area, we need to impute missing tuples and stack values
          [imputeTransform(model), stackTransform(model), facetTransform] :
          [facetTransform]
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
  } else { // other mark type
    // TODO: extract this into compileNonPathMark

    let marks = []; // TODO: vgMarks
    if (mark === TEXTMARK &&
      model.has(COLOR) &&
      model.config().mark.applyColorToBackground && !model.has(X) && !model.has(Y)
    ) {
      // add background to 'text' marks if has color
      marks.push(extend(
        name ? { name: name + '-background' } : {},
        {type: 'rect'},
        // If has facet, `from.data` will be added in the cell group.
        // Otherwise, add it here.
        isFaceted ? {} : {from: dataFrom},
        // Properties
        {properties: { update: text.background(model) } }
      ));
    }

    marks.push(extend(
      name ? { name: name + '-marks' } : {},
      { type: markCompiler[mark].markType() },
      // Add `from` if needed
      (!isFaceted || model.stack() || sortBy) ? {
        from: extend(
          // If faceted, `from.data` will be added in the cell group.
          // Otherwise, add it here
          isFaceted ? {} : dataFrom,
          // Stacked Chart need additional transform
          model.stack() || sortBy ? { transform: [].concat(
              (model.stack() ? [stackTransform(model)] : []),
              sortBy ? [{type:'sort', by: sortBy}] : []
          )} : {}
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
}

/**
 * Return path order for sort transform's by property
 */
function getPathOrder(model: Model) {
  if (model.mark() === LINE && model.has(PATH)) {
    // For only line, sort by the path field if it is specified.

    if (isArray(model.spec().encoding[PATH])) { // multiple PATH fields
      return model.spec().encoding[PATH].map(function(fieldDef){
        // add - prefix for descending
        return (fieldDef.sort === 'descending' ? '-' : '') + fieldDef.field;
      });
    } else { // Single PATH field
      const fieldDef = model.fieldDef(PATH);
      // add - prefix for descending
      return (fieldDef.sort === 'descending' ? '-' : '') + fieldDef.field;
    }

  } else {
    // For both line and area, we sort values based on dimension by default
    return '-' + model.field(model.config().mark.orient === 'horizontal' ? Y : X);
  }
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
