import { DateTime } from './datetime';
import { TimeUnit } from './timeunit';
export declare type Filter = EqualFilter | RangeFilter | OneOfFilter | string;
export interface EqualFilter {
    /**
     * Time unit for the field to be filtered.
     */
    timeUnit?: TimeUnit;
    /**
     * Field to be filtered.
     */
    field: string;
    /**
     * Value that the field should be equal to.
     */
    equal: string | number | boolean | DateTime;
}
export declare function isEqualFilter(filter: any): filter is EqualFilter;
export interface RangeFilter {
    /**
     * time unit for the field to be filtered.
     */
    timeUnit?: TimeUnit;
    /**
     * Field to be filtered
     */
    field: string;
    /**
     * Array of inclusive minimum and maximum values
     * for a field value of a data item to be included in the filtered data.
     * @maxItems 2
     * @minItems 2
     */
    range: (number | DateTime)[];
}
export declare function isRangeFilter(filter: any): filter is RangeFilter;
export interface OneOfFilter {
    /**
     * time unit for the field to be filtered.
     */
    timeUnit?: TimeUnit;
    /**
     * Field to be filtered
     */
    field: string;
    /**
     * A set of values that the `field`'s value should be a member of,
     * for a data item included in the filtered data.
     */
    oneOf: string[] | number[] | boolean[] | DateTime[];
}
export declare function isOneOfFilter(filter: any): filter is OneOfFilter;
/**
 * Converts a filter into an expression.
 */
export declare function expression(filter: Filter | Filter[]): string;
