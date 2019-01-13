import { toSet } from 'vega-util';
import { contains, flagKeys } from './util';
export var Mark;
(function (Mark) {
    Mark.AREA = 'area';
    Mark.BAR = 'bar';
    Mark.LINE = 'line';
    Mark.POINT = 'point';
    Mark.RECT = 'rect';
    Mark.RULE = 'rule';
    Mark.TEXT = 'text';
    Mark.TICK = 'tick';
    Mark.TRAIL = 'trail';
    Mark.CIRCLE = 'circle';
    Mark.SQUARE = 'square';
    Mark.GEOSHAPE = 'geoshape';
})(Mark || (Mark = {}));
export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
export const TRAIL = Mark.TRAIL;
export const RECT = Mark.RECT;
export const RULE = Mark.RULE;
export const GEOSHAPE = Mark.GEOSHAPE;
export const CIRCLE = Mark.CIRCLE;
export const SQUARE = Mark.SQUARE;
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
export const PRIMITIVE_MARKS = flagKeys(MARK_INDEX);
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
    line: ['point'],
    text: ['shortTimeLabels'],
    tick: ['bandSize', 'thickness']
};
export const defaultMarkConfig = {
    color: '#4c78a8',
    tooltip: { content: 'encoding' }
};
export const defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 5
};
export const defaultTickConfig = {
    thickness: 1
};
//# sourceMappingURL=mark.js.map