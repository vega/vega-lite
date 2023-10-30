import { isBoolean, isObject } from 'vega-util';
import { COLOR, COLUMN, FILL, FILLOPACITY, OPACITY, ROW, SHAPE, SIZE, STROKE, STROKEDASH, STROKEOPACITY, STROKEWIDTH } from './channel';
import { normalizeBin } from './channeldef';
import { entries, keys, varName } from './util';
/**
 * Create a key for the bin configuration. Not for prebinned bin.
 */
export function binToString(bin) {
    if (isBoolean(bin)) {
        bin = normalizeBin(bin, undefined);
    }
    return ('bin' +
        keys(bin)
            .map(p => (isParameterExtent(bin[p]) ? varName(`_${p}_${entries(bin[p])}`) : varName(`_${p}_${bin[p]}`)))
            .join(''));
}
/**
 * Vega-Lite should bin the data.
 */
export function isBinning(bin) {
    return bin === true || (isBinParams(bin) && !bin.binned);
}
/**
 * The data is already binned and so Vega-Lite should not bin it again.
 */
export function isBinned(bin) {
    return bin === 'binned' || (isBinParams(bin) && bin.binned === true);
}
export function isBinParams(bin) {
    return isObject(bin);
}
export function isParameterExtent(extent) {
    return extent?.['param'];
}
export function autoMaxBins(channel) {
    switch (channel) {
        case ROW:
        case COLUMN:
        case SIZE:
        case COLOR:
        case FILL:
        case STROKE:
        case STROKEWIDTH:
        case OPACITY:
        case FILLOPACITY:
        case STROKEOPACITY:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule [falls through]
        case SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        case STROKEDASH:
            return 4; // We only provide 5 different stroke dash values (but 4 is more effective)
        default:
            return 10;
    }
}
//# sourceMappingURL=bin.js.map