"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var channel_1 = require("./channel");
var util_1 = require("./util");
function binToString(bin) {
    if (vega_util_1.isBoolean(bin)) {
        return 'bin';
    }
    return 'bin' + util_1.keys(bin).map(function (p) { return util_1.varName("_" + p + "_" + bin[p]); }).join('');
}
exports.binToString = binToString;
function isBinParams(bin) {
    return bin && !vega_util_1.isBoolean(bin);
}
exports.isBinParams = isBinParams;
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        case channel_1.COLOR:
        case channel_1.FILL:
        case channel_1.STROKE:
        case channel_1.OPACITY:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;
//# sourceMappingURL=bin.js.map