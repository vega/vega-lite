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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUVuQyxpQ0FBc0M7QUFDdEMseUNBQXlEO0FBRXpELDJDQUFrRTtBQUNsRSwyQ0FBZ0U7QUFDaEUsK0JBQWlDO0FBQ2pDLHFDQUF5RDtBQUN6RCxtQ0FBd0M7QUFDeEMsbUNBQW9DO0FBS3BDLGlGQUFpRjtBQUNqRjs7O0dBR0c7QUFDSCxjQUFxQixTQUFvQixFQUFFLFFBQTBCO0lBQ25FLE9BQU8sQ0FBQyx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDeEQsQ0FBQztBQUZELG9CQUVDO0FBRUQsbUJBQTBCLEtBQWdCLEVBQUUsT0FBNkI7SUFDdkUsSUFBTSxXQUFXLEdBQXlCLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ3RFLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNyQztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFORCw4QkFNQztBQUVELG9CQUEyQixRQUEwQixFQUFFLE9BQTZCLEVBQUUsYUFBbUI7SUFDdkcsSUFBSSxhQUFhLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtRQUMxQyxPQUFPLGFBQWEsQ0FBQyxVQUFVLENBQUM7S0FDakM7SUFDRCxJQUFJLE9BQU8sS0FBSyxHQUFHLElBQUksZUFBUSxDQUFDLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM1RSxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxTQUFT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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dHJ1bmNhdGV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7UG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcblxuXG4vLyBUT0RPOiB3ZSBuZWVkIHRvIHJlZmFjdG9yIHRoaXMgbWV0aG9kIGFmdGVyIHdlIHRha2UgY2FyZSBvZiBjb25maWcgcmVmYWN0b3Jpbmdcbi8qKlxuICogRGVmYXVsdCBydWxlcyBmb3Igd2hldGhlciB0byBzaG93IGEgZ3JpZCBzaG91bGQgYmUgc2hvd24gZm9yIGEgY2hhbm5lbC5cbiAqIElmIGBncmlkYCBpcyB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBvcmRpbmFsIHNjYWxlcyB0aGF0IGFyZSBub3QgYmlubmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmlkKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICByZXR1cm4gIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyaWRTY2FsZShtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCBncmlkQ2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAneScgOiAneCc7XG4gIGlmIChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChncmlkQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gbW9kZWwuc2NhbGVOYW1lKGdyaWRDaGFubmVsKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWxGbHVzaChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNwZWNpZmllZEF4aXM6IEF4aXMpIHtcbiAgaWYgKHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaDtcbiAgfVxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnICYmIGNvbnRhaW5zKFsncXVhbnRpdGF0aXZlJywgJ3RlbXBvcmFsJ10sIGZpZWxkRGVmLnR5cGUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsT3ZlcmxhcChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gIGlmIChzcGVjaWZpZWRBeGlzLmxhYmVsT3ZlcmxhcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxPdmVybGFwO1xuICB9XG5cbiAgLy8gZG8gbm90IHByZXZlbnQgb3ZlcmxhcCBmb3Igbm9taW5hbCBkYXRhIGJlY2F1c2UgdGhlcmUgaXMgbm8gd2F5IHRvIGluZmVyIHdoYXQgdGhlIG1pc3NpbmcgbGFiZWxzIGFyZVxuICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ25vbWluYWwnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiAnZ3JlZWR5JztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsKSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICAgIHJldHVybiAnYm90dG9tJztcbiAgICBjYXNlIFk6XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4uICovXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5JTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja0NvdW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNpemU6IFZnU2lnbmFsUmVmKSB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSAmJiBzY2FsZVR5cGUgIT09ICdsb2cnICYmICFjb250YWlucyhbJ21vbnRoJywgJ2hvdXJzJywgJ2RheScsICdxdWFydGVyJ10sIGZpZWxkRGVmLnRpbWVVbml0KSkge1xuXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgLy8gZm9yIGJpbm5lZCBkYXRhLCB3ZSBkb24ndCB3YW50IG1vcmUgdGlja3MgdGhhbiBtYXhiaW5zXG4gICAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vMjApYH07XG4gICAgfVxuICAgIHJldHVybiB7c2lnbmFsOiBgY2VpbCgke3NpemUuc2lnbmFsfS80MClgfTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtYXhMZW5ndGg6IG51bWJlciwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gIGNvbnN0IGZpZWxkVGl0bGUgPSBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCBjb25maWcpO1xuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoc3BlY2lmaWVkQXhpczogQXhpcywgbW9kZWw6IFVuaXRNb2RlbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgY29uc3QgdmFscyA9IHNwZWNpZmllZEF4aXMudmFsdWVzO1xuICBpZiAoc3BlY2lmaWVkQXhpcy52YWx1ZXMgJiYgaXNEYXRlVGltZSh2YWxzWzBdKSkge1xuICAgIHJldHVybiAodmFscyBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgPSB0cnVlIGFzIGVuZCB1c2VyIHdvbid0IHB1dCAwID0gSmFudWFyeVxuICAgICAgcmV0dXJuIHtzaWduYWw6IGRhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9O1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCF2YWxzICYmIGZpZWxkRGVmLmJpbiAmJiBmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICByZXR1cm4ge3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH07XG4gIH1cblxuICByZXR1cm4gdmFscztcbn1cbiJdfQ==