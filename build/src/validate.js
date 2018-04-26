"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var mark_1 = require("./mark");
var mark_2 = require("./mark");
/**
 * Required Encoding Channels for each mark type
 */
exports.DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    trail: ['x', 'y'],
    area: ['x', 'y']
};
/**
 * Supported Encoding Channel for each mark type
 */
exports.DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: vega_util_1.toSet(['row', 'column', 'x', 'y', 'size', 'color', 'fill', 'stroke', 'detail']),
    line: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail']),
    trail: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail', 'size']),
    area: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
    tick: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
    circle: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
    square: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
    point: vega_util_1.toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail', 'shape']),
    geoshape: vega_util_1.toSet(['row', 'column', 'color', 'fill', 'stroke', 'detail', 'shape']),
    text: vega_util_1.toSet(['row', 'column', 'size', 'color', 'fill', 'stroke', 'text']) // TODO(#724) revise
};
// TODO: consider if we should add validate method and
// requires ZSchema in the main vega-lite repo
/**
 * Further check if encoding mapping of a spec is invalid and
 * return error if it is invalid.
 *
 * This checks if
 * (1) all the required encoding channels for the mark type are specified
 * (2) all the specified encoding channels are supported by the mark type
 * @param  {[type]} spec [description]
 * @param  {RequiredChannelMap = DefaultRequiredChannelMap}  requiredChannelMap
 * @param  {SupportedChannelMap = DefaultSupportedChannelMap} supportedChannelMap
 * @return {String} Return one reason why the encoding is invalid,
 *                  or null if the encoding is valid.
 */
function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = exports.DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = exports.DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var encoding = spec.encoding;
    var requiredChannels = requiredChannelMap[mark];
    var supportedChannels = supportedChannelMap[mark];
    for (var i in requiredChannels) { // all required channels are in encoding`
        if (!(requiredChannels[i] in encoding)) {
            return 'Missing encoding channel \"' + requiredChannels[i] +
                '\" for mark \"' + mark + '\"';
        }
    }
    for (var channel in encoding) { // all channels in encoding are supported
        if (!supportedChannels[channel]) {
            return 'Encoding channel \"' + channel +
                '\" is not supported by mark type \"' + mark + '\"';
        }
    }
    if (mark === mark_2.BAR && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
exports.getEncodingMappingError = getEncodingMappingError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBZ0M7QUFDaEMsK0JBQWlDO0FBQ2pDLCtCQUEyQjtBQVUzQjs7R0FFRztBQUNVLFFBQUEsNEJBQTRCLEdBQXVCO0lBQzlELElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNkLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDaEIsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNqQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0NBQ2pCLENBQUM7QUFRRjs7R0FFRztBQUNVLFFBQUEsOEJBQThCLEdBQXdCO0lBQ2pFLEdBQUcsRUFBRSxpQkFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwRixJQUFJLEVBQUUsaUJBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEYsS0FBSyxFQUFFLGlCQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRixJQUFJLEVBQUUsaUJBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RSxJQUFJLEVBQUUsaUJBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RSxNQUFNLEVBQUUsaUJBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkYsTUFBTSxFQUFFLGlCQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZGLEtBQUssRUFBRSxpQkFBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0YsUUFBUSxFQUFFLGlCQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRixJQUFJLEVBQUUsaUJBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQXlCLG9CQUFvQjtDQUN2SCxDQUFDO0FBRUYsc0RBQXNEO0FBQ3RELDhDQUE4QztBQUU5Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxpQ0FBd0MsSUFBOEIsRUFDcEUsa0JBQXFFLEVBQ3JFLG1CQUF5RTtJQUR6RSxtQ0FBQSxFQUFBLHFCQUF5QyxvQ0FBNEI7SUFDckUsb0NBQUEsRUFBQSxzQkFBMkMsc0NBQThCO0lBRXpFLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMvRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQy9CLElBQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsSUFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRCxLQUFLLElBQU0sQ0FBQyxJQUFJLGdCQUFnQixFQUFFLEVBQUUseUNBQXlDO1FBQzNFLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxFQUFFO1lBQ3RDLE9BQU8sNkJBQTZCLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2xDO0tBQ0Y7SUFFRCxLQUFLLElBQU0sT0FBTyxJQUFJLFFBQVEsRUFBRSxFQUFFLHlDQUF5QztRQUN6RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxxQkFBcUIsR0FBRyxPQUFPO2dCQUNwQyxxQ0FBcUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3ZEO0tBQ0Y7SUFFRCxJQUFJLElBQUksS0FBSyxVQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtRQUM5QyxPQUFPLDhCQUE4QixDQUFDO0tBQ3ZDO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBNUJELDBEQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dG9TZXR9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge2lzTWFya0RlZn0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7QkFSfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWN9IGZyb20gJy4vc3BlYyc7XG5cblxuXG4vLyBUT0RPOiBtb3ZlIHRvIHZsLnNwZWMudmFsaWRhdG9yP1xuZXhwb3J0IGludGVyZmFjZSBSZXF1aXJlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXTogQXJyYXk8c3RyaW5nPjtcbn1cblxuLyoqXG4gKiBSZXF1aXJlZCBFbmNvZGluZyBDaGFubmVscyBmb3IgZWFjaCBtYXJrIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IHtcbiAgdGV4dDogWyd0ZXh0J10sXG4gIGxpbmU6IFsneCcsICd5J10sXG4gIHRyYWlsOiBbJ3gnLCAneSddLFxuICBhcmVhOiBbJ3gnLCAneSddXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN1cHBvcnRlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXToge1xuICAgIFtjaGFubmVsOiBzdHJpbmddOiBib29sZWFuXG4gIH07XG59XG5cbi8qKlxuICogU3VwcG9ydGVkIEVuY29kaW5nIENoYW5uZWwgZm9yIGVhY2ggbWFyayB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEU6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSB7XG4gIGJhcjogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdzaXplJywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2RldGFpbCddKSxcbiAgbGluZTogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdjb2xvcicsICdkZXRhaWwnXSksXG4gIHRyYWlsOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2NvbG9yJywgJ2RldGFpbCcsICdzaXplJ10pLFxuICBhcmVhOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2RldGFpbCddKSxcbiAgdGljazogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdkZXRhaWwnXSksXG4gIGNpcmNsZTogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdzaXplJywgJ2RldGFpbCddKSxcbiAgc3F1YXJlOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBwb2ludDogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdzaXplJywgJ2RldGFpbCcsICdzaGFwZSddKSxcbiAgZ2Vvc2hhcGU6IHRvU2V0KFsncm93JywgJ2NvbHVtbicsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdkZXRhaWwnLCAnc2hhcGUnXSksXG4gIHRleHQ6IHRvU2V0KFsncm93JywgJ2NvbHVtbicsICdzaXplJywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ3RleHQnXSkgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETygjNzI0KSByZXZpc2Vcbn07XG5cbi8vIFRPRE86IGNvbnNpZGVyIGlmIHdlIHNob3VsZCBhZGQgdmFsaWRhdGUgbWV0aG9kIGFuZFxuLy8gcmVxdWlyZXMgWlNjaGVtYSBpbiB0aGUgbWFpbiB2ZWdhLWxpdGUgcmVwb1xuXG4vKipcbiAqIEZ1cnRoZXIgY2hlY2sgaWYgZW5jb2RpbmcgbWFwcGluZyBvZiBhIHNwZWMgaXMgaW52YWxpZCBhbmRcbiAqIHJldHVybiBlcnJvciBpZiBpdCBpcyBpbnZhbGlkLlxuICpcbiAqIFRoaXMgY2hlY2tzIGlmXG4gKiAoMSkgYWxsIHRoZSByZXF1aXJlZCBlbmNvZGluZyBjaGFubmVscyBmb3IgdGhlIG1hcmsgdHlwZSBhcmUgc3BlY2lmaWVkXG4gKiAoMikgYWxsIHRoZSBzcGVjaWZpZWQgZW5jb2RpbmcgY2hhbm5lbHMgYXJlIHN1cHBvcnRlZCBieSB0aGUgbWFyayB0eXBlXG4gKiBAcGFyYW0gIHtbdHlwZV19IHNwZWMgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UmVxdWlyZWRDaGFubmVsTWFwID0gRGVmYXVsdFJlcXVpcmVkQ2hhbm5lbE1hcH0gIHJlcXVpcmVkQ2hhbm5lbE1hcFxuICogQHBhcmFtICB7U3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERlZmF1bHRTdXBwb3J0ZWRDaGFubmVsTWFwfSBzdXBwb3J0ZWRDaGFubmVsTWFwXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybiBvbmUgcmVhc29uIHdoeSB0aGUgZW5jb2RpbmcgaXMgaW52YWxpZCxcbiAqICAgICAgICAgICAgICAgICAgb3IgbnVsbCBpZiB0aGUgZW5jb2RpbmcgaXMgdmFsaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvZGluZ01hcHBpbmdFcnJvcihzcGVjOiBGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWMsXG4gIHJlcXVpcmVkQ2hhbm5lbE1hcDogUmVxdWlyZWRDaGFubmVsTWFwID0gREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUCxcbiAgc3VwcG9ydGVkQ2hhbm5lbE1hcDogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRVxuICApIHtcbiAgY29uc3QgbWFyayA9IGlzTWFya0RlZihzcGVjLm1hcmspID8gc3BlYy5tYXJrLnR5cGUgOiBzcGVjLm1hcms7XG4gIGNvbnN0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcbiAgY29uc3QgcmVxdWlyZWRDaGFubmVscyA9IHJlcXVpcmVkQ2hhbm5lbE1hcFttYXJrXTtcbiAgY29uc3Qgc3VwcG9ydGVkQ2hhbm5lbHMgPSBzdXBwb3J0ZWRDaGFubmVsTWFwW21hcmtdO1xuXG4gIGZvciAoY29uc3QgaSBpbiByZXF1aXJlZENoYW5uZWxzKSB7IC8vIGFsbCByZXF1aXJlZCBjaGFubmVscyBhcmUgaW4gZW5jb2RpbmdgXG4gICAgaWYgKCEocmVxdWlyZWRDaGFubmVsc1tpXSBpbiBlbmNvZGluZykpIHtcbiAgICAgIHJldHVybiAnTWlzc2luZyBlbmNvZGluZyBjaGFubmVsIFxcXCInICsgcmVxdWlyZWRDaGFubmVsc1tpXSArXG4gICAgICAgICdcXFwiIGZvciBtYXJrIFxcXCInICsgbWFyayArICdcXFwiJztcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGNoYW5uZWwgaW4gZW5jb2RpbmcpIHsgLy8gYWxsIGNoYW5uZWxzIGluIGVuY29kaW5nIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAoIXN1cHBvcnRlZENoYW5uZWxzW2NoYW5uZWxdKSB7XG4gICAgICByZXR1cm4gJ0VuY29kaW5nIGNoYW5uZWwgXFxcIicgKyBjaGFubmVsICtcbiAgICAgICAgJ1xcXCIgaXMgbm90IHN1cHBvcnRlZCBieSBtYXJrIHR5cGUgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtYXJrID09PSBCQVIgJiYgIWVuY29kaW5nLnggJiYgIWVuY29kaW5nLnkpIHtcbiAgICByZXR1cm4gJ01pc3NpbmcgYm90aCB4IGFuZCB5IGZvciBiYXInO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=