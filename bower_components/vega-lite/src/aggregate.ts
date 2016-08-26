
export enum AggregateOp {
    VALUES = 'values' as any,
    COUNT = 'count' as any,
    VALID = 'valid' as any,
    MISSING = 'missing' as any,
    DISTINCT = 'distinct' as any,
    SUM = 'sum' as any,
    MEAN = 'mean' as any,
    AVERAGE = 'average' as any,
    VARIANCE = 'variance' as any,
    VARIANCEP = 'variancep' as any,
    STDEV = 'stdev' as any,
    STDEVP = 'stdevp' as any,
    MEDIAN = 'median' as any,
    Q1 = 'q1' as any,
    Q3 = 'q3' as any,
    MODESKEW = 'modeskew' as any,
    MIN = 'min' as any,
    MAX = 'max' as any,
    ARGMIN = 'argmin' as any,
    ARGMAX = 'argmax' as any,
}

export const AGGREGATE_OPS = [
    AggregateOp.VALUES,
    AggregateOp.COUNT,
    AggregateOp.VALID,
    AggregateOp.MISSING,
    AggregateOp.DISTINCT,
    AggregateOp.SUM,
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.VARIANCE,
    AggregateOp.VARIANCEP,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MODESKEW,
    AggregateOp.MIN,
    AggregateOp.MAX,
    AggregateOp.ARGMIN,
    AggregateOp.ARGMAX,
];

/** Additive-based aggregation operations.  These can be applied to stack. */
export const SUM_OPS = [
    AggregateOp.COUNT,
    AggregateOp.SUM,
    AggregateOp.DISTINCT
];

export const SHARED_DOMAIN_OPS = [
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MIN,
    AggregateOp.MAX,
];
