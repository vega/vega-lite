import * as mixins from './mixins';
import { rectPosition } from './rect';
export const image = {
    vgMark: 'image',
    encodeEntry: (model) => {
        return Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'ignore',
            orient: 'ignore',
            size: 'ignore'
        }), rectPosition(model, 'x', 'image'), rectPosition(model, 'y', 'image'), mixins.text(model, 'url'));
    }
};
//# sourceMappingURL=image.js.map