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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUY7QUFFakYsK0JBQWlDO0FBRWpDLHFDQUE0RTtBQUM1RSxxQ0FBOEM7QUFDOUMsbUNBQWdDO0FBQ2hDLGlDQUFtQztBQUNuQyxtQ0FBb0M7QUFLcEM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLG1CQUNFLGFBQXdCLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQixFQUN0RSxJQUFVLEVBQUUsV0FBd0I7SUFHcEMsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFM0UsSUFBSSxDQUFDLHdCQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDNUIsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7UUFDL0IsdUVBQXVFO1FBQ3ZFLElBQUksQ0FBQywrQkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQUU7WUFDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzVGLE9BQU8sZ0JBQWdCLENBQUM7U0FDekI7UUFFRCx5RUFBeUU7UUFDekUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUNwRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUNwRixPQUFPLGdCQUFnQixDQUFDO1NBQ3pCO1FBRUQsT0FBTyxhQUFhLENBQUM7S0FDdEI7SUFFRCxP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USxDQUFDLENBQUMsV0FBSSxDQUFDLE9BQU8sRUFBRSxXQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDaEQsT0FBTyxhQUFhLEtBQUssU0FBUyxJQUFJLHlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3hFO1NBQU0sSUFBSSxJQUFJLEtBQUssV0FBSSxDQUFDLFFBQVEsRUFBRTtRQUNqQyxPQUFPLGVBQVEsQ0FBQyxDQUFDLGlCQUFTLENBQUMsSUFBSSxFQUFFLGlCQUFTLENBQUMsR0FBRyxFQUFFLGlCQUFTLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQ2xHO1NBQU0sSUFBSSxJQUFJLEtBQUssV0FBSSxDQUFDLFlBQVksRUFBRTtRQUNyQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsT0FBTyxlQUFRLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFVBQVUsRUFBRSxpQkFBUyxDQUFDLFdBQVcsRUFBRSxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ2pHO1FBQ0QsT0FBTyxlQUFRLENBQUMsQ0FBQyxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBUyxDQUFDLElBQUksRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLFFBQVEsRUFBRSxpQkFBUyxDQUFDLE1BQU0sRUFBRSxpQkFBUyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUMzSztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQWRELHdEQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBpc0NvbG9yQ2hhbm5lbCwgaXNTY2FsZUNoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2NoYW5uZWxTdXBwb3J0U2NhbGVUeXBlLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmV4cG9ydCB0eXBlIFJhbmdlVHlwZSA9ICdjb250aW51b3VzJyB8ICdkaXNjcmV0ZScgfCAnZmxleGlibGUnIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGVyZSBpcyBhIHNwZWNpZmllZCBzY2FsZSB0eXBlIGFuZCBpZiBpdCBpcyBhcHByb3ByaWF0ZSxcbiAqIG9yIGRldGVybWluZSBkZWZhdWx0IHR5cGUgaWYgdHlwZSBpcyB1bnNwZWNpZmllZCBvciBpbmFwcHJvcHJpYXRlLlxuICovXG4vLyBOT1RFOiBDb21wYXNzUUwgdXNlcyB0aGlzIG1ldGhvZC5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGUoXG4gIHNwZWNpZmllZFR5cGU6IFNjYWxlVHlwZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sXG4gIG1hcms6IE1hcmssIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZ1xuKTogU2NhbGVUeXBlIHtcblxuICBjb25zdCBkZWZhdWx0U2NhbGVUeXBlID0gZGVmYXVsdFR5cGUoY2hhbm5lbCwgZmllbGREZWYsIG1hcmssIHNjYWxlQ29uZmlnKTtcblxuICBpZiAoIWlzU2NhbGVDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gc2NhbGUgZm9yIHRoZXNlIGNoYW5uZWxzXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHNwZWNpZmllZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBjaGFubmVsXG4gICAgaWYgKCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzcGVjaWZpZWRUeXBlKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVUeXBlTm90V29ya1dpdGhDaGFubmVsKGNoYW5uZWwsIHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBkYXRhIHR5cGVcbiAgICBpZiAoIWZpZWxkRGVmTWF0Y2hTY2FsZVR5cGUoc3BlY2lmaWVkVHlwZSwgZmllbGREZWYpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVR5cGVOb3RXb3JrV2l0aEZpZWxkRGVmKHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIHJldHVybiBzcGVjaWZpZWRUeXBlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRTY2FsZVR5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGRlZmF1bHQgc2NhbGUgdHlwZS5cbiAqL1xuLy8gTk9URTogVm95YWdlciB1c2VzIHRoaXMgbWV0aG9kLlxuZnVuY3Rpb24gZGVmYXVsdFR5cGUoXG4gIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBtYXJrOiBNYXJrLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWdcbik6IFNjYWxlVHlwZSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpfHwgcmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnc2hhcGUnICYmIGZpZWxkRGVmLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAnb3JkaW5hbCcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbC5jb250YWlucyhbJ3gnLCAneSddLCBjaGFubmVsKSkge1xuICAgICAgICBpZiAodXRpbC5jb250YWlucyhbJ3JlY3QnLCAnYmFyJywgJ3J1bGUnXSwgbWFyaykpIHtcbiAgICAgICAgICAvLyBUaGUgcmVjdC9iYXIgbWFyayBzaG91bGQgZml0IGludG8gYSBiYW5kLlxuICAgICAgICAgIC8vIEZvciBydWxlLCB1c2luZyBiYW5kIHNjYWxlIHRvIG1ha2UgcnVsZSBhbGlnbiB3aXRoIGF4aXMgdGlja3MgYmV0dGVyIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMzQyOVxuICAgICAgICAgIHJldHVybiAnYmFuZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcmsgPT09ICdiYXInKSB7XG4gICAgICAgICAgcmV0dXJuICdiYW5kJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlLCB1c2Ugb3JkaW5hbCBwb2ludCBzY2FsZSBzbyB3ZSBjYW4gZWFzaWx5IGdldCBjZW50ZXIgcG9zaXRpb25zIG9mIHRoZSBtYXJrcy5cbiAgICAgIHJldHVybiAncG9pbnQnO1xuXG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgIHJldHVybiAnc2VxdWVudGlhbCc7XG4gICAgICB9IGVsc2UgaWYgKHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ3RlbXBvcmFsJykpO1xuICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB1c2luZyBxdWFudGl6ZSAoZXF1aXZhbGVudCB0byBiaW5uaW5nKSBvbmNlIHdlIGhhdmUgaXRcbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAndGltZSc7XG5cbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgICByZXR1cm4gJ2Jpbi1vcmRpbmFsJztcbiAgICAgICAgfVxuICAgICAgICAvLyBVc2UgYHNlcXVlbnRpYWxgIGFzIHRoZSBkZWZhdWx0IGNvbG9yIHNjYWxlIGZvciBjb250aW51b3VzIGRhdGFcbiAgICAgICAgLy8gc2luY2UgaXQgc3VwcG9ydHMgYm90aCBhcnJheSByYW5nZSBhbmQgc2NoZW1lIHJhbmdlLlxuICAgICAgICByZXR1cm4gJ3NlcXVlbnRpYWwnO1xuICAgICAgfSBlbHNlIGlmIChyYW5nZVR5cGUoY2hhbm5lbCkgPT09ICdkaXNjcmV0ZScpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlzY3JldGVDaGFubmVsQ2Fubm90RW5jb2RlKGNoYW5uZWwsICdxdWFudGl0YXRpdmUnKSk7XG4gICAgICAgIC8vIFRPRE86IGNvbnNpZGVyIHVzaW5nIHF1YW50aXplIChlcXVpdmFsZW50IHRvIGJpbm5pbmcpIG9uY2Ugd2UgaGF2ZSBpdFxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuXG4gICAgICAvLyB4IGFuZCB5IHVzZSBhIGxpbmVhciBzY2FsZSBiZWNhdXNlIHNlbGVjdGlvbnMgZG9uJ3Qgd29yayB3aXRoIGJpbiBzY2FsZXMuXG4gICAgICAvLyBCaW5uZWQgc2NhbGVzIGFwcGx5IGRpc2NyZXRpemF0aW9uIGJ1dCBwYW4vem9vbSBhcHBseSB0cmFuc2Zvcm1hdGlvbnMgdG8gYSBbbWluLCBtYXhdIGV4dGVudCBkb21haW4uXG4gICAgICBpZiAoZmllbGREZWYuYmluICYmIGNoYW5uZWwgIT09ICd4JyAmJiBjaGFubmVsICE9PSAneScpIHtcbiAgICAgICAgcmV0dXJuICdiaW4tbGluZWFyJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnbGluZWFyJztcblxuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ2dlb2pzb24nOlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzaG91bGQgbmV2ZXIgcmVhY2ggdGhpcyAqL1xuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZERlZk1hdGNoU2NhbGVUeXBlKHNwZWNpZmllZFR5cGU6IFNjYWxlVHlwZSwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pOmJvb2xlYW4ge1xuICBjb25zdCB0eXBlOiBUeXBlID0gZmllbGREZWYudHlwZTtcbiAgaWYgKGNvbnRhaW5zKFtUeXBlLk9SRElOQUwsIFR5cGUuTk9NSU5BTF0sIHR5cGUpKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZFR5cGUgPT09IHVuZGVmaW5lZCB8fCBoYXNEaXNjcmV0ZURvbWFpbihzcGVjaWZpZWRUeXBlKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBUeXBlLlRFTVBPUkFMKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5zKFtTY2FsZVR5cGUuVElNRSwgU2NhbGVUeXBlLlVUQywgU2NhbGVUeXBlLlNFUVVFTlRJQUwsIHVuZGVmaW5lZF0sIHNwZWNpZmllZFR5cGUpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09IFR5cGUuUVVBTlRJVEFUSVZFKSB7XG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zKFtTY2FsZVR5cGUuQklOX0xJTkVBUiwgU2NhbGVUeXBlLkJJTl9PUkRJTkFMLCBTY2FsZVR5cGUuTElORUFSXSwgc3BlY2lmaWVkVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBjb250YWlucyhbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlBPVywgU2NhbGVUeXBlLlNRUlQsIFNjYWxlVHlwZS5RVUFOVElMRSwgU2NhbGVUeXBlLlFVQU5USVpFLCBTY2FsZVR5cGUuTElORUFSLCBTY2FsZVR5cGUuU0VRVUVOVElBTCwgdW5kZWZpbmVkXSwgc3BlY2lmaWVkVHlwZSk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==