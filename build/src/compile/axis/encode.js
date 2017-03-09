"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
function labels(model, channel, labelsSpec, def) {
    var fieldDef = model.fieldDef(channel);
    var axis = model.axis(channel);
    var config = model.config;
    // Text
    if (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) && axis.labelMaxLength) {
        // TODO replace this with Vega's labelMaxLength once it is introduced
        labelsSpec = util_1.extend({
            text: {
                signal: "truncate(datum.value, " + axis.labelMaxLength + ")"
            }
        }, labelsSpec || {});
    }
    else if (fieldDef.type === type_1.TEMPORAL) {
        labelsSpec = util_1.extend({
            text: {
                signal: common_1.timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat)
            }
        }, labelsSpec);
    }
    // Label Angle
    if (axis.labelAngle !== undefined) {
        labelsSpec.angle = { value: axis.labelAngle };
    }
    else {
        // auto rotate for X
        if (channel === channel_1.X && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === type_1.TEMPORAL)) {
            labelsSpec.angle = { value: 270 };
        }
    }
    // Auto set align if rotated
    // TODO: consider other value besides 270, 90
    if (labelsSpec.angle) {
        if (labelsSpec.angle.value === 270) {
            labelsSpec.align = {
                value: def.orient === 'top' ? 'left' :
                    (channel === channel_1.X || channel === channel_1.COLUMN) ? 'right' :
                        'center'
            };
        }
        else if (labelsSpec.angle.value === 90) {
            labelsSpec.align = { value: 'center' };
        }
    }
    if (labelsSpec.angle) {
        // Auto set baseline if rotated
        // TODO: consider other value besides 270, 90
        if (labelsSpec.angle.value === 270) {
            labelsSpec.baseline = { value: (channel === channel_1.X || channel === channel_1.COLUMN) ? 'middle' : 'bottom' };
        }
        else if (labelsSpec.angle.value === 90) {
            labelsSpec.baseline = { value: 'bottom' };
        }
    }
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUQ7QUFDakQsbUNBQXNEO0FBQ3RELG1DQUFrRDtBQUdsRCxvQ0FBK0M7QUFHL0MsZ0JBQXVCLEtBQVksRUFBRSxPQUFnQixFQUFFLFVBQWUsRUFBRSxHQUFXO0lBQ2pGLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBRTVCLE9BQU87SUFDUCxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxjQUFPLEVBQUUsY0FBTyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLHFFQUFxRTtRQUNyRSxVQUFVLEdBQUcsYUFBTSxDQUFDO1lBQ2xCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsMkJBQXlCLElBQUksQ0FBQyxjQUFjLE1BQUc7YUFDeEQ7U0FDRixFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDLENBQUMsQ0FBQztRQUN0QyxVQUFVLEdBQUcsYUFBTSxDQUFDO1lBQ2xCLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsNkJBQW9CLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQzVIO1NBQ0YsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQsY0FBYztJQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNsQyxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixvQkFBb0I7UUFDcEIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFdBQUMsSUFBSSxDQUFDLGVBQVEsQ0FBQyxDQUFDLGNBQU8sRUFBRSxjQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxlQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkgsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0gsQ0FBQztJQUVELDRCQUE0QjtJQUM1Qiw2Q0FBNkM7SUFDN0MsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQyxVQUFVLENBQUMsS0FBSyxHQUFHO2dCQUNqQixLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sS0FBSyxLQUFLLEdBQUcsTUFBTTtvQkFDNUIsQ0FBQyxPQUFPLEtBQUssV0FBQyxJQUFJLE9BQU8sS0FBSyxnQkFBTSxDQUFDLEdBQUcsT0FBTzt3QkFDL0MsUUFBUTthQUNqQixDQUFDO1FBQ0osQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQiwrQkFBK0I7UUFDL0IsNkNBQTZDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsVUFBVSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sS0FBSyxXQUFDLElBQUksT0FBTyxLQUFLLGdCQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsUUFBUSxFQUFDLENBQUM7UUFDN0YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUM7UUFDMUMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsV0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztBQUNoRSxDQUFDO0FBeERELHdCQXdEQyJ9