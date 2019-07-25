import { Channel } from './channel';
import { ChannelDef, Field, FieldDef, FieldDefWithoutScale, LatLongFieldDef, NumericFieldDefWithCondition, NumericValueDefWithCondition, OrderFieldDef, PositionFieldDef, SecondaryFieldDef, ShapeFieldDefWithCondition, ShapeValueDefWithCondition, StringFieldDefWithCondition, StringValueDefWithCondition, TextFieldDef, TextFieldDefWithCondition, TextValueDefWithCondition, TypedFieldDef, ValueDef } from './channeldef';
import { Config } from './config';
import { Mark } from './mark';
import { EncodingFacetMapping } from './spec/facet';
import { AggregatedFieldDef, BinTransform, TimeUnitTransform } from './transform';
export interface Encoding<F extends Field> {
    /**
     * X coordinates of the marks, or width of horizontal `"bar"` and `"area"` without specified `x2` or `width`.
     *
     * The `value` of this channel can be a number or a string `"width"` for the width of the plot.
     */
    x?: PositionFieldDef<F> | ValueDef<number | 'width'>;
    /**
     * Y coordinates of the marks, or height of vertical `"bar"` and `"area"` without specified `y2` or `height`.
     *
     * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
     */
    y?: PositionFieldDef<F> | ValueDef<number | 'height'>;
    /**
     * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"width"` for the width of the plot.
     */
    x2?: SecondaryFieldDef<F> | ValueDef<number | 'width'>;
    /**
     * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
     */
    y2?: SecondaryFieldDef<F> | ValueDef<number | 'height'>;
    /**
     * Longitude position of geographically projected marks.
     */
    longitude?: LatLongFieldDef<F> | ValueDef<number>;
    /**
     * Latitude position of geographically projected marks.
     */
    latitude?: LatLongFieldDef<F> | ValueDef<number>;
    /**
     * Longitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    longitude2?: SecondaryFieldDef<F> | ValueDef<number>;
    /**
     * Latitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    latitude2?: SecondaryFieldDef<F> | ValueDef<number>;
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
    color?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * Fill color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
     *
     * _Note:_ When using `fill` channel, `color ` channel will be ignored. To customize both fill and stroke, please use `fill` and `stroke` channels (not `fill` and `color`).
     */
    fill?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * Stroke color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
     *
     * _Note:_ When using `stroke` channel, `color ` channel will be ignored. To customize both stroke and fill, please use `stroke` and `fill` channels (not `stroke` and `color`).
     */
    stroke?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
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
     * Shape of the mark.
     *
     * 1. For `point` marks the supported values include:
     *   - plotting shapes: `"circle"`, `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, `"triangle-down"`, `"triangle-right"`, or `"triangle-left"`.
     *   - the line symbol `"stroke"`
     *   - centered directional shapes `"arrow"`, `"wedge"`, or `"triangle"`
     *   - a custom [SVG path string](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths) (For correct sizing, custom shape paths should be defined within a square bounding box with coordinates ranging from -1 to 1 along both the x and y dimensions.)
     *
     * 2. For `geoshape` marks it should be a field definition of the geojson data
     *
     * __Default value:__ If undefined, the default shape depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#point-config)'s `shape` property. (`"circle"` if unset.)
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
    href?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F>;
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
export interface EncodingWithFacet<F extends Field> extends Encoding<F>, EncodingFacetMapping<F> {
}
export declare function channelHasField<F extends Field>(encoding: EncodingWithFacet<F>, channel: Channel): boolean;
export declare function isAggregate(encoding: EncodingWithFacet<Field>): boolean;
export declare function extractTransformsFromEncoding(oldEncoding: Encoding<Field>, config: Config): {
    bins: BinTransform[];
    timeUnits: TimeUnitTransform[];
    aggregate: AggregatedFieldDef[];
    groupby: string[];
    encoding: Encoding<string>;
};
export declare function markChannelCompatible(encoding: Encoding<string>, channel: Channel, mark: Mark): boolean;
export declare function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string>;
export declare function fieldDefs<F extends Field>(encoding: EncodingWithFacet<F>): FieldDef<F>[];
export declare function forEach<U extends {
    [k in Channel]?: any;
}>(mapping: U, f: (cd: ChannelDef, c: Channel) => void, thisArg?: any): void;
export declare function reduce<T, U extends {
    [k in Channel]?: any;
}>(mapping: U, f: (acc: any, fd: TypedFieldDef<string>, c: Channel) => U, init: T, thisArg?: any): any;
/**
 * Returns list of path grouping fields for the given encoding
 */
export declare function pathGroupingFields(mark: Mark, encoding: Encoding<string>): string[];
//# sourceMappingURL=encoding.d.ts.map