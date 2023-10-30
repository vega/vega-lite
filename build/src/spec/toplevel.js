import { getPositionScaleChannel } from '../channel';
import { signalRefOrValue } from '../compile/common';
export function isFitType(autoSizeType) {
    return autoSizeType === 'fit' || autoSizeType === 'fit-x' || autoSizeType === 'fit-y';
}
export function getFitType(sizeType) {
    return sizeType ? `fit-${getPositionScaleChannel(sizeType)}` : 'fit';
}
const TOP_LEVEL_PROPERTIES = [
    'background',
    'padding'
    // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];
export function extractTopLevelProperties(t, includeParams) {
    const o = {};
    for (const p of TOP_LEVEL_PROPERTIES) {
        if (t && t[p] !== undefined) {
            o[p] = signalRefOrValue(t[p]);
        }
    }
    if (includeParams) {
        o.params = t.params;
    }
    return o;
}
//# sourceMappingURL=toplevel.js.map