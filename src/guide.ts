export interface Guide {
  /**
   * The formatting pattern for labels. This is D3's [number format pattern](https://github.com/mbostock/d3/wiki/Formatting) for quantitative fields and D3's [time format pattern](https://github.com/mbostock/d3/wiki/Time-Formatting) for time field.
   *
   * __Default value:__  derived from [numberFormat](config.html#format) config for quantitative fields and from [timeFormat](config.html#format) config for temporal fields.
   */
  format?: string;

  /**
   * A title for the field.
   *
   * __Default value:__  derived from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".
   */
  title?: string;
}
