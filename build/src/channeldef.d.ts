import { Aggregate } from './aggregate';
import { Axis } from './axis';
import { Bin, BinParams } from './bin';
import { Channel } from './channel';
import { CompositeAggregate } from './compositemark';
import { Config } from './config';
import { DateTime } from './datetime';
import { FormatMixins, Guide, TitleMixins } from './guide';
import { ImputeParams } from './impute';
import { Legend } from './legend';
import { LogicalOperand } from './logical';
import { Predicate } from './predicate';
import { Scale } from './scale';
import { Sort, SortOrder } from './sort';
import { StackOffset } from './stack';
import { TimeUnit } from './timeunit';
import { AggregatedFieldDef, WindowFieldDef } from './transform';
import { StandardType, Type } from './type';
export declare type Value = number | string | boolean | null;
/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef<V extends Value = Value> {
    /**
     * A constant value in visual domain (e.g., `"red"` / "#0099ff" for color, values between `0` to `1` for opacity).
     */
    value: V;
}
/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type.
 */
export declare type ChannelDefWithCondition<F extends FieldDef<any>, V extends Value> = FieldDefWithCondition<F, V> | ValueDefWithCondition<F, V>;
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
export declare type ValueDefWithCondition<F extends FieldDef<any>, V extends Value = Value> = Partial<ValueDef<V>> & {
    /**
     * A field definition or one or more value definition(s) with a selection predicate.
     */
    condition?: Conditional<F> | Conditional<ValueDef<V>> | Conditional<ValueDef<V>>[];
};
export declare type StringValueDefWithCondition<F extends Field, T extends Type = StandardType> = ValueDefWithCondition<MarkPropFieldDef<F, T>, string | null>;
export declare type NumericValueDefWithCondition<F extends Field> = ValueDefWithCondition<MarkPropFieldDef<F, StandardType>, number>;
export declare type TypeForShape = 'nominal' | 'ordinal' | 'geojson';
export declare type ShapeValueDefWithCondition<F extends Field> = StringValueDefWithCondition<F, TypeForShape>;
export declare type TextValueDefWithCondition<F extends Field> = ValueDefWithCondition<TextFieldDef<F>, Value>;
export declare type Conditional<CD extends FieldDef<any> | ValueDef<any>> = ConditionalPredicate<CD> | ConditionalSelection<CD>;
export declare type ConditionalPredicate<CD extends FieldDef<any> | ValueDef<any>> = {
    /**
     * Predicate for triggering the condition
     */
    test: LogicalOperand<Predicate>;
} & CD;
export declare type ConditionalSelection<CD extends FieldDef<any> | ValueDef<any>> = {
    /**
     * A [selection name](https://vega.github.io/vega-lite/docs/selection.html), or a series of [composed selections](https://vega.github.io/vega-lite/docs/selection.html#compose).
     */
    selection: LogicalOperand<string>;
} & CD;
export declare function isConditionalSelection<T>(c: Conditional<T>): c is ConditionalSelection<T>;
export interface ConditionValueDefMixins<V extends Value = Value> {
    /**
     * One or more value definition(s) with [a selection or a test predicate](https://vega.github.io/vega-lite/docs/condition.html).
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
export declare type FieldDefWithCondition<F extends FieldDef<any>, V extends Value = Value> = F & ConditionValueDefMixins<V>;
export declare type StringFieldDefWithCondition<F extends Field, T extends Type = StandardType> = FieldDefWithCondition<MarkPropFieldDef<F, T>, string | null>;
export declare type NumericFieldDefWithCondition<F extends Field> = FieldDefWithCondition<MarkPropFieldDef<F, StandardType>, number>;
export declare type ShapeFieldDefWithCondition<F extends Field> = StringFieldDefWithCondition<F, TypeForShape>;
export declare type TextFieldDefWithCondition<F extends Field> = FieldDefWithCondition<TextFieldDef<F>, Value>;
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
    repeat: 'row' | 'column' | 'repeat';
}
export declare type FieldName = string;
export declare type Field = FieldName | RepeatRef;
export declare function isRepeatRef(field: Field): field is RepeatRef;
/** @hide */
export declare type HiddenCompositeAggregate = CompositeAggregate;
export interface FieldDefBase<F, B extends Bin = Bin> {
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
    timeUnit?: TimeUnit;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: Aggregate | HiddenCompositeAggregate;
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: B;
}
export declare function toFieldDefBase(fieldDef: TypedFieldDef<string>): FieldDefBase<string>;
export interface TypeMixins<T extends Type> {
    /**
     * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     *
     * __Note:__
     *
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - Data `type` describes the semantics of the data rather than the primitive data types (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat", "type": "quantitative"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type: T;
}
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export declare type TypedFieldDef<F extends Field, T extends Type = Type, B extends Bin = boolean | BinParams | 'binned' | null> = FieldDefBase<F, B> & TitleMixins & TypeMixins<T>;
export interface SortableFieldDef<F extends Field, T extends Type = StandardType, B extends Bin = boolean | BinParams | null> extends TypedFieldDef<F, T, B> {
    /**
     * Sort order for the encoded field.
     *
     * For continuous fields (quantitative or temporal), `sort` can be either `"ascending"` or `"descending"`.
     *
     * For discrete fields, `sort` can be one of the following:
     * - `"ascending"` or `"descending"` -- for sorting by the values' natural order in Javascript.
     * - [A sort-by-encoding definition](https://vega.github.io/vega-lite/docs/sort.html#sort-by-encoding) for sorting by another encoding channel. (This type of sort definition is not available for `row` and `column` channels.)
     * - [A sort field definition](https://vega.github.io/vega-lite/docs/sort.html#sort-field) for sorting by another field.
     * - [An array specifying the field values in preferred order](https://vega.github.io/vega-lite/docs/sort.html#sort-array). In this case, the sort order will obey the values in the array, followed by any unspecified values in their original order.  For discrete time field, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).
     * - `null` indicating no sort.
     *
     * __Default value:__ `"ascending"`
     *
     * __Note:__ `null` is not supported for `row` and `column`.
     *
     * __See also:__ [`sort`](https://vega.github.io/vega-lite/docs/sort.html) documentation.
     */
    sort?: Sort<F>;
}
export declare function isSortableFieldDef<F extends Field>(fieldDef: FieldDef<F>): fieldDef is SortableFieldDef<F>;
export interface ScaleFieldDef<F extends Field, T extends Type = StandardType, B extends Bin = boolean | BinParams | null> extends SortableFieldDef<F, T, B> {
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
/**
 * A field definition of a secondary channel that shares a scale with another primary channel.  For example, `x2`, `xError` and `xError2` share the same scale with `x`.
 */
export declare type SecondaryFieldDef<F extends Field> = FieldDefBase<F, null> & TitleMixins;
/**
 * Field Def without scale (and without bin: "binned" support).
 */
export declare type FieldDefWithoutScale<F extends Field, T extends Type = StandardType> = TypedFieldDef<F, T>;
export declare type LatLongFieldDef<F extends Field> = FieldDefBase<F, null> & TitleMixins & Partial<TypeMixins<'quantitative'>>;
export interface PositionFieldDef<F extends Field> extends ScaleFieldDef<F, StandardType, boolean | BinParams | 'binned' | null> {
    /**
     * An object defining properties of axis's gridlines, ticks and labels.
     * If `null`, the axis for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [axis properties](https://vega.github.io/vega-lite/docs/axis.html) are applied.
     *
     * __See also:__ [`axis`](https://vega.github.io/vega-lite/docs/axis.html) documentation.
     */
    axis?: Axis | null;
    /**
     * Type of stacking offset if the field should be stacked.
     * `stack` is only applicable for `x` and `y` channels with continuous domains.
     * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
     *
     * `stack` can be one of the following values:
     * - `"zero"` or `true`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](https://vega.github.io/vega-lite/docs/stack.html#bar) and [area](https://vega.github.io/vega-lite/docs/stack.html#area) chart).
     * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](https://vega.github.io/vega-lite/docs/stack.html#normalized). <br/>
     * -`"center"` - stacking with center baseline (for [streamgraph](https://vega.github.io/vega-lite/docs/stack.html#streamgraph)).
     * - `null` or `false` - No-stacking. This will produce layered [bar](https://vega.github.io/vega-lite/docs/stack.html#layered-bar-chart) and area chart.
     *
     * __Default value:__ `zero` for plots with all of the following conditions are true:
     * (1) the mark is `bar` or `area`;
     * (2) the stacked measure channel (x or y) has a linear scale;
     * (3) At least one of non-position channels mapped to an unaggregated field that is different from x and y.  Otherwise, `null` by default.
     *
     * __See also:__ [`stack`](https://vega.github.io/vega-lite/docs/stack.html) documentation.
     */
    stack?: StackOffset | null | boolean;
    /**
     * An object defining the properties of the Impute Operation to be applied.
     * The field value of the other positional channel is taken as `key` of the `Impute` Operation.
     * The field of the `color` channel if specified is used as `groupby` of the `Impute` Operation.
     *
     * __See also:__ [`impute`](https://vega.github.io/vega-lite/docs/impute.html) documentation.
     */
    impute?: ImputeParams;
}
/**
 * Field definition of a mark property, which can contain a legend.
 */
export declare type MarkPropFieldDef<F extends Field, T extends Type = Type> = ScaleFieldDef<F, T, boolean | BinParams | null> & {
    /**
     * An object defining properties of the legend.
     * If `null`, the legend for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [legend properties](https://vega.github.io/vega-lite/docs/legend.html) are applied.
     *
     * __See also:__ [`legend`](https://vega.github.io/vega-lite/docs/legend.html) documentation.
     */
    legend?: Legend | null;
};
export interface OrderFieldDef<F extends Field> extends FieldDefWithoutScale<F> {
    /**
     * The sort order. One of `"ascending"` (default) or `"descending"`.
     */
    sort?: SortOrder;
}
export interface TextFieldDef<F extends Field> extends FieldDefWithoutScale<F, StandardType>, FormatMixins {
}
export declare type FieldDef<F extends Field> = SecondaryFieldDef<F> | TypedFieldDef<F>;
export declare type ChannelDef<FD extends FieldDef<any> = FieldDef<string>, V extends Value = Value> = ChannelDefWithCondition<FD, V>;
export declare function isConditionalDef<F extends Field, V extends Value>(channelDef: ChannelDef<FieldDef<F>, V>): channelDef is ChannelDefWithCondition<FieldDef<F>, V>;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export declare function hasConditionalFieldDef<F extends Field, V extends Value>(channelDef: ChannelDef<FieldDef<F>, V>): channelDef is Partial<ValueDef<V>> & {
    condition: Conditional<TypedFieldDef<F>>;
};
export declare function hasConditionalValueDef<F extends Field, V extends Value>(channelDef: ChannelDef<FieldDef<F>, V>): channelDef is ValueDef<V> & {
    condition: Conditional<ValueDef<V>> | Conditional<ValueDef<V>>[];
};
export declare function isFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is TypedFieldDef<F> | SecondaryFieldDef<F> | PositionFieldDef<F> | ScaleFieldDef<F> | MarkPropFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F>;
export declare function isTypedFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is TypedFieldDef<F>;
export declare function isStringFieldDef(channelDef: ChannelDef<FieldDef<Field>>): channelDef is TypedFieldDef<string>;
export declare function isValueDef<F extends Field, V extends Value>(channelDef: ChannelDef<FieldDef<F>, V>): channelDef is ValueDef<V>;
export declare function isScaleFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is ScaleFieldDef<F>;
export declare function isPositionFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is PositionFieldDef<F>;
export declare function isMarkPropFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is MarkPropFieldDef<F>;
export declare function isTextFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): channelDef is TextFieldDef<F>;
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
export declare function isDiscrete(fieldDef: TypedFieldDef<Field>): boolean;
export declare function isContinuous(fieldDef: TypedFieldDef<Field>): boolean;
export declare function isCount(fieldDef: FieldDefBase<Field>): boolean;
export declare type FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => string;
export declare function verbalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function functionalTitleFormatter(fieldDef: FieldDefBase<string>): string;
export declare const defaultTitleFormatter: FieldTitleFormatter;
export declare function setTitleFormatter(formatter: FieldTitleFormatter): void;
export declare function resetTitleFormatter(): void;
export declare function title(fieldDef: TypedFieldDef<string> | SecondaryFieldDef<string>, config: Config, { allowDisabling, includeDefault }: {
    allowDisabling: boolean;
    includeDefault?: boolean;
}): string;
export declare function getGuide(fieldDef: TypedFieldDef<string> | SecondaryFieldDef<string>): Guide;
export declare function defaultTitle(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function format(fieldDef: TypedFieldDef<string>): string;
export declare function defaultType(fieldDef: TypedFieldDef<Field>, channel: Channel): Type;
/**
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
export declare function getFieldDef<F extends Field>(channelDef: ChannelDef<FieldDef<F>>): FieldDef<F>;
export declare function getTypedFieldDef<F extends Field>(channelDef: ChannelDef<TypedFieldDef<F>>): TypedFieldDef<F>;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export declare function normalize(channelDef: ChannelDef, channel: Channel): ChannelDef<any>;
export declare function normalizeFieldDef(fieldDef: FieldDef<string>, channel: Channel): {
    field: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: TimeUnit;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: "argmax" | "argmin" | "average" | "count" | "distinct" | "max" | "mean" | "median" | "min" | "missing" | "q1" | "q3" | "ci0" | "ci1" | "stderr" | "stdev" | "stdevp" | "sum" | "valid" | "values" | "variance" | "variancep" | import("./aggregate").ArgmaxDef | import("./aggregate").ArgminDef | "boxplot" | "errorbar" | "errorband";
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: null;
    title?: string;
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
    timeUnit?: TimeUnit;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: "argmax" | "argmin" | "average" | "count" | "distinct" | "max" | "mean" | "median" | "min" | "missing" | "q1" | "q3" | "ci0" | "ci1" | "stderr" | "stdev" | "stdevp" | "sum" | "valid" | "values" | "variance" | "variancep" | import("./aggregate").ArgmaxDef | import("./aggregate").ArgminDef | "boxplot" | "errorbar" | "errorband";
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: null;
    title?: string;
} | {
    field: string;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
     */
    timeUnit?: TimeUnit;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: "argmax" | "argmin" | "average" | "count" | "distinct" | "max" | "mean" | "median" | "min" | "missing" | "q1" | "q3" | "ci0" | "ci1" | "stderr" | "stdev" | "stdevp" | "sum" | "valid" | "values" | "variance" | "variancep" | import("./aggregate").ArgmaxDef | import("./aggregate").ArgminDef | "boxplot" | "errorbar" | "errorband";
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: Bin;
    title?: string;
    /**
     * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     *
     * __Note:__
     *
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - Data `type` describes the semantics of the data rather than the primitive data types (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat", "type": "quantitative"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type: Type;
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
    timeUnit?: TimeUnit;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
     */
    aggregate?: "argmax" | "argmin" | "average" | "count" | "distinct" | "max" | "mean" | "median" | "min" | "missing" | "q1" | "q3" | "ci0" | "ci1" | "stderr" | "stdev" | "stdevp" | "sum" | "valid" | "values" | "variance" | "variancep" | import("./aggregate").ArgmaxDef | import("./aggregate").ArgminDef | "boxplot" | "errorbar" | "errorband";
    /**
     * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
     *
     * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
     *
     * __Default value:__ `false`
     *
     * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
     */
    bin?: Bin;
    title?: string;
    /**
     * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     *
     *
     * __Note:__
     *
     * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
     * - Data `type` describes the semantics of the data rather than the primitive data types (`number`, `string`, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
     * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
     * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat", "type": "quantitative"}`. The `"type"` of the aggregate output is `"quantitative"`.
     * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they have exactly the same type as their primary channels (e.g., `x`, `y`).
     *
     * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
     */
    type: Type;
};
export declare function normalizeBin(bin: BinParams | boolean | 'binned', channel: Channel): BinParams;
export declare function channelCompatibility(fieldDef: TypedFieldDef<Field>, channel: Channel): {
    compatible: boolean;
    warning?: string;
};
/**
 * Check if the field def uses a time format or does not use any format but is temporal
 * (this does not cover field defs that are temporal but use a number format).
 */
export declare function isTimeFormatFieldDef(fieldDef: TypedFieldDef<string>): boolean;
/**
 * Check if field def has tye `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
 */
export declare function isTimeFieldDef(fieldDef: TypedFieldDef<any>): boolean;
/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export declare function valueExpr(v: number | string | boolean | DateTime, { timeUnit, type, time, undefinedIfExprNotRequired }: {
    timeUnit: TimeUnit;
    type?: Type;
    time?: boolean;
    undefinedIfExprNotRequired?: boolean;
}): string;
/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export declare function valueArray(fieldDef: TypedFieldDef<string>, values: (number | string | boolean | DateTime)[]): (string | number | boolean | DateTime | {
    signal: string;
})[];
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export declare function binRequiresRange(fieldDef: TypedFieldDef<string>, channel: Channel): boolean;
//# sourceMappingURL=channeldef.d.ts.map