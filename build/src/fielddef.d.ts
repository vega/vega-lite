import { AggregateOp } from './aggregate';
import { Axis } from './axis';
import { BinParams } from './bin';
import { Channel } from './channel';
import { CompositeAggregate } from './compositemark';
import { Config } from './config';
import { Field } from './fielddef';
import { Legend } from './legend';
import { LogicalOperand } from './logical';
import { Scale } from './scale';
import { SortField, SortOrder } from './sort';
import { StackOffset } from './stack';
import { TimeUnit } from './timeunit';
import { Type } from './type';
/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef {
    /**
     * A constant value in visual domain.
     */
    value: number | string | boolean;
}
/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type.
 */
export declare type ConditionalChannelDef<F extends FieldDef<any>> = ConditionalFieldDef<F> | ConditionalValueDef<F>;
export declare type Condition<T> = {
    selection: LogicalOperand<string>;
} & T;
/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */
export declare type ConditionalFieldDef<F extends FieldDef<any>> = F & {
    /**
     * A value definition with a selection predicate.
     *
     * __Note:__ A field definition's `condition` property can only be a [value definition](encoding.html#value)
     * since Vega-Lite only allows at mosty  one encoded field per encoding channel.
     */
    condition?: Condition<ValueDef>;
};
/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export interface ConditionalValueDef<F extends FieldDef<any>> {
    /**
     * A field definition or a value definition with a selection predicate.
     */
    condition?: Condition<F> | Condition<ValueDef>;
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
export declare type Aggregate = AggregateOp | CompositeAggregate;
export interface FieldDefBase<F> {
    /**
     * __Required.__ A string defining the name of the field from which to pull a data value
     * or an object defining iterated values from the [`repeat`](repeat.html) operator.
     *
     * __Note:__ `field` is not required if `aggregate` is `count`.
     */
    field?: F;
    /**
     * Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`).
     *
     * __Default value:__ `undefined` (None)
     *
     */
    timeUnit?: TimeUnit;
    /**
     * A flag for binning a `quantitative` field, or [an object defining binning parameters](bin.html#params).
     * If `true`, default [binning parameters](bin.html) will be applied.
     *
     * __Default value:__ `false`
     */
    bin?: boolean | BinParams;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     */
    aggregate?: Aggregate;
}
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F> {
    /**
     * The encoded field's type of measurement. This can be either a full type
     * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`).
     */
    type: Type;
}
export interface ScaleFieldDef<F> extends FieldDef<F> {
    /**
     * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
     *
     * __Default value:__ If undefined, default [scale properties](scale.html) are applied.
     */
    scale?: Scale;
    /**
     * Sort order for the encoded field.
     * Supported `sort` values include `"ascending"`, `"descending"` and `null` (no sorting).
     * For fields with discrete domains, `sort` can also be a [sort field definition object](sort.html#sort-field).
     *
     * __Default value:__ `"ascending"`
     *
     * @nullable
     */
    sort?: SortOrder | SortField;
}
export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * An object defining properties of axis's gridlines, ticks and labels.
     * If `null`, the axis for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [axis properties](axis.html) are applied.
     *
     * @nullable
     */
    axis?: Axis;
    /**
     * Type of stacking offset if the field should be stacked.
     * `stack` is only applicable for `x` and `y` channels with continuous domains.
     * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
     *
     * `stack` can be one of the following values:
     * - `"zero"`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](stack.html#bar) and [area](stack.html#area) chart).
     * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](stack.html#normalized). <br/>
     * -`"center"` - stacking with center baseline (for [streamgraph](stack.html#streamgraph)).
     * - `"none"` - No-stacking. This will produce layered [bar](stack.html#layered-bar-chart) and area chart.
     *
     * __Default value:__ `zero` for plots with all of the following conditions are true: (1) `bar` or `area` marks (2) At least one of `color`, `opacity`, `size`, or `detail` channel mapped to a group-by field (3) one position channel has a linear scale and summative aggregation function (e.g., `sum`, `count`) and (4) the other position channel either has discrete domain or unmapped.  Otherwise `"none"` by default.
     */
    stack?: StackOffset;
}
export interface LegendFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * An object defining properties of the legend.
     * If `null`, the legend for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [legend properties](legend.html) are applied.
     *
     * @nullable
     */
    legend?: Legend;
}
export interface OrderFieldDef<F> extends FieldDef<F> {
    /**
     * The sort order. One of `"ascending"` (default) or `"descending"`.
     */
    sort?: SortOrder;
}
export interface TextFieldDef<F> extends FieldDef<F> {
    /**
     * The [formatting pattern](format.html) for a text field. If not defined, this will be determined automatically.
     */
    format?: string;
}
export declare type ChannelDef<F> = ConditionalChannelDef<FieldDef<F>>;
export declare function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is ConditionalChannelDef<FieldDef<F>>;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export declare function hasConditionFieldDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef & {
    condition: Condition<FieldDef<F>>;
});
export declare function isFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FieldDef<F> | PositionFieldDef<F> | LegendFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F>;
export declare function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef;
export declare function isScaleFieldDef(channelDef: ChannelDef<any>): channelDef is ScaleFieldDef<any>;
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
    /** Overrride which aggregate to use. Needed for unaggregated domain. */
    aggregate?: AggregateOp;
}
export declare function field(fieldDef: FieldDefBase<string>, opt?: FieldRefOption): string;
export declare function isDiscrete(fieldDef: FieldDef<Field>): boolean;
export declare function isContinuous(fieldDef: FieldDef<Field>): boolean;
export declare function isCount(fieldDef: FieldDefBase<Field>): boolean;
export declare function title(fieldDef: FieldDef<string>, config: Config): string;
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
