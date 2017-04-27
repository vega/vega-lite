import {FieldDef} from './fielddef';

/**
 * Headers of row / column channels for faceted plots.
 */
export interface Header {
  // TODO: labelPadding

  /**
   * The formatting pattern for axis labels. This is D3's [number format pattern](https://github.com/mbostock/d3/wiki/Formatting) for quantitative axis and D3's [time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting) for time axis.
   *
   * __Default value:__  derived from [numberFormat](config.html#format) config for quantitative axis and from [timeFormat](config.html#format) config for time axis.
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
