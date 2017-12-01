"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var scale_1 = require("../../scale");
var type_1 = require("../../type");
var util_1 = require("../../util");
function domainAndTicks(property, specifiedAxis, isGridAxis, channel) {
    if (isGridAxis) {
        return false;
    }
    return specifiedAxis[property];
}
exports.domainAndTicks = domainAndTicks;
exports.domain = domainAndTicks;
exports.ticks = domainAndTicks;
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
function grid(scaleType, fieldDef) {
    return !scale_1.hasDiscreteDomain(scaleType) && !fieldDef.bin;
}
exports.grid = grid;
function gridScale(model, channel, isGridAxis) {
    if (isGridAxis) {
        var gridChannel = channel === 'x' ? 'y' : 'x';
        if (model.getScaleComponent(gridChannel)) {
            return model.scaleName(gridChannel);
        }
    }
    return undefined;
}
exports.gridScale = gridScale;
function labelFlush(fieldDef, channel, specifiedAxis, isGridAxis) {
    if (isGridAxis) {
        return undefined;
    }
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
function minMaxExtent(specifiedExtent, isGridAxis) {
    if (isGridAxis) {
        // Always return 0 to make sure that `config.axis*.minExtent` and `config.axis*.maxExtent`
        // would not affect gridAxis
        return 0;
    }
    else {
        return specifiedExtent;
    }
}
exports.minMaxExtent = minMaxExtent;
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
    return maxLength ? util_1.truncate(fieldTitle, maxLength) : fieldTitle;
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
function zindex(isGridAxis) {
    if (isGridAxis) {
        // if grid is true, need to put layer on the back so that grid is behind marks
        return 0;
    }
    return 1; // otherwise return undefined and use Vega's default.
}
exports.zindex = zindex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlDQUFzQztBQUN0Qyx5Q0FBeUQ7QUFFekQsMkNBQWtFO0FBQ2xFLDJDQUFnRTtBQUNoRSwrQkFBaUM7QUFDakMscUNBQXlEO0FBQ3pELG1DQUF3QztBQUN4QyxtQ0FBOEM7QUFLOUMsd0JBQStCLFFBQTRCLEVBQUUsYUFBbUIsRUFBRSxVQUFtQixFQUFFLE9BQTZCO0lBQ2xJLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUxELHdDQUtDO0FBRVksUUFBQSxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBQ3hCLFFBQUEsS0FBSyxHQUFHLGNBQWMsQ0FBQztBQUVwQyxpRkFBaUY7QUFDakY7OztHQUdHO0FBQ0gsY0FBcUIsU0FBb0IsRUFBRSxRQUEwQjtJQUNuRSxNQUFNLENBQUMsQ0FBQyx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDeEQsQ0FBQztBQUZELG9CQUVDO0FBRUQsbUJBQTBCLEtBQWdCLEVBQUUsT0FBNkIsRUFBRSxVQUFtQjtJQUM1RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBTSxXQUFXLEdBQXlCLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3RFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENB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QUFRLEVBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFmRCx3QkFlQztBQUVELGdCQUF1QixVQUFtQjtJQUN4QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsOEVBQThFO1FBQzlFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLHFEQUFxRDtBQUNqRSxDQUFDO0FBTkQsd0JBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F4aXN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7UG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCB0cnVuY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpbkFuZFRpY2tzKHByb3BlcnR5OiAnZG9tYWluJyB8ICd0aWNrcycsIHNwZWNpZmllZEF4aXM6IEF4aXMsIGlzR3JpZEF4aXM6IGJvb2xlYW4sIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsKSB7XG4gIGlmIChpc0dyaWRBeGlzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBzcGVjaWZpZWRBeGlzW3Byb3BlcnR5XTtcbn1cblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9IGRvbWFpbkFuZFRpY2tzO1xuZXhwb3J0IGNvbnN0IHRpY2tzID0gZG9tYWluQW5kVGlja3M7XG5cbi8vIFRPRE86IHdlIG5lZWQgdG8gcmVmYWN0b3IgdGhpcyBtZXRob2QgYWZ0ZXIgd2UgdGFrZSBjYXJlIG9mIGNvbmZpZyByZWZhY3RvcmluZ1xuLyoqXG4gKiBEZWZhdWx0IHJ1bGVzIGZvciB3aGV0aGVyIHRvIHNob3cgYSBncmlkIHNob3VsZCBiZSBzaG93biBmb3IgYSBjaGFubmVsLlxuICogSWYgYGdyaWRgIGlzIHVuc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBpcyBgdHJ1ZWAgZm9yIG9yZGluYWwgc2NhbGVzIHRoYXQgYXJlIG5vdCBiaW5uZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdyaWQoc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gIHJldHVybiAhaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSAmJiAhZmllbGREZWYuYmluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JpZFNjYWxlKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBpc0dyaWRBeGlzOiBib29sZWFuKSB7XG4gIGlmIChpc0dyaWRBeGlzKSB7XG4gICAgY29uc3QgZ3JpZENoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsID0gY2hhbm5lbCA9PT0gJ3gnID8gJ3knIDogJ3gnO1xuICAgIGlmIChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChncmlkQ2hhbm5lbCkpIHtcbiAgICAgIHJldHVybiBtb2RlbC5zY2FsZU5hbWUoZ3JpZENoYW5uZWwpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWxGbHVzaChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNwZWNpZmllZEF4aXM6IEF4aXMsIGlzR3JpZEF4aXM6IGJvb2xlYW4pIHtcbiAgaWYgKGlzR3JpZEF4aXMpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaDtcbiAgfVxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnICYmIGNvbnRhaW5zKFsncXVhbnRpdGF0aXZlJywgJ3RlbXBvcmFsJ10sIGZpZWxkRGVmLnR5cGUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsT3ZlcmxhcChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gIGlmIChzcGVjaWZpZWRBeGlzLmxhYmVsT3ZlcmxhcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxPdmVybGFwO1xuICB9XG5cbiAgLy8gZG8gbm90IHByZXZlbnQgb3ZlcmxhcCBmb3Igbm9taW5hbCBkYXRhIGJlY2F1c2UgdGhlcmUgaXMgbm8gd2F5IHRvIGluZmVyIHdoYXQgdGhlIG1pc3NpbmcgbGFiZWxzIGFyZVxuICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ25vbWluYWwnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiAnZ3JlZWR5JztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWluTWF4RXh0ZW50KHNwZWNpZmllZEV4dGVudDogbnVtYmVyLCBpc0dyaWRBeGlzOiBib29sZWFuKSB7XG4gIGlmIChpc0dyaWRBeGlzKSB7XG4gICAgLy8gQWx3YXlzIHJldHVybiAwIHRvIG1ha2Ugc3VyZSB0aGF0IGBjb25maWcuYXhpcyoubWluRXh0ZW50YCBhbmQgYGNvbmZpZy5heGlzKi5tYXhFeHRlbnRgXG4gICAgLy8gd291bGQgbm90IGFmZmVjdCBncmlkQXhpc1xuICAgIHJldHVybiAwO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzcGVjaWZpZWRFeHRlbnQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9yaWVudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIFg6XG4gICAgICByZXR1cm4gJ2JvdHRvbSc7XG4gICAgY2FzZSBZOlxuICAgICAgcmV0dXJuICdsZWZ0JztcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuLiAqL1xuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuSU5WQUxJRF9DSEFOTkVMX0ZPUl9BWElTKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2tDb3VudChjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzaXplOiBWZ1NpZ25hbFJlZikge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgc2NhbGVUeXBlICE9PSAnbG9nJyAmJiAhY29udGFpbnMoWydtb250aCcsICdob3VycycsICdkYXknLCAncXVhcnRlciddLCBmaWVsZERlZi50aW1lVW5pdCkpIHtcblxuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIC8vIGZvciBiaW5uZWQgZGF0YSwgd2UgZG9uJ3Qgd2FudCBtb3JlIHRpY2tzIHRoYW4gbWF4Ymluc1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBjZWlsKCR7c2l6ZS5zaWduYWx9LzIwKWB9O1xuICAgIH1cbiAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vNDApYH07XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGUobWF4TGVuZ3RoOiBudW1iZXIsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICAvLyBpZiBub3QgZGVmaW5lZCwgYXV0b21hdGljYWxseSBkZXRlcm1pbmUgYXhpcyB0aXRsZSBmcm9tIGZpZWxkIGRlZlxuICBjb25zdCBmaWVsZFRpdGxlID0gZmllbGREZWZUaXRsZShmaWVsZERlZiwgY29uZmlnKTtcbiAgcmV0dXJuIG1heExlbmd0aCA/IHRydW5jYXRlKGZpZWxkVGl0bGUsIG1heExlbmd0aCkgOiBmaWVsZFRpdGxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKHNwZWNpZmllZEF4aXM6IEF4aXMsIG1vZGVsOiBVbml0TW9kZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gIGNvbnN0IHZhbHMgPSBzcGVjaWZpZWRBeGlzLnZhbHVlcztcbiAgaWYgKHNwZWNpZmllZEF4aXMudmFsdWVzICYmIGlzRGF0ZVRpbWUodmFsc1swXSkpIHtcbiAgICByZXR1cm4gKHZhbHMgYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgLy8gbm9ybWFsaXplID0gdHJ1ZSBhcyBlbmQgdXNlciB3b24ndCBwdXQgMCA9IEphbnVhcnlcbiAgICAgIHJldHVybiB7c2lnbmFsOiBkYXRlVGltZUV4cHIoZHQsIHRydWUpfTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICghdmFscyAmJiBmaWVsZERlZi5iaW4gJiYgZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgY29uc3Qgc2lnbmFsID0gbW9kZWwuZ2V0TmFtZShgJHtiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pfV8ke2ZpZWxkRGVmLmZpZWxkfV9iaW5zYCk7XG4gICAgcmV0dXJuIHtzaWduYWw6IGBzZXF1ZW5jZSgke3NpZ25hbH0uc3RhcnQsICR7c2lnbmFsfS5zdG9wICsgJHtzaWduYWx9LnN0ZXAsICR7c2lnbmFsfS5zdGVwKWB9O1xuICB9XG5cbiAgcmV0dXJuIHZhbHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB6aW5kZXgoaXNHcmlkQXhpczogYm9vbGVhbikge1xuICBpZiAoaXNHcmlkQXhpcykge1xuICAgIC8vIGlmIGdyaWQgaXMgdHJ1ZSwgbmVlZCB0byBwdXQgbGF5ZXIgb24gdGhlIGJhY2sgc28gdGhhdCBncmlkIGlzIGJlaGluZCBtYXJrc1xuICAgIHJldHVybiAwO1xuICB9XG4gIHJldHVybiAxOyAvLyBvdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgdXNlIFZlZ2EncyBkZWZhdWx0LlxufVxuIl19