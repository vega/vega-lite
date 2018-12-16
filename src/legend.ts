import {
  Align,
  BaseLegend,
  FontWeight,
  LabelOverlap,
  Legend as VgLegend,
  LegendConfig as VgLegendConfig,
  LegendOrient,
  Orientation,
  SymbolShape,
  TextBaseline
} from 'vega';
import {DateTime} from './datetime';
import {Guide, GuideEncodingEntry, VlOnlyGuideConfig} from './guide';
import {Flag, flagKeys} from './util';
import {Color, VgLayoutAlign} from './vega.schema';

export type LegendConfig = LegendMixins &
  VlOnlyGuideConfig &
  VgLegendConfig<
    number,
    number,
    string,
    Color,
    FontWeight,
    Align,
    TextBaseline,
    VgLayoutAlign,
    LabelOverlap,
    SymbolShape
  > & {
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
export interface Legend
  extends BaseLegend<
      number,
      number,
      string,
      Color,
      FontWeight,
      Align,
      TextBaseline,
      VgLayoutAlign,
      LabelOverlap,
      SymbolShape
    >,
    LegendMixins,
    Guide {
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

// Change comments to be Vega-Lite specific
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

export const defaultLegendConfig: LegendConfig = {
  gradientHorizontalMaxLength: 200,
  gradientHorizontalMinLength: 100,
  gradientVerticalMaxLength: 200,
  gradientVerticalMinLength: 64 // This is the Vega's minimum.
};

const COMMON_LEGEND_PROPERTY_INDEX: Flag<keyof (VgLegend | Legend)> = {
  clipHeight: 1,
  columnPadding: 1,
  columns: 1,
  cornerRadius: 1,
  direction: 1,
  fillColor: 1,
  format: 1,
  gradientLength: 1,
  gradientOpacity: 1,
  gradientStrokeColor: 1,
  gradientStrokeWidth: 1,
  gradientThickness: 1,
  gridAlign: 1,
  labelAlign: 1,
  labelBaseline: 1,
  labelColor: 1,
  labelFont: 1,
  labelFontSize: 1,
  labelFontWeight: 1,
  labelLimit: 1,
  labelOffset: 1,
  labelOpacity: 1,
  labelOverlap: 1,
  labelPadding: 1,
  offset: 1,
  orient: 1,
  padding: 1,
  rowPadding: 1,
  strokeColor: 1,
  strokeWidth: 1,
  symbolFillColor: 1,
  symbolOffset: 1,
  symbolOpacity: 1,
  symbolSize: 1,
  symbolStrokeColor: 1,
  symbolStrokeWidth: 1,
  symbolType: 1,
  tickCount: 1,
  title: 1,
  titleAlign: 1,
  titleBaseline: 1,
  titleColor: 1,
  titleFont: 1,
  titleFontSize: 1,
  titleFontWeight: 1,
  titleLimit: 1,
  titleOpacity: 1,
  titlePadding: 1,
  type: 1,
  values: 1,
  zindex: 1
};

const VG_LEGEND_PROPERTY_INDEX: Flag<Exclude<keyof VgLegend, 'strokeDash'>> = {
  ...COMMON_LEGEND_PROPERTY_INDEX,
  // channel scales
  opacity: 1,
  shape: 1,
  stroke: 1,
  fill: 1,
  size: 1,
  // encode
  encode: 1
};

export const LEGEND_PROPERTIES = flagKeys(COMMON_LEGEND_PROPERTY_INDEX);

export const VG_LEGEND_PROPERTIES = flagKeys(VG_LEGEND_PROPERTY_INDEX);
