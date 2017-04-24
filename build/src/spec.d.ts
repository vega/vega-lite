import { CompositeMark } from './compositemark';
import { Config } from './config';
import { Data } from './data';
import { Encoding, EncodingWithFacet } from './encoding';
import { Facet } from './facet';
import { Field, FieldDef } from './fielddef';
import { Mark, MarkDef } from './mark';
import { Repeat } from './repeat';
import { SelectionDef } from './selection';
import { TopLevelProperties } from './toplevelprops';
import { Transform } from './transform';
export declare type TopLevel<S extends BaseSpec> = S & TopLevelProperties & {
    /**
     * URL to JSON schema for this Vega-Lite specification.
     * @format uri
     */
    $schema?: string;
    /**
     * Configuration object
     */
    config?: Config;
};
export interface BaseSpec {
    /**
     * Name of the visualization for later reference.
     */
    name?: string;
    /**
     * An optional description of this mark for commenting purpose.
     * This property has no effect on the output visualization.
     */
    description?: string;
    /**
     * An object describing the data source
     */
    data?: Data;
    /**
     * An object describing filter and new field calculation.
     */
    transform?: Transform[];
}
export interface GenericUnitSpec<M, E extends Encoding<any>> extends BaseSpec {
    width?: number;
    height?: number;
    /**
     * The mark type.
     * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"rule"`, and `"text"`.
     */
    mark: M;
    /**
     * A key-value mapping between encoding channels and definition of fields.
     */
    encoding: E;
    /**
     * A key-value mapping between selection names and definitions.
     */
    selection?: {
        [name: string]: SelectionDef;
    };
}
export declare type UnitSpec = GenericUnitSpec<Mark | MarkDef, Encoding<Field>>;
/**
 * Unit spec that can contain composite mark
 */
export declare type CompositeUnitSpec = GenericUnitSpec<CompositeMark | Mark | MarkDef, Encoding<Field>>;
/**
 * Unit spec that can contain composite mark and row or column channels.
 */
export declare type FacetedCompositeUnitSpec = GenericUnitSpec<CompositeMark | Mark | MarkDef, EncodingWithFacet<Field>>;
export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    width?: number;
    height?: number;
    /**
     * Unit specs that will be layered.
     */
    layer: (GenericLayerSpec<U> | U)[];
}
export declare type LayerSpec = GenericLayerSpec<UnitSpec>;
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    facet: Facet<Field>;
    spec: GenericLayerSpec<U> | U;
}
export declare type FacetSpec = GenericFacetSpec<UnitSpec>;
export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    repeat: Repeat;
    spec: GenericRepeatSpec<U> | GenericLayerSpec<U> | U;
}
export declare type RepeatSpec = GenericRepeatSpec<UnitSpec>;
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    vconcat: (GenericLayerSpec<U> | U)[];
}
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    hconcat: (GenericLayerSpec<U> | U)[];
}
export declare type GenericConcatSpec<U extends GenericUnitSpec<any, any>> = GenericVConcatSpec<U> | GenericHConcatSpec<U>;
export declare type ConcatSpec = GenericConcatSpec<UnitSpec>;
export declare type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U> | GenericRepeatSpec<U> | GenericConcatSpec<U>;
export declare type Spec = GenericSpec<UnitSpec>;
export declare type TopLevelExtendedSpec = TopLevel<FacetedCompositeUnitSpec> | TopLevel<GenericLayerSpec<CompositeUnitSpec>> | TopLevel<GenericFacetSpec<CompositeUnitSpec>> | TopLevel<GenericRepeatSpec<CompositeUnitSpec>> | TopLevel<GenericConcatSpec<CompositeUnitSpec>>;
export declare function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>>;
export declare function isUnitSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is FacetedCompositeUnitSpec | UnitSpec;
export declare function isLayerSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericLayerSpec<GenericUnitSpec<any, any>>;
export declare function isRepeatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericRepeatSpec<GenericUnitSpec<any, any>>;
export declare function isConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericConcatSpec<GenericUnitSpec<any, any>>;
export declare function isVConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericVConcatSpec<GenericUnitSpec<any, any>>;
export declare function isHConcatSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericHConcatSpec<GenericUnitSpec<any, any>>;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
export declare function normalize(spec: TopLevelExtendedSpec, config: Config): Spec;
export declare function fieldDefs(spec: GenericSpec<GenericUnitSpec<any, any>>): FieldDef<Field>[];
export declare function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean;
