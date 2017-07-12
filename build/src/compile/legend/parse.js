"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var legend_1 = require("../../legend");
var util_1 = require("../../util");
var common_1 = require("../common");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var split_2 = require("../split");
var component_1 = require("./component");
var encode = require("./encode");
var rules = require("./rules");
function parseUnitLegend(model) {
    return [channel_1.COLOR, channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].reduce(function (legendComponent, channel) {
        if (model.legend(channel)) {
            legendComponent[channel] = parseLegendForChannel(model, channel);
        }
        return legendComponent;
    }, {});
}
exports.parseUnitLegend = parseUnitLegend;
function getLegendDefWithScale(model, channel) {
    // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
    switch (channel) {
        case channel_1.COLOR:
            var scale = model.scaleName(channel_1.COLOR);
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
        case channel_1.SIZE:
            return { size: model.scaleName(channel_1.SIZE) };
        case channel_1.SHAPE:
            return { shape: model.scaleName(channel_1.SHAPE) };
        case channel_1.OPACITY:
            return { opacity: model.scaleName(channel_1.OPACITY) };
    }
    return null;
}
function parseLegendForChannel(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    var legendCmpt = new component_1.LegendComponent({}, getLegendDefWithScale(model, channel));
    legend_1.LEGEND_PROPERTIES.forEach(function (property) {
        var value = getSpecifiedOrDefaultValue(property, legend, channel, model);
        if (value !== undefined) {
            var explicit = property === 'values' ?
                !!legend.values :
                value === legend[property];
            legendCmpt.set(property, value, explicit);
        }
    });
    // 2) Add mark property definition groups
    var legendEncoding = legend.encoding || {};
    var legendEncode = ['labels', 'legend', 'title', 'symbols'].reduce(function (e, part) {
        var value = encode[part] ?
            encode[part](fieldDef, legendEncoding[part], model, channel) :
            legendEncoding[part]; // no rule -- just default values
        if (value !== undefined && util_1.keys(value).length > 0) {
            e[part] = { update: value };
        }
        return e;
    }, {});
    if (util_1.keys(legendEncode).length > 0) {
        legendCmpt.set('encode', legendEncode, !!legend.encoding);
    }
    return legendCmpt;
}
exports.parseLegendForChannel = parseLegendForChannel;
function getSpecifiedOrDefaultValue(property, specifiedLegend, channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'format':
            return common_1.numberFormat(fieldDef, specifiedLegend.format, model.config);
        case 'title':
            return rules.title(specifiedLegend, fieldDef, model.config);
        case 'values':
            return rules.values(specifiedLegend);
        case 'type':
            return rules.type(specifiedLegend, fieldDef.type, channel, model.getScaleComponent(channel).get('type'));
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}
function parseNonUnitLegend(model) {
    var _a = model.component, legends = _a.legends, resolve = _a.resolve;
    var _loop_1 = function (child) {
        child.parseLegend();
        util_1.keys(child.component.legends).forEach(function (channel) {
            var channelResolve = model.component.resolve[channel];
            channelResolve.legend = resolve_1.parseGuideResolve(model.component.resolve, channel);
            if (channelResolve.legend === 'shared') {
                // If the resolve says shared (and has not been overridden)
                // We will try to merge and see if there is a conflict
                legends[channel] = mergeLegendComponent(legends[channel], child.component.legends[channel]);
                if (!legends[channel]) {
                    // If merge returns nothing, there is a conflict so we cannot make the legend shared.
                    // Thus, mark legend as independent and remove the legend component.
                    channelResolve.legend = 'independent';
                    delete legends[channel];
                }
            }
        });
    };
    for (var _i = 0, _b = model.children; _i < _b.length; _i++) {
        var child = _b[_i];
        _loop_1(child);
    }
    util_1.keys(legends).forEach(function (channel) {
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!child.component.legends[channel]) {
                // skip if the child does not have a particular legend
                return;
            }
            if (resolve[channel].legend === 'shared') {
                // After merging shared legend, make sure to remove legend from child
                delete child.component.legends[channel];
            }
        }
    });
}
exports.parseNonUnitLegend = parseNonUnitLegend;
function mergeLegendComponent(mergedLegend, childLegend) {
    if (!mergedLegend) {
        return childLegend.clone();
    }
    var mergedOrient = mergedLegend.getWithExplicit('orient');
    var childOrient = childLegend.getWithExplicit('orient');
    if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
        // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
        // Cannot merge due to inconsistent orient
        return undefined;
    }
    var _loop_2 = function (prop) {
        var mergedValueWithExplicit = split_2.mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return common_1.titleMerger(v1, v2);
                case 'type':
                    // There are only two types. If we have different types, then prefer symbol over gradient.
                    return split_1.makeImplicit('symbol');
            }
            return split_2.defaultTieBreaker(v1, v2, prop, 'legend');
        });
        mergedLegend.setWithExplicit(prop, mergedValueWithExplicit);
    };
    // Otherwise, let's merge
    for (var _i = 0, VG_LEGEND_PROPERTIES_1 = legend_1.VG_LEGEND_PROPERTIES; _i < VG_LEGEND_PROPERTIES_1.length; _i++) {
        var prop = VG_LEGEND_PROPERTIES_1[_i];
        _loop_2(prop);
    }
    return mergedLegend;
}
exports.mergeLegendComponent = mergeLegendComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBMkY7QUFDM0YsdUNBQTZFO0FBRTdFLG1DQUFzQztBQUV0QyxvQ0FBb0Q7QUFFcEQsc0NBQTZDO0FBQzdDLGtDQUFnRDtBQUNoRCxrQ0FBb0U7QUFFcEUseUNBQWtFO0FBQ2xFLGlDQUFtQztBQUNuQywrQkFBaUM7QUFHakMseUJBQWdDLEtBQWdCO0lBQzlDLE1BQU0sQ0FBQyxDQUFDLGVBQUssRUFBRSxjQUFJLEVBQUUsZUFBSyxFQUFFLGlCQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxlQUFlLEVBQUUsT0FBTztRQUMzRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcscUJBQXFCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxNQUFNLENBQUMsZUFBZSxDQUFDO0lBQ3pCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNULENBQUM7QUFQRCwwQ0FPQztBQUVELCtCQUErQixLQUFnQixFQUFFLE9BQWdCO0lBQy9ELDRHQUE0RztJQUM1RyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssZUFBSztZQUNSLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsZUFBSyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ2hFLEtBQUssY0FBSTtZQUNQLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxL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