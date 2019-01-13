import { Align, BaseLegend, FontWeight, LabelOverlap, LegendConfig as VgLegendConfig, LegendOrient, Orientation, SymbolShape, TextBaseline } from 'vega';
import { DateTime } from './datetime';
import { Guide, GuideEncodingEntry, VlOnlyGuideConfig } from './guide';
import { Color, VgLayoutAlign } from './vega.schema';
export declare type LegendConfig = LegendMixins & VlOnlyGuideConfig & VgLegendConfig<number, number, string, Color, FontWeight, Align, TextBaseline, VgLayoutAlign, LabelOverlap, SymbolShape> & {
    /**
     * Max legend length for a vertical gradient when `config.legend.gradientLength` is undefined.
     *
     * __Default value:__ `200`
     */
    gradientVerticalMaxLength?: number;
    /**
     * Min legend length for a vertical gradient when `config.legend.gradientLength` is undefined.
     *
     * __Default value:__ `100`
     */
    gradientVerticalMinLength?: number;
    /**
     * Max legend length for a horizontal gradient when `config.legend.gradientLength` is undefined.
     *
     * __Default value:__ `200`
     */
    gradientHorizontalMaxLength?: number;
    /**
     * Min legend length for a horizontal gradient when `config.legend.gradientLength` is undefined.
     *
     * __Default value:__ `100`
     */
    gradientHorizontalMinLength?: number;
    /**
     * The length in pixels of the primary axis of a color gradient. This value corresponds to the height of a vertical gradient or the width of a horizontal gradient.
     *
     * __Default value:__ `undefined`.  If `undefined`, the default gradient will be determined based on the following rules:
     * - For vertical gradients, `clamp(plot_height, gradientVerticalMinLength, gradientVerticalMaxLength)`
     * - For top-`orient`ed or bottom-`orient`ed horizontal gradients, `clamp(plot_width, gradientHorizontalMinLength, gradientHorizontalMaxLength)`
     * - For other horizontal gradients, `gradientHorizontalMinLength`
     *
     * where `clamp(value, min, max)` restricts _value_ to be between the specified _min_ and _max_.
     * @minimum 0
     */
    gradientLength?: number;
};
/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends BaseLegend<number, number, string, Color, FontWeight, Align, TextBaseline, VgLayoutAlign, LabelOverlap, SymbolShape>, LegendMixins, Guide {
    /**
     * Mark definitions for custom legend encoding.
     *
     * @hide
     */
    encoding?: LegendEncoding;
    /**
     * The desired number of tick values for quantitative legends.
     */
    tickCount?: number;
    /**
     * Explicitly set the visible legend values.
     */
    values?: (number | string | boolean | DateTime)[];
    /**
     * The type of the legend. Use `"symbol"` to create a discrete legend and `"gradient"` for a continuous color gradient.
     *
     * __Default value:__ `"gradient"` for non-binned quantitative fields and temporal fields; `"symbol"` otherwise.
     */
    type?: 'symbol' | 'gradient';
    /**
     * A non-positive integer indicating z-index of the legend.
     * If zindex is 0, legend should be drawn behind all chart elements.
     * To put them in front, use zindex = 1.
     *
     * @TJS-type integer
     * @minimum 0
     */
    zindex?: number;
    /**
     * The direction of the legend, one of `"vertical"` or `"horizontal"`.
     *
     * __Default value:__
     * - For top-/bottom-`orient`ed legends, `"horizontal"`
     * - For left-/right-`orient`ed legends, `"vertical"`
     * - For top/bottom-left/right-`orient`ed legends, `"horizontal"` for gradient legends and `"vertical"` for symbol legends.
     */
    direction?: Orientation;
    /**
     * The orientation of the legend, which determines how the legend is positioned within the scene. One of "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "none".
     *
     * __Default value:__ `"right"`
     */
    orient?: LegendOrient;
}
interface LegendMixins {
    /**
     * The strategy to use for resolving overlap of labels in gradient legends. If `false`, no overlap reduction is attempted. If set to `true` or `"parity"`, a strategy of removing every other label is used. If set to `"greedy"`, a linear scan of the labels is performed, removing any label that overlaps with the last visible label (this often works better for log-scaled axes).
     *
     * __Default value:__ `"greedy"` for `log scales otherwise `true`.
     */
    labelOverlap?: LabelOverlap;
}
export interface LegendEncoding {
    /**
     * Custom encoding for the legend container.
     * This can be useful for creating legend with custom x, y position.
     */
    legend?: GuideEncodingEntry;
    /**
     * Custom encoding for the legend title text mark.
     */
    title?: GuideEncodingEntry;
    /**
     * Custom encoding for legend label text marks.
     */
    labels?: GuideEncodingEntry;
    /**
     * Custom encoding for legend symbol marks.
     */
    symbols?: GuideEncodingEntry;
    /**
     * Custom encoding for legend gradient filled rect marks.
     */
    gradient?: GuideEncodingEntry;
}
export declare const defaultLegendConfig: LegendConfig;
export declare const LEGEND_PROPERTIES: ("title" | "padding" | "type" | "values" | "strokeWidth" | "orient" | "cornerRadius" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontWeight" | "titleLimit" | "titlePadding" | "labelColor" | "labelFont" | "labelFontSize" | "labelLimit" | "labelPadding" | "offset" | "format" | "direction" | "tickCount" | "zindex" | "fillColor" | "strokeColor" | "titleAlign" | "titleOpacity" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columns" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelAlign" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOffset" | "labelOverlap")[];
export declare const VG_LEGEND_PROPERTIES: ("title" | "padding" | "type" | "shape" | "values" | "fill" | "stroke" | "opacity" | "strokeWidth" | "size" | "orient" | "cornerRadius" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontWeight" | "titleLimit" | "titlePadding" | "labelColor" | "labelFont" | "labelFontSize" | "labelLimit" | "labelPadding" | "offset" | "format" | "direction" | "tickCount" | "zindex" | "encode" | "fillColor" | "strokeColor" | "titleAlign" | "titleOpacity" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columns" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelAlign" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOffset" | "labelOverlap")[];
export {};
