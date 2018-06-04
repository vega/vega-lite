"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
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
function values(specifiedAxis, model, fieldDef, channel) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && datetime_1.isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return { signal: datetime_1.dateTimeExpr(dt, true) };
        });
    }
    if (!vals && fieldDef.bin && fieldDef.type === type_1.QUANTITATIVE) {
        var domain = model.scaleDomain(channel);
        if (domain && domain !== 'unaggregated' && !scale_1.isSelectionDomain(domain)) { // explicit value
            return vals;
        }
        var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
        return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
    }
    return vals;
}
exports.values = values;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBbUM7QUFFbkMsaUNBQXNDO0FBQ3RDLHlDQUF5RDtBQUV6RCwyQ0FBa0U7QUFDbEUsMkNBQWdFO0FBQ2hFLHFEQUFpQztBQUNqQyxxQ0FBNEU7QUFDNUUsbUNBQXdDO0FBQ3hDLG1DQUFvQztBQUtwQyxpRkFBaUY7QUFDakY7OztHQUdHO0FBQ0gsY0FBcUIsU0FBb0IsRUFBRSxRQUEwQjtJQUNuRSxPQUFPLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3hELENBQUM7QUFGRCxvQkFFQztBQUVELG1CQUEwQixLQUFnQixFQUFFLE9BQTZCO0lBQ3ZFLElBQU0sV0FBVyxHQUF5QixPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN0RSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUN4QyxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBTkQsOEJBTUM7QUFFRCxvQkFBMkIsUUFBMEIsRUFBRSxPQUE2QixFQUFFLGFBQW1CO0lBQ3ZHLElBQUksYUFBYSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7UUFDMUMsT0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxPQUFPLEtBQUssR0FBRyxJQUFJLGVBQVEsQ0FBQyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDNUUsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sU0FB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Q0FBQyxHQUFHLENBQUMsU0FBSSxRQUFRLENBQUMsS0FBSyxVQUFPLENBQUMsQ0FBQztRQUNwRixPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQVksTUFBTSxnQkFBVyxNQUFNLGdCQUFXLE1BQU0sZUFBVSxNQUFNLFdBQVEsRUFBQyxDQUFDO0tBQy9GO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBbkJELHdCQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dHJ1bmNhdGV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7UG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgaXNTZWxlY3Rpb25Eb21haW4sIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5cblxuLy8gVE9ETzogd2UgbmVlZCB0byByZWZhY3RvciB0aGlzIG1ldGhvZCBhZnRlciB3ZSB0YWtlIGNhcmUgb2YgY29uZmlnIHJlZmFjdG9yaW5nXG4vKipcbiAqIERlZmF1bHQgcnVsZXMgZm9yIHdoZXRoZXIgdG8gc2hvdyBhIGdyaWQgc2hvdWxkIGJlIHNob3duIGZvciBhIGNoYW5uZWwuXG4gKiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3Igb3JkaW5hbCBzY2FsZXMgdGhhdCBhcmUgbm90IGJpbm5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JpZChzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgcmV0dXJuICFoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpICYmICFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncmlkU2NhbGUobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwpIHtcbiAgY29uc3QgZ3JpZENoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3knIDogJ3gnO1xuICBpZiAobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoZ3JpZENoYW5uZWwpKSB7XG4gICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShncmlkQ2hhbm5lbCk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsRmx1c2goZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBzcGVjaWZpZWRBeGlzOiBBeGlzKSB7XG4gIGlmIChzcGVjaWZpZWRBeGlzLmxhYmVsRmx1c2ggIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRBeGlzLmxhYmVsRmx1c2g7XG4gIH1cbiAgaWYgKGNoYW5uZWwgPT09ICd4JyAmJiBjb250YWlucyhbJ3F1YW50aXRhdGl2ZScsICd0ZW1wb3JhbCddLCBmaWVsZERlZi50eXBlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYWJlbE92ZXJsYXAoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEF4aXM6IEF4aXMsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICBpZiAoc3BlY2lmaWVkQXhpcy5sYWJlbE92ZXJsYXAgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRBeGlzLmxhYmVsT3ZlcmxhcDtcbiAgfVxuXG4gIC8vIGRvIG5vdCBwcmV2ZW50IG92ZXJsYXAgZm9yIG5vbWluYWwgZGF0YSBiZWNhdXNlIHRoZXJlIGlzIG5vIHdheSB0byBpbmZlciB3aGF0IHRoZSBtaXNzaW5nIGxhYmVscyBhcmVcbiAgaWYgKGZpZWxkRGVmLnR5cGUgIT09ICdub21pbmFsJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4gJ2dyZWVkeSc7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgICByZXR1cm4gJ2JvdHRvbSc7XG4gICAgY2FzZSBZOlxuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuLiAqL1xuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9DSEFOTkVMX0ZPUl9BWElTKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tDb3VudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzaXplOiBWZ1NpZ25hbFJlZikge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgc2NhbGVUeXBlICE9PSAnbG9nJyAmJiAhY29udGFpbnMoWydtb250aCcsICdob3VycycsICdkYXknLCAncXVhcnRlciddLCBmaWVsZERlZi50aW1lVW5pdCkpIHtcblxuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIC8vIGZvciBiaW5uZWQgZGF0YSwgd2UgZG9uJ3Qgd2FudCBtb3JlIHRpY2tzIHRoYW4gbWF4Ymluc1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBjZWlsKCR7c2l6ZS5zaWduYWx9LzIwKWB9O1xuICAgIH1cbiAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vNDApYH07XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUobWF4TGVuZ3RoOiBudW1iZXIsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxuICBjb25zdCBmaWVsZFRpdGxlID0gZmllbGREZWZUaXRsZShmaWVsZERlZiwgY29uZmlnKTtcbiAgcmV0dXJuIG1heExlbmd0aCA/IHRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKHNwZWNpZmllZEF4aXM6IEF4aXMsIG1vZGVsOiBVbml0TW9kZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCB2YWxzID0gc3BlY2lmaWVkQXhpcy52YWx1ZXM7XG4gIGlmIChzcGVjaWZpZWRBeGlzLnZhbHVlcyAmJiBpc0RhdGVUaW1lKHZhbHNbMF0pKSB7XG4gICAgcmV0dXJuICh2YWxzIGFzIERhdGVUaW1lW10pLm1hcCgoZHQpID0+IHtcbiAgICAgIC8vIG5vcm1hbGl6ZSA9IHRydWUgYXMgZW5kIHVzZXIgd29uJ3QgcHV0IDAgPSBKYW51YXJ5XG4gICAgICByZXR1cm4ge3NpZ25hbDogZGF0ZVRpbWVFeHByKGR0LCB0cnVlKX07XG4gICAgfSk7XG4gIH1cblxuICBpZiAoIXZhbHMgJiYgZmllbGREZWYuYmluICYmIGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIGNvbnN0IGRvbWFpbiA9IG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpO1xuICAgIGlmIChkb21haW4gJiYgZG9tYWluICE9PSAndW5hZ2dyZWdhdGVkJyAmJiAhaXNTZWxlY3Rpb25Eb21haW4oZG9tYWluKSkgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgICAgcmV0dXJuIHZhbHM7XG4gICAgfVxuICAgIGNvbnN0IHNpZ25hbCA9IG1vZGVsLmdldE5hbWUoYCR7YmluVG9TdHJpbmcoZmllbGREZWYuYmluKX1fJHtmaWVsZERlZi5maWVsZH1fYmluc2ApO1xuICAgIHJldHVybiB7c2lnbmFsOiBgc2VxdWVuY2UoJHtzaWduYWx9LnN0YXJ0LCAke3NpZ25hbH0uc3RvcCArICR7c2lnbmFsfS5zdGVwLCAke3NpZ25hbH0uc3RlcClgfTtcbiAgfVxuXG4gIHJldHVybiB2YWxzO1xufVxuIl19