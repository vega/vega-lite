import { COLOR, FILL, OPACITY, SHAPE, SIZE, STROKE } from '../../channel';
import { isFieldDef, title as fieldDefTitle } from '../../fielddef';
import { LEGEND_PROPERTIES, VG_LEGEND_PROPERTIES } from '../../legend';
import { GEOJSON } from '../../type';
import { deleteNestedProperty, keys } from '../../util';
import { getSpecifiedOrDefaultValue, guideEncodeEntry, mergeTitleComponent, numberFormat } from '../common';
import { isUnitModel } from '../model';
import { parseGuideResolve } from '../resolve';
import { defaultTieBreaker, makeImplicit, mergeValuesWithExplicit } from '../split';
import { LegendComponent } from './component';
import * as encode from './encode';
import * as properties from './properties';
export function parseLegend(model) {
    if (isUnitModel(model)) {
        model.component.legends = parseUnitLegend(model);
    }
    else {
        model.component.legends = parseNonUnitLegend(model);
    }
}
function parseUnitLegend(model) {
    var encoding = model.encoding;
    return [COLOR, FILL, STROKE, SIZE, SHAPE, OPACITY].reduce(function (legendComponent, channel) {
        var def = encoding[channel];
        if (model.legend(channel) && model.getScaleComponent(channel) && !(isFieldDef(def) && (channel === SHAPE && def.type === GEOJSON))) {
            legendComponent[channel] = parseLegendForChannel(model, channel);
        }
        return legendComponent;
    }, {});
}
function getLegendDefWithScale(model, channel) {
    var _a;
    // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
    switch (channel) {
        case COLOR:
            var scale = model.scaleName(COLOR);
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
        case FILL:
        case STROKE:
        case SIZE:
        case SHAPE:
        case OPACITY:
            return _a = {}, _a[channel] = model.scaleName(channel), _a;
    }
}
export function parseLegendForChannel(model, channel) {
    var fieldDef = model.fieldDef(channel);
    var legend = model.legend(channel);
    var legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));
    LEGEND_PROPERTIES.forEach(function (property) {
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
        var legendEncodingPart = guideEncodeEntry(legendEncoding[part] || {}, model);
        var value = encode[part] ?
            // TODO: replace legendCmpt with type is sufficient
            encode[part](fieldDef, legendEncodingPart, model, channel, legendCmpt.get('type')) : // apply rule
            legendEncodingPart; // no rule -- just default values
        if (value !== undefined && keys(value).length > 0) {
            e[part] = { update: value };
        }
        return e;
    }, {});
    if (keys(legendEncode).length > 0) {
        legendCmpt.set('encode', legendEncode, !!legend.encoding);
    }
    return legendCmpt;
}
function getProperty(property, specifiedLegend, channel, model) {
    var fieldDef = model.fieldDef(channel);
    switch (property) {
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return numberFormat(fieldDef, specifiedLegend.format, model.config);
        case 'title':
            // For falsy value, keep undefined so we use default,
            // but use null for '', null, and false to hide the title
            var specifiedTitle = fieldDef.title !== undefined ? fieldDef.title :
                specifiedLegend.title || (specifiedLegend.title === undefined ? undefined : null);
            return getSpecifiedOrDefaultValue(specifiedTitle, fieldDefTitle(fieldDef, model.config)) || undefined; // make falsy value undefined so output Vega spec is shorter
        case 'values':
            return properties.values(specifiedLegend, fieldDef);
        case 'type':
            return getSpecifiedOrDefaultValue(specifiedLegend.type, properties.type(fieldDef.type, channel, model.getScaleComponent(channel).get('type')));
    }
    // Otherwise, return specified property.
    return specifiedLegend[property];
}
function parseNonUnitLegend(model) {
    var _a = model.component, legends = _a.legends, resolve = _a.resolve;
    var _loop_1 = function (child) {
        parseLegend(child);
        keys(child.component.legends).forEach(function (channel) {
            resolve.legend[channel] = parseGuideResolve(model.component.resolve, channel);
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
    keys(legends).forEach(function (channel) {
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
export function mergeLegendComponent(mergedLegend, childLegend) {
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
        var mergedValueWithExplicit = mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        function (v1, v2) {
            switch (prop) {
                case 'title':
                    return mergeTitleComponent(v1, v2);
                case 'type':
                    // There are only two types. If we have different types, then prefer symbol over gradient.
                    typeMerged = true;
                    return makeImplicit('symbol');
            }
            return defaultTieBreaker(v1, v2, prop, 'legend');
        });
        mergedLegend.setWithExplicit(prop, mergedValueWithExplicit);
    };
    // Otherwise, let's merge
    for (var _i = 0, VG_LEGEND_PROPERTIES_1 = VG_LEGEND_PROPERTIES; _i < VG_LEGEND_PROPERTIES_1.length; _i++) {
        var prop = VG_LEGEND_PROPERTIES_1[_i];
        _loop_2(prop);
    }
    if (typeMerged) {
        if (((mergedLegend.implicit || {}).encode || {}).gradient) {
            deleteNestedProperty(mergedLegend.implicit, ['encode', 'gradient']);
        }
        if (((mergedLegend.explicit || {}).encode || {}).gradient) {
            deleteNestedProperty(mergedLegend.explicit, ['encode', 'gradient']);
        }
    }
    return mergedLegend;
}
//# sourceMappingURL=parse.js.map