/**
 * Definition for specifications in Vega-Lite.  In general, there are 3 variants of specs for each type of specs:
 * - Generic specs are generic versions of specs and they are parameterized differently for internal and external specs.
 * - The external specs (no prefix) would allow composite marks, row/column encodings, and mark macros like point/line overlay.
 * - The internal specs (with `Normalized` prefix) would only support primitive marks and support no macros/shortcuts.
 */

import {DataMixins} from './base';
import {GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec} from './concat';
import {GenericFacetSpec} from './facet';
import {ExtendedLayerSpec, GenericLayerSpec, NormalizedLayerSpec} from './layer';
import {GenericRepeatSpec} from './repeat';
import {TopLevel} from './toplevel';
import {FacetedCompositeUnitSpec, GenericUnitSpec, NormalizedUnitSpec, TopLevelUnitSpec} from './unit';

export {BaseSpec, DataMixins, LayoutSizeMixins} from './base';
export {
  GenericHConcatSpec,
  GenericVConcatSpec,
  isAnyConcatSpec,
  isHConcatSpec,
  isVConcatSpec,
  NormalizedConcatSpec
} from './concat';
export {GenericFacetSpec, isFacetSpec, NormalizedFacetSpec} from './facet';
export {ExtendedLayerSpec, GenericLayerSpec, isLayerSpec, NormalizedLayerSpec} from './layer';
export {GenericRepeatSpec, isRepeatSpec, NormalizedRepeatSpec} from './repeat';
export {TopLevel} from './toplevel';
export {
  CompositeUnitSpec as ExtendedUnitSpec,
  FacetedCompositeUnitSpec as FacetedExtendedUnitSpec,
  GenericUnitSpec,
  isUnitSpec,
  NormalizedUnitSpec
} from './unit';

/**
 * Any specification in Vega-Lite.
 */
export type GenericSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> =
  | U
  | L
  | GenericFacetSpec<U, L>
  | GenericRepeatSpec<U, L>
  | GenericConcatSpec<U, L>
  | GenericVConcatSpec<U, L>
  | GenericHConcatSpec<U, L>;

/**
 * Specs with only primitive marks and without other macros.
 */
export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;

/**
 * A Vega-Lite top-level specification.
 * This is the root class for all Vega-Lite specifications.
 * (The json schema is generated from this type.)
 */
export type TopLevelSpec =
  | TopLevelUnitSpec
  | TopLevelFacetSpec
  | TopLevel<ExtendedLayerSpec>
  | TopLevel<GenericRepeatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericVConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>
  | TopLevel<GenericHConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>;
