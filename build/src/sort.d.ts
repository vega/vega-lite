import { AggregateOp } from 'vega';
export declare type SortOrder = 'ascending' | 'descending' | null;
export interface SortField<F> {
    /**
     * The data [field](field.html) to sort by.
     *
     * __Default value:__ If unspecified, defaults to the field specified in the outer data reference.
     */
    field?: F;
    /**
     * An [aggregate operation](aggregate.html#ops) to perform on the field prior to sorting (e.g., `"count"`, `"mean"` and `"median"`).
     * This property is required in cases where the sort field and the data reference field do not match.
     * The input data objects will be aggregated, grouped by the encoded data field.
     *
     * For a full list of operations, please see the documentation for [aggregate](aggregate.html#ops).
     */
    op: AggregateOp;
    /**
     * The sort order. One of `"ascending"` (default) or `"descending"`.
     */
    order?: SortOrder;
}
export declare function isSortField<F>(sort: SortOrder | SortField<F>): sort is SortField<F>;
