"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function grid(scaleType, fieldDef) {
    return !scale_1.hasDiscreteDomain(scaleType) && !fieldDef.bin;
}
exports.grid = grid;
function gridScale(model, channel) {
    var gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
exports.gridScale = gridScale;
function labelFlush(fieldDef, channel, specifiedAxis) {
    if (specifiedAxis.labelFlush !== undefined) {
        return specifiedAxis.labelFlush;
    }
    if (channel === 'x' && util_1.contains(['quantitative', 'temporal'], fieldDef.type)) {
        return true;
    }
    return undefined;
}
exports.labelFlush = labelFlush;
function labelOverlap(fieldDef, specifiedAxis, channel, scaleType) {
    if (specifiedAxis.labelOverlap !== undefined) {
        return specifiedAxis.labelOverlap;
    }
    // do not prevent overlap for nominal data because there is no way to infer what the missing labels are
    if (fieldDef.type !== 'nominal') {
        if (scaleType === 'log') {
            return 'greedy';
        }
        return true;
    }
    return undefined;
}
exports.labelOverlap = labelOverlap;
function orient(channel) {
    switch (channel) {
        case channel_1.X:
            return 'bottom';
        case channel_1.Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
exports.orient = orient;
function tickCount(channel, fieldDef, scaleType, size) {
    if (!scale_1.hasDiscreteDomain(scaleType) && scaleType !== 'log' && !util_1.contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (fieldDef.bin) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: "ceil(" + size.signal + "/20)" };
        }
        return { signal: "ceil(" + size.signal + "/40)" };
    }
    return undefined;
}
exports.tickCount = tickCount;
function title(maxLength, fieldDef, config) {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fielddef_1.title(fieldDef, config);
    return maxLength ? vega_util_1.truncate(fieldTitle, maxLength) : fieldTitle;
}
exports.title = title;
function values(specifiedAxis, model, fieldDef) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return { signal: datetime_1.dateTimeExpr(dt, true) };
        });
    }
    if (!vals && fieldDef.bin && fieldDef.type === type_1.QUANTITATIVE) {
        var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
        return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
    }
    return vals;
}
exports.values = values;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUVuQyxpQ0FBc0M7QUFDdEMseUNBQXlEO0FBRXpELDJDQUFrRTtBQUNsRSwyQ0FBZ0U7QUFDaEUsK0JBQWlDO0FBQ2pDLHFDQUF5RDtBQUN6RCxtQ0FBd0M7QUFDeEMsbUNBQW9DO0FBS3BDLGlGQUFpRjtBQUNqRjs7O0dBR0c7QUFDSCxjQUFxQixTQUFvQixFQUFFLFFBQTBCO0lBQ25FLE1BQU0sQ0FBQyxDQUFDLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztBQUN4RCxDQUFDO0FBRkQsb0JBRUM7QUFFRCxtQkFBMEIsS0FBZ0IsRUFBRSxPQUE2QjtJQUN2RSxJQUFNLFdBQVcsR0FBeUIsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDdEUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBTkQsOEJBTUM7QUFFRCxvQkFBMkIsUUFBMEIsRUFBRSxPQUE2QixFQUFFLGFBQW1CO0lBQ3ZHLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEdBQUcsSUFBSSxlQUFRLENBQUMsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQVJELGdDQVFDO0FBRUQsc0JBQTZCLFFBQTBCLEVBQUUsYUFBbUIsRUFBRSxPQUE2QixFQUFFLFNBQW9CO0lBQy9ILEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztJQUNwQyxDQUFDO0lBRUQsdUdBQXVHO0lBQ3ZHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQWRELG9DQWNDO0FBRUQsZ0JBQXVCLE9BQTZCO0lBQ2xELE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxXQUFDO1lBQ0osTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNsQixLQUFLLFdBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDRCxxREFBcUQ7SUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDeEQsQ0FBQztBQVRELHdCQVNDO0FBRUQsbUJBQTBCLE9BQTZCLEVBQUUsUUFBMEIsRUFBRSxTQUFvQixFQUFFLElBQWlCO0lBQzFILEVBQUUsQ0FBQyxDQUFDLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxLQUFLLEtBQUssSUFBSSxDQUFDLGVBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0gsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIseURBQXlEO1lBQ3pELE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxVQUFRLElBQUksQ0FBQyxNQUFNLFNBQU0sRUFBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsVUFBUSxJQUFJLENBQUMsTUFBTSxTQUFNLEVBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBWEQsOEJBV0M7QUFFRCxlQUFzQixTQUFpQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUNqRixvRUFBb0U7SUFDcEUsSUFBTSxVQUFVLEdBQUcsZ0JBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQVEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNsRSxDQUFDO0FBSkQsc0JBSUM7QUFFRCxnQkFBdUIsYUFBbUIsRUFBRSxLQUFnQixFQUFFLFFBQTBCO0lBQ3RGLElBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDbEMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxxQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUUsSUFBbUIsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFO1lBQ2pDLHFEQUFxRDtZQUNyRCxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsdUJBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBSSxpQkFBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBSSxRQUFRLENBQUMsS0FBSyxVQUFPLENBQUMsQ0FBQztRQUNwRixNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsY0FBWSxNQUFNLGdCQUFXLE1BQU0sZ0JBQVcsTUFBTSxlQUFVLE1BQU0sV0FBUSxFQUFDLENBQUM7SUFDaEcsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBZkQsd0JBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3RydW5jYXRlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtBeGlzfSBmcm9tICcuLi8uLi9heGlzJztcbmltcG9ydCB7YmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge1Bvc2l0aW9uU2NhbGVDaGFubmVsLCBYLCBZfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtEYXRlVGltZSwgZGF0ZVRpbWVFeHByLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmLCB0aXRsZSBhcyBmaWVsZERlZlRpdGxlfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW4sIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5cblxuLy8gVE9ETzogd2UgbmVlZCB0byByZWZhY3RvciB0aGlzIG1ldGhvZCBhZnRlciB3ZSB0YWtlIGNhcmUgb2YgY29uZmlnIHJlZmFjdG9yaW5nXG4vKipcbiAqIERlZmF1bHQgcnVsZXMgZm9yIHdoZXRoZXIgdG8gc2hvdyBhIGdyaWQgc2hvdWxkIGJlIHNob3duIGZvciBhIGNoYW5uZWwuXG4gKiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3Igb3JkaW5hbCBzY2FsZXMgdGhhdCBhcmUgbm90IGJpbm5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JpZChzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgcmV0dXJuICFoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpICYmICFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncmlkU2NhbGUobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwpIHtcbiAgY29uc3QgZ3JpZENoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3knIDogJ3gnO1xuICBpZiAobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoZ3JpZENoYW5uZWwpKSB7XG4gICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShncmlkQ2hhbm5lbCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsRmx1c2goZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBzcGVjaWZpZWRBeGlzOiBBeGlzKSB7XG4gIGlmIChzcGVjaWZpZWRBeGlzLmxhYmVsRmx1c2ggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRBeGlzLmxhYmVsRmx1c2g7XG4gIH1cbiAgaWYgKGNoYW5uZWwgPT09ICd4JyAmJiBjb250YWlucyhbJ3F1YW50aXRhdGl2ZScsICd0ZW1wb3JhbCddLCBmaWVsZERlZi50eXBlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYWJlbE92ZXJsYXAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEF4aXM6IEF4aXMsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICBpZiAoc3BlY2lmaWVkQXhpcy5sYWJlbE92ZXJsYXAgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRBeGlzLmxhYmVsT3ZlcmxhcDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBwcmV2ZW50IG92ZXJsYXAgZm9yIG5vbWluYWwgZGF0YSBiZWNhdXNlIHRoZXJlIGlzIG5vIHdheSB0byBpbmZlciB3aGF0IHRoZSBtaXNzaW5nIGxhYmVscyBhcmVcbiAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdub21pbmFsJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4gJ2dyZWVkeSc7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgICByZXR1cm4gJ2JvdHRvbSc7XG4gICAgY2FzZSBZOlxuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuLiAqL1xuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9DSEFOTkVMX0ZPUl9BWElTKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tDb3VudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzaXplOiBWZ1NpZ25hbFJlZikge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgc2NhbGVUeXBlICE9PSAnbG9nJyAmJiAhY29udGFpbnMoWydtb250aCcsICdob3VycycsICdkYXknLCAncXVhcnRlciddLCBmaWVsZERlZi50aW1lVW5pdCkpIHtcblxuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIC8vIGZvciBiaW5uZWQgZGF0YSwgd2UgZG9uJ3Qgd2FudCBtb3JlIHRpY2tzIHRoYW4gbWF4Ymluc1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBjZWlsKCR7c2l6ZS5zaWduYWx9LzIwKWB9O1xuICAgIH1cbiAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vNDApYH07XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUobWF4TGVuZ3RoOiBudW1iZXIsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxuICBjb25zdCBmaWVsZFRpdGxlID0gZmllbGREZWZUaXRsZShmaWVsZERlZiwgY29uZmlnKTtcbiAgcmV0dXJuIG1heExlbmd0aCA/IHRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKHNwZWNpZmllZEF4aXM6IEF4aXMsIG1vZGVsOiBVbml0TW9kZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gIGNvbnN0IHZhbHMgPSBzcGVjaWZpZWRBeGlzLnZhbHVlcztcbiAgaWYgKHNwZWNpZmllZEF4aXMudmFsdWVzICYmIGlzRGF0ZVRpbWUodmFsc1swXSkpIHtcbiAgICByZXR1cm4gKHZhbHMgYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgLy8gbm9ybWFsaXplID0gdHJ1ZSBhcyBlbmQgdXNlciB3b24ndCBwdXQgMCA9IEphbnVhcnlcbiAgICAgIHJldHVybiB7c2lnbmFsOiBkYXRlVGltZUV4cHIoZHQsIHRydWUpfTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghdmFscyAmJiBmaWVsZERlZi5iaW4gJiYgZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgY29uc3Qgc2lnbmFsID0gbW9kZWwuZ2V0TmFtZShgJHtiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pfV8ke2ZpZWxkRGVmLmZpZWxkfV9iaW5zYCk7XG4gICAgcmV0dXJuIHtzaWduYWw6IGBzZXF1ZW5jZSgke3NpZ25hbH0uc3RhcnQsICR7c2lnbmFsfS5zdG9wICsgJHtzaWduYWx9LnN0ZXAsICR7c2lnbmFsfS5zdGVwKWB9O1xuICB9XG5cbiAgcmV0dXJuIHZhbHM7XG59XG4iXX0=