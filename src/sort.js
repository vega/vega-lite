import {hasOwnProperty, isArray} from 'vega-util';
import {hasProperty} from './util.js';
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
  text: 1,
};
export function isSortByChannel(c) {
  return hasOwnProperty(SORT_BY_CHANNEL_INDEX, c);
}
export function isSortByEncoding(sort) {
  return hasProperty(sort, 'encoding');
}
export function isSortField(sort) {
  return sort && (sort.op === 'count' || hasProperty(sort, 'field'));
}
export function isSortArray(sort) {
  return sort && isArray(sort);
}
//# sourceMappingURL=sort.js.map
