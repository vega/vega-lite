import * as mixins from './mixins';
import * as ref from './valueref';
export const line = {
    vgMark: 'line',
    encodeEntry: (model) => {
        const { width, height } = model;
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }), mixins.defined(model));
    }
};
export const trail = {
    vgMark: 'trail',
    encodeEntry: (model) => {
        const { width, height } = model;
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'include', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model), mixins.defined(model));
    }
};
//# sourceMappingURL=line.js.map