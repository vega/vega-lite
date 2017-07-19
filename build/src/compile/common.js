"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fielddef_1 = require("../fielddef");
var log = require("../log");
var scale_1 = require("../scale");
var spec_1 = require("../spec");
var timeunit_1 = require("../timeunit");
var type_1 = require("../type");
var util_1 = require("../util");
var concat_1 = require("./concat");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var repeat_1 = require("./repeat");
var unit_1 = require("./unit");
function buildModel(spec, parent, parentGivenName, unitSize, repeater, config) {
    if (spec_1.isFacetSpec(spec)) {
        return new facet_1.FacetModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isLayerSpec(spec)) {
        return new layer_1.LayerModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isUnitSpec(spec)) {
        return new unit_1.UnitModel(spec, parent, parentGivenName, unitSize, repeater, config);
    }
    if (spec_1.isRepeatSpec(spec)) {
        return new repeat_1.RepeatModel(spec, parent, parentGivenName, repeater, config);
    }
    if (spec_1.isConcatSpec(spec)) {
        return new concat_1.ConcatModel(spec, parent, parentGivenName, repeater, config);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.buildModel = buildModel;
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
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
function getMarkConfig(prop, mark, config) {
    if (mark.role) {
        var roleSpecificConfig = config[mark.role];
        if (roleSpecificConfig && roleSpecificConfig[prop] !== undefined) {
            return roleSpecificConfig[prop];
        }
    }
    else {
        var markSpecificConfig = config[mark.type];
        if (markSpecificConfig[prop] !== undefined) {
            return markSpecificConfig[prop];
        }
    }
    return config.mark[prop];
}
exports.getMarkConfig = getMarkConfig;
function formatSignalRef(fieldDef, specifiedFormat, expr, config, useBinRange) {
    if (fieldDef.type === 'quantitative') {
        var format = numberFormat(fieldDef, specifiedFormat, config);
        if (fieldDef.bin) {
            if (useBinRange) {
                // For bin range, no need to apply format as the formula that creates range already include format
                return { signal: fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'range' }) };
            }
            else {
                return {
                    signal: formatExpr(fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'start' }), format) + " + '-' + " + formatExpr(fielddef_1.field(fieldDef, { expr: expr, binSuffix: 'end' }), format)
                };
            }
        }
        else {
            return {
                signal: "" + formatExpr(fielddef_1.field(fieldDef, { expr: expr }), format)
            };
        }
    }
    else if (fieldDef.type === 'temporal') {
        var isUTCScale = fielddef_1.isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === scale_1.ScaleType.UTC;
        return {
            signal: timeFormatExpression(fielddef_1.field(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale)
        };
    }
    else {
        return { signal: fielddef_1.field(fieldDef, { expr: expr }) };
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
    return "format(" + field + ", '" + (format || '') + "')";
}
function numberFormatExpr(field, specifiedFormat, config) {
    return formatExpr(field, specifiedFormat || config.numberFormat);
}
exports.numberFormatExpr = numberFormatExpr;
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
function sortParams(orderDef) {
    return (util_1.isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(fielddef_1.field(orderChannelDef, { binSuffix: 'start' }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0NBQTRFO0FBQzVFLDRCQUE4QjtBQUU5QixrQ0FBbUM7QUFDbkMsZ0NBQWlIO0FBRWpILHdDQUE2QztBQUM3QyxnQ0FBcUM7QUFDckMsZ0NBQWdDO0FBRWhDLG1DQUFxQztBQUNyQyxpQ0FBbUM7QUFDbkMsaUNBQW1DO0FBRW5DLG1DQUFvRDtBQUVwRCwrQkFBaUM7QUFHakMsb0JBQTJCLElBQVUsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFDM0UsUUFBMEIsRUFBRSxRQUF1QixFQUFFLE1BQWM7SUFDbkUsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsaUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMs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