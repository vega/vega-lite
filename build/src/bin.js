import { isBoolean, isObject } from 'vega-util';
import { COLOR, COLUMN, FILL, OPACITY, ROW, SHAPE, SIZE, STROKE } from './channel';
import { keys, varName } from './util';
export function binToString(bin) {
    if (isBoolean(bin)) {
        return 'bin';
    }
    return ('bin' +
        keys(bin)
            .map(function (p) { return varName("_" + p + "_" + bin[p]); })
            .join(''));
}
export function isBinning(bin) {
    return bin === true || isBinParams(bin);
}
export function isBinned(bin) {
    return bin === 'binned';
}
export function isBinParams(bin) {
    return isObject(bin);
}
export function autoMaxBins(channel) {
    switch (channel) {
        case ROW:
        case COLUMN:
        case SIZE:
        case COLOR:
        case FILL:
        case STROKE:
        case OPACITY:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
//# sourceMappingURL=bin.js.map