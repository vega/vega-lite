"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = tslib_1.__importStar(require("./mixins"));
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
exports.geoshape = {
    vgMark: 'shape',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }));
    },
    postEncodingTransform: function (model) {
        var encoding = model.encoding;
        var shapeDef = encoding.shape;
        var transform = tslib_1.__assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && fielddef_1.isFieldDef(shapeDef) && shapeDef.type === type_1.GEOJSON ? { field: fielddef_1.vgField(shapeDef, { expr: 'datum' }) } : {}));
        return [transform];
    }
};
//# sourceMappingURL=geoshape.js.map