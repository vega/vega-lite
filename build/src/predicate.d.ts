import { DataFlowNode } from './compile/data/dataflow';
import { Model } from './compile/model';
import { DateTime } from './datetime';
import { LogicalOperand } from './logical';
import { TimeUnit } from './timeunit';
export declare type Predicate = FieldEqualPredicate | FieldRangePredicate | FieldOneOfPredicate | SelectionPredicate | string;
export declare type FieldPredicate = FieldEqualPredicate | FieldRangePredicate | FieldOneOfPredicate;
export interface SelectionPredicate {
    /**
     * Filter using a selection name.
     */
    selection: LogicalOperand<string>;
}
export declare function isSelectionPredicate(predicate: LogicalOperand<Predicate>): predicate is SelectionPredicate;
export interface FieldEqualPredicate {
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
export declare function isFieldEqualPredicate(predicate: any): predicate is FieldEqualPredicate;
export interface FieldRangePredicate {
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
export declare function isFieldRangePredicate(predicate: any): predicate is FieldRangePredicate;
export interface FieldOneOfPredicate {
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
export declare function isFieldOneOfPredicate(predicate: any): predicate is FieldOneOfPredicate;
export declare function isFieldPredicate(predicate: Predicate): predicate is FieldOneOfPredicate | FieldEqualPredicate | FieldRangePredicate;
/**
 * Converts a predicate into an expression.
 */
export declare function expression(model: Model, filterOp: LogicalOperand<Predicate>, node?: DataFlowNode): string;
export declare function fieldFilterExpression(predicate: FieldPredicate, useInRange?: boolean): string;
export declare function normalizePredicate(f: Predicate): Predicate;
