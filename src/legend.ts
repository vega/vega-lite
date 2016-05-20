export interface LegendConfig {
  /**
   * The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".
   */
  orient?: string;
  /**
   * The offset, in pixels, by which to displace the legend from the edge of the enclosing group or data rectangle.
   */
  offset?: number;
  /**
   * The padding, in pixels, between the lengend and axis.
   */
  padding?: number;
  /**
   * The margin around the legend, in pixels
   */
  margin?: number;
  /**
   * The color of the gradient stroke, can be in hex color code or regular color name.
   */
  gradientStrokeColor?: string;
  /**
   * The width of the gradient stroke, in pixels.
   */
  gradientStrokeWidth?: number;
  /**
   * The height of the gradient, in pixels.
   */
  gradientHeight?: number;
  /**
   * The width of the gradient, in pixels.
   */
  gradientWidth?: number;
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
   * The font of the lengend label.
   */
  labelFont?: string;
  /**
   * The font size of lengend lable.
   */
  labelFontSize?: number;
  /**
   * The offset of the legend label.
   */
  labelOffset?: number;
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
  /**
   * The color of the legend symbol,
   */
  symbolColor?: string;
  /**
   * The shape of the legend symbol, can be the 'circle', 'square', 'cross', 'diamond',
   * 'triangle-up', 'triangle-down'.
   */
  symbolShape?: string;
  /**
   * The size of the lengend symbol, in pixels.
   */
  symbolSize?: number;
  /**
   * The width of the symbol's stroke.
   */
  symbolStrokeWidth?: number;
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
  titleFontWeight?: string;
  /**
   * Optional mark property definitions for custom legend styling.
   */
  properties?: any; // TODO(#975) replace with config properties
}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends LegendConfig {
  /**
   * An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.
   */
  format?: string;
  /**
   * A title for the legend. (Shows field name and its function by default.)
   */
  title?: string;
  /**
   * Explicitly set the visible legend values.
   */
  values?: Array<any>;
}

export const defaultLegendConfig: LegendConfig = {
  orient: undefined, // implicitly "right"
  shortTimeLabels: false
};
