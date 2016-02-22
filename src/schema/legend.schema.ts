export interface LegendConfig {
  /**
   * The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".
   */
  orient?: string;
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
  /**
   * Optional mark property definitions for custom legend styling.
   */
  properties?: any; // TODO(#975) replace with config properties
}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface LegendProperties extends LegendConfig {
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
