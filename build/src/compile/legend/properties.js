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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wcm9wZXJ0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQTZDO0FBQzdDLDJDQUFrRTtBQUVsRSxxQ0FBa0Q7QUFFbEQsbUNBQW9DO0FBRXBDLGdCQUF1QixNQUFjO0lBQ25DLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLHFCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBRSxJQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQUU7WUFDakMscURBQXFEO1lBQ3JELE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSx1QkFBWSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVEQsd0JBU0M7QUFFRCxjQUFxQixJQUFVLEVBQUUsT0FBZ0IsRUFBRSxTQUFvQjtJQUNyRSxFQUFFLENBQUMsQ0FDQyxPQUFPLEtBQUssZUFBSyxJQUFJLENBQ25CLENBQUMsSUFBSSxLQUFLLGNBQWMsSUFBSSxDQUFDLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLGVBQVEsQ0FBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUU1RSxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVZELG9CQVVDIn0=