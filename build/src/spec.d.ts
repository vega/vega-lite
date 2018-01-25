import { Config } from './config';
import { Data } from './data';
import { Encoding, EncodingWithFacet } from './encoding';
import { FacetMapping } from './facet';
import { FieldDef, RepeatRef } from './fielddef';
import { AnyMark, Mark, MarkDef } from './mark';
import { Projection } from './projection';
import { Repeat } from './repeat';
import { Resolve } from './resolve';
import { SelectionDef } from './selection';
import { TitleParams } from './title';
import { TopLevelProperties } from './toplevelprops';
import { Transform } from './transform';
export declare type TopLevel<S extends BaseSpec> = S & TopLevelProperties & {
    /**
     * URL to [JSON schema](http://json-schema.org/) for a Vega-Lite specification. Unless you have a reason to change this, use `https://vega.github.io/schema/vega-lite/v2.json`. Setting the `$schema` property allows automatic validation and autocomplete in editors that support JSON schema.
     * @format uri
     */
    $schema?: string;
    /**
     * Vega-Lite configuration object.  This property can only be defined at the top-level of a specification.
     */
    config?: Config;
};
export interface BaseSpec {
    /**
     * Title for the plot.
     */
    title?: string | TitleParams;
    /**
     * Name of the visualization for later reference.
     */
    name?: string;
    /**
     * Description of this mark for commenting purpose.
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
export interface LayoutSizeMixins {
    /**
     * The width of a visualization.
     *
     * __Default value:__ This will be determined by the following rules:
     *
     * - If a view's [`autosize`](size.html#autosize) type is `"fit"` or its x-channel has a [continuous scale](scale.html#continuous), the width will be the value of [`config.view.width`](spec.html#config).
     * - For x-axis with a band or point scale: if [`rangeStep`](scale.html#band) is a numeric value or unspecified, the width is [determined by the range step, paddings, and the cardinality of the field mapped to x-channel](scale.html#band).   Otherwise, if the `rangeStep` is `null`, the width will be the value of [`config.view.width`](spec.html#config).
     * - If no field is mapped to `x` channel, the `width` will be the value of [`config.scale.textXRangeStep`](size.html#default-width-and-height) for `text` mark and the value of `rangeStep` for other marks.
     *
     * __Note:__ For plots with [`row` and `column` channels](encoding.html#facet), this represents the width of a single view.
     *
     * __See also:__ The documentation for [width and height](size.html) contains more examples.
     */
    width?: number;
    /**
     * The height of a visualization.
     *
     * __Default value:__
     * - If a view's [`autosize`](size.html#autosize) type is `"fit"` or its y-channel has a [continuous scale](scale.html#continuous), the height will be the value of [`config.view.height`](spec.html#config).
     * - For y-axis with a band or point scale: if [`rangeStep`](scale.html#band) is a numeric value or unspecified, the height is [determined by the range step, paddings, and the cardinality of the field mapped to y-channel](scale.html#band). Otherwise, if the `rangeStep` is `null`, the height will be the value of [`config.view.height`](spec.html#config).
     * - If no field is mapped to `y` channel, the `height` will be the value of `rangeStep`.
     *
     * __Note__: For plots with [`row` and `column` channels](encoding.html#facet), this represents the height of a single view.
     *
     * __See also:__ The documentation for [width and height](size.html) contains more examples.
     */
    height?: number;
}
export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, LayoutSizeMixins {
    /**
     * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * * `"area"`, `"point"`, `"rule"`, `"geoshape"`, and `"text"`) or a [mark definition object](mark.html#mark-def).
     */
    mark: M;
    /**
     * A key-value mapping between encoding channels and definition of fields.
     */
    encoding: E;
    /**
     * An object defining properties of geographic projection.
     *
     * Works with `"geoshape"` marks and `"point"` or `"line"` marks that have a channel (one or more of `"X"`, `"X2"`, `"Y"`, `"Y2"`) with type `"latitude"`, or `"longitude"`.
     */
    projection?: Projection;
    /**
     * A key-value mapping between selection names and definitions.
     */
    selection?: {
        [name: string]: SelectionDef;
    };
}
export declare type UnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, Mark | MarkDef>;
/**
 * Unit spec that can have a composite mark.
 */
export declare type CompositeUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, AnyMark>;
/**
 * Unit spec that can have a composite mark and row or column channels.
 */
export declare type FacetedCompositeUnitSpec = GenericUnitSpec<EncodingWithFacet<string | RepeatRef>, AnyMark>;
export interface GenericLayerSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec, LayoutSizeMixins {
    /**
     * Layer or single view specifications to be layered.
     *
     * __Note__: Specifications inside `layer` cannot use `row` and `column` channels as layering facet specifications is not allowed.
     */
    layer: (GenericLayerSpec<U> | U)[];
    /**
     * Scale, axis, and legend resolutions for layers.
     */
    resolve?: Resolve;
}
export declare type LayerSpec = GenericLayerSpec<UnitSpec>;
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    /**
     * An object that describes mappings between `row` and `column` channels and their field definitions.
     */
    facet: FacetMapping<string | RepeatRef>;
    /**
     * A specification of the view that gets faceted.
     */
    spec: GenericLayerSpec<U> | U;
    /**
     * Scale, axis, and legend resolutions for facets.
     */
    resolve?: Resolve;
}
export declare type FacetSpec = GenericFacetSpec<UnitSpec>;
export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    /**
     * An object that describes what fields should be repeated into views that are laid out as a `row` or `column`.
     */
    repeat: Repeat;
    spec: GenericSpec<U>;
    /**
     * Scale and legend resolutions for repeated charts.
     */
    resolve?: Resolve;
}
export declare type RepeatSpec = GenericRepeatSpec<UnitSpec>;
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    /**
     * A list of views that should be concatenated and put into a column.
     */
    vconcat: (GenericSpec<U>)[];
    /**
     * Scale, axis, and legend resolutions for vertically concatenated charts.
     */
    resolve?: Resolve;
}
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>> extends BaseSpec {
    /**
     * A list of views that should be concatenated and put into a row.
     */
    hconcat: (GenericSpec<U>)[];
    /**
     * Scale, axis, and legend resolutions for horizontally concatenated charts.
     */
    resolve?: Resolve;
}
export declare type ConcatSpec = GenericVConcatSpec<UnitSpec> | GenericHConcatSpec<UnitSpec>;
export declare type GenericSpec<U extends GenericUnitSpec<any, any>> = U | GenericLayerSpec<U> | GenericFacetSpec<U> | GenericRepeatSpec<U> | GenericVConcatSpec<U> | GenericHConcatSpec<U>;
export declare type Spec = GenericSpec<UnitSpec>;
export declare type TopLevelExtendedSpec = TopLevel<FacetedCompositeUnitSpec> | TopLevel<GenericLayerSpec<CompositeUnitSpec>> | TopLevel<GenericFacetSpec<CompositeUnitSpec>> | TopLevel<GenericRepeatSpec<CompositeUnitSpec>> | TopLevel<GenericVConcatSpec<CompositeUnitSpec>> | TopLevel<GenericHConcatSpec<CompositeUnitSpec>>;
export declare function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<GenericUnitSpec<any, any>>;
export declare function isUnitSpec(spec: BaseSpec): spec is FacetedCompositeUnitSpec | UnitSpec;
export declare function isLayerSpec(spec: BaseSpec): spec is GenericLayerSpec<GenericUnitSpec<any, any>>;
export declare function isRepeatSpec(spec: BaseSpec): spec is GenericRepeatSpec<GenericUnitSpec<any, any>>;
export declare function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<GenericUnitSpec<any, any>> | GenericHConcatSpec<GenericUnitSpec<any, any>>;
export declare function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<GenericUnitSpec<any, any>>;
export declare function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<GenericUnitSpec<any, any>>;
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
export declare function normalize(spec: TopLevelExtendedSpec, config: Config): Spec;
export declare function fieldDefs(spec: GenericSpec<GenericUnitSpec<any, any>>): FieldDef<any>[];
export declare function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean;
