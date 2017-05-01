import { CompositeMark } from './compositemark';
import { Config } from './config';
import { Data } from './data';
import { Encoding, EncodingWithFacet } from './encoding';
import { Facet } from './facet';
import { Field, FieldDef } from './fielddef';
import { Mark, MarkDef } from './mark';
import { Repeat } from './repeat';
import { ResolveMapping } from './resolve';
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
     * Vega-Lite configuration object.
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
     */
    description?: string;
    /**
     * An object describing the data source
     */
    data?: Data;
    /**
     * An array of data transformations such as filter and new field calculation.
     */
    transform?: Transform[];
}
export interface UnitSize {
    /**
     * The width of a single visualization.
     *
     * __Default value:__ This will be determined by the following rules:
     *
     * - For x-axis with a continuous (non-ordinal) scale, the width will be the value of [`config.cell.width`](config.html#cell-config).
     * - For x-axis with an ordinal scale: if [`rangeStep`](scale.html#ordinal) is a numeric value (default), the width is determined by the value of `rangeStep` and the cardinality of the field mapped to x-channel.   Otherwise, if the `rangeStep` is `"fit"`, the width will be the value of [`config.cell.width`](config.html#cell-config).
     * - If no field is mapped to `x` channel, the `width` will be the value of [`config.scale.textXRangeStep`](size.html#default-width-and-height) for `text` mark and the value of `rangeStep` for other marks.
     *
     * __Note__: For plot with `row` and `column` channels, this represents the width of a single cell.
     */
    width?: number;
    /**
     * Height of a single visualization.
     *
     * __Default value:__
     * - For y-axis with a continuous (non-ordinal) scale, the height will be the value of [`config.cell.height`](config.html#cell-config).
     * - For y-axis with an ordinal scale: if [`rangeStep`](scale.html#ordinal) is a numeric value (default), the height is determined by the value of `rangeStep` and the cardinality of the field mapped to y-channel.   Otherwise, if the `rangeStep` is `"fit"`, the height will be the value of [`config.cell.height`](config.html#cell-config).
     * - If no field is mapped to `x` channel, the `height` will be the value of `rangeStep`.
     *
     * __Note__: For plot with `row` and `column` channels, this represents the height of a single cell.
     */
    height?: number;
}
export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, UnitSize {
    /**
     * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"rule"`, and `"text"`) or a [mark definition object](mark.html#mark-def).
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
export declare type UnitSpec = GenericUnitSpec<Encoding<Field>, Mark | MarkDef>;
/**
 * Unit spec that can contain composite mark
 */
export declare type CompositeUnitSpec = GenericUnitSpec<Encoding<Field>, CompositeMark | Mark | MarkDef>;
/**
 * Unit spec that can contain composite mark and row or column channels.
 */
export declare type FacetedCompositeUnitSpec = GenericUnitSpec<EncodingWithFacet<Field>, CompositeMark | Mark | MarkDef>;
export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec, UnitSize {
    /**
     * Unit specs that will be layered.
     */
    layer: (GenericLayerSpec<U> | U)[];
    resolve?: ResolveMapping;
}
export declare type LayerSpec = GenericLayerSpec<UnitSpec>;
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    facet: Facet<Field>;
    spec: GenericLayerSpec<U> | GenericRepeatSpec<U> | U;
}
export declare type FacetSpec = GenericFacetSpec<UnitSpec>;
export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    repeat: Repeat;
    spec: GenericRepeatSpec<U> | GenericLayerSpec<U> | U;
}
export declare type RepeatSpec = GenericRepeatSpec<UnitSpec>;
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    vconcat: (GenericLayerSpec<U> | GenericRepeatSpec<U> | U)[];
}
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    hconcat: (GenericLayerSpec<U> | GenericRepeatSpec<U> | U)[];
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
