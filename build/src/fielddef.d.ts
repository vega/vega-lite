import { AggregateOp } from './aggregate';
import { Axis } from './axis';
import { Bin } from './bin';
import { Channel } from './channel';
import { Config } from './config';
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
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef {
    /**
     * Name of the field from which to pull a data value.
     */
    field?: string;
    /**
     * The encoded field's type of measurement. This can be either a full type
     * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
     * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
     * This property is case insensitive.
     */
    type?: Type;
    /**
     * Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`).
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
     */
    aggregate?: AggregateOp;
    /**
     * Title for axis or legend.
     */
    title?: string;
}
export interface Condition<T> {
    selection: string;
    value: T;
}
export interface ScaleFieldDef extends FieldDef {
    scale?: Scale;
    sort?: SortField | SortOrder;
}
export interface PositionFieldDef extends ScaleFieldDef {
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
export interface LegendFieldDef<T> extends ScaleFieldDef {
    /**
     * @nullable
     */
    legend?: Legend;
    condition?: Condition<T>;
}
export interface OrderFieldDef extends FieldDef {
    sort?: SortOrder;
}
export interface TextFieldDef extends FieldDef {
    /**
     * The formatting pattern for text value. If not defined, this will be determined automatically.
     */
    format?: string;
    condition?: Condition<string | number>;
}
export declare type ChannelDef = FieldDef | ValueDef<any>;
export declare function isFieldDef(channelDef: ChannelDef): channelDef is FieldDef | PositionFieldDef | LegendFieldDef<any> | OrderFieldDef | TextFieldDef;
export declare function isValueDef(channelDef: ChannelDef): channelDef is ValueDef<any>;
export declare type FacetFieldDef = PositionFieldDef;
export interface FieldRefOption {
    /** exclude bin, aggregate, timeUnit */
    nofn?: boolean;
    /** Wrap the field inside datum[...] per Vega convention */
    datum?: boolean;
    /** prepend fn with custom function prefix */
    prefix?: string;
    /** append suffix to the field ref for bin (default='start') */
    binSuffix?: 'start' | 'end' | 'range';
    /** append suffix to the field ref (general) */
    suffix?: string;
    /** Overrride which aggregate to use. Needed for unaggregated domain. */
    aggregate?: AggregateOp;
}
export declare function field(fieldDef: FieldDef, opt?: FieldRefOption): string;
export declare function isDiscrete(fieldDef: FieldDef): boolean;
export declare function isContinuous(fieldDef: FieldDef): boolean;
export declare function isCount(fieldDef: FieldDef): boolean;
export declare function title(fieldDef: FieldDef, config: Config): string;
export declare function defaultType(fieldDef: FieldDef, channel: Channel): Type;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export declare function normalize(channelDef: ChannelDef, channel: Channel): ChannelDef;
export declare function channelCompatibility(fieldDef: FieldDef, channel: Channel): {
    compatible: boolean;
    warning?: string;
};
