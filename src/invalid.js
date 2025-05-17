import {isObject} from 'vega-util';
export function isScaleInvalidDataIncludeAsValue(invalidDataMode) {
  return isObject(invalidDataMode) && 'value' in invalidDataMode;
}
//# sourceMappingURL=invalid.js.map
