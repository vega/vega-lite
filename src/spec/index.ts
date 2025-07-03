/**
 * Definition for specifications in Vega-Lite. In general, there are 3 variants of specs for each type of specs:
 * - Generic specs are generic versions of specs and they are parameterized differently for internal and external specs.
 * - The external specs (no prefix) would allow composite marks, row/column encodings, and mark macros like point/line overlay.
 * - The internal specs (with `Normalized` prefix) would only support primitive marks and support no macros/shortcuts.
 */
import {Field, FieldName} from '../channeldef.js';
import {Encoding} from '../encoding.js';
import {DataMixins} from './base.js';
import {GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec} from './concat.js';
import {GenericFacetSpec} from './facet.js';
import {GenericLayerSpec, LayerSpec, NormalizedLayerSpec} from './layer.js';
import {RepeatSpec} from './repeat.js';
import {TopLevel} from './toplevel.js';
import {FacetedUnitSpec, GenericUnitSpec, NormalizedUnitSpec, TopLevelUnitSpec, UnitSpecWithFrame} from './unit.js';

export type {BaseSpec, LayoutSizeMixins} from './base.js';
export type {GenericConcatSpec, GenericHConcatSpec, GenericVConcatSpec, NormalizedConcatSpec} from './concat.js';
export {isAnyConcatSpec, isHConcatSpec, isVConcatSpec} from './concat.js';
export type {GenericFacetSpec, NormalizedFacetSpec} from './facet.js';
export {isFacetSpec} from './facet.js';
export type {GenericLayerSpec, LayerSpec, NormalizedLayerSpec} from './layer.js';
export {isLayerSpec} from './layer.js';
export type {RepeatSpec} from './repeat.js';
export {isRepeatSpec} from './repeat.js';
export type {TopLevel} from './toplevel.js';
export type {
  FacetedUnitSpec,
  GenericUnitSpec,
  NormalizedUnitSpec,
  UnitSpec,
  TopLevelUnitSpec,
  UnitSpecWithFrame,
} from './unit.js';
export {isUnitSpec} from './unit.js';

/**
 * Any specification in Vega-Lite.
 */
export type GenericSpec<
  U extends GenericUnitSpec<Encoding<F>, any>,
  L extends GenericLayerSpec<U>,
  R extends RepeatSpec,
  F extends Field,
> =
  | U
  | L
  | R
  | GenericFacetSpec<U, L, F>
  | GenericConcatSpec<GenericSpec<U, L, R, F>>
  | GenericVConcatSpec<GenericSpec<U, L, R, F>>
  | GenericHConcatSpec<GenericSpec<U, L, R, F>>;

/**
 * Specs with only primitive marks and without other macros.
 */
export type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec, never, FieldName>;

export type TopLevelFacetSpec = TopLevel<GenericFacetSpec<UnitSpecWithFrame<Field>, LayerSpec<Field>, Field>> &
  DataMixins;

export type NonNormalizedSpec = GenericSpec<FacetedUnitSpec<Field>, LayerSpec<Field>, RepeatSpec, Field>;

/**
 * A Vega-Lite top-level specification.
 * This is the root class for all Vega-Lite specifications.
 * (The json schema is generated from this type.)
 */
export type TopLevelSpec =
  | TopLevelUnitSpec<Field>
  | TopLevelFacetSpec
  | TopLevel<LayerSpec<Field>>
  | TopLevel<RepeatSpec>
  | TopLevel<GenericConcatSpec<NonNormalizedSpec>>
  | TopLevel<GenericVConcatSpec<NonNormalizedSpec>>
  | TopLevel<GenericHConcatSpec<NonNormalizedSpec>>;
