import { toSet } from 'vega-util';
import { contains, keys } from './util';
export const AREA = 'area';
export const BAR = 'bar';
export const LINE = 'line';
export const POINT = 'point';
export const RECT = 'rect';
export const RULE = 'rule';
export const TEXT = 'text';
export const TICK = 'tick';
export const TRAIL = 'trail';
export const CIRCLE = 'circle';
export const SQUARE = 'square';
export const GEOSHAPE = 'geoshape';
// Using mapped type to declare index, ensuring we always have all marks when we add more.
const MARK_INDEX = {
    area: 1,
    bar: 1,
    line: 1,
    point: 1,
    text: 1,
    tick: 1,
    trail: 1,
    rect: 1,
    geoshape: 1,
    rule: 1,
    circle: 1,
    square: 1
};
export function isMark(m) {
    return !!MARK_INDEX[m];
}
export function isPathMark(m) {
    return contains(['line', 'area', 'trail'], m);
}
export const PRIMITIVE_MARKS = keys(MARK_INDEX);
export function isMarkDef(mark) {
    return mark['type'];
}
const PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);
export function isPrimitiveMark(mark) {
    const markType = isMarkDef(mark) ? mark.type : mark;
    return markType in PRIMITIVE_MARK_INDEX;
}
export const STROKE_CONFIG = [
    'stroke',
    'strokeWidth',
    'strokeDash',
    'strokeDashOffset',
    'strokeOpacity',
    'strokeJoin',
    'strokeMiterLimit'
];
export const FILL_CONFIG = ['fill', 'fillOpacity'];
export const FILL_STROKE_CONFIG = [].concat(STROKE_CONFIG, FILL_CONFIG);
export const VL_ONLY_MARK_CONFIG_PROPERTIES = ['filled', 'color', 'tooltip'];
export const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
    area: ['line', 'point'],
    bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
    rect: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
    line: ['point'],
    text: ['shortTimeLabels'],
    tick: ['bandSize', 'thickness']
};
export const defaultMarkConfig = {
    color: '#4c78a8',
    tooltip: { content: 'encoding' }
};
const DEFAULT_RECT_BAND_SIZE = 5;
export const defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: DEFAULT_RECT_BAND_SIZE
};
export const defaultRectConfig = {
    binSpacing: 0,
    continuousBandSize: DEFAULT_RECT_BAND_SIZE
};
export const defaultTickConfig = {
    thickness: 1
};
export function getMarkType(m) {
    return isMarkDef(m) ? m.type : m;
}
//# sourceMappingURL=mark.js.map