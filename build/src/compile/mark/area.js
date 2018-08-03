"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = tslib_1.__importStar(require("./mixins"));
exports.area = {
    vgMark: 'area',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'include' }), mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', model.markDef.orient === 'horizontal' ? 'x2' : 'y2'), mixins.defined(model));
    }
};
//# sourceMappingURL=area.js.map