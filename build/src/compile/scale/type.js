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
        case 'latitude':
        case 'longitude':
        case 'geojson':
            return undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUU7QUFFakUsK0JBQWlDO0FBRWpDLHFDQUE0RTtBQUM1RSxxQ0FBOEM7QUFDOUMsbUNBQWdDO0FBQ2hDLGlDQUFtQztBQUNuQyxtQ0FBb0M7QUFLcEM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLG1CQUNFLGFBQXdCLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQixFQUN0RSxJQUFVLEVBQUUsV0FBd0I7SUFHcEMsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFM0UsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3Qix1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQztRQUVELHlFQUF5RTtRQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0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Q0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsVUFBVSxFQUFFLGlCQUFTLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUNELE1BQU0sQ0FBQyxlQUFRLENBQUMsQ0FBQyxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLElBQUksRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLE1BQU0sRUFBRSxpQkFBUyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1SyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFkRCx3REFjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2NoYW5uZWxTdXBwb3J0U2NhbGVUeXBlLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmV4cG9ydCB0eXBlIFJhbmdlVHlwZSA9ICdjb250aW51b3VzJyB8ICdkaXNjcmV0ZScgfCAnZmxleGlibGUnIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGVyZSBpcyBhIHNwZWNpZmllZCBzY2FsZSB0eXBlIGFuZCBpZiBpdCBpcyBhcHByb3ByaWF0ZSxcbiAqIG9yIGRldGVybWluZSBkZWZhdWx0IHR5cGUgaWYgdHlwZSBpcyB1bnNwZWNpZmllZCBvciBpbmFwcHJvcHJpYXRlLlxuICovXG4vLyBOT1RFOiBDb21wYXNzUUwgdXNlcyB0aGlzIG1ldGhvZC5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGUoXG4gIHNwZWNpZmllZFR5cGU6IFNjYWxlVHlwZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sXG4gIG1hcms6IE1hcmssIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZ1xuKTogU2NhbGVUeXBlIHtcblxuICBjb25zdCBkZWZhdWx0U2NhbGVUeXBlID0gZGVmYXVsdFR5cGUoY2hhbm5lbCwgZmllbGREZWYsIG1hcmssIHNjYWxlQ29uZmlnKTtcblxuICBpZiAoIWlzU2NhbGVDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gc2NhbGUgZm9yIHRoZXNlIGNoYW5uZWxzXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHNwZWNpZmllZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBjaGFubmVsXG4gICAgaWYgKCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzcGVjaWZpZWRUeXBlKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVUeXBlTm90V29ya1dpdGhDaGFubmVsKGNoYW5uZWwsIHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBkYXRhIHR5cGVcbiAgICBpZiAoIWZpZWxkRGVmTWF0Y2hTY2FsZVR5cGUoc3BlY2lmaWVkVHlwZSwgZmllbGREZWYpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVR5cGVOb3RXb3JrV2l0aEZpZWxkRGVmKHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIHJldHVybiBzcGVjaWZpZWRUeXBlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRTY2FsZVR5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGRlZmF1bHQgc2NhbGUgdHlwZS5cbiAqL1xuLy8gTk9URTogVm95YWdlciB1c2VzIHRoaXMgbWV0aG9kLlxuZnVuY3Rpb24gZGVmYXVsdFR5cGUoXG4gIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBtYXJrOiBNYXJrLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWdcbik6IFNjYWxlVHlwZSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgICAgaWYgKGNoYW5uZWwgPT09ICdjb2xvcicgfHwgcmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnc2hhcGUnICYmIGZpZWxkRGVmLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAnb3JkaW5hbCcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbC5jb250YWlucyhbJ3gnLCAneSddLCBjaGFubmVsKSkge1xuICAgICAgICBpZiAobWFyayA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgLy8gVGhlIHJlY3QgbWFyayBzaG91bGQgZml0IGludG8gYSBiYW5kLlxuICAgICAgICAgIHJldHVybiAnYmFuZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcmsgPT09ICdiYXInKSB7XG4gICAgICAgICAgcmV0dXJuICdiYW5kJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlLCB1c2Ugb3JkaW5hbCBwb2ludCBzY2FsZSBzbyB3ZSBjYW4gZWFzaWx5IGdldCBjZW50ZXIgcG9zaXRpb25zIG9mIHRoZSBtYXJrcy5cbiAgICAgIHJldHVybiAncG9pbnQnO1xuXG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgaWYgKGNoYW5uZWwgPT09ICdjb2xvcicpIHtcbiAgICAgICAgcmV0dXJuICdzZXF1ZW50aWFsJztcbiAgICAgIH0gZWxzZSBpZiAocmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAndGVtcG9yYWwnKSk7XG4gICAgICAgIC8vIFRPRE86IGNvbnNpZGVyIHVzaW5nIHF1YW50aXplIChlcXVpdmFsZW50IHRvIGJpbm5pbmcpIG9uY2Ugd2UgaGF2ZSBpdFxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgcmV0dXJuICd0aW1lJztcblxuICAgIGNhc2UgJ3F1YW50aXRhdGl2ZSc6XG4gICAgICBpZiAoY2hhbm5lbCA9PT0gJ2NvbG9yJykge1xuICAgICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgICAgcmV0dXJuICdiaW4tb3JkaW5hbCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXNlIGBzZXF1ZW50aWFsYCBhcyB0aGUgZGVmYXVsdCBjb2xvciBzY2FsZSBmb3IgY29udGludW91cyBkYXRhXG4gICAgICAgIC8vIHNpbmNlIGl0IHN1cHBvcnRzIGJvdGggYXJyYXkgcmFuZ2UgYW5kIHNjaGVtZSByYW5nZS5cbiAgICAgICAgcmV0dXJuICdzZXF1ZW50aWFsJztcbiAgICAgIH0gZWxzZSBpZiAocmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAncXVhbnRpdGF0aXZlJykpO1xuICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB1c2luZyBxdWFudGl6ZSAoZXF1aXZhbGVudCB0byBiaW5uaW5nKSBvbmNlIHdlIGhhdmUgaXRcbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cblxuICAgICAgLy8geCBhbmQgeSB1c2UgYSBsaW5lYXIgc2NhbGUgYmVjYXVzZSBzZWxlY3Rpb25zIGRvbid0IHdvcmsgd2l0aCBiaW4gc2NhbGVzLlxuICAgICAgLy8gQmlubmVkIHNjYWxlcyBhcHBseSBkaXNjcmV0aXphdGlvbiBidXQgcGFuL3pvb20gYXBwbHkgdHJhbnNmb3JtYXRpb25zIHRvIGEgW21pbiwgbWF4XSBleHRlbnQgZG9tYWluLlxuICAgICAgaWYgKGZpZWxkRGVmLmJpbiAmJiBjaGFubmVsICE9PSAneCcgJiYgY2hhbm5lbCAhPT0gJ3knKSB7XG4gICAgICAgIHJldHVybiAnYmluLWxpbmVhcic7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ2xpbmVhcic7XG5cbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICdnZW9qc29uJzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXMgKi9cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZNYXRjaFNjYWxlVHlwZShzcGVjaWZpZWRUeXBlOiBTY2FsZVR5cGUsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KTpib29sZWFuIHtcbiAgY29uc3QgdHlwZTogVHlwZSA9IGZpZWxkRGVmLnR5cGU7XG4gIGlmIChjb250YWlucyhbVHlwZS5PUkRJTkFMLCBUeXBlLk5PTUlOQUxdLCB0eXBlKSkge1xuICAgIHJldHVybiBzcGVjaWZpZWRUeXBlID09PSB1bmRlZmluZWQgfHwgaGFzRGlzY3JldGVEb21haW4oc3BlY2lmaWVkVHlwZSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5URU1QT1JBTCkge1xuICAgIHJldHVybiBjb250YWlucyhbU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVEMsIFNjYWxlVHlwZS5TRVFVRU5USUFMLCB1bmRlZmluZWRdLCBzcGVjaWZpZWRUeXBlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBUeXBlLlFVQU5USVRBVElWRSkge1xuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIHJldHVybiBjb250YWlucyhbU2NhbGVUeXBlLkJJTl9MSU5FQVIsIFNjYWxlVHlwZS5CSU5fT1JESU5BTCwgU2NhbGVUeXBlLkxJTkVBUl0sIHNwZWNpZmllZFR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbnMoW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5QT1csIFNjYWxlVHlwZS5TUVJULCBTY2FsZVR5cGUuUVVBTlRJTEUsIFNjYWxlVHlwZS5RVUFOVElaRSwgU2NhbGVUeXBlLkxJTkVBUiwgU2NhbGVUeXBlLlNFUVVFTlRJQUwsIHVuZGVmaW5lZF0sIHNwZWNpZmllZFR5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=