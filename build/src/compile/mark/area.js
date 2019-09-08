import * as mixins from './mixins';
export const area = {
    vgMark: 'area',
    encodeEntry: (model) => {
        return Object.assign(Object.assign(Object.assign(Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'include',
            orient: 'include',
            size: 'ignore'
        })), mixins.pointOrRangePosition('x', model, {
            defaultRef: 'zeroOrMin',
            defaultRef2: 'zeroOrMin',
            range: model.markDef.orient === 'horizontal'
        })), mixins.pointOrRangePosition('y', model, {
            defaultRef: 'zeroOrMin',
            defaultRef2: 'zeroOrMin',
            range: model.markDef.orient === 'vertical'
        })), mixins.defined(model));
    }
};
//# sourceMappingURL=area.js.map