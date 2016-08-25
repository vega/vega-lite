import {X, Y, COLOR, TEXT, SHAPE, PATH, ORDER, OPACITY, DETAIL, STACK_GROUP_CHANNELS} from '../../channel';
import {Orient} from '../../config';
import {has, isAggregate} from '../../encoding';
import {OrderChannelDef, FieldDef, field} from '../../fielddef';
import {AREA, LINE, TEXT as TEXTMARK} from '../../mark';
import {ScaleType} from '../../scale';
import {isSortField} from '../../sort';
import {contains, extend, isArray} from '../../util';
import {VgStackTransform} from '../../vega.schema';

import {area} from './area';
import {bar} from './bar';
import {sortField} from '../common';
import {line} from './line';
import {point, circle, square} from './point';
import {rule} from './rule';
import {text} from './text';
import {tick} from './tick';
import {UnitModel} from '../unit';

const markCompiler = {
  area: area,
  bar: bar,
  line: line,
  point: point,
  text: text,
  tick: tick,
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

function parsePathMark(model: UnitModel) { // TODO: extract this into compilePathMark
  const mark = model.mark();
  // TODO: replace this with more general case for composition
  const isFaceted = model.parent() && model.parent().isFacet();
  const dataFrom = {data: model.dataTable()};
  const details = detailFields(model);

  let pathMarks: any = [
    {
      name: model.name('marks'),
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
  ];

  if (details.length > 0) { // have level of details - need to facet line into subgroups
    const facetTransform = { type: 'facet', groupby: details };
    const transform: any[] = mark === AREA && model.stack() ?
      // For stacked area, we need to impute missing tuples and stack values
      // (Mark layer order does not matter for stacked charts)
      stackTransforms(model, true).concat(facetTransform) :
      // For non-stacked path (line/area), we need to facet and possibly sort
      [].concat(
        facetTransform,
        // if model has `order`, then sort mark's layer order by `order` field(s)
        model.has(ORDER) ? [{type:'sort', by: sortBy(model)}] : []
      );

    return [{
      name: model.name('pathgroup'),
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

function parseNonPathMark(model: UnitModel) {
  const mark = model.mark();
  const isFaceted = model.parent() && model.parent().isFacet();
  const dataFrom = {data: model.dataTable()};

  let marks = []; // TODO: vgMarks
  if (mark === TEXTMARK &&
    model.has(COLOR) &&
    model.config().mark.applyColorToBackground && !model.has(X) && !model.has(Y)
  ) {
    // add background to 'text' marks if has color
    marks.push(extend(
      {
        name: model.name('background'),
        type: 'rect'
      },
      // If has facet, `from.data` will be added in the cell group.
      // Otherwise, add it here.
      isFaceted ? {} : {from: dataFrom},
      // Properties
      { properties: { update: text.background(model) } }
    ));
  }

  marks.push(extend(
    {
      name: model.name('marks'),
      type: markCompiler[mark].markType()
    },
    // Add `from` if needed
    (!isFaceted || model.stack() || model.has(ORDER)) ? {
      from: extend(
        // If faceted, `from.data` will be added in the cell group.
        // Otherwise, add it here
        isFaceted ? {} : dataFrom,
        // `from.transform`
        model.stack() ? // Stacked Chart need stack transform
          { transform: stackTransforms(model, false) } :
        model.has(ORDER) ?
          // if non-stacked, detail field determines the layer order of each mark
          { transform: [{type:'sort', by: sortBy(model)}] } :
          {}
      )
    } : {},
    // properties groups
    { properties: { update: markCompiler[mark].properties(model) } }
  ));

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
    const dimensionChannel = model.config().mark.orient === Orient.HORIZONTAL ? Y : X;
    const sort = model.sort(dimensionChannel);
    if (isSortField(sort)) {
      return '-' + field({
        aggregate: isAggregate(model.encoding()) ? sort.op : undefined,
        field: sort.field
      });
    } else {
      return '-' + model.field(dimensionChannel, {binSuffix: 'mid'});
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


function stackTransforms(model: UnitModel, impute: boolean): any[] {
  const stackByFields = getStackByFields(model);
  if (impute) {
    return [imputeTransform(model, stackByFields), stackTransform(model, stackByFields)];
  }
  return [stackTransform(model, stackByFields)];
}


/** Compile stack-by field names from (from 'color' and 'detail') */
function getStackByFields(model: UnitModel) {
  const encoding = model.encoding();

  return STACK_GROUP_CHANNELS.reduce(function(fields, channel) {
    const channelEncoding = encoding[channel];
    if (has(encoding, channel)) {
      if (isArray(channelEncoding)) {
        channelEncoding.forEach(function(fieldDef) {
          fields.push(field(fieldDef));
        });
      } else {
        const fieldDef: FieldDef = channelEncoding;
        const scale = model.scale(channel);
        const _field = field(fieldDef, {
          binSuffix: scale && scale.type === ScaleType.ORDINAL ? 'range' : 'start'
        });
        if (!!_field) {
          fields.push(_field);
        }
      }
    }
    return fields;
  }, []);
}

// impute data for stacked area
function imputeTransform(model: UnitModel, stackFields: string[]) {
  const stack = model.stack();
  return {
    type: 'impute',
    field: model.field(stack.fieldChannel),
    groupby: stackFields,
    orderby: [model.field(stack.groupbyChannel, {binSuffix: 'mid'})],
    method: 'value',
    value: 0
  };
}

function stackTransform(model: UnitModel, stackFields: string[]) {
  const stack = model.stack();
  const encoding = model.encoding();
  const sortby = model.has(ORDER) ?
    (isArray(encoding[ORDER]) ? encoding[ORDER] : [encoding[ORDER]]).map(sortField) :
    // default = descending by stackFields
    stackFields.map(function(field) {
     return '-' + field;
    });

  const valName = model.field(stack.fieldChannel);

  // add stack transform to mark
  let transform: VgStackTransform = {
    type: 'stack',
    groupby: [model.field(stack.groupbyChannel, {binSuffix: 'mid'}) || 'undefined'],
    field: model.field(stack.fieldChannel),
    sortby: sortby,
    output: {
      start: valName + '_start',
      end: valName + '_end'
    }
  };

  if (stack.offset) {
    transform.offset = stack.offset;
  }
  return transform;
}
