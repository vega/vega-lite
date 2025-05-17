import {isArray} from 'vega-util';
import {hasProperty} from '../util.js';
export function isRepeatSpec(spec) {
  return hasProperty(spec, 'repeat');
}
export function isLayerRepeatSpec(spec) {
  return !isArray(spec.repeat) && hasProperty(spec.repeat, 'layer');
}
//# sourceMappingURL=repeat.js.map
