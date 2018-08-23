import * as tslib_1 from "tslib";
import { isString } from 'vega-util';
import * as log from './log';
export function extractCompositionLayout(layout) {
    var _a = layout || {}, _b = _a.align, align = _b === void 0 ? undefined : _b, _c = _a.center, center = _c === void 0 ? undefined : _c, _d = _a.bounds, bounds = _d === void 0 ? undefined : _d, _e = _a.spacing, spacing = _e === void 0 ? undefined : _e;
    return { align: align, bounds: bounds, center: center, spacing: spacing };
}
function _normalizeAutoSize(autosize) {
    return isString(autosize) ? { type: autosize } : autosize || {};
}
export function normalizeAutoSize(topLevelAutosize, configAutosize, isUnitOrLayer) {
    if (isUnitOrLayer === void 0) { isUnitOrLayer = true; }
    var autosize = tslib_1.__assign({ type: 'pad' }, _normalizeAutoSize(configAutosize), _normalizeAutoSize(topLevelAutosize));
    if (autosize.type === 'fit') {
        if (!isUnitOrLayer) {
            log.warn(log.message.FIT_NON_SINGLE);
            autosize.type = 'pad';
        }
    }
    return autosize;
}
var TOP_LEVEL_PROPERTIES = [
    'background',
    'padding',
    'datasets'
    // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];
export function extractTopLevelProperties(t) {
    return TOP_LEVEL_PROPERTIES.reduce(function (o, p) {
        if (t && t[p] !== undefined) {
            o[p] = t[p];
        }
        return o;
    }, {});
}
//# sourceMappingURL=toplevelprops.js.map