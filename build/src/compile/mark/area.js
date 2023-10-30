import * as encode from './encode';
export const area = {
    vgMark: 'area',
    encodeEntry: (model) => {
        return {
            ...encode.baseEncodeEntry(model, {
                align: 'ignore',
                baseline: 'ignore',
                color: 'include',
                orient: 'include',
                size: 'ignore',
                theta: 'ignore'
            }),
            ...encode.pointOrRangePosition('x', model, {
                defaultPos: 'zeroOrMin',
                defaultPos2: 'zeroOrMin',
                range: model.markDef.orient === 'horizontal'
            }),
            ...encode.pointOrRangePosition('y', model, {
                defaultPos: 'zeroOrMin',
                defaultPos2: 'zeroOrMin',
                range: model.markDef.orient === 'vertical'
            }),
            ...encode.defined(model)
        };
    }
};
//# sourceMappingURL=area.js.map