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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW1EO0FBRW5ELHdDQUE0RztBQUU1RyxrQ0FBbUM7QUFFbkMsd0NBQTZDO0FBQzdDLGdDQUFxQztBQUNyQyxnQ0FBMEM7QUFNMUMscUJBQTRCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0lBQ2xHLFNBQW1CO0lBQ3JCLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFWRCxrQ0FVQztBQUVELHlCQUFnQyxDQUFnQixFQUFFLEtBQWdCLEVBQUUsU0FBK0I7SUFDakcsR0FBRyxDQUFDLENBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNGO0lBQ0QsTUFBTSxDQUFD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LENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQVRELDRDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7ZmllbGQsIEZpZWxkRGVmLCBGaWVsZFJlZk9wdGlvbiwgaXNTY2FsZUZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZiwgT3JkZXJGaWVsZERlZn0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtNYXJrQ29uZmlnLCBNYXJrRGVmLCBUZXh0Q29uZmlnfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge1RpbWVVbml0fSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge2Zvcm1hdEV4cHJlc3Npb259IGZyb20gJy4uL3RpbWV1bml0JztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIGlzQXJyYXl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdmFsdWUgbWFyayBzcGVjaWZpYyBjb25maWcgcHJvcGVydHkgaWYgZXhpc3RzLlxuICogT3RoZXJ3aXNlLCByZXR1cm4gZ2VuZXJhbCBtYXJrIHNwZWNpZmljIGNvbmZpZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcmtDb25maWc8UCBleHRlbmRzIGtleW9mIE1hcmtDb25maWc+KHByb3A6IFAsIG1hcms6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKTogTWFya0NvbmZpZ1tQXSB7XG4gIC8vIEJ5IGRlZmF1bHQsIHJlYWQgZnJvbSBtYXJrIGNvbmZpZyBmaXJzdCFcbiAgbGV0IHZhbHVlID0gY29uZmlnLm1hcmtbcHJvcF07XG5cbiAgLy8gVGhlbiByZWFkIG1hcmsgc3BlY2lmaWMgY29uZmlnLCB3aGljaCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgY29uc3QgbWFya1NwZWNpZmljQ29uZmlnID0gY29uZmlnW21hcmsudHlwZV07XG4gIGlmIChtYXJrU3BlY2lmaWNDb25maWdbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbHVlID0gbWFya1NwZWNpZmljQ29uZmlnW3Byb3BdO1xuICB9XG5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IGZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pO1xuICAgIGNvbnN0IGVuZEZpZWxkID0gZmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdlbmQnfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkLCBlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGAke2Zvcm1hdEV4cHIoZmllbGQoZmllbGREZWYsIHtleHByfSksIGZvcm1hdCl9YFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNUaW1lRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgY29uc3QgaXNVVENTY2FsZSA9IGlzU2NhbGVGaWVsZERlZihmaWVsZERlZikgJiYgZmllbGREZWZbJ3NjYWxlJ10gJiYgZmllbGREZWZbJ3NjYWxlJ10udHlwZSA9PT0gU2NhbGVUeXBlLlVUQztcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aW1lRm9ybWF0RXhwcmVzc2lvbihmaWVsZChmaWVsZERlZiwge2V4cHJ9KSwgZmllbGREZWYudGltZVVuaXQsIHNwZWNpZmllZEZvcm1hdCwgY29uZmlnLnRleHQuc2hvcnRUaW1lTGFiZWxzLCBjb25maWcudGltZUZvcm1hdCwgaXNVVENTY2FsZSlcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGAnJyske2ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pfWBcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxUPihzcGVjaWZpZWRWYWx1ZTogVCwgZGVmYXVsdFZhbHVlOiBUIHwge3NpZ25hbDogc3RyaW5nfSkge1xuICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgbnVtYmVyIGZvcm1hdCBmb3IgYSBmaWVsZERlZlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgLy8gYWRkIG51bWJlciBmb3JtYXQgZm9yIHF1YW50aXRhdGl2ZSB0eXBlIG9ubHlcblxuICAgIC8vIFNwZWNpZmllZCBmb3JtYXQgaW4gYXhpcy9sZWdlbmQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gZmllbGREZWYuZm9ybWF0XG4gICAgaWYgKHNwZWNpZmllZEZvcm1hdCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllZEZvcm1hdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyB3b3JrIGNvcnJlY3RseSBmb3IgbnVtZXJpYyBvcmRpbmFsIC8gbm9taW5hbCB0eXBlXG4gICAgcmV0dXJuIGNvbmZpZy5udW1iZXJGb3JtYXQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gYGZvcm1hdCgke2ZpZWxkfSwgXCIke2Zvcm1hdCB8fCAnJ31cIilgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGZvcm1hdEV4cHIoZmllbGQsIHNwZWNpZmllZEZvcm1hdCB8fCBjb25maWcubnVtYmVyRm9ybWF0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkOiBzdHJpbmcsIGVuZEZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gYCR7c3RhcnRGaWVsZH0gPT09IG51bGwgfHwgaXNOYU4oJHtzdGFydEZpZWxkfSkgPyBcIm51bGxcIiA6ICR7bnVtYmVyRm9ybWF0RXhwcihzdGFydEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9ICsgXCIgLSBcIiArICR7bnVtYmVyRm9ybWF0RXhwcihlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpfWA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGV4cHJlc3Npb24gdXNlZCBmb3IgYXhpcy9sZWdlbmQgbGFiZWxzIG9yIHRleHQgbWFyayBmb3IgYSB0ZW1wb3JhbCBmaWVsZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgdGltZVVuaXQ6IFRpbWVVbml0LCBmb3JtYXQ6IHN0cmluZywgc2hvcnRUaW1lTGFiZWxzOiBib29sZWFuLCB0aW1lRm9ybWF0Q29uZmlnOiBzdHJpbmcsIGlzVVRDU2NhbGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0IHx8IGZvcm1hdCkge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vdCB0aW1lIHVuaXQsIG9yIGlmIHVzZXIgZXhwbGljaXRseSBzcGVjaWZ5IGZvcm1hdCBmb3IgYXhpcy9sZWdlbmQvdGV4dC5cbiAgICBjb25zdCBfZm9ybWF0ID0gZm9ybWF0IHx8IHRpbWVGb3JtYXRDb25maWc7IC8vIG9ubHkgdXNlIGNvbmZpZy50aW1lRm9ybWF0IGlmIHRoZXJlIGlzIG5vIHRpbWVVbml0LlxuICAgIGlmIChpc1VUQ1NjYWxlKSB7XG4gICAgICByZXR1cm4gYHV0Y0Zvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgdGltZUZvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmb3JtYXRFeHByZXNzaW9uKHRpbWVVbml0LCBmaWVsZCwgc2hvcnRUaW1lTGFiZWxzLCBpc1VUQ1NjYWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBWZWdhIHNvcnQgcGFyYW1ldGVycyAodHVwbGUgb2YgZmllbGQgYW5kIG9yZGVyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRQYXJhbXMob3JkZXJEZWY6IE9yZGVyRmllbGREZWY8c3RyaW5nPiB8IE9yZGVyRmllbGREZWY8c3RyaW5nPltdLCBmaWVsZFJlZk9wdGlvbj86IEZpZWxkUmVmT3B0aW9uKTogVmdTb3J0IHtcbiAgcmV0dXJuIChpc0FycmF5KG9yZGVyRGVmKSA/IG9yZGVyRGVmIDogW29yZGVyRGVmXSkucmVkdWNlKChzLCBvcmRlckNoYW5uZWxEZWYpID0+IHtcbiAgICBzLmZpZWxkLnB1c2goZmllbGQob3JkZXJDaGFubmVsRGVmLCBmaWVsZFJlZk9wdGlvbikpO1xuICAgIHMub3JkZXIucHVzaChvcmRlckNoYW5uZWxEZWYuc29ydCB8fCAnYXNjZW5kaW5nJyk7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZU1lcmdlcih2MTogRXhwbGljaXQ8c3RyaW5nPiwgdjI6IEV4cGxpY2l0PHN0cmluZz4pIHtcbiAgcmV0dXJuIHtcbiAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgIHZhbHVlOiB2MS52YWx1ZSA9PT0gdjIudmFsdWUgP1xuICAgICAgdjEudmFsdWUgOiAvLyBpZiB0aXRsZSBpcyB0aGUgc2FtZSBqdXN0IHVzZSBvbmUgb2YgdGhlbVxuICAgICAgdjEudmFsdWUgKyAnLCAnICsgdjIudmFsdWUgLy8gam9pbiB0aXRsZSB3aXRoIGNvbW1hIGlmIGRpZmZlcmVudFxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZmllbGREZWYgZm9yIGEgcGFydGljdWxhciBjaGFubmVsIHJlcXVpcmVzIGEgY29tcHV0ZWQgYmluIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoIWZpZWxkRGVmLmJpbikge1xuICAgIGNvbnNvbGUud2FybignT25seSB1c2UgdGhpcyBtZXRob2Qgd2l0aCBiaW5uZWQgZmllbGQgZGVmcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhlIHJhbmdlIG9ubHkgd2hlbiB0aGUgdXNlciBleHBsaWNpdGx5IGZvcmNlcyBhIGJpbm5lZCBmaWVsZCB0byBiZSB1c2UgZGlzY3JldGUgc2NhbGUuIEluIHRoaXMgY2FzZSwgYmluIHJhbmdlIGlzIHVzZWQgaW4gYXhpcyBhbmQgbGVnZW5kIGxhYmVscy5cbiAgLy8gV2UgY291bGQgY2hlY2sgd2hldGhlciB0aGUgYXhpcyBvciBsZWdlbmQgZXhpc3RzIChub3QgZGlzYWJsZWQpIGJ1dCB0aGF0IHNlZW1zIG92ZXJraWxsLlxuICByZXR1cm4gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgY29udGFpbnMoWydvcmRpbmFsJywgJ25vbWluYWwnXSwgZmllbGREZWYudHlwZSk7XG59XG4iXX0=