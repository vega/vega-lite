import {AggregateOp} from './aggregate';


export type SortOrder = 'ascending' | 'descending' | null;

export interface SortField {
  /**
   * The field name to aggregate over.
   */
  field?: string;
  /**
   * The sort aggregation operator
   */
  op: AggregateOp;

  order?: SortOrder;
}

export function isSortField(sort: SortOrder | SortField): sort is SortField {
  return !!sort && (sort['op'] === 'count' || !!sort['field']) && !!sort['op'];
}
