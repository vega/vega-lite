"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
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
    switch (property) {
        case 'format':
            return common_1.numberFormat(fieldDef, specifiedLegend.format, model.config, channel);
        case 'title':
            return rules.title(specifiedLegend, fieldDef, model.config);
        case 'values':
            return rules.values(specifiedLegend);
        case 'type':
            rules.type(specifiedLegend, fieldDef, channel);
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBbUU7QUFDbkUscUNBQWdEO0FBQ2hELG1DQUFzQztBQUV0Qyx1Q0FBdUQ7QUFHdkQsb0NBQXVDO0FBQ3ZDLHdDQUFpRDtBQUdqRCxpQ0FBbUM7QUFDbkMsK0JBQWlDO0FBRWpDLDhCQUFxQyxLQUFnQjtJQUNuRCxNQUFNLENBQUMsQ0FBQyxlQUFLLEVBQUUsY0FBSSxFQUFFLGVBQUssRUFBRSxpQkFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVMsZUFBZSxFQUFFLE9BQU87UUFDM0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDekIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQVBELG9EQU9DO0FBRUQsK0JBQStCLEtBQWdCLEVBQUUsT0FBZ0I7SUFDL0QsNEdBQTRHO0lBQzVHLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLDJCQUFtQixDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcseUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ3RILE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDaEIsS0FBSyxlQUFLO1lBQ1IsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDOUMsTUFBTSxDQUFDLEtBQUss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