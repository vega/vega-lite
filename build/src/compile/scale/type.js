"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var scale_2 = require("../../scale");
var type_1 = require("../../type");
var util = require("../../util");
var util_1 = require("../../util");
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function scaleType(specifiedType, channel, fieldDef, mark, scaleConfig) {
    var defaultScaleType = defaultType(channel, fieldDef, mark, scaleConfig);
    if (!channel_1.isScaleChannel(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (specifiedType !== undefined) {
        // Check if explicitly specified scale type is supported by the channel
        if (!scale_1.channelSupportScaleType(channel, specifiedType)) {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the data type
        if (!fieldDefMatchScaleType(specifiedType, fieldDef)) {
            log.warn(log.message.scaleTypeNotWorkWithFieldDef(specifiedType, defaultScaleType));
            return defaultScaleType;
        }
        return specifiedType;
    }
    return defaultScaleType;
}
exports.scaleType = scaleType;
/**
 * Determine appropriate default scale type.
 */
// NOTE: Voyager uses this method.
function defaultType(channel, fieldDef, mark, scaleConfig) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            if (channel === 'color' || channel_1.rangeType(channel) === 'discrete') {
                if (channel === 'shape' && fieldDef.type === 'ordinal') {
                    log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                }
                return 'ordinal';
            }
            if (util.contains(['x', 'y'], channel)) {
                if (mark === 'rect') {
                    // The rect mark should fit into a band.
                    return 'band';
                }
                if (mark === 'bar') {
                    return 'band';
                }
            }
            // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
            return 'point';
        case 'temporal':
            if (channel === 'color') {
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            return 'time';
        case 'quantitative':
            if (channel === 'color') {
                if (fieldDef.bin) {
                    return 'bin-ordinal';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            // x and y use a linear scale because selections don't work with bin scales.
            // Binned scales apply discretization but pan/zoom apply transformations to a [min, max] extent domain.
            if (fieldDef.bin && channel !== 'x' && channel !== 'y') {
                return 'bin-linear';
            }
            return 'linear';
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
function fieldDefMatchScaleType(specifiedType, fieldDef) {
    var type = fieldDef.type;
    if (util_1.contains([type_1.Type.ORDINAL, type_1.Type.NOMINAL], type)) {
        return specifiedType === undefined || scale_2.hasDiscreteDomain(specifiedType);
    }
    else if (type === type_1.Type.TEMPORAL) {
        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, scale_1.ScaleType.SEQUENTIAL, undefined], specifiedType);
    }
    else if (type === type_1.Type.QUANTITATIVE) {
        if (fieldDef.bin) {
            return util_1.contains([scale_1.ScaleType.BIN_LINEAR, scale_1.ScaleType.BIN_ORDINAL, scale_1.ScaleType.LINEAR], specifiedType);
        }
        return util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.QUANTILE, scale_1.ScaleType.QUANTIZE, scale_1.ScaleType.LINEAR, scale_1.ScaleType.SEQUENTIAL, undefined], specifiedType);
    }
    return true;
}
exports.fieldDefMatchScaleType = fieldDefMatchScaleType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUU7QUFFakUsK0JBQWlDO0FBRWpDLHFDQUE0RTtBQUM1RSxxQ0FBOEM7QUFDOUMsbUNBQWdDO0FBQ2hDLGlDQUFtQztBQUNuQyxtQ0FBb0M7QUFLcEM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLG1CQUNFLGFBQXdCLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQixFQUN0RSxJQUFVLEVBQUUsV0FBd0I7SUFHcEMsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFM0UsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3Qix1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQztRQUVELHlFQUF5RTtRQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0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RUFBRSxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2xHLENBQUM7UUFDRCxNQUFNLENBQUMsZUFBUSxDQUFDLENBQUMsaUJBQVMsQ0FBQyxHQUFHLEVBQUUsaUJBQVMsQ0FBQyxHQUFHLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxRQUFRLEVBQUUsaUJBQVMsQ0FBQyxRQUFRLEVBQUUsaUJBQVMsQ0FBQyxNQUFNLEVBQUUsaUJBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUssQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBZEQsd0RBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsLCByYW5nZVR5cGV9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSwgU2NhbGVDb25maWcsIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5leHBvcnQgdHlwZSBSYW5nZVR5cGUgPSAnY29udGludW91cycgfCAnZGlzY3JldGUnIHwgJ2ZsZXhpYmxlJyB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlcmUgaXMgYSBzcGVjaWZpZWQgc2NhbGUgdHlwZSBhbmQgaWYgaXQgaXMgYXBwcm9wcmlhdGUsXG4gKiBvciBkZXRlcm1pbmUgZGVmYXVsdCB0eXBlIGlmIHR5cGUgaXMgdW5zcGVjaWZpZWQgb3IgaW5hcHByb3ByaWF0ZS5cbiAqL1xuLy8gTk9URTogQ29tcGFzc1FMIHVzZXMgdGhpcyBtZXRob2QuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVUeXBlKFxuICBzcGVjaWZpZWRUeXBlOiBTY2FsZVR5cGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LFxuICBtYXJrOiBNYXJrLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWdcbik6IFNjYWxlVHlwZSB7XG5cbiAgY29uc3QgZGVmYXVsdFNjYWxlVHlwZSA9IGRlZmF1bHRUeXBlKGNoYW5uZWwsIGZpZWxkRGVmLCBtYXJrLCBzY2FsZUNvbmZpZyk7XG5cbiAgaWYgKCFpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSkge1xuICAgIC8vIFRoZXJlIGlzIG5vIHNjYWxlIGZvciB0aGVzZSBjaGFubmVsc1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChzcGVjaWZpZWRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBDaGVjayBpZiBleHBsaWNpdGx5IHNwZWNpZmllZCBzY2FsZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgY2hhbm5lbFxuICAgIGlmICghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoY2hhbm5lbCwgc3BlY2lmaWVkVHlwZSkpIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnNjYWxlVHlwZU5vdFdvcmtXaXRoQ2hhbm5lbChjaGFubmVsLCBzcGVjaWZpZWRUeXBlLCBkZWZhdWx0U2NhbGVUeXBlKSk7XG4gICAgICByZXR1cm4gZGVmYXVsdFNjYWxlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBleHBsaWNpdGx5IHNwZWNpZmllZCBzY2FsZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgZGF0YSB0eXBlXG4gICAgaWYgKCFmaWVsZERlZk1hdGNoU2NhbGVUeXBlKHNwZWNpZmllZFR5cGUsIGZpZWxkRGVmKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVUeXBlTm90V29ya1dpdGhGaWVsZERlZihzcGVjaWZpZWRUeXBlLCBkZWZhdWx0U2NhbGVUeXBlKSk7XG4gICAgICByZXR1cm4gZGVmYXVsdFNjYWxlVHlwZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BlY2lmaWVkVHlwZTtcbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBhcHByb3ByaWF0ZSBkZWZhdWx0IHNjYWxlIHR5cGUuXG4gKi9cbi8vIE5PVEU6IFZveWFnZXIgdXNlcyB0aGlzIG1ldGhvZC5cbmZ1bmN0aW9uIGRlZmF1bHRUeXBlKFxuICBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgbWFyazogTWFyaywgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnXG4pOiBTY2FsZVR5cGUge1xuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlICdub21pbmFsJzpcbiAgICBjYXNlICdvcmRpbmFsJzpcbiAgICAgIGlmIChjaGFubmVsID09PSAnY29sb3InIHx8IHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBpZiAoY2hhbm5lbCA9PT0gJ3NoYXBlJyAmJiBmaWVsZERlZi50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ29yZGluYWwnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWwuY29udGFpbnMoWyd4JywgJ3knXSwgY2hhbm5lbCkpIHtcbiAgICAgICAgaWYgKG1hcmsgPT09ICdyZWN0Jykge1xuICAgICAgICAgIC8vIFRoZSByZWN0IG1hcmsgc2hvdWxkIGZpdCBpbnRvIGEgYmFuZC5cbiAgICAgICAgICByZXR1cm4gJ2JhbmQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXJrID09PSAnYmFyJykge1xuICAgICAgICAgIHJldHVybiAnYmFuZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSwgdXNlIG9yZGluYWwgcG9pbnQgc2NhbGUgc28gd2UgY2FuIGVhc2lseSBnZXQgY2VudGVyIHBvc2l0aW9ucyBvZiB0aGUgbWFya3MuXG4gICAgICByZXR1cm4gJ3BvaW50JztcblxuICAgIGNhc2UgJ3RlbXBvcmFsJzpcbiAgICAgIGlmIChjaGFubmVsID09PSAnY29sb3InKSB7XG4gICAgICAgIHJldHVybiAnc2VxdWVudGlhbCc7XG4gICAgICB9IGVsc2UgaWYgKHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ3RlbXBvcmFsJykpO1xuICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB1c2luZyBxdWFudGl6ZSAoZXF1aXZhbGVudCB0byBiaW5uaW5nKSBvbmNlIHdlIGhhdmUgaXRcbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAndGltZSc7XG5cbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgaWYgKGNoYW5uZWwgPT09ICdjb2xvcicpIHtcbiAgICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICAgIHJldHVybiAnYmluLW9yZGluYWwnO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSBgc2VxdWVudGlhbGAgYXMgdGhlIGRlZmF1bHQgY29sb3Igc2NhbGUgZm9yIGNvbnRpbnVvdXMgZGF0YVxuICAgICAgICAvLyBzaW5jZSBpdCBzdXBwb3J0cyBib3RoIGFycmF5IHJhbmdlIGFuZCBzY2hlbWUgcmFuZ2UuXG4gICAgICAgIHJldHVybiAnc2VxdWVudGlhbCc7XG4gICAgICB9IGVsc2UgaWYgKHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ3F1YW50aXRhdGl2ZScpKTtcbiAgICAgICAgLy8gVE9ETzogY29uc2lkZXIgdXNpbmcgcXVhbnRpemUgKGVxdWl2YWxlbnQgdG8gYmlubmluZykgb25jZSB3ZSBoYXZlIGl0XG4gICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICB9XG5cbiAgICAgIC8vIHggYW5kIHkgdXNlIGEgbGluZWFyIHNjYWxlIGJlY2F1c2Ugc2VsZWN0aW9ucyBkb24ndCB3b3JrIHdpdGggYmluIHNjYWxlcy5cbiAgICAgIC8vIEJpbm5lZCBzY2FsZXMgYXBwbHkgZGlzY3JldGl6YXRpb24gYnV0IHBhbi96b29tIGFwcGx5IHRyYW5zZm9ybWF0aW9ucyB0byBhIFttaW4sIG1heF0gZXh0ZW50IGRvbWFpbi5cbiAgICAgIGlmIChmaWVsZERlZi5iaW4gJiYgY2hhbm5lbCAhPT0gJ3gnICYmIGNoYW5uZWwgIT09ICd5Jykge1xuICAgICAgICByZXR1cm4gJ2Jpbi1saW5lYXInO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdsaW5lYXInO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHNob3VsZCBuZXZlciByZWFjaCB0aGlzICovXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRGVmTWF0Y2hTY2FsZVR5cGUoc3BlY2lmaWVkVHlwZTogU2NhbGVUeXBlLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPik6Ym9vbGVhbiB7XG4gIGNvbnN0IHR5cGU6IFR5cGUgPSBmaWVsZERlZi50eXBlO1xuICBpZiAoY29udGFpbnMoW1R5cGUuT1JESU5BTCwgVHlwZS5OT01JTkFMXSwgdHlwZSkpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkVHlwZSA9PT0gdW5kZWZpbmVkIHx8IGhhc0Rpc2NyZXRlRG9tYWluKHNwZWNpZmllZFR5cGUpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuVEVNUE9SQUwpIHtcbiAgICByZXR1cm4gY29udGFpbnMoW1NjYWxlVHlwZS5USU1FLCBTY2FsZVR5cGUuVVRDLCBTY2FsZVR5cGUuU0VRVUVOVElBTCwgdW5kZWZpbmVkXSwgc3BlY2lmaWVkVHlwZSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5RVUFOVElUQVRJVkUpIHtcbiAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICByZXR1cm4gY29udGFpbnMoW1NjYWxlVHlwZS5CSU5fTElORUFSLCBTY2FsZVR5cGUuQklOX09SRElOQUwsIFNjYWxlVHlwZS5MSU5FQVJdLCBzcGVjaWZpZWRUeXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRhaW5zKFtTY2FsZVR5cGUuTE9HLCBTY2FsZVR5cGUuUE9XLCBTY2FsZVR5cGUuU1FSVCwgU2NhbGVUeXBlLlFVQU5USUxFLCBTY2FsZVR5cGUuUVVBTlRJWkUsIFNjYWxlVHlwZS5MSU5FQVIsIFNjYWxlVHlwZS5TRVFVRU5USUFMLCB1bmRlZmluZWRdLCBzcGVjaWZpZWRUeXBlKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIl19