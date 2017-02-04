import { StackOffset } from './stack';
export declare namespace Mark {
    const AREA: 'area';
    const BAR: 'bar';
    const LINE: 'line';
    const POINT: 'point';
    const RECT: 'rect';
    const RULE: 'rule';
    const TEXT: 'text';
    const LABEL: 'label';
    const TICK: 'tick';
    const CIRCLE: 'circle';
    const SQUARE: 'square';
    const ERRORBAR: 'error-bar';
}
export declare type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.LABEL | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE;
export declare type CompositeMark = typeof Mark.ERRORBAR;
export declare type AnyMark = Mark | CompositeMark;
export declare const AREA: "area";
export declare const BAR: "bar";
export declare const LINE: "line";
export declare const POINT: "point";
export declare const TEXT: "text";
export declare const LABEL: "label";
export declare const TICK: "tick";
export declare const RECT: "rect";
export declare const RULE: "rule";
export declare const CIRCLE: "circle";
export declare const SQUARE: "square";
export declare const ERRORBAR: "error-bar";
export declare const PRIMITIVE_MARKS: ("area" | "label" | "circle" | "line" | "text" | "bar" | "point" | "rule" | "tick" | "square")[];
export declare const COMPOSITE_MARKS: "error-bar"[];
export declare function isCompositeMark(mark: AnyMark): mark is CompositeMark;
export declare type FontStyle = 'normal' | 'italic';
export declare type FontWeight = 'normal' | 'bold';
/**
 * @TJS-type integer
 * @minimum 100
 * @maximum 900
 */
export declare type FontWeightNumber = number;
export declare type HorizontalAlign = 'left' | 'right' | 'center';
export declare type Interpolate = 'linear' | 'linear-closed' | 'step' | 'step-before' | 'step-after' | 'basis' | 'basis-open' | 'basis-closed' | 'cardinal' | 'cardinal-open' | 'cardinal-closed' | 'bundle' | 'monotone';
export declare type Orient = 'horizontal' | 'vertical';
export declare type VerticalAlign = 'top' | 'middle' | 'bottom';
export declare const STROKE_CONFIG: string[];
export declare const FILL_CONFIG: string[];
export declare const FILL_STROKE_CONFIG: any[];
export interface MarkConfig {
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
    /**
     * @minimum 0
     * @maximum 1
     */
    opacity?: number;
    /**
     * Default minimum opacity for mapping a field to opacity.
     * @minimum 0
     * @maximum 1
     */
    minOpacity?: number;
    /**
     * Default max opacity for mapping a field to opacity.
     * @minimum 0
     * @maximum 1
     */
    maxOpacity?: number;
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
    /**
     * @minimum 0
     */
    strokeWidth?: number;
    /**
     * Default minimum strokeWidth for strokeWidth (or rule/line's size) scale with zero=false.
     * @minimum 0
     */
    minStrokeWidth?: number;
    /**
     * Default max strokeWidth for strokeWidth  (or rule/line's size) scale.
     * @minimum 0
     */
    maxStrokeWidth?: number;
    /**
     * An array of alternating stroke, space lengths for creating dashed or dotted lines.
     */
    strokeDash?: number[];
    /**
     * The offset (in pixels) into which to begin drawing with the stroke dash array.
     */
    strokeDashOffset?: number;
    stacked?: StackOffset;
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
export declare const defaultMarkConfig: MarkConfig;
export interface AreaConfig extends MarkConfig {
}
export declare const defaultAreaConfig: AreaConfig;
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
    /**
     * The default max value for mapping quantitative fields to bar's size/bandSize.
     * If undefined (default), we will use bandSize - 1.
     * @minimum 0
     */
    maxBandSize?: number;
    /**
     * The default min value for mapping quantitative fields to bar's size/bandSize scale with zero=false
     * If undefined (default), we will use the `continuousBandSize` value.
     * @minimum 0
     */
    minBandSize?: number;
}
export declare const defaultBarConfig: BarConfig;
export interface LineConfig extends MarkConfig {
}
export declare const defaultLineConfig: LineConfig;
export interface SymbolConfig extends MarkConfig {
    /**
     * The pixel area each the point/circle/square.
     * For example: in the case of circles, the radius is determined in part by the square root of the size value.
     * @minimum 0
     */
    size?: number;
    /**
     * Default minimum value for point size scale with zero=false.
     * @minimum 0
     */
    minSize?: number;
    /**
     * Default max value for point size scale.
     * @minimum 0
     */
    maxSize?: number;
}
export interface PointConfig extends SymbolConfig {
    /**
     * The default symbol shape to use. One of: `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or a custom SVG path.
     */
    shape?: string;
    /**
     * The default collection of symbol shapes for mapping nominal fields to shapes of point marks (i.e., range of a `shape` scale).
     * Each value should be one of: `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or a custom SVG path.
     */
    shapes?: string[];
}
export declare const defaultSymbolConfig: PointConfig;
export declare const defaultPointConfig: {} & PointConfig & {
    shape: string;
    shapes: string[];
};
export declare const defaultCircleConfig: SymbolConfig;
export declare const defaultSquareConfig: SymbolConfig;
export interface RectConfig extends MarkConfig {
}
export declare const defaultRectConfig: RectConfig;
export interface RuleConfig extends MarkConfig {
}
export declare const defaultRuleConfig: RuleConfig;
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
     * The default max value for mapping quantitative fields to text's size/fontSize.
     * If undefined (default), we will use bandSize - 1.
     * @minimum 0
     */
    maxFontSize?: number;
    /**
     * The default min value for mapping quantitative fields to tick's size/fontSize scale with zero=false
     * @minimum 0
     */
    minFontSize?: number;
    /**
     * The font style (e.g., italic).
     */
    fontStyle?: FontStyle;
    /**
     * The font weight (e.g., `"normal"`, `"bold"`, `900`).
     */
    fontWeight?: FontWeight | FontWeightNumber;
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
}
export declare const defaultTextConfig: TextConfig;
export interface LabelConfig extends TextConfig {
}
export declare const defaultLabelConfig: LabelConfig;
export interface TickConfig extends MarkConfig {
    /**
     * The width of the ticks.
     * If this value is undefined (by default,), we use 2/3 of rangeStep by default.
     * @minimum 0
     */
    bandSize?: number;
    /**
     * The default max value for mapping quantitative fields to tick's size/bandSize.
     * If undefined (default), we will use bandSize - 1.
     * @minimum 0
     */
    maxBandSize?: number;
    /**
     * The default min value for mapping quantitative fields to tick's size/bandSize scale with zero=false
     * If undefined (default), we will use the `continuousBandSize` value.
     * @minimum 0
     */
    minBandSize?: number;
    /**
     * Thickness of the tick mark.
     * @minimum 0
     */
    thickness?: number;
}
export declare const defaultTickConfig: TickConfig;
