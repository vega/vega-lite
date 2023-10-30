import * as encode from './encode';
export const rule = {
    vgMark: 'rule',
    encodeEntry: (model) => {
        const { markDef } = model;
        const orient = markDef.orient;
        if (!model.encoding.x && !model.encoding.y && !model.encoding.latitude && !model.encoding.longitude) {
            // Show nothing if we have none of x, y, lat, and long.
            return {};
        }
        return {
            ...encode.baseEncodeEntry(model, {
                align: 'ignore',
                baseline: 'ignore',
                color: 'include',
                orient: 'ignore',
                size: 'ignore',
                theta: 'ignore'
            }),
            ...encode.pointOrRangePosition('x', model, {
                defaultPos: orient === 'horizontal' ? 'zeroOrMax' : 'mid',
                defaultPos2: 'zeroOrMin',
                range: orient !== 'vertical' // include x2 for horizontal or line segment rule
            }),
            ...encode.pointOrRangePosition('y', model, {
                defaultPos: orient === 'vertical' ? 'zeroOrMax' : 'mid',
                defaultPos2: 'zeroOrMin',
                range: orient !== 'horizontal' // include y2 for vertical or line segment rule
            }),
            ...encode.nonPosition('size', model, {
                vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
            })
        };
    }
};
//# sourceMappingURL=rule.js.map