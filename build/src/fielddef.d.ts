import { AggregateOp } from 'vega';
import { Axis } from './axis';
import { BinParams } from './bin';
import { Channel } from './channel';
import { CompositeAggregate } from './compositemark';
import { Config } from './config';
import { TitleMixins } from './guide';
import { Legend } from './legend';
import { LogicalOperand } from './logical';
import { Predicate } from './predicate';
import { Scale } from './scale';
import { EncodingSortField, SortOrder } from './sort';
import { StackOffset } from './stack';
import { TimeUnit } from './timeunit';
import { AggregatedFieldDef, WindowFieldDef } from './transform';
import { Type } from './type';
/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef {
    /**
     * A constant value in visual domain (e.g., `"red"` / "#0099ff" for color, values between `0` to `1` for opacity).
     */
    value: number | string | boolean;
}
/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type.
 */
export declare type ChannelDefWithCondition<F extends FieldDef<any>> = FieldDefWithCondition<F> | ValueDefWithCondition<F>;
export declare type Conditional<T> = ConditionalPredicate<T> | ConditionalSelection<T>;
export declare type ConditionalPredicate<T> = {
    test: LogicalOperand<Predicate>;
} & T;
export declare type ConditionalSelection<T> = {
    /**
     * A [selection name](https://vega.github.io/vega-lite/docs/selection.html), or a series of [composed selections](https://vega.github.io/vega-lite/docs/selection.html#compose).
     */
    selection: LogicalOperand<string>;
} & T;
export declare function isConditionalSelection<T>(c: Conditional<T>): c is ConditionalSelection<T>;
export interface ConditionValueDefMixins {
    /**
     * One or more value definition(s) with a selection predicate.
     *
     * __Note:__ A field definition's `condition` property can only contain [value definitions](https://vega.github.io/vega-lite/docs/encoding.html#value-def)
     * since Vega-Lite only allows at most one encoded field per encoding channel.
     */
    condition?: Conditional<ValueDef> | Conditional<ValueDef>[];
}
/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */
export declare type FieldDefWithCondition<F extends FieldDef<any>> = F & ConditionValueDefMixins;
/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export interface ValueDefWithCondition<F extends FieldDef<any>> {
    /**
     * A field definition or one or more value definition(s) with a selection predicate.
     */
    condition?: Conditional<F> | Conditional<ValueDef> | Conditional<ValueDef>[];
    /**
     * A constant value in visual domain.
     */
    value?: number | string | boolean;
}
/**
 * Reference to a repeated value.
 */
export declare type RepeatRef = {
    repeat: 'row' | 'column';
};
export declare type Field = string | RepeatRef;
export declare function isRepeatRef(field: Field): field is RepeatRef;
/** @hide */
export declare type HiddenCompositeAggregate = CompositeAggregate;
export declare type Aggregate = AggregateOp | HiddenCompositeAggregate;
export interface FieldDefBase<F> {
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
     *
     * __Note:__ Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
     * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
     * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
     *
     * __Note:__ `field` is not required if `aggregate` is `count`.
     */
    field?: F;
    /**
     * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
     * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
     *
     * __Default value:__ `undefined` (None)
     */
    timeUnit?: TimeUnit;
    /**
     * A flag for binning a `quantitative` field, or [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params).
     * If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
     *
     * __Default value:__ `false`
     */
    bin?: boolean | BinParams;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     */
    aggregate?: Aggregate;
}
export declare function toFieldDefBase(fieldDef: FieldDef<string>): FieldDefBase<string>;
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F>, TitleMixins {
    /**
     * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
     * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
     */
    type: Type;
}
export interface ScaleFieldDef<F> extends FieldDef<F> {
    /**
     * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
     *
     * If `null`, the scale will be [disabled and the data value will be directly encoded](https://vega.github.io/vega-lite/docs/scale.html#disable).
     *
     * __Default value:__ If undefined, default [scale properties](https://vega.github.io/vega-lite/docs/scale.html) are applied.
     */
    scale?: Scale | null;
    /**
     * Sort order for the encoded field.
     * Supported `sort` values include `"ascending"`, `"descending"`, `null` (no sorting), or an array specifying the preferred order of values.
     * For fields with discrete domains, `sort` can also be a [sort field definition object](https://vega.github.io/vega-lite/docs/sort.html#sort-field).
     * For `sort` as an [array specifying the preferred order of values](https://vega.github.io/vega-lite/docs/sort.html#sort-array), the sort order will obey the values in the array, followed by any unspecified values in their original order.
     *
     * __Default value:__ `"ascending"`
     */
    sort?: string[] | SortOrder | EncodingSortField<F> | null;
}
export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * An object defining properties of axis's gridlines, ticks and labels.
     * If `null`, the axis for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [axis properties](https://vega.github.io/vega-lite/docs/axis.html) are applied.
     */
    axis?: Axis | null;
    /**
     * Type of stacking offset if the field should be stacked.
     * `stack` is only applicable for `x` and `y` channels with continuous domains.
     * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
     *
     * `stack` can be one of the following values:
     * - `"zero"`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](https://vega.github.io/vega-lite/docs/stack.html#bar) and [area](https://vega.github.io/vega-lite/docs/stack.html#area) chart).
     * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](https://vega.github.io/vega-lite/docs/stack.html#normalized). <br/>
     * -`"center"` - stacking with center baseline (for [streamgraph](https://vega.github.io/vega-lite/docs/stack.html#streamgraph)).
     * - `null` - No-stacking. This will produce layered [bar](https://vega.github.io/vega-lite/docs/stack.html#layered-bar-chart) and area chart.
     *
     * __Default value:__ `zero` for plots with all of the following conditions are true:
     * (1) the mark is `bar` or `area`;
     * (2) the stacked measure channel (x or y) has a linear scale;
     * (3) At least one of non-position channels mapped to an unaggregated field that is different from x and y.  Otherwise, `null` by default.
     */
    stack?: StackOffset | null;
}
/**
 * Field definition of a mark property, which can contain a legend.
 */
export interface MarkPropFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * An object defining properties of the legend.
     * If `null`, the legend for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [legend properties](https://vega.github.io/vega-lite/docs/legend.html) are applied.
     */
    legend?: Legend | null;
}
export interface OrderFieldDef<F> extends FieldDef<F> {
    /**
     * The sort order. One of `"ascending"` (default) or `"descending"`.
     */
    sort?: SortOrder;
}
export interface TextFieldDef<F> extends FieldDef<F> {
    /**
     * The [formatting pattern](https://vega.github.io/vega-lite/docs/format.html) for a text field. If not defined, this will be determined automatically.
     */
    format?: string;
}
export declare type ChannelDef<F> = ChannelDefWithCondition<FieldDef<F>>;
export declare function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is ChannelDefWithCondition<FieldDef<F>>;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export declare function hasConditionalFieldDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef & {
    condition: Conditional<FieldDef<F>>;
});
export declare function hasConditionalValueDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef & {
    condition: Conditional<ValueDef> | Conditional<ValueDef>[];
});
export declare function isFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FieldDef<F> | PositionFieldDef<F> | ScaleFieldDef<F> | MarkPropFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F>;
export declare function isStringFieldDef(fieldDef: ChannelDef<string | RepeatRef>): fieldDef is FieldDef<string>;
export declare function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef;
export declare function isScaleFieldDef<F>(channelDef: ChannelDef<F>): channelDef is ScaleFieldDef<F>;
export interface FieldRefOption {
    /** exclude bin, aggregate, timeUnit */
    nofn?: boolean;
    /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
    expr?: 'datum' | 'parent';
    /** prepend fn with custom function prefix */
    prefix?: string;
    /** append suffix to the field ref for bin (default='start') */
    binSuffix?: 'end' | 'range' | 'mid';
    /** append suffix to the field ref (general) */
    suffix?: string;
}
export declare function vgField(fieldDef: FieldDefBase<string> | WindowFieldDef | AggregatedFieldDef, opt?: FieldRefOption): string;
export declare function isDiscrete(fieldDef: FieldDef<Field>): boolean;
export declare function isContinuous(fieldDef: FieldDef<Field>): boolean;
export declare function isCount(fieldDef: FieldDefBase<Field>): boolean;
export declare type FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => string;
export declare function verbalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function functionalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config): string;
export declare const defaultTitleFormatter: FieldTitleFormatter;
export declare function setTitleFormatter(formatter: FieldTitleFormatter): void;
export declare function resetTitleFormatter(): void;
export declare function title(fieldDef: FieldDefBase<string>, config: Config): string;
export declare function defaultType(fieldDef: FieldDef<Field>, channel: Channel): Type;
/**
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
export declare function getFieldDef<F>(channelDef: ChannelDef<F>): FieldDef<F>;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export declare function normalize(channelDef: ChannelDef<string>, channel: Channel): ChannelDef<any>;
export declare function normalizeFieldDef(fieldDef: FieldDef<string>, channel: Channel): FieldDef<string>;
export declare function normalizeBin(bin: BinParams | boolean, channel: Channel): BinParams;
export declare function channelCompatibility(fieldDef: FieldDef<Field>, channel: Channel): {
    compatible: boolean;
    warning?: string;
};
export declare function isNumberFieldDef(fieldDef: FieldDef<any>): boolean;
export declare function isTimeFieldDef(fieldDef: FieldDef<any>): boolean;
