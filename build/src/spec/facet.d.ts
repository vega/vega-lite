import { BinParams } from '../bin';
import { ChannelDef, Field, FieldDef, TypedFieldDef } from '../channeldef';
import { Header } from '../header';
import { EncodingSortField, SortArray, SortOrder } from '../sort';
import { StandardType } from '../type';
import { BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins } from './base';
import { FacetMapping } from './facet';
import { GenericLayerSpec, NormalizedLayerSpec } from './layer';
import { GenericUnitSpec, NormalizedUnitSpec } from './unit';
export interface FacetFieldDef<F extends Field> extends TypedFieldDef<F, StandardType, boolean | BinParams | null> {
    /**
     * An object defining properties of a facet's header.
     */
    header?: Header;
    /**
     * Sort order for the encoded field.
     *
     * For continuous fields (quantitative or temporal), `sort` can be either `"ascending"` or `"descending"`.
     *
     * For discrete fields, `sort` can be one of the following:
     * - `"ascending"` or `"descending"` -- for sorting by the values' natural order in Javascript.
     * - [A sort field definition](https://vega.github.io/vega-lite/docs/sort.html#sort-field) for sorting by another field.
     * - [An array specifying the field values in preferred order](https://vega.github.io/vega-lite/docs/sort.html#sort-array). In this case, the sort order will obey the values in the array, followed by any unspecified values in their original order.  For discrete time field, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).
     * - `null` indicating no sort.
     *
     * __Default value:__ `"ascending"`
     *
     * __Note:__ `null` is not supported for `row` and `column`.
     */
    sort?: SortArray | SortOrder | EncodingSortField<F> | null;
}
export interface FacetMapping<F extends Field> {
    /**
     * A field definition for the vertical facet of trellis plots.
     */
    row?: FacetFieldDef<F>;
    /**
     * A field definition for the horizontal facet of trellis plots.
     */
    column?: FacetFieldDef<F>;
}
export declare function isFacetMapping<F extends Field>(f: FacetFieldDef<F> | FacetMapping<F>): f is FacetMapping<F>;
/**
 * Facet mapping for encoding macro
 */
export interface EncodingFacetMapping<F extends Field> extends FacetMapping<F> {
    /**
     * A field definition for the (flexible) facet of trellis plots.
     *
     * If either `row` or `column` is specified, this channel will be ignored.
     */
    facet?: FacetFieldDef<F>;
}
export declare function isFacetFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is FacetFieldDef<F>;
/**
 * Base interface for a facet specification.
 */
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>> extends BaseSpec, GenericCompositionLayoutWithColumns, ResolveMixins {
    /**
     * Definition for how to facet the data.  One of:
     * 1) [a field definition for faceting the plot by one field](https://vega.github.io/vega-lite/docs/facet.html#field-def)
     * 2) [An object that maps `row` and `column` channels to their field definitions](https://vega.github.io/vega-lite/docs/facet.html#mapping)
     */
    facet: FacetFieldDef<Field> | FacetMapping<Field>;
    /**
     * A specification of the view that gets faceted.
     */
    spec: L | U;
}
/**
 * A facet specification without any shortcut / expansion syntax
 */
export declare type NormalizedFacetSpec = GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec>;
export declare function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<any, any>;
//# sourceMappingURL=facet.d.ts.map