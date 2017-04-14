import { Channel } from './channel';
import { Facet } from './facet';
import { ConditionalValueDef, FieldDef, LegendFieldDef, OrderFieldDef, PositionFieldDef, TextFieldDef, ValueDef } from './fielddef';
import { Mark } from './mark';
export interface Encoding {
    /**
     * X coordinates for `point`, `circle`, `square`,
     * `line`, `rule`, `text`, and `tick`
     * (or to width and height for `bar` and `area` marks).
     */
    x?: PositionFieldDef | ValueDef<number>;
    /**
     * Y coordinates for `point`, `circle`, `square`,
     * `line`, `rule`, `text`, and `tick`
     * (or to width and height for `bar` and `area` marks).
     */
    y?: PositionFieldDef | ValueDef<number>;
    /**
     * X2 coordinates for ranged `bar`, `rule`, `area`
     */
    x2?: FieldDef | ValueDef<number>;
    /**
     * Y2 coordinates for ranged `bar`, `rule`, `area`
     */
    y2?: FieldDef | ValueDef<number>;
    /**
     * Color of the marks – either fill or stroke color based on mark type.
     * (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /
     * stroke color for `line` and `point`.)
     */
    color?: LegendFieldDef<string> | ConditionalValueDef<string>;
    /**
     * Opacity of the marks – either can be a value or in a range.
     */
    opacity?: LegendFieldDef<number> | ConditionalValueDef<number>;
    /**
     * Size of the mark.
     * - For `point`, `square` and `circle`
     * – the symbol size, or pixel area of the mark.
     * - For `bar` and `tick` – the bar and tick's size.
     * - For `text` – the text's font size.
     * - Size is currently unsupported for `line` and `area`.
     */
    size?: LegendFieldDef<number> | ConditionalValueDef<number>;
    /**
     * The symbol's shape (only for `point` marks). The supported values are
     * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
     * or `"triangle-down"`, or else a custom SVG path string.
     */
    shape?: LegendFieldDef<string> | ConditionalValueDef<string>;
    /**
     * Additional levels of detail for grouping data in aggregate views and
     * in line and area marks without mapping data to a specific visual channel.
     */
    detail?: FieldDef | FieldDef[];
    /**
     * Text of the `text` mark.
     */
    text?: TextFieldDef | ConditionalValueDef<string | number | boolean>;
    /**
     * stack order for stacked marks or order of data points in line marks.
     */
    order?: OrderFieldDef | OrderFieldDef[];
}
export interface EncodingWithFacet extends Encoding, Facet {
}
export declare function channelHasField(encoding: EncodingWithFacet, channel: Channel): boolean;
export declare function isAggregate(encoding: EncodingWithFacet): boolean;
export declare function normalizeEncoding(encoding: Encoding, mark: Mark): Encoding;
export declare function isRanged(encoding: EncodingWithFacet): boolean;
export declare function fieldDefs(encoding: EncodingWithFacet): FieldDef[];
export declare function forEach(mapping: any, f: (fd: FieldDef, c: Channel) => void, thisArg?: any): void;
export declare function reduce<T, U>(mapping: U, f: (acc: any, fd: FieldDef, c: Channel) => U, init: T, thisArg?: any): any;
