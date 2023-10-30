import { isArray } from 'vega-util';
export const DEFAULT_SORT_OP = 'min';
const SORT_BY_CHANNEL_INDEX = {
    x: 1,
    y: 1,
    color: 1,
    fill: 1,
    stroke: 1,
    strokeWidth: 1,
    size: 1,
    shape: 1,
    fillOpacity: 1,
    strokeOpacity: 1,
    opacity: 1,
    text: 1
};
export function isSortByChannel(c) {
    return c in SORT_BY_CHANNEL_INDEX;
}
export function isSortByEncoding(sort) {
    return !!sort?.['encoding'];
}
export function isSortField(sort) {
    return sort && (sort['op'] === 'count' || !!sort['field']);
}
export function isSortArray(sort) {
    return sort && isArray(sort);
}
//# sourceMappingURL=sort.js.map