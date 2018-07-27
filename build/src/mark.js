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
export var AREA = Mark.AREA;
export var BAR = Mark.BAR;
export var LINE = Mark.LINE;
export var POINT = Mark.POINT;
export var TEXT = Mark.TEXT;
export var TICK = Mark.TICK;
export var TRAIL = Mark.TRAIL;
export var RECT = Mark.RECT;
export var RULE = Mark.RULE;
export var GEOSHAPE = Mark.GEOSHAPE;
export var CIRCLE = Mark.CIRCLE;
export var SQUARE = Mark.SQUARE;
// Using mapped type to declare index, ensuring we always have all marks when we add more.
var MARK_INDEX = {
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
export var PRIMITIVE_MARKS = flagKeys(MARK_INDEX);
export function isMarkDef(mark) {
    return mark['type'];
}
var PRIMITIVE_MARK_INDEX = toSet(PRIMITIVE_MARKS);
export function isPrimitiveMark(mark) {
    var markType = isMarkDef(mark) ? mark.type : mark;
    return markType in PRIMITIVE_MARK_INDEX;
}
export var STROKE_CONFIG = [
    'stroke',
    'strokeWidth',
    'strokeDash',
    'strokeDashOffset',
    'strokeOpacity',
    'strokeJoin',
    'strokeMiterLimit'
];
export var FILL_CONFIG = ['fill', 'fillOpacity'];
export var FILL_STROKE_CONFIG = [].concat(STROKE_CONFIG, FILL_CONFIG);
export var VL_ONLY_MARK_CONFIG_PROPERTIES = ['filled', 'color', 'tooltip'];
export var VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX = {
    area: ['line', 'point'],
    bar: ['binSpacing', 'continuousBandSize', 'discreteBandSize'],
    line: ['point'],
    text: ['shortTimeLabels'],
    tick: ['bandSize', 'thickness']
};
export var defaultMarkConfig = {
    color: '#4c78a8',
    tooltip: { content: 'encoding' }
};
export var defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 5
};
export var defaultTickConfig = {
    thickness: 1
};
//# sourceMappingURL=mark.js.map