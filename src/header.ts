import {Align, Color, FontStyle, FontWeight, Orient, SignalRef, TextBaseline, TitleAnchor, TitleConfig} from 'vega';
import {FormatMixins} from './channeldef';
import {ExprRef} from './expr';
import {Guide, VlOnlyGuideConfig} from './guide';
import {Flag, keys} from './util';

export const HEADER_TITLE_PROPERTIES_MAP: Partial<Record<keyof CoreHeader<any>, keyof TitleConfig>> = {
  titleAlign: 'align',
  titleAnchor: 'anchor',
  titleAngle: 'angle',
  titleBaseline: 'baseline',
  titleColor: 'color',
  titleFont: 'font',
  titleFontSize: 'fontSize',
  titleFontStyle: 'fontStyle',
  titleFontWeight: 'fontWeight',
  titleLimit: 'limit',
  titleLineHeight: 'lineHeight',
  titleOrient: 'orient',
  titlePadding: 'offset'
};

export const HEADER_LABEL_PROPERTIES_MAP: Partial<Record<keyof CoreHeader<any>, keyof TitleConfig>> = {
  labelAlign: 'align',
  labelAnchor: 'anchor',
  labelAngle: 'angle',
  labelBaseline: 'baseline',
  labelColor: 'color',
  labelFont: 'font',
  labelFontSize: 'fontSize',
  labelFontStyle: 'fontStyle',
  labelFontWeight: 'fontWeight',
  labelLimit: 'limit',
  labelLineHeight: 'lineHeight',
  labelOrient: 'orient',
  labelPadding: 'offset'
};

export const HEADER_TITLE_PROPERTIES = keys(HEADER_TITLE_PROPERTIES_MAP);

export const HEADER_LABEL_PROPERTIES = keys(HEADER_LABEL_PROPERTIES_MAP);

export interface CoreHeader<ES extends ExprRef | SignalRef> extends FormatMixins {
  // ---------- Title ----------
  /**
   * The anchor position for placing the title. One of `"start"`, `"middle"`, or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
   */
  titleAnchor?: TitleAnchor; // We don't allow signal for titleAnchor since there is a dependent logic

  /**
   * Horizontal text alignment (to the anchor) of header titles.
   */
  titleAlign?: Align | ES;

  /**
   * The rotation angle of the header title.
   *
   * __Default value:__ `0`.
   *
   * @minimum -360
   * @maximum 360
   */
  titleAngle?: number; // We don't allow signal for titleAngle since there is a dependent logic

  /**
   * The vertical text baseline for the header title. One of `"alphabetic"` (default), `"top"`, `"middle"`, `"bottom"`, `"line-top"`, or `"line-bottom"`.
   * The `"line-top"` and `"line-bottom"` values operate similarly to `"top"` and `"bottom"`, but are calculated relative to the `titleLineHeight` rather than `titleFontSize` alone.
   *
   * __Default value:__ `"middle"`
   */
  titleBaseline?: TextBaseline | ES;

  /**
   * Color of the header title, can be in hex color code or regular color name.
   */
  titleColor?: Color | ES;

  /**
   * Font of the header title. (e.g., `"Helvetica Neue"`).
   */
  titleFont?: string | ES;

  /**
   * Font size of the header title.
   *
   * @minimum 0
   */
  titleFontSize?: number | ES;

  /**
   * The font style of the header title.
   */
  titleFontStyle?: FontStyle | ES;

  /**
   * Font weight of the header title.
   * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
   */
  titleFontWeight?: FontWeight | ES;

  /**
   * The maximum length of the header title in pixels. The text value will be automatically truncated if the rendered size exceeds the limit.
   *
   * __Default value:__ `0`, indicating no limit
   */
  titleLimit?: number | ES;

  /**
   * Line height in pixels for multi-line header title text or title text with `"line-top"` or `"line-bottom"` baseline.
   */
  titleLineHeight?: number | ES;

  /**
   * The orientation of the header title. One of `"top"`, `"bottom"`, `"left"` or `"right"`.
   */
  titleOrient?: Orient; // no signal ref since there is a dependent logic

  /**
   * The padding, in pixel, between facet header's title and the label.
   *
   * __Default value:__ `10`
   */
  titlePadding?: number | ES;

  // ---------- Label ----------

  /**
   * A boolean flag indicating if labels should be included as part of the header.
   *
   * __Default value:__ `true`.
   */
  labels?: boolean;

  /**
   * Horizontal text alignment of header labels. One of `"left"`, `"center"`, or `"right"`.
   */
  labelAlign?: Align | ES;

  /**
   * The vertical text baseline for the header labels. One of `"alphabetic"` (default), `"top"`, `"middle"`, `"bottom"`, `"line-top"`, or `"line-bottom"`.
   * The `"line-top"` and `"line-bottom"` values operate similarly to `"top"` and `"bottom"`, but are calculated relative to the `titleLineHeight` rather than `titleFontSize` alone.
   *
   */
  labelBaseline?: TextBaseline | ES;

  /**
   * The anchor position for placing the labels. One of `"start"`, `"middle"`, or `"end"`. For example, with a label orientation of top these anchor positions map to a left-, center-, or right-aligned label.
   */
  labelAnchor?: TitleAnchor;

  /**
   * [Vega expression](https://vega.github.io/vega/docs/expressions/) for customizing labels.
   *
   * __Note:__ The label text and value can be assessed via the `label` and `value` properties of the header's backing `datum` object.
   */
  labelExpr?: string;

  /**
   * The rotation angle of the header labels.
   *
   * __Default value:__ `0` for column header, `-90` for row header.
   *
   * @minimum -360
   * @maximum 360
   */
  labelAngle?: number; // no signal ref since there is a dependent logic

  /**
   * The color of the header label, can be in hex color code or regular color name.
   */
  labelColor?: Color | ES;

  /**
   * The font of the header label.
   */
  labelFont?: string | ES;

  /**
   * The font size of the header label, in pixels.
   *
   * @minimum 0
   */
  labelFontSize?: number | ES;

  /**
   * The font style of the header label.
   */
  labelFontStyle?: FontStyle | ES;

  /**
   * The font weight of the header label.
   */
  labelFontWeight?: FontWeight | ES;

  /**
   * The maximum length of the header label in pixels. The text value will be automatically truncated if the rendered size exceeds the limit.
   *
   * __Default value:__ `0`, indicating no limit
   */
  labelLimit?: number | ES;

  /**
   * Line height in pixels for multi-line header labels or title text with `"line-top"` or `"line-bottom"` baseline.
   */
  labelLineHeight?: number | ES;

  /**
   * The orientation of the header label. One of `"top"`, `"bottom"`, `"left"` or `"right"`.
   */
  labelOrient?: Orient; // no signal ref since there is a dependent logic

  /**
   * The padding, in pixel, between facet header's label and the plot.
   *
   * __Default value:__ `10`
   */
  labelPadding?: number | ES;

  /**
   * Shortcut for setting both labelOrient and titleOrient.
   */
  orient?: Orient; // no signal ref since there is a dependent logic
}

export interface HeaderConfig<ES extends ExprRef | SignalRef> extends CoreHeader<ES>, VlOnlyGuideConfig {}

/**
 * Headers of row / column channels for faceted plots.
 */
export interface Header<ES extends ExprRef | SignalRef> extends CoreHeader<ES>, Guide {}

export interface HeaderConfigMixins<ES extends ExprRef | SignalRef> {
  /**
   * Header configuration, which determines default properties for all [headers](https://vega.github.io/vega-lite/docs/header.html).
   *
   * For a full list of header configuration options, please see the [corresponding section of in the header documentation](https://vega.github.io/vega-lite/docs/header.html#config).
   */
  header?: HeaderConfig<ES>;

  /**
   * Header configuration, which determines default properties for row [headers](https://vega.github.io/vega-lite/docs/header.html).
   *
   * For a full list of header configuration options, please see the [corresponding section of in the header documentation](https://vega.github.io/vega-lite/docs/header.html#config).
   */
  headerRow?: HeaderConfig<ES>;

  /**
   * Header configuration, which determines default properties for column [headers](https://vega.github.io/vega-lite/docs/header.html).
   *
   * For a full list of header configuration options, please see the [corresponding section of in the header documentation](https://vega.github.io/vega-lite/docs/header.html#config).
   */
  headerColumn?: HeaderConfig<ES>;

  /**
   * Header configuration, which determines default properties for non-row/column facet [headers](https://vega.github.io/vega-lite/docs/header.html).
   *
   * For a full list of header configuration options, please see the [corresponding section of in the header documentation](https://vega.github.io/vega-lite/docs/header.html#config).
   */
  headerFacet?: HeaderConfig<ES>;
}

const HEADER_CONFIGS_INDEX: Flag<keyof HeaderConfigMixins<any>> = {
  header: 1,
  headerRow: 1,
  headerColumn: 1,
  headerFacet: 1
};

export const HEADER_CONFIGS = keys(HEADER_CONFIGS_INDEX);
