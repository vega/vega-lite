import {toSet} from 'vega-util';
import {CompositeMark, CompositeMarkDef} from './compositemark/index';
import {contains, flagKeys} from './util';
import {BaseMarkConfig} from './vega.schema';

export namespace Mark {
  export const AREA: 'area' = 'area';
  export const BAR: 'bar' = 'bar';
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
}

/**
 * All types of primitive marks.
 */
export type Mark =
  | typeof Mark.AREA
  | typeof Mark.BAR
  | typeof Mark.LINE
  | typeof Mark.TRAIL
  | typeof Mark.POINT
  | typeof Mark.TEXT
  | typeof Mark.TICK
  | typeof Mark.RECT
  | typeof Mark.RULE
  | typeof Mark.CIRCLE
  | typeof Mark.SQUARE
  | typeof Mark.GEOSHAPE;

export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
export const TRAIL = Mark.TRAIL;
export const RECT = Mark.RECT;
export const RULE = Mark.RULE;
export const GEOSHAPE = Mark.GEOSHAPE;

export const CIRCLE = Mark.CIRCLE;
export const SQUARE = Mark.SQUARE;

// Using mapped type to declare index, ensuring we always have all marks when we add more.
const MARK_INDEX: {[M in Mark]: 1} = {
  area: 1,
  bar: 1,
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

export const PRIMITIVE_MARKS = flagKeys(MARK_INDEX);

export interface ColorMixins {
  /**
   * Default color.  Note that `fill` and `stroke` have higher precedence than `color` and will override `color`.
   *
   * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
   *
   * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
   */
  color?: string;
}

export interface TooltipContent {
  content: 'encoding' | 'data';
}

export interface MarkConfig extends ColorMixins, BaseMarkConfig {
  // ========== VL-Specific ==========

  /**
   * Whether the mark's color should be used as fill color instead of stroke color.
   *
   * __Default value:__ `false` for `point`, `line` and `rule`; otherwise, `true`.
   *
   * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
   *
   */
  filled?: boolean;

  // ========== Overriding Vega ==========

  /**
   * The tooltip text string to show upon mouse hover or an object defining which fields should the tooltip be derived from.
   *
   * - If `tooltip` is `{"content": "encoding"}`, then all fields from `encoding` will be used.
   * - If `tooltip` is `{"content": "data"}`, then all fields that appear in the highlighted data point will be used.
   */
  tooltip?: string | TooltipContent;

  /**
   * Default size for marks.
   * - For `point`/`circle`/`square`, this represents the pixel area of the marks. For example: in the case of circles, the radius is determined in part by the square root of the size value.
   * - For `bar`, this represents the band size of the bar, in pixels.
   * - For `text`, this represents the font size, in pixels.
   *
   * __Default value:__ `30` for point, circle, square marks; `rangeStep` - 1 for bar marks with discrete dimensions; `5` for bar marks with continuous dimensions; `11` for text marks.
   *
   * @minimum 0
   */
  size?: number;
}

export interface BarBinSpacingMixins {
  /**
   * Offset between bars for binned field.  Ideal value for this is either 0 (Preferred by statisticians) or 1 (Vega-Lite Default, D3 example style).
   *
   * __Default value:__ `1`
   *
   * @minimum 0
   */
  binSpacing?: number;
}

export type AnyMark = CompositeMark | CompositeMarkDef | Mark | MarkDef;

export function isMarkDef(mark: AnyMark): mark is MarkDef | CompositeMarkDef {
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
];

export const FILL_CONFIG = ['fill', 'fillOpacity'];

export const FILL_STROKE_CONFIG = [].concat(STROKE_CONFIG, FILL_CONFIG);

export const VL_ONLY_MARK_CONFIG_PROPERTIES: (keyof MarkConfig)[] = ['filled', 'color', 'tooltip'];

export const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
  [k in typeof PRIMITIVE_MARKS[0]]?: (keyof MarkConfigMixins[k])[]
} = {
  area: ['line', 'point'],
  bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
  line: ['point'],
  text: ['shortTimeLabels'],
  tick: ['bandSize', 'thickness']
};

export const defaultMarkConfig: MarkConfig = {
  color: '#4c78a8',
  tooltip: {content: 'encoding'}
};

export interface MarkConfigMixins {
  /** Mark Config */
  mark?: MarkConfig;

  // MARK-SPECIFIC CONFIGS
  /** Area-Specific Config */
  area?: AreaConfig;

  /** Bar-Specific Config */
  bar?: BarConfig;

  /** Circle-Specific Config */
  circle?: MarkConfig;

  /** Line-Specific Config */
  line?: LineConfig;

  /** Point-Specific Config */
  point?: MarkConfig;

  /** Rect-Specific Config */
  rect?: MarkConfig;

  /** Rule-Specific Config */
  rule?: MarkConfig;

  /** Square-Specific Config */
  square?: MarkConfig;

  /** Text-Specific Config */
  text?: TextConfig;

  /** Tick-Specific Config */
  tick?: TickConfig;

  /** Trail-Specific Config */
  trail?: LineConfig;

  /** Geoshape-Specific Config */
  geoshape?: MarkConfig;
}

export interface BarConfig extends BarBinSpacingMixins, MarkConfig {
  /**
   * The default size of the bars on continuous scales.
   *
   * __Default value:__ `5`
   *
   * @minimum 0
   */
  continuousBandSize?: number;

  /**
   * The default size of the bars with discrete dimensions.  If unspecified, the default size is  `bandSize-1`,
   * which provides 1 pixel offset between bars.
   * @minimum 0
   */
  discreteBandSize?: number;
}

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
   * __Default value:__ The mark's name.  For example, a bar mark will have style `"bar"` by default.
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
}

// Point/Line OverlayMixins are only for area, line, and trail but we don't want to declare multiple types of MarkDef

// Point/Line OverlayMixins are only for area, line, and trail but we don't want to declare multiple types of MarkDef
export interface MarkDef
  extends GenericMarkDef<Mark>,
    BarBinSpacingMixins,
    MarkConfig,
    PointOverlayMixins,
    LineOverlayMixins,
    TickThicknessMixins,
    MarkDefMixins {
  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"geoshape"`, `"rule"`, and `"text"`.
   */
  type: Mark;
}

export const defaultBarConfig: BarConfig = {
  binSpacing: 1,
  continuousBandSize: 5
};

export interface TextConfig extends MarkConfig {
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;
}

export interface TickConfig extends MarkConfig, TickThicknessMixins {
  /**
   * The width of the ticks.
   *
   * __Default value:__  3/4 of rangeStep.
   * @minimum 0
   */
  bandSize?: number;
}

export const defaultTickConfig: TickConfig = {
  thickness: 1
};
