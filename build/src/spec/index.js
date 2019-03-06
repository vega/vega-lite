/**
 * Definition for specifications in Vega-Lite.  In general, there are 3 variants of specs for each type of specs:
 * - Generic specs are generic versions of specs and they are parameterized differently for internal and external specs.
 * - The external specs (no prefix) would allow composite marks, row/column encodings, and mark macros like point/line overlay.
 * - The internal specs (with `Normalized` prefix) would only support primitive marks and support no macros/shortcuts.
 */
export { isAnyConcatSpec, isHConcatSpec, isVConcatSpec } from './concat';
export { isFacetSpec } from './facet';
export { isLayerSpec } from './layer';
export { isRepeatSpec } from './repeat';
export { isUnitSpec } from './unit';
//# sourceMappingURL=index.js.map