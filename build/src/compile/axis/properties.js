import { truncate } from 'vega-util';
import { binToString } from '../../bin';
import { X, Y } from '../../channel';
import { dateTimeExpr, isDateTime } from '../../datetime';
import { title as fieldDefTitle } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain } from '../../scale';
import { QUANTITATIVE } from '../../type';
import { contains } from '../../util';
// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function grid(scaleType, fieldDef) {
    return !hasDiscreteDomain(scaleType) && !fieldDef.bin;
}
export function gridScale(model, channel) {
    var gridChannel = channel === 'x' ? 'y' : 'x';
    if (model.getScaleComponent(gridChannel)) {
        return model.scaleName(gridChannel);
    }
    return undefined;
}
export function labelFlush(fieldDef, channel, specifiedAxis) {
    if (specifiedAxis.labelFlush !== undefined) {
        return specifiedAxis.labelFlush;
    }
    if (channel === 'x' && contains(['quantitative', 'temporal'], fieldDef.type)) {
        return true;
    }
    return undefined;
}
export function labelOverlap(fieldDef, specifiedAxis, channel, scaleType) {
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
export function orient(channel) {
    switch (channel) {
        case X:
            return 'bottom';
        case Y:
            return 'left';
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVALID_CHANNEL_FOR_AXIS);
}
export function tickCount(channel, fieldDef, scaleType, size) {
    if (!hasDiscreteDomain(scaleType) && scaleType !== 'log' && !contains(['month', 'hours', 'day', 'quarter'], fieldDef.timeUnit)) {
        if (fieldDef.bin) {
            // for binned data, we don't want more ticks than maxbins
            return { signal: "ceil(" + size.signal + "/20)" };
        }
        return { signal: "ceil(" + size.signal + "/40)" };
    }
    return undefined;
}
export function title(maxLength, fieldDef, config) {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = fieldDefTitle(fieldDef, config);
    return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}
export function values(specifiedAxis, model, fieldDef) {
    var vals = specifiedAxis.values;
    if (specifiedAxis.values && isDateTime(vals[0])) {
        return vals.map(function (dt) {
            // normalize = true as end user won't put 0 = January
            return { signal: dateTimeExpr(dt, true) };
        });
    }
    if (!vals && fieldDef.bin && fieldDef.type === QUANTITATIVE) {
        var signal = model.getName(binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
        return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
    }
    return vals;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcHJvcGVydGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRW5DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUF1QixDQUFDLEVBQUUsQ0FBQyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpELE9BQU8sRUFBVyxZQUFZLEVBQUUsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFXLEtBQUssSUFBSSxhQUFhLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRSxPQUFPLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsaUJBQWlCLEVBQVksTUFBTSxhQUFhLENBQUM7QUFDekQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN4QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBS3BDLGlGQUFpRjtBQUNqRjs7O0dBR0c7QUFDSCxNQUFNLGVBQWUsU0FBb0IsRUFBRSxRQUEwQjtJQUNuRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3hELENBQUM7QUFFRCxNQUFNLG9CQUFvQixLQUFnQixFQUFFLE9BQTZCO0lBQ3ZFLElBQU0sV0FBVyxHQUF5QixPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUN0RSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUN4QyxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLFNBQVMs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RUFBRTtRQUMzRCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQUksUUFBUSxDQUFDLEtBQUssVUFBTyxDQUFDLENBQUM7UUFDcEYsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFZLE1BQU0sZ0JBQVcsTUFBTSxnQkFBVyxNQUFNLGVBQVUsTUFBTSxXQUFRLEVBQUMsQ0FBQztLQUMvRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dHJ1bmNhdGV9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0F4aXN9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7UG9zaXRpb25TY2FsZUNoYW5uZWwsIFgsIFl9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbiwgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcblxuXG4vLyBUT0RPOiB3ZSBuZWVkIHRvIHJlZmFjdG9yIHRoaXMgbWV0aG9kIGFmdGVyIHdlIHRha2UgY2FyZSBvZiBjb25maWcgcmVmYWN0b3Jpbmdcbi8qKlxuICogRGVmYXVsdCBydWxlcyBmb3Igd2hldGhlciB0byBzaG93IGEgZ3JpZCBzaG91bGQgYmUgc2hvd24gZm9yIGEgY2hhbm5lbC5cbiAqIElmIGBncmlkYCBpcyB1bnNwZWNpZmllZCwgdGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGZvciBvcmRpbmFsIHNjYWxlcyB0aGF0IGFyZSBub3QgYmlubmVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmlkKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICByZXR1cm4gIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkgJiYgIWZpZWxkRGVmLmJpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyaWRTY2FsZShtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCBncmlkQ2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAneScgOiAneCc7XG4gIGlmIChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChncmlkQ2hhbm5lbCkpIHtcbiAgICByZXR1cm4gbW9kZWwuc2NhbGVOYW1lKGdyaWRDaGFubmVsKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFiZWxGbHVzaChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNwZWNpZmllZEF4aXM6IEF4aXMpIHtcbiAgaWYgKHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxGbHVzaDtcbiAgfVxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnICYmIGNvbnRhaW5zKFsncXVhbnRpdGF0aXZlJywgJ3RlbXBvcmFsJ10sIGZpZWxkRGVmLnR5cGUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhYmVsT3ZlcmxhcChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkQXhpczogQXhpcywgY2hhbm5lbDogUG9zaXRpb25TY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKSB7XG4gIGlmIChzcGVjaWZpZWRBeGlzLmxhYmVsT3ZlcmxhcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZEF4aXMubGFiZWxPdmVybGFwO1xuICB9XG5cbiAgLy8gZG8gbm90IHByZXZlbnQgb3ZlcmxhcCBmb3Igbm9taW5hbCBkYXRhIGJlY2F1c2UgdGhlcmUgaXMgbm8gd2F5IHRvIGluZmVyIHdoYXQgdGhlIG1pc3NpbmcgbGFiZWxzIGFyZVxuICBpZiAoZmllbGREZWYudHlwZSAhPT0gJ25vbWluYWwnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiAnZ3JlZWR5JztcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3JpZW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsKSB7XG4gIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgIGNhc2UgWDpcbiAgICAgIHJldHVybiAnYm90dG9tJztcbiAgICBjYXNlIFk6XG4gICAgICByZXR1cm4gJ2xlZnQnO1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4uICovXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5JTlZBTElEX0NIQU5ORUxfRk9SX0FYSVMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGlja0NvdW50KGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNpemU6IFZnU2lnbmFsUmVmKSB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSAmJiBzY2FsZVR5cGUgIT09ICdsb2cnICYmICFjb250YWlucyhbJ21vbnRoJywgJ2hvdXJzJywgJ2RheScsICdxdWFydGVyJ10sIGZpZWxkRGVmLnRpbWVVbml0KSkge1xuXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgLy8gZm9yIGJpbm5lZCBkYXRhLCB3ZSBkb24ndCB3YW50IG1vcmUgdGlja3MgdGhhbiBtYXhiaW5zXG4gICAgICByZXR1cm4ge3NpZ25hbDogYGNlaWwoJHtzaXplLnNpZ25hbH0vMjApYH07XG4gICAgfVxuICAgIHJldHVybiB7c2lnbmFsOiBgY2VpbCgke3NpemUuc2lnbmFsfS80MClgfTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZShtYXhMZW5ndGg6IG51bWJlciwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNvbmZpZzogQ29uZmlnKSB7XG4gIC8vIGlmIG5vdCBkZWZpbmVkLCBhdXRvbWF0aWNhbGx5IGRldGVybWluZSBheGlzIHRpdGxlIGZyb20gZmllbGQgZGVmXG4gIGNvbnN0IGZpZWxkVGl0bGUgPSBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCBjb25maWcpO1xuICByZXR1cm4gbWF4TGVuZ3RoID8gdHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4TGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMoc3BlY2lmaWVkQXhpczogQXhpcywgbW9kZWw6IFVuaXRNb2RlbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgY29uc3QgdmFscyA9IHNwZWNpZmllZEF4aXMudmFsdWVzO1xuICBpZiAoc3BlY2lmaWVkQXhpcy52YWx1ZXMgJiYgaXNEYXRlVGltZSh2YWxzWzBdKSkge1xuICAgIHJldHVybiAodmFscyBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAvLyBub3JtYWxpemUgPSB0cnVlIGFzIGVuZCB1c2VyIHdvbid0IHB1dCAwID0gSmFudWFyeVxuICAgICAgcmV0dXJuIHtzaWduYWw6IGRhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9O1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCF2YWxzICYmIGZpZWxkRGVmLmJpbiAmJiBmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICByZXR1cm4ge3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH07XG4gIH1cblxuICByZXR1cm4gdmFscztcbn1cbiJdfQ==