export declare type AggregateOp = 'argmax' | 'argmin' | 'average' | 'count' | 'distinct' | 'max' | 'mean' | 'median' | 'min' | 'missing' | 'q1' | 'q3' | 'ci0' | 'ci1' | 'stdev' | 'stdevp' | 'sum' | 'valid' | 'values' | 'variance' | 'variancep';
export declare const AGGREGATE_OPS: AggregateOp[];
export declare function isAggregateOp(a: string): a is AggregateOp;
export declare const COUNTING_OPS: AggregateOp[];
export declare function isCountingAggregateOp(aggregate: string): boolean;
/** Additive-based aggregation operations.  These can be applied to stack. */
export declare const SUM_OPS: AggregateOp[];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export declare const SHARED_DOMAIN_OPS: AggregateOp[];
export declare const SHARED_DOMAIN_OP_INDEX: {
    [T: string]: boolean;
};
