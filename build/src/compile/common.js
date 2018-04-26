"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
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
            signal: "" + formatExpr(fielddef_1.vgField(fieldDef, { expr: expr, binSuffix: 'range' }), format)
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
    return (vega_util_1.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(fielddef_1.vgField(orderChannelDef, fieldRefOption));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
exports.sortParams = sortParams;
function mergeTitleFieldDefs(f1, f2) {
    var merged = f1.slice();
    f2.forEach(function (fdToMerge) {
        for (var _i = 0, merged_1 = merged; _i < merged_1.length; _i++) {
            var fieldDef1 = merged_1[_i];
            // If already exists, no need to append to merged array
            if (util_1.stringify(fieldDef1) === util_1.stringify(fdToMerge)) {
                return;
            }
        }
        merged.push(fdToMerge);
    });
    return merged;
}
exports.mergeTitleFieldDefs = mergeTitleFieldDefs;
function titleMerger(v1, v2) {
    if (vega_util_1.isArray(v1.value) && vega_util_1.isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitleFieldDefs(v1.value, v2.value)
        };
    }
    else if (!vega_util_1.isArray(v1.value) && !vega_util_1.isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: v1.value === v2.value ?
                v1.value : // if title is the same just use one of them
                v1.value + ', ' + v2.value // join title with comma if different
        };
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('It should never reach here');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtDO0FBQ2xDLHNDQUFtRDtBQUVuRCx3Q0FBNEg7QUFFNUgsa0NBQW1DO0FBRW5DLHdDQUE2QztBQUM3QyxnQ0FBcUM7QUFDckMsZ0NBQTRDO0FBTzVDLHFCQUE0QixDQUFnQixFQUN4QyxNQUE0QyxFQUFFLG9EQUFvRDtBQUNsRyxTQUFtQjtJQUNyQixLQUF1QixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1NBQzlCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFWRCxrQ0FVQztBQUVELHlCQUFnQyxDQUFnQixFQUFFLEtBQWdCLEVBQUUsU0FBK0I7SUFDakcsS0FBdUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDOUI7S0FDRjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQVJELDBDQVFDO0FBRUQsbUJBQTBCLElBQWE7SUFDckMsT0FBTyxFQUFFLENB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UUFBMEIsRUFBRSxPQUFnQjtJQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDNUQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELDZKQUE2SjtJQUM3SiwyRkFBMkY7SUFDM0YsT0FBTyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQVRELDRDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIEZpZWxkRGVmQmFzZSwgRmllbGRSZWZPcHRpb24sIGlzU2NhbGVGaWVsZERlZiwgaXNUaW1lRmllbGREZWYsIE9yZGVyRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya0NvbmZpZywgTWFya0RlZiwgVGV4dENvbmZpZ30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtmb3JtYXRFeHByZXNzaW9ufSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydHkgdmFsdWUgZnJvbSBzdHlsZSBvciBtYXJrIHNwZWNpZmljIGNvbmZpZyBwcm9wZXJ0eSBpZiBleGlzdHMuXG4gKiBPdGhlcndpc2UsIHJldHVybiBnZW5lcmFsIG1hcmsgc3BlY2lmaWMgY29uZmlnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFya0NvbmZpZzxQIGV4dGVuZHMga2V5b2YgTWFya0NvbmZpZz4ocHJvcDogUCwgbWFyazogTWFya0RlZiwgY29uZmlnOiBDb25maWcpOiBNYXJrQ29uZmlnW1BdIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmVhZCBmcm9tIG1hcmsgY29uZmlnIGZpcnN0IVxuICBsZXQgdmFsdWUgPSBjb25maWcubWFya1twcm9wXTtcblxuICAvLyBUaGVuIHJlYWQgbWFyayBzcGVjaWZpYyBjb25maWcsIHdoaWNoIGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBtYXJrU3BlY2lmaWNDb25maWcgPSBjb25maWdbbWFyay50eXBlXTtcbiAgaWYgKG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBtYXJrU3BlY2lmaWNDb25maWdbcHJvcF07XG4gIH1cblxuICAvLyBUaGVuIHJlYWQgc3R5bGUgY29uZmlnLCB3aGljaCBoYXMgZXZlbiBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByfSk7XG4gICAgY29uc3QgZW5kRmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKHZnRmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdyYW5nZSd9KSwgZm9ybWF0KX1gXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICBjb25zdCBpc1VUQ1NjYWxlID0gaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBmaWVsZERlZlsnc2NhbGUnXSAmJiBmaWVsZERlZlsnc2NhbGUnXS50eXBlID09PSBTY2FsZVR5cGUuVVRDO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRpbWVGb3JtYXRFeHByZXNzaW9uKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZpZWxkRGVmLnRpbWVVbml0LCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZy50ZXh0LnNob3J0VGltZUxhYmVscywgY29uZmlnLnRpbWVGb3JtYXQsIGlzVVRDU2NhbGUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJycrJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pfWBcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxUPihzcGVjaWZpZWRWYWx1ZTogVCwgZGVmYXVsdFZhbHVlOiBUIHwge3NpZ25hbDogc3RyaW5nfSkge1xuICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgbnVtYmVyIGZvcm1hdCBmb3IgYSBmaWVsZERlZlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgLy8gYWRkIG51bWJlciBmb3JtYXQgZm9yIHF1YW50aXRhdGl2ZSB0eXBlIG9ubHlcblxuICAgIC8vIFNwZWNpZmllZCBmb3JtYXQgaW4gYXhpcy9sZWdlbmQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gZmllbGREZWYuZm9ybWF0XG4gICAgaWYgKHNwZWNpZmllZEZvcm1hdCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllZEZvcm1hdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyB3b3JrIGNvcnJlY3RseSBmb3IgbnVtZXJpYyBvcmRpbmFsIC8gbm9taW5hbCB0eXBlXG4gICAgcmV0dXJuIGNvbmZpZy5udW1iZXJGb3JtYXQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gYGZvcm1hdCgke2ZpZWxkfSwgXCIke2Zvcm1hdCB8fCAnJ31cIilgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGZvcm1hdEV4cHIoZmllbGQsIHNwZWNpZmllZEZvcm1hdCB8fCBjb25maWcubnVtYmVyRm9ybWF0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkOiBzdHJpbmcsIGVuZEZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gYCR7c3RhcnRGaWVsZH0gPT09IG51bGwgfHwgaXNOYU4oJHtzdGFydEZpZWxkfSkgPyBcIm51bGxcIiA6ICR7bnVtYmVyRm9ybWF0RXhwcihzdGFydEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9ICsgXCIgLSBcIiArICR7bnVtYmVyRm9ybWF0RXhwcihlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpfWA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGV4cHJlc3Npb24gdXNlZCBmb3IgYXhpcy9sZWdlbmQgbGFiZWxzIG9yIHRleHQgbWFyayBmb3IgYSB0ZW1wb3JhbCBmaWVsZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgdGltZVVuaXQ6IFRpbWVVbml0LCBmb3JtYXQ6IHN0cmluZywgc2hvcnRUaW1lTGFiZWxzOiBib29sZWFuLCB0aW1lRm9ybWF0Q29uZmlnOiBzdHJpbmcsIGlzVVRDU2NhbGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0IHx8IGZvcm1hdCkge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vdCB0aW1lIHVuaXQsIG9yIGlmIHVzZXIgZXhwbGljaXRseSBzcGVjaWZ5IGZvcm1hdCBmb3IgYXhpcy9sZWdlbmQvdGV4dC5cbiAgICBjb25zdCBfZm9ybWF0ID0gZm9ybWF0IHx8IHRpbWVGb3JtYXRDb25maWc7IC8vIG9ubHkgdXNlIGNvbmZpZy50aW1lRm9ybWF0IGlmIHRoZXJlIGlzIG5vIHRpbWVVbml0LlxuICAgIGlmIChpc1VUQ1NjYWxlKSB7XG4gICAgICByZXR1cm4gYHV0Y0Zvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgdGltZUZvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmb3JtYXRFeHByZXNzaW9uKHRpbWVVbml0LCBmaWVsZCwgc2hvcnRUaW1lTGFiZWxzLCBpc1VUQ1NjYWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBWZWdhIHNvcnQgcGFyYW1ldGVycyAodHVwbGUgb2YgZmllbGQgYW5kIG9yZGVyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRQYXJhbXMob3JkZXJEZWY6IE9yZGVyRmllbGREZWY8c3RyaW5nPiB8IE9yZGVyRmllbGREZWY8c3RyaW5nPltdLCBmaWVsZFJlZk9wdGlvbj86IEZpZWxkUmVmT3B0aW9uKTogVmdTb3J0IHtcbiAgcmV0dXJuIChpc0FycmF5KG9yZGVyRGVmKSA/IG9yZGVyRGVmIDogW29yZGVyRGVmXSkucmVkdWNlKChzLCBvcmRlckNoYW5uZWxEZWYpID0+IHtcbiAgICBzLmZpZWxkLnB1c2godmdGaWVsZChvcmRlckNoYW5uZWxEZWYsIGZpZWxkUmVmT3B0aW9uKSk7XG4gICAgcy5vcmRlci5wdXNoKG9yZGVyQ2hhbm5lbERlZi5zb3J0IHx8ICdhc2NlbmRpbmcnKTtcbiAgICByZXR1cm4gcztcbiAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbn1cblxuZXhwb3J0IHR5cGUgQXhpc1RpdGxlQ29tcG9uZW50ID0gQXhpc0NvbXBvbmVudFByb3BzWyd0aXRsZSddO1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUaXRsZUZpZWxkRGVmcyhmMTogRmllbGREZWZCYXNlPHN0cmluZz5bXSwgZjI6IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10pIHtcbiAgY29uc3QgbWVyZ2VkID0gWy4uLmYxXTtcblxuICBmMi5mb3JFYWNoKChmZFRvTWVyZ2UpID0+IHtcbiAgICBmb3IgKGNvbnN0IGZpZWxkRGVmMSBvZiBtZXJnZWQpIHtcbiAgICAgIC8vIElmIGFscmVhZHkgZXhpc3RzLCBubyBuZWVkIHRvIGFwcGVuZCB0byBtZXJnZWQgYXJyYXlcbiAgICAgIGlmIChzdHJpbmdpZnkoZmllbGREZWYxKSA9PT0gc3RyaW5naWZ5KGZkVG9NZXJnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBtZXJnZWQucHVzaChmZFRvTWVyZ2UpO1xuICB9KTtcbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpdGxlTWVyZ2VyKFxuICB2MTogRXhwbGljaXQ8QXhpc1RpdGxlQ29tcG9uZW50PiwgdjI6IEV4cGxpY2l0PEF4aXNUaXRsZUNvbXBvbmVudD5cbikge1xuICBpZiAoaXNBcnJheSh2MS52YWx1ZSkgJiYgaXNBcnJheSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LFxuICAgICAgdmFsdWU6IG1lcmdlVGl0bGVGaWVsZERlZnModjEudmFsdWUsIHYyLnZhbHVlKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoIWlzQXJyYXkodjEudmFsdWUpICYmICFpc0FycmF5KHYyLnZhbHVlKSkge1xuICAgIHJldHVybiB7XG4gICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgdmFsdWU6IHYxLnZhbHVlID09PSB2Mi52YWx1ZSA/XG4gICAgICAgIHYxLnZhbHVlIDogLy8gaWYgdGl0bGUgaXMgdGhlIHNhbWUganVzdCB1c2Ugb25lIG9mIHRoZW1cbiAgICAgICAgdjEudmFsdWUgKyAnLCAnICsgdjIudmFsdWUgLy8gam9pbiB0aXRsZSB3aXRoIGNvbW1hIGlmIGRpZmZlcmVudFxuICAgIH07XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IENvbmRpdGlvbiBzaG91bGQgbm90IGhhcHBlbiAtLSBvbmx5IGZvciB3YXJuaW5nIGluIGRldmVsb3BtZW50LiAqL1xuICB0aHJvdyBuZXcgRXJyb3IoJ0l0IHNob3VsZCBuZXZlciByZWFjaCBoZXJlJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBmaWVsZERlZiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwgcmVxdWlyZXMgYSBjb21wdXRlZCBiaW4gcmFuZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmICghZmllbGREZWYuYmluKSB7XG4gICAgY29uc29sZS53YXJuKCdPbmx5IHVzZSB0aGlzIG1ldGhvZCB3aXRoIGJpbm5lZCBmaWVsZCBkZWZzJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gV2UgbmVlZCB0aGUgcmFuZ2Ugb25seSB3aGVuIHRoZSB1c2VyIGV4cGxpY2l0bHkgZm9yY2VzIGEgYmlubmVkIGZpZWxkIHRvIGJlIHVzZSBkaXNjcmV0ZSBzY2FsZS4gSW4gdGhpcyBjYXNlLCBiaW4gcmFuZ2UgaXMgdXNlZCBpbiBheGlzIGFuZCBsZWdlbmQgbGFiZWxzLlxuICAvLyBXZSBjb3VsZCBjaGVjayB3aGV0aGVyIHRoZSBheGlzIG9yIGxlZ2VuZCBleGlzdHMgKG5vdCBkaXNhYmxlZCkgYnV0IHRoYXQgc2VlbXMgb3ZlcmtpbGwuXG4gIHJldHVybiBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBjb250YWlucyhbJ29yZGluYWwnLCAnbm9taW5hbCddLCBmaWVsZERlZi50eXBlKTtcbn1cbiJdfQ==