import {FieldDef, facetFieldDef, orderFieldDefs, positionFieldDef, shapeFieldDef, sizeFieldDef, textFieldDef, colorFieldDef} from './fielddef.schema';

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

export const encoding = {
  type: 'object',
  properties: {
    x: positionFieldDef,
    y: positionFieldDef,
    row: facetFieldDef,
    column: facetFieldDef,
    size: sizeFieldDef,
    color: colorFieldDef,
    shape: shapeFieldDef,
    path: orderFieldDefs,
    text: textFieldDef,
    detail: orderFieldDefs,
    label: textFieldDef
  }
};
