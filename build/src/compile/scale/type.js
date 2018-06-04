"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var util = tslib_1.__importStar(require("../../util"));
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
        if (!scale_1.scaleTypeSupportDataType(specifiedType, fieldDef.type, fieldDef.bin)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQWlGO0FBRWpGLHFEQUFpQztBQUVqQyxxQ0FBc0c7QUFDdEcsdURBQW1DO0FBSW5DOzs7R0FHRztBQUNILG9DQUFvQztBQUNwQyxtQkFDRSxhQUF3QixFQUFFLE9BQWdCLEVBQUUsUUFBMEIsRUFDdEUsSUFBVSxFQUFFLFdBQXdCO0lBR3BDLElBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBRTNFLElBQUksQ0FBQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzVCLHVDQUF1QztRQUN2QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO1FBQy9CLHVFQUF1RTtRQUN2RSxJQUFJLENBQUMsK0JBQXVCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxFQUFFO1lBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM1RixPQUFPLGdCQUFnQixDQUFDO1NBQ3pCO1FBRUQseUVBQXlFO1FBQ3pFLElBQUksQ0FBQyxnQ0FBd0IsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDekUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDcEYsT0FBTyxnQkFBZ0IsQ0FBQztTQUN6QjtRQUVELE9BQU8sYUFBYSxDQUFDO0tBQ3RCO0lBRUQsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDO0FBNUJELDhCQTRCQztBQUVEOztHQUVHO0FBQ0gsa0NBQWtDO0FBQ2xDLHFCQUNFLE9BQWdCLEVBQUUsUUFBMEIsRUFBRSxJQUFVLEVBQUUsV0FBd0I7SUFFbEYsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ3JCLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxTQUFTO1lBQ1osSUFBSSx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFHLG1CQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxFQUFFO2dCQUMvRCxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3RELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztpQkFDdkU7Z0JBQ0QsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2hELDRDQUE0QztvQkFDNUMscUhBQXFIO29CQUNySCxPQUFPLE1BQU0sQ0FBQztpQkFDZjtnQkFDRCxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7b0JBQ2xCLE9BQU8sTUFBTSxDQUFDO2lCQUNmO2FBQ0Y7WUFDRCx5RkFBeUY7WUFDekYsT0FBTyxPQUFPLENBQUM7UUFFakIsS0FBSyxVQUFVO1lBQ2IsSUFBSSx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMzQixPQUFPLFlBQVksQ0FBQzthQUNyQjtpQkFBTSxJQUFJLG1CQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxFQUFFO2dCQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLHdFQUF3RTtnQkFDeEUsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUVoQixLQUFLLGNBQWM7WUFDakIsSUFBSSx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMzQixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7b0JBQ2hCLE9BQU8sYUFBYSxDQUFDO2lCQUN0QjtnQkFDRCxrRUFBa0U7Z0JBQ2xFLHVEQUF1RDtnQkFDdkQsT0FBTyxZQUFZLENBQUM7YUFDckI7aUJBQU0sSUFBSSxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsRUFBRTtnQkFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUMzRSx3RUFBd0U7Z0JBQ3hFLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBRUQsNEVBQTRFO1lBQzVFLHVHQUF1RztZQUN2RyxJQUFJLFFBQVEsQ0FBQyxHQUFHLElBQUksT0FBTyxLQUFLLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUN0RCxPQUFPLFlBQVksQ0FBQzthQUNyQjtZQUNELE9BQU8sUUFBUSxDQUFDO1FBRWxCLEtBQUssVUFBVSxDQUFDO1FBQ2hCLEtBQUssV0FBVyxDQUFDO1FBQ2pCLEtBQUssU0FBUztZQUNaLE9BQU8sU0FBUyxDQUFDO0tBQ3BCO0lBRUQsbURBQW1EO0lBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBpc0NvbG9yQ2hhbm5lbCwgaXNTY2FsZUNoYW5uZWwsIHJhbmdlVHlwZX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7TWFya30gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge2NoYW5uZWxTdXBwb3J0U2NhbGVUeXBlLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlLCBzY2FsZVR5cGVTdXBwb3J0RGF0YVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmV4cG9ydCB0eXBlIFJhbmdlVHlwZSA9ICdjb250aW51b3VzJyB8ICdkaXNjcmV0ZScgfCAnZmxleGlibGUnIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGVyZSBpcyBhIHNwZWNpZmllZCBzY2FsZSB0eXBlIGFuZCBpZiBpdCBpcyBhcHByb3ByaWF0ZSxcbiAqIG9yIGRldGVybWluZSBkZWZhdWx0IHR5cGUgaWYgdHlwZSBpcyB1bnNwZWNpZmllZCBvciBpbmFwcHJvcHJpYXRlLlxuICovXG4vLyBOT1RFOiBDb21wYXNzUUwgdXNlcyB0aGlzIG1ldGhvZC5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZVR5cGUoXG4gIHNwZWNpZmllZFR5cGU6IFNjYWxlVHlwZSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sXG4gIG1hcms6IE1hcmssIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZ1xuKTogU2NhbGVUeXBlIHtcblxuICBjb25zdCBkZWZhdWx0U2NhbGVUeXBlID0gZGVmYXVsdFR5cGUoY2hhbm5lbCwgZmllbGREZWYsIG1hcmssIHNjYWxlQ29uZmlnKTtcblxuICBpZiAoIWlzU2NhbGVDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gc2NhbGUgZm9yIHRoZXNlIGNoYW5uZWxzXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHNwZWNpZmllZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBjaGFubmVsXG4gICAgaWYgKCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzcGVjaWZpZWRUeXBlKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uuc2NhbGVUeXBlTm90V29ya1dpdGhDaGFubmVsKGNoYW5uZWwsIHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHNjYWxlIHR5cGUgaXMgc3VwcG9ydGVkIGJ5IHRoZSBkYXRhIHR5cGVcbiAgICBpZiAoIXNjYWxlVHlwZVN1cHBvcnREYXRhVHlwZShzcGVjaWZpZWRUeXBlLCBmaWVsZERlZi50eXBlLCBmaWVsZERlZi5iaW4pKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVR5cGVOb3RXb3JrV2l0aEZpZWxkRGVmKHNwZWNpZmllZFR5cGUsIGRlZmF1bHRTY2FsZVR5cGUpKTtcbiAgICAgIHJldHVybiBkZWZhdWx0U2NhbGVUeXBlO1xuICAgIH1cblxuICAgIHJldHVybiBzcGVjaWZpZWRUeXBlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRTY2FsZVR5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGFwcHJvcHJpYXRlIGRlZmF1bHQgc2NhbGUgdHlwZS5cbiAqL1xuLy8gTk9URTogVm95YWdlciB1c2VzIHRoaXMgbWV0aG9kLlxuZnVuY3Rpb24gZGVmYXVsdFR5cGUoXG4gIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBtYXJrOiBNYXJrLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWdcbik6IFNjYWxlVHlwZSB7XG4gIHN3aXRjaCAoZmllbGREZWYudHlwZSkge1xuICAgIGNhc2UgJ25vbWluYWwnOlxuICAgIGNhc2UgJ29yZGluYWwnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpfHwgcmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGlmIChjaGFubmVsID09PSAnc2hhcGUnICYmIGZpZWxkRGVmLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAnb3JkaW5hbCcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuXG4gICAgICBpZiAodXRpbC5jb250YWlucyhbJ3gnLCAneSddLCBjaGFubmVsKSkge1xuICAgICAgICBpZiAodXRpbC5jb250YWlucyhbJ3JlY3QnLCAnYmFyJywgJ3J1bGUnXSwgbWFyaykpIHtcbiAgICAgICAgICAvLyBUaGUgcmVjdC9iYXIgbWFyayBzaG91bGQgZml0IGludG8gYSBiYW5kLlxuICAgICAgICAgIC8vIEZvciBydWxlLCB1c2luZyBiYW5kIHNjYWxlIHRvIG1ha2UgcnVsZSBhbGlnbiB3aXRoIGF4aXMgdGlja3MgYmV0dGVyIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMzQyOVxuICAgICAgICAgIHJldHVybiAnYmFuZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcmsgPT09ICdiYXInKSB7XG4gICAgICAgICAgcmV0dXJuICdiYW5kJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gT3RoZXJ3aXNlLCB1c2Ugb3JkaW5hbCBwb2ludCBzY2FsZSBzbyB3ZSBjYW4gZWFzaWx5IGdldCBjZW50ZXIgcG9zaXRpb25zIG9mIHRoZSBtYXJrcy5cbiAgICAgIHJldHVybiAncG9pbnQnO1xuXG4gICAgY2FzZSAndGVtcG9yYWwnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgIHJldHVybiAnc2VxdWVudGlhbCc7XG4gICAgICB9IGVsc2UgaWYgKHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ3RlbXBvcmFsJykpO1xuICAgICAgICAvLyBUT0RPOiBjb25zaWRlciB1c2luZyBxdWFudGl6ZSAoZXF1aXZhbGVudCB0byBiaW5uaW5nKSBvbmNlIHdlIGhhdmUgaXRcbiAgICAgICAgcmV0dXJuICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAndGltZSc7XG5cbiAgICBjYXNlICdxdWFudGl0YXRpdmUnOlxuICAgICAgaWYgKGlzQ29sb3JDaGFubmVsKGNoYW5uZWwpKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgICAgICByZXR1cm4gJ2Jpbi1vcmRpbmFsJztcbiAgICAgICAgfVxuICAgICAgICAvLyBVc2UgYHNlcXVlbnRpYWxgIGFzIHRoZSBkZWZhdWx0IGNvbG9yIHNjYWxlIGZvciBjb250aW51b3VzIGRhdGFcbiAgICAgICAgLy8gc2luY2UgaXQgc3VwcG9ydHMgYm90aCBhcnJheSByYW5nZSBhbmQgc2NoZW1lIHJhbmdlLlxuICAgICAgICByZXR1cm4gJ3NlcXVlbnRpYWwnO1xuICAgICAgfSBlbHNlIGlmIChyYW5nZVR5cGUoY2hhbm5lbCkgPT09ICdkaXNjcmV0ZScpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlzY3JldGVDaGFubmVsQ2Fubm90RW5jb2RlKGNoYW5uZWwsICdxdWFudGl0YXRpdmUnKSk7XG4gICAgICAgIC8vIFRPRE86IGNvbnNpZGVyIHVzaW5nIHF1YW50aXplIChlcXVpdmFsZW50IHRvIGJpbm5pbmcpIG9uY2Ugd2UgaGF2ZSBpdFxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuXG4gICAgICAvLyB4IGFuZCB5IHVzZSBhIGxpbmVhciBzY2FsZSBiZWNhdXNlIHNlbGVjdGlvbnMgZG9uJ3Qgd29yayB3aXRoIGJpbiBzY2FsZXMuXG4gICAgICAvLyBCaW5uZWQgc2NhbGVzIGFwcGx5IGRpc2NyZXRpemF0aW9uIGJ1dCBwYW4vem9vbSBhcHBseSB0cmFuc2Zvcm1hdGlvbnMgdG8gYSBbbWluLCBtYXhdIGV4dGVudCBkb21haW4uXG4gICAgICBpZiAoZmllbGREZWYuYmluICYmIGNoYW5uZWwgIT09ICd4JyAmJiBjaGFubmVsICE9PSAneScpIHtcbiAgICAgICAgcmV0dXJuICdiaW4tbGluZWFyJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnbGluZWFyJztcblxuICAgIGNhc2UgJ2xhdGl0dWRlJzpcbiAgICBjYXNlICdsb25naXR1ZGUnOlxuICAgIGNhc2UgJ2dlb2pzb24nOlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBzaG91bGQgbmV2ZXIgcmVhY2ggdGhpcyAqL1xuICB0aHJvdyBuZXcgRXJyb3IobG9nLm1lc3NhZ2UuaW52YWxpZEZpZWxkVHlwZShmaWVsZERlZi50eXBlKSk7XG59XG4iXX0=