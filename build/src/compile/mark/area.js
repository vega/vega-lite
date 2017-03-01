"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.area = {
    vgMark: 'area',
    role: undefined,
    encodeEntry: function (model) {
        var orient = model.markDef.orient;
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.markDefProperties(model.markDef, ['orient', 'interpolate', 'tension']));
    }
};
//# sourceMappingURL=area.js.map