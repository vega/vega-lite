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

var size = mergeDeep(duplicate(typicalField), {
  properties: {
    scale: duplicate(typicalScale),
    legend: legend
  }
});

var color = mergeDeep(duplicate(typicalField), {
  properties: {
    scale: duplicate(typicalScale),
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

export var encoding = {
  type: 'object',
  properties: {
    x: positionalField,
    y: positionalField,
    row: facetField,
    column: facetField,
    size: size,
    color: color,
    shape: shape,
    path: path,
    text: text,
    detail: detail,
    label: textField
  }
};
