import { DateTime } from './datetime';
import { Guide, GuideEncodingEntry, VlOnlyGuideConfig } from './guide';
import { AxisOrient, VgAxis, VgAxisBase, VgAxisConfig } from './vega.schema';
export interface AxisConfig extends VgAxisConfig, VlOnlyGuideConfig {
}
export interface Axis extends VgAxisBase, Guide {
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
     * The anchor position of the axis in pixels. For x-axis with top or bottom orientation, this sets the axis group x coordinate. For y-axis with left or right orientation, this sets the axis group y coordinate.
     *
     * __Default value__: `0`
     */
    position?: number;
    /**
     * The rotation angle of the axis labels.
     *
     * __Default value:__ `-90` for nominal and ordinal fields; `0` otherwise.
     *
     * @minimum -360
     * @maximum 360
     */
    labelAngle?: number;
    /**
     * A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.
     * @minimum 0
     *
     * __Default value__: Determine using a formula `ceil(width/40)` for x and `ceil(height/40)` for y.
     */
    tickCount?: number;
    /**
     * Explicitly set the visible axis tick values.
     */
    values?: number[] | DateTime[];
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
export declare const VG_AXIS_PROPERTIES: ("title" | "orient" | "scale" | "zindex" | "ticks" | "labels" | "labelBound" | "labelFlush" | "labelPadding" | "labelOverlap" | "domain" | "grid" | "gridScale" | "tickSize" | "tickCount" | "format" | "values" | "offset" | "position" | "titlePadding" | "minExtent" | "maxExtent" | "encode")[];
export declare const AXIS_PROPERTIES: ("title" | "orient" | "zindex" | "ticks" | "labels" | "labelBound" | "labelFlush" | "labelPadding" | "labelOverlap" | "domain" | "grid" | "tickSize" | "tickCount" | "format" | "values" | "offset" | "position" | "titlePadding" | "minExtent" | "maxExtent" | "encoding" | "labelAngle" | "titleMaxLength")[];
export interface AxisConfigMixins {
    /**
     * Axis configuration, which determines default properties for all `x` and `y` [axes](https://vega.github.io/vega-lite/docs/axis.html). For a full list of axis configuration options, please see the [corresponding section of the axis documentation](https://vega.github.io/vega-lite/docs/axis.html#config).
     */
    axis?: AxisConfig;
    /**
     * X-axis specific config.
     */
    axisX?: VgAxisConfig;
    /**
     * Y-axis specific config.
     */
    axisY?: VgAxisConfig;
    /**
     * Specific axis config for y-axis along the left edge of the chart.
     */
    axisLeft?: VgAxisConfig;
    /**
     * Specific axis config for y-axis along the right edge of the chart.
     */
    axisRight?: VgAxisConfig;
    /**
     * Specific axis config for x-axis along the top edge of the chart.
     */
    axisTop?: VgAxisConfig;
    /**
     * Specific axis config for x-axis along the bottom edge of the chart.
     */
    axisBottom?: VgAxisConfig;
    /**
     * Specific axis config for axes with "band" scales.
     */
    axisBand?: VgAxisConfig;
}
