"use strict";
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
var legend_1 = require("../../legend");
var common_1 = require("../common");
var scale_2 = require("../scale/scale");
var encode = require("./encode");
var rules = require("./rules");
function parseLegendComponent(model) {
    return [channel_1.COLOR, channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].reduce(function (legendComponent, channel) {
        if (model.legend(channel)) {
            legendComponent[channel] = parseLegend(model, channel);
        }
        return legendComponent;
    }, {});
}
exports.parseLegendComponent = parseLegendComponent;
function getLegendDefWithScale(model, channel) {
    // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
    var suffix = model.fieldDef(channel).bin && scale_1.hasContinuousDomain(model.scale(channel).type) ? scale_2.BIN_LEGEND_SUFFIX : '';
    switch (channel) {
        case channel_1.COLOR:
            var scale = model.scaleName(channel_1.COLOR) + suffix;
            return model.config().mark.filled ? { fill: scale } : { stroke: scale };
        case channel_1.SIZE:
            return { size: model.scaleName(channel_1.SIZE) + suffix };
        case channel_1.SHAPE:
            return { shape: model.scaleName(channel_1.SHAPE) + suffix };
        case channel_1.OPACITY:
            return { opacity: model.scaleName(channel_1.OPACITY) + suffix };
    }
    return null;
}
function parseLegend(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    var def = getLegendDefWithScale(model, channel);
    legend_1.LEGEND_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, legend, channel, model);
        if (value !== undefined) {
            def[property] = value;
        }
    });
    // 2) Add mark property definition groups
    var encodeSpec = legend.encode || {};
    ['labels', 'legend', 'title', 'symbols'].forEach(function (part) {
        var value = encode[part] ?
            encode[part](fieldDef, encodeSpec[part], model, channel) :
            encodeSpec[part]; // no rule -- just default values
        if (value !== undefined && util_1.keys(value).length > 0) {
            def.encode = def.encode || {};
            def.encode[part] = { update: value };
        }
    });
    return def;
}
exports.parseLegend = parseLegend;
function getSpecifiedOrDefaultValue(property, specifiedLegend, channel, model) {
    var fieldDef = model.fieldDef(channel);
    var config = model.config();
    switch (property) {
        case 'format':
            return common_1.numberFormat(fieldDef, specifiedLegend.format, config, channel);
        case 'title':
            return rules.title(specifiedLegend, fieldDef, config);
        case 'values':
            return rules.values(specifiedLegend);
        case 'type':
            rules.type(specifiedLegend, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}
//# sourceMappingURL=parse.js.map