"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("./../mark");
var boxplot_1 = require("./boxplot");
var errorbar_1 = require("./errorbar");
// This package import below makes the generated .d.ts file compatible with
// Typescript 2.7 so that libraries requiring us can use Typedoc (which
// currently is limited to Typescript 2.7). This comment and import can be
// removed when Typedoc is updated to Typescript 2.9 or later. See
// https://github.com/vega/vega-lite/issues/3862 for more details.
var boxplot = tslib_1.__importStar(require("./boxplot"));
/**
 * Registry index for all composite mark's normalizer
 */
var normalizerRegistry = {};
function add(mark, normalizer) {
    normalizerRegistry[mark] = normalizer;
}
exports.add = add;
function remove(mark) {
    delete normalizerRegistry[mark];
}
exports.remove = remove;
exports.COMPOSITE_MARK_STYLES = boxplot.BOXPLOT_STYLES;
exports.VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = tslib_1.__assign({}, boxplot_1.VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX);
add(boxplot_1.BOXPLOT, boxplot_1.normalizeBoxPlot);
add(errorbar_1.ERRORBAR, errorbar_1.normalizeErrorBar);
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
function normalize(
// This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
spec, config) {
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var normalizer = normalizerRegistry[mark];
    if (normalizer) {
        return normalizer(spec, config);
    }
    throw new Error("Invalid mark type \"" + mark + "\"");
}
exports.normalize = normalize;
//# sourceMappingURL=index.js.map