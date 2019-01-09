import { Config } from '../config';
import { TypedFieldDef } from '../fielddef';
import { DataMixins } from './base';
import { GenericHConcatSpec, GenericVConcatSpec } from './concat';
import { GenericFacetSpec } from './facet';
import { ExtendedLayerSpec, GenericLayerSpec, NormalizedLayerSpec } from './layer';
import { GenericRepeatSpec } from './repeat';
import { TopLevel } from './toplevel';
import { FacetedCompositeUnitSpec, GenericUnitSpec, NormalizedUnitSpec } from './unit';
export { normalizeTopLevelSpec as normalize } from '../normalize';
export { BaseSpec, DataMixins, LayoutSizeMixins } from './base';
export { GenericHConcatSpec, GenericVConcatSpec, isConcatSpec, isHConcatSpec, isVConcatSpec, NormalizedConcatSpec } from './concat';
export { GenericFacetSpec, isFacetSpec, NormalizedFacetSpec } from './facet';
export { ExtendedLayerSpec, GenericLayerSpec, isLayerSpec, NormalizedLayerSpec } from './layer';
export { GenericRepeatSpec, isRepeatSpec, NormalizedRepeatSpec } from './repeat';
export { TopLevel } from './toplevel';
export { CompositeUnitSpec, FacetedCompositeUnitSpec, GenericUnitSpec, isUnitSpec, NormalizedUnitSpec } from './unit';
export declare type GenericSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> = U | L | GenericFacetSpec<U, L> | GenericRepeatSpec<U, L> | GenericVConcatSpec<U, L> | GenericHConcatSpec<U, L>;
export declare type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export declare type TopLevelFacetedUnitSpec = TopLevel<FacetedCompositeUnitSpec> & DataMixins;
export declare type TopLevelFacetSpec = TopLevel<GenericFacetSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;
/**
 * A Vega-Lite top-level specification.
 * This is the root class for all Vega-Lite specifications.
 * (The json schema is generated from this type.)
 */
export declare type TopLevelSpec = TopLevelFacetedUnitSpec | TopLevelFacetSpec | TopLevel<ExtendedLayerSpec> | TopLevel<GenericRepeatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericVConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericHConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>;
export declare function fieldDefs(spec: GenericSpec<any, any>): TypedFieldDef<any>[];
export declare function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean;
/**
 * Takes a spec and returns a list of fields used in encoding
 */
export declare function usedFields(spec: NormalizedSpec): string[];
