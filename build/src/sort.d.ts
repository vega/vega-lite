import { NonArgAggregateOp } from './aggregate';
import { FieldName } from './channeldef';
import { DateTime } from './datetime';
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
     * Whether to sort the field in ascending or descending order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export interface SortFields {
    field: FieldName[];
    order?: SortOrder[];
}
export declare const DEFAULT_SORT_OP = "min";
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
     * __Default value:__ `"sum"` for stacked plots. Otherwise, `"min"`.
     */
    op?: NonArgAggregateOp;
    /**
     * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export interface SortByEncoding {
    /**
     * The [encoding channel](https://vega.github.io/vega-lite/docs/encoding.html#channels) to sort by (e.g., `"x"`, `"y"`)
     */
    encoding: SortByChannel;
    /**
     * The sort order. One of `"ascending"` (default), `"descending"`, or `null` (no not sort).
     */
    order?: SortOrder | null;
}
export type SortArray = number[] | string[] | boolean[] | DateTime[];
declare const SORT_BY_CHANNEL_INDEX: {
    readonly x: 1;
    readonly y: 1;
    readonly color: 1;
    readonly fill: 1;
    readonly stroke: 1;
    readonly strokeWidth: 1;
    readonly size: 1;
    readonly shape: 1;
    readonly fillOpacity: 1;
    readonly strokeOpacity: 1;
    readonly opacity: 1;
    readonly text: 1;
};
export type SortByChannel = keyof typeof SORT_BY_CHANNEL_INDEX;
export declare function isSortByChannel(c: string): c is SortByChannel;
export type SortByChannelDesc = '-x' | '-y' | '-color' | '-fill' | '-stroke' | '-strokeWidth' | '-size' | '-shape' | '-fillOpacity' | '-strokeOpacity' | '-opacity' | '-text';
export type AllSortString = SortOrder | SortByChannel | SortByChannelDesc;
export type Sort<F> = SortArray | AllSortString | EncodingSortField<F> | SortByEncoding | null;
export declare function isSortByEncoding<F>(sort: Sort<F>): sort is SortByEncoding;
export declare function isSortField<F>(sort: Sort<F>): sort is EncodingSortField<F>;
export declare function isSortArray<F>(sort: Sort<F>): sort is SortArray;
export {};
//# sourceMappingURL=sort.d.ts.map