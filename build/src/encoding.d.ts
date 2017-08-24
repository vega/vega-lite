import { Channel } from './channel';
import { Facet } from './facet';
import { ConditionalFieldDef, ConditionalValueDef, Field, FieldDef, LegendFieldDef, OrderFieldDef, PositionFieldDef, TextFieldDef, ValueDef } from './fielddef';
import { Mark } from './mark';
export interface Encoding<F> {
    /**
     * X coordinates of the marks, or width of horizontal `"bar"` and `"area"`.
     */
    x?: PositionFieldDef<F> | ValueDef;
    /**
     * Y coordinates of the marks, or height of vertical `"bar"` and `"area"`.
     */
    y?: PositionFieldDef<F> | ValueDef;
    /**
     * X2 coordinates for ranged  `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    x2?: FieldDef<F> | ValueDef;
    /**
     * Y2 coordinates for ranged  `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    y2?: FieldDef<F> | ValueDef;
    /**
     * Color of the marks – either fill or stroke color based on mark type.
     * By default, `color` represents fill color for `"area"`, `"bar"`, `"tick"`,
     * `"text"`, `"circle"`, and `"square"` / stroke color for `"line"` and `"point"`.
     *
     * __Default value:__ If undefined, the default color depends on [mark config](config.html#mark)'s `color` property.
     *
     * _Note:_ See the scale documentation for more information about customizing [color scheme](scale.html#scheme).
     */
    color?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;
    /**
     * Opacity of the marks – either can be a value or a range.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](config.html#mark)'s `opacity` property.
     */
    opacity?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;
    /**
     * Size of the mark.
     * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
     * - For `"bar"` and `"tick"` – the bar and tick's size.
     * - For `"text"` – the text's font size.
     * - Size is currently unsupported for `"line"`, `"area"`, and `"rect"`.
     */
    size?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;
    /**
     * The symbol's shape (only for `point` marks). The supported values are
     * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
     * or `"triangle-down"`, or else a custom SVG path string.
     * __Default value:__ If undefined, the default shape depends on [mark config](config.html#point-config)'s `shape` property.
     */
    shape?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;
    /**
     * Additional levels of detail for grouping data in aggregate views and
     * in line and area marks without mapping data to a specific visual channel.
     */
    detail?: FieldDef<F> | FieldDef<F>[];
    /**
     * Text of the `text` mark.
     */
    text?: ConditionalFieldDef<TextFieldDef<F>> | ConditionalValueDef<TextFieldDef<F>>;
    /**
     * The tooltip text to show upon mouse hover.
     */
    tooltip?: ConditionalFieldDef<TextFieldDef<F>> | ConditionalValueDef<TextFieldDef<F>>;
    /**
     * Stack order for stacked marks or order of data points in line marks for connected scatter plots.
     *
     * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
     */
    order?: OrderFieldDef<F> | OrderFieldDef<F>[];
}
export interface EncodingWithFacet<F> extends Encoding<F>, Facet<F> {
}
export declare function channelHasField(encoding: EncodingWithFacet<Field>, channel: Channel): boolean;
export declare function isAggregate(encoding: EncodingWithFacet<Field>): boolean;
export declare function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string>;
export declare function isRanged(encoding: EncodingWithFacet<any>): boolean;
export declare function fieldDefs(encoding: EncodingWithFacet<Field>): FieldDef<Field>[];
export declare function forEach(mapping: any, f: (fd: FieldDef<string>, c: Channel) => void, thisArg?: any): void;
export declare function reduce<T, U>(mapping: U, f: (acc: any, fd: FieldDef<string>, c: Channel) => U, init: T, thisArg?: any): any;
