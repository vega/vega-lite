import { AggregateOp } from './aggregate';
export declare type SortOrder = 'ascending' | 'descending' | null;
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
export declare function isSortField(sort: SortOrder | SortField): sort is SortField;
