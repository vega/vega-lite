import { Interpolate, Orient, VgMarkConfig } from './vega.schema';
export { Orient } from './vega.schema';
export declare namespace Mark {
    const AREA: 'area';
    const BAR: 'bar';
    const LINE: 'line';
    const POINT: 'point';
    const RECT: 'rect';
    const RULE: 'rule';
    const TEXT: 'text';
    const TICK: 'tick';
    const CIRCLE: 'circle';
    const SQUARE: 'square';
}
/**
 * All types of primitive marks.
 */
export declare type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE;
export declare const AREA: "area";
export declare const BAR: "bar";
export declare const LINE: "line";
export declare const POINT: "point";
export declare const TEXT: "text";
export declare const TICK: "tick";
export declare const RECT: "rect";
export declare const RULE: "rule";
export declare const CIRCLE: "circle";
export declare const SQUARE: "square";
export declare const PRIMITIVE_MARKS: Mark[];
export interface MarkDef {
    /**
     * The mark type.
     * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"rule"`, and `"text"`.
     */
    type: Mark;
    /**
     * A metadata string indicating the role of the mark.
     * This allows users to use `config.<role-name>.*` to customize properties of marks with specific roles.
     * In addition, SVG renderers will add this role value (prepended with the prefix role-) as a CSS class name on the enclosing SVG group (g) element containing the mark instances.
     */
    role?: string;
    /**
     * Whether the mark's color should be used as fill color instead of stroke color.
     * All marks except "point", "line", and "rule" are filled by default.
     */
    filled?: boolean;
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
     * For more information about each interpolation method, please see [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate).
     */
    interpolate?: Interpolate;
    /**
     * Depending on the interpolation type, sets the tension parameter (for line and area marks).(See [D3's line interpolation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate).)
     * @minimum 0
     * @maximum 1
     */
    tension?: number;
}
export declare function isMarkDef(mark: string | MarkDef): mark is MarkDef;
export declare function isPrimitiveMark(mark: string | MarkDef): mark is Mark;
export declare const STROKE_CONFIG: string[];
export declare const FILL_CONFIG: string[];
export declare const FILL_STROKE_CONFIG: any[];
export interface MarkConfig extends VgMarkConfig {
    /**
     * Whether the mark's color should be used as fill color instead of stroke color.
     *
     * __Default value:__ `true` for all marks except `point` and `false` for `point`.
     *
     * __Applicable for:__ `bar`, `point`, `circle`, `square`, and `area` marks.
     *
     */
    filled?: boolean;
    /**
     * Default color.
     *
     * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
     */
    color?: string;
}
export declare const defaultMarkConfig: MarkConfig;
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
     * Default size of the bars on continuous scales.
     *
     * __Default value:__ `2`
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
export declare const defaultBarConfig: BarConfig;
export interface TextConfig extends MarkConfig {
    /**
     * Whether month names and weekday names should be abbreviated.
     */
    shortTimeLabels?: boolean;
}
export declare const defaultTextConfig: TextConfig;
export interface TickConfig extends MarkConfig {
    /**
     * The width of the ticks.
     * If this value is undefined (by default,), we use 2/3 of rangeStep by default.
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
export declare const defaultTickConfig: TickConfig;
