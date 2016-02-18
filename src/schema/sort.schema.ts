import {SortOrder} from '../enums';
import {AggregateOp} from '../aggregate';

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
