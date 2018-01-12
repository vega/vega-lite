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
        var startField = fielddef_1.field(fieldDef, { expr: expr });
        var endField = fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'end' });
        return {
            signal: binFormatExpression(startField, endField, format, config)
        };
    }
    else if (fieldDef.type === 'quantitative') {
        return {
            signal: "" + formatExpr(fielddef_1.field(fieldDef, { expr: expr }), format)
        };
    }
    else if (fielddef_1.isTimeFieldDef(fieldDef)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBRW5ELHdDQUE0RztBQUU1RyxrQ0FBbUM7QUFFbkMsd0NBQTZDO0FBQzdDLGdDQUFxQztBQUNyQyxnQ0FBMEM7QUFNMUMscUJBQTRCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0lBQ2xHLFNBQW1CO0lBQ3JCLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFWRCxrQ0FVQztBQUVELHlCQUFnQyxDQUFnQixFQUFFLEtBQWdCLEVBQUUsU0FBK0I7SUFDakcsR0FBRyxDQUFDLENBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFD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QUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFURCw0Q0FTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWcsIFZpZXdDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge2ZpZWxkLCBGaWVsZERlZiwgRmllbGRSZWZPcHRpb24sIGlzU2NhbGVGaWVsZERlZiwgaXNUaW1lRmllbGREZWYsIE9yZGVyRmllbGREZWZ9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya0NvbmZpZywgTWFya0RlZiwgVGV4dENvbmZpZ30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtmb3JtYXRFeHByZXNzaW9ufSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBpc0FycmF5fSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdFbmNvZGVFbnRyeSwgVmdNYXJrQ29uZmlnLCBWZ1NvcnR9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RXhwbGljaXR9IGZyb20gJy4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q29uZmlnKGU6IFZnRW5jb2RlRW50cnksXG4gICAgY29uZmlnOiBWaWV3Q29uZmlnIHwgTWFya0NvbmZpZyB8IFRleHRDb25maWcsIC8vIFRPRE8oIzE4NDIpOiBjb25zb2xpZGF0ZSBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZz9cbiAgICBwcm9wc0xpc3Q6IHN0cmluZ1tdKSB7XG4gIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcHNMaXN0KSB7XG4gICAgY29uc3QgdmFsdWUgPSBjb25maWdbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5TWFya0NvbmZpZyhlOiBWZ0VuY29kZUVudHJ5LCBtb2RlbDogVW5pdE1vZGVsLCBwcm9wc0xpc3Q6IChrZXlvZiBNYXJrQ29uZmlnKVtdKSB7XG4gIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcHNMaXN0KSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRNYXJrQ29uZmlnKHByb3BlcnR5LCBtb2RlbC5tYXJrRGVmLCBtb2RlbC5jb25maWcpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlcyhtYXJrOiBNYXJrRGVmKTogc3RyaW5nW10ge1xuICByZXR1cm4gW10uY29uY2F0KG1hcmsudHlwZSwgbWFyay5zdHlsZSB8fCBbXSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHByb3BlcnR5IHZhbHVlIGZyb20gc3R5bGUgb3IgbWFyayBzcGVjaWZpYyBjb25maWcgcHJvcGVydHkgaWYgZXhpc3RzLlxuICogT3RoZXJ3aXNlLCByZXR1cm4gZ2VuZXJhbCBtYXJrIHNwZWNpZmljIGNvbmZpZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcmtDb25maWc8UCBleHRlbmRzIGtleW9mIE1hcmtDb25maWc+KHByb3A6IFAsIG1hcms6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKTogTWFya0NvbmZpZ1tQXSB7XG4gIC8vIEJ5IGRlZmF1bHQsIHJlYWQgZnJvbSBtYXJrIGNvbmZpZyBmaXJzdCFcbiAgbGV0IHZhbHVlID0gY29uZmlnLm1hcmtbcHJvcF07XG5cbiAgLy8gVGhlbiByZWFkIG1hcmsgc3BlY2lmaWMgY29uZmlnLCB3aGljaCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgY29uc3QgbWFya1NwZWNpZmljQ29uZmlnID0gY29uZmlnW21hcmsudHlwZV07XG4gIGlmIChtYXJrU3BlY2lmaWNDb25maWdbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbHVlID0gbWFya1NwZWNpZmljQ29uZmlnW3Byb3BdO1xuICB9XG5cbiAgLy8gVGhlbiByZWFkIHN0eWxlIGNvbmZpZywgd2hpY2ggaGFzIGV2ZW4gaGlnaGVyIHByZWNlZGVuY2UuXG4gIGNvbnN0IHN0eWxlcyA9IGdldFN0eWxlcyhtYXJrKTtcbiAgZm9yIChjb25zdCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICBjb25zdCBzdHlsZUNvbmZpZyA9IGNvbmZpZy5zdHlsZVtzdHlsZV07XG5cbiAgICAvLyBNYXJrQ29uZmlnIGV4dGVuZHMgVmdNYXJrQ29uZmlnIHNvIGEgcHJvcCBtYXkgbm90IGJlIGEgdmFsaWQgcHJvcGVydHkgZm9yIHN0eWxlXG4gICAgLy8gSG93ZXZlciBoZXJlIHdlIGFsc28gY2hlY2sgaWYgaXQgaXMgZGVmaW5lZCwgc28gaXQgaXMgb2theSB0byBjYXN0IGhlcmVcbiAgICBjb25zdCBwID0gcHJvcCBhcyBrZXlvZiBWZ01hcmtDb25maWc7XG4gICAgaWYgKHN0eWxlQ29uZmlnICYmIHN0eWxlQ29uZmlnW3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gc3R5bGVDb25maWdbcF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0U2lnbmFsUmVmKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgZXhwcjogJ2RhdHVtJyB8ICdwYXJlbnQnLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmb3JtYXQgPSBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZEZvcm1hdCwgY29uZmlnKTtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGNvbnN0IHN0YXJ0RmllbGQgPSBmaWVsZChmaWVsZERlZiwge2V4cHJ9KTtcbiAgICBjb25zdCBlbmRGaWVsZCA9IGZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKGZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pLCBmb3JtYXQpfWBcbiAgICB9O1xuICB9IGVsc2UgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgIGNvbnN0IGlzVVRDU2NhbGUgPSBpc1NjYWxlRmllbGREZWYoZmllbGREZWYpICYmIGZpZWxkRGVmWydzY2FsZSddICYmIGZpZWxkRGVmWydzY2FsZSddLnR5cGUgPT09IFNjYWxlVHlwZS5VVEM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQoZmllbGREZWYsIHtleHByfSksIGZpZWxkRGVmLnRpbWVVbml0LCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZy50ZXh0LnNob3J0VGltZUxhYmVscywgY29uZmlnLnRpbWVGb3JtYXQsIGlzVVRDU2NhbGUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJycrJHtmaWVsZChmaWVsZERlZiwge2V4cHJ9KX1gXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8VD4oc3BlY2lmaWVkVmFsdWU6IFQsIGRlZmF1bHRWYWx1ZTogVCB8IHtzaWduYWw6IHN0cmluZ30pIHtcbiAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkVmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG51bWJlciBmb3JtYXQgZm9yIGEgZmllbGREZWZcbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0KGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIC8vIGFkZCBudW1iZXIgZm9ybWF0IGZvciBxdWFudGl0YXRpdmUgdHlwZSBvbmx5XG5cbiAgICAvLyBTcGVjaWZpZWQgZm9ybWF0IGluIGF4aXMvbGVnZW5kIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGZpZWxkRGVmLmZvcm1hdFxuICAgIGlmIChzcGVjaWZpZWRGb3JtYXQpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZWRGb3JtYXQ7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbmVlZCB0byBtYWtlIHRoaXMgd29yayBjb3JyZWN0bHkgZm9yIG51bWVyaWMgb3JkaW5hbCAvIG5vbWluYWwgdHlwZVxuICAgIHJldHVybiBjb25maWcubnVtYmVyRm9ybWF0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBmb3JtYXQoJHtmaWVsZH0sIFwiJHtmb3JtYXQgfHwgJyd9XCIpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiBmb3JtYXRFeHByKGZpZWxkLCBzcGVjaWZpZWRGb3JtYXQgfHwgY29uZmlnLm51bWJlckZvcm1hdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZDogc3RyaW5nLCBlbmRGaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGAke3N0YXJ0RmllbGR9ID09PSBudWxsIHx8IGlzTmFOKCR7c3RhcnRGaWVsZH0pID8gXCJudWxsXCIgOiAke251bWJlckZvcm1hdEV4cHIoc3RhcnRGaWVsZCwgZm9ybWF0LCBjb25maWcpfSArIFwiIC0gXCIgKyAke251bWJlckZvcm1hdEV4cHIoZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKX1gO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBleHByZXNzaW9uIHVzZWQgZm9yIGF4aXMvbGVnZW5kIGxhYmVscyBvciB0ZXh0IG1hcmsgZm9yIGEgdGVtcG9yYWwgZmllbGRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVGb3JtYXRFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHRpbWVVbml0OiBUaW1lVW5pdCwgZm9ybWF0OiBzdHJpbmcsIHNob3J0VGltZUxhYmVsczogYm9vbGVhbiwgdGltZUZvcm1hdENvbmZpZzogc3RyaW5nLCBpc1VUQ1NjYWxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCB8fCBmb3JtYXQpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBub3QgdGltZSB1bml0LCBvciBpZiB1c2VyIGV4cGxpY2l0bHkgc3BlY2lmeSBmb3JtYXQgZm9yIGF4aXMvbGVnZW5kL3RleHQuXG4gICAgY29uc3QgX2Zvcm1hdCA9IGZvcm1hdCB8fCB0aW1lRm9ybWF0Q29uZmlnOyAvLyBvbmx5IHVzZSBjb25maWcudGltZUZvcm1hdCBpZiB0aGVyZSBpcyBubyB0aW1lVW5pdC5cbiAgICBpZiAoaXNVVENTY2FsZSkge1xuICAgICAgcmV0dXJuIGB1dGNGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHRpbWVGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0RXhwcmVzc2lvbih0aW1lVW5pdCwgZmllbGQsIHNob3J0VGltZUxhYmVscywgaXNVVENTY2FsZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVmVnYSBzb3J0IHBhcmFtZXRlcnMgKHR1cGxlIG9mIGZpZWxkIGFuZCBvcmRlcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0UGFyYW1zKG9yZGVyRGVmOiBPcmRlckZpZWxkRGVmPHN0cmluZz4gfCBPcmRlckZpZWxkRGVmPHN0cmluZz5bXSwgZmllbGRSZWZPcHRpb24/OiBGaWVsZFJlZk9wdGlvbik6IFZnU29ydCB7XG4gIHJldHVybiAoaXNBcnJheShvcmRlckRlZikgPyBvcmRlckRlZiA6IFtvcmRlckRlZl0pLnJlZHVjZSgocywgb3JkZXJDaGFubmVsRGVmKSA9PiB7XG4gICAgcy5maWVsZC5wdXNoKGZpZWxkKG9yZGVyQ2hhbm5lbERlZiwgZmllbGRSZWZPcHRpb24pKTtcbiAgICBzLm9yZGVyLnB1c2gob3JkZXJDaGFubmVsRGVmLnNvcnQgfHwgJ2FzY2VuZGluZycpO1xuICAgIHJldHVybiBzO1xuICB9LCB7ZmllbGQ6W10sIG9yZGVyOiBbXX0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGVNZXJnZXIodjE6IEV4cGxpY2l0PHN0cmluZz4sIHYyOiBFeHBsaWNpdDxzdHJpbmc+KSB7XG4gIHJldHVybiB7XG4gICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICB2YWx1ZTogdjEudmFsdWUgPT09IHYyLnZhbHVlID9cbiAgICAgIHYxLnZhbHVlIDogLy8gaWYgdGl0bGUgaXMgdGhlIHNhbWUganVzdCB1c2Ugb25lIG9mIHRoZW1cbiAgICAgIHYxLnZhbHVlICsgJywgJyArIHYyLnZhbHVlIC8vIGpvaW4gdGl0bGUgd2l0aCBjb21tYSBpZiBkaWZmZXJlbnRcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGZpZWxkRGVmIGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbCByZXF1aXJlcyBhIGNvbXB1dGVkIGJpbiByYW5nZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKCFmaWVsZERlZi5iaW4pIHtcbiAgICBjb25zb2xlLndhcm4oJ09ubHkgdXNlIHRoaXMgbWV0aG9kIHdpdGggYmlubmVkIGZpZWxkIGRlZnMnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBXZSBuZWVkIHRoZSByYW5nZSBvbmx5IHdoZW4gdGhlIHVzZXIgZXhwbGljaXRseSBmb3JjZXMgYSBiaW5uZWQgZmllbGQgdG8gYmUgdXNlIGRpc2NyZXRlIHNjYWxlLiBJbiB0aGlzIGNhc2UsIGJpbiByYW5nZSBpcyB1c2VkIGluIGF4aXMgYW5kIGxlZ2VuZCBsYWJlbHMuXG4gIC8vIFdlIGNvdWxkIGNoZWNrIHdoZXRoZXIgdGhlIGF4aXMgb3IgbGVnZW5kIGV4aXN0cyAobm90IGRpc2FibGVkKSBidXQgdGhhdCBzZWVtcyBvdmVya2lsbC5cbiAgcmV0dXJuIGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIGNvbnRhaW5zKFsnb3JkaW5hbCcsICdub21pbmFsJ10sIGZpZWxkRGVmLnR5cGUpO1xufVxuIl19