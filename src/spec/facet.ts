import {ChannelDef, Field, FieldDef, TypedFieldDef} from '../fielddef';
import {Header} from '../header';
import {EncodingSortField, SortArray, SortOrder} from '../sort';
import {BaseSpec, GenericCompositionLayout} from './base';
import {FacetMapping} from './facet';
import {GenericLayerSpec, NormalizedLayerSpec} from './layer';
import {GenericUnitSpec, NormalizedUnitSpec} from './unit';

export interface FacetFieldDef<F extends Field> extends TypedFieldDef<F> {
  /**
   * An object defining properties of a facet's header.
   */
  header?: Header;

  // Note: `"sort"` for facet field def is different from encoding field def as it does not support `SortByEncoding`

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
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef<F>;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef<F>;
}

export function isFacetMapping<F extends Field>(f: FacetFieldDef<F> | FacetMapping<F>): f is FacetMapping<F> {
  return !!f['row'] || !!f['column'];
}

/**
 * Facet mapping for encoding macro
 */
export interface EncodingFacetMapping<F extends Field> extends FacetMapping<F> {
  /**
   * Faceted field for trellis plots.
   * If either `row` or `column` is specified, this channel will be ignored.
   */
  facet?: FacetFieldDef<F>;
}

export function isFacetFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is FacetFieldDef<F> {
  return !!channelDef && !!channelDef['header'];
}

/**
 * Base interface for a facet specification.
 */
export interface GenericFacetSpec<U extends GenericUnitSpec<any, any>, L extends GenericLayerSpec<any>>
  extends BaseSpec,
    GenericCompositionLayout {
  /**
   * A field definition for faceting the plot or an object that describes mappings between `row` and `column` channels and their field definitions.
   */
  facet: FacetFieldDef<Field> | FacetMapping<Field>;

  /**
   * A specification of the view that gets faceted.
   */
  spec: L | U;
  // TODO: replace this with GenericSpec<U> once we support all cases;
}

/**
 * A facet specification without any shortcut / expansion syntax
 */
export type NormalizedFacetSpec = GenericFacetSpec<NormalizedUnitSpec, NormalizedLayerSpec>;

export function isFacetSpec(spec: BaseSpec): spec is GenericFacetSpec<any, any> {
  return spec['facet'] !== undefined;
}
