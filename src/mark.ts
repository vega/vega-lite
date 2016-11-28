import {StackOffset} from './stack';
import {extend} from './util';

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
  export const ERRORBAR: 'errorBar' = 'errorBar';
}
export type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE | typeof Mark.ERRORBAR;

export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
export const RECT = Mark.RECT;
export const RULE = Mark.RULE;

export const CIRCLE = Mark.CIRCLE;
export const SQUARE = Mark.SQUARE;

export const ERRORBAR = Mark.ERRORBAR;
export const PRIMITIVE_MARKS = [AREA, BAR, LINE, POINT, TEXT, TICK, RULE, CIRCLE, SQUARE];

export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'normal' | 'bold';
/**
 * @type integer
 * @minimum 100
 * @maximum 900
 */
export type FontWeightNumber = number;
export type HorizontalAlign = 'left' | 'right' | 'center';
export type Interpolate = 'linear' | 'linear-closed' |
  'step' | 'step-before' | 'step-after' |
  'basis' | 'basis-open' | 'basis-closed' |
  'cardinal' | 'cardinal-open' | 'cardinal-closed' |
  'bundle' | 'monotone';
export type Shape = 'circle' | 'square' | 'cross' | 'diamond' | 'triangle-up' | 'triangle-down';
export type Orient = 'horizontal' | 'vertical';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface MarkConfig {

  // ---------- Color ----------
  /**
   * Whether the shape\'s color should be used as fill color instead of stroke color.
   * This is only applicable for "bar", "point", and "area".
   * All marks except "point" marks are filled by default.
   * See Mark Documentation (http://vega.github.io/vega-lite/docs/marks.html)
   * for usage example.
   */
  filled?: boolean;

  /**
   * Default color.
   */
  color?: string;

  /**
   * Default Fill Color.  This has higher precedence than config.color
   */
  fill?: string;

  /**
   * Default Stroke Color.  This has higher precedence than config.color
   */
  stroke?: string;

  // ---------- Opacity ----------
  /**
   * @minimum 0
   * @maximum 1
   */
  opacity?: number;

  /**
   * @minimum 0
   * @maximum 1
   */
  fillOpacity?: number;

  /**
   * @minimum 0
   * @maximum 1
   */
  strokeOpacity?: number;

  // ---------- Stroke Style ----------
  /**
   * @minimum 0
   */
  strokeWidth?: number;

  /**
   * An array of alternating stroke, space lengths for creating dashed or dotted lines.
   */
  strokeDash?: number[];

  /**
   * The offset (in pixels) into which to begin drawing with the stroke dash array.
   */
  strokeDashOffset?: number;

  // FIXME: move this outside mark config
  // ---------- Stacking: Bar & Area ----------
  stacked?: StackOffset;

  // ---------- Orientation: Bar, Tick, Line, Area ----------
  /**
   * The orientation of a non-stacked bar, tick, area, and line charts.
   * The value is either horizontal (default) or vertical.
   * - For bar, rule and tick, this determines whether the size of the bar and tick
   * should be applied to x or y dimension.
   * - For area, this property determines the orient property of the Vega output.
   * - For line, this property determines the sort order of the points in the line
   * if `config.sortLineBy` is not specified.
   * For stacked charts, this is always determined by the orientation of the stack;
   * therefore explicitly specified value will be ignored.
   */
  orient?: Orient;

  // ---------- Interpolation: Line / area ----------
  /**
   * The line interpolation method to use for line and area marks. One of the following:
   * - `"linear"`: piecewise linear segments, as in a polyline.
   * - `"linear-closed"`: close the linear segments to form a polygon.
   * - `"step"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"step-before"`: alternate between vertical and horizontal segments, as in a step function.
   * - `"step-after"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"basis"`: a B-spline, with control point duplication on the ends.
   * - `"basis-open"`: an open B-spline; may not intersect the start or end.
   * - `"basis-closed"`: a closed B-spline, as in a loop.
   * - `"cardinal"`: a Cardinal spline, with control point duplication on the ends.
   * - `"cardinal-open"`: an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
   * - `"cardinal-closed"`: a closed Cardinal spline, as in a loop.
   * - `"bundle"`: equivalent to basis, except the tension parameter is used to straighten the spline.
   * - `"monotone"`: cubic interpolation that preserves monotonicity in y.
   */
  interpolate?: Interpolate;
  /**
   * Depending on the interpolation type, sets the tension parameter (for line and area marks).
   * @minimum 0
   * @maximum 1
   */
  tension?: number;
}

export const defaultMarkConfig: MarkConfig = {
  color: '#4682b4',
};

export interface AreaConfig extends MarkConfig {}

export const defaultAreaConfig: AreaConfig = {

};

export interface BarConfig extends MarkConfig {
  /**
   * Offset between bar for binned field.  Ideal value for this is either 0 (Preferred by statisticians) or 1 (Vega-Lite Default, D3 example style).
   * @minimum 0
   */
  binSpacing?: number;
  /**
   * Default size of the bars on continuous scales.
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
  continuousBandSize: 2
};

export interface LineConfig extends MarkConfig {}

export const defaultLineConfig: LineConfig = {
  strokeWidth: 2
};

export interface PointConfig extends MarkConfig {
  /**
   * The symbol shape to use. One of circle (default), square, cross, diamond, triangle-up, or triangle-down, or a custom SVG path.
   */
  shape?: Shape | string;

  /**
   * The pixel area each the point/circle/square.
   * For example: in the case of circles, the radius is determined in part by the square root of the size value.
   * @minimum 0
   */
  size?: number;
}

export const defaultPointConfig: PointConfig = {
  shape: 'circle',
  size: 30,
  strokeWidth: 2
};

export const defaultCircleConfig: PointConfig = defaultPointConfig;
export const defaultSquareConfig: PointConfig = extend({}, defaultPointConfig, {
  shape: 'square'
});


export interface RectConfig extends MarkConfig {}

export const defaultRectConfig: RectConfig = {};

export interface RuleConfig extends MarkConfig {}

export const defaultRuleConfig: RuleConfig = {
  strokeWidth: 1
};


export interface TextConfig extends MarkConfig {
  /**
   * The horizontal alignment of the text. One of left, right, center.
   */
  align?: HorizontalAlign;
  /**
   * The rotation angle of the text, in degrees.
   * @minimum 0
   * @maximum 360
   */
  angle?: number;
  /**
   * The vertical alignment of the text. One of top, middle, bottom.
   */
  baseline?: VerticalAlign;
  /**
   * The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.
   */
  dx?: number;
  /**
   * The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.
   */
  dy?: number;
  /**
   * Polar coordinate radial offset, in pixels, of the text label from the origin determined by the x and y properties.
   * @minimum 0
   */
  radius?: number;
  /**
   * Polar coordinate angle, in radians, of the text label from the origin determined by the x and y properties. Values for theta follow the same convention of arc mark startAngle and endAngle properties: angles are measured in radians, with 0 indicating "north".
   */
  theta?: number;
  /**
   * The typeface to set the text in (e.g., Helvetica Neue).
   * @minimum 0
   */
  font?: string;
  /**
   * The font size, in pixels.
   * @minimum 0
   */
  fontSize?: number;
  /**
   * The font style (e.g., italic).
   */
  fontStyle?: FontStyle;
  /**
   * The font weight (e.g., `"normal"`, `"bold"`, `900`).
   */
  fontWeight?: FontWeight | FontWeightNumber;

  // Vega-Lite only for text only
  /**
   * The formatting pattern for text value. If not defined, this will be determined automatically.
   */
  format?: string;
  /**
   * Whether month names and weekday names should be abbreviated.
   */
  shortTimeLabels?: boolean;

  /**
   * Placeholder Text
   */
  text?: string;

  // FIXME: remove this?
  /**
   * Apply color field to background color instead of the text.
   */
  applyColorToBackground?: boolean;
}

export const defaultTextConfig: TextConfig = {
  fontSize: 10,
  baseline: 'middle',
  text: 'Abc',
  applyColorToBackground: false
};

export interface TickConfig extends MarkConfig {
  /**
   * The width of the ticks.
   * If this value is undefined (by default,), we use 2/3 of rangeStep by default.
   * @minimum 0
   */
  bandSize?: number;

  /**
   * Thickness of the tick mark.
   * @minimum 0
   */
  thickness?: number;
}

export const defaultTickConfig: TickConfig = {
  thickness: 1
};

// TODO: ErrorBar Config
