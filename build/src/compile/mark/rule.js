import * as mixins from './mixins';
import * as ref from './valueref';
export const rule = {
    vgMark: 'rule',
    encodeEntry: (model) => {
        const { markDef, width, height } = model;
        const orient = markDef.orient;
        if (!model.encoding.x && !model.encoding.y && !model.encoding.latitude && !model.encoding.longitude) {
            // Show nothing if we have none of x, y, lat, and long.
            return {};
        }
        return Object.assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)), (orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}), (orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth',
            defaultValue: markDef.size
        }));
    }
};
//# sourceMappingURL=rule.js.map