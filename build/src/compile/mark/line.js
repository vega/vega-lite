import * as tslib_1 from "tslib";
import * as mixins from './mixins';
import * as ref from './valueref';
export var line = {
    vgMark: 'line',
    encodeEntry: function (model) {
        var width = model.width, height = model.height;
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }), mixins.defined(model));
    }
};
export var trail = {
    vgMark: 'trail',
    encodeEntry: function (model) {
        var width = model.width, height = model.height;
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'include', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model), mixins.defined(model));
    }
};
//# sourceMappingURL=line.js.map