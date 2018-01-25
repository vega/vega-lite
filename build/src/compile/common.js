"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var timeunit_1 = require("../timeunit");
var type_1 = require("../type");
var util_1 = require("../util");
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
        var value = getMarkConfig(property, model.markDef, model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
exports.applyMarkConfig = applyMarkConfig;
function getStyles(mark) {
    return [].concat(mark.type, mark.style || []);
}
exports.getStyles = getStyles;
/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
function getMarkConfig(prop, mark, config) {
    // By default, read from mark config first!
    var value = config.mark[prop];
    // Then read mark specific config, which has higher precedence
    var markSpecificConfig = config[mark.type];
    if (markSpecificConfig[prop] !== undefined) {
        value = markSpecificConfig[prop];
    }
    // Then read style config, which has even higher precedence.
    var styles = getStyles(mark);
    for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
        var style = styles_1[_i];
        var styleConfig = config.style[style];
        // MarkConfig extends VgMarkConfig so a prop may not be a valid property for style
        // However here we also check if it is defined, so it is okay to cast here
        var p = prop;
        if (styleConfig && styleConfig[p] !== undefined) {
            value = styleConfig[p];
        }
    }
    return value;
}
exports.getMarkConfig = getMarkConfig;
function formatSignalRef(fieldDef, specifiedFormat, expr, config) {
    var format = numberFormat(fieldDef, specifiedFormat, config);
    if (fieldDef.bin) {
        var startField = fielddef_1.vgField(fieldDef, { expr: expr });
        var endField = fielddef_1.vgField(fieldDef, { expr: expr, binSuffix: 'end' });
        return {
            signal: binFormatExpression(startField, endField, format, config)
        };
    }
    else if (fieldDef.type === 'quantitative') {
        return {
            signal: "" + formatExpr(fielddef_1.vgField(fieldDef, { expr: expr }), format)
        };
    }
    else if (fielddef_1.isTimeFieldDef(fieldDef)) {
        var isUTCScale = fielddef_1.isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === scale_1.ScaleType.UTC;
        return {
            signal: timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale)
        };
    }
    else {
        return {
            signal: "''+" + fielddef_1.vgField(fieldDef, { expr: expr })
        };
    }
}
exports.formatSignalRef = formatSignalRef;
function getSpecifiedOrDefaultValue(specifiedValue, defaultValue) {
    if (specifiedValue !== undefined) {
        return specifiedValue;
    }
    return defaultValue;
}
exports.getSpecifiedOrDefaultValue = getSpecifiedOrDefaultValue;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
function numberFormat(fieldDef, specifiedFormat, config) {
    if (fieldDef.type === type_1.QUANTITATIVE) {
        // add number format for quantitative type only
        // Specified format in axis/legend has higher precedence than fieldDef.format
        if (specifiedFormat) {
            return specifiedFormat;
        }
        // TODO: need to make this work correctly for numeric ordinal / nominal type
        return config.numberFormat;
    }
    return undefined;
}
exports.numberFormat = numberFormat;
function formatExpr(field, format) {
    return "format(" + field + ", \"" + (format || '') + "\")";
}
function numberFormatExpr(field, specifiedFormat, config) {
    return formatExpr(field, specifiedFormat || config.numberFormat);
}
exports.numberFormatExpr = numberFormatExpr;
function binFormatExpression(startField, endField, format, config) {
    return startField + " === null || isNaN(" + startField + ") ? \"null\" : " + numberFormatExpr(startField, format, config) + " + \" - \" + " + numberFormatExpr(endField, format, config);
}
exports.binFormatExpression = binFormatExpression;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig, isUTCScale) {
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        var _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
        if (isUTCScale) {
            return "utcFormat(" + field + ", '" + _format + "')";
        }
        else {
            return "timeFormat(" + field + ", '" + _format + "')";
        }
    }
    else {
        return timeunit_1.formatExpression(timeUnit, field, shortTimeLabels, isUTCScale);
    }
}
exports.timeFormatExpression = timeFormatExpression;
/**
 * Return Vega sort parameters (tuple of field and order).
 */
function sortParams(orderDef, fieldRefOption) {
    return (util_1.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(fielddef_1.vgField(orderChannelDef, fieldRefOption));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
exports.sortParams = sortParams;
function titleMerger(v1, v2) {
    return {
        explicit: v1.explicit,
        value: v1.value === v2.value ?
            v1.value : // if title is the same just use one of them
            v1.value + ', ' + v2.value // join title with comma if different
    };
}
exports.titleMerger = titleMerger;
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
function binRequiresRange(fieldDef, channel) {
    if (!fieldDef.bin) {
        console.warn('Only use this method with binned field defs');
        return false;
    }
    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
    return channel_1.isScaleChannel(channel) && util_1.contains(['ordinal', 'nominal'], fieldDef.type);
}
exports.binRequiresRange = binRequiresRange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBRW5ELHdDQUE4RztBQUU5RyxrQ0FBbUM7QUFFbkMsd0NBQTZDO0FBQzdDLGdDQUFxQztBQUNyQyxnQ0FBMEM7QUFNMUMscUJBQTRCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0lBQ2xHLFNBQW1CO0lBQ3JCLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFWRCxrQ0FVQztBQUVELHlCQUFnQyxDQUFnQixFQUFFLEtBQWdCLEVBQUUsU0FBK0I7SUFDakcsR0FBRyxDQUFDLENBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFSRCwwQ0FRQztBQUVELG1CQUEwQixJQUFhO0lBQ3JDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRkQsOEJBRUM7QUFFRDs7O0dBR0c7QUFDSCx1QkFBMEQsSUFBTyxFQUFFLElBQWEsRUFBRSxNQUFjO0lBQzlGLDJDQUEyQztJQUMzQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLDhEQUE4RDtJQUM5RCxJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQyxLQUFLLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsR0FBRyxDQUFDLENBQWdCLFVBQU0sRUFBTixpQkFBTSxFQUFOLG9CQUFNLEVBQU4sSUFBTTtRQUFyQixJQUFNLEtBQUssZUFBQTtRQUNkLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFeEMsa0ZBQWtGO1FBQ2xGLDBFQUEwRTtRQUMxRSxJQUFNLENBQUMsR0FBRyxJQUEwQixDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoRCxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBeEJELHNDQXdCQztBQUVELHlCQUFnQyxRQUEwQixFQUFFLGVBQXVCLEVBQUUsSUFBd0IsRUFBRSxNQUFjO0lBQzNILElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQy9ELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQU0sVUFBVSxHQUFHLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQzdDLElBQU0sUUFBUSxHQUFHLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxNQUFBLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUNsRSxDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLEtBQUcsVUFBVSxDQUFDLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxNQUFBLEVBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBRztTQUMzRCxDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyx5QkFBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFNLFVBQVUsR0FBRywwQkFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsR0FBRyxDQUFDO1FBQzlHLE1BQU0sQ0FBQztZQUNMLE1BQU0sRUFBRSxvQkFBb0IsQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztTQUN4SixDQUFDO0lBQ0osQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLFFBQU0sa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFHO1NBQzFDLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQXRCRCwwQ0FzQkM7QUFFRCxvQ0FBOEMsY0FBaUIsRUFBRSxZQUFrQztJQUNqRyxFQUFFLENBQUMsQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFMRCxnRUFLQztBQUVEOzs7O0dBSUc7QUFDSCxzQkFBNkIsUUFBMEIsRUFBRSxlQUF1QixFQUFFLE1BQWM7SUFDOUYsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxtQkFBWSxDQUFDLENBQUMsQ0FBQztRQUNuQywrQ0FBK0M7UUFFL0MsNkVBQTZFO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUN6QixDQUFDO1FBRUQsNEVBQTRFO1FBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQzdCLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFiRCxvQ0FhQztBQUVELG9CQUFvQixLQUFhLEVBQUUsTUFBYztJQUMvQyxNQUFNLENBQUMsWUFBVSxLQUFLLGFBQU0sTUFBTSxJQUFJLEVBQUUsU0FBSSxDQUFDO0FBQy9DLENBQUM7QUFFRCwwQkFBaUMsS0FBYSxFQUFFLGVBQXVCLEVBQUUsTUFBYztJQUNyRixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFGRCw0Q0FFQztBQUdELDZCQUFvQyxVQUFrQixFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUFFLE1BQWM7SUFDdEcsTUFBTSxDQUFJLFVBQVUsMkJBQXNCLFVBQVUsdUJBQWdCLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLHFCQUFjLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFHLENBQUM7QUFDN0ssQ0FBQztBQUZELGtEQUVDO0FBR0Q7O0dBRUc7QUFDSCw4QkFBcUMsS0FBYSxFQUFFLFFBQWtCLEVBQUUsTUFBYyxFQUFFLGVBQXdCLEVBQUUsZ0JBQXdCLEVBQUUsVUFBbUI7SUFDN0osRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4Qix3RkFBd0Y7UUFDeEYsSUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLGdCQUFnQixDQUFDLENBQUMsc0RBQXNEO1FBQ2xHLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsZUFBYSxLQUFLLFdBQU0sT0FBTyxPQUFJLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLGdCQUFjLEtBQUssV0FBTSxPQUFPLE9BQUksQ0FBQztRQUM5QyxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLDJCQUFnQixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7QUFDSCxDQUFDO0FBWkQsb0RBWUM7QUFFRDs7R0FFRztBQUNILG9CQUEyQixRQUF5RCxFQUFFLGNBQStCO0lBQ25ILE1BQU0sQ0FBQyxDQUFDLGNBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLGVBQWU7UUFDM0UsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFORCxnQ0FNQztBQUVELHFCQUE0QixFQUFvQixFQUFFLEVBQW9CO0lBQ3BFLE1BQU0sQ0FBQztRQUNMLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUTtRQUNyQixLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNENBQTRDO1lBQ3ZELEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMscUNBQXFDO0tBQ25FLENBQUM7QUFDSixDQUFDO0FBUEQsa0NBT0M7QUFFRDs7R0FFRztBQUNILDBCQUFpQyxRQUEwQixFQUFFLE9BQWdCO0lBQzNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsNkpBQTZKO0lBQzdKLDJGQUEyRjtJQUMzRixNQUFNLENBQUMsd0JBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFURCw0Q0FTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWcsIFZpZXdDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBGaWVsZFJlZk9wdGlvbiwgaXNTY2FsZUZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZiwgT3JkZXJGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtNYXJrQ29uZmlnLCBNYXJrRGVmLCBUZXh0Q29uZmlnfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge2Zvcm1hdEV4cHJlc3Npb259IGZyb20gJy4uL3RpbWV1bml0JztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIGlzQXJyYXl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydHkgdmFsdWUgZnJvbSBzdHlsZSBvciBtYXJrIHNwZWNpZmljIGNvbmZpZyBwcm9wZXJ0eSBpZiBleGlzdHMuXG4gKiBPdGhlcndpc2UsIHJldHVybiBnZW5lcmFsIG1hcmsgc3BlY2lmaWMgY29uZmlnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFya0NvbmZpZzxQIGV4dGVuZHMga2V5b2YgTWFya0NvbmZpZz4ocHJvcDogUCwgbWFyazogTWFya0RlZiwgY29uZmlnOiBDb25maWcpOiBNYXJrQ29uZmlnW1BdIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmVhZCBmcm9tIG1hcmsgY29uZmlnIGZpcnN0IVxuICBsZXQgdmFsdWUgPSBjb25maWcubWFya1twcm9wXTtcblxuICAvLyBUaGVuIHJlYWQgbWFyayBzcGVjaWZpYyBjb25maWcsIHdoaWNoIGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBtYXJrU3BlY2lmaWNDb25maWcgPSBjb25maWdbbWFyay50eXBlXTtcbiAgaWYgKG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBtYXJrU3BlY2lmaWNDb25maWdbcHJvcF07XG4gIH1cblxuICAvLyBUaGVuIHJlYWQgc3R5bGUgY29uZmlnLCB3aGljaCBoYXMgZXZlbiBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByfSk7XG4gICAgY29uc3QgZW5kRmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZvcm1hdCl9YFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNUaW1lRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgY29uc3QgaXNVVENTY2FsZSA9IGlzU2NhbGVGaWVsZERlZihmaWVsZERlZikgJiYgZmllbGREZWZbJ3NjYWxlJ10gJiYgZmllbGREZWZbJ3NjYWxlJ10udHlwZSA9PT0gU2NhbGVUeXBlLlVUQztcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aW1lRm9ybWF0RXhwcmVzc2lvbih2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pLCBmaWVsZERlZi50aW1lVW5pdCwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcudGV4dC5zaG9ydFRpbWVMYWJlbHMsIGNvbmZpZy50aW1lRm9ybWF0LCBpc1VUQ1NjYWxlKVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYCcnKyR7dmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KX1gXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8VD4oc3BlY2lmaWVkVmFsdWU6IFQsIGRlZmF1bHRWYWx1ZTogVCB8IHtzaWduYWw6IHN0cmluZ30pIHtcbiAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkVmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG51bWJlciBmb3JtYXQgZm9yIGEgZmllbGREZWZcbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0KGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIC8vIGFkZCBudW1iZXIgZm9ybWF0IGZvciBxdWFudGl0YXRpdmUgdHlwZSBvbmx5XG5cbiAgICAvLyBTcGVjaWZpZWQgZm9ybWF0IGluIGF4aXMvbGVnZW5kIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGZpZWxkRGVmLmZvcm1hdFxuICAgIGlmIChzcGVjaWZpZWRGb3JtYXQpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZWRGb3JtYXQ7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbmVlZCB0byBtYWtlIHRoaXMgd29yayBjb3JyZWN0bHkgZm9yIG51bWVyaWMgb3JkaW5hbCAvIG5vbWluYWwgdHlwZVxuICAgIHJldHVybiBjb25maWcubnVtYmVyRm9ybWF0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBmb3JtYXQoJHtmaWVsZH0sIFwiJHtmb3JtYXQgfHwgJyd9XCIpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiBmb3JtYXRFeHByKGZpZWxkLCBzcGVjaWZpZWRGb3JtYXQgfHwgY29uZmlnLm51bWJlckZvcm1hdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZDogc3RyaW5nLCBlbmRGaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGAke3N0YXJ0RmllbGR9ID09PSBudWxsIHx8IGlzTmFOKCR7c3RhcnRGaWVsZH0pID8gXCJudWxsXCIgOiAke251bWJlckZvcm1hdEV4cHIoc3RhcnRGaWVsZCwgZm9ybWF0LCBjb25maWcpfSArIFwiIC0gXCIgKyAke251bWJlckZvcm1hdEV4cHIoZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKX1gO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBleHByZXNzaW9uIHVzZWQgZm9yIGF4aXMvbGVnZW5kIGxhYmVscyBvciB0ZXh0IG1hcmsgZm9yIGEgdGVtcG9yYWwgZmllbGRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVGb3JtYXRFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHRpbWVVbml0OiBUaW1lVW5pdCwgZm9ybWF0OiBzdHJpbmcsIHNob3J0VGltZUxhYmVsczogYm9vbGVhbiwgdGltZUZvcm1hdENvbmZpZzogc3RyaW5nLCBpc1VUQ1NjYWxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCB8fCBmb3JtYXQpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBub3QgdGltZSB1bml0LCBvciBpZiB1c2VyIGV4cGxpY2l0bHkgc3BlY2lmeSBmb3JtYXQgZm9yIGF4aXMvbGVnZW5kL3RleHQuXG4gICAgY29uc3QgX2Zvcm1hdCA9IGZvcm1hdCB8fCB0aW1lRm9ybWF0Q29uZmlnOyAvLyBvbmx5IHVzZSBjb25maWcudGltZUZvcm1hdCBpZiB0aGVyZSBpcyBubyB0aW1lVW5pdC5cbiAgICBpZiAoaXNVVENTY2FsZSkge1xuICAgICAgcmV0dXJuIGB1dGNGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHRpbWVGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0RXhwcmVzc2lvbih0aW1lVW5pdCwgZmllbGQsIHNob3J0VGltZUxhYmVscywgaXNVVENTY2FsZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVmVnYSBzb3J0IHBhcmFtZXRlcnMgKHR1cGxlIG9mIGZpZWxkIGFuZCBvcmRlcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0UGFyYW1zKG9yZGVyRGVmOiBPcmRlckZpZWxkRGVmPHN0cmluZz4gfCBPcmRlckZpZWxkRGVmPHN0cmluZz5bXSwgZmllbGRSZWZPcHRpb24/OiBGaWVsZFJlZk9wdGlvbik6IFZnU29ydCB7XG4gIHJldHVybiAoaXNBcnJheShvcmRlckRlZikgPyBvcmRlckRlZiA6IFtvcmRlckRlZl0pLnJlZHVjZSgocywgb3JkZXJDaGFubmVsRGVmKSA9PiB7XG4gICAgcy5maWVsZC5wdXNoKHZnRmllbGQob3JkZXJDaGFubmVsRGVmLCBmaWVsZFJlZk9wdGlvbikpO1xuICAgIHMub3JkZXIucHVzaChvcmRlckNoYW5uZWxEZWYuc29ydCB8fCAnYXNjZW5kaW5nJyk7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZU1lcmdlcih2MTogRXhwbGljaXQ8c3RyaW5nPiwgdjI6IEV4cGxpY2l0PHN0cmluZz4pIHtcbiAgcmV0dXJuIHtcbiAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgIHZhbHVlOiB2MS52YWx1ZSA9PT0gdjIudmFsdWUgP1xuICAgICAgdjEudmFsdWUgOiAvLyBpZiB0aXRsZSBpcyB0aGUgc2FtZSBqdXN0IHVzZSBvbmUgb2YgdGhlbVxuICAgICAgdjEudmFsdWUgKyAnLCAnICsgdjIudmFsdWUgLy8gam9pbiB0aXRsZSB3aXRoIGNvbW1hIGlmIGRpZmZlcmVudFxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZmllbGREZWYgZm9yIGEgcGFydGljdWxhciBjaGFubmVsIHJlcXVpcmVzIGEgY29tcHV0ZWQgYmluIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoIWZpZWxkRGVmLmJpbikge1xuICAgIGNvbnNvbGUud2FybignT25seSB1c2UgdGhpcyBtZXRob2Qgd2l0aCBiaW5uZWQgZmllbGQgZGVmcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhlIHJhbmdlIG9ubHkgd2hlbiB0aGUgdXNlciBleHBsaWNpdGx5IGZvcmNlcyBhIGJpbm5lZCBmaWVsZCB0byBiZSB1c2UgZGlzY3JldGUgc2NhbGUuIEluIHRoaXMgY2FzZSwgYmluIHJhbmdlIGlzIHVzZWQgaW4gYXhpcyBhbmQgbGVnZW5kIGxhYmVscy5cbiAgLy8gV2UgY291bGQgY2hlY2sgd2hldGhlciB0aGUgYXhpcyBvciBsZWdlbmQgZXhpc3RzIChub3QgZGlzYWJsZWQpIGJ1dCB0aGF0IHNlZW1zIG92ZXJraWxsLlxuICByZXR1cm4gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgY29udGFpbnMoWydvcmRpbmFsJywgJ25vbWluYWwnXSwgZmllbGREZWYudHlwZSk7XG59XG4iXX0=