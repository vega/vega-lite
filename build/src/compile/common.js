"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (mark.style) {
        return util_1.isArray(mark.style) ? mark.style : [mark.style];
    }
    return [mark.type];
}
exports.getStyles = getStyles;
/**
 * Return value mark specific config property if exists.
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
function formatSignalRef(fieldDef, specifiedFormat, expr, config, useBinRange) {
    var format = numberFormat(fieldDef, specifiedFormat, config);
    if (fieldDef.bin) {
        if (useBinRange) {
            // For bin range, no need to apply format as the formula that creates range already include format
            return { signal: fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'range' }) };
        }
        else {
            var startField = fielddef_1.field(fieldDef, { expr: expr });
            var endField = fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'end' });
            return {
                signal: binFormatExpression(startField, endField, format, config)
            };
        }
    }
    else if (fieldDef.type === 'quantitative') {
        return {
            signal: "" + formatExpr(fielddef_1.field(fieldDef, { expr: expr }), format)
        };
    }
    else if (fieldDef.type === 'temporal') {
        var isUTCScale = fielddef_1.isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === scale_1.ScaleType.UTC;
        return {
            signal: timeFormatExpression(fielddef_1.field(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale)
        };
    }
    else {
        return {
            signal: "''+" + fielddef_1.field(fieldDef, { expr: expr })
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
        s.field.push(fielddef_1.field(orderChannelDef, fieldRefOption));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
exports.sortParams = sortParams;
function titleMerger(v1, v2) {
    return {
        explicit: v1.explicit,
        value: v1.value === v2.value ?
            v1.value :
            v1.value + ', ' + v2.value // join title with comma if different
    };
}
exports.titleMerger = titleMerger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0NBQTRGO0FBRTVGLGtDQUFtQztBQUVuQyx3Q0FBNkM7QUFDN0MsZ0NBQXFDO0FBQ3JDLGdDQUFnQztBQU1oQyxxQkFBNEIsQ0FBZ0IsRUFDeEMsTUFBNEMsRUFBRSxvREFBb0Q7SUFDbEcsU0FBbUI7SUFDckIsR0FBRyxDQUFDLENBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUMvQixDQUFDO0tBQ0Y7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQVZELGtDQVVDO0FBRUQseUJBQWdDLENBQWdCLEVBQUUsS0FBZ0IsRUFBRSxTQUErQjtJQUNqRyxHQUFHLENBQUMsQ0FBbUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUMvQixDQUFDO0tBQ0Y7SUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0FB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