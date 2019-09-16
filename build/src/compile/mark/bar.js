import * as mixins from './mixins';
import { rectPosition } from './rect';
export const bar = {
    vgMark: 'rect',
    encodeEntry: (model) => {
        return Object.assign(Object.assign(Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'include',
            orient: 'ignore',
            size: 'ignore'
        })), rectPosition(model, 'x', 'bar')), rectPosition(model, 'y', 'bar'));
    }
};
//# sourceMappingURL=bar.js.map