"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var legend_1 = require("../../legend");
var type_1 = require("../../type");
var util_1 = require("../../util");
var common_1 = require("../common");
var model_1 = require("../model");
var resolve_1 = require("../resolve");
var split_1 = require("../split");
var component_1 = require("./component");
var encode = require("./encode");
var properties = require("./properties");
function parseLegend(model) {
    if (model_1.isUnitModel(model)) {
        model.component.legends = parseUnitLegend(model);
    }
    else {
        model.component.legends = parseNonUnitLegend(model);
    }
}
exports.parseLegend = parseLegend;
function parseUnitLegend(model) {
    var encoding = model.encoding;
    return [channel_1.COLOR, channel_1.FILL, channel_1.STROKE, channel_1.SIZE, channel_1.SHAPE, channel_1.OPACITY].reduce(function (legendComponent, channel) {
        var def = encoding[channel];
        if (model.legend(channel) && model.getScaleComponent(channel) && !(fielddef_1.isFieldDef(def) && (channel === channel_1.SHAPE && def.type === type_1.GEOJSON))) {
            legendComponent[channel] = parseLegendForChannel(model, channel);
        }
        return legendComponent;
    }, {});
}
function getLegendDefWithScale(model, channel) {
    // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
    switch (channel) {
        case channel_1.COLOR:
            var scale = model.scaleName(channel_1.COLOR);
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
        case channel_1.FILL:
        case channel_1.STROKE:
        case channel_1.SIZE:
        case channel_1.SHAPE:
        case channel_1.OPACITY:
            return _a = {}, _a[channel] = model.scaleName(channel), _a;
    }
    var _a;
}
function parseLegendForChannel(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    var legendCmpt = new component_1.LegendComponent({}, getLegendDefWithScale(model, channel));
    legend_1.LEGEND_PROPERTIES.forEach(function (property) {
        var value = getProperty(property, legend, channel, model);
        if (value !== undefined) {
            var explicit = 
            // specified legend.values is already respected, but may get transformed.
            property === 'values' ? !!legend.values :
                // title can be explicit if fieldDef.title is set
                property === 'title' && value === model.fieldDef(channel).title ? true :
                    // Otherwise, things are explicit if the returned value matches the specified property
                    value === legend[property];
            if (explicit || model.config.legend[property] === undefined) {
                legendCmpt.set(property, value, explicit);
            }
        }
    });
    // 2) Add mark property definition groups
    var legendEncoding = legend.encoding || {};
    var legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce(function (e, part) {
        var legendEncodingPart = common_1.guideEncodeEntry(legendEncoding[part] || {}, model);
        var value = encode[part] ?
            // TODO: replace legendCmpt with type is sufficient
            encode[part](fieldDef, legendEncodingPart, model, channel, legendCmpt.get('type')) : // apply rule
            legendEncodingPart; // no rule -- just default values
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
function getProperty(property, specifiedLegend, channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return common_1.numberFormat(fieldDef, specifiedLegend.format, model.config);
        case 'title':
            // For falsy value, keep undefined so we use default,
            // but use null for '', null, and false to hide the title
            var specifiedTitle = fieldDef.title !== undefined ? fieldDef.title :
                specifiedLegend.title || (specifiedLegend.title === undefined ? undefined : null);
            return common_1.getSpecifiedOrDefaultValue(specifiedTitle, fielddef_1.title(fieldDef, model.config)) || undefined; // make falsy value undefined so output Vega spec is shorter
        case 'values':
            return properties.values(specifiedLegend);
        case 'type':
            return common_1.getSpecifiedOrDefaultValue(specifiedLegend.type, properties.type(fieldDef.type, channel, model.getScaleComponent(channel).get('type')));
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}
function parseNonUnitLegend(model) {
    var _a = model.component, legends = _a.legends, resolve = _a.resolve;
    var _loop_1 = function (child) {
        parseLegend(child);
        util_1.keys(child.component.legends).forEach(function (channel) {
            resolve.legend[channel] = resolve_1.parseGuideResolve(model.component.resolve, channel);
            if (resolve.legend[channel] === 'shared') {
                // If the resolve says shared (and has not been overridden)
                // We will try to merge and see if there is a conflict
                legends[channel] = mergeLegendComponent(legends[channel], child.component.legends[channel]);
                if (!legends[channel]) {
                    // If merge returns nothing, there is a conflict so we cannot make the legend shared.
                    // Thus, mark legend as independent and remove the legend component.
                    resolve.legend[channel] = 'independent';
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
                continue;
            }
            if (resolve.legend[channel] === 'shared') {
                // After merging shared legend, make sure to remove legend from child
                delete child.component.legends[channel];
            }
        }
    });
    return legends;
}
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
    var typeMerged = false;
    var _loop_2 = function (prop) {
        var mergedValueWithExplicit = split_1.mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return common_1.mergeTitleComponent(v1, v2);
                case 'type':
                    // There are only two types. If we have different types, then prefer symbol over gradient.
                    typeMerged = true;
                    return split_1.makeImplicit('symbol');
            }
            return split_1.defaultTieBreaker(v1, v2, prop, 'legend');
        });
        mergedLegend.setWithExplicit(prop, mergedValueWithExplicit);
    };
    // Otherwise, let's merge
    for (var _i = 0, VG_LEGEND_PROPERTIES_1 = legend_1.VG_LEGEND_PROPERTIES; _i < VG_LEGEND_PROPERTIES_1.length; _i++) {
        var prop = VG_LEGEND_PROPERTIES_1[_i];
        _loop_2(prop);
    }
    if (typeMerged) {
        if (((mergedLegend.implicit || {}).encode || {}).gradient) {
            util_1.deleteNestedProperty(mergedLegend.implicit, ['encode', 'gradient']);
        }
        if (((mergedLegend.explicit || {}).encode || {}).gradient) {
            util_1.deleteNestedProperty(mergedLegend.explicit, ['encode', 'gradient']);
        }
    }
    return mergedLegend;
}
exports.mergeLegendComponent = mergeLegendComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUc7QUFDakcsMkNBQWtFO0FBQ2xFLHVDQUE2RTtBQUM3RSxtQ0FBbUM7QUFDbkMsbUNBQXNEO0FBRXRELG9DQUEwRztBQUMxRyxrQ0FBNEM7QUFDNUMsc0NBQTZDO0FBQzdDLGtDQUE0RjtBQUU1Rix5Q0FBa0U7QUFDbEUsaUNBQW1DO0FBQ25DLHlDQUEyQztBQUczQyxxQkFBNEIsS0FBWTtJQUN0QyxJQUFJLG1CQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2xEO1NBQU07UUFDTCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyRDtBQUNILENBQUM7QUFORCxrQ0FNQztBQUVELHlCQUF5QixLQUFnQjtJQUNoQyxJQUFBLHlCQUFRLENBQVU7SUFDekIsT0FBTyxDQUFDLGVBQUssRUFBRSxjQUFJLEVBQUUsZ0JBQU0sRUFBRSxjQUFJLEVBQUUsZUFBSyxFQUFFLGlCQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxlQUFlLEVBQUUsT0FBTztRQUMxRixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxlQUFLLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxjQUFPLENBQUMsQ0FBQyxFQUFFO1lBQ2xJLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbEU7UUFDRCxPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsK0JBQStCLEtBQWdCLEVBQUUsT0FBZ0M7SUFDL0UsNEdBQTRHO0lBQzVHLFFBQVEsT0FBTyxFQUFFO1FBQ2YsS0FBSyxlQUFLO1lBQ1IsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFLLENBQUMsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDaEUsS0FBSyxjQUFJLENBQUM7UUFDVixLQUFLLGdCQUFNLENBQUM7UUFDWixLQUFLLGNBQUksQ0FBQztRQUNWLEtBQUssZUFBSyxDQUFDO1FBQ1gsS0FBSyxpQkFBTztZQUNWLGdCQUFRLEdBQUMsT0FBTyxJQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUU7S0FDaEQ7O0FBQ0gsQ0FBQztBQUVELCtCQUFzQyxLQUFnQixFQUFFLE9BQWdDO0lBQ3RGLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVyQyxJQUFNLFVBQVUsR0FBRyxJQUFJLDJCQUFlLENBQUMsRUFBRSxFQUFFLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRWxGLDBCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVE7UUFDekMsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUN2QixJQUFNLFFBQVE7WUFDWix5RUFBeUU7WUFDekUsUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekMsaURBQWlEO2dCQUNqRCxRQUFRLEtBQUssT0FBTyxJQUFJLEtBQUssS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3hFLHNGQUFzRjtvQkFDdEYsS0FBSyxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QixJQUFJLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzNELFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMzQztTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCx5Q0FBeUM7SUFDekMsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7SUFDN0MsSUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBaUIsRUFBRSxJQUFJO1FBQ3ZHLElBQU0sa0JBQWtCLEdBQUcseUJBQWdCLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixtREFBbUQ7WUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtZQUNsRyxrQkFBa0IsQ0FBQyxDQUFDLGlDQUFpQztRQUN2RCxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksV0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDakQsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDLEVBQUUsRUFBb0IsQ0FBQyxDQUFDO0lBRXpCLElBQUksV0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDakMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDM0Q7SUFFRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBekNELHNEQXlDQztBQUVELHFCQUFxQixRQUFtQyxFQUFFLGVBQXVCLEVBQUUsT0FBZ0MsRUFBRSxLQUFnQjtJQUNuSSxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLFFBQVEsUUFBUSxFQUFFO1FBQ2hCLEtBQUssUUFBUTtZQUNYLDBFQUEwRTtZQUMxRSxPQUFPLHFCQUFZLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RFLEtBQUssT0FBTztZQUNWLHFEQUFxRDtZQUNyRCx5REFBeUQ7WUFDekQsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEUsZUFBZSxDQUFDLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBGLE9BQU8sbUNBQTBCLENBQy9CLGNBQWMsRUFDZCxnQkFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQ3RDLElBQUksU0FBUyxDQUFDLENBQUMsNERBQTREO1FBQzlFLEtBQUssUUFBUTtZQUNYLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1QyxLQUFLLE1BQU07WUFDVCxPQUFPLG1DQUEwQixDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsSjtJQUVELHdDQUF3QztJQUN4QyxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBRUQsNEJBQTRCLEtBQVk7SUFDaEMsSUFBQSxvQkFBb0MsRUFBbkMsb0JBQU8sRUFBRSxvQkFBTyxDQUFvQjs0QkFFaEMsS0FBSztRQUNkLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQixXQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFnQztZQUNyRSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLDJCQUFpQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRTlFLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3hDLDJEQUEyRDtnQkFDM0Qsc0RBQXNEO2dCQUV0RCxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsb0JBQW9CLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBRTVGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3JCLHFGQUFxRjtvQkFDckYsb0VBQW9FO29CQUNwRSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLGFBQWEsQ0FBQztvQkFDeEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3pCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFwQkQsS0FBb0IsVUFBYyxFQUFkLEtBQUEsS0FBSyxDQUFDLFFBQVEsRUFBZCxjQUFjLEVBQWQsSUFBYztRQUE3QixJQUFNLEtBQUssU0FBQTtnQkFBTCxLQUFLO0tBb0JmO0lBRUQsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQWdDO1FBQ3JELEtBQW9CLFVBQWMsRUFBZCxLQUFBLEtBQUssQ0FBQyxRQUFRLEVBQWQsY0FBYyxFQUFkLElBQWM7WUFBN0IsSUFBTSxLQUFLLFNBQUE7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JDLHNEQUFzRDtnQkFDdEQsU0FBUzthQUNWO1lBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDeEMscUVBQXFFO2dCQUNyRSxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3pDO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCw4QkFBcUMsWUFBNkIsRUFBRSxXQUE0QjtJQUM5RixJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2pCLE9BQU8sV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzVCO0lBQ0QsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1RCxJQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRzFELElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxXQUFXLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDLEtBQUssRUFBRTtRQUM3Rix1R0FBdUc7UUFDdkcsMENBQTBDO1FBQzFDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOzRCQUVaLElBQUk7UUFDYixJQUFNLHVCQUF1QixHQUFHLCtCQUF1QixDQUNyRCxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUNsQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUNqQyxJQUFJLEVBQUUsUUFBUTtRQUVkLHVCQUF1QjtRQUN2QixVQUFDLEVBQWlCLEVBQUUsRUFBaUI7WUFDbkMsUUFBUSxJQUFJLEVBQUU7Z0JBQ1osS0FBSyxPQUFPO29CQUNWLE9BQU8sNEJBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLE1BQU07b0JBQ1QsMEZBQTBGO29CQUMxRixVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUNsQixPQUFPLG9CQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDakM7WUFDRCxPQUFPLHlCQUFpQixDQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQ0YsQ0FBQztRQUNGLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFDOUQsQ0FBQztJQXJCRCx5QkFBeUI7SUFDekIsS0FBbUIsVUFBb0IsRUFBcEIseUJBQUEsNkJBQW9CLEVBQXBCLGtDQUFvQixFQUFwQixJQUFvQjtRQUFsQyxJQUFNLElBQUksNkJBQUE7Z0JBQUosSUFBSTtLQW9CZDtJQUNELElBQUksVUFBVSxFQUFFO1FBQ2QsSUFBRyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ3hELDJCQUFvQixDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNyRTtRQUNELElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUN6RCwyQkFBb0IsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDckU7S0FDRjtJQUdELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUEvQ0Qsb0RBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDT0xPUiwgRklMTCwgTm9uUG9zaXRpb25TY2FsZUNoYW5uZWwsIE9QQUNJVFksIFNIQVBFLCBTSVpFLCBTVFJPS0V9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtpc0ZpZWxkRGVmLCB0aXRsZSBhcyBmaWVsZERlZlRpdGxlfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge0xlZ2VuZCwgTEVHRU5EX1BST1BFUlRJRVMsIFZHX0xFR0VORF9QUk9QRVJUSUVTfSBmcm9tICcuLi8uLi9sZWdlbmQnO1xuaW1wb3J0IHtHRU9KU09OfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7ZGVsZXRlTmVzdGVkUHJvcGVydHksIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0xlZ2VuZCwgVmdMZWdlbmRFbmNvZGV9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUsIGd1aWRlRW5jb2RlRW50cnksIG1lcmdlVGl0bGVDb21wb25lbnQsIG51bWJlckZvcm1hdH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7ZGVmYXVsdFRpZUJyZWFrZXIsIEV4cGxpY2l0LCBtYWtlSW1wbGljaXQsIG1lcmdlVmFsdWVzV2l0aEV4cGxpY2l0fSBmcm9tICcuLi9zcGxpdCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge0xlZ2VuZENvbXBvbmVudCwgTGVnZW5kQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuL2VuY29kZSc7XG5pbXBvcnQgKiBhcyBwcm9wZXJ0aWVzIGZyb20gJy4vcHJvcGVydGllcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGVnZW5kKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgbW9kZWwuY29tcG9uZW50LmxlZ2VuZHMgPSBwYXJzZVVuaXRMZWdlbmQobW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIG1vZGVsLmNvbXBvbmVudC5sZWdlbmRzID0gcGFyc2VOb25Vbml0TGVnZW5kKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRMZWdlbmQobW9kZWw6IFVuaXRNb2RlbCk6IExlZ2VuZENvbXBvbmVudEluZGV4IHtcbiAgY29uc3Qge2VuY29kaW5nfSA9IG1vZGVsO1xuICByZXR1cm4gW0NPTE9SLCBGSUxMLCBTVFJPS0UsIFNJWkUsIFNIQVBFLCBPUEFDSVRZXS5yZWR1Y2UoZnVuY3Rpb24gKGxlZ2VuZENvbXBvbmVudCwgY2hhbm5lbCkge1xuICAgIGNvbnN0IGRlZiA9IGVuY29kaW5nW2NoYW5uZWxdO1xuICAgIGlmIChtb2RlbC5sZWdlbmQoY2hhbm5lbCkgJiYgbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkgJiYgIShpc0ZpZWxkRGVmKGRlZikgJiYgKGNoYW5uZWwgPT09IFNIQVBFICYmIGRlZi50eXBlID09PSBHRU9KU09OKSkpIHtcbiAgICAgIGxlZ2VuZENvbXBvbmVudFtjaGFubmVsXSA9IHBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCk7XG4gICAgfVxuICAgIHJldHVybiBsZWdlbmRDb21wb25lbnQ7XG4gIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGVnZW5kRGVmV2l0aFNjYWxlKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IE5vblBvc2l0aW9uU2NhbGVDaGFubmVsKTogVmdMZWdlbmQge1xuICAvLyBGb3IgYmlubmVkIGZpZWxkIHdpdGggY29udGludW91cyBzY2FsZSwgdXNlIGEgc3BlY2lhbCBzY2FsZSBzbyB3ZSBjYW4gb3ZlcnJyaWRlIHRoZSBtYXJrIHByb3BzIGFuZCBsYWJlbHNcbiAgc3dpdGNoIChjaGFubmVsKSB7XG4gICAgY2FzZSBDT0xPUjpcbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuc2NhbGVOYW1lKENPTE9SKTtcbiAgICAgIHJldHVybiBtb2RlbC5tYXJrRGVmLmZpbGxlZCA/IHtmaWxsOiBzY2FsZX0gOiB7c3Ryb2tlOiBzY2FsZX07XG4gICAgY2FzZSBGSUxMOlxuICAgIGNhc2UgU1RST0tFOlxuICAgIGNhc2UgU0laRTpcbiAgICBjYXNlIFNIQVBFOlxuICAgIGNhc2UgT1BBQ0lUWTpcbiAgICAgIHJldHVybiB7W2NoYW5uZWxdOiBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCl9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUxlZ2VuZEZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogTm9uUG9zaXRpb25TY2FsZUNoYW5uZWwpOiBMZWdlbmRDb21wb25lbnQge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBjb25zdCBsZWdlbmQgPSBtb2RlbC5sZWdlbmQoY2hhbm5lbCk7XG5cbiAgY29uc3QgbGVnZW5kQ21wdCA9IG5ldyBMZWdlbmRDb21wb25lbnQoe30sIGdldExlZ2VuZERlZldpdGhTY2FsZShtb2RlbCwgY2hhbm5lbCkpO1xuXG4gIExFR0VORF9QUk9QRVJUSUVTLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHkpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGdldFByb3BlcnR5KHByb3BlcnR5LCBsZWdlbmQsIGNoYW5uZWwsIG1vZGVsKTtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZXhwbGljaXQgPVxuICAgICAgICAvLyBzcGVjaWZpZWQgbGVnZW5kLnZhbHVlcyBpcyBhbHJlYWR5IHJlc3BlY3RlZCwgYnV0IG1heSBnZXQgdHJhbnNmb3JtZWQuXG4gICAgICAgIHByb3BlcnR5ID09PSAndmFsdWVzJyA/ICEhbGVnZW5kLnZhbHVlcyA6XG4gICAgICAgIC8vIHRpdGxlIGNhbiBiZSBleHBsaWNpdCBpZiBmaWVsZERlZi50aXRsZSBpcyBzZXRcbiAgICAgICAgcHJvcGVydHkgPT09ICd0aXRsZScgJiYgdmFsdWUgPT09IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLnRpdGxlID8gdHJ1ZSA6XG4gICAgICAgIC8vIE90aGVyd2lzZSwgdGhpbmdzIGFyZSBleHBsaWNpdCBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHByb3BlcnR5XG4gICAgICAgIHZhbHVlID09PSBsZWdlbmRbcHJvcGVydHldO1xuICAgICAgaWYgKGV4cGxpY2l0IHx8IG1vZGVsLmNvbmZpZy5sZWdlbmRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGVnZW5kQ21wdC5zZXQocHJvcGVydHksIHZhbHVlLCBleHBsaWNpdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBsZWdlbmRFbmNvZGluZyA9IGxlZ2VuZC5lbmNvZGluZyB8fCB7fTtcbiAgY29uc3QgbGVnZW5kRW5jb2RlID0gWydsYWJlbHMnLCAnbGVnZW5kJywgJ3RpdGxlJywgJ3N5bWJvbHMnLCAnZ3JhZGllbnQnXS5yZWR1Y2UoKGU6IFZnTGVnZW5kRW5jb2RlLCBwYXJ0KSA9PiB7XG4gICAgY29uc3QgbGVnZW5kRW5jb2RpbmdQYXJ0ID0gZ3VpZGVFbmNvZGVFbnRyeShsZWdlbmRFbmNvZGluZ1twYXJ0XSB8fCB7fSwgbW9kZWwpO1xuICAgIGNvbnN0IHZhbHVlID0gZW5jb2RlW3BhcnRdID9cbiAgICAgIC8vIFRPRE86IHJlcGxhY2UgbGVnZW5kQ21wdCB3aXRoIHR5cGUgaXMgc3VmZmljaWVudFxuICAgICAgZW5jb2RlW3BhcnRdKGZpZWxkRGVmLCBsZWdlbmRFbmNvZGluZ1BhcnQsIG1vZGVsLCBjaGFubmVsLCBsZWdlbmRDbXB0LmdldCgndHlwZScpKSA6IC8vIGFwcGx5IHJ1bGVcbiAgICAgIGxlZ2VuZEVuY29kaW5nUGFydDsgLy8gbm8gcnVsZSAtLSBqdXN0IGRlZmF1bHQgdmFsdWVzXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYga2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZVtwYXJ0XSA9IHt1cGRhdGU6IHZhbHVlfTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH0sIHt9IGFzIFZnTGVnZW5kRW5jb2RlKTtcblxuICBpZiAoa2V5cyhsZWdlbmRFbmNvZGUpLmxlbmd0aCA+IDApIHtcbiAgICBsZWdlbmRDbXB0LnNldCgnZW5jb2RlJywgbGVnZW5kRW5jb2RlLCAhIWxlZ2VuZC5lbmNvZGluZyk7XG4gIH1cblxuICByZXR1cm4gbGVnZW5kQ21wdDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHkocHJvcGVydHk6IGtleW9mIChMZWdlbmQgfCBWZ0xlZ2VuZCksIHNwZWNpZmllZExlZ2VuZDogTGVnZW5kLCBjaGFubmVsOiBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICdmb3JtYXQnOlxuICAgICAgLy8gV2UgZG9uJ3QgaW5jbHVkZSB0ZW1wb3JhbCBmaWVsZCBoZXJlIGFzIHdlIGFwcGx5IGZvcm1hdCBpbiBlbmNvZGUgYmxvY2tcbiAgICAgIHJldHVybiBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZExlZ2VuZC5mb3JtYXQsIG1vZGVsLmNvbmZpZyk7XG4gICAgY2FzZSAndGl0bGUnOlxuICAgICAgLy8gRm9yIGZhbHN5IHZhbHVlLCBrZWVwIHVuZGVmaW5lZCBzbyB3ZSB1c2UgZGVmYXVsdCxcbiAgICAgIC8vIGJ1dCB1c2UgbnVsbCBmb3IgJycsIG51bGwsIGFuZCBmYWxzZSB0byBoaWRlIHRoZSB0aXRsZVxuICAgICAgY29uc3Qgc3BlY2lmaWVkVGl0bGUgPSBmaWVsZERlZi50aXRsZSAhPT0gdW5kZWZpbmVkID8gZmllbGREZWYudGl0bGUgOlxuICAgICAgICBzcGVjaWZpZWRMZWdlbmQudGl0bGUgfHwgKHNwZWNpZmllZExlZ2VuZC50aXRsZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogbnVsbCk7XG5cbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShcbiAgICAgICAgc3BlY2lmaWVkVGl0bGUsXG4gICAgICAgIGZpZWxkRGVmVGl0bGUoZmllbGREZWYsIG1vZGVsLmNvbmZpZylcbiAgICAgICkgfHwgdW5kZWZpbmVkOyAvLyBtYWtlIGZhbHN5IHZhbHVlIHVuZGVmaW5lZCBzbyBvdXRwdXQgVmVnYSBzcGVjIGlzIHNob3J0ZXJcbiAgICBjYXNlICd2YWx1ZXMnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMudmFsdWVzKHNwZWNpZmllZExlZ2VuZCk7XG4gICAgY2FzZSAndHlwZSc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkTGVnZW5kLnR5cGUsIHByb3BlcnRpZXMudHlwZShmaWVsZERlZi50eXBlLCBjaGFubmVsLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSkpO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gc3BlY2lmaWVkIHByb3BlcnR5LlxuICByZXR1cm4gc3BlY2lmaWVkTGVnZW5kW3Byb3BlcnR5XTtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0TGVnZW5kKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCB7bGVnZW5kcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlTGVnZW5kKGNoaWxkKTtcblxuICAgIGtleXMoY2hpbGQuY29tcG9uZW50LmxlZ2VuZHMpLmZvckVhY2goKGNoYW5uZWw6IE5vblBvc2l0aW9uU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgICByZXNvbHZlLmxlZ2VuZFtjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlLCBjaGFubmVsKTtcblxuICAgICAgaWYgKHJlc29sdmUubGVnZW5kW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBsZWdlbmRzW2NoYW5uZWxdID0gbWVyZ2VMZWdlbmRDb21wb25lbnQobGVnZW5kc1tjaGFubmVsXSwgY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF0pO1xuXG4gICAgICAgIGlmICghbGVnZW5kc1tjaGFubmVsXSkge1xuICAgICAgICAgIC8vIElmIG1lcmdlIHJldHVybnMgbm90aGluZywgdGhlcmUgaXMgYSBjb25mbGljdCBzbyB3ZSBjYW5ub3QgbWFrZSB0aGUgbGVnZW5kIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGxlZ2VuZCBhcyBpbmRlcGVuZGVudCBhbmQgcmVtb3ZlIHRoZSBsZWdlbmQgY29tcG9uZW50LlxuICAgICAgICAgIHJlc29sdmUubGVnZW5kW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgbGVnZW5kc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAga2V5cyhsZWdlbmRzKS5mb3JFYWNoKChjaGFubmVsOiBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF0pIHtcbiAgICAgICAgLy8gc2tpcCBpZiB0aGUgY2hpbGQgZG9lcyBub3QgaGF2ZSBhIHBhcnRpY3VsYXIgbGVnZW5kXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5sZWdlbmRbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIEFmdGVyIG1lcmdpbmcgc2hhcmVkIGxlZ2VuZCwgbWFrZSBzdXJlIHRvIHJlbW92ZSBsZWdlbmQgZnJvbSBjaGlsZFxuICAgICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxlZ2VuZHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxlZ2VuZENvbXBvbmVudChtZXJnZWRMZWdlbmQ6IExlZ2VuZENvbXBvbmVudCwgY2hpbGRMZWdlbmQ6IExlZ2VuZENvbXBvbmVudCk6IExlZ2VuZENvbXBvbmVudCB7XG4gIGlmICghbWVyZ2VkTGVnZW5kKSB7XG4gICAgcmV0dXJuIGNoaWxkTGVnZW5kLmNsb25lKCk7XG4gIH1cbiAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkTGVnZW5kLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGRMZWdlbmQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuXG4gIGlmIChtZXJnZWRPcmllbnQuZXhwbGljaXQgJiYgY2hpbGRPcmllbnQuZXhwbGljaXQgJiYgbWVyZ2VkT3JpZW50LnZhbHVlICE9PSBjaGlsZE9yaWVudC52YWx1ZSkge1xuICAgIC8vIFRPRE86IHRocm93IHdhcm5pbmcgaWYgcmVzb2x2ZSBpcyBleHBsaWNpdCAoV2UgZG9uJ3QgaGF2ZSBpbmZvIGFib3V0IGV4cGxpY2l0L2ltcGxpY2l0IHJlc29sdmUgeWV0LilcbiAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGxldCB0eXBlTWVyZ2VkID0gZmFsc2U7XG4gIC8vIE90aGVyd2lzZSwgbGV0J3MgbWVyZ2VcbiAgZm9yIChjb25zdCBwcm9wIG9mIFZHX0xFR0VORF9QUk9QRVJUSUVTKSB7XG4gICAgY29uc3QgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ0xlZ2VuZCwgYW55PihcbiAgICAgIG1lcmdlZExlZ2VuZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZExlZ2VuZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnbGVnZW5kJyxcblxuICAgICAgLy8gVGllIGJyZWFrZXIgZnVuY3Rpb25cbiAgICAgICh2MTogRXhwbGljaXQ8YW55PiwgdjI6IEV4cGxpY2l0PGFueT4pOiBhbnkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VUaXRsZUNvbXBvbmVudCh2MSwgdjIpO1xuICAgICAgICAgIGNhc2UgJ3R5cGUnOlxuICAgICAgICAgICAgLy8gVGhlcmUgYXJlIG9ubHkgdHdvIHR5cGVzLiBJZiB3ZSBoYXZlIGRpZmZlcmVudCB0eXBlcywgdGhlbiBwcmVmZXIgc3ltYm9sIG92ZXIgZ3JhZGllbnQuXG4gICAgICAgICAgICB0eXBlTWVyZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBtYWtlSW1wbGljaXQoJ3N5bWJvbCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZhdWx0VGllQnJlYWtlcjxWZ0xlZ2VuZCwgYW55Pih2MSwgdjIsIHByb3AsICdsZWdlbmQnKTtcbiAgICAgIH1cbiAgICApO1xuICAgIG1lcmdlZExlZ2VuZC5zZXRXaXRoRXhwbGljaXQocHJvcCwgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQpO1xuICB9XG4gIGlmICh0eXBlTWVyZ2VkKSB7XG4gICAgaWYoKChtZXJnZWRMZWdlbmQuaW1wbGljaXQgfHwge30pLmVuY29kZSB8fCB7fSkuZ3JhZGllbnQpIHtcbiAgICAgIGRlbGV0ZU5lc3RlZFByb3BlcnR5KG1lcmdlZExlZ2VuZC5pbXBsaWNpdCwgWydlbmNvZGUnLCAnZ3JhZGllbnQnXSk7XG4gICAgfVxuICAgIGlmICgoKG1lcmdlZExlZ2VuZC5leHBsaWNpdCB8fCB7fSkuZW5jb2RlIHx8IHt9KS5ncmFkaWVudCkge1xuICAgICAgZGVsZXRlTmVzdGVkUHJvcGVydHkobWVyZ2VkTGVnZW5kLmV4cGxpY2l0LCBbJ2VuY29kZScsICdncmFkaWVudCddKTtcbiAgICB9XG4gIH1cblxuXG4gIHJldHVybiBtZXJnZWRMZWdlbmQ7XG59XG5cbiJdfQ==