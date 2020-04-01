import {Align, Color, MarkConfig as VgMarkConfig, Orientation, SignalRef, TextBaseline} from 'vega';
import {toSet} from 'vega-util';
import {Gradient} from './channeldef';
import {CompositeMark, CompositeMarkDef} from './compositemark';
import {contains, Flag, keys} from './util';

export const ARC: 'arc' = 'arc';
export const AREA: 'area' = 'area';
export const BAR: 'bar' = 'bar';
export const IMAGE: 'image' = 'image';
export const LINE: 'line' = 'line';
export const POINT: 'point' = 'point';
export const RECT: 'rect' = 'rect';
export const RULE: 'rule' = 'rule';
export const TEXT: 'text' = 'text';
export const TICK: 'tick' = 'tick';
export const TRAIL: 'trail' = 'trail';
export const CIRCLE: 'circle' = 'circle';
export const SQUARE: 'square' = 'square';
export const GEOSHAPE: 'geoshape' = 'geoshape';

/**
 * All types of primitive marks.
 */
export type Mark =
  | typeof ARC
  | typeof AREA
  | typeof BAR
  | typeof LINE
  | typeof IMAGE
  | typeof TRAIL
  | typeof POINT
  | typeof TEXT
  | typeof TICK
  | typeof RECT
  | typeof RULE
  | typeof CIRCLE
  | typeof SQUARE
  | typeof GEOSHAPE;

// Using mapped type to declare index, ensuring we always have all marks when we add more.
const MARK_INDEX: Flag<Mark> = {
  arc: 1,
  area: 1,
  bar: 1,
  image: 1,
  line: 1,
  point: 1,
  text: 1,
  tick: 1,
  trail: 1,
  rect: 1,
  geoshape: 1,
  rule: 1,
  circle: 1,
  square: 1
};

export function isMark(m: string): m is Mark {
  return !!MARK_INDEX[m];
}

export function isPathMark(m: Mark | CompositeMark): m is 'line' | 'area' | 'trail' {
  return contains(['line', 'area', 'trail'], m);
}

export function isRectBasedMark(m: Mark | CompositeMark): m is 'rect' | 'bar' | 'image' | 'arc' {
  return contains(['rect', 'bar', 'image', 'arc' /* arc is rect/interval in polar coordinate */], m);
}

export const PRIMITIVE_MARKS = keys(MARK_INDEX);

export interface ColorMixins {
  /**
   * Default color.
   *
   * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
   *
   * __Note:__
   * - This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
   * - The `fill` and `stroke` properties have higher precedence than `color` and will override `color`.
   */
  color?: Color | Gradient | SignalRef;
}

export interface TooltipContent {
  content: 'encoding' | 'data';
}

/** @hidden */
export type Hide = 'hide';

export interface VLOnlyMarkConfig extends ColorMixins {
  /**
   * Whether the mark's color should be used as fill color instead of stroke color.
   *
   * __Default value:__ `false` for all `point`, `line`, and `rule` marks as well as `geoshape` marks for [`graticule`](https://vega.github.io/vega-lite/docs/data.html#graticule) data sources; otherwise, `true`.
   *
   * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
   *
   */
  filled?: boolean;

  /**
   * Defines how Vega-Lite should handle marks for invalid values (`null` and `NaN`).
   * - If set to `"filter"` (default), all data items with null values will be skipped (for line, trail, and area marks) or filtered (for other marks).
   * - If `null`, all data items are included. In this case, invalid values will be interpreted as zeroes.
   */
  invalid?: 'filter' | Hide | null;

  /**
   * For line and trail marks, this `order` property can be set to `null` or `false` to make the lines use the original order in the data sources.
   */
  order?: null | boolean;

  /**
   * Default relative band position for a time unit. If set to `0`, the marks will be positioned at the beginning of the time unit band step.
   * If set to `0.5`, the marks will be positioned in the middle of the time unit band step.
   */
  timeUnitBandPosition?: number;

  /**
   * Default relative band size for a time unit. If set to `1`, the bandwidth of the marks will be equal to the time unit band step.
   * If set to `0.5`, bandwidth of the marks will be half of the time unit band step.
   */
  timeUnitBand?: number;

  /**
   * The end angle of arc marks in radians. A value of 0 indicates up or “north”, increasing values proceed clockwise.
   */
  theta2?: number | SignalRef; // In Vega, this is called endAngle

  /**
   * The inner radius in pixels of arc marks.
   *
   * @minimum 0
   * __Default value:__ `0`
   */
  radius2?: number | SignalRef; // In Vega, this is called innerRadius
}

export interface MarkConfig extends VLOnlyMarkConfig, Omit<VgMarkConfig, 'tooltip'> {
  // ========== Overriding Vega ==========

  /**
   * The tooltip text string to show upon mouse hover or an object defining which fields should the tooltip be derived from.
   *
   * - If `tooltip` is `true` or `{"content": "encoding"}`, then all fields from `encoding` will be used.
   * - If `tooltip` is `{"content": "data"}`, then all fields that appear in the highlighted data point will be used.
   * - If set to `null` or `false`, then no tooltip will be used.
   *
   * See the [`tooltip`](https://vega.github.io/vega-lite/docs/tooltip.html) documentation for a detailed discussion about tooltip  in Vega-Lite.
   *
   * __Default value:__ `null`
   */
  tooltip?: number | string | boolean | TooltipContent | null; // VL has a special object form for tooltip content

  /**
   * Default size for marks.
   * - For `point`/`circle`/`square`, this represents the pixel area of the marks. Note that this value sets the area of the symbol; the side lengths will increase with the square root of this value.
   * - For `bar`, this represents the band size of the bar, in pixels.
   * - For `text`, this represents the font size, in pixels.
   *
   * __Default value:__
   * - `30` for point, circle, square marks; width/height's `step`
   * - `2` for bar marks with discrete dimensions;
   * - `5` for bar marks with continuous dimensions;
   * - `11` for text marks.
   *
   * @minimum 0
   */
  size?: number | SignalRef; // size works beyond symbol marks in VL

  /**
   * X coordinates of the marks, or width of horizontal `"bar"` and `"area"` without specified `x2` or `width`.
   *
   * The `value` of this channel can be a number or a string `"width"` for the width of the plot.
   */
  x?: number | 'width' | SignalRef; // Vega doesn't have 'width'

  /**
   * Y coordinates of the marks, or height of vertical `"bar"` and `"area"` without specified `y2` or `height`.
   *
   * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
   */
  y?: number | 'height' | SignalRef; // Vega doesn't have 'height'

  /**
   * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   *
   * The `value` of this channel can be a number or a string `"width"` for the width of the plot.
   */
  x2?: number | 'width' | SignalRef; // Vega doesn't have 'width'

  /**
   * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   *
   * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
   */
  y2?: number | 'height' | SignalRef; // Vega doesn't have 'height'

  /**
   * Default Fill Color. This property has higher precedence than `config.color`.
   *
   * __Default value:__ (None)
   *
   */
  fill?: Color | Gradient | null | SignalRef; // docs: Vega doesn't have config.color

  /**
   * Default Stroke Color. This property has higher precedence than `config.color`.
   *
   * __Default value:__ (None)
   *
   */
  stroke?: Color | Gradient | null | SignalRef; // docs: Vega doesn't have config.color

  /**
   * The overall opacity (value between [0,1]).
   *
   * __Default value:__ `0.7` for non-aggregate plots with `point`, `tick`, `circle`, or `square` marks or layered `bar` charts and `1` otherwise.
   *
   * @minimum 0
   * @maximum 1
   */
  opacity?: number | SignalRef; // docs (different defaults)

  /**
   * The orientation of a non-stacked bar, tick, area, and line charts.
   * The value is either horizontal (default) or vertical.
   * - For bar, rule and tick, this determines whether the size of the bar and tick
   * should be applied to x or y dimension.
   * - For area, this property determines the orient property of the Vega output.
   * - For line and trail marks, this property determines the sort order of the points in the line
   * if `config.sortLineBy` is not specified.
   * For stacked charts, this is always determined by the orientation of the stack;
   * therefore explicitly specified value will be ignored.
   */
  orient?: Orientation; // Vega orient doesn't apply to bar/tick/line. Since some logic depends on this property, Vega-Lite does NOT allow signal for orient.

  /**
   * The horizontal alignment of the text or ranged marks (area, bar, image, rect, rule). One of `"left"`, `"right"`, `"center"`.
   */
  align?: Align; // Vega doesn't apply align to ranged marks. Since some logic depends on this property, Vega-Lite does NOT allow signal for align.

  /**
   * The vertical text baseline. One of `"alphabetic"` (default), `"top"`, `"middle"`, `"bottom"`, `"line-top"`, or `"line-bottom"`. The `"line-top"` and `"line-bottom"` values operate similarly to `"top"` and `"bottom"`, but are calculated relative to the `lineHeight` rather than `fontSize` alone.
   */
  baseline?: TextBaseline; // Vega doesn't apply align to ranged marks. Since some logic depends on this property, Vega-Lite does NOT allow signal for baseline.

  /**
   * - For arc marks, the arc length in radians if theta2 is not specified, otherwise the start arc angle. (A value of 0 indicates up or “north”, increasing values proceed clockwise.)
   *
   * - For text marks, polar coordinate angle in radians.
   *
   * @minimum 0
   * @maximum 360
   */
  theta?: number | SignalRef; // overriding VG

  /**
   * For text marks, polar coordinate radial offset, in pixels, of the text from the origin determined by the `x` and `y` properties.
   *
   * For arc mark, the outer radius in pixels.
   *
   * @minimum 0
   *
   * __Default value:__ `min(plot_width, plot_height)/2`
   */
  radius?: number | SignalRef; // overriding VG
}

export interface RectBinSpacingMixins {
  /**
   * Offset between bars for binned field. The ideal value for this is either 0 (preferred by statisticians) or 1 (Vega-Lite default, D3 example style).
   *
   * __Default value:__ `1`
   *
   * @minimum 0
   */
  binSpacing?: number;
}

export type AnyMark = CompositeMark | CompositeMarkDef | Mark | MarkDef;

export function isMarkDef(mark: string | GenericMarkDef<any>): mark is GenericMarkDef<any> {
  return mark['type'];
}

const PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);

export function isPrimitiveMark(mark: AnyMark): mark is Mark {
  const markType = isMarkDef(mark) ? mark.type : mark;
  return markType in PRIMITIVE_MARK_INDEX;
}

export const STROKE_CONFIG = [
  'stroke',
  'strokeWidth',
  'strokeDash',
  'strokeDashOffset',
  'strokeOpacity',
  'strokeJoin',
  'strokeMiterLimit'
] as const;

export const FILL_CONFIG = ['fill', 'fillOpacity'] as const;

export const FILL_STROKE_CONFIG = [...STROKE_CONFIG, ...FILL_CONFIG];

const VL_ONLY_MARK_CONFIG_INDEX: Flag<keyof VLOnlyMarkConfig> = {
  color: 1,
  filled: 1,
  invalid: 1,
  order: 1,
  radius2: 1,
  theta2: 1,
  timeUnitBand: 1,
  timeUnitBandPosition: 1
};

export const VL_ONLY_MARK_CONFIG_PROPERTIES: (keyof VLOnlyMarkConfig)[] = keys(VL_ONLY_MARK_CONFIG_INDEX);

export const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
  [k in Mark]?: (keyof Required<MarkConfigMixins>[k])[];
} = {
  area: ['line', 'point'],
  bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
  rect: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
  line: ['point'],
  tick: ['bandSize', 'thickness']
};

export const defaultMarkConfig: MarkConfig = {
  color: '#4c78a8',
  invalid: 'filter',
  timeUnitBand: 1
};

// TODO: replace with MarkConfigMixins[Mark] once https://github.com/vega/ts-json-schema-generator/issues/344 is fixed
export type AnyMarkConfig = MarkConfig | AreaConfig | BarConfig | RectConfig | LineConfig | TickConfig;

export interface MarkConfigMixins {
  /** Mark Config */
  mark?: MarkConfig;

  // MARK-SPECIFIC CONFIGS

  /** Arc-specific Config */
  arc?: MarkConfig;

  /** Area-Specific Config */
  area?: AreaConfig;

  /** Bar-Specific Config */
  bar?: BarConfig;

  /** Circle-Specific Config */
  circle?: MarkConfig;

  /** Image-specific Config */
  image?: RectConfig;

  /** Line-Specific Config */
  line?: LineConfig;

  /** Point-Specific Config */
  point?: MarkConfig;

  /** Rect-Specific Config */
  rect?: RectConfig;

  /** Rule-Specific Config */
  rule?: MarkConfig;

  /** Square-Specific Config */
  square?: MarkConfig;

  /** Text-Specific Config */
  text?: MarkConfig;

  /** Tick-Specific Config */
  tick?: TickConfig;

  /** Trail-Specific Config */
  trail?: LineConfig;

  /** Geoshape-Specific Config */
  geoshape?: MarkConfig;
}

export interface RectConfig extends RectBinSpacingMixins, MarkConfig {
  /**
   * The default size of the bars on continuous scales.
   *
   * __Default value:__ `5`
   *
   * @minimum 0
   */
  continuousBandSize?: number;

  /**
   * The default size of the bars with discrete dimensions. If unspecified, the default size is  `step-2`, which provides 2 pixel offset between bars.
   * @minimum 0
   */
  discreteBandSize?: number;
}

export const BAR_CORNER_RADIUS_INDEX: Partial<Record<
  Orientation,
  ('cornerRadiusTopLeft' | 'cornerRadiusTopRight' | 'cornerRadiusBottomLeft' | 'cornerRadiusBottomRight')[]
>> = {
  horizontal: ['cornerRadiusTopRight', 'cornerRadiusBottomRight'],
  vertical: ['cornerRadiusTopLeft', 'cornerRadiusTopRight']
};

export interface BarCornerRadiusMixins {
  /**
   * - For vertical bars, top-left and top-right corner radius.
   * - For horizontal bars, top-right and bottom-right corner radius.
   */
  cornerRadiusEnd?: number;
}

export type BarConfig = RectConfig & BarCornerRadiusMixins;

export type OverlayMarkDef = MarkConfig & MarkDefMixins;

export interface PointOverlayMixins {
  /**
   * A flag for overlaying points on top of line or area marks, or an object defining the properties of the overlayed points.
   *
   * - If this property is `"transparent"`, transparent points will be used (for enhancing tooltips and selections).
   *
   * - If this property is an empty object (`{}`) or `true`, filled points with default properties will be used.
   *
   * - If this property is `false`, no points would be automatically added to line or area marks.
   *
   * __Default value:__ `false`.
   */
  point?: boolean | OverlayMarkDef | 'transparent';
}

export interface LineConfig extends MarkConfig, PointOverlayMixins {}

export interface LineOverlayMixins {
  /**
   * A flag for overlaying line on top of area marks, or an object defining the properties of the overlayed lines.
   *
   * - If this value is an empty object (`{}`) or `true`, lines with default properties will be used.
   *
   * - If this value is `false`, no lines would be automatically added to area marks.
   *
   * __Default value:__ `false`.
   */
  line?: boolean | OverlayMarkDef;
}

export interface AreaConfig extends MarkConfig, PointOverlayMixins, LineOverlayMixins {}

export interface TickThicknessMixins {
  /**
   * Thickness of the tick mark.
   *
   * __Default value:__  `1`
   *
   * @minimum 0
   */
  thickness?: number;
}

export interface GenericMarkDef<M> {
  /**
   * The mark type. This could a primitive mark type
   * (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"geoshape"`, `"rule"`, and `"text"`)
   * or a composite mark type (`"boxplot"`, `"errorband"`, `"errorbar"`).
   */
  type: M;
}

export interface MarkDefMixins {
  /**
   * A string or array of strings indicating the name of custom styles to apply to the mark. A style is a named collection of mark property defaults defined within the [style configuration](https://vega.github.io/vega-lite/docs/mark.html#style-config). If style is an array, later styles will override earlier styles. Any [mark properties](https://vega.github.io/vega-lite/docs/encoding.html#mark-prop) explicitly defined within the `encoding` will override a style default.
   *
   * __Default value:__ The mark's name. For example, a bar mark will have style `"bar"` by default.
   * __Note:__ Any specified style will augment the default style. For example, a bar mark with `"style": "foo"` will receive from `config.style.bar` and `config.style.foo` (the specified style `"foo"` has higher precedence).
   */
  style?: string | string[];

  /**
   * Whether a mark be clipped to the enclosing group’s width and height.
   */
  clip?: boolean;

  // Offset properties should not be a part of config

  /**
   * Offset for x-position.
   */
  xOffset?: number;

  /**
   * Offset for y-position.
   */
  yOffset?: number;

  /**
   * Offset for x2-position.
   */
  x2Offset?: number;

  /**
   * Offset for y2-position.
   */
  y2Offset?: number;

  /**
   * Offset for theta.
   */
  thetaOffset?: number;

  /**
   * Offset for theta2.
   */
  theta2Offset?: number;

  /**
   * Offset for radius.
   */
  radiusOffset?: number;

  /**
   * Offset for radius2.
   */
  radius2Offset?: number;
}

// Point/Line OverlayMixins are only for area, line, and trail but we don't want to declare multiple types of MarkDef

// Point/Line OverlayMixins are only for area, line, and trail but we don't want to declare multiple types of MarkDef
export interface MarkDef<M extends string | Mark = Mark>
  extends GenericMarkDef<M>,
    BarCornerRadiusMixins,
    RectBinSpacingMixins,
    MarkConfig,
    PointOverlayMixins,
    LineOverlayMixins,
    TickThicknessMixins,
    MarkDefMixins {}

const DEFAULT_RECT_BAND_SIZE = 5;

export const defaultBarConfig: RectConfig = {
  binSpacing: 1,
  continuousBandSize: DEFAULT_RECT_BAND_SIZE,
  timeUnitBandPosition: 0.5
};

export const defaultRectConfig: RectConfig = {
  binSpacing: 0,
  continuousBandSize: DEFAULT_RECT_BAND_SIZE,
  timeUnitBandPosition: 0.5
};

export interface TickConfig extends MarkConfig, TickThicknessMixins {
  /**
   * The width of the ticks.
   *
   * __Default value:__  3/4 of step (width step for horizontal ticks and height step for vertical ticks).
   * @minimum 0
   */
  bandSize?: number;
}

export const defaultTickConfig: TickConfig = {
  thickness: 1
};

export function getMarkType(m: string | GenericMarkDef<any>) {
  return isMarkDef(m) ? m.type : m;
}
