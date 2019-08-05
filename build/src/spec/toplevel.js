import { isString } from 'vega-util';
import * as log from '../log';
import { isLayerSpec } from './layer';
import { isUnitSpec } from './unit';
import { getPositionScaleChannel } from '../channel';
export function isFitType(autoSizeType) {
    return autoSizeType === 'fit' || autoSizeType === 'fit-x' || autoSizeType === 'fit-y';
}
export function getFitType(sizeType) {
    return sizeType ? `fit-${getPositionScaleChannel(sizeType)}` : 'fit';
}
function _normalizeAutoSize(autosize) {
    return isString(autosize) ? { type: autosize } : autosize || {};
}
export function normalizeAutoSize(spec, config) {
    const autosize = Object.assign({ type: 'pad' }, (config ? _normalizeAutoSize(config.autosize) : {}), _normalizeAutoSize(spec.autosize));
    if (autosize.type === 'fit') {
        if (!(isLayerSpec(spec) || isUnitSpec(spec))) {
            log.warn(log.message.FIT_NON_SINGLE);
            autosize.type = 'pad';
        }
    }
    return autosize;
}
const TOP_LEVEL_PROPERTIES = [
    'background',
    'padding'
    // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];
export function extractTopLevelProperties(t) {
    return TOP_LEVEL_PROPERTIES.reduce((o, p) => {
        if (t && t[p] !== undefined) {
            o[p] = t[p];
        }
        return o;
    }, {});
}
//# sourceMappingURL=toplevel.js.map