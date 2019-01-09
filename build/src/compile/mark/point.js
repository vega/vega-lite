import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
function encodeEntry(model, fixedShape) {
    const { config, markDef, width, height } = model;
    return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'include', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model, { defaultValue: getMarkConfig('size', markDef, config) }), shapeMixins(model, config, fixedShape));
}
export function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: getMarkConfig('shape', model.markDef, config) });
}
export const point = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model);
    }
};
export const circle = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model, 'circle');
    }
};
export const square = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=point.js.map