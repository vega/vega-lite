"use strict";
var log = require("../log");
var channel_1 = require("../channel");
var fielddef_1 = require("../fielddef");
var type_1 = require("../type");
var util_1 = require("../util");
var facet_1 = require("./facet");
var layer_1 = require("./layer");
var timeunit_1 = require("../timeunit");
var unit_1 = require("./unit");
var spec_1 = require("../spec");
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
    return applyConfig(e, model.config.mark, propsList);
}
exports.applyMarkConfig = applyMarkConfig;
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
function numberFormat(fieldDef, format, config, channel) {
    if (fieldDef.type === type_1.QUANTITATIVE && !fieldDef.bin) {
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
function timeFormatExpression(field, timeUnit, format, shortTimeLabels, config) {
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        var _format = format || config.timeFormat; // only use config.timeFormat if there is no timeUnit.
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
//# sourceMappingURL=common.js.map