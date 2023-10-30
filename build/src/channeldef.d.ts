import { Gradient, ScaleType, SignalRef, Text } from 'vega';
import { Aggregate } from './aggregate';
import { Axis } from './axis';
import { Bin, BinParams } from './bin';
import { Channel, ExtendedChannel, PolarPositionScaleChannel, PositionScaleChannel } from './channel';
import { CompositeAggregate } from './compositemark';
import { Config } from './config';
import { DateTime } from './datetime';
import { Encoding } from './encoding';
import { ExprRef } from './expr';
import { Guide, GuideEncodingConditionalValueDef, TitleMixins } from './guide';
import { ImputeParams } from './impute';
import { Legend } from './legend';
import { LogicalComposition } from './logical';
import { Mark, MarkDef, RelativeBandSize } from './mark';
import { ParameterPredicate, Predicate } from './predicate';
import { Scale } from './scale';
import { Sort, SortOrder } from './sort';
import { StackOffset } from './stack';
import { BinnedTimeUnit, TimeUnit, TimeUnitParams } from './timeunit';
import { AggregatedFieldDef, WindowFieldDef } from './transform';
import { StandardType, Type } from './type';
import { Dict } from './util';
export type PrimitiveValue = number | string | boolean | null;
export type Value<ES extends ExprRef | SignalRef = ExprRef | SignalRef> = PrimitiveValue | number[] | Gradient | Text | ES;
/**
 * Definition object for a constant value (primitive value or gradient definition) of an encoding channel.
 */
export interface ValueDef<V extends Value = Value> {
    /**
     * A constant value in visual domain (e.g., `"red"` / `"#0099ff"` / [gradient definition](https://vega.github.io/vega-lite/docs/types.html#gradient) for color, values between `0` to `1` for opacity).
     */
    value: V;
}
export type PositionValueDef = ValueDef<number | 'width' | 'height' | ExprRef | SignalRef>;
export type NumericValueDef = ValueDef<number | ExprRef | SignalRef>;
/**
 * A ValueDef with Condition<ValueDef | FieldDef> where either the condition or the value are optional.
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
/**
 * @minProperties 1
 */
export type ValueDefWithCondition<F extends FieldDef<any> | DatumDef<any>, V extends Value = Value> = Partial<ValueDef<V | ExprRef | SignalRef>> & {
    /**
     * A field definition or one or more value definition(s) with a parameter predicate.
     */
    condition?: Conditional<F> | Conditional<ValueDef<V | ExprRef | SignalRef>> | Conditional<ValueDef<V | ExprRef | SignalRef>>[];
};
export type StringValueDefWithCondition<F extends Field, T extends Type = StandardType> = ValueDefWithCondition<MarkPropFieldOrDatumDef<F, T>, string | null>;
export type TypeForShape = 'nominal' | 'ordinal' | 'geojson';
export type ConditionalTemplate = FieldDef<any> | DatumDef | ValueDef<any> | ExprRef | SignalRef;
export type Conditional<CD extends ConditionalTemplate> = ConditionalPredicate<CD> | ConditionalParameter<CD>;
export type ConditionalPredicate<CD extends ConditionalTemplate> = {
    /**
     * Predicate for triggering the condition
     */
    test: LogicalComposition<Predicate>;
} & CD;
export type ConditionalParameter<CD extends ConditionalTemplate> = ParameterPredicate & CD;
export declare function isConditionalParameter<T extends ConditionalTemplate>(c: Conditional<T>): c is ConditionalParameter<T>;
export interface ConditionValueDefMixins<V extends Value = Value> {
    /**
     * One or more value definition(s) with [a parameter or a test predicate](https://vega.github.io/vega-lite/docs/condition.html).
     *
     * __Note:__ A field definition's `condition` property can only contain [conditional value definitions](https://vega.github.io/vega-lite/docs/condition.html#value)
     * since Vega-Lite only allows at most one encoded field per encoding channel.
     */
    condition?: Conditional<ValueDef<V>> | Conditional<ValueDef<V>>[];
}
/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */
export type FieldOrDatumDefWithCondition<F extends FieldDef<any, any> | DatumDef<any>, V extends Value = Value> = F & ConditionValueDefMixins<V | ExprRef | SignalRef>;
export type MarkPropDef<F extends Field, V extends Value, T extends Type = StandardType> = FieldOrDatumDefWithCondition<MarkPropFieldDef<F, T>, V> | FieldOrDatumDefWithCondition<DatumDef<F>, V> | ValueDefWithCondition<MarkPropFieldOrDatumDef<F, T>, V>;
export type ColorDef<F extends Field> = MarkPropDef<F, Gradient | string | null>;
export type NumericMarkPropDef<F extends Field> = MarkPropDef<F, number>;
export type NumericArrayMarkPropDef<F extends Field> = MarkPropDef<F, number[]>;
export type ShapeDef<F extends Field> = MarkPropDef<F, string | null, TypeForShape>;
export type StringFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<StringFieldDef<F>, string>;
export type TextDef<F extends Field> = FieldOrDatumDefWithCondition<StringFieldDef<F>, Text> | FieldOrDatumDefWithCondition<StringDatumDef<F>, Text> | ValueDefWithCondition<StringFieldDef<F>, Text>;
/**
 * A ValueDef with optional Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
/**
 * Reference to a repeated value.
 */
export interface RepeatRef {
    repeat: 'row' | 'column' | 'repeat' | 'layer';
}
export type FieldName = string;
export type Field = FieldName | RepeatRef;
export declare function isRepeatRef(field: Field | any): field is RepeatRef;
/** @@hidden */
export type HiddenCompositeAggregate = CompositeAggregate;
export interface FieldDefBase<F, B extends Bin = Bin> extends BandMixins {
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: F;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: TimeUnit | BinnedTimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | HiddenCompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: B;
}
export declare function toFieldDefBase(fieldDef: FieldDef<string>): FieldDefBase<string>;
export interface TypeMixins<T extends Type> {
    /**
     * The type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`) for the encoded field or constant value (`datum`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     * Vega-Lite automatically infers data types in many cases as discussed below. However, type is required for a field if:
     * (1) the field is not nominal and the field encoding has no specified `aggregate` (except `argmin` and `argmax`), `bin`, scale type, custom `sort` order, nor `timeUnit`
     * or (2) if you wish to use an ordinal scale for a field with `bin` or `timeUnit`.
     *
     * __Default value:__
     *
     * 1) For a data `field`, `"nominal"` is the default data type unless the field encoding has `aggregate`, `channel`, `bin`, scale type, `sort`, or `timeUnit` that satisfies the following criteria:
     * - `"quantitative"` is the default type if (1) the encoded field contains `bin` or `aggregate` except `"argmin"` and `"argmax"`, (2) the encoding channel is `latitude` or `longitude` channel or (3) if the specified scale type is [a quantitative scale](https://vega.github.io/vega-lite/docs/scale.html#type).
     * - `"temporal"` is the default type if (1) the encoded field contains `timeUnit` or (2) the specified scale type is a time or utc scale
     * - `"ordinal"` is the default type if (1) the encoded field contains a [custom `sort` order](https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order), (2) the specified scale type is an ordinal/point/band scale, or (3) the encoding channel is `order`.
     *
     * 2) For a constant value in data domain (`datum`):
     * - `"quantitative"` if the datum is a number
     * - `"nominal"` if the datum is a string
     * - `"temporal"` if the datum is [a date time object](https://vega.github.io/vega-lite/docs/datetime.html)
     *
     * __Note:__
     * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (default, for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they must have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type?: T;
}
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export type TypedFieldDef<F extends Field, T extends Type = any, B extends Bin = boolean | BinParams | 'binned' | null> = FieldDefBase<F, B> & TitleMixins & TypeMixins<T>;
export interface SortableFieldDef<F extends Field, T extends Type = StandardType, B extends Bin = boolean | BinParams | null> extends TypedFieldDef<F, T, B> {
    /**
     * Sort order for the encoded field.
     *
     * For continuous fields (quantitative or temporal), `sort` can be either `"ascending"` or `"descending"`.
     *
     * For discrete fields, `sort` can be one of the following:
     * - `"ascending"` or `"descending"` -- for sorting by the values' natural order in JavaScript.
     * - [A string indicating an encoding channel name to sort by](https://vega.github.io/vega-lite/docs/sort.html#sort-by-encoding) (e.g., `"x"` or `"y"`) with an optional minus prefix for descending sort (e.g., `"-x"` to sort by x-field, descending). This channel string is short-form of [a sort-by-encoding definition](https://vega.github.io/vega-lite/docs/sort.html#sort-by-encoding). For example, `"sort": "-x"` is equivalent to `"sort": {"encoding": "x", "order": "descending"}`.
     * - [A sort field definition](https://vega.github.io/vega-lite/docs/sort.html#sort-field) for sorting by another field.
     * - [An array specifying the field values in preferred order](https://vega.github.io/vega-lite/docs/sort.html#sort-array). In this case, the sort order will obey the values in the array, followed by any unspecified values in their original order. For discrete time field, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).
     * - `null` indicating no sort.
     *
     * __Default value:__ `"ascending"`
     *
     * __Note:__ `null` and sorting by another channel is not supported for `row` and `column`.
     *
     * __See also:__ [`sort`](https://vega.github.io/vega-lite/docs/sort.html) documentation.
     */
    sort?: Sort<F>;
}
export declare function isSortableFieldDef<F extends Field>(fieldDef: FieldDef<F>): fieldDef is SortableFieldDef<F>;
export type ScaleFieldDef<F extends Field, T extends Type = StandardType, B extends Bin = boolean | BinParams | null> = SortableFieldDef<F, T, B> & ScaleMixins;
export interface ScaleMixins {
    /**
     * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
     *
     * If `null`, the scale will be [disabled and the data value will be directly encoded](https://vega.github.io/vega-lite/docs/scale.html#disable).
     *
     * __Default value:__ If undefined, default [scale properties](https://vega.github.io/vega-lite/docs/scale.html) are applied.
     *
     * __See also:__ [`scale`](https://vega.github.io/vega-lite/docs/scale.html) documentation.
     */
    scale?: Scale | null;
}
export type OffsetDef<F extends Field, T extends Type = StandardType> = ScaleFieldDef<F, T> | ScaleDatumDef<F> | ValueDef<number>;
export interface DatumDef<F extends Field = string, V extends PrimitiveValue | DateTime | ExprRef | SignalRef = PrimitiveValue | DateTime | ExprRef | SignalRef> extends Partial<TypeMixins<Type>>, BandMixins, TitleMixins {
    /**
     * A constant value in data domain.
     */
    datum?: F extends RepeatRef ? V | RepeatRef : V;
}
export interface FormatMixins {
    /**
     * When used with the default `"number"` and `"time"` format type, the text formatting pattern for labels of guides (axes, legends, headers) and text marks.
     *
     * - If the format type is `"number"` (e.g., for quantitative fields), this is D3's [number format pattern](https://github.com/d3/d3-format#locale_format).
     * - If the format type is `"time"` (e.g., for temporal fields), this is D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format).
     *
     * See the [format documentation](https://vega.github.io/vega-lite/docs/format.html) for more examples.
     *
     * When used with a [custom `formatType`](https://vega.github.io/vega-lite/docs/config.html#custom-format-type), this value will be passed as `format` alongside `datum.value` to the registered function.
     *
     * __Default value:__  Derived from [numberFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for number format and from [timeFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for time format.
     */
    format?: string | Dict<unknown>;
    /**
     * The format type for labels. One of `"number"`, `"time"`, or a [registered custom format type](https://vega.github.io/vega-lite/docs/config.html#custom-format-type).
     *
     * __Default value:__
     * - `"time"` for temporal fields and ordinal and nominal fields with `timeUnit`.
     * - `"number"` for quantitative fields as well as ordinal and nominal fields without `timeUnit`.
     */
    formatType?: 'number' | 'time' | string;
}
export type StringDatumDef<F extends Field = string> = DatumDef<F> & FormatMixins;
export type ScaleDatumDef<F extends Field = string> = ScaleMixins & DatumDef<F>;
/**
 * A field definition of a secondary channel that shares a scale with another primary channel. For example, `x2`, `xError` and `xError2` share the same scale with `x`.
 */
export type SecondaryFieldDef<F extends Field> = FieldDefBase<F, null> & TitleMixins;
export type Position2Def<F extends Field> = SecondaryFieldDef<F> | DatumDef<F> | PositionValueDef;
export type SecondaryChannelDef<F extends Field> = Encoding<F>['x2' | 'y2'];
/**
 * Field Def without scale (and without bin: "binned" support).
 */
export type FieldDefWithoutScale<F extends Field, T extends Type = StandardType> = TypedFieldDef<F, T>;
export type LatLongFieldDef<F extends Field> = FieldDefBase<F, null> & TitleMixins & Partial<TypeMixins<'quantitative'>>;
export type LatLongDef<F extends Field> = LatLongFieldDef<F> | DatumDef<F>;
export type PositionFieldDefBase<F extends Field> = ScaleFieldDef<F, StandardType, boolean | BinParams | 'binned' | null> & PositionBaseMixins;
export type PositionDatumDefBase<F extends Field> = ScaleDatumDef<F> & PositionBaseMixins;
export interface PositionBaseMixins {
    /**
     * Type of stacking offset if the field should be stacked.
     * `stack` is only applicable for `x`, `y`, `theta`, and `radius` channels with continuous domains.
     * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
     *
     * `stack` can be one of the following values:
     * - `"zero"` or `true`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](https://vega.github.io/vega-lite/docs/stack.html#bar) and [area](https://vega.github.io/vega-lite/docs/stack.html#area) chart).
     * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](https://vega.github.io/vega-lite/docs/stack.html#normalized) and pie charts [with percentage tooltip](https://vega.github.io/vega-lite/docs/arc.html#tooltip)). <br/>
     * -`"center"` - stacking with center baseline (for [streamgraph](https://vega.github.io/vega-lite/docs/stack.html#streamgraph)).
     * - `null` or `false` - No-stacking. This will produce layered [bar](https://vega.github.io/vega-lite/docs/stack.html#layered-bar-chart) and area chart.
     *
     * __Default value:__ `zero` for plots with all of the following conditions are true:
     * (1) the mark is `bar`, `area`, or `arc`;
     * (2) the stacked measure channel (x or y) has a linear scale;
     * (3) At least one of non-position channels mapped to an unaggregated field that is different from x and y. Otherwise, `null` by default.
     *
     * __See also:__ [`stack`](https://vega.github.io/vega-lite/docs/stack.html) documentation.
     */
    stack?: StackOffset | null | boolean;
}
export interface BandMixins {
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
}
export type PositionFieldDef<F extends Field> = PositionFieldDefBase<F> & PositionMixins;
export type PositionDatumDef<F extends Field> = PositionDatumDefBase<F> & PositionMixins;
export type PositionDef<F extends Field> = PositionFieldDef<F> | PositionDatumDef<F> | PositionValueDef;
export interface PositionMixins {
    /**
     * An object defining properties of axis's gridlines, ticks and labels.
     * If `null`, the axis for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [axis properties](https://vega.github.io/vega-lite/docs/axis.html) are applied.
     *
     * __See also:__ [`axis`](https://vega.github.io/vega-lite/docs/axis.html) documentation.
     */
    axis?: Axis<ExprRef | SignalRef> | null;
    /**
     * An object defining the properties of the Impute Operation to be applied.
     * The field value of the other positional channel is taken as `key` of the `Impute` Operation.
     * The field of the `color` channel if specified is used as `groupby` of the `Impute` Operation.
     *
     * __See also:__ [`impute`](https://vega.github.io/vega-lite/docs/impute.html) documentation.
     */
    impute?: ImputeParams | null;
}
export type PolarDef<F extends Field> = PositionFieldDefBase<F> | PositionDatumDefBase<F> | PositionValueDef;
export declare function getBandPosition({ fieldDef, fieldDef2, markDef: mark, config }: {
    fieldDef: FieldDef<string> | DatumDef;
    fieldDef2?: SecondaryChannelDef<string>;
    markDef: MarkDef<Mark, SignalRef>;
    config: Config<SignalRef>;
}): number;
export declare function getBandSize({ channel, fieldDef, fieldDef2, markDef: mark, config, scaleType, useVlSizeChannel }: {
    channel: PositionScaleChannel | PolarPositionScaleChannel;
    fieldDef: ChannelDef<string>;
    fieldDef2?: SecondaryChannelDef<string>;
    markDef: MarkDef<Mark, SignalRef>;
    config: Config<SignalRef>;
    scaleType: ScaleType;
    useVlSizeChannel?: boolean;
}): number | RelativeBandSize | SignalRef;
export declare function hasBandEnd(fieldDef: FieldDef<string>, fieldDef2: SecondaryChannelDef<string>, markDef: MarkDef<Mark, SignalRef>, config: Config<SignalRef>): boolean;
/**
 * Field definition of a mark property, which can contain a legend.
 */
export type MarkPropFieldDef<F extends Field, T extends Type = Type> = ScaleFieldDef<F, T, boolean | BinParams | null> & LegendMixins;
export type MarkPropDatumDef<F extends Field> = LegendMixins & ScaleDatumDef<F>;
export type MarkPropFieldOrDatumDef<F extends Field, T extends Type = Type> = MarkPropFieldDef<F, T> | MarkPropDatumDef<F>;
export interface LegendMixins {
    /**
     * An object defining properties of the legend.
     * If `null`, the legend for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [legend properties](https://vega.github.io/vega-lite/docs/legend.html) are applied.
     *
     * __See also:__ [`legend`](https://vega.github.io/vega-lite/docs/legend.html) documentation.
     */
    legend?: Legend<ExprRef | SignalRef> | null;
}
export type OrderFieldDef<F extends Field> = FieldDefWithoutScale<F> & OrderOnlyDef;
export interface OrderOnlyDef {
    /**
     * The sort order. One of `"ascending"` (default) or `"descending"`.
     */
    sort?: SortOrder;
}
export declare function isOrderOnlyDef<F extends Field>(orderDef: OrderFieldDef<F> | OrderFieldDef<F>[] | OrderValueDef | OrderOnlyDef): orderDef is OrderOnlyDef;
export type OrderValueDef = ConditionValueDefMixins<number> & NumericValueDef;
export interface StringFieldDef<F extends Field> extends FieldDefWithoutScale<F, StandardType>, FormatMixins {
}
export type FieldDef<F extends Field, T extends Type = any> = SecondaryFieldDef<F> | TypedFieldDef<F, T>;
export type ChannelDef<F extends Field = string> = Encoding<F>[keyof Encoding<F>];
export declare function isConditionalDef<CD extends ChannelDef<any> | GuideEncodingConditionalValueDef | ExprRef | SignalRef>(channelDef: CD): channelDef is CD & {
    condition: Conditional<any>;
};
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export declare function hasConditionalFieldDef<F extends Field>(channelDef: Partial<ChannelDef<F>>): channelDef is {
    condition: Conditional<TypedFieldDef<F>>;
};
export declare function hasConditionalFieldOrDatumDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is {
    condition: Conditional<TypedFieldDef<F>>;
};
export declare function hasConditionalValueDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is ValueDef<any> & {
    condition: Conditional<ValueDef<any>> | Conditional<ValueDef<any>>[];
};
export declare function isFieldDef<F extends Field>(channelDef: Partial<ChannelDef<F>> | FieldDefBase<F> | DatumDef<F, any>): channelDef is FieldDefBase<F> | TypedFieldDef<F> | SecondaryFieldDef<F>;
export declare function channelDefType<F extends Field>(channelDef: ChannelDef<F>): Type | undefined;
export declare function isDatumDef<F extends Field>(channelDef: Partial<ChannelDef<F>> | FieldDefBase<F> | DatumDef<F, any>): channelDef is DatumDef<F, any>;
export declare function isContinuousFieldOrDatumDef<F extends Field>(cd: ChannelDef<F>): cd is TypedFieldDef<F> | DatumDef<F, number>;
export declare function isUnbinnedQuantitativeFieldOrDatumDef<F extends Field>(cd: ChannelDef<F>): boolean;
export declare function isNumericDataDef<F extends Field>(cd: ChannelDef<F>): cd is DatumDef<F, number>;
export declare function isFieldOrDatumDef<F extends Field>(channelDef: Partial<ChannelDef<F>>): channelDef is FieldDef<F, any> | DatumDef<F>;
export declare function isTypedFieldDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is TypedFieldDef<F>;
export declare function isValueDef<F extends Field>(channelDef: Partial<ChannelDef<F>>): channelDef is ValueDef<any>;
export declare function isScaleFieldDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is ScaleFieldDef<F>;
export declare function isPositionFieldOrDatumDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is PositionFieldDef<F> | PositionDatumDef<F>;
export declare function isMarkPropFieldOrDatumDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is MarkPropFieldDef<F, any> | MarkPropDatumDef<F>;
export declare function isStringFieldOrDatumDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is StringFieldDef<F> | StringDatumDef<F>;
export declare function toStringFieldDef<F extends Field>(fieldDef: FieldDef<F>): StringFieldDef<F>;
export interface FieldRefOption {
    /** Exclude bin, aggregate, timeUnit */
    nofn?: boolean;
    /** Wrap the field with datum, parent, or datum.datum (e.g., datum['...'] for Vega Expression */
    expr?: 'datum' | 'parent' | 'datum.datum';
    /** Prepend fn with custom function prefix */
    prefix?: string;
    /** Append suffix to the field ref for bin (default='start') */
    binSuffix?: 'end' | 'range' | 'mid';
    /** Append suffix to the field ref (general) */
    suffix?: string;
    /**
     * Use the field name for `as` in a transform.
     * We will not escape nested accesses because Vega transform outputs cannot be nested.
     */
    forAs?: boolean;
}
/**
 * Get a Vega field reference from a Vega-Lite field def.
 */
export declare function vgField(fieldDef: FieldDefBase<string> | WindowFieldDef | AggregatedFieldDef, opt?: FieldRefOption): string;
export declare function isDiscrete(def: TypedFieldDef<Field> | DatumDef<any, any>): boolean;
export declare function isDiscretizing(def: TypedFieldDef<Field> | DatumDef<any, any>): boolean;
export declare function isCount(fieldDef: FieldDefBase<Field>): boolean;
export type FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => string;
export declare function verbalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function functionalTitleFormatter(fieldDef: FieldDefBase<string>): string;
export declare const defaultTitleFormatter: FieldTitleFormatter;
export declare function setTitleFormatter(formatter: FieldTitleFormatter): void;
export declare function resetTitleFormatter(): void;
export declare function title(fieldOrDatumDef: TypedFieldDef<string> | SecondaryFieldDef<string> | DatumDef, config: Config, { allowDisabling, includeDefault }: {
    allowDisabling: boolean;
    includeDefault?: boolean;
}): SignalRef | Text;
export declare function getGuide(fieldDef: TypedFieldDef<string> | SecondaryFieldDef<string> | DatumDef): Guide;
export declare function defaultTitle(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function getFormatMixins(fieldDef: TypedFieldDef<string> | DatumDef): {
    format: string | Dict<unknown>;
    formatType: string;
};
export declare function defaultType<T extends TypedFieldDef<Field>>(fieldDef: T, channel: ExtendedChannel): Type;
/**
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
export declare function getFieldDef<F extends Field>(channelDef: ChannelDef<F>): FieldDef<F>;
export declare function getFieldOrDatumDef<F extends Field = string, CD extends ChannelDef<F> = ChannelDef<F>>(channelDef: CD): FieldDef<F> | DatumDef<F>;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export declare function initChannelDef(channelDef: ChannelDef<string>, channel: ExtendedChannel, config: Config, opt?: {
    compositeMark?: boolean;
}): ChannelDef<string>;
export declare function initFieldOrDatumDef(fd: FieldDef<string, any> | DatumDef, channel: ExtendedChannel, config: Config, opt: {
    compositeMark?: boolean;
}): FieldDef<string, any> | DatumDef;
export declare function initFieldDef(fd: FieldDef<string, any>, channel: ExtendedChannel, { compositeMark }?: {
    compositeMark?: boolean;
}): {
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: BinnedTimeUnit | TimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | CompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: null;
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
    title?: SignalRef | Text;
} | {
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: BinnedTimeUnit | TimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | CompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: boolean | BinParams | "binned";
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
    title?: SignalRef | Text;
    /**
     * The type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`) for the encoded field or constant value (`datum`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     * Vega-Lite automatically infers data types in many cases as discussed below. However, type is required for a field if:
     * (1) the field is not nominal and the field encoding has no specified `aggregate` (except `argmin` and `argmax`), `bin`, scale type, custom `sort` order, nor `timeUnit`
     * or (2) if you wish to use an ordinal scale for a field with `bin` or `timeUnit`.
     *
     * __Default value:__
     *
     * 1) For a data `field`, `"nominal"` is the default data type unless the field encoding has `aggregate`, `channel`, `bin`, scale type, `sort`, or `timeUnit` that satisfies the following criteria:
     * - `"quantitative"` is the default type if (1) the encoded field contains `bin` or `aggregate` except `"argmin"` and `"argmax"`, (2) the encoding channel is `latitude` or `longitude` channel or (3) if the specified scale type is [a quantitative scale](https://vega.github.io/vega-lite/docs/scale.html#type).
     * - `"temporal"` is the default type if (1) the encoded field contains `timeUnit` or (2) the specified scale type is a time or utc scale
     * - `"ordinal"` is the default type if (1) the encoded field contains a [custom `sort` order](https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order), (2) the specified scale type is an ordinal/point/band scale, or (3) the encoding channel is `order`.
     *
     * 2) For a constant value in data domain (`datum`):
     * - `"quantitative"` if the datum is a number
     * - `"nominal"` if the datum is a string
     * - `"temporal"` if the datum is [a date time object](https://vega.github.io/vega-lite/docs/datetime.html)
     *
     * __Note:__
     * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (default, for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they must have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type?: any;
} | {
    sort: {
        encoding: "fill" | "stroke" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "x" | "y" | "shape";
        order?: undefined;
    };
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: BinnedTimeUnit | TimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | CompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: boolean | BinParams;
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
    title?: SignalRef | Text;
    /**
     * The type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`) for the encoded field or constant value (`datum`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     * Vega-Lite automatically infers data types in many cases as discussed below. However, type is required for a field if:
     * (1) the field is not nominal and the field encoding has no specified `aggregate` (except `argmin` and `argmax`), `bin`, scale type, custom `sort` order, nor `timeUnit`
     * or (2) if you wish to use an ordinal scale for a field with `bin` or `timeUnit`.
     *
     * __Default value:__
     *
     * 1) For a data `field`, `"nominal"` is the default data type unless the field encoding has `aggregate`, `channel`, `bin`, scale type, `sort`, or `timeUnit` that satisfies the following criteria:
     * - `"quantitative"` is the default type if (1) the encoded field contains `bin` or `aggregate` except `"argmin"` and `"argmax"`, (2) the encoding channel is `latitude` or `longitude` channel or (3) if the specified scale type is [a quantitative scale](https://vega.github.io/vega-lite/docs/scale.html#type).
     * - `"temporal"` is the default type if (1) the encoded field contains `timeUnit` or (2) the specified scale type is a time or utc scale
     * - `"ordinal"` is the default type if (1) the encoded field contains a [custom `sort` order](https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order), (2) the specified scale type is an ordinal/point/band scale, or (3) the encoding channel is `order`.
     *
     * 2) For a constant value in data domain (`datum`):
     * - `"quantitative"` if the datum is a number
     * - `"nominal"` if the datum is a string
     * - `"temporal"` if the datum is [a date time object](https://vega.github.io/vega-lite/docs/datetime.html)
     *
     * __Note:__
     * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (default, for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they must have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type?: StandardType;
} | {
    sort: {
        encoding: "fill" | "stroke" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "x" | "y" | "shape";
        order: string;
    };
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: BinnedTimeUnit | TimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | CompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: boolean | BinParams;
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
    title?: SignalRef | Text;
    /**
     * The type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`) for the encoded field or constant value (`datum`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     * Vega-Lite automatically infers data types in many cases as discussed below. However, type is required for a field if:
     * (1) the field is not nominal and the field encoding has no specified `aggregate` (except `argmin` and `argmax`), `bin`, scale type, custom `sort` order, nor `timeUnit`
     * or (2) if you wish to use an ordinal scale for a field with `bin` or `timeUnit`.
     *
     * __Default value:__
     *
     * 1) For a data `field`, `"nominal"` is the default data type unless the field encoding has `aggregate`, `channel`, `bin`, scale type, `sort`, or `timeUnit` that satisfies the following criteria:
     * - `"quantitative"` is the default type if (1) the encoded field contains `bin` or `aggregate` except `"argmin"` and `"argmax"`, (2) the encoding channel is `latitude` or `longitude` channel or (3) if the specified scale type is [a quantitative scale](https://vega.github.io/vega-lite/docs/scale.html#type).
     * - `"temporal"` is the default type if (1) the encoded field contains `timeUnit` or (2) the specified scale type is a time or utc scale
     * - `"ordinal"` is the default type if (1) the encoded field contains a [custom `sort` order](https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order), (2) the specified scale type is an ordinal/point/band scale, or (3) the encoding channel is `order`.
     *
     * 2) For a constant value in data domain (`datum`):
     * - `"quantitative"` if the datum is a number
     * - `"nominal"` if the datum is a string
     * - `"temporal"` if the datum is [a date time object](https://vega.github.io/vega-lite/docs/datetime.html)
     *
     * __Note:__
     * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (default, for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they must have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type?: StandardType;
} | {
    header: {
        labelOrient: import("vega").Orient;
        titleOrient: import("vega").Orient;
        titleAnchor?: import("vega").TitleAnchor;
        titleAlign?: any;
        titleAngle?: number;
        titleBaseline?: any;
        titleColor?: any;
        titleFont?: any;
        titleFontSize?: any;
        titleFontStyle?: any;
        titleFontWeight?: any;
        titleLimit?: any;
        titleLineHeight?: any;
        titlePadding?: any;
        labels?: boolean;
        labelAlign?: any;
        labelBaseline?: any;
        labelAnchor?: import("vega").TitleAnchor;
        labelExpr?: string;
        labelAngle?: number;
        labelColor?: any;
        labelFont?: any;
        labelFontSize?: any;
        labelFontStyle?: any;
        labelFontWeight?: any;
        labelLimit?: any;
        labelLineHeight?: any;
        labelPadding?: any;
        /**
         * When used with the default `"number"` and `"time"` format type, the text formatting pattern for labels of guides (axes, legends, headers) and text marks.
         *
         * - If the format type is `"number"` (e.g., for quantitative fields), this is D3's [number format pattern](https://github.com/d3/d3-format#locale_format).
         * - If the format type is `"time"` (e.g., for temporal fields), this is D3's [time format pattern](https://github.com/d3/d3-time-format#locale_format).
         *
         * See the [format documentation](https://vega.github.io/vega-lite/docs/format.html) for more examples.
         *
         * When used with a [custom `formatType`](https://vega.github.io/vega-lite/docs/config.html#custom-format-type), this value will be passed as `format` alongside `datum.value` to the registered function.
         *
         * __Default value:__  Derived from [numberFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for number format and from [timeFormat](https://vega.github.io/vega-lite/docs/config.html#format) config for time format.
         */
        format?: string | Dict<unknown>;
        /**
         * The format type for labels. One of `"number"`, `"time"`, or a [registered custom format type](https://vega.github.io/vega-lite/docs/config.html#custom-format-type).
         *
         * __Default value:__
         * - `"time"` for temporal fields and ordinal and nominal fields with `timeUnit`.
         * - `"number"` for quantitative fields as well as ordinal and nominal fields without `timeUnit`.
         */
        formatType?: string;
        title?: SignalRef | Text;
    };
    sort?: SortOrder | import("./sort").SortArray | import("./sort").EncodingSortField<string>;
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
     *
     * __Notes:__
     * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     * 2) `field` is not required if `aggregate` is `count`.
     */
    field?: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: BinnedTimeUnit | TimeUnit | TimeUnitParams;
    /**
     * Aggregation function for the field
     * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | CompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html#bin-parameters) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: boolean | BinParams;
    /**
     * Relative position on a band of a stacked, binned, time unit, or band scale. For example, the marks will be positioned at the beginning of the band if set to `0`, and at the middle of the band if set to `0.5`.
     *
     * @minimum 0
     * @maximum 1
     */
    bandPosition?: number;
    title?: SignalRef | Text;
    /**
     * The type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`) for the encoded field or constant value (`datum`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     * Vega-Lite automatically infers data types in many cases as discussed below. However, type is required for a field if:
     * (1) the field is not nominal and the field encoding has no specified `aggregate` (except `argmin` and `argmax`), `bin`, scale type, custom `sort` order, nor `timeUnit`
     * or (2) if you wish to use an ordinal scale for a field with `bin` or `timeUnit`.
     *
     * __Default value:__
     *
     * 1) For a data `field`, `"nominal"` is the default data type unless the field encoding has `aggregate`, `channel`, `bin`, scale type, `sort`, or `timeUnit` that satisfies the following criteria:
     * - `"quantitative"` is the default type if (1) the encoded field contains `bin` or `aggregate` except `"argmin"` and `"argmax"`, (2) the encoding channel is `latitude` or `longitude` channel or (3) if the specified scale type is [a quantitative scale](https://vega.github.io/vega-lite/docs/scale.html#type).
     * - `"temporal"` is the default type if (1) the encoded field contains `timeUnit` or (2) the specified scale type is a time or utc scale
     * - `"ordinal"` is the default type if (1) the encoded field contains a [custom `sort` order](https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order), (2) the specified scale type is an ordinal/point/band scale, or (3) the encoding channel is `order`.
     *
     * 2) For a constant value in data domain (`datum`):
     * - `"quantitative"` if the datum is a number
     * - `"nominal"` if the datum is a string
     * - `"temporal"` if the datum is [a date time object](https://vega.github.io/vega-lite/docs/datetime.html)
     *
     * __Note:__
     * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (default, for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they must have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type?: StandardType;
};
export declare function normalizeBin(bin: BinParams | boolean | 'binned', channel?: ExtendedChannel): BinParams;
export declare function channelCompatibility(fieldDef: TypedFieldDef<Field>, channel: ExtendedChannel): {
    compatible: boolean;
    warning?: string;
};
/**
 * Check if the field def uses a time format or does not use any format but is temporal
 * (this does not cover field defs that are temporal but use a number format).
 */
export declare function isFieldOrDatumDefForTimeFormat(fieldOrDatumDef: FieldDef<string> | DatumDef): boolean;
/**
 * Check if field def has type `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
 */
export declare function isTimeFieldDef(def: FieldDef<any> | DatumDef): boolean;
/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export declare function valueExpr(v: number | string | boolean | DateTime | ExprRef | SignalRef | number[], { timeUnit, type, wrapTime, undefinedIfExprNotRequired }: {
    timeUnit: TimeUnit | TimeUnitParams;
    type?: Type;
    wrapTime?: boolean;
    undefinedIfExprNotRequired?: boolean;
}): string;
/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export declare function valueArray(fieldOrDatumDef: TypedFieldDef<string> | DatumDef, values: (number | string | boolean | DateTime)[]): (string | number | boolean | DateTime | {
    signal: string;
})[];
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export declare function binRequiresRange(fieldDef: FieldDef<string>, channel: Channel): boolean;
//# sourceMappingURL=channeldef.d.ts.map