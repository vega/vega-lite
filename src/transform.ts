import {AggregateOp} from './aggregate';
import {Bin} from './bin';
import {Filter} from './filter';
import {TimeUnit} from './timeunit';
import {VgFieldRef} from './vega.schema';

export interface FilterTransform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter: Filter;
}

export function isFilter(t: Transform): t is FilterTransform {
  return t['filter'] !== undefined;
}


export interface CalculateTransform {
  /**
   * A string containing a Vega Expression. Use the variable `datum` to refer to the current data object.
   */
  calculate: string;
  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export interface BinTransform {
  /**
   * Boolean flag indicating using bin transform
   */
  bin: boolean | Bin;

  /**
   * The field to use this transform on.
   */
  field: string;

  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export interface TimeUnitTransform {
  /**
   * The type of time unit for this transform.
   */
  timeUnit: TimeUnit;

  /**
   * The field to use this transform on.
   */
  field: string;

  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export interface SummarizeTransform {
  /**
   * Array of objects that contains
   */
  summarize: Summarize[];

  /**
   * Array of fields we will be useing for group by
   */
  groupby: VgFieldRef[];
}

export interface Summarize {
  aggregate: AggregateOp;

  field: string;

  as: string;
}

export function isCalculate(t: Transform): t is CalculateTransform {
  return t['calculate'] !== undefined;
}

export function isBin(t: Transform): t is BinTransform {
  return t['bin'] !== undefined;
}

export function isTimeUnit(t: Transform): t is TimeUnitTransform {
  return t['timeUnit'] !== undefined;
}

export function isAggregate(t: Transform): t is SummarizeTransform {
  return t['summarize'] !== undefined;
}

export type Transform = FilterTransform | CalculateTransform | BinTransform | TimeUnitTransform | SummarizeTransform;
