import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { hasConditionalFieldDef, isConditionalDef, isFieldDef, isRepeatRef } from '../fielddef';
import * as log from '../log';
import { isSortField } from '../sort';
export function replaceRepeaterInFacet(facet, repeater) {
    return replaceRepeater(facet, repeater);
}
export function replaceRepeaterInEncoding(encoding, repeater) {
    return replaceRepeater(encoding, repeater);
}
/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeat(o, repeater) {
    if (isRepeatRef(o.field)) {
        if (o.field.repeat in repeater) {
            // any needed to calm down ts compiler
            return tslib_1.__assign({}, o, { field: repeater[o.field.repeat] });
        }
        else {
            log.warn(log.message.noSuchRepeatedValue(o.field.repeat));
            return undefined;
        }
    }
    return o;
}
/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef, repeater) {
    fieldDef = replaceRepeat(fieldDef, repeater);
    if (fieldDef === undefined) {
        // the field def should be ignored
        return undefined;
    }
    if (fieldDef.sort && isSortField(fieldDef.sort)) {
        var sort = replaceRepeat(fieldDef.sort, repeater);
        fieldDef = tslib_1.__assign({}, fieldDef, (sort ? { sort: sort } : {}));
    }
    return fieldDef;
}
function replaceRepeaterInChannelDef(channelDef, repeater) {
    if (isFieldDef(channelDef)) {
        var fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd) {
            return fd;
        }
        else if (isConditionalDef(channelDef)) {
            return { condition: channelDef.condition };
        }
    }
    else {
        if (hasConditionalFieldDef(channelDef)) {
            var fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
            if (fd) {
                return tslib_1.__assign({}, channelDef, { condition: fd });
            }
            else {
                var condition = channelDef.condition, channelDefWithoutCondition = tslib_1.__rest(channelDef, ["condition"]);
                return channelDefWithoutCondition;
            }
        }
        return channelDef;
    }
    return undefined;
}
function replaceRepeater(mapping, repeater) {
    var out = {};
    for (var channel in mapping) {
        if (mapping.hasOwnProperty(channel)) {
            var channelDef = mapping[channel];
            if (isArray(channelDef)) {
                // array cannot have condition
                out[channel] = channelDef.map(function (cd) { return replaceRepeaterInChannelDef(cd, repeater); })
                    .filter(function (cd) { return cd; });
            }
            else {
                var cd = replaceRepeaterInChannelDef(channelDef, repeater);
                if (cd) {
                    out[channel] = cd;
                }
            }
        }
    }
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9yZXBlYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdsQyxPQUFPLEVBQVEsc0JBQXNCLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBVyxNQUFNLGFBQWEsQ0FBQztBQUUvRyxPQUFPLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBT3BDLE1BQU0saUNBQWlDLEtBQTBCLEVBQUUsUUFBdUI7SUFDeEYsT0FBTyxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBeUIsQ0FBQztBQUNsRSxDQUFDO0FBRUQsTUFBTSxvQ0FBb0MsUUFBeUIsRUFBRSxRQUF1QjtJQUMxRixPQUFPLGVBQWUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFxQixDQUFDO0FBQ2pFLENBQUM7QUFFRDs7R0FFRztBQUNILHVCQUFrRCxDQUFJLEVBQUUsUUFBdUI7SUFDN0UsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFO1lBQzlCLHNDQUFzQztZQUN0Qyw0QkFBVyxDQUFRLElBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFFO1NBQ3ZEO2FBQU07WUFDTCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRDs7R0FFRztBQUNILG1DQUFtQyxRQUE4QixFQUFFLFFBQXVCO0lBQ3hGLFFBQVEsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRTdDLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUMxQixrQ0FBa0M7UUFDbEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMvQyxJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxRQUFRLHdCQUNILFFBQVEsRUFDUixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDeEIsQ0FBQztLQUNIO0lBRUQsT0FBTyxRQUFpQyxDQUFDO0FBQzNDLENBQUM7QUFFRCxxQ0FBcUMsVUFBNkIsRUFBRSxRQUF1QjtJQUN6RixJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUMxQixJQUFNLEVBQUUsR0FBRyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0QsSUFBSSxFQUFFLEVBQUU7WUFDTixPQUFPLEVBQUUsQ0FBQztTQUNYO2FBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN2QyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEVBQUMsQ0FBQztTQUMxQztLQUNGO1NBQU07UUFDTCxJQUFJLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3RDLElBQU0sRUFBRSxHQUFHLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDckUsSUFBSSxFQUFFLEVBQUU7Z0JBQ04sT0FBTyxxQkFDRixVQUFVLElBQ2IsU0FBUyxFQUFFLEVBQUUsR0FDUSxDQUFDO2FBQ3pCO2lCQUFNO2dCQUNFLElBQUEsZ0NBQVMsRUFBRSxzRUFBNkIsQ0FBZTtnQkFDOUQsT0FBTywwQkFBZ0QsQ0FBQzthQUN6RDtTQUNGO1FBQ0QsT0FBTyxVQUFzQixDQUFDO0tBQy9CO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQUlELHlCQUF5QixPQUErQixFQUFFLFFBQXVCO0lBQy9FLElBQU0sR0FBRyxHQUE0QixFQUFFLENBQUM7SUFDeEMsS0FBSyxJQUFNLE9BQU8sSUFBSSxPQUFPLEVBQUU7UUFDN0IsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ25DLElBQU0sVUFBVSxHQUE0QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFN0UsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3ZCLDhCQUE4QjtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSwyQkFBMkIsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQXpDLENBQXlDLENBQUM7cUJBQzNFLE1BQU0sQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEVBQUUsRUFBRixDQUFFLENBQUMsQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxJQUFNLEVBQUUsR0FBRywyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzdELElBQUksRUFBRSxFQUFFO29CQUNOLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ25CO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtGYWNldE1hcHBpbmd9IGZyb20gJy4uL2ZhY2V0JztcbmltcG9ydCB7RmllbGQsIGhhc0NvbmRpdGlvbmFsRmllbGREZWYsIGlzQ29uZGl0aW9uYWxEZWYsIGlzRmllbGREZWYsIGlzUmVwZWF0UmVmLCBWYWx1ZURlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBTY2FsZUZpZWxkRGVmfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aXNTb3J0RmllbGR9IGZyb20gJy4uL3NvcnQnO1xuXG5leHBvcnQgdHlwZSBSZXBlYXRlclZhbHVlID0ge1xuICByb3c/OiBzdHJpbmcsXG4gIGNvbHVtbj86IHN0cmluZ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VSZXBlYXRlckluRmFjZXQoZmFjZXQ6IEZhY2V0TWFwcGluZzxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRmFjZXRNYXBwaW5nPHN0cmluZz4ge1xuICByZXR1cm4gcmVwbGFjZVJlcGVhdGVyKGZhY2V0LCByZXBlYXRlcikgYXMgRmFjZXRNYXBwaW5nPHN0cmluZz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKGVuY29kaW5nOiBFbmNvZGluZzxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRW5jb2Rpbmc8c3RyaW5nPiB7XG4gIHJldHVybiByZXBsYWNlUmVwZWF0ZXIoZW5jb2RpbmcsIHJlcGVhdGVyKSBhcyBFbmNvZGluZzxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIHJlcGVhdGVkIHZhbHVlIGFuZCByZXR1cm5zIGlmIHRoZSByZXBlYXRlZCB2YWx1ZSBpcyB2YWxpZC5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdDxUIGV4dGVuZHMge2ZpZWxkPzogRmllbGR9PihvOiBULCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSk6IFQge1xuICBpZiAoaXNSZXBlYXRSZWYoby5maWVsZCkpIHtcbiAgICBpZiAoby5maWVsZC5yZXBlYXQgaW4gcmVwZWF0ZXIpIHtcbiAgICAgIC8vIGFueSBuZWVkZWQgdG8gY2FsbSBkb3duIHRzIGNvbXBpbGVyXG4gICAgICByZXR1cm4gey4uLm8gYXMgYW55LCBmaWVsZDogcmVwZWF0ZXJbby5maWVsZC5yZXBlYXRdfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uubm9TdWNoUmVwZWF0ZWRWYWx1ZShvLmZpZWxkLnJlcGVhdCkpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG87XG59XG5cbi8qKlxuICogUmVwbGFjZSByZXBlYXRlciB2YWx1ZXMgaW4gYSBmaWVsZCBkZWYgd2l0aCB0aGUgY29uY3JldGUgZmllbGQgbmFtZS5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdGVySW5GaWVsZERlZihmaWVsZERlZjogU2NhbGVGaWVsZERlZjxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogU2NhbGVGaWVsZERlZjxzdHJpbmc+IHtcbiAgZmllbGREZWYgPSByZXBsYWNlUmVwZWF0KGZpZWxkRGVmLCByZXBlYXRlcik7XG5cbiAgaWYgKGZpZWxkRGVmID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyB0aGUgZmllbGQgZGVmIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi5zb3J0ICYmIGlzU29ydEZpZWxkKGZpZWxkRGVmLnNvcnQpKSB7XG4gICAgY29uc3Qgc29ydCA9IHJlcGxhY2VSZXBlYXQoZmllbGREZWYuc29ydCwgcmVwZWF0ZXIpO1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZmllbGREZWYgYXMgU2NhbGVGaWVsZERlZjxzdHJpbmc+O1xufVxuXG5mdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXJJbkNoYW5uZWxEZWYoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogQ2hhbm5lbERlZjxzdHJpbmc+IHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBmZCA9IHJlcGxhY2VSZXBlYXRlckluRmllbGREZWYoY2hhbm5lbERlZiwgcmVwZWF0ZXIpO1xuICAgIGlmIChmZCkge1xuICAgICAgcmV0dXJuIGZkO1xuICAgIH0gZWxzZSBpZiAoaXNDb25kaXRpb25hbERlZihjaGFubmVsRGVmKSkge1xuICAgICAgcmV0dXJuIHtjb25kaXRpb246IGNoYW5uZWxEZWYuY29uZGl0aW9ufTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGNvbnN0IGZkID0gcmVwbGFjZVJlcGVhdGVySW5GaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbiwgcmVwZWF0ZXIpO1xuICAgICAgaWYgKGZkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2hhbm5lbERlZixcbiAgICAgICAgICBjb25kaXRpb246IGZkXG4gICAgICAgIH0gYXMgQ2hhbm5lbERlZjxzdHJpbmc+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qge2NvbmRpdGlvbiwgLi4uY2hhbm5lbERlZldpdGhvdXRDb25kaXRpb259ID0gY2hhbm5lbERlZjtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWxEZWZXaXRob3V0Q29uZGl0aW9uIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYW5uZWxEZWYgYXMgVmFsdWVEZWY7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxudHlwZSBFbmNvZGluZ09yRmFjZXQ8Rj4gPSBFbmNvZGluZzxGPiB8IEZhY2V0TWFwcGluZzxGPjtcblxuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdGVyKG1hcHBpbmc6IEVuY29kaW5nT3JGYWNldDxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRW5jb2RpbmdPckZhY2V0PHN0cmluZz4ge1xuICBjb25zdCBvdXQ6IEVuY29kaW5nT3JGYWNldDxzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgY2hhbm5lbCBpbiBtYXBwaW5nKSB7XG4gICAgaWYgKG1hcHBpbmcuaGFzT3duUHJvcGVydHkoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8RmllbGQ+IHwgQ2hhbm5lbERlZjxGaWVsZD5bXSA9IG1hcHBpbmdbY2hhbm5lbF07XG5cbiAgICAgIGlmIChpc0FycmF5KGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIC8vIGFycmF5IGNhbm5vdCBoYXZlIGNvbmRpdGlvblxuICAgICAgICBvdXRbY2hhbm5lbF0gPSBjaGFubmVsRGVmLm1hcChjZCA9PiByZXBsYWNlUmVwZWF0ZXJJbkNoYW5uZWxEZWYoY2QsIHJlcGVhdGVyKSlcbiAgICAgICAgICAuZmlsdGVyKGNkID0+IGNkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNkID0gcmVwbGFjZVJlcGVhdGVySW5DaGFubmVsRGVmKGNoYW5uZWxEZWYsIHJlcGVhdGVyKTtcbiAgICAgICAgaWYgKGNkKSB7XG4gICAgICAgICAgb3V0W2NoYW5uZWxdID0gY2Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiJdfQ==