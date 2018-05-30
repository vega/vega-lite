"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var util = require("../../util");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUY7QUFFakYsK0JBQWlDO0FBRWpDLHFDQUFzRztBQUN0RyxpQ0FBbUM7QUFJbkM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLG1CQUNFLGFBQXdCLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQixFQUN0RSxJQUFVLEVBQUUsV0FBd0I7SUFHcEMsSUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFM0UsSUFBSSxDQUFDLHdCQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDNUIsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUU7UUFDL0IsdUVBQXVFO1FBQ3ZFLElBQUksQ0FBQywrQkFBdUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEVBQUU7WUFDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzVGLE9BQU8sZ0JBQWdCLENBQUM7U0FDekI7UUFFRCx5RUFBeUU7UUFDekUsSUFBSSxDQUFDLGdDQUF3QixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6RSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUNwRixPQUFPLGdCQUFnQixDQUFDO1NBQ3pCO1FBRUQsT0FBTyxhQUFhLENBQUM7S0FDdEI7SUFFRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUM7QUE1QkQsOEJBNEJDO0FBRUQ7O0dBRUc7QUFDSCxrQ0FBa0M7QUFDbEMscUJBQ0UsT0FBZ0IsRUFBRSxRQUEwQixFQUFFLElBQVUsRUFBRSxXQUF3QjtJQUVsRixRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDckIsS0FBSyxTQUFTLENBQUM7UUFDZixLQUFLLFNBQVM7WUFDWixJQUFJLHdCQUFjLENBQUMsT0FBTyxDQUFDLElBQUcsbUJBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLEVBQUU7Z0JBQy9ELElBQUksT0FBTyxLQUFLLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtvQkFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUN2RTtnQkFDRCxPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUVELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBRTtnQkFDdEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDaEQsNENBQTRDO29CQUM1QyxxSEFBcUg7b0JBQ3JILE9BQU8sTUFBTSxDQUFDO2lCQUNmO2dCQUNELElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtvQkFDbEIsT0FBTyxNQUFNLENBQUM7aUJBQ2Y7YUFDRjtZQUNELHlGQUF5RjtZQUN6RixPQUFPLE9BQU8sQ0FBQztRQUVqQixLQUFLLFVBQVU7WUFDYixJQUFJLHdCQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLE9BQU8sWUFBWSxDQUFDO2FBQ3JCO2lCQUFNLElBQUksbUJBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVLEVBQUU7Z0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDdkUsd0VBQXdFO2dCQUN4RSxPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE9BQU8sTUFBTSxDQUFDO1FBRWhCLEtBQUssY0FBYztZQUNqQixJQUFJLHdCQUFjLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtvQkFDaEIsT0FBTyxhQUFhLENBQUM7aUJBQ3RCO2dCQUNELGtFQUFrRTtnQkFDbEUsdURBQXVEO2dCQUN2RCxPQUFPLFlBQVksQ0FBQzthQUNyQjtpQkFBTSxJQUFJLG1CQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssVUFBVSxFQUFFO2dCQUM1QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLHdFQUF3RTtnQkFDeEUsT0FBTyxTQUFTLENBQUM7YUFDbEI7WUFFRCw0RUFBNEU7WUFDNUUsdUdBQXVHO1lBQ3ZHLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7Z0JBQ3RELE9BQU8sWUFBWSxDQUFDO2FBQ3JCO1lBQ0QsT0FBTyxRQUFRLENBQUM7UUFFbEIsS0FBSyxVQUFVLENBQUM7UUFDaEIsS0FBSyxXQUFXLENBQUM7UUFDakIsS0FBSyxTQUFTO1lBQ1osT0FBTyxTQUFTLENBQUM7S0FDcEI7SUFFRCxtREFBbUQ7SUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9ELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NoYW5uZWwsIGlzQ29sb3JDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbCwgcmFuZ2VUeXBlfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtNYXJrfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7Y2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUsIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGUsIHNjYWxlVHlwZVN1cHBvcnREYXRhVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcblxuZXhwb3J0IHR5cGUgUmFuZ2VUeXBlID0gJ2NvbnRpbnVvdXMnIHwgJ2Rpc2NyZXRlJyB8ICdmbGV4aWJsZScgfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZXJlIGlzIGEgc3BlY2lmaWVkIHNjYWxlIHR5cGUgYW5kIGlmIGl0IGlzIGFwcHJvcHJpYXRlLFxuICogb3IgZGV0ZXJtaW5lIGRlZmF1bHQgdHlwZSBpZiB0eXBlIGlzIHVuc3BlY2lmaWVkIG9yIGluYXBwcm9wcmlhdGUuXG4gKi9cbi8vIE5PVEU6IENvbXBhc3NRTCB1c2VzIHRoaXMgbWV0aG9kLlxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlVHlwZShcbiAgc3BlY2lmaWVkVHlwZTogU2NhbGVUeXBlLCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPixcbiAgbWFyazogTWFyaywgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnXG4pOiBTY2FsZVR5cGUge1xuXG4gIGNvbnN0IGRlZmF1bHRTY2FsZVR5cGUgPSBkZWZhdWx0VHlwZShjaGFubmVsLCBmaWVsZERlZiwgbWFyaywgc2NhbGVDb25maWcpO1xuXG4gIGlmICghaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkpIHtcbiAgICAvLyBUaGVyZSBpcyBubyBzY2FsZSBmb3IgdGhlc2UgY2hhbm5lbHNcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoc3BlY2lmaWVkVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gQ2hlY2sgaWYgZXhwbGljaXRseSBzcGVjaWZpZWQgc2NhbGUgdHlwZSBpcyBzdXBwb3J0ZWQgYnkgdGhlIGNoYW5uZWxcbiAgICBpZiAoIWNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNwZWNpZmllZFR5cGUpKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5zY2FsZVR5cGVOb3RXb3JrV2l0aENoYW5uZWwoY2hhbm5lbCwgc3BlY2lmaWVkVHlwZSwgZGVmYXVsdFNjYWxlVHlwZSkpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRTY2FsZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgZXhwbGljaXRseSBzcGVjaWZpZWQgc2NhbGUgdHlwZSBpcyBzdXBwb3J0ZWQgYnkgdGhlIGRhdGEgdHlwZVxuICAgIGlmICghc2NhbGVUeXBlU3VwcG9ydERhdGFUeXBlKHNwZWNpZmllZFR5cGUsIGZpZWxkRGVmLnR5cGUsIGZpZWxkRGVmLmJpbikpIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLnNjYWxlVHlwZU5vdFdvcmtXaXRoRmllbGREZWYoc3BlY2lmaWVkVHlwZSwgZGVmYXVsdFNjYWxlVHlwZSkpO1xuICAgICAgcmV0dXJuIGRlZmF1bHRTY2FsZVR5cGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwZWNpZmllZFR5cGU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFNjYWxlVHlwZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgYXBwcm9wcmlhdGUgZGVmYXVsdCBzY2FsZSB0eXBlLlxuICovXG4vLyBOT1RFOiBWb3lhZ2VyIHVzZXMgdGhpcyBtZXRob2QuXG5mdW5jdGlvbiBkZWZhdWx0VHlwZShcbiAgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIG1hcms6IE1hcmssIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZ1xuKTogU2NhbGVUeXBlIHtcbiAgc3dpdGNoIChmaWVsZERlZi50eXBlKSB7XG4gICAgY2FzZSAnbm9taW5hbCc6XG4gICAgY2FzZSAnb3JkaW5hbCc6XG4gICAgICBpZiAoaXNDb2xvckNoYW5uZWwoY2hhbm5lbCl8fCByYW5nZVR5cGUoY2hhbm5lbCkgPT09ICdkaXNjcmV0ZScpIHtcbiAgICAgICAgaWYgKGNoYW5uZWwgPT09ICdzaGFwZScgJiYgZmllbGREZWYudHlwZSA9PT0gJ29yZGluYWwnKSB7XG4gICAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZGlzY3JldGVDaGFubmVsQ2Fubm90RW5jb2RlKGNoYW5uZWwsICdvcmRpbmFsJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICB9XG5cbiAgICAgIGlmICh1dGlsLmNvbnRhaW5zKFsneCcsICd5J10sIGNoYW5uZWwpKSB7XG4gICAgICAgIGlmICh1dGlsLmNvbnRhaW5zKFsncmVjdCcsICdiYXInLCAncnVsZSddLCBtYXJrKSkge1xuICAgICAgICAgIC8vIFRoZSByZWN0L2JhciBtYXJrIHNob3VsZCBmaXQgaW50byBhIGJhbmQuXG4gICAgICAgICAgLy8gRm9yIHJ1bGUsIHVzaW5nIGJhbmQgc2NhbGUgdG8gbWFrZSBydWxlIGFsaWduIHdpdGggYXhpcyB0aWNrcyBiZXR0ZXIgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8zNDI5XG4gICAgICAgICAgcmV0dXJuICdiYW5kJztcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFyayA9PT0gJ2JhcicpIHtcbiAgICAgICAgICByZXR1cm4gJ2JhbmQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBPdGhlcndpc2UsIHVzZSBvcmRpbmFsIHBvaW50IHNjYWxlIHNvIHdlIGNhbiBlYXNpbHkgZ2V0IGNlbnRlciBwb3NpdGlvbnMgb2YgdGhlIG1hcmtzLlxuICAgICAgcmV0dXJuICdwb2ludCc7XG5cbiAgICBjYXNlICd0ZW1wb3JhbCc6XG4gICAgICBpZiAoaXNDb2xvckNoYW5uZWwoY2hhbm5lbCkpIHtcbiAgICAgICAgcmV0dXJuICdzZXF1ZW50aWFsJztcbiAgICAgIH0gZWxzZSBpZiAocmFuZ2VUeXBlKGNoYW5uZWwpID09PSAnZGlzY3JldGUnKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRpc2NyZXRlQ2hhbm5lbENhbm5vdEVuY29kZShjaGFubmVsLCAndGVtcG9yYWwnKSk7XG4gICAgICAgIC8vIFRPRE86IGNvbnNpZGVyIHVzaW5nIHF1YW50aXplIChlcXVpdmFsZW50IHRvIGJpbm5pbmcpIG9uY2Ugd2UgaGF2ZSBpdFxuICAgICAgICByZXR1cm4gJ29yZGluYWwnO1xuICAgICAgfVxuICAgICAgcmV0dXJuICd0aW1lJztcblxuICAgIGNhc2UgJ3F1YW50aXRhdGl2ZSc6XG4gICAgICBpZiAoaXNDb2xvckNoYW5uZWwoY2hhbm5lbCkpIHtcbiAgICAgICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgICAgIHJldHVybiAnYmluLW9yZGluYWwnO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSBgc2VxdWVudGlhbGAgYXMgdGhlIGRlZmF1bHQgY29sb3Igc2NhbGUgZm9yIGNvbnRpbnVvdXMgZGF0YVxuICAgICAgICAvLyBzaW5jZSBpdCBzdXBwb3J0cyBib3RoIGFycmF5IHJhbmdlIGFuZCBzY2hlbWUgcmFuZ2UuXG4gICAgICAgIHJldHVybiAnc2VxdWVudGlhbCc7XG4gICAgICB9IGVsc2UgaWYgKHJhbmdlVHlwZShjaGFubmVsKSA9PT0gJ2Rpc2NyZXRlJykge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kaXNjcmV0ZUNoYW5uZWxDYW5ub3RFbmNvZGUoY2hhbm5lbCwgJ3F1YW50aXRhdGl2ZScpKTtcbiAgICAgICAgLy8gVE9ETzogY29uc2lkZXIgdXNpbmcgcXVhbnRpemUgKGVxdWl2YWxlbnQgdG8gYmlubmluZykgb25jZSB3ZSBoYXZlIGl0XG4gICAgICAgIHJldHVybiAnb3JkaW5hbCc7XG4gICAgICB9XG5cbiAgICAgIC8vIHggYW5kIHkgdXNlIGEgbGluZWFyIHNjYWxlIGJlY2F1c2Ugc2VsZWN0aW9ucyBkb24ndCB3b3JrIHdpdGggYmluIHNjYWxlcy5cbiAgICAgIC8vIEJpbm5lZCBzY2FsZXMgYXBwbHkgZGlzY3JldGl6YXRpb24gYnV0IHBhbi96b29tIGFwcGx5IHRyYW5zZm9ybWF0aW9ucyB0byBhIFttaW4sIG1heF0gZXh0ZW50IGRvbWFpbi5cbiAgICAgIGlmIChmaWVsZERlZi5iaW4gJiYgY2hhbm5lbCAhPT0gJ3gnICYmIGNoYW5uZWwgIT09ICd5Jykge1xuICAgICAgICByZXR1cm4gJ2Jpbi1saW5lYXInO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdsaW5lYXInO1xuXG4gICAgY2FzZSAnbGF0aXR1ZGUnOlxuICAgIGNhc2UgJ2xvbmdpdHVkZSc6XG4gICAgY2FzZSAnZ2VvanNvbic6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IHNob3VsZCBuZXZlciByZWFjaCB0aGlzICovXG4gIHRocm93IG5ldyBFcnJvcihsb2cubWVzc2FnZS5pbnZhbGlkRmllbGRUeXBlKGZpZWxkRGVmLnR5cGUpKTtcbn1cbiJdfQ==