import * as tslib_1 from "tslib";
import { isMarkDef } from './../mark';
import { BOXPLOT, normalizeBoxPlot, VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX } from './boxplot';
import { ERRORBAR, normalizeErrorBar } from './errorbar';
// This package import below makes the generated .d.ts file compatible with
// Typescript 2.7 so that libraries requiring us can use Typedoc (which
// currently is limited to Typescript 2.7). This comment and import can be
// removed when Typedoc is updated to Typescript 2.9 or later. See
// https://github.com/vega/vega-lite/issues/3862 for more details.
import * as boxplot from './boxplot';
/**
 * Registry index for all composite mark's normalizer
 */
var normalizerRegistry = {};
export function add(mark, normalizer) {
    normalizerRegistry[mark] = normalizer;
}
export function remove(mark) {
    delete normalizerRegistry[mark];
}
export var COMPOSITE_MARK_STYLES = boxplot.BOXPLOT_STYLES;
export var VL_ONLY_COMPOSITE_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = tslib_1.__assign({}, VL_ONLY_BOXPLOT_CONFIG_PROPERTY_INDEX);
add(BOXPLOT, normalizeBoxPlot);
add(ERRORBAR, normalizeErrorBar);
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export function normalize(
// This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
spec, config) {
    var mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var normalizer = normalizerRegistry[mark];
    if (normalizer) {
        return normalizer(spec, config);
    }
    throw new Error("Invalid mark type \"" + mark + "\"");
}
//# sourceMappingURL=index.js.map