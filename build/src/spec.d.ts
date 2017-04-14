import { Config } from './config';
import { Data } from './data';
import { Encoding, EncodingWithFacet } from './encoding';
import { Facet } from './facet';
import { FieldDef } from './fielddef';
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
export declare type LayeredUnitSpec = GenericUnitSpec<string | MarkDef, Encoding>;
export declare type FacetedUnitSpec = GenericUnitSpec<string | MarkDef, EncodingWithFacet>;
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
export declare type ExtendedFacetSpec = GenericFacetSpec<FacetedUnitSpec>;
export declare type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U>;
export declare type ExtendedSpec = GenericSpec<FacetedUnitSpec>;
export declare type Spec = GenericSpec<UnitSpec>;
export declare type TopLevelExtendedSpec = TopLevel<ExtendedSpec>;
export declare function isFacetSpec(spec: GenericSpec<GenericUnitSpec<any, any>>): spec is GenericFacetSpec<GenericUnitSpec<any, any>>;
export declare function isUnitSpec(spec: ExtendedSpec | Spec): spec is FacetedUnitSpec | UnitSpec;
export declare function isLayerSpec(spec: ExtendedSpec | Spec): spec is GenericLayerSpec<GenericUnitSpec<any, Encoding>>;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
export declare function normalize(spec: TopLevel<ExtendedSpec>): Spec;
export declare function fieldDefs(spec: ExtendedSpec | ExtendedFacetSpec): FieldDef[];
export declare function isStacked(spec: TopLevel<FacetedUnitSpec>, config?: Config): boolean;
