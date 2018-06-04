"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var scale_1 = require("../scale");
var timeunit_1 = require("../timeunit");
var type_1 = require("../type");
var util_1 = require("../util");
var mixins_1 = require("./mark/mixins");
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
            signal: timeFormatExpression(fielddef_1.vgField(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale, true)
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
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig, isUTCScale, alwaysReturn) {
    if (alwaysReturn === void 0) { alwaysReturn = false; }
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
        if (format || alwaysReturn) {
            return (isUTCScale ? 'utc' : 'time') + "Format(" + field + ", '" + format + "')";
        }
        else {
            return undefined;
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
function mergeTitle(title1, title2) {
    return title1 === title2 ?
        title1 : // if title is the same just use one of them
        title1 + ', ' + title2; // join title with comma if different
}
exports.mergeTitle = mergeTitle;
function mergeTitleComponent(v1, v2) {
    if (vega_util_1.isArray(v1.value) && vega_util_1.isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitleFieldDefs(v1.value, v2.value)
        };
    }
    else if (!vega_util_1.isArray(v1.value) && !vega_util_1.isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitle(v1.value, v2.value)
        };
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('It should never reach here');
}
exports.mergeTitleComponent = mergeTitleComponent;
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
function guideEncodeEntry(encoding, model) {
    return util_1.keys(encoding).reduce(function (encode, channel) {
        var valueDef = encoding[channel];
        return tslib_1.__assign({}, encode, mixins_1.wrapCondition(model, valueDef, channel, function (x) { return ({ value: x.value }); }));
    }, {});
}
exports.guideEncodeEntry = guideEncodeEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUNsQyxzQ0FBbUQ7QUFFbkQsd0NBQXNJO0FBR3RJLGtDQUFtQztBQUNuQyx3Q0FBdUQ7QUFDdkQsZ0NBQXFDO0FBQ3JDLGdDQUFrRDtBQUdsRCx3Q0FBNEM7QUFLNUMscUJBQTRCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0FBQ2xHLFNBQW1CO0lBQ3JCLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO1FBQTdCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztTQUM5QjtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBVkQsa0NBVUM7QUFFRCx5QkFBZ0MsQ0FBZ0IsRUFBRSxLQUFnQixFQUFFLFNBQStCO0lBQ2pHLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUyxFQUFFO1FBQTdCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDOUI7S0FDRjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQVJELDBDQVFDO0FBRUQsbUJBQTBC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S0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDdEMsQ0FBQztLQUNIO0lBQ0QsMkZBQTJGO0lBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBaEJELGtEQWdCQztBQUVEOztHQUVHO0FBQ0gsMEJBQWlDLFFBQTBCLEVBQUUsT0FBZ0I7SUFDM0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDakIsT0FBTyxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCw2SkFBNko7SUFDN0osMkZBQTJGO0lBQzNGLE9BQU8sd0JBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFURCw0Q0FTQztBQUVELDBCQUFpQyxRQUE0QixFQUFFLEtBQWdCO0lBQzdFLE9BQU8sV0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUF3QjtRQUM1RCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkMsNEJBQ0ssTUFBTSxFQUNOLHNCQUFhLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBQyxDQUFXLElBQUssT0FBQSxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLEVBQy9FO0lBQ0osQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQVJELDRDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIEZpZWxkRGVmQmFzZSwgRmllbGRSZWZPcHRpb24sIGlzU2NhbGVGaWVsZERlZiwgaXNUaW1lRmllbGREZWYsIE9yZGVyRmllbGREZWYsIFZhbHVlRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge0d1aWRlRW5jb2RpbmdFbnRyeX0gZnJvbSAnLi4vZ3VpZGUnO1xuaW1wb3J0IHtNYXJrQ29uZmlnLCBNYXJrRGVmLCBUZXh0Q29uZmlnfSBmcm9tICcuLi9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi9zY2FsZSc7XG5pbXBvcnQge2Zvcm1hdEV4cHJlc3Npb24sIFRpbWVVbml0fSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBrZXlzLCBzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUNoYW5uZWwsIFZnRW5jb2RlRW50cnksIFZnTWFya0NvbmZpZywgVmdTb3J0fSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0F4aXNDb21wb25lbnRQcm9wc30gZnJvbSAnLi9heGlzL2NvbXBvbmVudCc7XG5pbXBvcnQge3dyYXBDb25kaXRpb259IGZyb20gJy4vbWFyay9taXhpbnMnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydHkgdmFsdWUgZnJvbSBzdHlsZSBvciBtYXJrIHNwZWNpZmljIGNvbmZpZyBwcm9wZXJ0eSBpZiBleGlzdHMuXG4gKiBPdGhlcndpc2UsIHJldHVybiBnZW5lcmFsIG1hcmsgc3BlY2lmaWMgY29uZmlnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFya0NvbmZpZzxQIGV4dGVuZHMga2V5b2YgTWFya0NvbmZpZz4ocHJvcDogUCwgbWFyazogTWFya0RlZiwgY29uZmlnOiBDb25maWcpOiBNYXJrQ29uZmlnW1BdIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmVhZCBmcm9tIG1hcmsgY29uZmlnIGZpcnN0IVxuICBsZXQgdmFsdWUgPSBjb25maWcubWFya1twcm9wXTtcblxuICAvLyBUaGVuIHJlYWQgbWFyayBzcGVjaWZpYyBjb25maWcsIHdoaWNoIGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBtYXJrU3BlY2lmaWNDb25maWcgPSBjb25maWdbbWFyay50eXBlXTtcbiAgaWYgKG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBtYXJrU3BlY2lmaWNDb25maWdbcHJvcF07XG4gIH1cblxuICAvLyBUaGVuIHJlYWQgc3R5bGUgY29uZmlnLCB3aGljaCBoYXMgZXZlbiBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByfSk7XG4gICAgY29uc3QgZW5kRmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKHZnRmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdyYW5nZSd9KSwgZm9ybWF0KX1gXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICBjb25zdCBpc1VUQ1NjYWxlID0gaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBmaWVsZERlZlsnc2NhbGUnXSAmJiBmaWVsZERlZlsnc2NhbGUnXS50eXBlID09PSBTY2FsZVR5cGUuVVRDO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRpbWVGb3JtYXRFeHByZXNzaW9uKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZpZWxkRGVmLnRpbWVVbml0LCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZy50ZXh0LnNob3J0VGltZUxhYmVscywgY29uZmlnLnRpbWVGb3JtYXQsIGlzVVRDU2NhbGUsIHRydWUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJycrJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pfWBcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxUPihzcGVjaWZpZWRWYWx1ZTogVCwgZGVmYXVsdFZhbHVlOiBUIHwge3NpZ25hbDogc3RyaW5nfSkge1xuICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgbnVtYmVyIGZvcm1hdCBmb3IgYSBmaWVsZERlZlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgLy8gYWRkIG51bWJlciBmb3JtYXQgZm9yIHF1YW50aXRhdGl2ZSB0eXBlIG9ubHlcblxuICAgIC8vIFNwZWNpZmllZCBmb3JtYXQgaW4gYXhpcy9sZWdlbmQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gZmllbGREZWYuZm9ybWF0XG4gICAgaWYgKHNwZWNpZmllZEZvcm1hdCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllZEZvcm1hdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyB3b3JrIGNvcnJlY3RseSBmb3IgbnVtZXJpYyBvcmRpbmFsIC8gbm9taW5hbCB0eXBlXG4gICAgcmV0dXJuIGNvbmZpZy5udW1iZXJGb3JtYXQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gYGZvcm1hdCgke2ZpZWxkfSwgXCIke2Zvcm1hdCB8fCAnJ31cIilgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGZvcm1hdEV4cHIoZmllbGQsIHNwZWNpZmllZEZvcm1hdCB8fCBjb25maWcubnVtYmVyRm9ybWF0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkOiBzdHJpbmcsIGVuZEZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gYCR7c3RhcnRGaWVsZH0gPT09IG51bGwgfHwgaXNOYU4oJHtzdGFydEZpZWxkfSkgPyBcIm51bGxcIiA6ICR7bnVtYmVyRm9ybWF0RXhwcihzdGFydEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9ICsgXCIgLSBcIiArICR7bnVtYmVyRm9ybWF0RXhwcihlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpfWA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGV4cHJlc3Npb24gdXNlZCBmb3IgYXhpcy9sZWdlbmQgbGFiZWxzIG9yIHRleHQgbWFyayBmb3IgYSB0ZW1wb3JhbCBmaWVsZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgdGltZVVuaXQ6IFRpbWVVbml0LCBmb3JtYXQ6IHN0cmluZywgc2hvcnRUaW1lTGFiZWxzOiBib29sZWFuLCB0aW1lRm9ybWF0Q29uZmlnOiBzdHJpbmcsIGlzVVRDU2NhbGU6IGJvb2xlYW4sIGFsd2F5c1JldHVybjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCB8fCBmb3JtYXQpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBub3QgdGltZSB1bml0LCBvciBpZiB1c2VyIGV4cGxpY2l0bHkgc3BlY2lmeSBmb3JtYXQgZm9yIGF4aXMvbGVnZW5kL3RleHQuXG4gICAgZm9ybWF0ID0gZm9ybWF0IHx8IHRpbWVGb3JtYXRDb25maWc7IC8vIG9ubHkgdXNlIGNvbmZpZy50aW1lRm9ybWF0IGlmIHRoZXJlIGlzIG5vIHRpbWVVbml0LlxuXG4gICAgaWYgKGZvcm1hdCB8fCBhbHdheXNSZXR1cm4pIHtcbiAgICAgIHJldHVybiBgJHtpc1VUQ1NjYWxlID8gJ3V0YycgOiAndGltZSd9Rm9ybWF0KCR7ZmllbGR9LCAnJHtmb3JtYXR9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0RXhwcmVzc2lvbih0aW1lVW5pdCwgZmllbGQsIHNob3J0VGltZUxhYmVscywgaXNVVENTY2FsZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVmVnYSBzb3J0IHBhcmFtZXRlcnMgKHR1cGxlIG9mIGZpZWxkIGFuZCBvcmRlcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0UGFyYW1zKG9yZGVyRGVmOiBPcmRlckZpZWxkRGVmPHN0cmluZz4gfCBPcmRlckZpZWxkRGVmPHN0cmluZz5bXSwgZmllbGRSZWZPcHRpb24/OiBGaWVsZFJlZk9wdGlvbik6IFZnU29ydCB7XG4gIHJldHVybiAoaXNBcnJheShvcmRlckRlZikgPyBvcmRlckRlZiA6IFtvcmRlckRlZl0pLnJlZHVjZSgocywgb3JkZXJDaGFubmVsRGVmKSA9PiB7XG4gICAgcy5maWVsZC5wdXNoKHZnRmllbGQob3JkZXJDaGFubmVsRGVmLCBmaWVsZFJlZk9wdGlvbikpO1xuICAgIHMub3JkZXIucHVzaChvcmRlckNoYW5uZWxEZWYuc29ydCB8fCAnYXNjZW5kaW5nJyk7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG59XG5cbmV4cG9ydCB0eXBlIEF4aXNUaXRsZUNvbXBvbmVudCA9IEF4aXNDb21wb25lbnRQcm9wc1sndGl0bGUnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVGl0bGVGaWVsZERlZnMoZjE6IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10sIGYyOiBGaWVsZERlZkJhc2U8c3RyaW5nPltdKSB7XG4gIGNvbnN0IG1lcmdlZCA9IFsuLi5mMV07XG5cbiAgZjIuZm9yRWFjaCgoZmRUb01lcmdlKSA9PiB7XG4gICAgZm9yIChjb25zdCBmaWVsZERlZjEgb2YgbWVyZ2VkKSB7XG4gICAgICAvLyBJZiBhbHJlYWR5IGV4aXN0cywgbm8gbmVlZCB0byBhcHBlbmQgdG8gbWVyZ2VkIGFycmF5XG4gICAgICBpZiAoc3RyaW5naWZ5KGZpZWxkRGVmMSkgPT09IHN0cmluZ2lmeShmZFRvTWVyZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVyZ2VkLnB1c2goZmRUb01lcmdlKTtcbiAgfSk7XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRpdGxlKHRpdGxlMTogc3RyaW5nLCB0aXRsZTI6IHN0cmluZykge1xuICByZXR1cm4gdGl0bGUxID09PSB0aXRsZTIgP1xuICAgIHRpdGxlMSA6IC8vIGlmIHRpdGxlIGlzIHRoZSBzYW1lIGp1c3QgdXNlIG9uZSBvZiB0aGVtXG4gICAgdGl0bGUxICsgJywgJyArIHRpdGxlMjsgLy8gam9pbiB0aXRsZSB3aXRoIGNvbW1hIGlmIGRpZmZlcmVudFxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUaXRsZUNvbXBvbmVudChcbiAgdjE6IEV4cGxpY2l0PEF4aXNUaXRsZUNvbXBvbmVudD4sIHYyOiBFeHBsaWNpdDxBeGlzVGl0bGVDb21wb25lbnQ+XG4pIHtcbiAgaWYgKGlzQXJyYXkodjEudmFsdWUpICYmIGlzQXJyYXkodjIudmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCxcbiAgICAgIHZhbHVlOiBtZXJnZVRpdGxlRmllbGREZWZzKHYxLnZhbHVlLCB2Mi52YWx1ZSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKCFpc0FycmF5KHYxLnZhbHVlKSAmJiAhaXNBcnJheSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICAgIHZhbHVlOiBtZXJnZVRpdGxlKHYxLnZhbHVlLCB2Mi52YWx1ZSlcbiAgICB9O1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBDb25kaXRpb24gc2hvdWxkIG5vdCBoYXBwZW4gLS0gb25seSBmb3Igd2FybmluZyBpbiBkZXZlbG9wbWVudC4gKi9cbiAgdGhyb3cgbmV3IEVycm9yKCdJdCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZScpO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZmllbGREZWYgZm9yIGEgcGFydGljdWxhciBjaGFubmVsIHJlcXVpcmVzIGEgY29tcHV0ZWQgYmluIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoIWZpZWxkRGVmLmJpbikge1xuICAgIGNvbnNvbGUud2FybignT25seSB1c2UgdGhpcyBtZXRob2Qgd2l0aCBiaW5uZWQgZmllbGQgZGVmcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhlIHJhbmdlIG9ubHkgd2hlbiB0aGUgdXNlciBleHBsaWNpdGx5IGZvcmNlcyBhIGJpbm5lZCBmaWVsZCB0byBiZSB1c2UgZGlzY3JldGUgc2NhbGUuIEluIHRoaXMgY2FzZSwgYmluIHJhbmdlIGlzIHVzZWQgaW4gYXhpcyBhbmQgbGVnZW5kIGxhYmVscy5cbiAgLy8gV2UgY291bGQgY2hlY2sgd2hldGhlciB0aGUgYXhpcyBvciBsZWdlbmQgZXhpc3RzIChub3QgZGlzYWJsZWQpIGJ1dCB0aGF0IHNlZW1zIG92ZXJraWxsLlxuICByZXR1cm4gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgY29udGFpbnMoWydvcmRpbmFsJywgJ25vbWluYWwnXSwgZmllbGREZWYudHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBndWlkZUVuY29kZUVudHJ5KGVuY29kaW5nOiBHdWlkZUVuY29kaW5nRW50cnksIG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIGtleXMoZW5jb2RpbmcpLnJlZHVjZSgoZW5jb2RlLCBjaGFubmVsOiBWZ0VuY29kZUNoYW5uZWwpID0+IHtcbiAgICBjb25zdCB2YWx1ZURlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5lbmNvZGUsXG4gICAgICAuLi53cmFwQ29uZGl0aW9uKG1vZGVsLCB2YWx1ZURlZiwgY2hhbm5lbCwgKHg6IFZhbHVlRGVmKSA9PiAoe3ZhbHVlOiB4LnZhbHVlfSkpXG4gICAgfTtcbiAgfSwge30pO1xufVxuIl19