import type {AggregateOp} from 'vega';
import {hasOwnProperty, isString} from 'vega-util';
import {FieldName} from './channeldef.js';
import {contains, Flag, hasProperty} from './util.js';

const AGGREGATE_OP_INDEX: Flag<AggregateOp> = {
  argmax: 1,
  argmin: 1,
  average: 1,
  count: 1,
  distinct: 1,
  exponential: 1,
  exponentialb: 1,
  product: 1,
  max: 1,
  mean: 1,
  median: 1,
  min: 1,
  missing: 1,
  q1: 1,
  q3: 1,
  ci0: 1,
  ci1: 1,
  stderr: 1,
  stdev: 1,
  stdevp: 1,
  sum: 1,
  valid: 1,
  values: 1,
  variance: 1,
  variancep: 1,
};

export const MULTIDOMAIN_SORT_OP_INDEX = {
  count: 1,
  min: 1,
  max: 1,
};

export interface ArgminDef {
  argmin: FieldName;
}

export interface ArgmaxDef {
  argmax: FieldName;
}

export type NonArgAggregateOp = Exclude<AggregateOp, 'argmin' | 'argmax'>;

export type Aggregate = NonArgAggregateOp | ArgmaxDef | ArgminDef;

export function isArgminDef(a: Aggregate | string): a is ArgminDef {
  return hasProperty(a, 'argmin');
}

export function isArgmaxDef(a: Aggregate | string): a is ArgmaxDef {
  return hasProperty(a, 'argmax');
}

export function isAggregateOp(a: string | ArgminDef | ArgmaxDef): a is AggregateOp {
  return isString(a) && hasOwnProperty(AGGREGATE_OP_INDEX, a);
}

export const COUNTING_OPS = new Set<NonArgAggregateOp>([
  'count',
  'valid',
  'missing',
  'distinct',
]) as ReadonlySet<NonArgAggregateOp>;

export function isCountingAggregateOp(aggregate?: string | Aggregate): boolean {
  return isString(aggregate) && COUNTING_OPS.has(aggregate as any);
}

export function isMinMaxOp(aggregate?: Aggregate | string): boolean {
  return isString(aggregate) && contains(['min', 'max'], aggregate);
}

/** Additive-based aggregation operations. These can be applied to stack. */
export const SUM_OPS = new Set<NonArgAggregateOp>([
  'count',
  'sum',
  'distinct',
  'valid',
  'missing',
]) as ReadonlySet<NonArgAggregateOp>;

/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS = new Set<AggregateOp>([
  'mean',
  'average',
  'median',
  'q1',
  'q3',
  'min',
  'max',
]) as ReadonlySet<AggregateOp>;
