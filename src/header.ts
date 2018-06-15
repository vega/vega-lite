import {TextBaseline} from '../node_modules/vega';
import {Guide} from './guide';
import {FontWeight, VgEncodeEntry, VgTitleConfig} from './vega.schema';

export const HEADER_TITLE_PROPERTIES_MAP: {
  [k in keyof HeaderConfig]: keyof VgEncodeEntry
} = {
  titleAlign: 'align',
  titleAngle: 'angle',
  titleBaseline: 'baseline',
  titleColor: 'fill',
  titleFont: 'font',
  titleFontSize: 'fontSize',
  titleFontWeight: 'fontWeight',
  titleLimit: 'limit',
  titleX: 'x',
  titleY: 'y'
};

export const HEADER_LABEL_PROPERTIES_MAP: {
  [k in keyof HeaderConfig]: keyof VgTitleConfig
} = {
  labelAngle: 'angle',
  labelColor: 'color',
  labelFont: 'font',
  labelFontSize: 'fontSize',
  labelLimit: 'limit',
};

export const HEADER_TITLE_PROPERTIES = Object.keys(HEADER_TITLE_PROPERTIES_MAP);

export const HEADER_LABEL_PROPERTIES = Object.keys(HEADER_LABEL_PROPERTIES_MAP);

export interface HeaderConfig {
  // ---------- Title ----------
  /**
   * Horizontal text alignment of the header title.
   */
  titleAlign?: string;

  /**
   * The rotation angle of the header title.
   *
   * __Default value:__ `0`.
   *
   * @minimum -360
   * @maximum 360
   */
  titleAngle?: number;
  /**
   * Vertical text baseline for the header title. One of `"top"`, `"bottom"`, `"middle"`.
   *
   * __Default value:__ `"middle"`
   */
  titleBaseline?: TextBaseline;
  /**
   * Color of the header title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * Font of the header title. (e.g., `"Helvetica Neue"`).
   */
  titleFont?: string;

  /**
   * Font size of the header title.
   *
   * @minimum 0
   */
  titleFontSize?: number;

  /**
   * Font weight of the header title.
   * This can be either a string (e.g `"bold"`, `"normal"`) or a number (`100`, `200`, `300`, ..., `900` where `"normal"` = `400` and `"bold"` = `700`).
   */
  titleFontWeight?: FontWeight;

  /**
   * The maximum length of the header title in pixels. The text value will be automatically truncated if the rendered size exceeds the limit.
   *
   * __Default value:__ `0`, indicating no limit
   */
  titleLimit?: number;

  /**
   * X-coordinate of the header title relative to the axis group.
   */
  titleX?: number;

  /**
   * Y-coordinate of the header title relative to the axis group.
   */
  titleY?: number;

  // ---------- Label ----------
  /**
   * The rotation angle of the header labels.
   *
   * __Default value:__ `0`.
   *
   * @minimum -360
   * @maximum 360
   */
  labelAngle?: number;

  /**
   * The color of the header label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the header label.
   */
  labelFont?: string;

  /**
   * The font size of the header label, in pixels.
   *
   * @minimum 0
   */
  labelFontSize?: number;

  /**
   * The maximum length of the header label in pixels. The text value will be automatically truncated if the rendered size exceeds the limit.
   *
   * __Default value:__ `0`, indicating no limit
   */
  labelLimit?: number;
}

/**
 * Headers of row / column channels for faceted plots.
 */
export interface Header extends HeaderConfig, Guide {}
