import { isArray } from 'vega-util';
export function isRepeatSpec(spec) {
    return 'repeat' in spec;
}
export function isLayerRepeatSpec(spec) {
    return !isArray(spec.repeat) && spec.repeat['layer'];
}
//# sourceMappingURL=repeat.js.map