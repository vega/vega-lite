import { isArray } from 'vega-util';
export const DEFAULT_SORT_OP = 'mean';
export function isSortByEncoding(sort) {
    return !!sort && !!sort['encoding'];
}
export function isSortField(sort) {
    return !!sort && (sort['op'] === 'count' || !!sort['field']);
}
export function isSortArray(sort) {
    return !!sort && isArray(sort);
}
//# sourceMappingURL=sort.js.map