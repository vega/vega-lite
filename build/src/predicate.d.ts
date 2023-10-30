import type { SignalRef } from 'vega';
import { FieldName } from './channeldef';
import { DateTime } from './datetime';
import { ExprRef } from './expr';
import { LogicalComposition } from './logical';
import { ParameterName } from './parameter';
import { TimeUnit, TimeUnitParams, BinnedTimeUnit } from './timeunit';
export type Predicate = FieldEqualPredicate | FieldRangePredicate | FieldOneOfPredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate | FieldValidPredicate | ParameterPredicate | string;
export type FieldPredicate = FieldEqualPredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate | FieldRangePredicate | FieldOneOfPredicate | FieldValidPredicate;
export interface ParameterPredicate {
    /**
     * Filter using a parameter name.
     */
    param: ParameterName;
    /**
     * For selection parameters, the predicate of empty selections returns true by default.
     * Override this behavior, by setting this property `empty: false`.
     */
    empty?: boolean;
}
export declare function isSelectionPredicate(predicate: LogicalComposition<Predicate>): predicate is ParameterPredicate;
export interface FieldPredicateBase {
    /**
     * Time unit for the field to be tested.
     */
    timeUnit?: TimeUnit | BinnedTimeUnit | TimeUnitParams;
    /**
     * Field to be tested.
     */
    field: FieldName;
}
export interface FieldEqualPredicate extends FieldPredicateBase {
    /**
     * The value that the field should be equal to.
     */
    equal: string | number | boolean | DateTime | ExprRef | SignalRef;
}
export declare function isFieldEqualPredicate(predicate: any): predicate is FieldEqualPredicate;
export interface FieldLTPredicate extends FieldPredicateBase {
    /**
     * The value that the field should be less than.
     */
    lt: string | number | DateTime | ExprRef | SignalRef;
}
export declare function isFieldLTPredicate(predicate: any): predicate is FieldLTPredicate;
export interface FieldLTEPredicate extends FieldPredicateBase {
    /**
     * The value that the field should be less than or equals to.
     */
    lte: string | number | DateTime | ExprRef | SignalRef;
}
export declare function isFieldLTEPredicate(predicate: any): predicate is FieldLTEPredicate;
export interface FieldGTPredicate extends FieldPredicateBase {
    /**
     * The value that the field should be greater than.
     */
    gt: string | number | DateTime | ExprRef | SignalRef;
}
export declare function isFieldGTPredicate(predicate: any): predicate is FieldGTPredicate;
export interface FieldGTEPredicate extends FieldPredicateBase {
    /**
     * The value that the field should be greater than or equals to.
     */
    gte: string | number | DateTime | ExprRef | SignalRef;
}
export declare function isFieldGTEPredicate(predicate: any): predicate is FieldGTEPredicate;
export interface FieldRangePredicate extends FieldPredicateBase {
    /**
     * An array of inclusive minimum and maximum values
     * for a field value of a data item to be included in the filtered data.
     * @maxItems 2
     * @minItems 2
     */
    range: (number | DateTime | null | ExprRef | SignalRef)[] | ExprRef | SignalRef;
}
export declare function isFieldRangePredicate(predicate: any): predicate is FieldRangePredicate;
export interface FieldOneOfPredicate extends FieldPredicateBase {
    /**
     * A set of values that the `field`'s value should be a member of,
     * for a data item included in the filtered data.
     */
    oneOf: string[] | number[] | boolean[] | DateTime[];
}
export interface FieldValidPredicate extends FieldPredicateBase {
    /**
     * If set to true the field's value has to be valid, meaning both not `null` and not [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN).
     */
    valid: boolean;
}
export declare function isFieldOneOfPredicate(predicate: any): predicate is FieldOneOfPredicate;
export declare function isFieldValidPredicate(predicate: any): predicate is FieldValidPredicate;
export declare function isFieldPredicate(predicate: Predicate): predicate is FieldOneOfPredicate | FieldEqualPredicate | FieldRangePredicate | FieldLTPredicate | FieldGTPredicate | FieldLTEPredicate | FieldGTEPredicate;
export declare function fieldFilterExpression(predicate: FieldPredicate, useInRange?: boolean): string;
export declare function fieldValidPredicate(fieldExpr: string, valid?: boolean): string;
export declare function normalizePredicate(f: Predicate): Predicate;
//# sourceMappingURL=predicate.d.ts.map