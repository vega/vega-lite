import {AggregateOp} from 'vega';
import {isArray} from 'vega-util';
import {DateTime} from './datetime';

export type SortOrder = 'ascending' | 'descending';

/**
 * A sort definition for transform
 */
export interface SortField {
  /**
   * The name of the field to sort.
   */
  field: string;

  /**
   * Whether to sort the field in ascending or descending order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
   */
  order?: SortOrder | null;
}

export interface SortFields {
  field: string[];
  order?: (SortOrder)[];
}

/**
 * A sort definition for sorting a discrete scale in an encoding field definition.
 */

export interface EncodingSortField<F> {
  /**
   * The data [field](https://vega.github.io/vega-lite/docs/field.html) to sort by.
   *
   * __Default value:__ If unspecified, defaults to the field specified in the outer data reference.
   */
  field?: F;
  /**
   * An [aggregate operation](https://vega.github.io/vega-lite/docs/aggregate.html#ops) to perform on the field prior to sorting (e.g., `"count"`, `"mean"` and `"median"`).
   * This property is required in cases where the sort field and the data reference field do not match.
   * The input data objects will be aggregated, grouped by the encoded data field.
   *
   * For a full list of operations, please see the documentation for [aggregate](https://vega.github.io/vega-lite/docs/aggregate.html#ops).
   */
  op: AggregateOp;

  /**
   * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
   */
  order?: SortOrder | null;
}

export type Sort<F> = number[] | string[] | boolean[] | DateTime[] | SortOrder | EncodingSortField<F> | null;

export function isSortField<F>(sort: Sort<F>): sort is EncodingSortField<F> {
  return !!sort && (sort['op'] === 'count' || !!sort['field']) && !!sort['op'];
}

export function isSortArray<F>(sort: Sort<F>): sort is number[] | string[] | boolean[] | DateTime[] {
  return !!sort && isArray(sort);
}
