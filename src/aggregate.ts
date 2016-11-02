
export namespace AggregateOp {
    export const VALUES: 'values' = 'values';
    export type VALUES = typeof VALUES;
    export const COUNT: 'count' = 'count';
    export type COUNT = typeof COUNT;
    export const VALID: 'valid' = 'valid';
    export type VALID = typeof VALID;
    export const MISSING: 'missing' = 'missing';
    export type MISSING = typeof MISSING;
    export const DISTINCT: 'distinct' = 'distinct';
    export type DISTINCT = typeof DISTINCT;
    export const SUM: 'sum' = 'sum';
    export type SUM = typeof SUM;
    export const MEAN: 'mean' = 'mean';
    export type MEAN = typeof MEAN;
    export const AVERAGE: 'average' = 'average';
    export type AVERAGE = typeof AVERAGE;
    export const VARIANCE: 'variance' = 'variance';
    export type VARIANCE = typeof VARIANCE;
    export const VARIANCEP: 'variancep' = 'variancep';
    export type VARIANCEP = typeof VARIANCEP;
    export const STDEV: 'stdev' = 'stdev';
    export type STDEV = typeof STDEV;
    export const STDEVP: 'stdevp' = 'stdevp';
    export type STDEVP = typeof STDEVP;
    export const MEDIAN: 'median' = 'median';
    export type MEDIAN = typeof MEDIAN;
    export const Q1: 'q1' = 'q1';
    export type Q1 = typeof Q1;
    export const Q3: 'q3' = 'q3';
    export type Q3 = typeof Q3;
    export const MODESKEW: 'modeskew' = 'modeskew';
    export type MODESKEW = typeof MODESKEW;
    export const MIN: 'min' = 'min';
    export type MIN = typeof MIN;
    export const MAX: 'max' = 'max';
    export type MAX = typeof MAX;
    export const ARGMIN: 'argmin' = 'argmin';
    export type ARGMIN = typeof ARGMIN;
    export const ARGMAX: 'argmax' = 'argmax';
    export type ARGMAX = typeof ARGMAX;
}
export type AggregateOp = AggregateOp.ARGMAX | AggregateOp.ARGMIN | AggregateOp.AVERAGE
  | AggregateOp.COUNT | AggregateOp.DISTINCT | AggregateOp.MAX | AggregateOp.MEAN
  | AggregateOp.MEDIAN | AggregateOp.MIN | AggregateOp.MISSING | AggregateOp.MODESKEW
  | AggregateOp.Q1 | AggregateOp.Q3 | AggregateOp.STDEV | AggregateOp.STDEVP
  | AggregateOp.SUM | AggregateOp.VALID | AggregateOp.VALUES | AggregateOp.VARIANCE
  | AggregateOp.VARIANCEP;

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
