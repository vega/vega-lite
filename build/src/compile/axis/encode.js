"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
var config_1 = require("./config");
function labels(model, channel, specifiedLabelsSpec, orient) {
    var fieldDef = model.fieldDef(channel) ||
        (channel === 'x' ? model.fieldDef('x2') :
            channel === 'y' ? model.fieldDef('y2') :
                undefined);
    var axis = model.axis(channel);
    var config = model.config;
    var labelsSpec = {};
    // Text
    if (fielddef_1.isTimeFieldDef(fieldDef)) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === scale_1.ScaleType.UTC;
        var expr = common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale);
        if (expr) {
            labelsSpec.text = { signal: expr };
        }
    }
    // Label Angle
    var angle = config_1.getAxisConfig('labelAngle', model.config, channel, orient, model.getScaleComponent(channel).get('type'));
    if (angle === undefined) {
        angle = labelAngle(axis, channel, fieldDef);
        if (angle) {
            labelsSpec.angle = { value: angle };
        }
    }
    if (angle !== undefined) {
        var align = labelAlign(angle, orient);
        if (align) {
            labelsSpec.align = { value: align };
        }
        labelsSpec.baseline = labelBaseline(angle, orient);
    }
    labelsSpec = tslib_1.__assign({}, labelsSpec, specifiedLabelsSpec);
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;
function labelBaseline(angle, orient) {
    if (orient === 'top' || orient === 'bottom') {
        if (angle <= 45 || 315 <= angle) {
            return { value: orient === 'top' ? 'bottom' : 'top' };
        }
        else if (135 <= angle && angle <= 225) {
            return { value: orient === 'top' ? 'top' : 'bottom' };
        }
        else {
            return { value: 'middle' };
        }
    }
    else {
        if ((angle <= 45 || 315 <= angle) || (135 <= angle && angle <= 225)) {
            return { value: 'middle' };
        }
        else if (45 <= angle && angle <= 135) {
            return { value: orient === 'left' ? 'top' : 'bottom' };
        }
        else {
            return { value: orient === 'left' ? 'bottom' : 'top' };
        }
    }
}
exports.labelBaseline = labelBaseline;
function labelAngle(axis, channel, fieldDef) {
    if (axis.labelAngle !== undefined) {
        // Make angle within [0,360)
        return ((axis.labelAngle % 360) + 360) % 360;
    }
    else {
        if (channel === channel_1.X && util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type)) {
            return 270;
        }
    }
    return undefined;
}
exports.labelAngle = labelAngle;
function labelAlign(angle, orient) {
    angle = ((angle % 360) + 360) % 360;
    if (orient === 'top' || orient === 'bottom') {
        if (angle % 180 === 0) {
            return 'center';
        }
        else if (0 < angle && angle < 180) {
            return orient === 'top' ? 'right' : 'left';
        }
        else {
            return orient === 'top' ? 'left' : 'right';
        }
    }
    else {
        if ((angle + 90) % 180 === 0) {
            return 'center';
        }
        else if (90 <= angle && angle < 270) {
            return orient === 'left' ? 'left' : 'right';
        }
        else {
            return orient === 'left' ? 'right' : 'left';
        }
    }
}
exports.labelAlign = labelAlign;
//# sourceMappingURL=encode.js.map