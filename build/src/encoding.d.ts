import { Channel } from './channel';
import { Facet } from './facet';
import { ConditionalValueDef, Field, FieldDef, LegendFieldDef, OrderFieldDef, PositionFieldDef, TextFieldDef, ValueDef } from './fielddef';
import { Mark } from './mark';
export interface Encoding<F> {
    /**
     * X coordinates for `point`, `circle`, `square`,
     * `line`, `rule`, `text`, and `tick`
     * (or to width and height for `bar` and `area` marks).
     */
    x?: PositionFieldDef<F> | ValueDef<number>;
    /**
     * Y coordinates for `point`, `circle`, `square`,
     * `line`, `rule`, `text`, and `tick`
     * (or to width and height for `bar` and `area` marks).
     */
    y?: PositionFieldDef<F> | ValueDef<number>;
    /**
     * X2 coordinates for ranged `bar`, `rule`, `area`.
     */
    x2?: FieldDef<F> | ValueDef<number>;
    /**
     * Y2 coordinates for ranged `bar`, `rule`, `area`.
     */
    y2?: FieldDef<F> | ValueDef<number>;
    /**
     * Color of the marks – either fill or stroke color based on mark type.
     * (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /
     * stroke color for `line` and `point`.)
     */
    color?: LegendFieldDef<F, string> | ConditionalValueDef<string>;
    /**
     * Opacity of the marks – either can be a value or a range.
     */
    opacity?: LegendFieldDef<F, number> | ConditionalValueDef<number>;
    /**
     * Size of the mark.
     * - For `point`, `square` and `circle`
     * – the symbol size, or pixel area of the mark.
     * - For `bar` and `tick` – the bar and tick's size.
     * - For `text` – the text's font size.
     * - Size is currently unsupported for `line` and `area`.
     */
    size?: LegendFieldDef<F, number> | ConditionalValueDef<number>;
    /**
     * The symbol's shape (only for `point` marks). The supported values are
     * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
     * or `"triangle-down"`, or else a custom SVG path string.
     */
    shape?: LegendFieldDef<F, string> | ConditionalValueDef<string>;
    /**
     * Additional levels of detail for grouping data in aggregate views and
     * in line and area marks without mapping data to a specific visual channel.
     */
    detail?: FieldDef<F> | FieldDef<F>[];
    /**
     * Text of the `text` mark.
     */
    text?: TextFieldDef<F> | ConditionalValueDef<string | number | boolean>;
    /**
     * The tooltip text to show upon mouse hover.
     */
    tooltip?: TextFieldDef<F> | ConditionalValueDef<string>;
    /**
     * stack order for stacked marks or order of data points in line marks.
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
