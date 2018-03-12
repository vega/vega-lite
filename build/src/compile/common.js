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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtDO0FBQ2xDLHNDQUFtRDtBQUVuRCx3Q0FBNEg7QUFFNUgsa0NBQW1DO0FBRW5DLHdDQUE2QztBQUM3QyxnQ0FBcUM7QUFDckMsZ0NBQTRDO0FBTzVDLHFCQUE0QixDQUFnQixFQUN4QyxNQUE0QyxFQUFFLG9EQUFvRDtBQUNsRyxTQUFtQjtJQUNyQixHQUFHLENBQUMsQ0FBbUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQy9CLENBQUM7S0FDRjtJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBVkQsa0NBVUM7QUFFRCx5QkFBZ0MsQ0FBZ0IsRUFBRSxLQUFnQixFQUFFLFNBQStCO0lBQ2pHLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQy9CLENBQUM7S0FDRjtJ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Q0FBQztBQVRELDRDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIEZpZWxkRGVmQmFzZSwgRmllbGRSZWZPcHRpb24sIGlzU2NhbGVGaWVsZERlZiwgaXNUaW1lRmllbGREZWYsIE9yZGVyRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya0NvbmZpZywgTWFya0RlZiwgVGV4dENvbmZpZ30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtmb3JtYXRFeHByZXNzaW9ufSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydHkgdmFsdWUgZnJvbSBzdHlsZSBvciBtYXJrIHNwZWNpZmljIGNvbmZpZyBwcm9wZXJ0eSBpZiBleGlzdHMuXG4gKiBPdGhlcndpc2UsIHJldHVybiBnZW5lcmFsIG1hcmsgc3BlY2lmaWMgY29uZmlnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFya0NvbmZpZzxQIGV4dGVuZHMga2V5b2YgTWFya0NvbmZpZz4ocHJvcDogUCwgbWFyazogTWFya0RlZiwgY29uZmlnOiBDb25maWcpOiBNYXJrQ29uZmlnW1BdIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmVhZCBmcm9tIG1hcmsgY29uZmlnIGZpcnN0IVxuICBsZXQgdmFsdWUgPSBjb25maWcubWFya1twcm9wXTtcblxuICAvLyBUaGVuIHJlYWQgbWFyayBzcGVjaWZpYyBjb25maWcsIHdoaWNoIGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBtYXJrU3BlY2lmaWNDb25maWcgPSBjb25maWdbbWFyay50eXBlXTtcbiAgaWYgKG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBtYXJrU3BlY2lmaWNDb25maWdbcHJvcF07XG4gIH1cblxuICAvLyBUaGVuIHJlYWQgc3R5bGUgY29uZmlnLCB3aGljaCBoYXMgZXZlbiBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByfSk7XG4gICAgY29uc3QgZW5kRmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZvcm1hdCl9YFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNUaW1lRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgY29uc3QgaXNVVENTY2FsZSA9IGlzU2NhbGVGaWVsZERlZihmaWVsZERlZikgJiYgZmllbGREZWZbJ3NjYWxlJ10gJiYgZmllbGREZWZbJ3NjYWxlJ10udHlwZSA9PT0gU2NhbGVUeXBlLlVUQztcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aW1lRm9ybWF0RXhwcmVzc2lvbih2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pLCBmaWVsZERlZi50aW1lVW5pdCwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcudGV4dC5zaG9ydFRpbWVMYWJlbHMsIGNvbmZpZy50aW1lRm9ybWF0LCBpc1VUQ1NjYWxlKVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYCcnKyR7dmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KX1gXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8VD4oc3BlY2lmaWVkVmFsdWU6IFQsIGRlZmF1bHRWYWx1ZTogVCB8IHtzaWduYWw6IHN0cmluZ30pIHtcbiAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkVmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG51bWJlciBmb3JtYXQgZm9yIGEgZmllbGREZWZcbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0KGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIC8vIGFkZCBudW1iZXIgZm9ybWF0IGZvciBxdWFudGl0YXRpdmUgdHlwZSBvbmx5XG5cbiAgICAvLyBTcGVjaWZpZWQgZm9ybWF0IGluIGF4aXMvbGVnZW5kIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGZpZWxkRGVmLmZvcm1hdFxuICAgIGlmIChzcGVjaWZpZWRGb3JtYXQpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZWRGb3JtYXQ7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbmVlZCB0byBtYWtlIHRoaXMgd29yayBjb3JyZWN0bHkgZm9yIG51bWVyaWMgb3JkaW5hbCAvIG5vbWluYWwgdHlwZVxuICAgIHJldHVybiBjb25maWcubnVtYmVyRm9ybWF0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBmb3JtYXQoJHtmaWVsZH0sIFwiJHtmb3JtYXQgfHwgJyd9XCIpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiBmb3JtYXRFeHByKGZpZWxkLCBzcGVjaWZpZWRGb3JtYXQgfHwgY29uZmlnLm51bWJlckZvcm1hdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZDogc3RyaW5nLCBlbmRGaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGAke3N0YXJ0RmllbGR9ID09PSBudWxsIHx8IGlzTmFOKCR7c3RhcnRGaWVsZH0pID8gXCJudWxsXCIgOiAke251bWJlckZvcm1hdEV4cHIoc3RhcnRGaWVsZCwgZm9ybWF0LCBjb25maWcpfSArIFwiIC0gXCIgKyAke251bWJlckZvcm1hdEV4cHIoZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKX1gO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBleHByZXNzaW9uIHVzZWQgZm9yIGF4aXMvbGVnZW5kIGxhYmVscyBvciB0ZXh0IG1hcmsgZm9yIGEgdGVtcG9yYWwgZmllbGRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVGb3JtYXRFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHRpbWVVbml0OiBUaW1lVW5pdCwgZm9ybWF0OiBzdHJpbmcsIHNob3J0VGltZUxhYmVsczogYm9vbGVhbiwgdGltZUZvcm1hdENvbmZpZzogc3RyaW5nLCBpc1VUQ1NjYWxlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCB8fCBmb3JtYXQpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBub3QgdGltZSB1bml0LCBvciBpZiB1c2VyIGV4cGxpY2l0bHkgc3BlY2lmeSBmb3JtYXQgZm9yIGF4aXMvbGVnZW5kL3RleHQuXG4gICAgY29uc3QgX2Zvcm1hdCA9IGZvcm1hdCB8fCB0aW1lRm9ybWF0Q29uZmlnOyAvLyBvbmx5IHVzZSBjb25maWcudGltZUZvcm1hdCBpZiB0aGVyZSBpcyBubyB0aW1lVW5pdC5cbiAgICBpZiAoaXNVVENTY2FsZSkge1xuICAgICAgcmV0dXJuIGB1dGNGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHRpbWVGb3JtYXQoJHtmaWVsZH0sICcke19mb3JtYXR9JylgO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0RXhwcmVzc2lvbih0aW1lVW5pdCwgZmllbGQsIHNob3J0VGltZUxhYmVscywgaXNVVENTY2FsZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVmVnYSBzb3J0IHBhcmFtZXRlcnMgKHR1cGxlIG9mIGZpZWxkIGFuZCBvcmRlcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0UGFyYW1zKG9yZGVyRGVmOiBPcmRlckZpZWxkRGVmPHN0cmluZz4gfCBPcmRlckZpZWxkRGVmPHN0cmluZz5bXSwgZmllbGRSZWZPcHRpb24/OiBGaWVsZFJlZk9wdGlvbik6IFZnU29ydCB7XG4gIHJldHVybiAoaXNBcnJheShvcmRlckRlZikgPyBvcmRlckRlZiA6IFtvcmRlckRlZl0pLnJlZHVjZSgocywgb3JkZXJDaGFubmVsRGVmKSA9PiB7XG4gICAgcy5maWVsZC5wdXNoKHZnRmllbGQob3JkZXJDaGFubmVsRGVmLCBmaWVsZFJlZk9wdGlvbikpO1xuICAgIHMub3JkZXIucHVzaChvcmRlckNoYW5uZWxEZWYuc29ydCB8fCAnYXNjZW5kaW5nJyk7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG59XG5cbmV4cG9ydCB0eXBlIEF4aXNUaXRsZUNvbXBvbmVudCA9IEF4aXNDb21wb25lbnRQcm9wc1sndGl0bGUnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVGl0bGVGaWVsZERlZnMoZjE6IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10sIGYyOiBGaWVsZERlZkJhc2U8c3RyaW5nPltdKSB7XG4gIGNvbnN0IG1lcmdlZCA9IFsuLi5mMV07XG5cbiAgZjIuZm9yRWFjaCgoZmRUb01lcmdlKSA9PiB7XG4gICAgZm9yIChjb25zdCBmaWVsZERlZjEgb2YgbWVyZ2VkKSB7XG4gICAgICAvLyBJZiBhbHJlYWR5IGV4aXN0cywgbm8gbmVlZCB0byBhcHBlbmQgdG8gbWVyZ2VkIGFycmF5XG4gICAgICBpZiAoc3RyaW5naWZ5KGZpZWxkRGVmMSkgPT09IHN0cmluZ2lmeShmZFRvTWVyZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVyZ2VkLnB1c2goZmRUb01lcmdlKTtcbiAgfSk7XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZU1lcmdlcihcbiAgdjE6IEV4cGxpY2l0PEF4aXNUaXRsZUNvbXBvbmVudD4sIHYyOiBFeHBsaWNpdDxBeGlzVGl0bGVDb21wb25lbnQ+XG4pIHtcbiAgaWYgKGlzQXJyYXkodjEudmFsdWUpICYmIGlzQXJyYXkodjIudmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCxcbiAgICAgIHZhbHVlOiBtZXJnZVRpdGxlRmllbGREZWZzKHYxLnZhbHVlLCB2Mi52YWx1ZSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKCFpc0FycmF5KHYxLnZhbHVlKSAmJiAhaXNBcnJheSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICAgIHZhbHVlOiB2MS52YWx1ZSA9PT0gdjIudmFsdWUgP1xuICAgICAgICB2MS52YWx1ZSA6IC8vIGlmIHRpdGxlIGlzIHRoZSBzYW1lIGp1c3QgdXNlIG9uZSBvZiB0aGVtXG4gICAgICAgIHYxLnZhbHVlICsgJywgJyArIHYyLnZhbHVlIC8vIGpvaW4gdGl0bGUgd2l0aCBjb21tYSBpZiBkaWZmZXJlbnRcbiAgICB9O1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBDb25kaXRpb24gc2hvdWxkIG5vdCBoYXBwZW4gLS0gb25seSBmb3Igd2FybmluZyBpbiBkZXZlbG9wbWVudC4gKi9cbiAgdGhyb3cgbmV3IEVycm9yKCdJdCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZScpO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZmllbGREZWYgZm9yIGEgcGFydGljdWxhciBjaGFubmVsIHJlcXVpcmVzIGEgY29tcHV0ZWQgYmluIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoIWZpZWxkRGVmLmJpbikge1xuICAgIGNvbnNvbGUud2FybignT25seSB1c2UgdGhpcyBtZXRob2Qgd2l0aCBiaW5uZWQgZmllbGQgZGVmcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhlIHJhbmdlIG9ubHkgd2hlbiB0aGUgdXNlciBleHBsaWNpdGx5IGZvcmNlcyBhIGJpbm5lZCBmaWVsZCB0byBiZSB1c2UgZGlzY3JldGUgc2NhbGUuIEluIHRoaXMgY2FzZSwgYmluIHJhbmdlIGlzIHVzZWQgaW4gYXhpcyBhbmQgbGVnZW5kIGxhYmVscy5cbiAgLy8gV2UgY291bGQgY2hlY2sgd2hldGhlciB0aGUgYXhpcyBvciBsZWdlbmQgZXhpc3RzIChub3QgZGlzYWJsZWQpIGJ1dCB0aGF0IHNlZW1zIG92ZXJraWxsLlxuICByZXR1cm4gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgY29udGFpbnMoWydvcmRpbmFsJywgJ25vbWluYWwnXSwgZmllbGREZWYudHlwZSk7XG59XG4iXX0=