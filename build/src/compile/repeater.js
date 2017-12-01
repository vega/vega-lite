"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../fielddef");
var log = require("../log");
var sort_1 = require("../sort");
var util_1 = require("../util");
function replaceRepeaterInFacet(facet, repeater) {
    return replaceRepeater(facet, repeater);
}
exports.replaceRepeaterInFacet = replaceRepeaterInFacet;
function replaceRepeaterInEncoding(encoding, repeater) {
    return replaceRepeater(encoding, repeater);
}
exports.replaceRepeaterInEncoding = replaceRepeaterInEncoding;
/**
 * Replaces repeated value and returns if the repeated value is valid.
 */
function replaceRepeat(o, repeater) {
    if (fielddef_1.isRepeatRef(o.field)) {
        if (o.field.repeat in repeater) {
            // any needed to calm down ts compiler
            return __assign({}, o, { field: repeater[o.field.repeat] });
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
    if (fieldDef.sort && sort_1.isSortField(fieldDef.sort)) {
        var sort = replaceRepeat(fieldDef.sort, repeater);
        fieldDef = __assign({}, fieldDef, (sort ? { sort: sort } : {}));
    }
    return fieldDef;
}
function replaceRepeaterInChannelDef(channelDef, repeater) {
    if (fielddef_1.isFieldDef(channelDef)) {
        var fd = replaceRepeaterInFieldDef(channelDef, repeater);
        if (fd) {
            return fd;
        }
        else if (fielddef_1.isConditionalDef(channelDef)) {
            return { condition: channelDef.condition };
        }
    }
    else {
        if (fielddef_1.hasConditionalFieldDef(channelDef)) {
            var fd = replaceRepeaterInFieldDef(channelDef.condition, repeater);
            if (fd) {
                return __assign({}, channelDef, { condition: fd });
            }
            else {
                var condition = channelDef.condition, channelDefWithoutCondition = __rest(channelDef, ["condition"]);
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
            if (util_1.isArray(channelDef)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9yZXBlYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsd0NBQXlIO0FBRXpILDRCQUE4QjtBQUM5QixnQ0FBb0M7QUFDcEMsZ0NBQWdDO0FBT2hDLGdDQUF1QyxLQUEwQixFQUFFLFFBQXVCO0lBQ3hGLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBeUIsQ0FBQztBQUNsRSxDQUFDO0FBRkQsd0RBRUM7QUFFRCxtQ0FBMEMsUUFBeUIsRUFBRSxRQUF1QjtJQUMxRixNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQXFCLENBQUM7QUFDakUsQ0FBQztBQUZELDhEQUVDO0FBRUQ7O0dBRUc7QUFDSCx1QkFBa0QsQ0FBSSxFQUFFLFFBQXVCO0lBQzdFLEVBQUUsQ0FBQyxDQUFDLHNCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9CLHNDQUFzQztZQUN0QyxNQUFNLGNBQUssQ0FBUSxJQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBRTtRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsbUNBQW1D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LEdBQUcsMkJBQTJCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3RCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNQLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmFjZXRNYXBwaW5nfSBmcm9tICcuLi9mYWNldCc7XG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZiwgaGFzQ29uZGl0aW9uYWxGaWVsZERlZiwgaXNDb25kaXRpb25hbERlZiwgaXNGaWVsZERlZiwgaXNSZXBlYXRSZWYsIFZhbHVlRGVmfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0NoYW5uZWxEZWYsIFNjYWxlRmllbGREZWZ9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtpc1NvcnRGaWVsZH0gZnJvbSAnLi4vc29ydCc7XG5pbXBvcnQge2lzQXJyYXl9IGZyb20gJy4uL3V0aWwnO1xuXG5leHBvcnQgdHlwZSBSZXBlYXRlclZhbHVlID0ge1xuICByb3c/OiBzdHJpbmcsXG4gIGNvbHVtbj86IHN0cmluZ1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VSZXBlYXRlckluRmFjZXQoZmFjZXQ6IEZhY2V0TWFwcGluZzxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRmFjZXRNYXBwaW5nPHN0cmluZz4ge1xuICByZXR1cm4gcmVwbGFjZVJlcGVhdGVyKGZhY2V0LCByZXBlYXRlcikgYXMgRmFjZXRNYXBwaW5nPHN0cmluZz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKGVuY29kaW5nOiBFbmNvZGluZzxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRW5jb2Rpbmc8c3RyaW5nPiB7XG4gIHJldHVybiByZXBsYWNlUmVwZWF0ZXIoZW5jb2RpbmcsIHJlcGVhdGVyKSBhcyBFbmNvZGluZzxzdHJpbmc+O1xufVxuXG4vKipcbiAqIFJlcGxhY2VzIHJlcGVhdGVkIHZhbHVlIGFuZCByZXR1cm5zIGlmIHRoZSByZXBlYXRlZCB2YWx1ZSBpcyB2YWxpZC5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdDxUIGV4dGVuZHMge2ZpZWxkPzogRmllbGR9PihvOiBULCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSk6IFQge1xuICBpZiAoaXNSZXBlYXRSZWYoby5maWVsZCkpIHtcbiAgICBpZiAoby5maWVsZC5yZXBlYXQgaW4gcmVwZWF0ZXIpIHtcbiAgICAgIC8vIGFueSBuZWVkZWQgdG8gY2FsbSBkb3duIHRzIGNvbXBpbGVyXG4gICAgICByZXR1cm4gey4uLm8gYXMgYW55LCBmaWVsZDogcmVwZWF0ZXJbby5maWVsZC5yZXBlYXRdfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2Uubm9TdWNoUmVwZWF0ZWRWYWx1ZShvLmZpZWxkLnJlcGVhdCkpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG87XG59XG5cbi8qKlxuICogUmVwbGFjZSByZXBlYXRlciB2YWx1ZXMgaW4gYSBmaWVsZCBkZWYgd2l0aCB0aGUgY29uY3JldGUgZmllbGQgbmFtZS5cbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdGVySW5GaWVsZERlZihmaWVsZERlZjogU2NhbGVGaWVsZERlZjxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogU2NhbGVGaWVsZERlZjxzdHJpbmc+IHtcbiAgZmllbGREZWYgPSByZXBsYWNlUmVwZWF0KGZpZWxkRGVmLCByZXBlYXRlcik7XG5cbiAgaWYgKGZpZWxkRGVmID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyB0aGUgZmllbGQgZGVmIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi5zb3J0ICYmIGlzU29ydEZpZWxkKGZpZWxkRGVmLnNvcnQpKSB7XG4gICAgY29uc3Qgc29ydCA9IHJlcGxhY2VSZXBlYXQoZmllbGREZWYuc29ydCwgcmVwZWF0ZXIpO1xuICAgIGZpZWxkRGVmID0ge1xuICAgICAgLi4uZmllbGREZWYsXG4gICAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gZmllbGREZWYgYXMgU2NhbGVGaWVsZERlZjxzdHJpbmc+O1xufVxuXG5mdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXJJbkNoYW5uZWxEZWYoY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogQ2hhbm5lbERlZjxzdHJpbmc+IHtcbiAgaWYgKGlzRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICBjb25zdCBmZCA9IHJlcGxhY2VSZXBlYXRlckluRmllbGREZWYoY2hhbm5lbERlZiwgcmVwZWF0ZXIpO1xuICAgIGlmIChmZCkge1xuICAgICAgcmV0dXJuIGZkO1xuICAgIH0gZWxzZSBpZiAoaXNDb25kaXRpb25hbERlZihjaGFubmVsRGVmKSkge1xuICAgICAgcmV0dXJuIHtjb25kaXRpb246IGNoYW5uZWxEZWYuY29uZGl0aW9ufTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGhhc0NvbmRpdGlvbmFsRmllbGREZWYoY2hhbm5lbERlZikpIHtcbiAgICAgIGNvbnN0IGZkID0gcmVwbGFjZVJlcGVhdGVySW5GaWVsZERlZihjaGFubmVsRGVmLmNvbmRpdGlvbiwgcmVwZWF0ZXIpO1xuICAgICAgaWYgKGZkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uY2hhbm5lbERlZixcbiAgICAgICAgICBjb25kaXRpb246IGZkXG4gICAgICAgIH0gYXMgQ2hhbm5lbERlZjxzdHJpbmc+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qge2NvbmRpdGlvbiwgLi4uY2hhbm5lbERlZldpdGhvdXRDb25kaXRpb259ID0gY2hhbm5lbERlZjtcbiAgICAgICAgcmV0dXJuIGNoYW5uZWxEZWZXaXRob3V0Q29uZGl0aW9uIGFzIENoYW5uZWxEZWY8c3RyaW5nPjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNoYW5uZWxEZWYgYXMgVmFsdWVEZWY7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxudHlwZSBFbmNvZGluZ09yRmFjZXQ8Rj4gPSBFbmNvZGluZzxGPiB8IEZhY2V0TWFwcGluZzxGPjtcblxuZnVuY3Rpb24gcmVwbGFjZVJlcGVhdGVyKG1hcHBpbmc6IEVuY29kaW5nT3JGYWNldDxGaWVsZD4sIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogRW5jb2RpbmdPckZhY2V0PHN0cmluZz4ge1xuICBjb25zdCBvdXQ6IEVuY29kaW5nT3JGYWNldDxzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgY2hhbm5lbCBpbiBtYXBwaW5nKSB7XG4gICAgaWYgKG1hcHBpbmcuaGFzT3duUHJvcGVydHkoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEZWY6IENoYW5uZWxEZWY8RmllbGQ+IHwgQ2hhbm5lbERlZjxGaWVsZD5bXSA9IG1hcHBpbmdbY2hhbm5lbF07XG5cbiAgICAgIGlmIChpc0FycmF5KGNoYW5uZWxEZWYpKSB7XG4gICAgICAgIC8vIGFycmF5IGNhbm5vdCBoYXZlIGNvbmRpdGlvblxuICAgICAgICBvdXRbY2hhbm5lbF0gPSBjaGFubmVsRGVmLm1hcChjZCA9PiByZXBsYWNlUmVwZWF0ZXJJbkNoYW5uZWxEZWYoY2QsIHJlcGVhdGVyKSlcbiAgICAgICAgICAuZmlsdGVyKGNkID0+IGNkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNkID0gcmVwbGFjZVJlcGVhdGVySW5DaGFubmVsRGVmKGNoYW5uZWxEZWYsIHJlcGVhdGVyKTtcbiAgICAgICAgaWYgKGNkKSB7XG4gICAgICAgICAgb3V0W2NoYW5uZWxdID0gY2Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiJdfQ==