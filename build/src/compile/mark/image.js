import * as encode from './encode';
export const image = {
    vgMark: 'image',
    encodeEntry: (model) => {
        return {
            ...encode.baseEncodeEntry(model, {
                align: 'ignore',
                baseline: 'ignore',
                color: 'ignore',
                orient: 'ignore',
                size: 'ignore',
                theta: 'ignore'
            }),
            ...encode.rectPosition(model, 'x'),
            ...encode.rectPosition(model, 'y'),
            ...encode.text(model, 'url')
        };
    }
};
//# sourceMappingURL=image.js.map