import {hasProperty} from '../util.js';
export function isFacetMapping(f) {
  return hasProperty(f, 'row') || hasProperty(f, 'column');
}
export function isFacetFieldDef(channelDef) {
  return hasProperty(channelDef, 'header');
}
export function isFacetSpec(spec) {
  return hasProperty(spec, 'facet');
}
//# sourceMappingURL=facet.js.map
