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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUNsQyxzQ0FBbUQ7QUFFbkQsd0NBQXNJO0FBR3RJLGtDQUFtQztBQUNuQyx3Q0FBdUQ7QUFDdkQsZ0NBQXFDO0FBQ3JDLGdDQUFrRDtBQUdsRCx3Q0FBNEM7QUFLNUMscUJBQTRCLENBQWdCLEVBQ3hDLE1BQTRDLEVBQUUsb0RBQW9EO0FBQ2xHLFNBQW1CO0lBQ3JCLEtBQXVCLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztRQUEzQixJQUFNLFFBQVEsa0JBQUE7UUFDakIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDOUI7S0FDRjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQVZELGtDQVVDO0FBRUQseUJBQWdDLENBQWdCLEVBQUUsS0FBZ0IsRUFBRSxTQUErQjtJQUNqRyxLQUF1QixVQUFTLEVBQVQsdUJBQVMsRUFBVCx1QkFBUyxFQUFULElBQVM7UUFBM0IsSUFBTSxRQUFRLGtCQUFBO1FBQ2pCLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3ZCLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztTQUM5QjtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBUkQsMENBUUM7QUFFRCxtQkFBMEIsSUFBYTtJQUNy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RUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDO1NBQ3RDLENBQUM7S0FDSDtJQUNELDJGQUEyRjtJQUMzRixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDaEQsQ0FBQztBQWhCRCxrREFnQkM7QUFFRDs7R0FFRztBQUNILDBCQUFpQyxRQUEwQixFQUFFLE9BQWdCO0lBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUM1RCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsNkpBQTZKO0lBQzdKLDJGQUEyRjtJQUMzRixPQUFPLHdCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksZUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBVEQsNENBU0M7QUFFRCwwQkFBaUMsUUFBNEIsRUFBRSxLQUFnQjtJQUM3RSxPQUFPLFdBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBd0I7UUFDNUQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLDRCQUNLLE1BQU0sRUFDTixzQkFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQUMsQ0FBVyxJQUFLLE9BQUEsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFDLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxFQUMvRTtJQUNKLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFSRCw0Q0FRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWcsIFZpZXdDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmLCBGaWVsZERlZkJhc2UsIEZpZWxkUmVmT3B0aW9uLCBpc1NjYWxlRmllbGREZWYsIGlzVGltZUZpZWxkRGVmLCBPcmRlckZpZWxkRGVmLCBWYWx1ZURlZiwgdmdGaWVsZH0gZnJvbSAnLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtHdWlkZUVuY29kaW5nRW50cnl9IGZyb20gJy4uL2d1aWRlJztcbmltcG9ydCB7TWFya0NvbmZpZywgTWFya0RlZiwgVGV4dENvbmZpZ30gZnJvbSAnLi4vbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtmb3JtYXRFeHByZXNzaW9uLCBUaW1lVW5pdH0gZnJvbSAnLi4vdGltZXVuaXQnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHtjb250YWlucywga2V5cywgc3RyaW5naWZ5fSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdFbmNvZGVDaGFubmVsLCBWZ0VuY29kZUVudHJ5LCBWZ01hcmtDb25maWcsIFZnU29ydH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50UHJvcHN9IGZyb20gJy4vYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHt3cmFwQ29uZGl0aW9ufSBmcm9tICcuL21hcmsvbWl4aW5zJztcbmltcG9ydCB7RXhwbGljaXR9IGZyb20gJy4vc3BsaXQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vdW5pdCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q29uZmlnKGU6IFZnRW5jb2RlRW50cnksXG4gICAgY29uZmlnOiBWaWV3Q29uZmlnIHwgTWFya0NvbmZpZyB8IFRleHRDb25maWcsIC8vIFRPRE8oIzE4NDIpOiBjb25zb2xpZGF0ZSBNYXJrQ29uZmlnIHwgVGV4dENvbmZpZz9cbiAgICBwcm9wc0xpc3Q6IHN0cmluZ1tdKSB7XG4gIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcHNMaXN0KSB7XG4gICAgY29uc3QgdmFsdWUgPSBjb25maWdbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5TWFya0NvbmZpZyhlOiBWZ0VuY29kZUVudHJ5LCBtb2RlbDogVW5pdE1vZGVsLCBwcm9wc0xpc3Q6IChrZXlvZiBNYXJrQ29uZmlnKVtdKSB7XG4gIGZvciAoY29uc3QgcHJvcGVydHkgb2YgcHJvcHNMaXN0KSB7XG4gICAgY29uc3QgdmFsdWUgPSBnZXRNYXJrQ29uZmlnKHByb3BlcnR5LCBtb2RlbC5tYXJrRGVmLCBtb2RlbC5jb25maWcpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlW3Byb3BlcnR5XSA9IHt2YWx1ZTogdmFsdWV9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0eWxlcyhtYXJrOiBNYXJrRGVmKTogc3RyaW5nW10ge1xuICByZXR1cm4gW10uY29uY2F0KG1hcmsudHlwZSwgbWFyay5zdHlsZSB8fCBbXSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHByb3BlcnR5IHZhbHVlIGZyb20gc3R5bGUgb3IgbWFyayBzcGVjaWZpYyBjb25maWcgcHJvcGVydHkgaWYgZXhpc3RzLlxuICogT3RoZXJ3aXNlLCByZXR1cm4gZ2VuZXJhbCBtYXJrIHNwZWNpZmljIGNvbmZpZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hcmtDb25maWc8UCBleHRlbmRzIGtleW9mIE1hcmtDb25maWc+KHByb3A6IFAsIG1hcms6IE1hcmtEZWYsIGNvbmZpZzogQ29uZmlnKTogTWFya0NvbmZpZ1tQXSB7XG4gIC8vIEJ5IGRlZmF1bHQsIHJlYWQgZnJvbSBtYXJrIGNvbmZpZyBmaXJzdCFcbiAgbGV0IHZhbHVlID0gY29uZmlnLm1hcmtbcHJvcF07XG5cbiAgLy8gVGhlbiByZWFkIG1hcmsgc3BlY2lmaWMgY29uZmlnLCB3aGljaCBoYXMgaGlnaGVyIHByZWNlZGVuY2VcbiAgY29uc3QgbWFya1NwZWNpZmljQ29uZmlnID0gY29uZmlnW21hcmsudHlwZV07XG4gIGlmIChtYXJrU3BlY2lmaWNDb25maWdbcHJvcF0gIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbHVlID0gbWFya1NwZWNpZmljQ29uZmlnW3Byb3BdO1xuICB9XG5cbiAgLy8gVGhlbiByZWFkIHN0eWxlIGNvbmZpZywgd2hpY2ggaGFzIGV2ZW4gaGlnaGVyIHByZWNlZGVuY2UuXG4gIGNvbnN0IHN0eWxlcyA9IGdldFN0eWxlcyhtYXJrKTtcbiAgZm9yIChjb25zdCBzdHlsZSBvZiBzdHlsZXMpIHtcbiAgICBjb25zdCBzdHlsZUNvbmZpZyA9IGNvbmZpZy5zdHlsZVtzdHlsZV07XG5cbiAgICAvLyBNYXJrQ29uZmlnIGV4dGVuZHMgVmdNYXJrQ29uZmlnIHNvIGEgcHJvcCBtYXkgbm90IGJlIGEgdmFsaWQgcHJvcGVydHkgZm9yIHN0eWxlXG4gICAgLy8gSG93ZXZlciBoZXJlIHdlIGFsc28gY2hlY2sgaWYgaXQgaXMgZGVmaW5lZCwgc28gaXQgaXMgb2theSB0byBjYXN0IGhlcmVcbiAgICBjb25zdCBwID0gcHJvcCBhcyBrZXlvZiBWZ01hcmtDb25maWc7XG4gICAgaWYgKHN0eWxlQ29uZmlnICYmIHN0eWxlQ29uZmlnW3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gc3R5bGVDb25maWdbcF07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0U2lnbmFsUmVmKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgZXhwcjogJ2RhdHVtJyB8ICdwYXJlbnQnLCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBmb3JtYXQgPSBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZEZvcm1hdCwgY29uZmlnKTtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGNvbnN0IHN0YXJ0RmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pO1xuICAgIGNvbnN0IGVuZEZpZWxkID0gdmdGaWVsZChmaWVsZERlZiwge2V4cHIsIGJpblN1ZmZpeDogJ2VuZCd9KTtcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiBiaW5Gb3JtYXRFeHByZXNzaW9uKHN0YXJ0RmllbGQsIGVuZEZpZWxkLCBmb3JtYXQsIGNvbmZpZylcbiAgICB9O1xuICB9IGVsc2UgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYCR7Zm9ybWF0RXhwcih2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwciwgYmluU3VmZml4OiAncmFuZ2UnfSksIGZvcm1hdCl9YFxuICAgIH07XG4gIH0gZWxzZSBpZiAoaXNUaW1lRmllbGREZWYoZmllbGREZWYpKSB7XG4gICAgY29uc3QgaXNVVENTY2FsZSA9IGlzU2NhbGVGaWVsZERlZihmaWVsZERlZikgJiYgZmllbGREZWZbJ3NjYWxlJ10gJiYgZmllbGREZWZbJ3NjYWxlJ10udHlwZSA9PT0gU2NhbGVUeXBlLlVUQztcbiAgICByZXR1cm4ge1xuICAgICAgc2lnbmFsOiB0aW1lRm9ybWF0RXhwcmVzc2lvbih2Z0ZpZWxkKGZpZWxkRGVmLCB7ZXhwcn0pLCBmaWVsZERlZi50aW1lVW5pdCwgc3BlY2lmaWVkRm9ybWF0LCBjb25maWcudGV4dC5zaG9ydFRpbWVMYWJlbHMsIGNvbmZpZy50aW1lRm9ybWF0LCBpc1VUQ1NjYWxlLCB0cnVlKVxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpZ25hbDogYCcnKyR7dmdGaWVsZChmaWVsZERlZiwge2V4cHJ9KX1gXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWU8VD4oc3BlY2lmaWVkVmFsdWU6IFQsIGRlZmF1bHRWYWx1ZTogVCB8IHtzaWduYWw6IHN0cmluZ30pIHtcbiAgaWYgKHNwZWNpZmllZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gc3BlY2lmaWVkVmFsdWU7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG51bWJlciBmb3JtYXQgZm9yIGEgZmllbGREZWZcbiAqXG4gKiBAcGFyYW0gZm9ybWF0IGV4cGxpY2l0bHkgc3BlY2lmaWVkIGZvcm1hdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyRm9ybWF0KGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzcGVjaWZpZWRGb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIC8vIGFkZCBudW1iZXIgZm9ybWF0IGZvciBxdWFudGl0YXRpdmUgdHlwZSBvbmx5XG5cbiAgICAvLyBTcGVjaWZpZWQgZm9ybWF0IGluIGF4aXMvbGVnZW5kIGhhcyBoaWdoZXIgcHJlY2VkZW5jZSB0aGFuIGZpZWxkRGVmLmZvcm1hdFxuICAgIGlmIChzcGVjaWZpZWRGb3JtYXQpIHtcbiAgICAgIHJldHVybiBzcGVjaWZpZWRGb3JtYXQ7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogbmVlZCB0byBtYWtlIHRoaXMgd29yayBjb3JyZWN0bHkgZm9yIG51bWVyaWMgb3JkaW5hbCAvIG5vbWluYWwgdHlwZVxuICAgIHJldHVybiBjb25maWcubnVtYmVyRm9ybWF0O1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgZm9ybWF0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGBmb3JtYXQoJHtmaWVsZH0sIFwiJHtmb3JtYXQgfHwgJyd9XCIpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlckZvcm1hdEV4cHIoZmllbGQ6IHN0cmluZywgc3BlY2lmaWVkRm9ybWF0OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnKSB7XG4gIHJldHVybiBmb3JtYXRFeHByKGZpZWxkLCBzcGVjaWZpZWRGb3JtYXQgfHwgY29uZmlnLm51bWJlckZvcm1hdCk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbkZvcm1hdEV4cHJlc3Npb24oc3RhcnRGaWVsZDogc3RyaW5nLCBlbmRGaWVsZDogc3RyaW5nLCBmb3JtYXQ6IHN0cmluZywgY29uZmlnOiBDb25maWcpIHtcbiAgcmV0dXJuIGAke3N0YXJ0RmllbGR9ID09PSBudWxsIHx8IGlzTmFOKCR7c3RhcnRGaWVsZH0pID8gXCJudWxsXCIgOiAke251bWJlckZvcm1hdEV4cHIoc3RhcnRGaWVsZCwgZm9ybWF0LCBjb25maWcpfSArIFwiIC0gXCIgKyAke251bWJlckZvcm1hdEV4cHIoZW5kRmllbGQsIGZvcm1hdCwgY29uZmlnKX1gO1xufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGltZSBleHByZXNzaW9uIHVzZWQgZm9yIGF4aXMvbGVnZW5kIGxhYmVscyBvciB0ZXh0IG1hcmsgZm9yIGEgdGVtcG9yYWwgZmllbGRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVGb3JtYXRFeHByZXNzaW9uKGZpZWxkOiBzdHJpbmcsIHRpbWVVbml0OiBUaW1lVW5pdCwgZm9ybWF0OiBzdHJpbmcsIHNob3J0VGltZUxhYmVsczogYm9vbGVhbiwgdGltZUZvcm1hdENvbmZpZzogc3RyaW5nLCBpc1VUQ1NjYWxlOiBib29sZWFuLCBhbHdheXNSZXR1cm46IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gIGlmICghdGltZVVuaXQgfHwgZm9ybWF0KSB7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm90IHRpbWUgdW5pdCwgb3IgaWYgdXNlciBleHBsaWNpdGx5IHNwZWNpZnkgZm9ybWF0IGZvciBheGlzL2xlZ2VuZC90ZXh0LlxuICAgIGZvcm1hdCA9IGZvcm1hdCB8fCB0aW1lRm9ybWF0Q29uZmlnOyAvLyBvbmx5IHVzZSBjb25maWcudGltZUZvcm1hdCBpZiB0aGVyZSBpcyBubyB0aW1lVW5pdC5cblxuICAgIGlmIChmb3JtYXQgfHwgYWx3YXlzUmV0dXJuKSB7XG4gICAgICByZXR1cm4gYCR7aXNVVENTY2FsZSA/ICd1dGMnIDogJ3RpbWUnfUZvcm1hdCgke2ZpZWxkfSwgJyR7Zm9ybWF0fScpYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZvcm1hdEV4cHJlc3Npb24odGltZVVuaXQsIGZpZWxkLCBzaG9ydFRpbWVMYWJlbHMsIGlzVVRDU2NhbGUpO1xuICB9XG59XG5cbi8qKlxuICogUmV0dXJuIFZlZ2Egc29ydCBwYXJhbWV0ZXJzICh0dXBsZSBvZiBmaWVsZCBhbmQgb3JkZXIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydFBhcmFtcyhvcmRlckRlZjogT3JkZXJGaWVsZERlZjxzdHJpbmc+IHwgT3JkZXJGaWVsZERlZjxzdHJpbmc+W10sIGZpZWxkUmVmT3B0aW9uPzogRmllbGRSZWZPcHRpb24pOiBWZ1NvcnQge1xuICByZXR1cm4gKGlzQXJyYXkob3JkZXJEZWYpID8gb3JkZXJEZWYgOiBbb3JkZXJEZWZdKS5yZWR1Y2UoKHMsIG9yZGVyQ2hhbm5lbERlZikgPT4ge1xuICAgIHMuZmllbGQucHVzaCh2Z0ZpZWxkKG9yZGVyQ2hhbm5lbERlZiwgZmllbGRSZWZPcHRpb24pKTtcbiAgICBzLm9yZGVyLnB1c2gob3JkZXJDaGFubmVsRGVmLnNvcnQgfHwgJ2FzY2VuZGluZycpO1xuICAgIHJldHVybiBzO1xuICB9LCB7ZmllbGQ6W10sIG9yZGVyOiBbXX0pO1xufVxuXG5leHBvcnQgdHlwZSBBeGlzVGl0bGVDb21wb25lbnQgPSBBeGlzQ29tcG9uZW50UHJvcHNbJ3RpdGxlJ107XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVRpdGxlRmllbGREZWZzKGYxOiBGaWVsZERlZkJhc2U8c3RyaW5nPltdLCBmMjogRmllbGREZWZCYXNlPHN0cmluZz5bXSkge1xuICBjb25zdCBtZXJnZWQgPSBbLi4uZjFdO1xuXG4gIGYyLmZvckVhY2goKGZkVG9NZXJnZSkgPT4ge1xuICAgIGZvciAoY29uc3QgZmllbGREZWYxIG9mIG1lcmdlZCkge1xuICAgICAgLy8gSWYgYWxyZWFkeSBleGlzdHMsIG5vIG5lZWQgdG8gYXBwZW5kIHRvIG1lcmdlZCBhcnJheVxuICAgICAgaWYgKHN0cmluZ2lmeShmaWVsZERlZjEpID09PSBzdHJpbmdpZnkoZmRUb01lcmdlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIG1lcmdlZC5wdXNoKGZkVG9NZXJnZSk7XG4gIH0pO1xuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VUaXRsZSh0aXRsZTE6IHN0cmluZywgdGl0bGUyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHRpdGxlMSA9PT0gdGl0bGUyID9cbiAgICB0aXRsZTEgOiAvLyBpZiB0aXRsZSBpcyB0aGUgc2FtZSBqdXN0IHVzZSBvbmUgb2YgdGhlbVxuICAgIHRpdGxlMSArICcsICcgKyB0aXRsZTI7IC8vIGpvaW4gdGl0bGUgd2l0aCBjb21tYSBpZiBkaWZmZXJlbnRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlVGl0bGVDb21wb25lbnQoXG4gIHYxOiBFeHBsaWNpdDxBeGlzVGl0bGVDb21wb25lbnQ+LCB2MjogRXhwbGljaXQ8QXhpc1RpdGxlQ29tcG9uZW50PlxuKSB7XG4gIGlmIChpc0FycmF5KHYxLnZhbHVlKSAmJiBpc0FycmF5KHYyLnZhbHVlKSkge1xuICAgIHJldHVybiB7XG4gICAgICBleHBsaWNpdDogdjEuZXhwbGljaXQsXG4gICAgICB2YWx1ZTogbWVyZ2VUaXRsZUZpZWxkRGVmcyh2MS52YWx1ZSwgdjIudmFsdWUpXG4gICAgfTtcbiAgfSBlbHNlIGlmICghaXNBcnJheSh2MS52YWx1ZSkgJiYgIWlzQXJyYXkodjIudmFsdWUpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGV4cGxpY2l0OiB2MS5leHBsaWNpdCwgLy8ga2VlcCB0aGUgb2xkIGV4cGxpY2l0XG4gICAgICB2YWx1ZTogbWVyZ2VUaXRsZSh2MS52YWx1ZSwgdjIudmFsdWUpXG4gICAgfTtcbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogQ29uZGl0aW9uIHNob3VsZCBub3QgaGFwcGVuIC0tIG9ubHkgZm9yIHdhcm5pbmcgaW4gZGV2ZWxvcG1lbnQuICovXG4gIHRocm93IG5ldyBFcnJvcignSXQgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUnKTtcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGZpZWxkRGVmIGZvciBhIHBhcnRpY3VsYXIgY2hhbm5lbCByZXF1aXJlcyBhIGNvbXB1dGVkIGJpbiByYW5nZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIGNoYW5uZWw6IENoYW5uZWwpIHtcbiAgaWYgKCFmaWVsZERlZi5iaW4pIHtcbiAgICBjb25zb2xlLndhcm4oJ09ubHkgdXNlIHRoaXMgbWV0aG9kIHdpdGggYmlubmVkIGZpZWxkIGRlZnMnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBXZSBuZWVkIHRoZSByYW5nZSBvbmx5IHdoZW4gdGhlIHVzZXIgZXhwbGljaXRseSBmb3JjZXMgYSBiaW5uZWQgZmllbGQgdG8gYmUgdXNlIGRpc2NyZXRlIHNjYWxlLiBJbiB0aGlzIGNhc2UsIGJpbiByYW5nZSBpcyB1c2VkIGluIGF4aXMgYW5kIGxlZ2VuZCBsYWJlbHMuXG4gIC8vIFdlIGNvdWxkIGNoZWNrIHdoZXRoZXIgdGhlIGF4aXMgb3IgbGVnZW5kIGV4aXN0cyAobm90IGRpc2FibGVkKSBidXQgdGhhdCBzZWVtcyBvdmVya2lsbC5cbiAgcmV0dXJuIGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIGNvbnRhaW5zKFsnb3JkaW5hbCcsICdub21pbmFsJ10sIGZpZWxkRGVmLnR5cGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3VpZGVFbmNvZGVFbnRyeShlbmNvZGluZzogR3VpZGVFbmNvZGluZ0VudHJ5LCBtb2RlbDogVW5pdE1vZGVsKSB7XG4gIHJldHVybiBrZXlzKGVuY29kaW5nKS5yZWR1Y2UoKGVuY29kZSwgY2hhbm5lbDogVmdFbmNvZGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3QgdmFsdWVEZWYgPSBlbmNvZGluZ1tjaGFubmVsXTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZW5jb2RlLFxuICAgICAgLi4ud3JhcENvbmRpdGlvbihtb2RlbCwgdmFsdWVEZWYsIGNoYW5uZWwsICh4OiBWYWx1ZURlZikgPT4gKHt2YWx1ZTogeC52YWx1ZX0pKVxuICAgIH07XG4gIH0sIHt9KTtcbn1cbiJdfQ==