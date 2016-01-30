import {mergeDeep} from './schemautil';
import {duplicate} from '../util';
import {FieldDef, facetField, onlyOrdinalField, positionalField, textField, typicalField} from './fielddef.schema';
import {typicalScale} from './scale.schema';
import {legend} from './legend.schema';

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

var x = duplicate(positionalField);
var y = duplicate(positionalField);

var row = mergeDeep(duplicate(facetField));
var column = mergeDeep(duplicate(facetField));

var size = mergeDeep(duplicate(typicalField), {
  properties: {
    scale: duplicate(typicalScale),
    legend: legend,
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
    scale: mergeDeep(duplicate(typicalScale), {
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
    }),
    legend: legend
  }
});

var shape = mergeDeep(duplicate(onlyOrdinalField), {
  properties: {
    legend: legend
  }
});

var path = {
  default: undefined,
  oneOf: [duplicate(typicalField), {
    type: 'array',
    items: duplicate(typicalField)
  }]
};

var detail = {
  default: undefined,
  oneOf: [duplicate(typicalField), {
    type: 'array',
    items: duplicate(typicalField)
  }]
};

var text = mergeDeep(duplicate(textField), {
  properties: {
    value: {
      type: 'string',
      default: 'Abc'
    }
  }
});

var label = duplicate(textField);

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
