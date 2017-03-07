export declare type AggregateOp = 'argmax' | 'argmin' | 'average' | 'count' | 'distinct' | 'max' | 'mean' | 'median' | 'min' | 'missing' | 'modeskew' | 'q1' | 'q3' | 'stdev' | 'stdevp' | 'sum' | 'valid' | 'values' | 'variance' | 'variancep';
export declare const AGGREGATE_OPS: AggregateOp[];
/** Additive-based aggregation operations.  These can be applied to stack. */
export declare const SUM_OPS: AggregateOp[];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export declare const SHARED_DOMAIN_OPS: AggregateOp[];
