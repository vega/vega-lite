import {DateTime} from './datetime';
import {VgLegendBase, VgLegendConfig, VgLegendEncode} from './vega.schema';

export interface LegendConfig extends VgLegendConfig {
  /**
   * Whether month names and weekday names should be abbreviated.
   *
   * __Default value:__  `false`
   */
  shortTimeLabels?: boolean;
}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends VgLegendBase {
  /**
   * Optional mark definitions for custom legend encoding.
   */
  encode?: VgLegendEncode;

  /**
   * An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.
   *
   * __Default value:__  derived from [`numberFormat`](config.html#format) config for quantitative axis and from [`timeFormat`](config.html#format) config for time axis.
   */
  format?: string;

  /**
   * The desired number of tick values for quantitative legends.
   */
  tickCount?: number;

  /**
   * A title for the legend. (Shows field name and its function by default.)
   *
   * __Default value:__  derived from the field's name and transformation function applied e.g, "field_name", "SUM(field_name)", "BIN(field_name)", "YEAR(field_name)".
   */
  title?: string;
  /**
   * Explicitly set the visible legend values.
   */
  values?: number[] | string[] | DateTime[];

  /**
   * The name of a scale that maps to a shape value.
   */
  shape?: string;

  /**
   * The type of the legend. Use `symbol` to create a discrete legend and `gradient` for a continuous color gradient.
   */
  type?: 'symbol' | 'gradient';

  /**
   * A non-positive integer indicating z-index of the legend.
   * If zindex is 0, legend should be drawn behind all chart elements.
   * To put them in front, use zindex = 1.
   * @TJS-type integer
   * @minimum 0
   */
  zindex?: number;
}

export const defaultLegendConfig: LegendConfig = {
  orient: undefined, // implicitly "right"
};

export const LEGEND_PROPERTIES:(keyof Legend)[] = ['entryPadding', 'format', 'offset', 'orient', 'tickCount', 'title', 'type', 'values' ,'zindex'];
