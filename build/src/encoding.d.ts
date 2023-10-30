import { Channel } from './channel';
import { ChannelDef, ColorDef, Field, FieldDef, FieldDefWithoutScale, LatLongDef, NumericArrayMarkPropDef, NumericMarkPropDef, OffsetDef, OrderFieldDef, OrderOnlyDef, OrderValueDef, PolarDef, Position2Def, PositionDef, ShapeDef, StringFieldDef, StringFieldDefWithCondition, StringValueDefWithCondition, TextDef, TypedFieldDef } from './channeldef';
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
    x?: PositionDef<F>;
    /**
     * Y coordinates of the marks, or height of vertical `"bar"` and `"area"` without specified `y2` or `height`.
     *
     * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
     */
    y?: PositionDef<F>;
    /**
     * Offset of x-position of the marks
     */
    xOffset?: OffsetDef<F>;
    /**
     * Offset of y-position of the marks
     */
    yOffset?: OffsetDef<F>;
    /**
     * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"width"` for the width of the plot.
     */
    x2?: Position2Def<F>;
    /**
     * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     *
     * The `value` of this channel can be a number or a string `"height"` for the height of the plot.
     */
    y2?: Position2Def<F>;
    /**
     * Longitude position of geographically projected marks.
     */
    longitude?: LatLongDef<F>;
    /**
     * Latitude position of geographically projected marks.
     */
    latitude?: LatLongDef<F>;
    /**
     * Longitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    longitude2?: Position2Def<F>;
    /**
     * Latitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
     */
    latitude2?: Position2Def<F>;
    /**
     * - For arc marks, the arc length in radians if theta2 is not specified, otherwise the start arc angle. (A value of 0 indicates up or “north”, increasing values proceed clockwise.)
     *
     * - For text marks, polar coordinate angle in radians.
     */
    theta?: PolarDef<F>;
    /**
     * The end angle of arc marks in radians. A value of 0 indicates up or “north”, increasing values proceed clockwise.
     */
    theta2?: Position2Def<F>;
    /**
     * The outer radius in pixels of arc marks.
     */
    radius?: PolarDef<F>;
    /**
     * The inner radius in pixels of arc marks.
     */
    radius2?: Position2Def<F>;
    /**
     * Color of the marks – either fill or stroke color based on  the `filled` property of mark definition.
     * By default, `color` represents fill color for `"area"`, `"bar"`, `"tick"`,
     * `"text"`, `"trail"`, `"circle"`, and `"square"` / stroke color for `"line"` and `"point"`.
     *
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `color` property.
     *
     * _Note:_
     * 1) For fine-grained control over both fill and stroke colors of the marks, please use the `fill` and `stroke` channels. The `fill` or `stroke` encodings have higher precedence than `color`, thus may override the `color` encoding if conflicting encodings are specified.
     * 2) See the scale documentation for more information about customizing [color scheme](https://vega.github.io/vega-lite/docs/scale.html#scheme).
     */
    color?: ColorDef<F>;
    /**
     * Fill color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `color` property.
     *
     * _Note:_ The `fill` encoding has higher precedence than `color`, thus may override the `color` encoding if conflicting encodings are specified.
     */
    fill?: ColorDef<F>;
    /**
     * Stroke color of the marks.
     * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `color` property.
     *
     * _Note:_ The `stroke` encoding has higher precedence than `color`, thus may override the `color` encoding if conflicting encodings are specified.
     */
    stroke?: ColorDef<F>;
    /**
     * Opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `opacity` property.
     */
    opacity?: NumericMarkPropDef<F>;
    /**
     * Fill opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `fillOpacity` property.
     */
    fillOpacity?: NumericMarkPropDef<F>;
    /**
     * Stroke opacity of the marks.
     *
     * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `strokeOpacity` property.
     */
    strokeOpacity?: NumericMarkPropDef<F>;
    /**
     * Stroke width of the marks.
     *
     * __Default value:__ If undefined, the default stroke width depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark-config)'s `strokeWidth` property.
     */
    strokeWidth?: NumericMarkPropDef<F>;
    /**
     * Stroke dash of the marks.
     *
     * __Default value:__ `[1,0]` (No dash).
     */
    strokeDash?: NumericArrayMarkPropDef<F>;
    /**
     * Size of the mark.
     * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
     * - For `"bar"` and `"tick"` – the bar and tick's size.
     * - For `"text"` – the text's font size.
     * - Size is unsupported for `"line"`, `"area"`, and `"rect"`. (Use `"trail"` instead of line with varying size)
     */
    size?: NumericMarkPropDef<F>;
    /**
     * Rotation angle of point and text marks.
     */
    angle?: NumericMarkPropDef<F>;
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
    shape?: ShapeDef<F>;
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
    text?: TextDef<F>;
    /**
     * The tooltip text to show upon mouse hover. Specifying `tooltip` encoding overrides [the `tooltip` property in the mark definition](https://vega.github.io/vega-lite/docs/mark.html#mark-def).
     *
     * See the [`tooltip`](https://vega.github.io/vega-lite/docs/tooltip.html) documentation for a detailed discussion about tooltip in Vega-Lite.
     */
    tooltip?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F> | StringFieldDef<F>[] | null;
    /**
     * A URL to load upon mouse click.
     */
    href?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * The URL of an image mark.
     */
    url?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * A text description of this mark for ARIA accessibility (SVG output only). For SVG output the `"aria-label"` attribute will be set to this description.
     */
    description?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;
    /**
     * Order of the marks.
     * - For stacked marks, this `order` channel encodes [stack order](https://vega.github.io/vega-lite/docs/stack.html#order).
     * - For line and trail marks, this `order` channel encodes order of data points in the lines. This can be useful for creating [a connected scatterplot](https://vega.github.io/vega-lite/examples/connected_scatterplot.html). Setting `order` to `{"value": null}` makes the line marks use the original order in the data sources.
     * - Otherwise, this `order` channel encodes layer order of the marks.
     *
     * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
     */
    order?: OrderFieldDef<F> | OrderFieldDef<F>[] | OrderValueDef | OrderOnlyDef;
}
export interface EncodingWithFacet<F extends Field> extends Encoding<F>, EncodingFacetMapping<F> {
}
export declare function channelHasField<F extends Field>(encoding: EncodingWithFacet<F>, channel: keyof EncodingWithFacet<F>): boolean;
export declare function channelHasFieldOrDatum<F extends Field>(encoding: EncodingWithFacet<F>, channel: keyof EncodingWithFacet<F>): boolean;
export declare function channelHasNestedOffsetScale<F extends Field>(encoding: EncodingWithFacet<F>, channel: keyof EncodingWithFacet<F>): boolean;
export declare function isAggregate(encoding: EncodingWithFacet<any>): boolean;
export declare function extractTransformsFromEncoding(oldEncoding: Encoding<any>, config: Config): {
    bins: BinTransform[];
    timeUnits: TimeUnitTransform[];
    aggregate: AggregatedFieldDef[];
    groupby: string[];
    encoding: Encoding<string>;
};
export declare function markChannelCompatible(encoding: Encoding<string>, channel: Channel, mark: Mark): boolean;
export declare function initEncoding(encoding: Encoding<string>, mark: Mark, filled: boolean, config: Config): Encoding<string>;
/**
 * For composite marks, we have to call initChannelDef during init so we can infer types earlier.
 */
export declare function normalizeEncoding(encoding: Encoding<string>, config: Config): Encoding<string>;
export declare function fieldDefs<F extends Field>(encoding: EncodingWithFacet<F>): FieldDef<F>[];
export declare function forEach<U extends Record<any, any>>(mapping: U, f: (cd: ChannelDef, c: keyof U) => void, thisArg?: any): void;
export declare function reduce<T, U extends Record<any, any>>(mapping: U, f: (acc: any, fd: TypedFieldDef<string>, c: keyof U) => U, init: T, thisArg?: any): any;
/**
 * Returns list of path grouping fields for the given encoding
 */
export declare function pathGroupingFields(mark: Mark, encoding: Encoding<string>): string[];
//# sourceMappingURL=encoding.d.ts.map