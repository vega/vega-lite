"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Mark;
(function (Mark) {
    Mark.AREA = 'area';
    Mark.BAR = 'bar';
    Mark.LINE = 'line';
    Mark.POINT = 'point';
    Mark.RECT = 'rect';
    Mark.RULE = 'rule';
    Mark.TEXT = 'text';
    Mark.TICK = 'tick';
    Mark.CIRCLE = 'circle';
    Mark.SQUARE = 'square';
})(Mark = exports.Mark || (exports.Mark = {}));
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RECT = Mark.RECT;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.TICK, exports.RECT, exports.RULE, exports.CIRCLE, exports.SQUARE];
function isMarkDef(mark) {
    return mark['type'];
}
exports.isMarkDef = isMarkDef;
var PRIMITIVE_MARK_INDEX = util_1.toSet(exports.PRIMITIVE_MARKS);
function isPrimitiveMark(mark) {
    var markType = isMarkDef(mark) ? mark.type : mark;
    return markType in PRIMITIVE_MARK_INDEX;
}
exports.isPrimitiveMark = isPrimitiveMark;
exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
    'strokeDash', 'strokeDashOffset', 'strokeOpacity'];
exports.FILL_CONFIG = ['fill', 'fillOpacity'];
exports.FILL_STROKE_CONFIG = [].concat(exports.STROKE_CONFIG, exports.FILL_CONFIG);
exports.defaultMarkConfig = {
    color: '#4c78a8',
};
exports.defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 2
};
exports.defaultTextConfig = {
    baseline: 'middle',
};
exports.defaultTickConfig = {
    thickness: 1
};
//# sourceMappingURL=mark.js.map