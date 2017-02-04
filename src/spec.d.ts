import { Config } from './config';
import { Data } from './data';
import { EncodingWithFacet, Encoding } from './encoding';
import { Facet } from './facet';
import { FieldDef } from './fielddef';
import { Mark, AnyMark } from './mark';
import { Transform } from './transform';
export declare type Padding = number | {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};
export interface BaseSpec {
    /**
     * URL to JSON schema for this Vega-Lite specification.
     * @format uri
     */
    $schema?: string;
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
     * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle. This can be a single number or an object with `"top"`, `"left"`, `"right"`, `"bottom"` properties.
     *
     * __Default value__: `5`
     *
     * @minimum 0
     */
    padding?: Padding;
    /**
     * An object describing the data source
     */
    data?: Data;
    /**
     * An object describing filter and new field calculation.
     */
    transform?: Transform;
    /**
     * Configuration object
     */
    config?: Config;
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
}
export declare type UnitSpec = GenericUnitSpec<Mark, Encoding>;
export declare type FacetedUnitSpec = GenericUnitSpec<AnyMark, EncodingWithFacet>;
export interface GenericLayerSpec<M, E> extends BaseSpec {
    width?: number;
    height?: number;
    /**
     * Unit specs that will be layered.
     */
    layer: (GenericLayerSpec<M, E> | GenericUnitSpec<M, E>)[];
}
export declare type LayerSpec = GenericLayerSpec<Mark, Encoding>;
export interface GenericFacetSpec<M, E> extends BaseSpec {
    facet: Facet;
    spec: GenericLayerSpec<M, E> | GenericUnitSpec<M, E>;
}
export declare type FacetSpec = GenericFacetSpec<Mark, Encoding>;
export declare type ExtendedFacetSpec = GenericFacetSpec<AnyMark, EncodingWithFacet>;
export declare type GenericSpec<M, E> = GenericUnitSpec<M, E> | GenericLayerSpec<M, E> | GenericFacetSpec<M, E>;
export declare type ExtendedSpec = GenericSpec<AnyMark, EncodingWithFacet>;
export declare type Spec = GenericSpec<Mark, Encoding>;
export declare function isFacetSpec(spec: GenericSpec<AnyMark, any>): spec is GenericFacetSpec<AnyMark, any>;
export declare function isFacetedUnitSpec(spec: ExtendedSpec): spec is FacetedUnitSpec;
export declare function isUnitSpec(spec: ExtendedSpec): spec is FacetedUnitSpec | UnitSpec;
export declare function isLayerSpec(spec: ExtendedSpec | Spec): spec is GenericLayerSpec<AnyMark | Mark, Encoding>;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
export declare function normalize(spec: ExtendedSpec | Spec): Spec;
export declare function fieldDefs(spec: ExtendedSpec | ExtendedFacetSpec): FieldDef[];
export declare function isStacked(spec: FacetedUnitSpec): boolean;
