import {CompositeMark, CompositeMarkDef} from './compositemark/index';
import {flagKeys, toSet} from './util';
import {VgMarkConfig} from './vega.schema';

export namespace Mark {
  export const AREA: 'area' = 'area';
  export const BAR: 'bar' = 'bar';
  export const LINE: 'line' = 'line';
  export const POINT: 'point' = 'point';
  export const RECT: 'rect' = 'rect';
  export const RULE: 'rule' = 'rule';
  export const TEXT: 'text' = 'text';
  export const TICK: 'tick' = 'tick';
  export const CIRCLE: 'circle' = 'circle';
  export const SQUARE: 'square' = 'square';
  export const GEOSHAPE: 'geoshape' = 'geoshape';
}

/**
 * All types of primitive marks.
 */
export type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE | typeof Mark.GEOSHAPE;


export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
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
  rect: 1,
  geoshape: 1,
  rule: 1,
  circle: 1,
  square: 1
};

export function isMark(m: string): m is Mark {
  return !!MARK_INDEX[m];
}

export const PRIMITIVE_MARKS = flagKeys(MARK_INDEX);


export interface MarkConfig extends VgMarkConfig {
  // ---------- Color ----------
  /**
   * Whether the mark's color should be used as fill color instead of stroke color.
   *
   * __Default value:__ `true` for all marks except `point` and `false` for `point`.
   *
   * __Applicable for:__ `bar`, `point`, `circle`, `square`, and `area` marks.
   *
   * __Note:__ This property cannot be used in a [style config](mark.html#style-config).
   *
   */
  filled?: boolean;

  /**
   * Default color.  Note that `fill` and `stroke` have higher precedence than `color` and will override `color`.
   *
   * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
   *
   * __Note:__ This property cannot be used in a [style config](mark.html#style-config).
   */
  color?: string;
}

export interface MarkDef extends MarkConfig {
  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"geoshape"`, `"rule"`, and `"text"`.
   */
  type: Mark;

  /**
   *
   * A string or array of strings indicating the name of custom styles to apply to the mark. A style is a named collection of mark property defaults defined within the [style configuration](mark.html#style-config). If style is an array, later styles will override earlier styles. Any [mark properties](encoding.html#mark-prop) explicitly defined within the `encoding` will override a style default.
   *
   * __Default value:__ The mark's name.  For example, a bar mark will have style `"bar"` by default.
   * __Note:__ Any specified style will augment the default style. For example, a bar mark with `"style": "foo"` will receive from `config.style.bar` and `config.style.foo` (the specified style `"foo"` has higher precedence).
   */
  style?: string | string[];

  /**
   * Whether a mark be clipped to the enclosing group’s width and height.
   */
  clip?: boolean;
}

/** @hide */
export type HiddenComposite = CompositeMark | CompositeMarkDef;

export type AnyMark =
  HiddenComposite |
  Mark |
  MarkDef;

export function isMarkDef(mark: AnyMark): mark is (MarkDef | CompositeMarkDef) {
  return mark['type'];
}

const PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);

export function isPrimitiveMark(mark: CompositeMark | CompositeMarkDef | Mark | MarkDef): mark is Mark {
  const markType = isMarkDef(mark) ? mark.type : mark;
  return markType in PRIMITIVE_MARK_INDEX;
}

export const STROKE_CONFIG = ['stroke', 'strokeWidth',
  'strokeDash', 'strokeDashOffset', 'strokeOpacity'];

export const FILL_CONFIG = ['fill', 'fillOpacity'];

export const FILL_STROKE_CONFIG = [].concat(STROKE_CONFIG, FILL_CONFIG);

export const VL_ONLY_MARK_CONFIG_PROPERTIES: (keyof MarkConfig)[] = ['filled', 'color'];

export const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
  [k in (typeof PRIMITIVE_MARKS[0])]?: (keyof MarkConfigMixins[k])[]
} = {
  bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
  text: ['shortTimeLabels'],
  tick: ['bandSize', 'thickness']
};



export const defaultMarkConfig: MarkConfig = {
  color: '#4c78a8',
};

export interface MarkConfigMixins {
  /** Mark Config */
  mark?: MarkConfig;

  // MARK-SPECIFIC CONFIGS
  /** Area-Specific Config */
  area?: MarkConfig;

  /** Bar-Specific Config */
  bar?: BarConfig;

  /** Circle-Specific Config */
  circle?: MarkConfig;

  /** Line-Specific Config */
  line?: MarkConfig;

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

  /** Geoshape-Specific Config */
  geoshape?: MarkConfig;
}

export interface BarConfig extends MarkConfig {
  /**
   * Offset between bar for binned field.  Ideal value for this is either 0 (Preferred by statisticians) or 1 (Vega-Lite Default, D3 example style).
   *
   * __Default value:__ `1`
   *
   * @minimum 0
   */
  binSpacing?: number;
  /**
   * The default size of the bars on continuous scales.
   *
   * __Default value:__ `5`
   *
   * @minimum 0
   */
  continuousBandSize?: number;

  /**
   * The size of the bars.  If unspecified, the default size is  `bandSize-1`,
   * which provides 1 pixel offset between bars.
   * @minimum 0
   */
  discreteBandSize?: number;
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

export interface TickConfig extends MarkConfig {
  /**
   * The width of the ticks.
   *
   * __Default value:__  2/3 of rangeStep.
   * @minimum 0
   */
  bandSize?: number;

  /**
   * Thickness of the tick mark.
   *
   * __Default value:__  `1`
   *
   * @minimum 0
   */
  thickness?: number;
}

export const defaultTickConfig: TickConfig = {
  thickness: 1
};
