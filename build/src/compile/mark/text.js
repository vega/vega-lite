import { getMarkPropOrConfig } from '../common';
import * as encode from './encode';
export const text = {
    vgMark: 'text',
    encodeEntry: (model) => {
        const { config, encoding } = model;
        return {
            ...encode.baseEncodeEntry(model, {
                align: 'include',
                baseline: 'include',
                color: 'include',
                size: 'ignore',
                orient: 'ignore',
                theta: 'include'
            }),
            ...encode.pointPosition('x', model, { defaultPos: 'mid' }),
            ...encode.pointPosition('y', model, { defaultPos: 'mid' }),
            ...encode.text(model),
            ...encode.nonPosition('size', model, {
                vgChannel: 'fontSize' // VL's text size is fontSize
            }),
            ...encode.nonPosition('angle', model),
            ...encode.valueIfDefined('align', align(model.markDef, encoding, config)),
            ...encode.valueIfDefined('baseline', baseline(model.markDef, encoding, config)),
            ...encode.pointPosition('radius', model, { defaultPos: null }),
            ...encode.pointPosition('theta', model, { defaultPos: null })
        };
    }
};
function align(markDef, encoding, config) {
    const a = getMarkPropOrConfig('align', markDef, config);
    if (a === undefined) {
        return 'center';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
function baseline(markDef, encoding, config) {
    const b = getMarkPropOrConfig('baseline', markDef, config);
    if (b === undefined) {
        return 'middle';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=text.js.map