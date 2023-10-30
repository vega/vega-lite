import * as encode from './encode';
function encodeEntry(model, fixedShape) {
    const { config } = model;
    return {
        ...encode.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'include',
            size: 'include',
            orient: 'ignore',
            theta: 'ignore'
        }),
        ...encode.pointPosition('x', model, { defaultPos: 'mid' }),
        ...encode.pointPosition('y', model, { defaultPos: 'mid' }),
        ...encode.nonPosition('size', model),
        ...encode.nonPosition('angle', model),
        ...shapeMixins(model, config, fixedShape)
    };
}
export function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return encode.nonPosition('shape', model);
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