import * as tslib_1 from "tslib";
import * as mixins from './mixins';
import { isFieldDef, vgField } from '../../fielddef';
import { GEOJSON } from '../../type';
export var geoshape = {
    vgMark: 'shape',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }));
    },
    postEncodingTransform: function (model) {
        var encoding = model.encoding;
        var shapeDef = encoding.shape;
        var transform = tslib_1.__assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && isFieldDef(shapeDef) && shapeDef.type === GEOJSON
            ? { field: vgField(shapeDef, { expr: 'datum' }) }
            : {}));
        return [transform];
    }
};
//# sourceMappingURL=geoshape.js.map