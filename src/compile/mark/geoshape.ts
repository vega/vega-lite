import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {Field, FieldDef, isFieldDef, isGeoJSONFieldDef} from '../../fielddef';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: 'geoshape',
  encodeEntry: (model: UnitModel) => {
    const {config} = model;
    return {
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model)
    };
  },
  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding} = model;
    const fieldDef: FieldDef<Field> = encoding.shape && isFieldDef(encoding.shape) && isGeoJSONFieldDef(encoding.shape) ? encoding.shape : undefined;
    const transform: VgGeoShapeTransform = {
      type: 'geoshape',
      projection: model.getName('projection'),
      as: 'shape',
      ...fieldDef ? {field: `datum[${fieldDef.field}]`} : {},
    };
    return [transform];
  }
};
