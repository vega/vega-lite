import { Channel } from './channel';
import { Config } from './config';
import { ChannelDef, ColorFieldDefWithCondition, ColorValueDefWithCondition, Field, FieldDef, FieldDefWithoutScale, LatLongFieldDef, NumericFieldDefWithCondition, NumericValueDefWithCondition, OrderFieldDef, PositionFieldDef, RepeatRef, SecondaryFieldDef, ShapeFieldDefWithCondition, ShapeValueDefWithCondition, StringFieldDefWithCondition, StringValueDefWithCondition, TextFieldDef, TextFieldDefWithCondition, TextValueDefWithCondition, TypedFieldDef, ValueDef } from './fielddef';
import { Mark } from './mark';
import { FacetMapping } from './spec/facet';
import { AggregatedFieldDef, BinTransform, TimeUnitTransform } from './transform';
export interface Encoding<F extends Field> {
    /**
     * X coordinates of the marks, or width of horizontal `"bar"` and `"area"`.
     *
     * The `value` of this channel can be a number or a string `"width"`.
     */
    x?: PositionFieldDef<F> | ValueDef<number | 'width'>;
    /**
     * Y coordinates of the marks, or height of vertical `"bar"` and `"area"`.
     *
     * The `value` of this channel can be a number or a string `"height"`.
     */
    y?: PositionFieldDef<F> | ValueDef<number | 'height'>;
    /**
     * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"width"`.
     */
    x2?: SecondaryFieldDef<F> | ValueDef<number | 'width'>;
    /**
     * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"height"`.
     */
    y2?: SecondaryFieldDef<F> | ValueDef<number | 'height'>;
    /**
     * Error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    xError?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Secondary error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    xError2?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    yError?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Secondary error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
     */
    yError2?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Longitude position of geographically projected marks.
     */
    longitude?: LatLongFieldDef<F>;
    /**
     * Latitude position of geographically projected marks.
     */
    latitude?: LatLongFieldDef<F>;
    /**
     * Longitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    longitude2?: SecondaryFieldDef<F>;
    /**
     * Latitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    latitude2?: SecondaryFieldDef<F>;
    /**
     * Color of the marks – either fill or stroke color based on  the `filled` property of mark definition.
     * By default, `color` represents fill color for `"area"`, `"bar"`, `"tick"`,
     * `"text"`, `"trail"`, `"circle"`, and `"square"` / stroke color for `"line"` and `"point"`.
     *
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
     *
     * _Note:_
     * 1) For fine-grained control over both fill and stroke colors of the marks, please use the `fill` and `stroke` channels.  If either `fill` or `stroke` channel is specified, `color` channel will be ignored.
     * 2) See the scale documentation for more information about customizing [color scheme](https://vega.github.io/vega-lite/docs/scale.html#scheme).
     */
    color?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;
    /**
     * Fill color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
     *
     * _Note:_ When using `fill` channel, `color ` channel will be ignored. To customize both fill and stroke, please use `fill` and `stroke` channels (not `fill` and `color`).
     */
    fill?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;
    /**
     * Stroke color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
     *
     * _Note:_ When using `stroke` channel, `color ` channel will be ignored. To customize both stroke and fill, please use `stroke` and `fill` channels (not `stroke` and `color`).
     */
    stroke?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;
    /**
     * Opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `opacity` property.
     */
    opacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;
    /**
     * Fill opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `fillOpacity` property.
     */
    fillOpacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;
    /**
     * Stroke opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `strokeOpacity` property.
     */
    strokeOpacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;
    /**
     * Stroke width of the marks.
     *
     * __Default value:__ If undefined, the default stroke width depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `strokeWidth` property.
     */
    strokeWidth?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;
    /**
     * Size of the mark.
     * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
     * - For `"bar"` and `"tick"` – the bar and tick's size.
     * - For `"text"` – the text's font size.
     * - Size is unsupported for `"line"`, `"area"`, and `"rect"`. (Use `"trail"` instead of line with varying size)
     */
    size?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;
    /**
     * For `point` marks the supported values are
     * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
     * or `"triangle-down"`, or else a custom SVG path string.
     * For `geoshape` marks it should be a field definition of the geojson data
     *
     * __Default value:__ If undefined, the default shape depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#point-config)'s `shape` property.
     */
    shape?: ShapeFieldDefWithCondition<F> | ShapeValueDefWithCondition<F>;
    /**
     * Additional levels of detail for grouping data in aggregate views and
     * in line, trail, and area marks without mapping data to a specific visual channel.
     */
    detail?: FieldDefWithoutScale<F> | FieldDefWithoutScale<F>[];
    /**
     * A data field to use as a unique key for data binding. When a visualization’s data is updated, the key value will be used to match data elements to existing mark instances. Use a key channel to enable object constancy for transitions over dynamic data.
     */
    key?: FieldDefWithoutScale<F>;
    /**
     * Text of the `text` mark.
     */
    text?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F>;
    /**
     * The tooltip text to show upon mouse hover.
     */
    tooltip?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F> | TextFieldDef<F>[] | null;
    /**
     * A URL to load upon mouse click.
     */
    href?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * Order of the marks.
     * - For stacked marks, this `order` channel encodes [stack order](https://vega.github.io/vega-lite/docs/stack.html#order).
     * - For line and trail marks, this `order` channel encodes order of data points in the lines. This can be useful for creating [a connected scatterplot](https://vega.github.io/vega-lite/examples/connected_scatterplot.html).  Setting `order` to `{"value": null}` makes the line marks use the original order in the data sources.
     * - Otherwise, this `order` channel encodes layer order of the marks.
     *
     * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
     */
    order?: OrderFieldDef<F> | OrderFieldDef<F>[] | ValueDef<number>;
}
export interface EncodingWithFacet<F extends Field> extends Encoding<F>, FacetMapping<F> {
}
export declare function channelHasField<F extends Field>(encoding: EncodingWithFacet<F>, channel: Channel): boolean;
export declare function isAggregate(encoding: EncodingWithFacet<Field>): boolean;
export declare function extractTransformsFromEncoding(oldEncoding: Encoding<string | RepeatRef>, config: Config): {
    bins: BinTransform[];
    timeUnits: TimeUnitTransform[];
    aggregate: AggregatedFieldDef[];
    groupby: string[];
    encoding: Encoding<string>;
};
export declare function markChannelCompatible(encoding: Encoding<string>, channel: Channel, mark: Mark): boolean;
export declare function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string>;
export declare function isRanged(encoding: EncodingWithFacet<any>): boolean;
export declare function fieldDefs<F extends Field>(encoding: EncodingWithFacet<F>): FieldDef<F>[];
export declare function forEach(mapping: any, f: (cd: ChannelDef, c: Channel) => void, thisArg?: any): void;
export declare function reduce<T, U extends {
    [k in Channel]?: any;
}>(mapping: U, f: (acc: any, fd: TypedFieldDef<string>, c: Channel) => U, init: T, thisArg?: any): any;
