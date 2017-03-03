import { DateTime } from './datetime';
import { VgAxisEncode } from './vega.schema';
export declare type AxisOrient = 'top' | 'right' | 'left' | 'bottom';
export interface AxisConfig {
    /**
     * Width of the axis line
     */
    axisWidth?: number;
    /**
     * A non-positive integer indicating z-index of the axis.
     * If zindex is 0, axes should be drawn behind all chart elements.
     * To put them in front, use zindex = 1.
     * @TJS-type integer
     * @minimum 0
     */
    zindex?: number;
    /**
     * The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.
     */
    offset?: number;
    /**
     * Color of axis line.
     */
    axisColor?: string;
    /**
     * Whether to include the axis domain line.
     */
    domain?: boolean;
    /**
     * A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.
     */
    grid?: boolean;
    /**
     * Color of gridlines.
     */
    gridColor?: string;
    /**
     * The offset (in pixels) into which to begin drawing with the grid dash array.
     * @minimum 0
     */
    gridDash?: number[];
    /**
     * The stroke opacity of grid (value between [0,1])
     * @minimum 0
     * @maximum 1
     */
    gridOpacity?: number;
    /**
     * The grid width, in pixels.
     * @minimum 0
     */
    gridWidth?: number;
    /**
     * Enable or disable labels.
     */
    labels?: boolean;
    /**
     * The rotation angle of the axis labels.
     * @minimum 0
     * @minimum 360
     */
    labelAngle?: number;
    /**
     * Text alignment for the Label.
     */
    labelAlign?: string;
    /**
     * Text baseline for the label.
     */
    labelBaseline?: string;
    /**
     * Truncate labels that are too long.
     * @minimum 1
     * @TJS-type integer
     */
    labelMaxLength?: number;
    /**
     * The padding, in pixels, between axis and text labels.
     */
    labelPadding?: number;
    /**
     * Whether month and day names should be abbreviated.
     */
    shortTimeLabels?: boolean;
    position?: number;
    /**
     * If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.
     * @minimum 0
     * @TJS-type integer
     */
    subdivide?: number;
    /**
     * Whether the axis should include ticks.
     */
    ticks?: boolean;
    /**
     * A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.
     * @minimum 0
     * @TJS-type integer
     */
    tickCount?: number;
    /**
     * The color of the axis's tick.
     */
    tickColor?: string;
    /**
     * The color of the tick label, can be in hex color code or regular color name.
     */
    tickLabelColor?: string;
    /**
     * The font of the tick label.
     */
    tickLabelFont?: string;
    /**
     * The font size of label, in pixels.
     * @minimum 0
     */
    tickLabelFontSize?: number;
    /**
     * The padding, in pixels, between ticks and text labels.
     */
    tickPadding?: number;
    /**
     * The size, in pixels, of major, minor and end ticks.
     * @minimum 0
     */
    tickSize?: number;
    /**
     * The size, in pixels, of major ticks.
     * @minimum 0
     */
    tickSizeMajor?: number;
    /**
     * The size, in pixels, of minor ticks.
     * @minimum 0
     */
    tickSizeMinor?: number;
    /**
     * The size, in pixels, of end ticks.
     * @minimum 0
     */
    tickSizeEnd?: number;
    /**
     * The width, in pixels, of ticks.
     * @minimum 0
     */
    tickWidth?: number;
    /**
     * Color of the title, can be in hex color code or regular color name.
     */
    titleColor?: string;
    /**
     * Font of the title.
     */
    titleFont?: string;
    /**
     * Size of the title.
     * @minimum 0
     */
    titleFontSize?: number;
    /**
     * Weight of the title.
     */
    titleFontWeight?: string | number;
    /**
     * A title offset value for the axis.
     */
    titleOffset?: number;
    /**
     * Max length for axis title if the title is automatically generated from the field's description. By default, this is automatically based on cell size and characterWidth property.
     * @minimum 0
     * @TJS-type integer
     */
    titleMaxLength?: number;
    /**
     * The padding, in pixels, between title and axis.
     */
    titlePadding?: number;
    /**
     * Optional mark definitions for custom axis encoding.
     */
    encode?: VgAxisEncode;
    /**
     * Minimum extent, which determines the offset between axis ticks and labels.
     */
    minExtent?: number;
    /**
     * Maximum extent, which determines the offset between axis ticks and labels.
     */
    maxExtent?: number;
}
export declare const defaultAxisConfig: AxisConfig;
export declare const defaultFacetAxisConfig: AxisConfig;
export interface Axis extends AxisConfig {
    /**
     * The rotation angle of the axis labels.
     * @minimum 0
     * @maximum 360
     */
    labelAngle?: number;
    /**
     * The formatting pattern for axis labels.
     */
    format?: string;
    /**
     * The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).
     */
    orient?: AxisOrient;
    /**
     * A title for the axis. Shows field name and its function by default.
     */
    title?: string;
    values?: number[] | DateTime[];
}
export declare const AXIS_PROPERTIES: (keyof Axis)[];
