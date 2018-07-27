import * as tslib_1 from "tslib";
import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
function encodeEntry(model, fixedShape) {
    var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
    return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'include', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model, { defaultValue: getMarkConfig('size', markDef, config) }), shapeMixins(model, config, fixedShape));
}
export function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: getMarkConfig('shape', model.markDef, config) });
}
export var point = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
export var circle = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
export var square = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=point.js.map