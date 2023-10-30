import { isFieldDef, vgField } from '../../channeldef';
import { GEOJSON } from '../../type';
import * as encode from './encode';
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
                theta: 'ignore'
            })
        };
    },
    postEncodingTransform: (model) => {
        const { encoding } = model;
        const shapeDef = encoding.shape;
        const transform = {
            type: 'geoshape',
            projection: model.projectionName(),
            // as: 'shape',
            ...(shapeDef && isFieldDef(shapeDef) && shapeDef.type === GEOJSON
                ? { field: vgField(shapeDef, { expr: 'datum' }) }
                : {})
        };
        return [transform];
    }
};
//# sourceMappingURL=geoshape.js.map