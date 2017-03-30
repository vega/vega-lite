"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var type_1 = require("../type");
var util_1 = require("../util");
var spec_1 = require("../spec");
var timeunit_1 = require("../timeunit");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var unit_1 = require("./unit");
function buildModel(spec, parent, parentGivenName) {
    if (spec_1.isFacetSpec(spec)) {
        return new facet_1.FacetModel(spec, parent, parentGivenName);
    }
    if (spec_1.isLayerSpec(spec)) {
        return new layer_1.LayerModel(spec, parent, parentGivenName);
    }
    if (spec_1.isUnitSpec(spec)) {
        return new unit_1.UnitModel(spec, parent, parentGivenName);
    }
    throw new Error(log.message.INVALID_SPEC);
}
exports.buildModel = buildModel;
function applyConfig(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
    propsList) {
    propsList.forEach(function (property) {
        var value = config[property];
        if (value !== undefined) {
            e[property] = { value: value };
        }
    });
    return e;
}
exports.applyConfig = applyConfig;
function applyMarkConfig(e, model, propsList) {
    propsList.forEach(function (property) {
        var value = getMarkConfig(property, model.mark(), model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    });
    return e;
}
exports.applyMarkConfig = applyMarkConfig;
/**
 * Return value mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
function getMarkConfig(prop, mark, config) {
    var markSpecificConfig = config[mark];
    if (markSpecificConfig[prop] !== undefined) {
        return markSpecificConfig[prop];
    }
    return config.mark[prop];
}
exports.getMarkConfig = getMarkConfig;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
function numberFormat(fieldDef, format, config, channel) {
    if (fieldDef.type === type_1.QUANTITATIVE) {
        // add number format for quantitative type only
        if (format) {
            return format;
        }
        else if (fieldDef.aggregate === 'count' && channel === channel_1.TEXT) {
            // FIXME: need a more holistic way to deal with this.
            return 'd';
        }
        // TODO: need to make this work correctly for numeric ordinal / nominal type
        return config.numberFormat;
    }
    return undefined;
}
exports.numberFormat = numberFormat;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, timeFormatConfig) {
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        var _format = format || timeFormatConfig; // only use config.timeFormat if there is no timeUnit.
        return "timeFormat(" + field + ", '" + _format + "')";
    }
    else {
        return timeunit_1.formatExpression(timeUnit, field, shortTimeLabels);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQThCO0FBRTlCLHNDQUF5QztBQUV6Qyx3Q0FBMkQ7QUFHM0QsZ0NBQXFDO0FBQ3JDLGdDQUFnQztBQUVoQyxnQ0FBbUU7QUFDbkUsd0NBQTZDO0FBRTdDLGlDQUFtQztBQUNuQyxpQ0FBbUM7QUFFbkMsK0JBQWlDO0FBRWpDLG9CQUEyQixJQUFVLEVBQUUsTUFBYSxFQUFFLGVBQXVCO0lBQzNFLEVBQUUsQ0FBQyxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLGtCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBZEQsZ0NBY0M7QUFFRCxxQkFBNEIsQ0FBZ0IsRUFDeEMsTUFBNEMsRUFBRSxvREFBb0Q7SUFDbEcsU0FBbUI7SUFDckIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7UUFDekIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FB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