"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var spec_1 = require("../spec");
var timeunit_1 = require("../timeunit");
var type_1 = require("../type");
var util_1 = require("../util");
var concat_1 = require("./concat");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var repeat_1 = require("./repeat");
var unit_1 = require("./unit");
function buildModel(spec, parent, parentGivenName, unitSize, repeater, config) {
    if (spec_1.isFacetSpec(spec)) {
        return new facet_1.FacetModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isLayerSpec(spec)) {
        return new layer_1.LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isUnitSpec(spec)) {
        return new unit_1.UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isRepeatSpec(spec)) {
        return new repeat_1.RepeatModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isConcatSpec(spec)) {
        return new concat_1.ConcatModel(spec, parent, parentGivenName, repeater, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.buildModel = buildModel;
function applyConfig(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList) {
    for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
        var property = propsList_1[_i];
        var value = config[property];
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
exports.applyConfig = applyConfig;
function applyMarkConfig(e, model, propsList) {
    for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
        var property = propsList_2[_i];
        var value = getMarkConfig(property, model.mark(), model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
exports.applyMarkConfig = applyMarkConfig;
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
function getMarkConfig(prop, mark, config) {
    var markSpecificConfig = config[mark];
    if (markSpecificConfig[prop] !== undefined) {
        return markSpecificConfig[prop];
    }
    return config.mark[prop];
}
exports.getMarkConfig = getMarkConfig;
function formatSignalRef(fieldDef, specifiedFormat, expr, config, useBinRange) {
    if (fieldDef.type === 'quantitative') {
        var format = numberFormat(fieldDef, specifiedFormat, config, 'text');
        if (fieldDef.bin) {
            if (useBinRange) {
                // For bin range, no need to apply format as the formula that creates range already include format
                return { signal: fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'range' }) };
            }
            else {
                return {
                    signal: "format(" + fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'start' }) + ", '" + format + "')" + "+'-'+" +
                        ("format(" + fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'end' }) + ", '" + format + "')")
                };
            }
        }
        else {
            return {
                signal: "format(" + fielddef_1.field(fieldDef, { expr: expr }) + ", '" + format + "')"
            };
        }
    }
    else if (fieldDef.type === 'temporal') {
        return {
            signal: timeFormatExpression(fielddef_1.field(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat)
        };
    }
    else {
        return { signal: fielddef_1.field(fieldDef, { expr: expr }) };
    }
}
exports.formatSignalRef = formatSignalRef;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
function numberFormat(fieldDef, specifiedFormat, config, channel) {
    // Specified format in axis/legend has higher precedence than fieldDef.format
    var format = specifiedFormat;
    if (fieldDef.type === type_1.QUANTITATIVE) {
        // add number format for quantitative type only
        if (format) {
            return format;
        }
        else if (fieldDef.aggregate === 'count' && channel === channel_1.TEXT) {
            // FIXME: need a more holistic way to deal with this.
            return 'd';
        }
        // TODO: need to make this work correctly for numeric ordinal / nominal type
        return config.numberFormat;
    }
    return undefined;
}
exports.numberFormat = numberFormat;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig) {
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        var _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
        return "timeFormat(" + field + ", '" + _format + "')";
    }
    else {
        return timeunit_1.formatExpression(timeUnit, field, shortTimeLabels);
    }
}
exports.timeFormatExpression = timeFormatExpression;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
function sortParams(orderDef) {
    return (util_1.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(fielddef_1.field(orderChannelDef, { binSuffix: 'start' }));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
exports.sortParams = sortParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQThCO0FBRTlCLHNDQUF5QztBQUV6Qyx3Q0FBMkQ7QUFFM0QsZ0NBQXlHO0FBRXpHLHdDQUE2QztBQUM3QyxnQ0FBcUM7QUFDckMsZ0NBQWdDO0FBRWhDLG1DQUFxQztBQUNyQyxpQ0FBbUM7QUFDbkMsaUNBQW1DO0FBRW5DLG1DQUFvRDtBQUNwRCwrQkFBaUM7QUFHakMsb0JBQTJCLElBQVUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDM0UsUUFBa0IsRUFBRSxRQUF1QixFQUFFLE1BQWM7SUFDM0QsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxvQkFBVyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBdkJELGdDQXVCQztBQUVELHFCQUE0QixDQUFnQixFQUN4QyxNQUE0QyxFQUFFLG9EQUFvRDtJQUNsRyxTQUFtQjtJQUNyQixHQUFHLENBQUMsQ0FBbUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQy9CLENBQUM7S0FDRjtJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBVkQsa0NBVUM7QUFFRCx5QkFBZ0MsQ0FBZ0IsRUFBRSxLQUFnQixFQUFFLFNBQStCO0lBQ2pHLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFSRCwwQ0FRQztBQUVEOzs7R0FHRztBQUNILHVCQUEwRCxJQUFPLEVBQUUsSUFBVSxFQUFFLE1BQWM7SUFDM0YsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFORCxzQ0FNQztBQUVELHlCQUFnQyxRQUEwQixFQUFFLGVBQXVCLEVBQUUsSUFBd0IsRUFBRSxNQUFjLEVBQUUsV0FBcUI7SUFDbEosRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixrR0FBa0c7Z0JBQ2xHLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUM7WUFDL0QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQztvQkFDTCxNQUFNLEVBQUUsWUFBVSxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxXQUFNLE1BQU0sT0FBSSxHQUFHLE9BQU87eUJBQ3JGLFlBQVUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsV0FBTSxNQUFNLE9BQUksQ0FBQTtpQkFDdEUsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLFlBQVUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFDLFdBQU0sTUFBTSxPQUFJO2FBQzFELENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLG9CQUFvQixDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxNQUFBLEVBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUM7U0FDMUksQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFDLENBQUMsRUFBQyxDQUFDO0lBQzNDLENBQUM7QUFDSCxDQUFDO0FBekJELDBDQXlCQztBQUVEOzs7O0dBSUc7QUFDSCxzQkFBNkIsUUFBMEIsRUFBRSxlQUF1QixFQUFFLE1BQWMsRUFBRSxPQUFnQjtJQUNoSCw2RUFBNkU7SUFDN0UsSUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDO0lBQy9CLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxDQUFDLENBQUM7UUFDbkMsK0NBQStDO1FBRS9DLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksT0FBTyxLQUFLLGNBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUQscURBQXFEO1lBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsNEVBQTRFO1FBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFoQkQsb0NBZ0JDO0FBRUQ7O0dBRUc7QUFDSCw4QkFBcUMsS0FBYSxFQUFFLFFBQWtCLEVBQUUsTUFBYyxFQUFFLGVBQXdCLEVBQUUsZ0JBQXdCO0lBQ3hJLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEIsd0ZBQXdGO1FBQ3hGLElBQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLHNEQUFzRDtRQUNsRyxNQUFNLENBQUMsZ0JBQWMsS0FBSyxXQUFNLE9BQU8sT0FBSSxDQUFDO0lBQzlDLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQywyQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzVELENBQUM7QUFDSCxDQUFDO0FBUkQsb0RBUUM7QUFFRDs7R0FFRztBQUNILG9CQUEyQixRQUF5RDtJQUNsRixNQUFNLENBQUMsQ0FBQyxjQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsZUFBZTtRQUMzRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBSyxDQUFDLGVBQWUsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBTkQsZ0NBTUMifQ==