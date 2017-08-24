import { DataFlowNode } from './compile/data/dataflow';
import { Model } from './compile/model';
import { DateTime } from './datetime';
import { LogicalOperand } from './logical';
import { TimeUnit } from './timeunit';
export declare type Filter = EqualFilter | RangeFilter | OneOfFilter | SelectionFilter | string;
export declare type FieldFilter = EqualFilter | RangeFilter | OneOfFilter;
export interface SelectionFilter {
    /**
     * Filter using a selection name.
     */
    selection: LogicalOperand<string>;
}
export declare function isSelectionFilter(filter: LogicalOperand<Filter>): filter is SelectionFilter;
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
     * The value that the field should be equal to.
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
     * An array of inclusive minimum and maximum values
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
export declare function isFieldFilter(filter: Filter): filter is OneOfFilter | EqualFilter | RangeFilter;
/**
 * Converts a filter into an expression.
 */
export declare function expression(model: Model, filterOp: LogicalOperand<Filter>, node?: DataFlowNode): string;
export declare function fieldFilterExpression(filter: FieldFilter): string;
export declare function normalizeFilter(f: Filter): Filter;
