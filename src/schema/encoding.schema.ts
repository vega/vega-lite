import {mergeDeep} from './schemautil';
import {duplicate} from '../util';


import {axis} from './axis.schema';
import {FieldDef, fieldDef, facetField, onlyOrdinalField, typicalField} from './fielddef.schema';
import {legend} from './legend.schema';
import {sort} from './sort.schema';

export interface Encoding {
  x?: FieldDef;
  y?: FieldDef;
  row?: FieldDef;
  column?: FieldDef;
  color?: FieldDef;
  size?: FieldDef;
  shape?: FieldDef;
  path?: FieldDef | FieldDef[];
  detail?: FieldDef | FieldDef[];
  text?: FieldDef;
  label?: FieldDef;
}

var x = mergeDeep(duplicate(typicalField), {
  required: ['field', 'type'], // TODO: remove if possible
  properties: {
    scale: {// replacing default values for just these two axes
      properties: {
        padding: {default: 1},
        bandWidth: {default: 21}
      }
    },
    axis: axis,
    sort: sort
  }
});

var y = duplicate(x);

var row = mergeDeep(duplicate(facetField));
var column = mergeDeep(duplicate(facetField));

var size = mergeDeep(duplicate(typicalField), {
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'integer',
      default: undefined,
      minimum: 0,
      description: 'Size of marks. By default, this is 30 for point, square, and circle, and 10 for text.'
    }
  }
});

var color = mergeDeep(duplicate(typicalField), {
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'string',
      role: 'color',
      default: '#4682b4',
      description: 'Color to be used for marks.'
    },
    scale: {
      type: 'object',
      properties: {
        quantitativeRange: {
          type: 'array',
          default: ['#AFC6A3', '#09622A'], // tableau greens
          // default: ['#ccece6', '#00441b'], // BuGn.9 [2-8]
          description: 'Color range to encode quantitative variables.',
          minItems: 2,
          maxItems: 2,
          items: {
            type: 'string',
            role: 'color'
          }
        }
      }
    }
  }
});

var shape = mergeDeep(duplicate(onlyOrdinalField), {
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle',
      description: 'Mark to be used.'
    }
  }
});

var path = {
  default: undefined,
  oneOf: [duplicate(fieldDef), {
    type: 'array',
    items: duplicate(fieldDef)
  }]
};

var detail = {
  default: undefined,
  oneOf: [duplicate(fieldDef), {
    type: 'array',
    items: duplicate(fieldDef)
  }]
};

// we only put aggregated measure in pivot table
var text = mergeDeep(duplicate(typicalField), {
  properties: {
    sort: sort,
    value: {
      type: 'string',
      default: 'Abc'
    }
  }
});

var label = mergeDeep(duplicate(typicalField), {
  properies: {
    sort: sort
  }
});

export var encoding = {
  type: 'object',
  properties: {
    x: x,
    y: y,
    row: row,
    column: column,
    size: size,
    color: color,
    shape: shape,
    path: path,
    text: text,
    detail: detail,
    label: label
  }
};
