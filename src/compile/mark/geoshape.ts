import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {isFieldDef, vgField} from '../../fielddef';
import {GEOSHAPE} from '../../mark';
import {GEOJSON} from '../../type';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, true)
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
