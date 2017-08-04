import { AggregateOp } from './aggregate';
import { Axis } from './axis';
import { Bin } from './bin';
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
export interface ValueDef<T> {
    /**
     * A constant value in visual domain.
     */
    value: T;
}
/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type while V defines the underlying ValueDef type.
 */
export declare type Conditional<F extends FieldDef<any>, V extends ValueDef<any>> = ConditionalFieldDef<F, V> | ConditionalValueDef<F, V> | ConditionOnlyDef<F, V>;
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
export declare type ConditionalFieldDef<F extends FieldDef<any>, V extends ValueDef<any>> = F & {
    condition?: Condition<V>;
};
export interface ConditionOnlyDef<F extends FieldDef<any>, V extends ValueDef<any>> {
    condition: Condition<F> | Condition<V>;
}
/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export declare type ConditionalValueDef<F extends FieldDef<any>, V extends ValueDef<any>> = V & {
    condition?: Condition<F> | Condition<V>;
};
/**
 * Reference to a repeated value.
 */
export declare type RepeatRef = {
    repeat: 'row' | 'column';
};
export declare type Field = string | RepeatRef;
export declare function isRepeatRef(field: Field): field is RepeatRef;
export interface FieldDefBase<F> {
    /**
     * __Required.__ Name of the field from which to pull a data value.
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
     * Flag for binning a `quantitative` field, or a bin property object
     * for binning parameters.
     */
    bin?: boolean | Bin;
    /**
     * Aggregation function for the field
     * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
     *
     * __Default value:__ `undefined` (None)
     *
     */
    aggregate?: AggregateOp | CompositeAggregate;
}
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F> {
    /**
     * The encoded field's type of measurement. This can be either a full type
     * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
     * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
     * This property is case-insensitive.
     */
    type: Type;
}
export interface ScaleFieldDef<F> extends FieldDef<F> {
    scale?: Scale;
    /**
     * Sort order for a field with discrete domain.
     * This can be `"ascending"`, `"descending"`, `null`, or a [sort field definition object](sort.html#sort-field) for sorting by an aggregate calculation of a specified sort field.
     *
     * __Note:__ For fields with continuous domain, please use `"scale": {"reverse": true}` to flip the scale instead.
     */
    sort?: SortField | SortOrder;
}
export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * By default, Vega-Lite automatically creates axes for `x` and `y` channels when they are encoded.
     * If `axis` is not defined, default axis properties are applied.
     * User can provide set `axis` to an object to customize [axis properties](axis.html#axis-properties)
     * or set `axis` to `null` to remove the axis.
     * @nullable
     */
    axis?: Axis;
    /**
     * Type of stacking offset if the field should be stacked.
     * "none" or null, if the field should not be stacked.
     */
    stack?: StackOffset;
}
export interface LegendFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * @nullable
     */
    legend?: Legend;
}
export interface OrderFieldDef<F> extends FieldDef<F> {
    sort?: SortOrder;
}
export interface TextFieldDef<F> extends FieldDef<F> {
    /**
     * The formatting pattern for text value. If not defined, this will be determined automatically.
     */
    format?: string;
}
export declare type ChannelDef<F> = Conditional<FieldDef<F>, ValueDef<any>>;
export declare function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is Conditional<FieldDef<F>, ValueDef<any>>;
/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export declare function hasConditionFieldDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef<any> & {
    condition: Condition<FieldDef<F>>;
});
export declare function isFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FieldDef<F> | PositionFieldDef<F> | LegendFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F>;
export declare function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef<any>;
export declare function isScaleFieldDef(channelDef: ChannelDef<any>): channelDef is ScaleFieldDef<any>;
export interface FieldRefOption {
    /** exclude bin, aggregate, timeUnit */
    nofn?: boolean;
    /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
    expr?: 'datum' | 'parent';
    /** prepend fn with custom function prefix */
    prefix?: string;
    /** append suffix to the field ref for bin (default='start') */
    binSuffix?: 'start' | 'end' | 'range' | 'mid';
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
export declare function normalizeBin(bin: Bin | boolean, channel: Channel): Bin;
export declare function channelCompatibility(fieldDef: FieldDef<Field>, channel: Channel): {
    compatible: boolean;
    warning?: string;
};
