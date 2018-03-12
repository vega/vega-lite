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
            if (channel_1.isColorChannel(channel) || channel_1.rangeType(channel) === 'discrete') {
                if (channel === 'shape' && fieldDef.type === 'ordinal') {
                    log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                }
                return 'ordinal';
            }
            if (util.contains(['x', 'y'], channel)) {
                if (util.contains(['rect', 'bar', 'rule'], mark)) {
                    // The rect/bar mark should fit into a band.
                    // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
                    return 'band';
                }
                if (mark === 'bar') {
                    return 'band';
                }
            }
            // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
            return 'point';
        case 'temporal':
            if (channel_1.isColorChannel(channel)) {
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            return 'time';
        case 'quantitative':
            if (channel_1.isColorChannel(channel)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUY7QUFFakYsK0JBQWlDO0FBRWpDLHFDQUE0RTtBQUM1RSxxQ0FBOEM7QUFDOUMsbUNBQWdDO0FBQ2hDLGlDQUFtQztBQUNuQyxtQ0FBb0M7QUFLcEM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLG1CQUNFLGFBQXdCLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQixFQUN0RSxJQUFVLEVBQUUsV0FBd0I7SUFHcEMsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFM0UsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3Qix1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQywrQkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDMUIsQ0FBQztRQUVELHlFQUF5RTtRQUN6RSxFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0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LENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsVUFBVSxFQUFFLGlCQUFTLENBQUMsV0FBVyxFQUFFLGlCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUNELE1BQU0sQ0FBQyxlQUFRLENBQUMsQ0FBQyxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLElBQUksRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLE1BQU0sRUFBRSxpQkFBUyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1SyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFkRCx3REFjQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbm5lbCwgaXNDb2xvckNoYW5uZWwsIGlzU2NhbGVDaGFubmVsLCByYW5nZVR5cGV9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge01hcmt9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSwgU2NhbGVDb25maWcsIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2NvbnRhaW5zfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5leHBvcnQgdHlwZSBSYW5nZVR5cGUgPSAnY29udGludW91cycgfCAnZGlzY3JldGUnIHwgJ2ZsZXhpYmxlJyB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlcmUgaXMgYSBzcGVjaWZpZWQgc2NhbGUgdHlwZSBhbmQgaWYgaXQgaXMgYXBwcm9wcmlhdGUsXG4gKiBvciBkZXRlcm1pbmUgZGVmYXVsdCB0eXBlIGlmIHR5cGUgaXMgdW5zcGVjaWZpZWQgb3IgaW5hcHByb3ByaWF0ZS5cbiAqL1xuLy8gTk9URTogQ29tcGFzc1FMIHVzZXMgdGhpcyBtZXRob2QuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGVUeXBlKFxuICBzcGVjaWZpZWRUeXBlOiBTY2FsZVR5cGUsIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LFxuICBtYXJrOiBNYXJrLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWdcbik6IFNjYWxlVHlwZSB7XG5cbiAgY29uc3QgZGVmYXVsdFNjYWxlVHlwZSA9IGRlZmF1bHRUeXBlKGNoYW5uZWwsIGZpZWxkRGVmLCBtYXJrLCBzY2FsZUNvbmZpZyk7XG5cbiAgaWYgKCFpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSkge1xuICAgIC8vIFRoZXJlIGlzIG5vIHNjYWxlIGZvciB0aGVzZSBjaGFubmVsc1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChzcGVjaWZpZWRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBDaGVjayBpZiBleHBsaWNpdGx5IHNwZWNpZmllZCBzY2FsZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgY2hhbm5lbFxuICAgIGlmICghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoY2hhbm5lbCwgc3BlY2lmaWVkVHlwZSkpIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnNjYWxlVHlwZU5vdFdvcmtXaXRoQ2hhbm5lbChjaGFubmVsLCBzcGVjaWZpZWRUeXBlLCBkZWZhdWx0U2NhbGVUeXBlKSk7XG4gICAgICByZXR1cm4gZGVmYXVsdFNjYWxlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBleHBsaWNpdGx5IHNwZWNpZmllZCBzY2FsZSB0eXBlIGlzIHN1cHBvcnRlZCBieSB0aGUgZGF0YSB0eXBlXG4gICAgaWYgKCFmaWVsZERlZk1hdGNoU2NhbGVUeXBlKHNwZWNpZmllZFR5cGUsIGZpZWxkRGVmKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVUeXBlTm90V29ya1dpdGhGaWVsZERlZihzcGVjaWZpZWRUeXBlLCBkZWZhdWx0U2NhbGVUeXBlKSk7XG4gICAgICByZXR1cm4gZGVmYXVsdFNjYWxlVHlwZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BlY2lmaWVkVHlwZTtcbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xufVxuXG4vKipcbiAqIERldGVybWluZSBhcHByb3ByaWF0ZSBkZWZhdWx0IHNjYWxlIHR5cGUuXG4gKi9cbi8vIE5PVEU6IFZveWFnZXIgdXNlcyB0aGlzIG1ldGhvZC5cbmZ1bmN0aW9uIGRlZmF1bHRUeXBlKFxuICBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgbWFyazogTWFyaywgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnXG4pOiBTY2FsZVR5cGUge1xuICBzd2l0Y2ggKGZpZWxkRGVmLnR5cGUpIHtcbiAgICBjYXNlICdub21pbmFsJzpcbiAgICBjYXNlICdvcmRpbmFsJzpcbiAgICAgIGlmIChpc0NvbG9yQ2hhbm5lbChjaGFubmVsKXx8IHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBpZiAoY2hhbm5lbCA9PT0gJ3NoYXBlJyAmJiBmaWVsZERlZi50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ29yZGluYWwnKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWwuY29udGFpbnMoWyd4JywgJ3knXSwgY2hhbm5lbCkpIHtcbiAgICAgICAgaWYgKHV0aWwuY29udGFpbnMoWydyZWN0JywgJ2JhcicsICdydWxlJ10sIG1hcmspKSB7XG4gICAgICAgICAgLy8gVGhlIHJlY3QvYmFyIG1hcmsgc2hvdWxkIGZpdCBpbnRvIGEgYmFuZC5cbiAgICAgICAgICAvLyBGb3IgcnVsZSwgdXNpbmcgYmFuZCBzY2FsZSB0byBtYWtlIHJ1bGUgYWxpZ24gd2l0aCBheGlzIHRpY2tzIGJldHRlciBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzM0MjlcbiAgICAgICAgICByZXR1cm4gJ2JhbmQnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXJrID09PSAnYmFyJykge1xuICAgICAgICAgIHJldHVybiAnYmFuZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIE90aGVyd2lzZSwgdXNlIG9yZGluYWwgcG9pbnQgc2NhbGUgc28gd2UgY2FuIGVhc2lseSBnZXQgY2VudGVyIHBvc2l0aW9ucyBvZiB0aGUgbWFya3MuXG4gICAgICByZXR1cm4gJ3BvaW50JztcblxuICAgIGNhc2UgJ3RlbXBvcmFsJzpcbiAgICAgIGlmIChpc0NvbG9yQ2hhbm5lbChjaGFubmVsKSkge1xuICAgICAgICByZXR1cm4gJ3NlcXVlbnRpYWwnO1xuICAgICAgfSBlbHNlIGlmIChyYW5nZVR5cGUoY2hhbm5lbCkgPT09ICdkaXNjcmV0ZScpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlzY3JldGVDaGFubmVsQ2Fubm90RW5jb2RlKGNoYW5uZWwsICd0ZW1wb3JhbCcpKTtcbiAgICAgICAgLy8gVE9ETzogY29uc2lkZXIgdXNpbmcgcXVhbnRpemUgKGVxdWl2YWxlbnQgdG8gYmlubmluZykgb25jZSB3ZSBoYXZlIGl0XG4gICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ3RpbWUnO1xuXG4gICAgY2FzZSAncXVhbnRpdGF0aXZlJzpcbiAgICAgIGlmIChpc0NvbG9yQ2hhbm5lbChjaGFubmVsKSkge1xuICAgICAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICAgICAgcmV0dXJuICdiaW4tb3JkaW5hbCc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXNlIGBzZXF1ZW50aWFsYCBhcyB0aGUgZGVmYXVsdCBjb2xvciBzY2FsZSBmb3IgY29udGludW91cyBkYXRhXG4gICAgICAgIC8vIHNpbmNlIGl0IHN1cHBvcnRzIGJvdGggYXJyYXkgcmFuZ2UgYW5kIHNjaGVtZSByYW5nZS5cbiAgICAgICAgcmV0dXJuICdzZXF1ZW50aWFsJztcbiAgICAgIH0gZWxzZSBpZiAocmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAncXVhbnRpdGF0aXZlJykpO1xuICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB1c2luZyBxdWFudGl6ZSAoZXF1aXZhbGVudCB0byBiaW5uaW5nKSBvbmNlIHdlIGhhdmUgaXRcbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cblxuICAgICAgLy8geCBhbmQgeSB1c2UgYSBsaW5lYXIgc2NhbGUgYmVjYXVzZSBzZWxlY3Rpb25zIGRvbid0IHdvcmsgd2l0aCBiaW4gc2NhbGVzLlxuICAgICAgLy8gQmlubmVkIHNjYWxlcyBhcHBseSBkaXNjcmV0aXphdGlvbiBidXQgcGFuL3pvb20gYXBwbHkgdHJhbnNmb3JtYXRpb25zIHRvIGEgW21pbiwgbWF4XSBleHRlbnQgZG9tYWluLlxuICAgICAgaWYgKGZpZWxkRGVmLmJpbiAmJiBjaGFubmVsICE9PSAneCcgJiYgY2hhbm5lbCAhPT0gJ3knKSB7XG4gICAgICAgIHJldHVybiAnYmluLWxpbmVhcic7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ2xpbmVhcic7XG5cbiAgICBjYXNlICdsYXRpdHVkZSc6XG4gICAgY2FzZSAnbG9uZ2l0dWRlJzpcbiAgICBjYXNlICdnZW9qc29uJzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogc2hvdWxkIG5ldmVyIHJlYWNoIHRoaXMgKi9cbiAgdGhyb3cgbmV3IEVycm9yKGxvZy5tZXNzYWdlLmludmFsaWRGaWVsZFR5cGUoZmllbGREZWYudHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmllbGREZWZNYXRjaFNjYWxlVHlwZShzcGVjaWZpZWRUeXBlOiBTY2FsZVR5cGUsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KTpib29sZWFuIHtcbiAgY29uc3QgdHlwZTogVHlwZSA9IGZpZWxkRGVmLnR5cGU7XG4gIGlmIChjb250YWlucyhbVHlwZS5PUkRJTkFMLCBUeXBlLk5PTUlOQUxdLCB0eXBlKSkge1xuICAgIHJldHVybiBzcGVjaWZpZWRUeXBlID09PSB1bmRlZmluZWQgfHwgaGFzRGlzY3JldGVEb21haW4oc3BlY2lmaWVkVHlwZSk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gVHlwZS5URU1QT1JBTCkge1xuICAgIHJldHVybiBjb250YWlucyhbU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVEMsIFNjYWxlVHlwZS5TRVFVRU5USUFMLCB1bmRlZmluZWRdLCBzcGVjaWZpZWRUeXBlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBUeXBlLlFVQU5USVRBVElWRSkge1xuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIHJldHVybiBjb250YWlucyhbU2NhbGVUeXBlLkJJTl9MSU5FQVIsIFNjYWxlVHlwZS5CSU5fT1JESU5BTCwgU2NhbGVUeXBlLkxJTkVBUl0sIHNwZWNpZmllZFR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbnMoW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5QT1csIFNjYWxlVHlwZS5TUVJULCBTY2FsZVR5cGUuUVVBTlRJTEUsIFNjYWxlVHlwZS5RVUFOVElaRSwgU2NhbGVUeXBlLkxJTkVBUiwgU2NhbGVUeXBlLlNFUVVFTlRJQUwsIHVuZGVmaW5lZF0sIHNwZWNpZmllZFR5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iXX0=