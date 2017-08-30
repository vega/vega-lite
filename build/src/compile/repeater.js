"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../fielddef");
var log = require("../log");
function replaceRepeaterInFacet(facet, repeater) {
    return replaceRepeater(facet, repeater);
}
exports.replaceRepeaterInFacet = replaceRepeaterInFacet;
function replaceRepeaterInEncoding(encoding, repeater) {
    return replaceRepeater(encoding, repeater);
}
exports.replaceRepeaterInEncoding = replaceRepeaterInEncoding;
/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef, repeater) {
    var field = fieldDef.field;
    if (fielddef_1.isRepeatRef(field)) {
        if (field.repeat in repeater) {
            return tslib_1.__assign({}, fieldDef, { field: repeater[field.repeat] });
        }
        else {
            log.warn(log.message.noSuchRepeatedValue(field.repeat));
            return null;
        }
    }
    else {
        // field is not a repeat ref so we can just return the field def
        return fieldDef;
    }
}
function replaceRepeater(mapping, repeater) {
    var out = {};
    for (var channel in mapping) {
        if (mapping.hasOwnProperty(channel)) {
            var fieldDef = mapping[channel];
            if (vega_util_1.isArray(fieldDef)) {
                out[channel] = fieldDef.map(function (fd) { return replaceRepeaterInFieldDef(fd, repeater); })
                    .filter(function (fd) { return fd !== null; });
            }
            else {
                var fd = replaceRepeaterInFieldDef(fieldDef, repeater);
                if (fd !== null) {
                    out[channel] = fd;
                }
            }
        }
    }
    return out;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9yZXBlYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBa0M7QUFHbEMsd0NBQXlEO0FBQ3pELDRCQUE4QjtBQU85QixnQ0FBdUMsS0FBbUIsRUFBRSxRQUF1QjtJQUNqRixNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQWtCLENBQUM7QUFDM0QsQ0FBQztBQUZELHdEQUVDO0FBRUQsbUNBQTBDLFFBQXlCLEVBQUUsUUFBdUI7SUFDMUYsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFxQixDQUFDO0FBQ2pFLENBQUM7QUFGRCw4REFFQztBQUVEOztHQUVHO0FBQ0gsbUNBQW1DLFFBQXlCLEVBQUUsUUFBdUI7SUFDbkYsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUM3QixFQUFFLENBQUMsQ0FBQyxzQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxzQkFDRCxRQUFRLElBQ1gsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQzdCO1FBQ0osQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sZ0VBQWdFO1FBQ2hFLE1BQU0sQ0FBQyxRQUE0QixDQUFDO0lBQ3RDLENBQUM7QUFDSCxDQUFDO0FBSUQseUJBQXlCLE9BQStCLEVBQUUsUUFBdUI7SUFDL0UsSUFBTSxHQUFHLEdBQTRCLEVBQUUsQ0FBQztJQUN4QyxHQUFHLENBQUMsQ0FBQyxJQUFNLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQU0sUUFBUSxHQUF3QyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkUsRUFBRSxDQUFDLENBQUMsbUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEseUJBQXlCLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDO3FCQUN2RSxNQUFNLENBQUMsVUFBQyxFQUEyQixJQUFLLE9BQUEsRUFBRSxLQUFLLElBQUksRUFBWCxDQUFXLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBTSxFQUFFLEdBQUcseUJBQXlCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN6RCxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDYixDQUFDIn0=