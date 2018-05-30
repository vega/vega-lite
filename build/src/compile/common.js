import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isScaleChannel } from '../channel';
import { isScaleFieldDef, isTimeFieldDef, vgField } from '../fielddef';
import { ScaleType } from '../scale';
import { formatExpression } from '../timeunit';
import { QUANTITATIVE } from '../type';
import { contains, keys, stringify } from '../util';
import { wrapCondition } from './mark/mixins';
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
export function mergeTitle(title1, title2) {
    return title1 === title2 ?
        title1 : // if title is the same just use one of them
        title1 + ', ' + title2; // join title with comma if different
}
export function mergeTitleComponent(v1, v2) {
    if (isArray(v1.value) && isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitleFieldDefs(v1.value, v2.value)
        };
    }
    else if (!isArray(v1.value) && !isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitle(v1.value, v2.value)
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
export function guideEncodeEntry(encoding, model) {
    return keys(encoding).reduce(function (encode, channel) {
        var valueDef = encoding[channel];
        return tslib_1.__assign({}, encode, wrapCondition(model, valueDef, channel, function (x) { return ({ value: x.value }); }));
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBVSxjQUFjLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbkQsT0FBTyxFQUF5QyxlQUFlLEVBQUUsY0FBYyxFQUEyQixPQUFPLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHdEksT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQVcsTUFBTSxhQUFhLENBQUM7QUFDdkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNyQyxPQUFPLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFHbEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUs1QyxNQUFNLHNCQUFzQixDQUFnQixFQUN4QyxNQUE0QyxFQUFFLG9EQUFvRDtBQUNsRyxTQUFtQjtJQUNyQixLQUF1QixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1NBQzlCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRCxNQUFNLDBCQUEwQixDQUFnQixFQUFFLEtBQWdCLEVBQUUsU0FBK0I7SUFDakcsS0FBdUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElB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QUMsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnLCBWaWV3Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtGaWVsZERlZiwgRmllbGREZWZCYXNlLCBGaWVsZFJlZk9wdGlvbiwgaXNTY2FsZUZpZWxkRGVmLCBpc1RpbWVGaWVsZERlZiwgT3JkZXJGaWVsZERlZiwgVmFsdWVEZWYsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7R3VpZGVFbmNvZGluZ0VudHJ5fSBmcm9tICcuLi9ndWlkZSc7XG5pbXBvcnQge01hcmtDb25maWcsIE1hcmtEZWYsIFRleHRDb25maWd9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7Zm9ybWF0RXhwcmVzc2lvbiwgVGltZVVuaXR9IGZyb20gJy4uL3RpbWV1bml0JztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIGtleXMsIHN0cmluZ2lmeX0gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1ZnRW5jb2RlQ2hhbm5lbCwgVmdFbmNvZGVFbnRyeSwgVmdNYXJrQ29uZmlnLCBWZ1NvcnR9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QXhpc0NvbXBvbmVudFByb3BzfSBmcm9tICcuL2F4aXMvY29tcG9uZW50JztcbmltcG9ydCB7d3JhcENvbmRpdGlvbn0gZnJvbSAnLi9tYXJrL21peGlucyc7XG5pbXBvcnQge0V4cGxpY2l0fSBmcm9tICcuL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuL3VuaXQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbmZpZyhlOiBWZ0VuY29kZUVudHJ5LFxuICAgIGNvbmZpZzogVmlld0NvbmZpZyB8IE1hcmtDb25maWcgfCBUZXh0Q29uZmlnLCAvLyBUT0RPKCMxODQyKTogY29uc29saWRhdGUgTWFya0NvbmZpZyB8IFRleHRDb25maWc/XG4gICAgcHJvcHNMaXN0OiBzdHJpbmdbXSkge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BzTGlzdCkge1xuICAgIGNvbnN0IHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseU1hcmtDb25maWcoZTogVmdFbmNvZGVFbnRyeSwgbW9kZWw6IFVuaXRNb2RlbCwgcHJvcHNMaXN0OiAoa2V5b2YgTWFya0NvbmZpZylbXSkge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BzTGlzdCkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0TWFya0NvbmZpZyhwcm9wZXJ0eSwgbW9kZWwubWFya0RlZiwgbW9kZWwuY29uZmlnKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZXMobWFyazogTWFya0RlZik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtdLmNvbmNhdChtYXJrLnR5cGUsIG1hcmsuc3R5bGUgfHwgW10pO1xufVxuXG4vKipcbiAqIFJldHVybiBwcm9wZXJ0eSB2YWx1ZSBmcm9tIHN0eWxlIG9yIG1hcmsgc3BlY2lmaWMgY29uZmlnIHByb3BlcnR5IGlmIGV4aXN0cy5cbiAqIE90aGVyd2lzZSwgcmV0dXJuIGdlbmVyYWwgbWFyayBzcGVjaWZpYyBjb25maWcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXJrQ29uZmlnPFAgZXh0ZW5kcyBrZXlvZiBNYXJrQ29uZmlnPihwcm9wOiBQLCBtYXJrOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZyk6IE1hcmtDb25maWdbUF0ge1xuICAvLyBCeSBkZWZhdWx0LCByZWFkIGZyb20gbWFyayBjb25maWcgZmlyc3QhXG4gIGxldCB2YWx1ZSA9IGNvbmZpZy5tYXJrW3Byb3BdO1xuXG4gIC8vIFRoZW4gcmVhZCBtYXJrIHNwZWNpZmljIGNvbmZpZywgd2hpY2ggaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gIGNvbnN0IG1hcmtTcGVjaWZpY0NvbmZpZyA9IGNvbmZpZ1ttYXJrLnR5cGVdO1xuICBpZiAobWFya1NwZWNpZmljQ29uZmlnW3Byb3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YWx1ZSA9IG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXTtcbiAgfVxuXG4gIC8vIFRoZW4gcmVhZCBzdHlsZSBjb25maWcsIHdoaWNoIGhhcyBldmVuIGhpZ2hlciBwcmVjZWRlbmNlLlxuICBjb25zdCBzdHlsZXMgPSBnZXRTdHlsZXMobWFyayk7XG4gIGZvciAoY29uc3Qgc3R5bGUgb2Ygc3R5bGVzKSB7XG4gICAgY29uc3Qgc3R5bGVDb25maWcgPSBjb25maWcuc3R5bGVbc3R5bGVdO1xuXG4gICAgLy8gTWFya0NvbmZpZyBleHRlbmRzIFZnTWFya0NvbmZpZyBzbyBhIHByb3AgbWF5IG5vdCBiZSBhIHZhbGlkIHByb3BlcnR5IGZvciBzdHlsZVxuICAgIC8vIEhvd2V2ZXIgaGVyZSB3ZSBhbHNvIGNoZWNrIGlmIGl0IGlzIGRlZmluZWQsIHNvIGl0IGlzIG9rYXkgdG8gY2FzdCBoZXJlXG4gICAgY29uc3QgcCA9IHByb3AgYXMga2V5b2YgVmdNYXJrQ29uZmlnO1xuICAgIGlmIChzdHlsZUNvbmZpZyAmJiBzdHlsZUNvbmZpZ1twXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IHN0eWxlQ29uZmlnW3BdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFNpZ25hbFJlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGV4cHI6ICdkYXR1bScgfCAncGFyZW50JywgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZm9ybWF0ID0gbnVtYmVyRm9ybWF0KGZpZWxkRGVmLCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZyk7XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBjb25zdCBzdGFydEZpZWxkID0gdmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KTtcbiAgICBjb25zdCBlbmRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdlbmQnfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkLCBlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGAke2Zvcm1hdEV4cHIodmdGaWVsZChmaWVsZERlZiwge2V4cHIsIGJpblN1ZmZpeDogJ3JhbmdlJ30pLCBmb3JtYXQpfWBcbiAgICB9O1xuICB9IGVsc2UgaWYgKGlzVGltZUZpZWxkRGVmKGZpZWxkRGVmKSkge1xuICAgIGNvbnN0IGlzVVRDU2NhbGUgPSBpc1NjYWxlRmllbGREZWYoZmllbGREZWYpICYmIGZpZWxkRGVmWydzY2FsZSddICYmIGZpZWxkRGVmWydzY2FsZSddLnR5cGUgPT09IFNjYWxlVHlwZS5VVEM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogdGltZUZvcm1hdEV4cHJlc3Npb24odmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KSwgZmllbGREZWYudGltZVVuaXQsIHNwZWNpZmllZEZvcm1hdCwgY29uZmlnLnRleHQuc2hvcnRUaW1lTGFiZWxzLCBjb25maWcudGltZUZvcm1hdCwgaXNVVENTY2FsZSwgdHJ1ZSlcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGAnJyske3ZnRmllbGQoZmllbGREZWYsIHtleHByfSl9YFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNwZWNpZmllZE9yRGVmYXVsdFZhbHVlPFQ+KHNwZWNpZmllZFZhbHVlOiBULCBkZWZhdWx0VmFsdWU6IFQgfCB7c2lnbmFsOiBzdHJpbmd9KSB7XG4gIGlmIChzcGVjaWZpZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNwZWNpZmllZFZhbHVlO1xuICB9XG4gIHJldHVybiBkZWZhdWx0VmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJucyBudW1iZXIgZm9ybWF0IGZvciBhIGZpZWxkRGVmXG4gKlxuICogQHBhcmFtIGZvcm1hdCBleHBsaWNpdGx5IHNwZWNpZmllZCBmb3JtYXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckZvcm1hdChmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIGlmIChmaWVsZERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICAvLyBhZGQgbnVtYmVyIGZvcm1hdCBmb3IgcXVhbnRpdGF0aXZlIHR5cGUgb25seVxuXG4gICAgLy8gU3BlY2lmaWVkIGZvcm1hdCBpbiBheGlzL2xlZ2VuZCBoYXMgaGlnaGVyIHByZWNlZGVuY2UgdGhhbiBmaWVsZERlZi5mb3JtYXRcbiAgICBpZiAoc3BlY2lmaWVkRm9ybWF0KSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVkRm9ybWF0O1xuICAgIH1cblxuICAgIC8vIFRPRE86IG5lZWQgdG8gbWFrZSB0aGlzIHdvcmsgY29ycmVjdGx5IGZvciBudW1lcmljIG9yZGluYWwgLyBub21pbmFsIHR5cGVcbiAgICByZXR1cm4gY29uZmlnLm51bWJlckZvcm1hdDtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRFeHByKGZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nKSB7XG4gIHJldHVybiBgZm9ybWF0KCR7ZmllbGR9LCBcIiR7Zm9ybWF0IHx8ICcnfVwiKWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXRFeHByKGZpZWxkOiBzdHJpbmcsIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gZm9ybWF0RXhwcihmaWVsZCwgc3BlY2lmaWVkRm9ybWF0IHx8IGNvbmZpZy5udW1iZXJGb3JtYXQpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5Gb3JtYXRFeHByZXNzaW9uKHN0YXJ0RmllbGQ6IHN0cmluZywgZW5kRmllbGQ6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiBgJHtzdGFydEZpZWxkfSA9PT0gbnVsbCB8fCBpc05hTigke3N0YXJ0RmllbGR9KSA/IFwibnVsbFwiIDogJHtudW1iZXJGb3JtYXRFeHByKHN0YXJ0RmllbGQsIGZvcm1hdCwgY29uZmlnKX0gKyBcIiAtIFwiICsgJHtudW1iZXJGb3JtYXRFeHByKGVuZEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9YDtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgdGhlIHRpbWUgZXhwcmVzc2lvbiB1c2VkIGZvciBheGlzL2xlZ2VuZCBsYWJlbHMgb3IgdGV4dCBtYXJrIGZvciBhIHRlbXBvcmFsIGZpZWxkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lRm9ybWF0RXhwcmVzc2lvbihmaWVsZDogc3RyaW5nLCB0aW1lVW5pdDogVGltZVVuaXQsIGZvcm1hdDogc3RyaW5nLCBzaG9ydFRpbWVMYWJlbHM6IGJvb2xlYW4sIHRpbWVGb3JtYXRDb25maWc6IHN0cmluZywgaXNVVENTY2FsZTogYm9vbGVhbiwgYWx3YXlzUmV0dXJuOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0IHx8IGZvcm1hdCkge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vdCB0aW1lIHVuaXQsIG9yIGlmIHVzZXIgZXhwbGljaXRseSBzcGVjaWZ5IGZvcm1hdCBmb3IgYXhpcy9sZWdlbmQvdGV4dC5cbiAgICBmb3JtYXQgPSBmb3JtYXQgfHwgdGltZUZvcm1hdENvbmZpZzsgLy8gb25seSB1c2UgY29uZmlnLnRpbWVGb3JtYXQgaWYgdGhlcmUgaXMgbm8gdGltZVVuaXQuXG5cbiAgICBpZiAoZm9ybWF0IHx8IGFsd2F5c1JldHVybikge1xuICAgICAgcmV0dXJuIGAke2lzVVRDU2NhbGUgPyAndXRjJyA6ICd0aW1lJ31Gb3JtYXQoJHtmaWVsZH0sICcke2Zvcm1hdH0nKWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmb3JtYXRFeHByZXNzaW9uKHRpbWVVbml0LCBmaWVsZCwgc2hvcnRUaW1lTGFiZWxzLCBpc1VUQ1NjYWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBWZWdhIHNvcnQgcGFyYW1ldGVycyAodHVwbGUgb2YgZmllbGQgYW5kIG9yZGVyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRQYXJhbXMob3JkZXJEZWY6IE9yZGVyRmllbGREZWY8c3RyaW5nPiB8IE9yZGVyRmllbGREZWY8c3RyaW5nPltdLCBmaWVsZFJlZk9wdGlvbj86IEZpZWxkUmVmT3B0aW9uKTogVmdTb3J0IHtcbiAgcmV0dXJuIChpc0FycmF5KG9yZGVyRGVmKSA/IG9yZGVyRGVmIDogW29yZGVyRGVmXSkucmVkdWNlKChzLCBvcmRlckNoYW5uZWxEZWYpID0+IHtcbiAgICBzLmZpZWxkLnB1c2godmdGaWVsZChvcmRlckNoYW5uZWxEZWYsIGZpZWxkUmVmT3B0aW9uKSk7XG4gICAgcy5vcmRlci5wdXNoKG9yZGVyQ2hhbm5lbERlZi5zb3J0IHx8ICdhc2NlbmRpbmcnKTtcbiAgICByZXR1cm4gcztcbiAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbn1cblxuZXhwb3J0IHR5cGUgQXhpc1RpdGxlQ29tcG9uZW50ID0gQXhpc0NvbXBvbmVudFByb3BzWyd0aXRsZSddO1xuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUaXRsZUZpZWxkRGVmcyhmMTogRmllbGREZWZCYXNlPHN0cmluZz5bXSwgZjI6IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10pIHtcbiAgY29uc3QgbWVyZ2VkID0gWy4uLmYxXTtcblxuICBmMi5mb3JFYWNoKChmZFRvTWVyZ2UpID0+IHtcbiAgICBmb3IgKGNvbnN0IGZpZWxkRGVmMSBvZiBtZXJnZWQpIHtcbiAgICAgIC8vIElmIGFscmVhZHkgZXhpc3RzLCBubyBuZWVkIHRvIGFwcGVuZCB0byBtZXJnZWQgYXJyYXlcbiAgICAgIGlmIChzdHJpbmdpZnkoZmllbGREZWYxKSA9PT0gc3RyaW5naWZ5KGZkVG9NZXJnZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBtZXJnZWQucHVzaChmZFRvTWVyZ2UpO1xuICB9KTtcbiAgcmV0dXJuIG1lcmdlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVGl0bGUodGl0bGUxOiBzdHJpbmcsIHRpdGxlMjogc3RyaW5nKSB7XG4gIHJldHVybiB0aXRsZTEgPT09IHRpdGxlMiA/XG4gICAgdGl0bGUxIDogLy8gaWYgdGl0bGUgaXMgdGhlIHNhbWUganVzdCB1c2Ugb25lIG9mIHRoZW1cbiAgICB0aXRsZTEgKyAnLCAnICsgdGl0bGUyOyAvLyBqb2luIHRpdGxlIHdpdGggY29tbWEgaWYgZGlmZmVyZW50XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRpdGxlQ29tcG9uZW50KFxuICB2MTogRXhwbGljaXQ8QXhpc1RpdGxlQ29tcG9uZW50PiwgdjI6IEV4cGxpY2l0PEF4aXNUaXRsZUNvbXBvbmVudD5cbikge1xuICBpZiAoaXNBcnJheSh2MS52YWx1ZSkgJiYgaXNBcnJheSh2Mi52YWx1ZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwbGljaXQ6IHYxLmV4cGxpY2l0LFxuICAgICAgdmFsdWU6IG1lcmdlVGl0bGVGaWVsZERlZnModjEudmFsdWUsIHYyLnZhbHVlKVxuICAgIH07XG4gIH0gZWxzZSBpZiAoIWlzQXJyYXkodjEudmFsdWUpICYmICFpc0FycmF5KHYyLnZhbHVlKSkge1xuICAgIHJldHVybiB7XG4gICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsIC8vIGtlZXAgdGhlIG9sZCBleHBsaWNpdFxuICAgICAgdmFsdWU6IG1lcmdlVGl0bGUodjEudmFsdWUsIHYyLnZhbHVlKVxuICAgIH07XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IENvbmRpdGlvbiBzaG91bGQgbm90IGhhcHBlbiAtLSBvbmx5IGZvciB3YXJuaW5nIGluIGRldmVsb3BtZW50LiAqL1xuICB0aHJvdyBuZXcgRXJyb3IoJ0l0IHNob3VsZCBuZXZlciByZWFjaCBoZXJlJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBmaWVsZERlZiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwgcmVxdWlyZXMgYSBjb21wdXRlZCBiaW4gcmFuZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmICghZmllbGREZWYuYmluKSB7XG4gICAgY29uc29sZS53YXJuKCdPbmx5IHVzZSB0aGlzIG1ldGhvZCB3aXRoIGJpbm5lZCBmaWVsZCBkZWZzJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gV2UgbmVlZCB0aGUgcmFuZ2Ugb25seSB3aGVuIHRoZSB1c2VyIGV4cGxpY2l0bHkgZm9yY2VzIGEgYmlubmVkIGZpZWxkIHRvIGJlIHVzZSBkaXNjcmV0ZSBzY2FsZS4gSW4gdGhpcyBjYXNlLCBiaW4gcmFuZ2UgaXMgdXNlZCBpbiBheGlzIGFuZCBsZWdlbmQgbGFiZWxzLlxuICAvLyBXZSBjb3VsZCBjaGVjayB3aGV0aGVyIHRoZSBheGlzIG9yIGxlZ2VuZCBleGlzdHMgKG5vdCBkaXNhYmxlZCkgYnV0IHRoYXQgc2VlbXMgb3ZlcmtpbGwuXG4gIHJldHVybiBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBjb250YWlucyhbJ29yZGluYWwnLCAnbm9taW5hbCddLCBmaWVsZERlZi50eXBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGd1aWRlRW5jb2RlRW50cnkoZW5jb2Rpbmc6IEd1aWRlRW5jb2RpbmdFbnRyeSwgbW9kZWw6IFVuaXRNb2RlbCkge1xuICByZXR1cm4ga2V5cyhlbmNvZGluZykucmVkdWNlKChlbmNvZGUsIGNoYW5uZWw6IFZnRW5jb2RlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlRGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmVuY29kZSxcbiAgICAgIC4uLndyYXBDb25kaXRpb24obW9kZWwsIHZhbHVlRGVmLCBjaGFubmVsLCAoeDogVmFsdWVEZWYpID0+ICh7dmFsdWU6IHgudmFsdWV9KSlcbiAgICB9O1xuICB9LCB7fSk7XG59XG4iXX0=