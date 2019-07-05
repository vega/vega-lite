import {isFieldDef, vgField} from '../../channeldef';
import {GEOJSON} from '../../type';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore'
      })
    };
  },
  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding} = model;
    const shapeDef = encoding.shape;

    const transform: VgGeoShapeTransform = {
      type: 'geoshape',
      projection: model.projectionName(),
      // as: 'shape',
      ...(shapeDef && isFieldDef(shapeDef) && shapeDef.type === GEOJSON
        ? {field: vgField(shapeDef, {expr: 'datum'})}
        : {})
    };
    return [transform];
  }
};
