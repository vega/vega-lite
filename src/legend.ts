import {DateTime} from './datetime';
import {VgLegendEncode, VgLegendBase} from './vega.schema';

export interface LegendConfig extends LegendBase {
  // ---------- Gradient ----------
  /**
   * The color of the gradient stroke, can be in hex color code or regular color name.
   */
  gradientStrokeColor?: string;

  /**
   * The width of the gradient stroke, in pixels.
   * @mimimum 0
   */
  gradientStrokeWidth?: number;

  /**
   * The height of the gradient, in pixels.
   * @mimimum 0
   */
  gradientHeight?: number;

  /**
   * The width of the gradient, in pixels.
   * @mimimum 0
   */
  gradientWidth?: number;

  // ---------- Label ----------
  /**
   * The alignment of the legend label, can be left, middle or right.
   */
  labelAlign?: string;

  /**
   * The position of the baseline of legend label, can be top, middle or bottom.
   */
  labelBaseline?: string;

  /**
   * The color of the legend label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the legend label.
   */
  labelFont?: string;

  /**
   * The font size of legend label.
   * @mimimum 0
   */
  labelFontSize?: number;

  /**
   * The offset of the legend label.
   * @mimimum 0
   */
  labelOffset?: number;

  // ---------- Symbols ----------
  /**
   * The color of the legend symbol,
   */
  symbolColor?: string;

  /**
   * The shape of the legend symbol, can be the 'circle', 'square', 'cross', 'diamond',
   * 'triangle-up', 'triangle-down', or else a custom SVG path string.
   */
  symbolType?: string;

  /**
   * The size of the legend symbol, in pixels.
   * @mimimum 0
   */
  symbolSize?: number;

  /**
   * The width of the symbol's stroke.
   * @minimum 0
   */
  symbolStrokeWidth?: number;

  // ---------- Title ----------
  /**
   * Optional mark property definitions for custom legend styling.
   */
  /**
   * The color of the legend title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * The font of the legend title.
   */
  titleFont?: string;

  /**
   * The font size of the legend title.
   */
  titleFontSize?: number;

  /**
   * The font weight of the legend title.
   */
  titleFontWeight?: string | number;

  /**
   * The padding, in pixels, between title and legend.
   */
  titlePadding?: number;
}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends LegendBase {
  /**
   * Optional mark definitions for custom legend encoding.
   */
  encode?: VgLegendEncode;

  /**
   * An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.
   */
  format?: string;

  /**
   * The number of ticks for legend.
   */
  tickCount?: number;

  /**
   * A title for the legend. (Shows field name and its function by default.)
   */
  title?: string;
  /**
   * Explicitly set the visible legend values.
   */
  values?: number[] | string[] | DateTime[];

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

export interface VlLegendBase {
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
}

export interface LegendBase extends VgLegendBase, VlLegendBase {}

export const defaultLegendConfig: LegendConfig = {
  orient: undefined, // implicitly "right"
};

export const LEGEND_PROPERTIES:(keyof Legend)[] = ['entryPadding', 'format', 'offset', 'orient', 'tickCount', 'title', 'type', 'values' ,'zindex'];

export const LEGEND_BASE_PROPERTIES:(keyof VlLegendBase)[] = ['shortTimeLabels'];
