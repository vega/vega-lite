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
function zindex(isGridAxis) {
    if (isGridAxis) {
        // if grid is true, need to put layer on the back so that grid is behind marks
        return 0;
    }
    return 1; // otherwise return undefined and use Vega's default.
}
exports.zindex = zindex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUVuQyxpQ0FBc0M7QUFDdEMseUNBQXlEO0FBRXpELDJDQUFrRTtBQUNsRSwyQ0FBZ0U7QUFDaEUsK0JBQWlDO0FBQ2pDLHFDQUF5RDtBQUN6RCxtQ0FBd0M7QUFDeEMsbUNBQW9DO0FBS3BDLHdCQUErQixRQUE0QixFQUFFLGFBQW1CLEVBQUUsVUFBbUIsRUFBRSxPQUE2QjtJQUNsSSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFMRCx3Q0FLQztBQUVZLFFBQUEsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUN4QixRQUFBLEtBQUssR0FBRyxjQUFjLENBQUM7QUFFcEMsaUZBQWlGO0FBQ2pGOzs7R0FHRztBQUNILGNBQXFCLFNBQW9CLEVBQUUsUUFBMEI7SUFDbkUsTUFBTSxDQUFDLENBQUMseUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3hELENBQUM7QUFGRCxvQkFFQztBQUVELG1CQUEwQixLQUFnQixFQUFFLE9BQTZCLEVBQUUsVUFBbUI7SUFDNUYsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLElBQU0sV0FBVyxHQUF5QixPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN0RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxLQUFL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QU0sZUFBVSxNQUFNLFdBQVEsRUFBQyxDQUFDO0lBQ2hHLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWZELHdCQWVDO0FBRUQsZ0JBQXVCLFVBQW1CO0lBQ3hDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZiw4RUFBOEU7UUFDOUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMscURBQXFEO0FBQ2pFLENBQUM7QUFORCx3QkFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dHJ1bmNhdGV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7UG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluQW5kVGlja3MocHJvcGVydHk6ICdkb21haW4nIHwgJ3RpY2tzJywgc3BlY2lmaWVkQXhpczogQXhpcywgaXNHcmlkQXhpczogYm9vbGVhbiwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwpIHtcbiAgaWYgKGlzR3JpZEF4aXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHNwZWNpZmllZEF4aXNbcHJvcGVydHldO1xufVxuXG5leHBvcnQgY29uc3QgZG9tYWluID0gZG9tYWluQW5kVGlja3M7XG5leHBvcnQgY29uc3QgdGlja3MgPSBkb21haW5BbmRUaWNrcztcblxuLy8gVE9ETzogd2UgbmVlZCB0byByZWZhY3RvciB0aGlzIG1ldGhvZCBhZnRlciB3ZSB0YWtlIGNhcmUgb2YgY29uZmlnIHJlZmFjdG9yaW5nXG4vKipcbiAqIERlZmF1bHQgcnVsZXMgZm9yIHdoZXRoZXIgdG8gc2hvdyBhIGdyaWQgc2hvdWxkIGJlIHNob3duIGZvciBhIGNoYW5uZWwuXG4gKiBJZiBgZ3JpZGAgaXMgdW5zcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHZhbHVlIGlzIGB0cnVlYCBmb3Igb3JkaW5hbCBzY2FsZXMgdGhhdCBhcmUgbm90IGJpbm5lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ3JpZChzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgcmV0dXJuICFoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpICYmICFmaWVsZERlZi5iaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBncmlkU2NhbGUobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIGlzR3JpZEF4aXM6IGJvb2xlYW4pIHtcbiAgaWYgKGlzR3JpZEF4aXMpIHtcbiAgICBjb25zdCBncmlkQ2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAneScgOiAneCc7XG4gICAgaWYgKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGdyaWRDaGFubmVsKSkge1xuICAgICAgcmV0dXJuIG1vZGVsLnNjYWxlTmFtZShncmlkQ2hhbm5lbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYWJlbEZsdXNoKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgc3BlY2lmaWVkQXhpczogQXhpcywgaXNHcmlkQXhpczogYm9vbGVhbikge1xuICBpZiAoaXNHcmlkQXhpcykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoc3BlY2lmaWVkQXhpcy5sYWJlbEZsdXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkQXhpcy5sYWJlbEZsdXNoO1xuICB9XG4gIGlmIChjaGFubmVsID09PSAneCcgJiYgY29udGFpbnMoWydxdWFudGl0YXRpdmUnLCAndGVtcG9yYWwnXSwgZmllbGREZWYudHlwZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWxPdmVybGFwKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRBeGlzOiBBeGlzLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgaWYgKHNwZWNpZmllZEF4aXMubGFiZWxPdmVybGFwICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkQXhpcy5sYWJlbE92ZXJsYXA7XG4gIH1cblxuICAvLyBkbyBub3QgcHJldmVudCBvdmVybGFwIGZvciBub21pbmFsIGRhdGEgYmVjYXVzZSB0aGVyZSBpcyBubyB3YXkgdG8gaW5mZXIgd2hhdCB0aGUgbWlzc2luZyBsYWJlbHMgYXJlXG4gIGlmIChmaWVsZERlZi50eXBlICE9PSAnbm9taW5hbCcpIHtcbiAgICBpZiAoc2NhbGVUeXBlID09PSAnbG9nJykge1xuICAgICAgcmV0dXJuICdncmVlZHknO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW5NYXhFeHRlbnQoc3BlY2lmaWVkRXh0ZW50OiBudW1iZXIsIGlzR3JpZEF4aXM6IGJvb2xlYW4pIHtcbiAgaWYgKGlzR3JpZEF4aXMpIHtcbiAgICAvLyBBbHdheXMgcmV0dXJuIDAgdG8gbWFrZSBzdXJlIHRoYXQgYGNvbmZpZy5heGlzKi5taW5FeHRlbnRgIGFuZCBgY29uZmlnLmF4aXMqLm1heEV4dGVudGBcbiAgICAvLyB3b3VsZCBub3QgYWZmZWN0IGdyaWRBeGlzXG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEV4dGVudDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsKSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICAgIHJldHVybiAnYm90dG9tJztcbiAgICBjYXNlIFk6XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4uICovXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5JTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja0NvdW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNpemU6IFZnU2lnbmFsUmVmKSB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSAmJiBzY2FsZVR5cGUgIT09ICdsb2cnICYmICFjb250YWlucyhbJ21vbnRoJywgJ2hvdXJzJywgJ2RheScsICdxdWFydGVyJ10sIGZpZWxkRGVmLnRpbWVVbml0KSkge1xuXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgLy8gZm9yIGJpbm5lZCBkYXRhLCB3ZSBkb24ndCB3YW50IG1vcmUgdGlja3MgdGhhbiBtYXhiaW5zXG4gICAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vMjApYH07XG4gICAgfVxuICAgIHJldHVybiB7c2lnbmFsOiBgY2VpbCgke3NpemUuc2lnbmFsfS80MClgfTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtYXhMZW5ndGg6IG51bWJlciwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gIGNvbnN0IGZpZWxkVGl0bGUgPSBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCBjb25maWcpO1xuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoc3BlY2lmaWVkQXhpczogQXhpcywgbW9kZWw6IFVuaXRNb2RlbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgY29uc3QgdmFscyA9IHNwZWNpZmllZEF4aXMudmFsdWVzO1xuICBpZiAoc3BlY2lmaWVkQXhpcy52YWx1ZXMgJiYgaXNEYXRlVGltZSh2YWxzWzBdKSkge1xuICAgIHJldHVybiAodmFscyBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgPSB0cnVlIGFzIGVuZCB1c2VyIHdvbid0IHB1dCAwID0gSmFudWFyeVxuICAgICAgcmV0dXJuIHtzaWduYWw6IGRhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9O1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCF2YWxzICYmIGZpZWxkRGVmLmJpbiAmJiBmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICByZXR1cm4ge3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH07XG4gIH1cblxuICByZXR1cm4gdmFscztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHppbmRleChpc0dyaWRBeGlzOiBib29sZWFuKSB7XG4gIGlmIChpc0dyaWRBeGlzKSB7XG4gICAgLy8gaWYgZ3JpZCBpcyB0cnVlLCBuZWVkIHRvIHB1dCBsYXllciBvbiB0aGUgYmFjayBzbyB0aGF0IGdyaWQgaXMgYmVoaW5kIG1hcmtzXG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIDE7IC8vIG90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCB1c2UgVmVnYSdzIGRlZmF1bHQuXG59XG4iXX0=