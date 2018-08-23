import { isArray } from 'vega-util';
export function isSortField(sort) {
    return !!sort && (sort['op'] === 'count' || !!sort['field']) && !!sort['op'];
}
export function isSortArray(sort) {
    return !!sort && isArray(sort);
}
//# sourceMappingURL=sort.js.map