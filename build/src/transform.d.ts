import { AggregateOp } from './aggregate';
import { Bin } from './bin';
import { Data } from './data';
import { Filter } from './filter';
import { TimeUnit } from './timeunit';
export interface FilterTransform {
    /**
     * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
     */
    filter: Filter;
}
export declare function isFilter(t: Transform): t is FilterTransform;
export interface CalculateTransform {
    /**
     * A string containing a Vega Expression. Use the variable `datum` to refer to the current data object.
     */
    calculate: string;
    /**
     * The field for storing the computed formula value.
     */
    as: string;
}
export interface BinTransform {
    /**
     * Boolean flag indicating using bin transform
     */
    bin: boolean | Bin;
    /**
     * The field to use this transform on.
     */
    field: string;
    /**
     * The field for storing the computed formula value.
     */
    as: string;
}
export interface TimeUnitTransform {
    /**
     * The type of time unit for this transform.
     */
    timeUnit: TimeUnit;
    /**
     * The field to use this transform on.
     */
    field: string;
    /**
     * The field for storing the computed formula value.
     */
    as: string;
}
export interface SummarizeTransform {
    /**
     * Array of objects that contains
     */
    summarize: Summarize[];
    /**
     * Array of fields we will be useing for group by
     */
    groupby: string[];
}
export interface Summarize {
    aggregate: AggregateOp;
    field: string;
    as: string;
}
export interface LookupData {
    /**
     * secondary data source to lookup in
     */
    data: Data;
    /**
     * key in data to lookup
     */
    key: string;
    /**
     * (Optional) fields in foreign data to lookup
     * if not specificied, the entire object is queried
     */
    fields?: string[];
}
export interface LookupTransform {
    /**
     * key in primary data source
     */
    lookup: string;
    /**
     * secondary data reference
     */
    from: LookupData;
    /**
     * (Optional) The field or fields for storing the computed formula value.
     * If `from.fields` is not specified, `as` has to be a string and we put the whole object into the data
     */
    as?: string | string[];
    /**
     * (Optional) The default value to use if lookup fails
     */
    default?: string;
}
export declare function isLookup(t: Transform): t is LookupTransform;
export declare function isCalculate(t: Transform): t is CalculateTransform;
export declare function isBin(t: Transform): t is BinTransform;
export declare function isTimeUnit(t: Transform): t is TimeUnitTransform;
export declare function isSummarize(t: Transform): t is SummarizeTransform;
export declare type Transform = FilterTransform | CalculateTransform | LookupTransform | BinTransform | TimeUnitTransform | SummarizeTransform;
