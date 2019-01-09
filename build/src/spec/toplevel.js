import { isString } from 'vega-util';
import * as log from '../log';
export function extractCompositionLayout(layout) {
    const { align = undefined, center = undefined, bounds = undefined, spacing = undefined } = layout || {};
    return { align, bounds, center, spacing };
}
function _normalizeAutoSize(autosize) {
    return isString(autosize) ? { type: autosize } : autosize || {};
}
export function normalizeAutoSize(topLevelAutosize, configAutosize, isUnitOrLayer = true) {
    const autosize = Object.assign({ type: 'pad' }, _normalizeAutoSize(configAutosize), _normalizeAutoSize(topLevelAutosize));
    if (autosize.type === 'fit') {
        if (!isUnitOrLayer) {
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