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
                    (channel === channel_1.X) ? 'right' :
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
            labelsSpec.baseline = { value: (channel === channel_1.X) ? 'middle' : 'bottom' };
        }
        else if (labelsSpec.angle.value === 90) {
            labelsSpec.baseline = { value: 'bottom' };
        }
    }
    return util_1.keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}
exports.labels = labels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9lbmNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsbUNBQXNEO0FBQ3RELG1DQUFrRDtBQUdsRCxvQ0FBK0M7QUFHL0MsZ0JBQXVCLEtBQWdCLEVBQUUsT0FBZ0IsRUFBRSxVQUFlLEVBQUUsR0FBVztJQUNyRixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUU1QixPQUFPO0lBQ1AsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxlQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9CLFVBQVUsR0FBRyxhQUFNLENBQUM7WUFDbEIsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSw2QkFBb0IsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDNUg7U0FDRixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxjQUFjO0lBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBQyxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLG9CQUFvQjtRQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssV0FBQyxJQUFJLENBQUMsZUFBUSxDQUFDLENBQUMsY0FBTyxFQUFFLGNBQU8sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuSCxVQUFVLENBQUMsS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLDZDQUE2QztJQUM3QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25DLFVBQVUsQ0FBQyxLQUFLLEdBQUc7Z0JBQ2pCLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxLQUFLLEtBQUssR0FBRyxNQUFNO29CQUM1QixDQUFDLE9BQU8sS0FBSyxXQUFDLENBQUMsR0FBRyxPQUFPO3dCQUN6QixRQUFRO2FBQ2pCLENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsVUFBVSxDQUFDLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUN2QyxDQUFDO0lBQ0gsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLCtCQUErQjtRQUMvQiw2Q0FBNkM7UUFDN0MsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQyxVQUFVLENBQUMsUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxLQUFLLFdBQUMsQ0FBQyxHQUFHLFFBQVEsR0FBRyxRQUFRLEVBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsVUFBVSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQztRQUMxQyxDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ2hFLENBQUM7QUFqREQsd0JBaURDIn0=