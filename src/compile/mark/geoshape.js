import {isFieldDef, vgField} from '../../channeldef.js';
import {GEOJSON} from '../../type.js';
import * as encode from './encode/index.js';
export const geoshape = {
  vgMark: 'shape',
  encodeEntry: (model) => {
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
  postEncodingTransform: (model) => {
    const {encoding} = model;
    const shapeDef = encoding.shape;
    const transform = {
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
//# sourceMappingURL=geoshape.js.map
