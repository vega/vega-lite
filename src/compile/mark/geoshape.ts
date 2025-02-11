import {GeoShapeTransform as VgGeoShapeTransform} from 'vega';
import {isFieldDef, vgField} from '../../channeldef.js';
import {GEOJSON} from '../../type.js';
import {VgPostEncodingTransform} from '../../vega.schema.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore',
        theta: 'ignore',
      }),
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
        : {}),
    };
    return [transform];
  },
};
