import {signalRefOrValue} from './compile/common.js';
import {hasProperty, keys} from './util.js';
export function isExprRef(o) {
  return hasProperty(o, 'expr');
}
export function replaceExprRef(index, {level} = {level: 0}) {
  const props = keys(index || {});
  const newIndex = {};
  for (const prop of props) {
    newIndex[prop] = level === 0 ? signalRefOrValue(index[prop]) : replaceExprRef(index[prop], {level: level - 1});
  }
  return newIndex;
}
//# sourceMappingURL=expr.js.map
