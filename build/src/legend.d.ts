import { DateTime } from './datetime';
import { VgLegendEncode, VgLegendBase, VgLegendConfig } from './vega.schema';
export interface LegendConfig extends VgLegendConfig {
    /**
     * Whether month names and weekday names should be abbreviated.
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
     */
    format?: string;
    /**
     * The desired number of tick values for quantitative legends.
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
export declare const defaultLegendConfig: LegendConfig;
export declare const LEGEND_PROPERTIES: (keyof Legend)[];
