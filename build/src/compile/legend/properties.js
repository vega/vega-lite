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
function type(t, channel, scaleType) {
    if (channel_1.isColorChannel(channel) && ((t === 'quantitative' && !scale_1.isBinScale(scaleType)) ||
        (t === 'temporal' && util_1.contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
exports.type = type;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2xlZ2VuZC9wcm9wZXJ0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXNEO0FBQ3RELDJDQUFrRTtBQUVsRSxxQ0FBa0Q7QUFFbEQsbUNBQW9DO0FBRXBDLGdCQUF1QixNQUFjO0lBQ25DLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxJQUFJLElBQUkscUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMvQixPQUFRLElBQW1CLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRTtZQUNqQyxxREFBcUQ7WUFDckQsT0FBTyxFQUFDLE1BQU0sRUFBRSx1QkFBWSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFURCx3QkFTQztBQUVELGNBQXFCLENBQU8sRUFBRSxPQUFnQixFQUFFLFNBQW9CO0lBQ2xFLElBQ0ksd0JBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUN6QixDQUFDLENBQUMsS0FBSyxjQUFjLElBQUksQ0FBQyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxLQUFLLFVBQVUsSUFBSSxlQUFRLENBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDdEUsRUFDRDtRQUNGLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVZELG9CQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBpc0NvbG9yQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7TGVnZW5kfSBmcm9tICcuLi8uLi9sZWdlbmQnO1xuaW1wb3J0IHtpc0JpblNjYWxlLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7VHlwZX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlcyhsZWdlbmQ6IExlZ2VuZCkge1xuICBjb25zdCB2YWxzID0gbGVnZW5kLnZhbHVlcztcbiAgaWYgKHZhbHMgJiYgaXNEYXRlVGltZSh2YWxzWzBdKSkge1xuICAgIHJldHVybiAodmFscyBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgPSB0cnVlIGFzIGVuZCB1c2VyIHdvbid0IHB1dCAwID0gSmFudWFyeVxuICAgICAgcmV0dXJuIHtzaWduYWw6IGRhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB2YWxzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZSh0OiBUeXBlLCBjaGFubmVsOiBDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6ICdncmFkaWVudCcge1xuICBpZiAoXG4gICAgICBpc0NvbG9yQ2hhbm5lbChjaGFubmVsKSAmJiAoXG4gICAgICAgICh0ID09PSAncXVhbnRpdGF0aXZlJyAmJiAhaXNCaW5TY2FsZShzY2FsZVR5cGUpKSB8fFxuICAgICAgICAodCA9PT0gJ3RlbXBvcmFsJyAmJiBjb250YWluczxTY2FsZVR5cGU+KFsndGltZScsICd1dGMnXSwgc2NhbGVUeXBlKSlcbiAgICAgIClcbiAgICApIHtcbiAgICByZXR1cm4gJ2dyYWRpZW50JztcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIl19