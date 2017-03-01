"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
exports.rule = {
    vgMark: 'rule',
    role: undefined,
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMax'), mixins.color(model), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};
//# sourceMappingURL=rule.js.map