import {FieldDef, detailFieldDefs, facetFieldDef, orderFieldDefs, positionFieldDef, shapeFieldDef, sizeFieldDef, textFieldDef, colorFieldDef} from './fielddef.schema';

export interface Encoding {
  x?: FieldDef;
  y?: FieldDef;
  row?: FieldDef;
  column?: FieldDef;
  color?: FieldDef;
  size?: FieldDef;
  shape?: FieldDef;
  detail?: FieldDef | FieldDef[];
  text?: FieldDef;
  label?: FieldDef;

  path?: FieldDef | FieldDef[];
  order?: FieldDef | FieldDef[];
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
    text: textFieldDef,
    detail: detailFieldDefs,
    label: textFieldDef,
    path: orderFieldDefs,
    order: orderFieldDefs
  }
};
