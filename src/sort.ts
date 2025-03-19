import {hasOwnProperty, isArray} from 'vega-util';
import {NonArgAggregateOp} from './aggregate.js';
import {FieldName} from './channeldef.js';
import {DateTime} from './datetime.js';
import {hasProperty} from './util.js';

export type SortOrder = 'ascending' | 'descending';

/**
 * A sort definition for transform
 */
export interface SortField {
  /**
   * The name of the field to sort.
   */
  field: FieldName;

  /**
   * Whether to sort the field in ascending or descending order. One of `"ascending"` (default), `"descending"`, or `null` (do not sort).
   */
  order?: SortOrder | null;
}

export interface SortFields {
  field: FieldName[];
  order?: SortOrder[];
}

export const DEFAULT_SORT_OP = 'min';

/**
 * A sort definition for sorting a discrete scale in an encoding field definition.
 */

export interface EncodingSortField<F> {
  /**
   * The data [field](https://vega.github.io/vega-lite/docs/field.html) to sort by.
   *
   * __Default value:__ If unspecified, defaults to the field specified in the outer data reference.
   */
  field?: F; // Field is optional because `"op": "count"` does not require a field.
  /**
   * An [aggregate operation](https://vega.github.io/vega-lite/docs/aggregate.html#ops) to perform on the field prior to sorting (e.g., `"count"`, `"mean"` and `"median"`).
   * An aggregation is required when there are multiple values of the sort field for each encoded data field.
   * The input data objects will be aggregated, grouped by the encoded data field.
   *
   * For a full list of operations, please see the documentation for [aggregate](https://vega.github.io/vega-lite/docs/aggregate.html#ops).
   *
   * __Default value:__ `"sum"` for stacked plots. Otherwise, `"min"`.
   */
  op?: NonArgAggregateOp;

  /**
   * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (do not sort).
   */
  order?: SortOrder | null;
}

export interface SortByEncoding {
  /**
   * The [encoding channel](https://vega.github.io/vega-lite/docs/encoding.html#channels) to sort by (e.g., `"x"`, `"y"`)
   */
  encoding: SortByChannel;

  /**
   * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (do not sort).
   */
  order?: SortOrder | null;
}

export type SortArray = number[] | string[] | boolean[] | DateTime[];

const SORT_BY_CHANNEL_INDEX = {
  x: 1,
  y: 1,
  color: 1,
  fill: 1,
  stroke: 1,
  strokeWidth: 1,
  size: 1,
  shape: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  opacity: 1,
  text: 1,
} as const;

export type SortByChannel = keyof typeof SORT_BY_CHANNEL_INDEX;

export function isSortByChannel(c: string): c is SortByChannel {
  return hasOwnProperty(SORT_BY_CHANNEL_INDEX, c);
}

export type SortByChannelDesc =
  | '-x'
  | '-y'
  | '-color'
  | '-fill'
  | '-stroke'
  | '-strokeWidth'
  | '-size'
  | '-shape'
  | '-fillOpacity'
  | '-strokeOpacity'
  | '-opacity'
  | '-text';

export type AllSortString = SortOrder | SortByChannel | SortByChannelDesc;

export type Sort<F> = SortArray | AllSortString | EncodingSortField<F> | SortByEncoding | null;

export function isSortByEncoding<F>(sort: Sort<F>): sort is SortByEncoding {
  return hasProperty(sort, 'encoding');
}

export function isSortField<F>(sort: Sort<F>): sort is EncodingSortField<F> {
  return sort && ((sort as any).op === 'count' || hasProperty(sort, 'field'));
}

export function isSortArray<F>(sort: Sort<F>): sort is SortArray {
  return sort && isArray(sort);
}
