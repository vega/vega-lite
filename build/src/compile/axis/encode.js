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
    if (fieldDef.type === type_1.TEMPORAL) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUQ7QUFDakQsbUNBQXNEO0FBQ3RELG1DQUFrRDtBQUdsRCxvQ0FBK0M7QUFHL0MsZ0JBQXVCLEtBQVksRUFBRSxPQUFnQixFQUFFLFVBQWUsRUFBRSxHQUFXO0lBQ2pGLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBRTVCLE9BQU87SUFDUCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0IsVUFBVSxHQUFHLGFBQU0sQ0FBQztZQUNsQixJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLDZCQUFvQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUM1SDtTQUNGLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELGNBQWM7SUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sb0JBQW9CO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxXQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsQ0FBQyxjQUFPLEVBQUUsY0FBTyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssZUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ILFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUM7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsNkNBQTZDO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsVUFBVSxDQUFDLEtBQUssR0FBRztnQkFDakIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEtBQUssS0FBSyxHQUFHLE1BQU07b0JBQzVCLENBQUMsT0FBTyxLQUFLLFdBQUMsSUFBSSxPQUFPLEtBQUssZ0JBQU0sQ0FBQyxHQUFHLE9BQU87d0JBQy9DLFFBQVE7YUFDakIsQ0FBQztRQUNKLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQ3ZDLENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDckIsK0JBQStCO1FBQy9CLDZDQUE2QztRQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEtBQUssV0FBQyxJQUFJLE9BQU8sS0FBSyxnQkFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLFFBQVEsRUFBQyxDQUFDO1FBQzdGLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6QyxVQUFVLENBQUMsUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBQzFDLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDaEUsQ0FBQztBQWpERCx3QkFpREMifQ==