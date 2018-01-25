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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9yZXBlYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsd0NBQStHO0FBRS9HLDRCQUE4QjtBQUM5QixnQ0FBb0M7QUFDcEMsZ0NBQWdDO0FBT2hDLGdDQUF1QyxLQUEwQixFQUFFLFFBQXVCO0lBQ3hGLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBeUIsQ0FBQztBQUNsRSxDQUFDO0FBRkQsd0RBRUM7QUFFRCxtQ0FBMEMsUUFBeUIsRUFBRSxRQUF1QjtJQUMxRixNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQXFCLENBQUM7QUFDakUsQ0FBQztBQUZELDhEQUVDO0FBRUQ7O0dBRUc7QUFDSCx1QkFBa0QsQ0FBSSxFQUFFLFFBQXVCO0lBQzdFLEVBQUUsQ0FBQyxDQUFDLHNCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9CLHNDQUFzQztZQUN0QyxNQUFNLGNBQUssQ0FBUSxJQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBRTtRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsbUNBQW1D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LEdBQUcsMkJBQTJCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3RCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNQLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmFjZXRNYXBwaW5nfSBmcm9tICcuLi9mYWNldCc7XG5pbXBvcnQge0ZpZWxkLCBoYXNDb25kaXRpb25hbEZpZWxkRGVmLCBpc0NvbmRpdGlvbmFsRGVmLCBpc0ZpZWxkRGVmLCBpc1JlcGVhdFJlZiwgVmFsdWVEZWZ9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgU2NhbGVGaWVsZERlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge2lzU29ydEZpZWxkfSBmcm9tICcuLi9zb3J0JztcbmltcG9ydCB7aXNBcnJheX0gZnJvbSAnLi4vdXRpbCc7XG5cbmV4cG9ydCB0eXBlIFJlcGVhdGVyVmFsdWUgPSB7XG4gIHJvdz86IHN0cmluZyxcbiAgY29sdW1uPzogc3RyaW5nXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVJlcGVhdGVySW5GYWNldChmYWNldDogRmFjZXRNYXBwaW5nPEZpZWxkPiwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUpOiBGYWNldE1hcHBpbmc8c3RyaW5nPiB7XG4gIHJldHVybiByZXBsYWNlUmVwZWF0ZXIoZmFjZXQsIHJlcGVhdGVyKSBhcyBGYWNldE1hcHBpbmc8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2VSZXBlYXRlckluRW5jb2RpbmcoZW5jb2Rpbmc6IEVuY29kaW5nPEZpZWxkPiwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUpOiBFbmNvZGluZzxzdHJpbmc+IHtcbiAgcmV0dXJuIHJlcGxhY2VSZXBlYXRlcihlbmNvZGluZywgcmVwZWF0ZXIpIGFzIEVuY29kaW5nPHN0cmluZz47XG59XG5cbi8qKlxuICogUmVwbGFjZXMgcmVwZWF0ZWQgdmFsdWUgYW5kIHJldHVybnMgaWYgdGhlIHJlcGVhdGVkIHZhbHVlIGlzIHZhbGlkLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVwZWF0PFQgZXh0ZW5kcyB7ZmllbGQ/OiBGaWVsZH0+KG86IFQsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlKTogVCB7XG4gIGlmIChpc1JlcGVhdFJlZihvLmZpZWxkKSkge1xuICAgIGlmIChvLmZpZWxkLnJlcGVhdCBpbiByZXBlYXRlcikge1xuICAgICAgLy8gYW55IG5lZWRlZCB0byBjYWxtIGRvd24gdHMgY29tcGlsZXJcbiAgICAgIHJldHVybiB7Li4ubyBhcyBhbnksIGZpZWxkOiByZXBlYXRlcltvLmZpZWxkLnJlcGVhdF19O1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5ub1N1Y2hSZXBlYXRlZFZhbHVlKG8uZmllbGQucmVwZWF0KSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbztcbn1cblxuLyoqXG4gKiBSZXBsYWNlIHJlcGVhdGVyIHZhbHVlcyBpbiBhIGZpZWxkIGRlZiB3aXRoIHRoZSBjb25jcmV0ZSBmaWVsZCBuYW1lLlxuICovXG5mdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXJJbkZpZWxkRGVmKGZpZWxkRGVmOiBTY2FsZUZpZWxkRGVmPEZpZWxkPiwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUpOiBTY2FsZUZpZWxkRGVmPHN0cmluZz4ge1xuICBmaWVsZERlZiA9IHJlcGxhY2VSZXBlYXQoZmllbGREZWYsIHJlcGVhdGVyKTtcblxuICBpZiAoZmllbGREZWYgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIHRoZSBmaWVsZCBkZWYgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnNvcnQgJiYgaXNTb3J0RmllbGQoZmllbGREZWYuc29ydCkpIHtcbiAgICBjb25zdCBzb3J0ID0gcmVwbGFjZVJlcGVhdChmaWVsZERlZi5zb3J0LCByZXBlYXRlcik7XG4gICAgZmllbGREZWYgPSB7XG4gICAgICAuLi5maWVsZERlZixcbiAgICAgIC4uLihzb3J0ID8ge3NvcnR9IDoge30pXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmaWVsZERlZiBhcyBTY2FsZUZpZWxkRGVmPHN0cmluZz47XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VSZXBlYXRlckluQ2hhbm5lbERlZihjaGFubmVsRGVmOiBDaGFubmVsRGVmPEZpZWxkPiwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUpOiBDaGFubmVsRGVmPHN0cmluZz4ge1xuICBpZiAoaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgIGNvbnN0IGZkID0gcmVwbGFjZVJlcGVhdGVySW5GaWVsZERlZihjaGFubmVsRGVmLCByZXBlYXRlcik7XG4gICAgaWYgKGZkKSB7XG4gICAgICByZXR1cm4gZmQ7XG4gICAgfSBlbHNlIGlmIChpc0NvbmRpdGlvbmFsRGVmKGNoYW5uZWxEZWYpKSB7XG4gICAgICByZXR1cm4ge2NvbmRpdGlvbjogY2hhbm5lbERlZi5jb25kaXRpb259O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoaGFzQ29uZGl0aW9uYWxGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgY29uc3QgZmQgPSByZXBsYWNlUmVwZWF0ZXJJbkZpZWxkRGVmKGNoYW5uZWxEZWYuY29uZGl0aW9uLCByZXBlYXRlcik7XG4gICAgICBpZiAoZmQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5jaGFubmVsRGVmLFxuICAgICAgICAgIGNvbmRpdGlvbjogZmRcbiAgICAgICAgfSBhcyBDaGFubmVsRGVmPHN0cmluZz47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7Y29uZGl0aW9uLCAuLi5jaGFubmVsRGVmV2l0aG91dENvbmRpdGlvbn0gPSBjaGFubmVsRGVmO1xuICAgICAgICByZXR1cm4gY2hhbm5lbERlZldpdGhvdXRDb25kaXRpb24gYXMgQ2hhbm5lbERlZjxzdHJpbmc+O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhbm5lbERlZiBhcyBWYWx1ZURlZjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG50eXBlIEVuY29kaW5nT3JGYWNldDxGPiA9IEVuY29kaW5nPEY+IHwgRmFjZXRNYXBwaW5nPEY+O1xuXG5mdW5jdGlvbiByZXBsYWNlUmVwZWF0ZXIobWFwcGluZzogRW5jb2RpbmdPckZhY2V0PEZpZWxkPiwgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUpOiBFbmNvZGluZ09yRmFjZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IG91dDogRW5jb2RpbmdPckZhY2V0PHN0cmluZz4gPSB7fTtcbiAgZm9yIChjb25zdCBjaGFubmVsIGluIG1hcHBpbmcpIHtcbiAgICBpZiAobWFwcGluZy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKSkge1xuICAgICAgY29uc3QgY2hhbm5lbERlZjogQ2hhbm5lbERlZjxGaWVsZD4gfCBDaGFubmVsRGVmPEZpZWxkPltdID0gbWFwcGluZ1tjaGFubmVsXTtcblxuICAgICAgaWYgKGlzQXJyYXkoY2hhbm5lbERlZikpIHtcbiAgICAgICAgLy8gYXJyYXkgY2Fubm90IGhhdmUgY29uZGl0aW9uXG4gICAgICAgIG91dFtjaGFubmVsXSA9IGNoYW5uZWxEZWYubWFwKGNkID0+IHJlcGxhY2VSZXBlYXRlckluQ2hhbm5lbERlZihjZCwgcmVwZWF0ZXIpKVxuICAgICAgICAgIC5maWx0ZXIoY2QgPT4gY2QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2QgPSByZXBsYWNlUmVwZWF0ZXJJbkNoYW5uZWxEZWYoY2hhbm5lbERlZiwgcmVwZWF0ZXIpO1xuICAgICAgICBpZiAoY2QpIHtcbiAgICAgICAgICBvdXRbY2hhbm5lbF0gPSBjZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIl19