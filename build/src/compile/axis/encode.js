"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
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
    if (fielddef_1.isTimeFieldDef(fieldDef)) {
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
        if (channel === channel_1.X && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fielddef_1.isTimeFieldDef(fieldDef))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQThEO0FBQzlELDJDQUF3RDtBQUN4RCxxQ0FBc0M7QUFDdEMsbUNBQTRDO0FBQzVDLG1DQUEwQztBQUUxQyxvQ0FBK0M7QUFJL0MsZ0JBQXVCLEtBQWdCLEVBQUUsT0FBNEIsRUFBRSxtQkFBd0IsRUFBRSxHQUEyQjtJQUMxSCxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUN0QyxDQUNFLE9BQU8sS0FBSyxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDdEMsT0FBTyxLQUFLLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDdEMsU0FBUyxDQUNWLENBQUM7SUFDSixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFFNUIsSUFBSSxVQUFVLEdBQVEsRUFBRSxDQUFDO0lBRXpCLE9BQU87SUFDUCxFQUFFLENBQUMsQ0FBQyx5QkFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLGlCQUFTLENBQUMsR0FBRyxDQUFDO1FBRWxGLFVBQVUsQ0FBQyxJQUFJLEdBQUk7WUFDakIsTUFBTSxFQUFFLDZCQUFvQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxV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