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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtDO0FBQ2xDLHNDQUFtRDtBQUVuRCx3Q0FBOEc7QUFFOUcsa0NBQW1DO0FBRW5DLHdDQUE2QztBQUM3QyxnQ0FBcUM7QUFDckMsZ0NBQWlDO0FBTWpDLHFCQUE0QixDQUFnQixFQUN4QyxNQUE0QyxFQUFFLG9EQUFvRDtBQUNsRyxTQUFtQjtJQUNyQixHQUFHLENBQUMsQ0FBbUIsVUFBUyxFQUFULHVCQUFTLEVBQVQsdUJBQVMsRUFBVCxJQUFTO1FBQTNCLElBQU0sUUFBUSxrQkFBQTtRQUNqQixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQy9CLENBQUM7S0FDRjtJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBVkQsa0NBVUM7QUFFRCx5QkFBZ0MsQ0FBZ0IsRUFBRSxLQUFnQixFQUFFLFNBQStCO0lBQ2pHLEdBQUcsQ0FBQyxDQUFtQixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQy9CLENBQUM7S0FDRjtJ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QVMsRUFBRSxTQUFTLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQVRELDRDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZywgVmlld0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWYsIEZpZWxkUmVmT3B0aW9uLCBpc1NjYWxlRmllbGREZWYsIGlzVGltZUZpZWxkRGVmLCBPcmRlckZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQge01hcmtDb25maWcsIE1hcmtEZWYsIFRleHRDb25maWd9IGZyb20gJy4uL21hcmsnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7VGltZVVuaXR9IGZyb20gJy4uL3RpbWV1bml0JztcbmltcG9ydCB7Zm9ybWF0RXhwcmVzc2lvbn0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWluc30gZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQge1ZnRW5jb2RlRW50cnksIFZnTWFya0NvbmZpZywgVmdTb3J0fSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0V4cGxpY2l0fSBmcm9tICcuL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuL3VuaXQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbmZpZyhlOiBWZ0VuY29kZUVudHJ5LFxuICAgIGNvbmZpZzogVmlld0NvbmZpZyB8IE1hcmtDb25maWcgfCBUZXh0Q29uZmlnLCAvLyBUT0RPKCMxODQyKTogY29uc29saWRhdGUgTWFya0NvbmZpZyB8IFRleHRDb25maWc/XG4gICAgcHJvcHNMaXN0OiBzdHJpbmdbXSkge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BzTGlzdCkge1xuICAgIGNvbnN0IHZhbHVlID0gY29uZmlnW3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseU1hcmtDb25maWcoZTogVmdFbmNvZGVFbnRyeSwgbW9kZWw6IFVuaXRNb2RlbCwgcHJvcHNMaXN0OiAoa2V5b2YgTWFya0NvbmZpZylbXSkge1xuICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIHByb3BzTGlzdCkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0TWFya0NvbmZpZyhwcm9wZXJ0eSwgbW9kZWwubWFya0RlZiwgbW9kZWwuY29uZmlnKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZVtwcm9wZXJ0eV0gPSB7dmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZXMobWFyazogTWFya0RlZik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFtdLmNvbmNhdChtYXJrLnR5cGUsIG1hcmsuc3R5bGUgfHwgW10pO1xufVxuXG4vKipcbiAqIFJldHVybiBwcm9wZXJ0eSB2YWx1ZSBmcm9tIHN0eWxlIG9yIG1hcmsgc3BlY2lmaWMgY29uZmlnIHByb3BlcnR5IGlmIGV4aXN0cy5cbiAqIE90aGVyd2lzZSwgcmV0dXJuIGdlbmVyYWwgbWFyayBzcGVjaWZpYyBjb25maWcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXJrQ29uZmlnPFAgZXh0ZW5kcyBrZXlvZiBNYXJrQ29uZmlnPihwcm9wOiBQLCBtYXJrOiBNYXJrRGVmLCBjb25maWc6IENvbmZpZyk6IE1hcmtDb25maWdbUF0ge1xuICAvLyBCeSBkZWZhdWx0LCByZWFkIGZyb20gbWFyayBjb25maWcgZmlyc3QhXG4gIGxldCB2YWx1ZSA9IGNvbmZpZy5tYXJrW3Byb3BdO1xuXG4gIC8vIFRoZW4gcmVhZCBtYXJrIHNwZWNpZmljIGNvbmZpZywgd2hpY2ggaGFzIGhpZ2hlciBwcmVjZWRlbmNlXG4gIGNvbnN0IG1hcmtTcGVjaWZpY0NvbmZpZyA9IGNvbmZpZ1ttYXJrLnR5cGVdO1xuICBpZiAobWFya1NwZWNpZmljQ29uZmlnW3Byb3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YWx1ZSA9IG1hcmtTcGVjaWZpY0NvbmZpZ1twcm9wXTtcbiAgfVxuXG4gIC8vIFRoZW4gcmVhZCBzdHlsZSBjb25maWcsIHdoaWNoIGhhcyBldmVuIGhpZ2hlciBwcmVjZWRlbmNlLlxuICBjb25zdCBzdHlsZXMgPSBnZXRTdHlsZXMobWFyayk7XG4gIGZvciAoY29uc3Qgc3R5bGUgb2Ygc3R5bGVzKSB7XG4gICAgY29uc3Qgc3R5bGVDb25maWcgPSBjb25maWcuc3R5bGVbc3R5bGVdO1xuXG4gICAgLy8gTWFya0NvbmZpZyBleHRlbmRzIFZnTWFya0NvbmZpZyBzbyBhIHByb3AgbWF5IG5vdCBiZSBhIHZhbGlkIHByb3BlcnR5IGZvciBzdHlsZVxuICAgIC8vIEhvd2V2ZXIgaGVyZSB3ZSBhbHNvIGNoZWNrIGlmIGl0IGlzIGRlZmluZWQsIHNvIGl0IGlzIG9rYXkgdG8gY2FzdCBoZXJlXG4gICAgY29uc3QgcCA9IHByb3AgYXMga2V5b2YgVmdNYXJrQ29uZmlnO1xuICAgIGlmIChzdHlsZUNvbmZpZyAmJiBzdHlsZUNvbmZpZ1twXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IHN0eWxlQ29uZmlnW3BdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFNpZ25hbFJlZihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGV4cHI6ICdkYXR1bScgfCAncGFyZW50JywgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgZm9ybWF0ID0gbnVtYmVyRm9ybWF0KGZpZWxkRGVmLCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZyk7XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBjb25zdCBzdGFydEZpZWxkID0gdmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KTtcbiAgICBjb25zdCBlbmRGaWVsZCA9IHZnRmllbGQoZmllbGREZWYsIHtleHByLCBiaW5TdWZmaXg6ICdlbmQnfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkLCBlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpXG4gICAgfTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IGAke2Zvcm1hdEV4cHIodmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KSwgZm9ybWF0KX1gXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1RpbWVGaWVsZERlZihmaWVsZERlZikpIHtcbiAgICBjb25zdCBpc1VUQ1NjYWxlID0gaXNTY2FsZUZpZWxkRGVmKGZpZWxkRGVmKSAmJiBmaWVsZERlZlsnc2NhbGUnXSAmJiBmaWVsZERlZlsnc2NhbGUnXS50eXBlID09PSBTY2FsZVR5cGUuVVRDO1xuICAgIHJldHVybiB7XG4gICAgICBzaWduYWw6IHRpbWVGb3JtYXRFeHByZXNzaW9uKHZnRmllbGQoZmllbGREZWYsIHtleHByfSksIGZpZWxkRGVmLnRpbWVVbml0LCBzcGVjaWZpZWRGb3JtYXQsIGNvbmZpZy50ZXh0LnNob3J0VGltZUxhYmVscywgY29uZmlnLnRpbWVGb3JtYXQsIGlzVVRDU2NhbGUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBgJycrJHt2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pfWBcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZTxUPihzcGVjaWZpZWRWYWx1ZTogVCwgZGVmYXVsdFZhbHVlOiBUIHwge3NpZ25hbDogc3RyaW5nfSkge1xuICBpZiAoc3BlY2lmaWVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBzcGVjaWZpZWRWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgbnVtYmVyIGZvcm1hdCBmb3IgYSBmaWVsZERlZlxuICpcbiAqIEBwYXJhbSBmb3JtYXQgZXhwbGljaXRseSBzcGVjaWZpZWQgZm9ybWF0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBudW1iZXJGb3JtYXQoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNwZWNpZmllZEZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoZmllbGREZWYudHlwZSA9PT0gUVVBTlRJVEFUSVZFKSB7XG4gICAgLy8gYWRkIG51bWJlciBmb3JtYXQgZm9yIHF1YW50aXRhdGl2ZSB0eXBlIG9ubHlcblxuICAgIC8vIFNwZWNpZmllZCBmb3JtYXQgaW4gYXhpcy9sZWdlbmQgaGFzIGhpZ2hlciBwcmVjZWRlbmNlIHRoYW4gZmllbGREZWYuZm9ybWF0XG4gICAgaWYgKHNwZWNpZmllZEZvcm1hdCkge1xuICAgICAgcmV0dXJuIHNwZWNpZmllZEZvcm1hdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBuZWVkIHRvIG1ha2UgdGhpcyB3b3JrIGNvcnJlY3RseSBmb3IgbnVtZXJpYyBvcmRpbmFsIC8gbm9taW5hbCB0eXBlXG4gICAgcmV0dXJuIGNvbmZpZy5udW1iZXJGb3JtYXQ7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZykge1xuICByZXR1cm4gYGZvcm1hdCgke2ZpZWxkfSwgXCIke2Zvcm1hdCB8fCAnJ31cIilgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0RXhwcihmaWVsZDogc3RyaW5nLCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGZvcm1hdEV4cHIoZmllbGQsIHNwZWNpZmllZEZvcm1hdCB8fCBjb25maWcubnVtYmVyRm9ybWF0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYmluRm9ybWF0RXhwcmVzc2lvbihzdGFydEZpZWxkOiBzdHJpbmcsIGVuZEZpZWxkOiBzdHJpbmcsIGZvcm1hdDogc3RyaW5nLCBjb25maWc6IENvbmZpZykge1xuICByZXR1cm4gYCR7c3RhcnRGaWVsZH0gPT09IG51bGwgfHwgaXNOYU4oJHtzdGFydEZpZWxkfSkgPyBcIm51bGxcIiA6ICR7bnVtYmVyRm9ybWF0RXhwcihzdGFydEZpZWxkLCBmb3JtYXQsIGNvbmZpZyl9ICsgXCIgLSBcIiArICR7bnVtYmVyRm9ybWF0RXhwcihlbmRGaWVsZCwgZm9ybWF0LCBjb25maWcpfWA7XG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB0aW1lIGV4cHJlc3Npb24gdXNlZCBmb3IgYXhpcy9sZWdlbmQgbGFiZWxzIG9yIHRleHQgbWFyayBmb3IgYSB0ZW1wb3JhbCBmaWVsZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZUZvcm1hdEV4cHJlc3Npb24oZmllbGQ6IHN0cmluZywgdGltZVVuaXQ6IFRpbWVVbml0LCBmb3JtYXQ6IHN0cmluZywgc2hvcnRUaW1lTGFiZWxzOiBib29sZWFuLCB0aW1lRm9ybWF0Q29uZmlnOiBzdHJpbmcsIGlzVVRDU2NhbGU6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXRpbWVVbml0IHx8IGZvcm1hdCkge1xuICAgIC8vIElmIHRoZXJlIGlzIG5vdCB0aW1lIHVuaXQsIG9yIGlmIHVzZXIgZXhwbGljaXRseSBzcGVjaWZ5IGZvcm1hdCBmb3IgYXhpcy9sZWdlbmQvdGV4dC5cbiAgICBjb25zdCBfZm9ybWF0ID0gZm9ybWF0IHx8IHRpbWVGb3JtYXRDb25maWc7IC8vIG9ubHkgdXNlIGNvbmZpZy50aW1lRm9ybWF0IGlmIHRoZXJlIGlzIG5vIHRpbWVVbml0LlxuICAgIGlmIChpc1VUQ1NjYWxlKSB7XG4gICAgICByZXR1cm4gYHV0Y0Zvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgdGltZUZvcm1hdCgke2ZpZWxkfSwgJyR7X2Zvcm1hdH0nKWA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmb3JtYXRFeHByZXNzaW9uKHRpbWVVbml0LCBmaWVsZCwgc2hvcnRUaW1lTGFiZWxzLCBpc1VUQ1NjYWxlKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiBWZWdhIHNvcnQgcGFyYW1ldGVycyAodHVwbGUgb2YgZmllbGQgYW5kIG9yZGVyKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRQYXJhbXMob3JkZXJEZWY6IE9yZGVyRmllbGREZWY8c3RyaW5nPiB8IE9yZGVyRmllbGREZWY8c3RyaW5nPltdLCBmaWVsZFJlZk9wdGlvbj86IEZpZWxkUmVmT3B0aW9uKTogVmdTb3J0IHtcbiAgcmV0dXJuIChpc0FycmF5KG9yZGVyRGVmKSA/IG9yZGVyRGVmIDogW29yZGVyRGVmXSkucmVkdWNlKChzLCBvcmRlckNoYW5uZWxEZWYpID0+IHtcbiAgICBzLmZpZWxkLnB1c2godmdGaWVsZChvcmRlckNoYW5uZWxEZWYsIGZpZWxkUmVmT3B0aW9uKSk7XG4gICAgcy5vcmRlci5wdXNoKG9yZGVyQ2hhbm5lbERlZi5zb3J0IHx8ICdhc2NlbmRpbmcnKTtcbiAgICByZXR1cm4gcztcbiAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpdGxlTWVyZ2VyKHYxOiBFeHBsaWNpdDxzdHJpbmc+LCB2MjogRXhwbGljaXQ8c3RyaW5nPikge1xuICByZXR1cm4ge1xuICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCwgLy8ga2VlcCB0aGUgb2xkIGV4cGxpY2l0XG4gICAgdmFsdWU6IHYxLnZhbHVlID09PSB2Mi52YWx1ZSA/XG4gICAgICB2MS52YWx1ZSA6IC8vIGlmIHRpdGxlIGlzIHRoZSBzYW1lIGp1c3QgdXNlIG9uZSBvZiB0aGVtXG4gICAgICB2MS52YWx1ZSArICcsICcgKyB2Mi52YWx1ZSAvLyBqb2luIHRpdGxlIHdpdGggY29tbWEgaWYgZGlmZmVyZW50XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBmaWVsZERlZiBmb3IgYSBwYXJ0aWN1bGFyIGNoYW5uZWwgcmVxdWlyZXMgYSBjb21wdXRlZCBiaW4gcmFuZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIGlmICghZmllbGREZWYuYmluKSB7XG4gICAgY29uc29sZS53YXJuKCdPbmx5IHVzZSB0aGlzIG1ldGhvZCB3aXRoIGJpbm5lZCBmaWVsZCBkZWZzJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gV2UgbmVlZCB0aGUgcmFuZ2Ugb25seSB3aGVuIHRoZSB1c2VyIGV4cGxpY2l0bHkgZm9yY2VzIGEgYmlubmVkIGZpZWxkIHRvIGJlIHVzZSBkaXNjcmV0ZSBzY2FsZS4gSW4gdGhpcyBjYXNlLCBiaW4gcmFuZ2UgaXMgdXNlZCBpbiBheGlzIGFuZCBsZWdlbmQgbGFiZWxzLlxuICAvLyBXZSBjb3VsZCBjaGVjayB3aGV0aGVyIHRoZSBheGlzIG9yIGxlZ2VuZCBleGlzdHMgKG5vdCBkaXNhYmxlZCkgYnV0IHRoYXQgc2VlbXMgb3ZlcmtpbGwuXG4gIHJldHVybiBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBjb250YWlucyhbJ29yZGluYWwnLCAnbm9taW5hbCddLCBmaWVsZERlZi50eXBlKTtcbn1cbiJdfQ==