import { isArray } from 'vega-util';
import { isScaleChannel } from '../channel';
import { isScaleFieldDef, isTimeFieldDef, vgField } from '../fielddef';
import { ScaleType } from '../scale';
import { formatExpression } from '../timeunit';
import { QUANTITATIVE } from '../type';
import { contains, stringify } from '../util';
export function applyConfig(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
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
export function applyMarkConfig(e, model, propsList) {
    for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
        var property = propsList_2[_i];
        var value = getMarkConfig(property, model.markDef, model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
export function getStyles(mark) {
    return [].concat(mark.type, mark.style || []);
}
/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig(prop, mark, config) {
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
export function formatSignalRef(fieldDef, specifiedFormat, expr, config) {
    var format = numberFormat(fieldDef, specifiedFormat, config);
    if (fieldDef.bin) {
        var startField = vgField(fieldDef, { expr: expr });
        var endField = vgField(fieldDef, { expr: expr, binSuffix: 'end' });
        return {
            signal: binFormatExpression(startField, endField, format, config)
        };
    }
    else if (fieldDef.type === 'quantitative') {
        return {
            signal: "" + formatExpr(vgField(fieldDef, { expr: expr, binSuffix: 'range' }), format)
        };
    }
    else if (isTimeFieldDef(fieldDef)) {
        var isUTCScale = isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC;
        return {
            signal: timeFormatExpression(vgField(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale, true)
        };
    }
    else {
        return {
            signal: "''+" + vgField(fieldDef, { expr: expr })
        };
    }
}
export function getSpecifiedOrDefaultValue(specifiedValue, defaultValue) {
    if (specifiedValue !== undefined) {
        return specifiedValue;
    }
    return defaultValue;
}
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef, specifiedFormat, config) {
    if (fieldDef.type === QUANTITATIVE) {
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
function formatExpr(field, format) {
    return "format(" + field + ", \"" + (format || '') + "\")";
}
export function numberFormatExpr(field, specifiedFormat, config) {
    return formatExpr(field, specifiedFormat || config.numberFormat);
}
export function binFormatExpression(startField, endField, format, config) {
    return startField + " === null || isNaN(" + startField + ") ? \"null\" : " + numberFormatExpr(startField, format, config) + " + \" - \" + " + numberFormatExpr(endField, format, config);
}
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig, isUTCScale, alwaysReturn) {
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
        return formatExpression(timeUnit, field, shortTimeLabels, isUTCScale);
    }
}
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(orderDef, fieldRefOption) {
    return (isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(vgField(orderChannelDef, fieldRefOption));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
export function mergeTitleFieldDefs(f1, f2) {
    var merged = f1.slice();
    f2.forEach(function (fdToMerge) {
        for (var _i = 0, merged_1 = merged; _i < merged_1.length; _i++) {
            var fieldDef1 = merged_1[_i];
            // If already exists, no need to append to merged array
            if (stringify(fieldDef1) === stringify(fdToMerge)) {
                return;
            }
        }
        merged.push(fdToMerge);
    });
    return merged;
}
export function titleMerger(v1, v2) {
    if (isArray(v1.value) && isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitleFieldDefs(v1.value, v2.value)
        };
    }
    else if (!isArray(v1.value) && !isArray(v2.value)) {
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
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export function binRequiresRange(fieldDef, channel) {
    if (!fieldDef.bin) {
        console.warn('Only use this method with binned field defs');
        return false;
    }
    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
    return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFVLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVuRCxPQUFPLEVBQXlDLGVBQWUsRUFBRSxjQUFjLEVBQWlCLE9BQU8sRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUU1SCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRW5DLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBTzVDLE1BQU0sc0JBQXNCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0FBQ2xHLFNBQW1CO0lBQ3JCLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDOUI7S0FDRjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELE1BQU0sMEJBQTBCLENBQWdCLEVBQUUsS0FBZ0IsRUFBRSxTQUErQjtJQUNqRyxLQUF1QixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVB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QixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw0Q0FBNEM7Z0JBQ3ZELEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMscUNBQXFDO1NBQ25FLENBQUM7S0FDSDtJQUNELDJGQUEyRjtJQUMzRixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSwyQkFBMkIsUUFBMEIsRUFBRSxPQUFnQjtJQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDNUQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELDZKQUE2SjtJQUM3SiwyRkFBMkY7SUFDM0YsT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIEZpZWxkRGVmQmFzZSwgRmllbGRSZWZPcHRpb24sIGlzU2NhbGVGaWVsZERlZiwgaXNUaW1lRmllbGREZWYsIE9yZGVyRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya0NvbmZpZywgTWFya0RlZiwgVGV4dENvbmZpZ30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtUaW1lVW5pdH0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtmb3JtYXRFeHByZXNzaW9ufSBmcm9tICcuLi90aW1ldW5pdCc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vdHlwZSc7XG5pbXBvcnQge2NvbnRhaW5zLCBzdHJpbmdpZnl9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtFeHBsaWNpdH0gZnJvbSAnLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi91bml0JztcblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDb25maWcoZTogVmdFbmNvZGVFbnRyeSxcbiAgICBjb25maWc6IFZpZXdDb25maWcgfCBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZywgLy8gVE9ETygjMTg0Mik6IGNvbnNvbGlkYXRlIE1hcmtDb25maWcgfCBUZXh0Q29uZmlnP1xuICAgIHByb3BzTGlzdDogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGNvbmZpZ1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlNYXJrQ29uZmlnKGU6IFZnRW5jb2RlRW50cnksIG1vZGVsOiBVbml0TW9kZWwsIHByb3BzTGlzdDogKGtleW9mIE1hcmtDb25maWcpW10pIHtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBwcm9wc0xpc3QpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldE1hcmtDb25maWcocHJvcGVydHksIG1vZGVsLm1hcmtEZWYsIG1vZGVsLmNvbmZpZyk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGVbcHJvcGVydHldID0ge3ZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICB9XG4gIHJldHVybiBlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGVzKG1hcms6IE1hcmtEZWYpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBbXS5jb25jYXQobWFyay50eXBlLCBtYXJrLnN0eWxlIHx8IFtdKTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydHkgdmFsdWUgZnJvbSBzdHlsZSBvciBtYXJrIHNwZWNpZmljIGNvbmZpZyBwcm9wZXJ0eSBpZiBleGlzdHMuXG4gKiBPdGhlcndpc2UsIHJldHVybiBnZW5lcmFsIG1hcmsgc3BlY2lmaWMgY29uZmlnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFya0NvbmZpZzxQIGV4dGVuZHMga2V5b2YgTWFya0NvbmZpZz4ocHJvcDogUCwgbWFyazogTWFya0RlZiwgY29uZmlnOiBDb25maWcpOiBNYXJrQ29uZmlnW1BdIHtcbiAgLy8gQnkgZGVmYXVsdCwgcmVhZCBmcm9tIG1hcmsgY29uZmlnIGZpcnN0IVxuICBsZXQgdmFsdWUgPSBjb25maWcubWFya1twcm9wXTtcblxuICAvLyBUaGVuIHJlYWQgbWFyayBzcGVjaWZpYyBjb25maWcsIHdoaWNoIGhhcyBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBtYXJrU3BlY2lmaWNDb25maWcgPSBjb25maWdbbWFyay50eXBlXTtcbiAgaWYgKG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFsdWUgPSBtYXJrU3BlY2lmaWNDb25maWdbcHJvcF07XG4gIH1cblxuICAvLyBUaGVuIHJlYWQgc3R5bGUgY29uZmlnLCB3aGljaCBoYXMgZXZlbiBoaWdoZXIgcHJlY2VkZW5jZS5cbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKG1hcmspO1xuICBmb3IgKGNvbnN0IHN0eWxlIG9mIHN0eWxlcykge1xuICAgIGNvbnN0IHN0eWxlQ29uZmlnID0gY29uZmlnLnN0eWxlW3N0eWxlXTtcblxuICAgIC8vIE1hcmtDb25maWcgZXh0ZW5kcyBWZ01hcmtDb25maWcgc28gYSBwcm9wIG1heSBub3QgYmUgYSB2YWxpZCBwcm9wZXJ0eSBmb3Igc3R5bGVcbiAgICAvLyBIb3dldmVyIGhlcmUgd2UgYWxzbyBjaGVjayBpZiBpdCBpcyBkZWZpbmVkLCBzbyBpdCBpcyBva2F5IHRvIGNhc3QgaGVyZVxuICAgIGNvbnN0IHAgPSBwcm9wIGFzIGtleW9mIFZnTWFya0NvbmZpZztcbiAgICBpZiAoc3R5bGVDb25maWcgJiYgc3R5bGVDb25maWdbcF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBzdHlsZUNvbmZpZ1twXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTaWduYWxSZWYoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBleHByOiAnZGF0dW0nIHwgJ3BhcmVudCcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGNvbnN0IGZvcm1hdCA9IG51bWJlckZvcm1hdChmaWVsZERlZiwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcpO1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgY29uc3Qgc3RhcnRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByfSk7XG4gICAgY29uc3QgZW5kRmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAnZW5kJ30pO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZCwgZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJHtmb3JtYXRFeHByKHZnRmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdyYW5nZSd9KSwgZm9ybWF0KX1gXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICBjb25zdCBpc1VUQ1NjYWxlID0gaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBmaWVsZERlZlsnc2NhbGUnXSAmJiBmaWVsZERlZlsnc2NhbGUnXS50eXBlID09PSBTY2FsZVR5cGUuVVRDO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRpbWVGb3JtYXRFeHByZXNzaW9uKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZpZWxkRGVmLnRpbWVVbml0LCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZy50ZXh0LnNob3J0VGltZUxhYmVscywgY29uZmlnLnRpbWVGb3JtYXQsIGlzVVRDU2NhbGUsIHRydWUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJycrJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pfWBcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxUPihzcGVjaWZpZWRWYWx1ZTogVCwgZGVmYXVsdFZhbHVlOiBUIHwge3NpZ25hbDogc3RyaW5nfSkge1xuICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgbnVtYmVyIGZvcm1hdCBmb3IgYSBmaWVsZERlZlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgLy8gYWRkIG51bWJlciBmb3JtYXQgZm9yIHF1YW50aXRhdGl2ZSB0eXBlIG9ubHlcblxuICAgIC8vIFNwZWNpZmllZCBmb3JtYXQgaW4gYXhpcy9sZWdlbmQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gZmllbGREZWYuZm9ybWF0XG4gICAgaWYgKHNwZWNpZmllZEZvcm1hdCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllZEZvcm1hdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyB3b3JrIGNvcnJlY3RseSBmb3IgbnVtZXJpYyBvcmRpbmFsIC8gbm9taW5hbCB0eXBlXG4gICAgcmV0dXJuIGNvbmZpZy5udW1iZXJGb3JtYXQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gYGZvcm1hdCgke2ZpZWxkfSwgXCIke2Zvcm1hdCB8fCAnJ31cIilgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGZvcm1hdEV4cHIoZmllbGQsIHNwZWNpZmllZEZvcm1hdCB8fCBjb25maWcubnVtYmVyRm9ybWF0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkOiBzdHJpbmcsIGVuZEZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gYCR7c3RhcnRGaWVsZH0gPT09IG51bGwgfHwgaXNOYU4oJHtzdGFydEZpZWxkfSkgPyBcIm51bGxcIiA6ICR7bnVtYmVyRm9ybWF0RXhwcihzdGFydEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9ICsgXCIgLSBcIiArICR7bnVtYmVyRm9ybWF0RXhwcihlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpfWA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGV4cHJlc3Npb24gdXNlZCBmb3IgYXhpcy9sZWdlbmQgbGFiZWxzIG9yIHRleHQgbWFyayBmb3IgYSB0ZW1wb3JhbCBmaWVsZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgdGltZVVuaXQ6IFRpbWVVbml0LCBmb3JtYXQ6IHN0cmluZywgc2hvcnRUaW1lTGFiZWxzOiBib29sZWFuLCB0aW1lRm9ybWF0Q29uZmlnOiBzdHJpbmcsIGlzVVRDU2NhbGU6IGJvb2xlYW4sIGFsd2F5c1JldHVybjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgaWYgKCF0aW1lVW5pdCB8fCBmb3JtYXQpIHtcbiAgICAvLyBJZiB0aGVyZSBpcyBub3QgdGltZSB1bml0LCBvciBpZiB1c2VyIGV4cGxpY2l0bHkgc3BlY2lmeSBmb3JtYXQgZm9yIGF4aXMvbGVnZW5kL3RleHQuXG4gICAgZm9ybWF0ID0gZm9ybWF0IHx8IHRpbWVGb3JtYXRDb25maWc7IC8vIG9ubHkgdXNlIGNvbmZpZy50aW1lRm9ybWF0IGlmIHRoZXJlIGlzIG5vIHRpbWVVbml0LlxuXG4gICAgaWYgKGZvcm1hdCB8fCBhbHdheXNSZXR1cm4pIHtcbiAgICAgIHJldHVybiBgJHtpc1VUQ1NjYWxlID8gJ3V0YycgOiAndGltZSd9Rm9ybWF0KCR7ZmllbGR9LCAnJHtmb3JtYXR9JylgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZm9ybWF0RXhwcmVzc2lvbih0aW1lVW5pdCwgZmllbGQsIHNob3J0VGltZUxhYmVscywgaXNVVENTY2FsZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gVmVnYSBzb3J0IHBhcmFtZXRlcnMgKHR1cGxlIG9mIGZpZWxkIGFuZCBvcmRlcikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzb3J0UGFyYW1zKG9yZGVyRGVmOiBPcmRlckZpZWxkRGVmPHN0cmluZz4gfCBPcmRlckZpZWxkRGVmPHN0cmluZz5bXSwgZmllbGRSZWZPcHRpb24/OiBGaWVsZFJlZk9wdGlvbik6IFZnU29ydCB7XG4gIHJldHVybiAoaXNBcnJheShvcmRlckRlZikgPyBvcmRlckRlZiA6IFtvcmRlckRlZl0pLnJlZHVjZSgocywgb3JkZXJDaGFubmVsRGVmKSA9PiB7XG4gICAgcy5maWVsZC5wdXNoKHZnRmllbGQob3JkZXJDaGFubmVsRGVmLCBmaWVsZFJlZk9wdGlvbikpO1xuICAgIHMub3JkZXIucHVzaChvcmRlckNoYW5uZWxEZWYuc29ydCB8fCAnYXNjZW5kaW5nJyk7XG4gICAgcmV0dXJuIHM7XG4gIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG59XG5cbmV4cG9ydCB0eXBlIEF4aXNUaXRsZUNvbXBvbmVudCA9IEF4aXNDb21wb25lbnRQcm9wc1sndGl0bGUnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVGl0bGVGaWVsZERlZnMoZjE6IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10sIGYyOiBGaWVsZERlZkJhc2U8c3RyaW5nPltdKSB7XG4gIGNvbnN0IG1lcmdlZCA9IFsuLi5mMV07XG5cbiAgZjIuZm9yRWFjaCgoZmRUb01lcmdlKSA9PiB7XG4gICAgZm9yIChjb25zdCBmaWVsZERlZjEgb2YgbWVyZ2VkKSB7XG4gICAgICAvLyBJZiBhbHJlYWR5IGV4aXN0cywgbm8gbmVlZCB0byBhcHBlbmQgdG8gbWVyZ2VkIGFycmF5XG4gICAgICBpZiAoc3RyaW5naWZ5KGZpZWxkRGVmMSkgPT09IHN0cmluZ2lmeShmZFRvTWVyZ2UpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVyZ2VkLnB1c2goZmRUb01lcmdlKTtcbiAgfSk7XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZU1lcmdlcihcbiAgdjE6IEV4cGxpY2l0PEF4aXNUaXRsZUNvbXBvbmVudD4sIHYyOiBFeHBsaWNpdDxBeGlzVGl0bGVDb21wb25lbnQ+XG4pIHtcbiAgaWYgKGlzQXJyYXkodjEudmFsdWUpICYmIGlzQXJyYXkodjIudmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCxcbiAgICAgIHZhbHVlOiBtZXJnZVRpdGxlRmllbGREZWZzKHYxLnZhbHVlLCB2Mi52YWx1ZSlcbiAgICB9O1xuICB9IGVsc2UgaWYgKCFpc0FycmF5KHYxLnZhbHVlKSAmJiAhaXNBcnJheSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LCAvLyBrZWVwIHRoZSBvbGQgZXhwbGljaXRcbiAgICAgIHZhbHVlOiB2MS52YWx1ZSA9PT0gdjIudmFsdWUgP1xuICAgICAgICB2MS52YWx1ZSA6IC8vIGlmIHRpdGxlIGlzIHRoZSBzYW1lIGp1c3QgdXNlIG9uZSBvZiB0aGVtXG4gICAgICAgIHYxLnZhbHVlICsgJywgJyArIHYyLnZhbHVlIC8vIGpvaW4gdGl0bGUgd2l0aCBjb21tYSBpZiBkaWZmZXJlbnRcbiAgICB9O1xuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBDb25kaXRpb24gc2hvdWxkIG5vdCBoYXBwZW4gLS0gb25seSBmb3Igd2FybmluZyBpbiBkZXZlbG9wbWVudC4gKi9cbiAgdGhyb3cgbmV3IEVycm9yKCdJdCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZScpO1xufVxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGEgZmllbGREZWYgZm9yIGEgcGFydGljdWxhciBjaGFubmVsIHJlcXVpcmVzIGEgY29tcHV0ZWQgYmluIHJhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgY2hhbm5lbDogQ2hhbm5lbCkge1xuICBpZiAoIWZpZWxkRGVmLmJpbikge1xuICAgIGNvbnNvbGUud2FybignT25seSB1c2UgdGhpcyBtZXRob2Qgd2l0aCBiaW5uZWQgZmllbGQgZGVmcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFdlIG5lZWQgdGhlIHJhbmdlIG9ubHkgd2hlbiB0aGUgdXNlciBleHBsaWNpdGx5IGZvcmNlcyBhIGJpbm5lZCBmaWVsZCB0byBiZSB1c2UgZGlzY3JldGUgc2NhbGUuIEluIHRoaXMgY2FzZSwgYmluIHJhbmdlIGlzIHVzZWQgaW4gYXhpcyBhbmQgbGVnZW5kIGxhYmVscy5cbiAgLy8gV2UgY291bGQgY2hlY2sgd2hldGhlciB0aGUgYXhpcyBvciBsZWdlbmQgZXhpc3RzIChub3QgZGlzYWJsZWQpIGJ1dCB0aGF0IHNlZW1zIG92ZXJraWxsLlxuICByZXR1cm4gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgY29udGFpbnMoWydvcmRpbmFsJywgJ25vbWluYWwnXSwgZmllbGREZWYudHlwZSk7XG59XG4iXX0=