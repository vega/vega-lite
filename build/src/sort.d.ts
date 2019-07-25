import { AggregateOp } from 'vega';
import { SingleDefUnitChannel } from './channel';
import { FieldName } from './channeldef';
import { DateTime } from './datetime';
export declare type SortOrder = 'ascending' | 'descending';
/**
 * A sort definition for transform
 */
export interface SortField {
    /**
     * The name of the field to sort.
     */
    field: FieldName;
    /**
     * Whether to sort the field in ascending or descending order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export interface SortFields {
    field: FieldName[];
    order?: (SortOrder)[];
}
export declare const DEFAULT_SORT_OP = "mean";
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
     * An aggregation is required when there are multiple values of the sort field for each encoded data field.
     * The input data objects will be aggregated, grouped by the encoded data field.
     *
     * For a full list of operations, please see the documentation for [aggregate](https://vega.github.io/vega-lite/docs/aggregate.html#ops).
     *
     * __Default value:__ `"sum"` for stacked plots. Otherwise, `"mean"`.
     */
    op?: AggregateOp;
    /**
     * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export interface SortByEncoding {
    /**
     * The [encoding channel](https://vega.github.io/vega-lite/docs/encoding.html#channels) to sort by (e.g., `"x"`, `"y"`)
     */
    encoding: SingleDefUnitChannel;
    /**
     * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export declare type SortArray = number[] | string[] | boolean[] | DateTime[];
export declare type Sort<F> = SortArray | SortOrder | EncodingSortField<F> | SortByEncoding | null;
export declare function isSortByEncoding<F>(sort: Sort<F>): sort is SortByEncoding;
export declare function isSortField<F>(sort: Sort<F>): sort is EncodingSortField<F>;
export declare function isSortArray<F>(sort: Sort<F>): sort is SortArray;
//# sourceMappingURL=sort.d.ts.map