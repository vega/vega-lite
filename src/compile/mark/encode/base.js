import {hasProperty} from '../../../util.js';
import {VG_MARK_CONFIGS} from '../../../vega.schema.js';
import {signalOrValueRef} from '../../common.js';
import {aria} from './aria.js';
import {color} from './color.js';
import {nonPosition} from './nonposition.js';
import {text} from './text.js';
import {tooltip} from './tooltip.js';
import {zindex} from './zindex.js';
export {color} from './color.js';
export {nonPosition} from './nonposition.js';
export {pointPosition} from './position-point.js';
export {pointOrRangePosition, rangePosition} from './position-range.js';
export {rectPosition} from './position-rect.js';
export {text} from './text.js';
export {tooltip} from './tooltip.js';
const ALWAYS_IGNORE = new Set(['aria', 'width', 'height']);
export function baseEncodeEntry(model, ignore) {
  const {fill = undefined, stroke = undefined} = ignore.color === 'include' ? color(model) : {};
  return {
    ...markDefProperties(model.markDef, ignore),
    ...colorRef('fill', fill),
    ...colorRef('stroke', stroke),
    ...nonPosition('opacity', model),
    ...nonPosition('fillOpacity', model),
    ...nonPosition('strokeOpacity', model),
    ...nonPosition('strokeWidth', model),
    ...nonPosition('strokeDash', model),
    ...zindex(model),
    ...tooltip(model),
    ...text(model, 'href'),
    ...aria(model),
  };
}
function colorRef(channel, valueRef) {
  return valueRef ? {[channel]: valueRef} : {};
}
function markDefProperties(mark, ignore) {
  return VG_MARK_CONFIGS.reduce((m, prop) => {
    if (!ALWAYS_IGNORE.has(prop) && hasProperty(mark, prop) && ignore[prop] !== 'ignore') {
      m[prop] = signalOrValueRef(mark[prop]);
    }
    return m;
  }, {});
}
//# sourceMappingURL=base.js.map
