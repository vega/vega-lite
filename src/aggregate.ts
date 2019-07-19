import {AggregateOp} from 'vega';
import {isString} from 'vega-util';
import {flagToSet, newSet} from './util';
import {HiddenCompositeAggregate} from './channeldef';

const AGGREGATE_OPS = flagToSet<AggregateOp, string>({
  argmax: 1,
  argmin: 1,
  average: 1,
  count: 1,
  distinct: 1,
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
  variancep: 1
});

export interface ArgminDef {
  argmin: string;
}

export interface ArgmaxDef {
  argmax: string;
}

export type Aggregate = AggregateOp | ArgmaxDef | ArgminDef;

export function isArgminDef(a: Aggregate | string): a is ArgminDef {
  return !!a && !!a['argmin'];
}

export function isArgmaxDef(a: Aggregate | string): a is ArgmaxDef {
  return !!a && !!a['argmax'];
}

export function isAggregateOp(a: string | ArgminDef | ArgmaxDef): a is AggregateOp {
  return isString(a) && AGGREGATE_OPS.has(a);
}

export const COUNTING_OPS = newSet<AggregateOp, string>(['count', 'valid', 'missing', 'distinct']);

export function isCountingAggregateOp(aggregate: string | Aggregate): boolean {
  return aggregate && isString(aggregate) && COUNTING_OPS.has(aggregate);
}

export const MIN_MAX_OPS = newSet<AggregateOp, string>(['min', 'max']);

export function isMinMaxOp(aggregate: Aggregate | string): boolean {
  return aggregate && isString(aggregate) && MIN_MAX_OPS.has(aggregate);
}

/** Additive-based aggregation operations.  These can be applied to stack. */
export const SUM_OPS = newSet<AggregateOp, AggregateOp | HiddenCompositeAggregate>([
  'count',
  'sum',
  'distinct',
  'valid',
  'missing'
]);

/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
export const SHARED_DOMAIN_OPS = new Set<AggregateOp | HiddenCompositeAggregate>([
  'mean',
  'average',
  'median',
  'q1',
  'q3',
  'min',
  'max'
]);
