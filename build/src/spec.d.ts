import { Config } from './config';
import { Data } from './data';
import { Encoding, EncodingWithFacet } from './encoding';
import { Facet } from './facet';
import { FieldDef } from './fielddef';
import { CompositeMark } from './compositemark';
import { Mark, MarkDef } from './mark';
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
export interface GenericUnitSpec<M, E extends Encoding> extends BaseSpec {
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
export declare type UnitSpec = GenericUnitSpec<Mark | MarkDef, Encoding>;
/**
 * Unit spec that can contain composite mark
 */
export declare type CompositeUnitSpec = GenericUnitSpec<CompositeMark | Mark | MarkDef, Encoding>;
/**
 * Unit spec that can contain composite mark and row or column channels.
 */
export declare type FacetedCompositeUnitSpec = GenericUnitSpec<CompositeMark | Mark | MarkDef, EncodingWithFacet>;
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
    facet: Facet;
    spec: GenericLayerSpec<U> | U;
}
export declare type FacetSpec = GenericFacetSpec<UnitSpec>;
export declare type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U>;
export declare type Spec = GenericSpec<UnitSpec>;
export declare type TopLevelExtendedSpec = TopLevel<FacetedCompositeUnitSpec> | TopLevel<GenericLayerSpec<CompositeUnitSpec>> | TopLevel<GenericFacetSpec<CompositeUnitSpec>>;
export declare function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>>;
export declare function isUnitSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is FacetedCompositeUnitSpec | UnitSpec;
export declare function isLayerSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericLayerSpec<GenericUnitSpec<any, any>>;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
export declare function normalize(spec: TopLevelExtendedSpec): Spec;
export declare function fieldDefs(spec: GenericSpec<GenericUnitSpec<any, any>>): FieldDef[];
export declare function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean;
