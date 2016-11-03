import {AggregateOp} from './aggregate';

export namespace SortOrder {
    export const ASCENDING: 'ascending' = 'ascending';
    export type ASCENDING = typeof ASCENDING;
    export const DESCENDING: 'descending' = 'descending';
    export type DESCENDING = typeof DESCENDING;
    export const NONE: 'none' = 'none';
    export type NONE = typeof NONE;
}
export type SortOrder = SortOrder.ASCENDING | SortOrder.DESCENDING | SortOrder.NONE;

export interface SortField {
  /**
   * The field name to aggregate over.
   */
  field: string;
  /**
   * The sort aggregation operator
   */
  op: AggregateOp;

  order?: SortOrder;
}

export function isSortField(sort: SortOrder | SortField): sort is SortField {
  return !!sort && !!sort['field'] && !!sort['op'];
}
