/**
 * Definition for specifications in Vega-Lite. In general, there are 3 variants of specs for each type of specs:
 * - Generic specs are generic versions of specs and they are parameterized differently for internal and external specs.
 * - The external specs (no prefix) would allow composite marks, row/column encodings, and mark macros like point/line overlay.
 * - The internal specs (with `Normalized` prefix) would only support primitive marks and support no macros/shortcuts.
 */
import { Field, FieldName } from '../channeldef';
import { Encoding } from '../encoding';
import { DataMixins } from './base';
import { GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec } from './concat';
import { GenericFacetSpec } from './facet';
import { GenericLayerSpec, LayerSpec, NormalizedLayerSpec } from './layer';
import { RepeatSpec } from './repeat';
import { TopLevel } from './toplevel';
import { FacetedUnitSpec, GenericUnitSpec, NormalizedUnitSpec, TopLevelUnitSpec, UnitSpecWithFrame } from './unit';
export type { BaseSpec, LayoutSizeMixins } from './base';
export type { GenericHConcatSpec, GenericVConcatSpec, NormalizedConcatSpec } from './concat';
export { isAnyConcatSpec, isHConcatSpec, isVConcatSpec } from './concat';
export type { GenericFacetSpec, NormalizedFacetSpec } from './facet';
export { isFacetSpec } from './facet';
export type { GenericLayerSpec, LayerSpec, NormalizedLayerSpec } from './layer';
export { isLayerSpec } from './layer';
export type { RepeatSpec } from './repeat';
export { isRepeatSpec } from './repeat';
export type { TopLevel } from './toplevel';
export type { FacetedUnitSpec, GenericUnitSpec, NormalizedUnitSpec, UnitSpec } from './unit';
export { isUnitSpec } from './unit';
/**
 * Any specification in Vega-Lite.
 */
export type GenericSpec<U extends GenericUnitSpec<Encoding<F>, any>, L extends GenericLayerSpec<U>, R extends RepeatSpec, F extends Field> = U | L | R | GenericFacetSpec<U, L, F> | GenericConcatSpec<GenericSpec<U, L, R, F>> | GenericVConcatSpec<GenericSpec<U, L, R, F>> | GenericHConcatSpec<GenericSpec<U, L, R, F>>;
/**
 * Specs with only primitive marks and without other macros.
 */
export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec, never, FieldName>;
export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<UnitSpecWithFrame<Field>, LayerSpec<Field>, Field>> & DataMixins;
export type NonNormalizedSpec = GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>;
/**
 * A Vega-Lite top-level specification.
 * This is the root class for all Vega-Lite specifications.
 * (The json schema is generated from this type.)
 */
export type TopLevelSpec = TopLevelUnitSpec<Field> | TopLevelFacetSpec | TopLevel<LayerSpec<Field>> | TopLevel<RepeatSpec> | TopLevel<GenericConcatSpec<NonNormalizedSpec>> | TopLevel<GenericVConcatSpec<NonNormalizedSpec>> | TopLevel<GenericHConcatSpec<NonNormalizedSpec>>;
//# sourceMappingURL=index.d.ts.map