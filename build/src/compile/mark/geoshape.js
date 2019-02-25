import * as mixins from './mixins';
import { isFieldDef, vgField } from '../../fielddef';
import { GEOJSON } from '../../type';
export const geoshape = {
    vgMark: 'shape',
    encodeEntry: (model) => {
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }));
    },
    postEncodingTransform: (model) => {
        const { encoding } = model;
        const shapeDef = encoding.shape;
        const transform = Object.assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && isFieldDef(shapeDef) && shapeDef.type === GEOJSON
            ? { field: vgField(shapeDef, { expr: 'datum' }) }
            : {}));
        return [transform];
    }
};
//# sourceMappingURL=geoshape.js.map