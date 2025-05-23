import {hasProperty} from '../util.js';
export function isAnyConcatSpec(spec) {
  return isVConcatSpec(spec) || isHConcatSpec(spec) || isConcatSpec(spec);
}
export function isConcatSpec(spec) {
  return hasProperty(spec, 'concat');
}
export function isVConcatSpec(spec) {
  return hasProperty(spec, 'vconcat');
}
export function isHConcatSpec(spec) {
  return hasProperty(spec, 'hconcat');
}
//# sourceMappingURL=concat.js.map
