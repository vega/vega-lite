import * as mixins from './mixins';
import { rectPosition } from './rect';
export const bar = {
    vgMark: 'rect',
    encodeEntry: (model) => {
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), rectPosition(model, 'x', 'bar'), rectPosition(model, 'y', 'bar'));
    }
};
//# sourceMappingURL=bar.js.map