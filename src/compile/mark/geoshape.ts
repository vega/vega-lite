import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {Field, FieldDef, isFieldDef, vgField} from '../../fielddef';
import {GEOSHAPE} from '../../mark';
import {GEOJSON} from '../../type';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  encodeEntry: (model: UnitModel) => {
    const {config} = model;
    return {
      ...mixins.color(model),
      ...mixins.text(model, 'tooltip'),
      ...mixins.nonPosition('opacity', model)
    };
  },
  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding, markDef} = model;
    const shapeDef = encoding.shape;

    if ((isFieldDef(shapeDef) && shapeDef.type === GEOJSON) || markDef.type === GEOSHAPE) {
      const transform: VgGeoShapeTransform = {
        type: 'geoshape',
        projection: model.projectionName(),
        // as: 'shape',
        ...(shapeDef && isFieldDef(shapeDef) ? {field: vgField(shapeDef, {expr: 'datum'})} : {}),
      };
      return [transform];
    }
    return undefined;
  }
};
