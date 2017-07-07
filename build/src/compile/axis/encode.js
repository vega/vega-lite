"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function labels(model, channel, specifiedLabelsSpec, def) {
    var fieldDef = model.fieldDef(channel) ||
        (channel === 'x' ? model.fieldDef('x2') :
            channel === 'y' ? model.fieldDef('y2') :
                undefined);
    var axis = model.axis(channel);
    var config = model.config;
    var labelsSpec = {};
    // Text
    if (fieldDef.type === type_1.TEMPORAL) {
        var isUTCScale = model.getScaleComponent(channel).get('type') === scale_1.ScaleType.UTC;
        labelsSpec.text = {
            signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat, isUTCScale)
        };
    }
    // Label Angle
    var angle = labelAngle(axis, channel, fieldDef);
    if (angle) {
        labelsSpec.angle = { value: angle };
    }
    if (labelsSpec.angle && channel === 'x') {
        var align = labelAlign(angle, def.get('orient'));
        if (align) {
            labelsSpec.align = { value: align };
        }
        // Auto set baseline if x is rotated by 90, or -90
        if (util_1.contains([90, 270], angle)) {
            labelsSpec.baseline = { value: 'middle' };
        }
    }
    labelsSpec = tslib_1.__assign({}, labelsSpec, specifiedLabelsSpec);
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;
function labelAngle(axis, channel, fieldDef) {
    if (axis.labelAngle !== undefined) {
        // Make angle within [0,360)
        return ((axis.labelAngle % 360) + 360) % 360;
    }
    else {
        // auto rotate for X
        if (channel === channel_1.X && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === type_1.TEMPORAL)) {
            return 270;
        }
    }
    return undefined;
}
exports.labelAngle = labelAngle;
function labelAlign(angle, orient) {
    if (angle && angle > 0) {
        if (angle > 180) {
            return orient === 'top' ? 'left' : 'right';
        }
        else if (angle < 180) {
            return orient === 'top' ? 'right' : 'left';
        }
    }
    return undefined;
}
exports.labelAlign = labelAlign;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQThEO0FBRTlELHFDQUFzQztBQUN0QyxtQ0FBc0Q7QUFDdEQsbUNBQWtEO0FBRWxELG9DQUErQztBQUkvQyxnQkFBdUIsS0FBZ0IsRUFBRSxPQUE0QixFQUFFLG1CQUF3QixFQUFFLEdBQTJCO0lBQzFILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3RDLENBQ0UsT0FBTyxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN0QyxPQUFPLEtBQUssR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUN0QyxTQUFTLENBQ1YsQ0FBQztJQUNKLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUU1QixJQUFJLFVBQVUsR0FBUSxFQUFFLENBQUM7SUFFekIsT0FBTztJQUNQLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLGlCQUFTLENBQUMsR0FBRyxDQUFDO1FBRWxGLFVBQVUsQ0FBQyxJQUFJLEdBQUk7WUFDakIsTUFBTSxFQUFFLDZCQUFvQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7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