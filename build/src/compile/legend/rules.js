"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function title(legend, fieldDef, config) {
    if (legend.title !== undefined) {
        return legend.title;
    }
    return fielddef_1.title(fieldDef, config);
}
exports.title = title;
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
function type(legend, type, channel, scaleType) {
    if (legend.type) {
        return legend.type;
    }
    if (channel === channel_1.COLOR && ((type === 'quantitative' && !scale_1.isBinScale(scaleType)) ||
        (type === 'temporal' && util_1.contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBNkM7QUFFN0MsMkNBQWtFO0FBRWxFLDJDQUFtRDtBQUVuRCxxQ0FBa0Q7QUFFbEQsbUNBQW9DO0FBR3BDLGVBQXNCLE1BQWMsRUFBRSxRQUEwQixFQUFFLE1BQWM7SUFDOUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsZ0JBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQU5ELHNCQU1DO0FBRUQsZ0JBQXVCLE1BQWM7SUFDbkMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFFLElBQW1CLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRTtZQUNqQyxxREFBcUQ7WUFDckQsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLHVCQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFURCx3QkFTQztBQUVELGNBQXFCLE1BQWMsRUFBRSxJQUFVLEVBQUUsT0FBZ0IsRUFBRSxTQUFvQjtJQUNyRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQ0MsT0FBTyxLQUFLLGVBQUssSUFBSSxDQUNuQixDQUFDLElBQUksS0FBSyxjQUFjLElBQUksQ0FBQyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxlQUFRLENBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FFNUUsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFiRCxvQkFhQyJ9