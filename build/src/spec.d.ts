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
import { ConcatLayout, GenericCompositionLayout, TopLevelProperties } from './toplevelprops';
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
export declare type BaseSpec = Partial<DataMixins> & {
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
};
export interface DataMixins {
    /**
     * An object describing the data source
     */
    data: Data;
}
export interface LayoutSizeMixins {
    /**
     * The width of a visualization.
     *
     * __Default value:__ This will be determined by the following rules:
     *
     * - If a view's [`autosize`](https://vega.github.io/vega-lite/docs/size.html#autosize) type is `"fit"` or its x-channel has a [continuous scale](https://vega.github.io/vega-lite/docs/scale.html#continuous), the width will be the value of [`config.view.width`](https://vega.github.io/vega-lite/docs/spec.html#config).
     * - For x-axis with a band or point scale: if [`rangeStep`](https://vega.github.io/vega-lite/docs/scale.html#band) is a numeric value or unspecified, the width is [determined by the range step, paddings, and the cardinality of the field mapped to x-channel](https://vega.github.io/vega-lite/docs/scale.html#band).   Otherwise, if the `rangeStep` is `null`, the width will be the value of [`config.view.width`](https://vega.github.io/vega-lite/docs/spec.html#config).
     * - If no field is mapped to `x` channel, the `width` will be the value of [`config.scale.textXRangeStep`](https://vega.github.io/vega-lite/docs/size.html#default-width-and-height) for `text` mark and the value of `rangeStep` for other marks.
     *
     * __Note:__ For plots with [`row` and `column` channels](https://vega.github.io/vega-lite/docs/encoding.html#facet), this represents the width of a single view.
     *
     * __See also:__ The documentation for [width and height](https://vega.github.io/vega-lite/docs/size.html) contains more examples.
     */
    width?: number;
    /**
     * The height of a visualization.
     *
     * __Default value:__
     * - If a view's [`autosize`](https://vega.github.io/vega-lite/docs/size.html#autosize) type is `"fit"` or its y-channel has a [continuous scale](https://vega.github.io/vega-lite/docs/scale.html#continuous), the height will be the value of [`config.view.height`](https://vega.github.io/vega-lite/docs/spec.html#config).
     * - For y-axis with a band or point scale: if [`rangeStep`](https://vega.github.io/vega-lite/docs/scale.html#band) is a numeric value or unspecified, the height is [determined by the range step, paddings, and the cardinality of the field mapped to y-channel](https://vega.github.io/vega-lite/docs/scale.html#band). Otherwise, if the `rangeStep` is `null`, the height will be the value of [`config.view.height`](https://vega.github.io/vega-lite/docs/spec.html#config).
     * - If no field is mapped to `y` channel, the `height` will be the value of `rangeStep`.
     *
     * __Note__: For plots with [`row` and `column` channels](https://vega.github.io/vega-lite/docs/encoding.html#facet), this represents the height of a single view.
     *
     * __See also:__ The documentation for [width and height](https://vega.github.io/vega-lite/docs/size.html) contains more examples.
     */
    height?: number;
}
export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, LayoutSizeMixins {
    /**
     * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"rule"`, `"geoshape"`, and `"text"`) or a [mark definition object](https://vega.github.io/vega-lite/docs/mark.html#mark-def).
     */
    mark: M;
    /**
     * A key-value mapping between encoding channels and definition of fields.
     */
    encoding?: E;
    /**
     * An object defining properties of geographic projection, which will be applied to `shape` path for `"geoshape"` marks
     * and to `latitude` and `"longitude"` channels for other marks.
     */
    projection?: Projection;
    /**
     * A key-value mapping between selection names and definitions.
     */
    selection?: {
        [name: string]: SelectionDef;
    };
}
export declare type NormalizedUnitSpec = GenericUnitSpec<Encoding<string | RepeatRef>, Mark | MarkDef>;
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
/**
 * Layer Spec with encoding and projection
 */
export interface ExtendedLayerSpec extends GenericLayerSpec<CompositeUnitSpec> {
    /**
     * A shared key-value mapping between encoding channels and definition of fields in the underlying layers.
     */
    encoding?: Encoding<string | RepeatRef>;
    /**
     * An object defining properties of the geographic projection shared by underlying layers.
     */
    projection?: Projection;
}
export declare type NormalizedLayerSpec = GenericLayerSpec<NormalizedUnitSpec>;
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, GenericCompositionLayout {
    /**
     * An object that describes mappings between `row` and `column` channels and their field definitions.
     */
    facet: FacetMapping<string | RepeatRef>;
    /**
     * A specification of the view that gets faceted.
     */
    spec: L | U;
    /**
     * Scale, axis, and legend resolutions for facets.
     */
    resolve?: Resolve;
}
export declare type NormalizedFacetSpec = GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export interface GenericRepeatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, GenericCompositionLayout {
    /**
     * An object that describes what fields should be repeated into views that are laid out as a `row` or `column`.
     */
    repeat: Repeat;
    spec: GenericSpec<U, L>;
    /**
     * Scale and legend resolutions for repeated charts.
     */
    resolve?: Resolve;
}
export declare type NormalizedRepeatSpec = GenericRepeatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export interface GenericVConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, ConcatLayout {
    /**
     * A list of views that should be concatenated and put into a column.
     */
    vconcat: (GenericSpec<U, L>)[];
    /**
     * Scale, axis, and legend resolutions for vertically concatenated charts.
     */
    resolve?: Resolve;
}
export interface GenericHConcatSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, ConcatLayout {
    /**
     * A list of views that should be concatenated and put into a row.
     */
    hconcat: (GenericSpec<U, L>)[];
    /**
     * Scale, axis, and legend resolutions for horizontally concatenated charts.
     */
    resolve?: Resolve;
}
export declare type NormalizedConcatSpec = GenericVConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec> | GenericHConcatSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export declare type GenericSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> = U | L | GenericFacetSpec<U, L> | GenericRepeatSpec<U, L> | GenericVConcatSpec<U, L> | GenericHConcatSpec<U, L>;
export declare type NormalizedSpec = GenericSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export declare type TopLevelFacetedUnitSpec = TopLevel<FacetedCompositeUnitSpec> & DataMixins;
export declare type TopLevelFacetSpec = TopLevel<GenericFacetSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> & DataMixins;
export declare type TopLevelSpec = TopLevelFacetedUnitSpec | TopLevelFacetSpec | TopLevel<ExtendedLayerSpec> | TopLevel<GenericRepeatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericVConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>> | TopLevel<GenericHConcatSpec<FacetedCompositeUnitSpec, ExtendedLayerSpec>>;
export declare function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<any, any>;
export declare function isUnitSpec(spec: BaseSpec): spec is FacetedCompositeUnitSpec | NormalizedUnitSpec;
export declare function isLayerSpec(spec: BaseSpec): spec is GenericLayerSpec<any>;
export declare function isRepeatSpec(spec: BaseSpec): spec is GenericRepeatSpec<any, any>;
export declare function isConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any> | GenericHConcatSpec<any, any>;
export declare function isVConcatSpec(spec: BaseSpec): spec is GenericVConcatSpec<any, any>;
export declare function isHConcatSpec(spec: BaseSpec): spec is GenericHConcatSpec<any, any>;
export { normalizeTopLevelSpec as normalize } from './normalize';
export declare function fieldDefs(spec: GenericSpec<any, any>): FieldDef<any>[];
export declare function isStacked(spec: TopLevel<FacetedCompositeUnitSpec>, config?: Config): boolean;
