import { Align, BaseLegend, Color, FontStyle, FontWeight, LabelOverlap, LegendConfig as VgLegendConfig, LegendOrient, Orient, Orientation, SymbolShape, TextBaseline, TitleAnchor } from 'vega';
import { DateTime } from './datetime';
import { Guide, GuideEncodingEntry, VlOnlyGuideConfig } from './guide';
import { LayoutAlign } from './vega.schema';
export declare type LegendConfig = LegendMixins & VlOnlyGuideConfig & VgLegendConfig<number, number, string, Color, FontWeight, FontStyle, Align, TextBaseline, LayoutAlign, LabelOverlap, SymbolShape, number[], Orient, TitleAnchor, LegendOrient> & {
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
export interface Legend extends BaseLegend<number, number, string, Color, FontWeight, FontStyle, Align, TextBaseline, LayoutAlign, LabelOverlap, SymbolShape, number[], Orient, TitleAnchor, LegendOrient>, LegendMixins, Guide {
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
     * The minimum desired step between legend ticks, in terms of scale domain values. For example, a value of `1` indicates that ticks should not be less than 1 unit apart. If `tickMinStep` is specified, the `tickCount` value will be adjusted, if necessary, to enforce the minimum step value.
     *
     * __Default value__: `undefined`
     */
    tickMinStep?: number;
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
     * A non-negative integer indicating the z-index of the legend.
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
     * The orientation of the legend, which determines how the legend is positioned within the scene. One of `"left"`, `"right"`, `"top"`, `"bottom"`, `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`, `"none"`.
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
export declare const LEGEND_PROPERTIES: ("values" | "cornerRadius" | "orient" | "columns" | "titleAnchor" | "titleAlign" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOrient" | "titlePadding" | "labelAlign" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelLimit" | "labelPadding" | "format" | "formatType" | "offset" | "zindex" | "type" | "padding" | "title" | "labelOverlap" | "fillColor" | "strokeColor" | "legendX" | "legendY" | "titleOpacity" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolDash" | "symbolDashOffset" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOffset" | "labelSeparation" | "tickCount" | "tickMinStep" | "direction")[];
export declare const VG_LEGEND_PROPERTIES: ("fill" | "stroke" | "opacity" | "strokeWidth" | "size" | "shape" | "values" | "cornerRadius" | "orient" | "columns" | "titleAnchor" | "titleAlign" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOrient" | "titlePadding" | "labelAlign" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelLimit" | "labelPadding" | "format" | "formatType" | "offset" | "zindex" | "encode" | "type" | "padding" | "title" | "labelOverlap" | "fillColor" | "strokeColor" | "legendX" | "legendY" | "titleOpacity" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolDash" | "symbolDashOffset" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelBaseline" | "labelFontWeight" | "labelOpacity" | "labelOffset" | "labelSeparation" | "tickCount" | "tickMinStep" | "direction")[];
export {};
//# sourceMappingURL=legend.d.ts.map