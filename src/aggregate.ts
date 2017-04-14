import {toSet} from './util';
export type AggregateOp = 'argmax' | 'argmin' | 'average' | 'count'
  | 'distinct' | 'max' | 'mean' | 'median' | 'min' | 'missing' | 'modeskew'
  | 'q1' | 'q3' | 'ci0' | 'ci1' | 'stdev' | 'stdevp' | 'sum' | 'valid' | 'values' | 'variance'
  | 'variancep';

export const AGGREGATE_OPS: AggregateOp[] = [
    'values',
    'count',
    'valid',
    'missing',
    'distinct',
    'sum',
    'mean',
    'average',
    'variance',
    'variancep',
    'stdev',
    'stdevp',
    'median',
    'q1',
    'q3',
    'ci0',
    'ci1',
    'modeskew',
    'min',
    'max',
    'argmin',
    'argmax',
];

export const AGGREGATE_OP_INDEX = toSet(AGGREGATE_OPS);

/** Additive-based aggregation operations.  These can be applied to stack. */
export const SUM_OPS: AggregateOp[] = [
    'count',
    'sum',
    'distinct',
    'valid',
    'missing'
];

/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS: AggregateOp[] = [
    'mean',
    'average',
    'median',
    'q1',
    'q3',
    'min',
    'max',
];
