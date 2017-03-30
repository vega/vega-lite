import { DateTime } from './datetime';
import { VgAxisBase, VgAxisConfig, VgAxisEncode } from './vega.schema';
export declare type AxisOrient = 'top' | 'right' | 'left' | 'bottom';
export interface AxisConfig extends VgAxisConfig {
    /**
     * Whether month names and weekday names should be abbreviated.
     */
    shortTimeLabels?: boolean;
}
export interface Axis extends VgAxisBase {
    /**
     * The padding, in pixels, between axis and text labels.
     */
    labelPadding?: number;
    /**
     * The formatting pattern for axis labels.
     */
    format?: string;
    /**
     * The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).
     */
    orient?: AxisOrient;
    /**
     * The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.
     */
    offset?: number;
    /**
     * The anchor position of the axis in pixels. For x-axis with top or bottom orientation, this sets the axis group x coordinate. For y-axis with left or right orientation, this sets the axis group y coordinate.
     *
     * __Default value__: `0`
     */
    position?: number;
    /**
     * A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.
     * @minimum 0
     * @TJS-type integer
     */
    tickCount?: number;
    /**
     * A title for the axis. Shows field name and its function by default.
     */
    title?: string;
    values?: number[] | DateTime[];
    /**
     * A non-positive integer indicating z-index of the axis.
     * If zindex is 0, axes should be drawn behind all chart elements.
     * To put them in front, use zindex = 1.
     * @TJS-type integer
     * @minimum 0
     */
    zindex?: number;
    /**
     * Optional mark definitions for custom axis encoding.
     */
    encode?: VgAxisEncode;
}
export declare const AXIS_PROPERTIES: (keyof Axis)[];
