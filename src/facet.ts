import {FieldDef} from './fielddef';
import {SortOrder} from './sort';


/**
 * Headers of row / column channels for faceted plots.
 */
export interface Header {
  // TODO: labelPadding

  /**
   * The formatting pattern for labels. This is D3's [number format pattern](https://github.com/d3/d3-format#locale_format) for quantitative fields and D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format) for time field.
   *
   * __Default value:__  derived from [numberFormat](config.html#format) config for quantitative fields and from [timeFormat](config.html#format) config for temporal fields.
   */
  format?: string; // default value determined by config.format anyway

  /**
   * A title for the axis. Shows field name and its function by default.
   *
   * __Default value:__  derived from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".
   */
  title?: string;

}

export interface FacetFieldDef<F> extends FieldDef<F> {
  header?: Header;

  /**
   * Sort order for a facet field.
   * This can be `"ascending"`, `"descending"`.
   */
  sort?: SortOrder;
}

export interface Facet<F> {

  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetFieldDef<F>;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetFieldDef<F>;
}
