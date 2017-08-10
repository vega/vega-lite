"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function values(legend) {
    var vals = legend.values;
    if (vals && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return { signal: datetime_1.dateTimeExpr(dt, true) };
        });
    }
    return vals;
}
exports.values = values;
function type(type, channel, scaleType) {
    if (channel === channel_1.COLOR && ((type === 'quantitative' && !scale_1.isBinScale(scaleType)) ||
        (type === 'temporal' && util_1.contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBNkM7QUFFN0MsMkNBQWtFO0FBSWxFLHFDQUFrRDtBQUVsRCxtQ0FBb0M7QUFFcEMsZ0JBQXVCLE1BQWM7SUFDbkMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFFLElBQW1CLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRTtZQUNqQyxxREFBcUQ7WUFDckQsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLHVCQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFURCx3QkFTQztBQUVELGNBQXFCLElBQVUsRUFBRSxPQUFnQixFQUFFLFNBQW9CO0lBQ3JFLEVBQUUsQ0FBQyxDQUNDLE9BQU8sS0FBSyxlQUFLLElBQUksQ0FDbkIsQ0FBQyxJQUFJLEtBQUssY0FBYyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksZUFBUSxDQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBRTVFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBVkQsb0JBVUMifQ==