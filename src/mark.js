"use strict";
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
    Mark.LABEL = 'label';
    Mark.TICK = 'tick';
    Mark.CIRCLE = 'circle';
    Mark.SQUARE = 'square';
    Mark.ERRORBAR = 'error-bar';
})(Mark = exports.Mark || (exports.Mark = {}));
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.LABEL = Mark.LABEL;
exports.TICK = Mark.TICK;
exports.RECT = Mark.RECT;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.ERRORBAR = Mark.ERRORBAR;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.LABEL, exports.TICK, exports.RULE, exports.CIRCLE, exports.SQUARE];
exports.COMPOSITE_MARKS = [exports.ERRORBAR];
function isCompositeMark(mark) {
    return util_1.contains(exports.COMPOSITE_MARKS, mark);
}
exports.isCompositeMark = isCompositeMark;
exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
    'strokeDash', 'strokeDashOffset', 'strokeOpacity'];
exports.FILL_CONFIG = ['fill', 'fillOpacity'];
exports.FILL_STROKE_CONFIG = [].concat(exports.STROKE_CONFIG, exports.FILL_CONFIG);
exports.defaultMarkConfig = {
    color: '#4682b4',
    minOpacity: 0.3,
    maxOpacity: 0.8,
    minStrokeWidth: 1,
    maxStrokeWidth: 4
};
exports.defaultAreaConfig = {};
exports.defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 2
};
exports.defaultLineConfig = {
    strokeWidth: 2
};
exports.defaultSymbolConfig = {
    size: 30,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    strokeWidth: 2
};
exports.defaultPointConfig = util_1.extend({}, exports.defaultSymbolConfig, {
    shape: 'circle',
    shapes: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
});
exports.defaultCircleConfig = exports.defaultSymbolConfig;
exports.defaultSquareConfig = exports.defaultSymbolConfig;
exports.defaultRectConfig = {};
exports.defaultRuleConfig = {
    strokeWidth: 1
};
exports.defaultTextConfig = {
    fontSize: 10,
    minFontSize: 8,
    maxFontSize: 40,
    baseline: 'middle',
    text: 'Abc'
};
exports.defaultLabelConfig = {
    fontSize: 10,
    minFontSize: 8,
    maxFontSize: 40,
    baseline: 'middle',
    text: 'Abc'
};
exports.defaultTickConfig = {
    // if tickSize = 1, it becomes a dot.
    // To be consistent, we just use 3 to be somewhat consistent with point, which use area = 9.
    minBandSize: 3,
    thickness: 1
};
// TODO: ErrorBar Config
//# sourceMappingURL=mark.js.map