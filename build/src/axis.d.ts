import { Align, Axis as VgAxis, AxisOrient, BaseAxis, FontWeight, LabelOverlap, TextBaseline } from 'vega';
import { DateTime } from './datetime';
import { Guide, GuideEncodingEntry, VlOnlyGuideConfig } from './guide';
import { Color, VgLayoutAlign } from './vega.schema';
declare type BaseAxisNoSignals = AxisMixins & BaseAxis<number, number, boolean, number | boolean, string, Color, FontWeight, Align, TextBaseline, VgLayoutAlign, LabelOverlap, number[]>;
declare type VgAxisConfigNoSignals = BaseAxisNoSignals;
interface AxisMixins {
    /**
     * A boolean flag indicating if grid lines should be included as part of the axis
     *
     * __Default value:__ `true` for [continuous scales](https://vega.github.io/vega-lite/docs/scale.html#continuous) that are not binned; otherwise, `false`.
     */
    grid?: boolean;
    /**
     * Indicates if the first and last axis labels should be aligned flush with the scale range. Flush alignment for a horizontal axis will left-align the first label and right-align the last label. For vertical axes, bottom and top text baselines are applied instead. If this property is a number, it also indicates the number of pixels by which to offset the first and last labels; for example, a value of 2 will flush-align the first and last labels and also push them 2 pixels outward from the center of the axis. The additional adjustment can sometimes help the labels better visually group with corresponding axis ticks.
     *
     * __Default value:__ `true` for axis of a continuous x-scale. Otherwise, `false`.
     */
    labelFlush?: boolean | number;
    /**
     * The strategy to use for resolving overlap of axis labels. If `false` (the default), no overlap reduction is attempted. If set to `true` or `"parity"`, a strategy of removing every other label is used (this works well for standard linear axes). If set to `"greedy"`, a linear scan of the labels is performed, removing any labels that overlaps with the last visible label (this often works better for log-scaled axes).
     *
     * __Default value:__ `true` for non-nominal fields with non-log scales; `"greedy"` for log scales; otherwise `false`.
     */
    labelOverlap?: LabelOverlap;
}
export declare type AxisConfig = VgAxisConfigNoSignals & VlOnlyGuideConfig;
export interface Axis extends BaseAxisNoSignals, Guide {
    /**
     * The orientation of the axis. One of `"top"`, `"bottom"`, `"left"` or `"right"`. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).
     *
     * __Default value:__ `"bottom"` for x-axes and `"left"` for y-axes.
     */
    orient?: AxisOrient;
    /**
     * The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.
     *
     * __Default value:__ derived from the [axis config](https://vega.github.io/vega-lite/docs/config.html#facet-scale-config)'s `offset` (`0` by default)
     */
    offset?: number;
    /**
     * The anchor position of the axis in pixels. For x-axes with top or bottom orientation, this sets the axis group x coordinate. For y-axes with left or right orientation, this sets the axis group y coordinate.
     *
     * __Default value__: `0`
     */
    position?: number;
    /**
     * A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.
     * @minimum 0
     *
     * __Default value__: Determine using a formula `ceil(width/40)` for x and `ceil(height/40)` for y.
     */
    tickCount?: number;
    /**
     * A desired step size for ticks. This property will generate the corresponding `tickCount` and `values`. It can be useful for [data that are binned before importing into Vega-Lite](https://vega.github.io/vega-lite/docs/bin.html#binned).
     *
     * __Default value__: `undefined`
     */
    tickStep?: number;
    /**
     * Explicitly set the visible axis tick values.
     */
    values?: number[] | string[] | boolean[] | DateTime[];
    /**
     * A non-positive integer indicating z-index of the axis.
     * If zindex is 0, axes should be drawn behind all chart elements.
     * To put them in front, use `"zindex = 1"`.
     *
     * __Default value:__ `1` (in front of the marks) for actual axis and `0` (behind the marks) for grids.
     *
     * @TJS-type integer
     * @minimum 0
     */
    zindex?: number;
    /**
     * Mark definitions for custom axis encoding.
     *
     * @hide
     */
    encoding?: AxisEncoding;
}
export declare type AxisPart = keyof AxisEncoding;
export declare const AXIS_PARTS: AxisPart[];
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 * (Properties not listed are applicable for both)
 */
export declare const AXIS_PROPERTY_TYPE: {
    [k in keyof VgAxis]: 'main' | 'grid' | 'both';
};
export interface AxisEncoding {
    /**
     * Custom encoding for the axis container.
     */
    axis?: GuideEncodingEntry;
    /**
     * Custom encoding for the axis domain rule mark.
     */
    domain?: GuideEncodingEntry;
    /**
     * Custom encoding for axis gridline rule marks.
     */
    grid?: GuideEncodingEntry;
    /**
     * Custom encoding for axis label text marks.
     */
    labels?: GuideEncodingEntry;
    /**
     * Custom encoding for axis tick rule marks.
     */
    ticks?: GuideEncodingEntry;
    /**
     * Custom encoding for the axis title text mark.
     */
    title?: GuideEncodingEntry;
}
export declare function isAxisProperty(prop: string): prop is keyof Axis;
export declare const VG_AXIS_PROPERTIES: ("title" | "values" | "domain" | "ticks" | "orient" | "titleAngle" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontWeight" | "titleLimit" | "titlePadding" | "labelAngle" | "labelColor" | "labelFont" | "labelFontSize" | "labelLimit" | "labelPadding" | "offset" | "format" | "tickCount" | "zindex" | "encode" | "titleAlign" | "titleOpacity" | "labelAlign" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOverlap" | "scale" | "grid" | "labelFlush" | "minExtent" | "maxExtent" | "bandPosition" | "titleX" | "titleY" | "domainColor" | "domainOpacity" | "domainWidth" | "tickColor" | "tickExtra" | "tickOffset" | "tickOpacity" | "tickRound" | "tickSize" | "tickWidth" | "gridColor" | "gridDash" | "gridOpacity" | "gridWidth" | "labels" | "labelBound" | "labelFlushOffset" | "gridScale" | "position")[];
export declare const AXIS_PROPERTIES: ("title" | "values" | "domain" | "encoding" | "ticks" | "orient" | "titleAngle" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontWeight" | "titleLimit" | "titlePadding" | "labelAngle" | "labelColor" | "labelFont" | "labelFontSize" | "labelLimit" | "labelPadding" | "offset" | "format" | "tickCount" | "zindex" | "titleAlign" | "titleOpacity" | "labelAlign" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOverlap" | "grid" | "labelFlush" | "minExtent" | "maxExtent" | "bandPosition" | "titleX" | "titleY" | "domainColor" | "domainOpacity" | "domainWidth" | "tickColor" | "tickExtra" | "tickOffset" | "tickOpacity" | "tickRound" | "tickSize" | "tickWidth" | "gridColor" | "gridDash" | "gridOpacity" | "gridWidth" | "labels" | "labelBound" | "labelFlushOffset" | "position" | "tickStep")[];
export interface AxisConfigMixins {
    /**
     * Axis configuration, which determines default properties for all `x` and `y` [axes](https://vega.github.io/vega-lite/docs/axis.html). For a full list of axis configuration options, please see the [corresponding section of the axis documentation](https://vega.github.io/vega-lite/docs/axis.html#config).
     */
    axis?: AxisConfig;
    /**
     * X-axis specific config.
     */
    axisX?: AxisConfig;
    /**
     * Y-axis specific config.
     */
    axisY?: AxisConfig;
    /**
     * Specific axis config for y-axis along the left edge of the chart.
     */
    axisLeft?: AxisConfig;
    /**
     * Specific axis config for y-axis along the right edge of the chart.
     */
    axisRight?: AxisConfig;
    /**
     * Specific axis config for x-axis along the top edge of the chart.
     */
    axisTop?: AxisConfig;
    /**
     * Specific axis config for x-axis along the bottom edge of the chart.
     */
    axisBottom?: AxisConfig;
    /**
     * Specific axis config for axes with "band" scales.
     */
    axisBand?: AxisConfig;
}
export {};
