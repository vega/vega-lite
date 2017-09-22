import {DateTime} from './datetime';
import {Guide, GuideEncodingEntry, VlOnlyGuideConfig} from './guide';
import {Flag, flagKeys} from './util';
import {VgLegend, VgLegendBase, VgLegendConfig} from './vega.schema';


export interface LegendConfig extends VgLegendConfig, VlOnlyGuideConfig {}

/**
 * Properties of a legend or boolean flag for determining whether to show it.
 */
export interface Legend extends VgLegendBase, Guide {
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
  values?: number[] | string[] | DateTime[];

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
   * @TJS-type integer
   * @minimum 0
   */
  zindex?: number;
}

export type LegendEncoding = {
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
};

export const defaultLegendConfig: LegendConfig = {};

const COMMON_LEGEND_PROPERTY_INDEX: Flag<keyof (VgLegend | Legend)> = {
  entryPadding: 1,
  format: 1,
  offset: 1,
  orient: 1,
  padding: 1,
  tickCount: 1,
  title: 1,
  type: 1,
  values: 1,
  zindex: 1
};

const VG_LEGEND_PROPERTY_INDEX: Flag<keyof VgLegend> = {
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
