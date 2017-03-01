"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.line = {
    vgMark: 'line',
    role: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }), mixins.markDefProperties(model.markDef, ['interpolate', 'tension']));
    }
};
//# sourceMappingURL=line.js.map