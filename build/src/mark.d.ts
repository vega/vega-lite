import { CompositeMark, CompositeMarkDef } from './compositemark/index';
import { VgMarkConfig } from './vega.schema';
export declare namespace Mark {
    const AREA: 'area';
    const BAR: 'bar';
    const LINE: 'line';
    const POINT: 'point';
    const RECT: 'rect';
    const RULE: 'rule';
    const TEXT: 'text';
    const TICK: 'tick';
    const TRAIL: 'trail';
    const CIRCLE: 'circle';
    const SQUARE: 'square';
    const GEOSHAPE: 'geoshape';
}
/**
 * All types of primitive marks.
 */
export declare type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.TRAIL | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE | typeof Mark.GEOSHAPE;
export declare const AREA: "area";
export declare const BAR: "bar";
export declare const LINE: "line";
export declare const POINT: "point";
export declare const TEXT: "text";
export declare const TICK: "tick";
export declare const TRAIL: "trail";
export declare const RECT: "rect";
export declare const RULE: "rule";
export declare const GEOSHAPE: "geoshape";
export declare const CIRCLE: "circle";
export declare const SQUARE: "square";
export declare function isMark(m: string): m is Mark;
export declare function isPathMark(m: Mark | CompositeMark): m is 'line' | 'area' | 'trail';
export declare const PRIMITIVE_MARKS: Mark[];
export interface MarkConfig extends VgMarkConfig {
    /**
     * Whether the mark's color should be used as fill color instead of stroke color.
     *
     * __Default value:__ `true` for all marks except `point` and `false` for `point`.
     *
     * __Applicable for:__ `bar`, `point`, `circle`, `square`, and `area` marks.
     *
     * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
     *
     */
    filled?: boolean;
    /**
     * Default color.  Note that `fill` and `stroke` have higher precedence than `color` and will override `color`.
     *
     * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
     *
     * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
     */
    color?: string;
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
/** @hide */
export declare type HiddenComposite = CompositeMark | CompositeMarkDef;
export declare type AnyMark = HiddenComposite | Mark | MarkDef;
export declare function isMarkDef(mark: AnyMark): mark is (MarkDef | CompositeMarkDef);
export declare function isPrimitiveMark(mark: CompositeMark | CompositeMarkDef | Mark | MarkDef): mark is Mark;
export declare const STROKE_CONFIG: string[];
export declare const FILL_CONFIG: string[];
export declare const FILL_STROKE_CONFIG: any[];
export declare const VL_ONLY_MARK_CONFIG_PROPERTIES: (keyof MarkConfig)[];
export declare const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    [k in (typeof PRIMITIVE_MARKS[0])]?: (keyof MarkConfigMixins[k])[];
};
export declare const defaultMarkConfig: MarkConfig;
export interface MarkConfigMixins {
    /** Mark Config */
    mark?: MarkConfig;
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
     * The size of the bars.  If unspecified, the default size is  `bandSize-1`,
     * which provides 1 pixel offset between bars.
     * @minimum 0
     */
    discreteBandSize?: number;
}
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
    point?: boolean | MarkConfig | 'transparent';
}
export interface LineConfig extends MarkConfig, PointOverlayMixins {
}
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
    line?: boolean | MarkConfig;
}
export interface AreaConfig extends MarkConfig, PointOverlayMixins, LineOverlayMixins {
}
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
export interface MarkDef extends BarBinSpacingMixins, MarkConfig, PointOverlayMixins, LineOverlayMixins, TickThicknessMixins {
    /**
     * The mark type.
     * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"geoshape"`, `"rule"`, and `"text"`.
     */
    type: Mark;
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
export declare const defaultBarConfig: BarConfig;
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
     * __Default value:__  2/3 of rangeStep.
     * @minimum 0
     */
    bandSize?: number;
}
export declare const defaultTickConfig: TickConfig;
