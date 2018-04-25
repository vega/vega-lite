import { toSet } from 'vega-util';
import { isMarkDef } from './mark';
import { BAR } from './mark';
/**
 * Required Encoding Channels for each mark type
 */
export var DEFAULT_REQUIRED_CHANNEL_MAP = {
    text: ['text'],
    line: ['x', 'y'],
    trail: ['x', 'y'],
    area: ['x', 'y']
};
/**
 * Supported Encoding Channel for each mark type
 */
export var DEFAULT_SUPPORTED_CHANNEL_TYPE = {
    bar: toSet(['row', 'column', 'x', 'y', 'size', 'color', 'fill', 'stroke', 'detail']),
    line: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail']),
    trail: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail', 'size']),
    area: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
    tick: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
    circle: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
    square: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
    point: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail', 'shape']),
    geoshape: toSet(['row', 'column', 'color', 'fill', 'stroke', 'detail', 'shape']),
    text: toSet(['row', 'column', 'size', 'color', 'fill', 'stroke', 'text']) // TODO(#724) revise
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
export function getEncodingMappingError(spec, requiredChannelMap, supportedChannelMap) {
    if (requiredChannelMap === void 0) { requiredChannelMap = DEFAULT_REQUIRED_CHANNEL_MAP; }
    if (supportedChannelMap === void 0) { supportedChannelMap = DEFAULT_SUPPORTED_CHANNEL_TYPE; }
    var mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
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
    if (mark === BAR && !encoding.x && !encoding.y) {
        return 'Missing both x and y for bar';
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNoQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFVM0I7O0dBRUc7QUFDSCxNQUFNLENBQUMsSUFBTSw0QkFBNEIsR0FBdUI7SUFDOUQsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2QsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUNoQixLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ2pCLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Q0FDakIsQ0FBQztBQVFGOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sOEJBQThCLEdBQXdCO0lBQ2pFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BGLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RGLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvRixJQUFJLEVBQUUsS0FBSyxDQUFDLENB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dXRpbCc7XG5pbXBvcnQge2lzTWFya0RlZn0gZnJvbSAnLi9tYXJrJztcbmltcG9ydCB7QkFSfSBmcm9tICcuL21hcmsnO1xuaW1wb3J0IHtGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWN9IGZyb20gJy4vc3BlYyc7XG5cblxuXG4vLyBUT0RPOiBtb3ZlIHRvIHZsLnNwZWMudmFsaWRhdG9yP1xuZXhwb3J0IGludGVyZmFjZSBSZXF1aXJlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXTogQXJyYXk8c3RyaW5nPjtcbn1cblxuLyoqXG4gKiBSZXF1aXJlZCBFbmNvZGluZyBDaGFubmVscyBmb3IgZWFjaCBtYXJrIHR5cGVcbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUkVRVUlSRURfQ0hBTk5FTF9NQVA6IFJlcXVpcmVkQ2hhbm5lbE1hcCA9IHtcbiAgdGV4dDogWyd0ZXh0J10sXG4gIGxpbmU6IFsneCcsICd5J10sXG4gIHRyYWlsOiBbJ3gnLCAneSddLFxuICBhcmVhOiBbJ3gnLCAneSddXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN1cHBvcnRlZENoYW5uZWxNYXAge1xuICBbbWFyazogc3RyaW5nXToge1xuICAgIFtjaGFubmVsOiBzdHJpbmddOiBib29sZWFuXG4gIH07XG59XG5cbi8qKlxuICogU3VwcG9ydGVkIEVuY29kaW5nIENoYW5uZWwgZm9yIGVhY2ggbWFyayB0eXBlXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NVUFBPUlRFRF9DSEFOTkVMX1RZUEU6IFN1cHBvcnRlZENoYW5uZWxNYXAgPSB7XG4gIGJhcjogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdzaXplJywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2RldGFpbCddKSxcbiAgbGluZTogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdjb2xvcicsICdkZXRhaWwnXSksXG4gIHRyYWlsOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2NvbG9yJywgJ2RldGFpbCcsICdzaXplJ10pLFxuICBhcmVhOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ2RldGFpbCddKSxcbiAgdGljazogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdkZXRhaWwnXSksXG4gIGNpcmNsZTogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdzaXplJywgJ2RldGFpbCddKSxcbiAgc3F1YXJlOiB0b1NldChbJ3JvdycsICdjb2x1bW4nLCAneCcsICd5JywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ3NpemUnLCAnZGV0YWlsJ10pLFxuICBwb2ludDogdG9TZXQoWydyb3cnLCAnY29sdW1uJywgJ3gnLCAneScsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdzaXplJywgJ2RldGFpbCcsICdzaGFwZSddKSxcbiAgZ2Vvc2hhcGU6IHRvU2V0KFsncm93JywgJ2NvbHVtbicsICdjb2xvcicsICdmaWxsJywgJ3N0cm9rZScsICdkZXRhaWwnLCAnc2hhcGUnXSksXG4gIHRleHQ6IHRvU2V0KFsncm93JywgJ2NvbHVtbicsICdzaXplJywgJ2NvbG9yJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ3RleHQnXSkgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETygjNzI0KSByZXZpc2Vcbn07XG5cbi8vIFRPRE86IGNvbnNpZGVyIGlmIHdlIHNob3VsZCBhZGQgdmFsaWRhdGUgbWV0aG9kIGFuZFxuLy8gcmVxdWlyZXMgWlNjaGVtYSBpbiB0aGUgbWFpbiB2ZWdhLWxpdGUgcmVwb1xuXG4vKipcbiAqIEZ1cnRoZXIgY2hlY2sgaWYgZW5jb2RpbmcgbWFwcGluZyBvZiBhIHNwZWMgaXMgaW52YWxpZCBhbmRcbiAqIHJldHVybiBlcnJvciBpZiBpdCBpcyBpbnZhbGlkLlxuICpcbiAqIFRoaXMgY2hlY2tzIGlmXG4gKiAoMSkgYWxsIHRoZSByZXF1aXJlZCBlbmNvZGluZyBjaGFubmVscyBmb3IgdGhlIG1hcmsgdHlwZSBhcmUgc3BlY2lmaWVkXG4gKiAoMikgYWxsIHRoZSBzcGVjaWZpZWQgZW5jb2RpbmcgY2hhbm5lbHMgYXJlIHN1cHBvcnRlZCBieSB0aGUgbWFyayB0eXBlXG4gKiBAcGFyYW0gIHtbdHlwZV19IHNwZWMgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UmVxdWlyZWRDaGFubmVsTWFwID0gRGVmYXVsdFJlcXVpcmVkQ2hhbm5lbE1hcH0gIHJlcXVpcmVkQ2hhbm5lbE1hcFxuICogQHBhcmFtICB7U3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERlZmF1bHRTdXBwb3J0ZWRDaGFubmVsTWFwfSBzdXBwb3J0ZWRDaGFubmVsTWFwXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybiBvbmUgcmVhc29uIHdoeSB0aGUgZW5jb2RpbmcgaXMgaW52YWxpZCxcbiAqICAgICAgICAgICAgICAgICAgb3IgbnVsbCBpZiB0aGUgZW5jb2RpbmcgaXMgdmFsaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvZGluZ01hcHBpbmdFcnJvcihzcGVjOiBGYWNldGVkQ29tcG9zaXRlVW5pdFNwZWMsXG4gIHJlcXVpcmVkQ2hhbm5lbE1hcDogUmVxdWlyZWRDaGFubmVsTWFwID0gREVGQVVMVF9SRVFVSVJFRF9DSEFOTkVMX01BUCxcbiAgc3VwcG9ydGVkQ2hhbm5lbE1hcDogU3VwcG9ydGVkQ2hhbm5lbE1hcCA9IERFRkFVTFRfU1VQUE9SVEVEX0NIQU5ORUxfVFlQRVxuICApIHtcbiAgY29uc3QgbWFyayA9IGlzTWFya0RlZihzcGVjLm1hcmspID8gc3BlYy5tYXJrLnR5cGUgOiBzcGVjLm1hcms7XG4gIGNvbnN0IGVuY29kaW5nID0gc3BlYy5lbmNvZGluZztcbiAgY29uc3QgcmVxdWlyZWRDaGFubmVscyA9IHJlcXVpcmVkQ2hhbm5lbE1hcFttYXJrXTtcbiAgY29uc3Qgc3VwcG9ydGVkQ2hhbm5lbHMgPSBzdXBwb3J0ZWRDaGFubmVsTWFwW21hcmtdO1xuXG4gIGZvciAoY29uc3QgaSBpbiByZXF1aXJlZENoYW5uZWxzKSB7IC8vIGFsbCByZXF1aXJlZCBjaGFubmVscyBhcmUgaW4gZW5jb2RpbmdgXG4gICAgaWYgKCEocmVxdWlyZWRDaGFubmVsc1tpXSBpbiBlbmNvZGluZykpIHtcbiAgICAgIHJldHVybiAnTWlzc2luZyBlbmNvZGluZyBjaGFubmVsIFxcXCInICsgcmVxdWlyZWRDaGFubmVsc1tpXSArXG4gICAgICAgICdcXFwiIGZvciBtYXJrIFxcXCInICsgbWFyayArICdcXFwiJztcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IGNoYW5uZWwgaW4gZW5jb2RpbmcpIHsgLy8gYWxsIGNoYW5uZWxzIGluIGVuY29kaW5nIGFyZSBzdXBwb3J0ZWRcbiAgICBpZiAoIXN1cHBvcnRlZENoYW5uZWxzW2NoYW5uZWxdKSB7XG4gICAgICByZXR1cm4gJ0VuY29kaW5nIGNoYW5uZWwgXFxcIicgKyBjaGFubmVsICtcbiAgICAgICAgJ1xcXCIgaXMgbm90IHN1cHBvcnRlZCBieSBtYXJrIHR5cGUgXFxcIicgKyBtYXJrICsgJ1xcXCInO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtYXJrID09PSBCQVIgJiYgIWVuY29kaW5nLnggJiYgIWVuY29kaW5nLnkpIHtcbiAgICByZXR1cm4gJ01pc3NpbmcgYm90aCB4IGFuZCB5IGZvciBiYXInO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=