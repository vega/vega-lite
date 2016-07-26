import {AggregateOp} from './aggregate';

export enum SortOrder {
    ASCENDING = 'ascending' as any,
    DESCENDING = 'descending' as any,
    NONE = 'none' as any,
}

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
