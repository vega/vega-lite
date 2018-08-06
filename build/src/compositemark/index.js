"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mark_1 = require("../mark");
var util_1 = require("../util");
var boxplot_1 = require("./boxplot");
var errorband_1 = require("./errorband");
var errorbar_1 = require("./errorbar");
/**
 * Registry index for all composite mark's normalizer
 */
var compositeMarkRegistry = {};
function add(mark, normalizer, parts) {
    compositeMarkRegistry[mark] = { normalizer: normalizer, parts: parts };
}
exports.add = add;
function remove(mark) {
    delete compositeMarkRegistry[mark];
}
exports.remove = remove;
function getAllCompositeMarks() {
    return util_1.keys(compositeMarkRegistry);
}
exports.getAllCompositeMarks = getAllCompositeMarks;
function getCompositeMarkParts(mark) {
    if (mark in compositeMarkRegistry) {
        return compositeMarkRegistry[mark].parts;
    }
    throw new Error("Unregistered composite mark " + mark);
}
exports.getCompositeMarkParts = getCompositeMarkParts;
add(boxplot_1.BOXPLOT, boxplot_1.normalizeBoxPlot, boxplot_1.BOXPLOT_PARTS);
add(errorbar_1.ERRORBAR, errorbar_1.normalizeErrorBar, errorbar_1.ERRORBAR_PARTS);
add(errorband_1.ERRORBAND, errorband_1.normalizeErrorBand, errorband_1.ERRORBAND_PARTS);
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
function normalize(
// This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
spec, config) {
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    if (mark in compositeMarkRegistry) {
        var normalizer = compositeMarkRegistry[mark].normalizer;
        return normalizer(spec, config);
    }
    throw new Error("Invalid mark type \"" + mark + "\"");
}
exports.normalize = normalize;
//# sourceMappingURL=index.js.map