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
var split_2 = require("../split");
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
            var explicit = property === 'values' ?
                !!legend.values : // specified legend.values is already respected, but may get transformed.
                value === legend[property];
            if (explicit || model.config.legend[property] === undefined) {
                legendCmpt.set(property, value, explicit);
            }
        }
    });
    // 2) Add mark property definition groups
    var legendEncoding = legend.encoding || {};
    var legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce(function (e, part) {
        var value = encode[part] ?
            // TODO: replace legendCmpt with type is sufficient
            encode[part](fieldDef, legendEncoding[part], model, channel, legendCmpt.get('type')) : // apply rule
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
        var mergedValueWithExplicit = split_2.mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return common_1.titleMerger(v1, v2);
                case 'type':
                    // There are only two types. If we have different types, then prefer symbol over gradient.
                    typeMerged = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sZWdlbmQvcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBaUc7QUFDakcsMkNBQWtFO0FBQ2xFLHVDQUE2RTtBQUM3RSxtQ0FBbUM7QUFDbkMsbUNBQXNEO0FBRXRELG9DQUFnRjtBQUNoRixrQ0FBNEM7QUFDNUMsc0NBQTZDO0FBQzdDLGtDQUFnRDtBQUNoRCxrQ0FBb0U7QUFFcEUseUNBQWtFO0FBQ2xFLGlDQUFtQztBQUNuQyx5Q0FBMkM7QUFHM0MscUJBQTRCLEtBQVk7SUFDdEMsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNsRDtTQUFNO1FBQ0wsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckQ7QUFDSCxDQUFDO0FBTkQsa0NBTUM7QUFFRCx5QkFBeUIsS0FBZ0I7SUFDaEMsSUFBQSx5QkFBUSxDQUFVO0lBQ3pCLE9BQU8sQ0FBQyxlQUFLLEVBQUUsY0FBSSxFQUFFLGdCQUFNLEVBQUUsY0FBSSxFQUFFLGVBQUssRUFBRSxpQkFBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsZUFBZSxFQUFFLE9BQU87UUFDMUYsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLHFCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssZUFBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssY0FBTyxDQUFDLENBQUMsRUFBRTtZQUNsSSxl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USxFQUFFO1lBQ3pELDJCQUFvQixDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUNyRTtLQUNGO0lBR0QsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQztBQS9DRCxvREErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NPTE9SLCBGSUxMLCBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCwgT1BBQ0lUWSwgU0hBUEUsIFNJWkUsIFNUUk9LRX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2lzRmllbGREZWYsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TGVnZW5kLCBMRUdFTkRfUFJPUEVSVElFUywgVkdfTEVHRU5EX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uL2xlZ2VuZCc7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtkZWxldGVOZXN0ZWRQcm9wZXJ0eSwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnTGVnZW5kLCBWZ0xlZ2VuZEVuY29kZX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZSwgbnVtYmVyRm9ybWF0LCB0aXRsZU1lcmdlcn0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7aXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7RXhwbGljaXQsIG1ha2VJbXBsaWNpdH0gZnJvbSAnLi4vc3BsaXQnO1xuaW1wb3J0IHtkZWZhdWx0VGllQnJlYWtlciwgbWVyZ2VWYWx1ZXNXaXRoRXhwbGljaXR9IGZyb20gJy4uL3NwbGl0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TGVnZW5kQ29tcG9uZW50LCBMZWdlbmRDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0ICogYXMgZW5jb2RlIGZyb20gJy4vZW5jb2RlJztcbmltcG9ydCAqIGFzIHByb3BlcnRpZXMgZnJvbSAnLi9wcm9wZXJ0aWVzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VMZWdlbmQobW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBtb2RlbC5jb21wb25lbnQubGVnZW5kcyA9IHBhcnNlVW5pdExlZ2VuZChtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgbW9kZWwuY29tcG9uZW50LmxlZ2VuZHMgPSBwYXJzZU5vblVuaXRMZWdlbmQobW9kZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdExlZ2VuZChtb2RlbDogVW5pdE1vZGVsKTogTGVnZW5kQ29tcG9uZW50SW5kZXgge1xuICBjb25zdCB7ZW5jb2Rpbmd9ID0gbW9kZWw7XG4gIHJldHVybiBbQ09MT1IsIEZJTEwsIFNUUk9LRSwgU0laRSwgU0hBUEUsIE9QQUNJVFldLnJlZHVjZShmdW5jdGlvbiAobGVnZW5kQ29tcG9uZW50LCBjaGFubmVsKSB7XG4gICAgY29uc3QgZGVmID0gZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgaWYgKG1vZGVsLmxlZ2VuZChjaGFubmVsKSAmJiBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKSAmJiAhKGlzRmllbGREZWYoZGVmKSAmJiAoY2hhbm5lbCA9PT0gU0hBUEUgJiYgZGVmLnR5cGUgPT09IEdFT0pTT04pKSkge1xuICAgICAgbGVnZW5kQ29tcG9uZW50W2NoYW5uZWxdID0gcGFyc2VMZWdlbmRGb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlZ2VuZENvbXBvbmVudDtcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBnZXRMZWdlbmREZWZXaXRoU2NhbGUobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogTm9uUG9zaXRpb25TY2FsZUNoYW5uZWwpOiBWZ0xlZ2VuZCB7XG4gIC8vIEZvciBiaW5uZWQgZmllbGQgd2l0aCBjb250aW51b3VzIHNjYWxlLCB1c2UgYSBzcGVjaWFsIHNjYWxlIHNvIHdlIGNhbiBvdmVycnJpZGUgdGhlIG1hcmsgcHJvcHMgYW5kIGxhYmVsc1xuICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICBjYXNlIENPTE9SOlxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5zY2FsZU5hbWUoQ09MT1IpO1xuICAgICAgcmV0dXJuIG1vZGVsLm1hcmtEZWYuZmlsbGVkID8ge2ZpbGw6IHNjYWxlfSA6IHtzdHJva2U6IHNjYWxlfTtcbiAgICBjYXNlIEZJTEw6XG4gICAgY2FzZSBTVFJPS0U6XG4gICAgY2FzZSBTSVpFOlxuICAgIGNhc2UgU0hBUEU6XG4gICAgY2FzZSBPUEFDSVRZOlxuICAgICAgcmV0dXJuIHtbY2hhbm5lbF06IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKX07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTGVnZW5kRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCk6IExlZ2VuZENvbXBvbmVudCB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGNvbnN0IGxlZ2VuZCA9IG1vZGVsLmxlZ2VuZChjaGFubmVsKTtcblxuICBjb25zdCBsZWdlbmRDbXB0ID0gbmV3IExlZ2VuZENvbXBvbmVudCh7fSwgZ2V0TGVnZW5kRGVmV2l0aFNjYWxlKG1vZGVsLCBjaGFubmVsKSk7XG5cbiAgTEVHRU5EX1BST1BFUlRJRVMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHkocHJvcGVydHksIGxlZ2VuZCwgY2hhbm5lbCwgbW9kZWwpO1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBleHBsaWNpdCA9IHByb3BlcnR5ID09PSAndmFsdWVzJyA/XG4gICAgICAgICEhbGVnZW5kLnZhbHVlcyA6ICAvLyBzcGVjaWZpZWQgbGVnZW5kLnZhbHVlcyBpcyBhbHJlYWR5IHJlc3BlY3RlZCwgYnV0IG1heSBnZXQgdHJhbnNmb3JtZWQuXG4gICAgICAgIHZhbHVlID09PSBsZWdlbmRbcHJvcGVydHldO1xuICAgICAgaWYgKGV4cGxpY2l0IHx8IG1vZGVsLmNvbmZpZy5sZWdlbmRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGVnZW5kQ21wdC5zZXQocHJvcGVydHksIHZhbHVlLCBleHBsaWNpdCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyAyKSBBZGQgbWFyayBwcm9wZXJ0eSBkZWZpbml0aW9uIGdyb3Vwc1xuICBjb25zdCBsZWdlbmRFbmNvZGluZyA9IGxlZ2VuZC5lbmNvZGluZyB8fCB7fTtcbiAgY29uc3QgbGVnZW5kRW5jb2RlID0gWydsYWJlbHMnLCAnbGVnZW5kJywgJ3RpdGxlJywgJ3N5bWJvbHMnLCAnZ3JhZGllbnQnXS5yZWR1Y2UoKGU6IFZnTGVnZW5kRW5jb2RlLCBwYXJ0KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPSBlbmNvZGVbcGFydF0gP1xuICAgICAgLy8gVE9ETzogcmVwbGFjZSBsZWdlbmRDbXB0IHdpdGggdHlwZSBpcyBzdWZmaWNpZW50XG4gICAgICBlbmNvZGVbcGFydF0oZmllbGREZWYsIGxlZ2VuZEVuY29kaW5nW3BhcnRdLCBtb2RlbCwgY2hhbm5lbCwgbGVnZW5kQ21wdC5nZXQoJ3R5cGUnKSkgOiAvLyBhcHBseSBydWxlXG4gICAgICBsZWdlbmRFbmNvZGluZ1twYXJ0XTsgLy8gbm8gcnVsZSAtLSBqdXN0IGRlZmF1bHQgdmFsdWVzXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYga2V5cyh2YWx1ZSkubGVuZ3RoID4gMCkge1xuICAgICAgZVtwYXJ0XSA9IHt1cGRhdGU6IHZhbHVlfTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG4gIH0sIHt9IGFzIFZnTGVnZW5kRW5jb2RlKTtcblxuICBpZiAoa2V5cyhsZWdlbmRFbmNvZGUpLmxlbmd0aCA+IDApIHtcbiAgICBsZWdlbmRDbXB0LnNldCgnZW5jb2RlJywgbGVnZW5kRW5jb2RlLCAhIWxlZ2VuZC5lbmNvZGluZyk7XG4gIH1cblxuICByZXR1cm4gbGVnZW5kQ21wdDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvcGVydHkocHJvcGVydHk6IGtleW9mIChMZWdlbmQgfCBWZ0xlZ2VuZCksIHNwZWNpZmllZExlZ2VuZDogTGVnZW5kLCBjaGFubmVsOiBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCwgbW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICBjYXNlICdmb3JtYXQnOlxuICAgICAgLy8gV2UgZG9uJ3QgaW5jbHVkZSB0ZW1wb3JhbCBmaWVsZCBoZXJlIGFzIHdlIGFwcGx5IGZvcm1hdCBpbiBlbmNvZGUgYmxvY2tcbiAgICAgIHJldHVybiBudW1iZXJGb3JtYXQoZmllbGREZWYsIHNwZWNpZmllZExlZ2VuZC5mb3JtYXQsIG1vZGVsLmNvbmZpZyk7XG4gICAgY2FzZSAndGl0bGUnOlxuICAgICAgLy8gRm9yIGZhbHN5IHZhbHVlLCBrZWVwIHVuZGVmaW5lZCBzbyB3ZSB1c2UgZGVmYXVsdCxcbiAgICAgIC8vIGJ1dCB1c2UgbnVsbCBmb3IgJycsIG51bGwsIGFuZCBmYWxzZSB0byBoaWRlIHRoZSB0aXRsZVxuICAgICAgY29uc3Qgc3BlY2lmaWVkVGl0bGUgPSBmaWVsZERlZi50aXRsZSAhPT0gdW5kZWZpbmVkID8gZmllbGREZWYudGl0bGUgOlxuICAgICAgICBzcGVjaWZpZWRMZWdlbmQudGl0bGUgfHwgKHNwZWNpZmllZExlZ2VuZC50aXRsZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogbnVsbCk7XG5cbiAgICAgIHJldHVybiBnZXRTcGVjaWZpZWRPckRlZmF1bHRWYWx1ZShcbiAgICAgICAgc3BlY2lmaWVkVGl0bGUsXG4gICAgICAgIGZpZWxkRGVmVGl0bGUoZmllbGREZWYsIG1vZGVsLmNvbmZpZylcbiAgICAgICkgfHwgdW5kZWZpbmVkOyAvLyBtYWtlIGZhbHN5IHZhbHVlIHVuZGVmaW5lZCBzbyBvdXRwdXQgVmVnYSBzcGVjIGlzIHNob3J0ZXJcbiAgICBjYXNlICd2YWx1ZXMnOlxuICAgICAgcmV0dXJuIHByb3BlcnRpZXMudmFsdWVzKHNwZWNpZmllZExlZ2VuZCk7XG4gICAgY2FzZSAndHlwZSc6XG4gICAgICByZXR1cm4gZ2V0U3BlY2lmaWVkT3JEZWZhdWx0VmFsdWUoc3BlY2lmaWVkTGVnZW5kLnR5cGUsIHByb3BlcnRpZXMudHlwZShmaWVsZERlZi50eXBlLCBjaGFubmVsLCBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKSkpO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gc3BlY2lmaWVkIHByb3BlcnR5LlxuICByZXR1cm4gc3BlY2lmaWVkTGVnZW5kW3Byb3BlcnR5XTtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0TGVnZW5kKG1vZGVsOiBNb2RlbCkge1xuICBjb25zdCB7bGVnZW5kcywgcmVzb2x2ZX0gPSBtb2RlbC5jb21wb25lbnQ7XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlTGVnZW5kKGNoaWxkKTtcblxuICAgIGtleXMoY2hpbGQuY29tcG9uZW50LmxlZ2VuZHMpLmZvckVhY2goKGNoYW5uZWw6IE5vblBvc2l0aW9uU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgICByZXNvbHZlLmxlZ2VuZFtjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKG1vZGVsLmNvbXBvbmVudC5yZXNvbHZlLCBjaGFubmVsKTtcblxuICAgICAgaWYgKHJlc29sdmUubGVnZW5kW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBJZiB0aGUgcmVzb2x2ZSBzYXlzIHNoYXJlZCAoYW5kIGhhcyBub3QgYmVlbiBvdmVycmlkZGVuKVxuICAgICAgICAvLyBXZSB3aWxsIHRyeSB0byBtZXJnZSBhbmQgc2VlIGlmIHRoZXJlIGlzIGEgY29uZmxpY3RcblxuICAgICAgICBsZWdlbmRzW2NoYW5uZWxdID0gbWVyZ2VMZWdlbmRDb21wb25lbnQobGVnZW5kc1tjaGFubmVsXSwgY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF0pO1xuXG4gICAgICAgIGlmICghbGVnZW5kc1tjaGFubmVsXSkge1xuICAgICAgICAgIC8vIElmIG1lcmdlIHJldHVybnMgbm90aGluZywgdGhlcmUgaXMgYSBjb25mbGljdCBzbyB3ZSBjYW5ub3QgbWFrZSB0aGUgbGVnZW5kIHNoYXJlZC5cbiAgICAgICAgICAvLyBUaHVzLCBtYXJrIGxlZ2VuZCBhcyBpbmRlcGVuZGVudCBhbmQgcmVtb3ZlIHRoZSBsZWdlbmQgY29tcG9uZW50LlxuICAgICAgICAgIHJlc29sdmUubGVnZW5kW2NoYW5uZWxdID0gJ2luZGVwZW5kZW50JztcbiAgICAgICAgICBkZWxldGUgbGVnZW5kc1tjaGFubmVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAga2V5cyhsZWdlbmRzKS5mb3JFYWNoKChjaGFubmVsOiBOb25Qb3NpdGlvblNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF0pIHtcbiAgICAgICAgLy8gc2tpcCBpZiB0aGUgY2hpbGQgZG9lcyBub3QgaGF2ZSBhIHBhcnRpY3VsYXIgbGVnZW5kXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzb2x2ZS5sZWdlbmRbY2hhbm5lbF0gPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIC8vIEFmdGVyIG1lcmdpbmcgc2hhcmVkIGxlZ2VuZCwgbWFrZSBzdXJlIHRvIHJlbW92ZSBsZWdlbmQgZnJvbSBjaGlsZFxuICAgICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50LmxlZ2VuZHNbY2hhbm5lbF07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxlZ2VuZHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUxlZ2VuZENvbXBvbmVudChtZXJnZWRMZWdlbmQ6IExlZ2VuZENvbXBvbmVudCwgY2hpbGRMZWdlbmQ6IExlZ2VuZENvbXBvbmVudCk6IExlZ2VuZENvbXBvbmVudCB7XG4gIGlmICghbWVyZ2VkTGVnZW5kKSB7XG4gICAgcmV0dXJuIGNoaWxkTGVnZW5kLmNsb25lKCk7XG4gIH1cbiAgY29uc3QgbWVyZ2VkT3JpZW50ID0gbWVyZ2VkTGVnZW5kLmdldFdpdGhFeHBsaWNpdCgnb3JpZW50Jyk7XG4gIGNvbnN0IGNoaWxkT3JpZW50ID0gY2hpbGRMZWdlbmQuZ2V0V2l0aEV4cGxpY2l0KCdvcmllbnQnKTtcblxuXG4gIGlmIChtZXJnZWRPcmllbnQuZXhwbGljaXQgJiYgY2hpbGRPcmllbnQuZXhwbGljaXQgJiYgbWVyZ2VkT3JpZW50LnZhbHVlICE9PSBjaGlsZE9yaWVudC52YWx1ZSkge1xuICAgIC8vIFRPRE86IHRocm93IHdhcm5pbmcgaWYgcmVzb2x2ZSBpcyBleHBsaWNpdCAoV2UgZG9uJ3QgaGF2ZSBpbmZvIGFib3V0IGV4cGxpY2l0L2ltcGxpY2l0IHJlc29sdmUgeWV0LilcbiAgICAvLyBDYW5ub3QgbWVyZ2UgZHVlIHRvIGluY29uc2lzdGVudCBvcmllbnRcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGxldCB0eXBlTWVyZ2VkID0gZmFsc2U7XG4gIC8vIE90aGVyd2lzZSwgbGV0J3MgbWVyZ2VcbiAgZm9yIChjb25zdCBwcm9wIG9mIFZHX0xFR0VORF9QUk9QRVJUSUVTKSB7XG4gICAgY29uc3QgbWVyZ2VkVmFsdWVXaXRoRXhwbGljaXQgPSBtZXJnZVZhbHVlc1dpdGhFeHBsaWNpdDxWZ0xlZ2VuZCwgYW55PihcbiAgICAgIG1lcmdlZExlZ2VuZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBjaGlsZExlZ2VuZC5nZXRXaXRoRXhwbGljaXQocHJvcCksXG4gICAgICBwcm9wLCAnbGVnZW5kJyxcblxuICAgICAgLy8gVGllIGJyZWFrZXIgZnVuY3Rpb25cbiAgICAgICh2MTogRXhwbGljaXQ8YW55PiwgdjI6IEV4cGxpY2l0PGFueT4pOiBhbnkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICBjYXNlICd0aXRsZSc6XG4gICAgICAgICAgICByZXR1cm4gdGl0bGVNZXJnZXIodjEsIHYyKTtcbiAgICAgICAgICBjYXNlICd0eXBlJzpcbiAgICAgICAgICAgIC8vIFRoZXJlIGFyZSBvbmx5IHR3byB0eXBlcy4gSWYgd2UgaGF2ZSBkaWZmZXJlbnQgdHlwZXMsIHRoZW4gcHJlZmVyIHN5bWJvbCBvdmVyIGdyYWRpZW50LlxuICAgICAgICAgICAgdHlwZU1lcmdlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gbWFrZUltcGxpY2l0KCdzeW1ib2wnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdFRpZUJyZWFrZXI8VmdMZWdlbmQsIGFueT4odjEsIHYyLCBwcm9wLCAnbGVnZW5kJyk7XG4gICAgICB9XG4gICAgKTtcbiAgICBtZXJnZWRMZWdlbmQuc2V0V2l0aEV4cGxpY2l0KHByb3AsIG1lcmdlZFZhbHVlV2l0aEV4cGxpY2l0KTtcbiAgfVxuICBpZiAodHlwZU1lcmdlZCkge1xuICAgIGlmKCgobWVyZ2VkTGVnZW5kLmltcGxpY2l0IHx8IHt9KS5lbmNvZGUgfHwge30pLmdyYWRpZW50KSB7XG4gICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShtZXJnZWRMZWdlbmQuaW1wbGljaXQsIFsnZW5jb2RlJywgJ2dyYWRpZW50J10pO1xuICAgIH1cbiAgICBpZiAoKChtZXJnZWRMZWdlbmQuZXhwbGljaXQgfHwge30pLmVuY29kZSB8fCB7fSkuZ3JhZGllbnQpIHtcbiAgICAgIGRlbGV0ZU5lc3RlZFByb3BlcnR5KG1lcmdlZExlZ2VuZC5leHBsaWNpdCwgWydlbmNvZGUnLCAnZ3JhZGllbnQnXSk7XG4gICAgfVxuICB9XG5cblxuICByZXR1cm4gbWVyZ2VkTGVnZW5kO1xufVxuXG4iXX0=