import {AggregateOp} from 'vega';
import {BinParams} from './bin';
import {Data} from './data';
import {LogicalOperand, normalizeLogicalOperand} from './logical';
import {normalizePredicate, Predicate} from './predicate';
import {TimeUnit} from './timeunit';

export interface FilterTransform {
  /**
   * The `filter` property must be one of the predicate definitions:
   * (1) an [expression](https://vega.github.io/vega-lite/docs/types.html#expression) string,
   * where `datum` can be used to refer to the current data object;
   * (2) one of the field predicates: [equal predicate](https://vega.github.io/vega-lite/docs/filter.html#equal-predicate);
   * [range predicate](filter.html#range-predicate), [one-of predicate](https://vega.github.io/vega-lite/docs/filter.html#one-of-predicate);
   * (3) a [selection predicate](https://vega.github.io/vega-lite/docs/filter.html#selection-predicate);
   * or (4) a logical operand that combines (1), (2), or (3).
   */
  // TODO: https://github.com/vega/vega-lite/issues/2901
  filter: LogicalOperand<Predicate>;
}

export function isFilter(t: Transform): t is FilterTransform {
  return t['filter'] !== undefined;
}

export interface CalculateTransform {
  /**
   * A [expression](https://vega.github.io/vega-lite/docs/types.html#expression) string. Use the variable `datum` to refer to the current data object.
   */
  calculate: string;

  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export interface BinTransform {
  /**
   * An object indicating bin properties, or simply `true` for using default bin parameters.
   */
  bin: boolean | BinParams;

  /**
   * The data field to bin.
   */
  field: string;

  /**
   * The output fields at which to write the start and end bin values.
   */
  as: string;
}

export interface TimeUnitTransform {
  /**
   * The timeUnit.
   */
  timeUnit: TimeUnit;

  /**
   * The data field to apply time unit.
   */
  field: string;

  /**
   * The output field to write the timeUnit value.
   */
  as: string;
}

export interface AggregateTransform {
  /**
   * Array of objects that define fields to aggregate.
   */
  aggregate: AggregatedFieldDef[];

  /**
   * The data fields to group by. If not specified, a single group containing all data objects will be used.
   */
  groupby?: string[];
}

export interface AggregatedFieldDef {
  /**
   * The aggregation operations to apply to the fields, such as sum, average or count.
   * See the [full list of supported aggregation operations](https://vega.github.io/vega-lite/docs/aggregate.html#ops)
   * for more information.
   */
  op: AggregateOp;

  /**
   * The data field for which to compute aggregate function.
   */
  field: string;

  /**
   * The output field names to use for each aggregated field.
   */
  as: string;
}


export type WindowOnlyOp =
  |'row_number'
  | 'rank'
  | 'dense_rank'
  | 'percent_rank'
  | 'cume_dist'
  | 'ntile'
  | 'lag'
  | 'lead'
  | 'first_value'
  | 'last_value'
  | 'nth_value';

export interface WindowFieldDef {
  /**
   * The operations supported for the window aggregation. See the list of supported operations here:
   *   https://vega.github.io/vega-lite/docs/transforms/window.html
   */
  op: AggregateOp | WindowOnlyOp;

  /**
   *  Please refer to the operation/parameter table. Parameter values for the window functions. Parameter value can be omitted for operations that do not accept a parameter. The spec will be invalid if any function that requires a parameter is unspecified.
   */
  param?: number;

  /**
   * The data field for which to compute the aggregate or window function. This can be omitted for functions that do not operate over a field such as `count`, `rank`, `dense_rank`.
   */
  field?: string;

  /**
   *  The output name for each field.
   */
  as: string;
}

export interface WindowTransform {
  /**
   * The definition of the fields in the window, and what calculations to use.
   */
  window: WindowFieldDef[];

  /**
   * A frame specification as a two-element array indicating how the sliding window should proceed. The array entries should either be a number indicating the offset from the current data object, or null to indicate unbounded rows preceding or following the current data object. The default value is `[null, 0]`, indicating that the sliding window includes the current object and all preceding objects. The value `[-5, 5]` indicates that the window should include five objects preceding and five objects following the current object. Finally, `[null, null]` indicates that the window frame should always include all data objects.
   *
   * __Default value:__:  `[null, 0]` (includes the current object and all preceding objects)
   */
  frame?: (null | number)[];

  /**
   * Will indicate whether to ignore peer values (items with the same rank) in the window.
   *
   * __Default value:__ `false'
   */
  ignorePeers?: boolean;

  /**
   * The data fields for partitioning the data objects into separate windows. If unspecified, all data points will be a single group.
   */
  groupby?: string[];

  /**
   * A definition for sorting the data objects within the window. Equivalent objects are considered a peer (Look at ignorePeers). If undefined, the order of items in the window is undefined.
   */
  sort?: WindowSortField[];
}

export interface LookupData {
  /**
   * Secondary data source to lookup in.
   */
  data: Data;
  /**
   * Key in data to lookup.
   */
  key: string;
  /**
   * Fields in foreign data to lookup.
   * If not specified, the entire object is queried.
   */
  fields?: string[];
}

export interface LookupTransform {
  /**
   * Key in primary data source.
   */
  lookup: string;

  /**
   * Secondary data reference.
   */
  from: LookupData;

  /**
   * The field or fields for storing the computed formula value.
   * If `from.fields` is specified, the transform will use the same names for `as`.
   * If `from.fields` is not specified, `as` has to be a string and we put the whole object into the data under the specified name.
   */
  as?: string | string[];

  /**
   * The default value to use if lookup fails.
   *
   * __Default value:__ `null`
   */
  default?: string;
}


/**
 * A compartor for fields within the window transform
 */
export interface WindowSortField {
  /**
   * The name of the field to sort.
   */
  field: string;

  /**
   * Whether to sort the field in ascending or descending order.
   */
  order?: 'ascending' | 'descending';
}

export function isLookup(t: Transform): t is LookupTransform {
  return t['lookup'] !== undefined;
}

export function isWindow(t: Transform): t is WindowTransform {
  return t['window'] !== undefined;
}

export function isCalculate(t: Transform): t is CalculateTransform {
  return t['calculate'] !== undefined;
}

export function isBin(t: Transform): t is BinTransform {
  return !!t['bin'];
}

export function isTimeUnit(t: Transform): t is TimeUnitTransform {
  return t['timeUnit'] !== undefined;
}

export function isAggregate(t: Transform): t is AggregateTransform {
  return t['aggregate'] !== undefined;
}

export type Transform = FilterTransform | CalculateTransform | LookupTransform | BinTransform | TimeUnitTransform | AggregateTransform | WindowTransform;

export function normalizeTransform(transform: Transform[]) {
  return transform.map(t => {
    if (isFilter(t)) {
      return {
        filter: normalizeLogicalOperand(t.filter, normalizePredicate)
      };
    }
    return t;
  });
}
