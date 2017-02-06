
export namespace AggregateOp {
    export const VALUES: 'values' = 'values';
    export const COUNT: 'count' = 'count';
    export const VALID: 'valid' = 'valid';
    export const MISSING: 'missing' = 'missing';
    export const DISTINCT: 'distinct' = 'distinct';
    export const SUM: 'sum' = 'sum';
    export const MEAN: 'mean' = 'mean';
    export const AVERAGE: 'average' = 'average';
    export const VARIANCE: 'variance' = 'variance';
    export const VARIANCEP: 'variancep' = 'variancep';
    export const STDEV: 'stdev' = 'stdev';
    export const STDEVP: 'stdevp' = 'stdevp';
    export const MEDIAN: 'median' = 'median';
    export const Q1: 'q1' = 'q1';
    export const Q3: 'q3' = 'q3';
    export const MODESKEW: 'modeskew' = 'modeskew';
    export const MIN: 'min' = 'min';
    export const MAX: 'max' = 'max';
    export const AAA: 'aaa' = 'aaa';
    export const ARGMIN: 'argmin' = 'argmin';
    export const ARGMAX: 'argmax' = 'argmax';;
}

export type AggregateOp = typeof AggregateOp.ARGMAX | typeof AggregateOp.ARGMIN | typeof AggregateOp.AVERAGE
  | typeof AggregateOp.COUNT | typeof AggregateOp.DISTINCT | typeof AggregateOp.MAX | typeof AggregateOp.MEAN
  | typeof AggregateOp.MEDIAN | typeof AggregateOp.MIN | typeof AggregateOp.MISSING | typeof AggregateOp.MODESKEW
  | typeof AggregateOp.Q1 | typeof AggregateOp.Q3 | typeof AggregateOp.STDEV | typeof AggregateOp.STDEVP
  | typeof AggregateOp.SUM | typeof AggregateOp.VALID | typeof AggregateOp.VALUES | typeof AggregateOp.VARIANCE
  | typeof AggregateOp.VARIANCEP | typeof AggregateOp.AAA;

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
    AggregateOp.DISTINCT,
    AggregateOp.VALID,
    AggregateOp.MISSING
];

/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS = [
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MIN,
    AggregateOp.MAX,
];
