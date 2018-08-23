import * as tslib_1 from "tslib";
import * as mixins from './mixins';
export var area = {
    vgMark: 'area',
    encodeEntry: function (model) {
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'include' }), mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin', model.markDef.orient === 'horizontal' ? 'x2' : 'y2'), mixins.defined(model));
    }
};
//# sourceMappingURL=area.js.map