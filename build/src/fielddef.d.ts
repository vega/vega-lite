import { AggregateOp } from './aggregate';
import { Axis } from './axis';
import { Bin } from './bin';
import { Channel } from './channel';
import { CompositeAggregate } from './compositemark';
import { Config } from './config';
import { Field } from './fielddef';
import { Legend } from './legend';
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
    value?: T;
}
export interface ConditionalValueDef<T> extends ValueDef<T> {
    condition?: Condition<T>;
}
/**
 * Reference to a repeated value.
 */
export declare type RepeatRef = {
    repeat: 'row' | 'column';
};
export declare type Field = string | RepeatRef;
export declare function isRepeatRef(field: Field): field is RepeatRef;
/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> {
    /**
     * __Required.__ Name of the field from which to pull a data value.
     *
     * __Note:__ `field` is not required if `aggregate` is `count`.
     */
    field?: F;
    /**
     * The encoded field's type of measurement. This can be either a full type
     * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
     * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
     * This property is case-insensitive.
     */
    type?: Type;
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
export interface Condition<T> {
    selection: string;
    value: T;
}
export interface ScaleFieldDef<F> extends FieldDef<F> {
    scale?: Scale;
    /**
     * Sort order for a particular field.
     * For quantitative or temporal fields, this can be either `"ascending"` or `"descending"`
     * For quantitative or temporal fields, this can be `"ascending"`, `"descending"`, `"none"`, or a [sort field definition object](sort.html#sort-field) for sorting by an aggregate calculation of a specified sort field.
     *
     * __Default value:__ `"ascending"`
     *
     */
    sort?: SortField | SortOrder;
}
export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
    /**
     * @nullable
     */
    axis?: Axis;
    /**
     * Type of stacking offset if the field should be stacked.
     * "none" or null, if the field should not be stacked.
     */
    stack?: StackOffset;
}
export interface LegendFieldDef<F, T> extends ScaleFieldDef<F> {
    /**
     * @nullable
     */
    legend?: Legend;
    condition?: Condition<T>;
}
export interface OrderFieldDef<F> extends FieldDef<F> {
    sort?: SortOrder;
}
export interface TextFieldDef<F> extends FieldDef<F> {
    condition?: Condition<string | number>;
    /**
     * The formatting pattern for text value. If not defined, this will be determined automatically.
     */
    format?: string;
}
export declare type ChannelDef<F> = FieldDef<F> | ValueDef<any>;
export declare function isFieldDef(channelDef: ChannelDef<any>): channelDef is FieldDef<any> | PositionFieldDef<any> | LegendFieldDef<any, any> | OrderFieldDef<any> | TextFieldDef<any>;
export declare function isValueDef(channelDef: ChannelDef<any>): channelDef is ValueDef<any>;
export interface FieldRefOption {
    /** exclude bin, aggregate, timeUnit */
    nofn?: boolean;
    /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
    expr?: 'datum' | 'parent';
    /** prepend fn with custom function prefix */
    prefix?: string;
    /** append suffix to the field ref for bin (default='start') */
    binSuffix?: 'start' | 'end' | 'range';
    /** append suffix to the field ref (general) */
    suffix?: string;
    /** Overrride which aggregate to use. Needed for unaggregated domain. */
    aggregate?: AggregateOp;
}
export declare function field(fieldDef: FieldDef<string>, opt?: FieldRefOption): string;
export declare function isDiscrete(fieldDef: FieldDef<Field>): boolean;
export declare function isContinuous(fieldDef: FieldDef<Field>): boolean;
export declare function isCount(fieldDef: FieldDef<Field>): boolean;
export declare function title(fieldDef: FieldDef<string>, config: Config): string;
export declare function defaultType(fieldDef: FieldDef<Field>, channel: Channel): Type;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export declare function normalize(channelDef: ChannelDef<string>, channel: Channel): ValueDef<any> | FieldDef<Field>;
export declare function channelCompatibility(fieldDef: FieldDef<Field>, channel: Channel): {
    compatible: boolean;
    warning?: string;
};
