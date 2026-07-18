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

export interface ExponentialDef {
  exponential: number;
}

export interface ExponentialBDef {
  exponentialb: number;
}

export type NonArgAggregateOp = Exclude<AggregateOp, 'argmin' | 'argmax' | 'exponential' | 'exponentialb'>;

export type Aggregate = NonArgAggregateOp | ArgmaxDef | ArgminDef | ExponentialDef | ExponentialBDef;

export function isArgminDef(a: Aggregate | string): a is ArgminDef {
  return hasProperty(a, 'argmin');
}

export function isArgmaxDef(a: Aggregate | string): a is ArgmaxDef {
  return hasProperty(a, 'argmax');
}

export function isExponentialDef(a: Aggregate | string): a is ExponentialDef {
  return hasProperty(a, 'exponential');
}

export function isExponentialBDef(a: Aggregate | string): a is ExponentialBDef {
  return hasProperty(a, 'exponentialb');
}

/**
 * An aggregate operation that takes an aggregate parameter, expressed as an object such as `{"exponential": 0.5}`.
 */
export type ParameterizedAggregateDef = ExponentialDef | ExponentialBDef;

export function isParameterizedAggregateDef(a: Aggregate | string): a is ParameterizedAggregateDef {
  return isExponentialDef(a) || isExponentialBDef(a);
}

/**
 * Returns the operation name for an aggregate, unwrapping parameterized aggregate defs to their op.
 */
export function getAggregateOp(a: ParameterizedAggregateDef): 'exponential' | 'exponentialb';
export function getAggregateOp<T extends string>(a: T | ParameterizedAggregateDef): T | 'exponential' | 'exponentialb';
export function getAggregateOp(a: Aggregate | string): string {
  return isExponentialDef(a) ? 'exponential' : isExponentialBDef(a) ? 'exponentialb' : (a as string);
}

/**
 * Returns the parameter of a parameterized aggregate def, or `undefined` for other aggregates.
 */
export function getAggregateParam(a: Aggregate | string): number | undefined {
  return isExponentialDef(a) ? a.exponential : isExponentialBDef(a) ? a.exponentialb : undefined;
}

export function isAggregateOp(a: string | ArgminDef | ArgmaxDef | ParameterizedAggregateDef): a is AggregateOp {
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
