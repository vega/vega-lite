import { AggregateOp } from 'vega';
export declare const AGGREGATE_OPS: AggregateOp[];
export declare function isAggregateOp(a: string): a is AggregateOp;
export declare const COUNTING_OPS: AggregateOp[];
export declare function isCountingAggregateOp(aggregate: string): boolean;
export declare function isMinMaxOp(aggregate: string): boolean;
/** Additive-based aggregation operations.  These can be applied to stack. */
export declare const SUM_OPS: AggregateOp[];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export declare const SHARED_DOMAIN_OPS: AggregateOp[];
export declare const SHARED_DOMAIN_OP_INDEX: {
    [T: string]: true;
};
