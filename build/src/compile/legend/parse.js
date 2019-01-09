import { COLOR, FILL, FILLOPACITY, OPACITY, SHAPE, SIZE, STROKE, STROKEOPACITY, STROKEWIDTH } from '../../channel';
import { getTypedFieldDef, isFieldDef, title as fieldDefTitle } from '../../fielddef';
import { LEGEND_PROPERTIES, VG_LEGEND_PROPERTIES } from '../../legend';
import { GEOJSON } from '../../type';
import { deleteNestedProperty, getFirstDefined, keys } from '../../util';
import { mergeTitleComponent, numberFormat } from '../common';
import { guideEncodeEntry } from '../guide';
import { isUnitModel } from '../model';
import { parseGuideResolve } from '../resolve';
import { defaultTieBreaker, makeImplicit, mergeValuesWithExplicit } from '../split';
import { LegendComponent } from './component';
import * as encode from './encode';
import * as properties from './properties';
import { direction, type } from './properties';
export function parseLegend(model) {
    if (isUnitModel(model)) {
        model.component.legends = parseUnitLegend(model);
    }
    else {
        model.component.legends = parseNonUnitLegend(model);
    }
}
function parseUnitLegend(model) {
    const { encoding } = model;
    return [COLOR, FILL, STROKE, STROKEWIDTH, SIZE, SHAPE, OPACITY, FILLOPACITY, STROKEOPACITY].reduce((legendComponent, channel) => {
        const def = encoding[channel];
        if (model.legend(channel) &&
            model.getScaleComponent(channel) &&
            !(isFieldDef(def) && (channel === SHAPE && def.type === GEOJSON))) {
            legendComponent[channel] = parseLegendForChannel(model, channel);
        }
        return legendComponent;
    }, {});
}
function getLegendDefWithScale(model, channel) {
    // For binned field with continuous scale, use a special scale so we can override the mark props and labels
    switch (channel) {
        case COLOR:
            const scale = model.scaleName(COLOR);
            return model.markDef.filled ? { fill: scale } : { stroke: scale };
        case FILL:
        case STROKE:
        case STROKEWIDTH:
        case SIZE:
        case SHAPE:
        case OPACITY:
        case FILLOPACITY:
        case STROKEOPACITY:
            return { [channel]: model.scaleName(channel) };
    }
}
function isExplicit(value, property, legend, fieldDef) {
    switch (property) {
        case 'values':
            // specified legend.values is already respected, but may get transformed.
            return !!legend.values;
        case 'title':
            // title can be explicit if fieldDef.title is set
            if (property === 'title' && value === fieldDef.title) {
                return true;
            }
    }
    // Otherwise, things are explicit if the returned value matches the specified property
    return value === legend[property];
}
export function parseLegendForChannel(model, channel) {
    const fieldDef = model.fieldDef(channel);
    const legend = model.legend(channel);
    const legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));
    for (const property of LEGEND_PROPERTIES) {
        const value = getProperty(property, legend, channel, model);
        if (value !== undefined) {
            const explicit = isExplicit(value, property, legend, fieldDef);
            if (explicit || model.config.legend[property] === undefined) {
                legendCmpt.set(property, value, explicit);
            }
        }
    }
    const legendEncoding = legend.encoding || {};
    const legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce((e, part) => {
        const legendEncodingPart = guideEncodeEntry(legendEncoding[part] || {}, model);
        const value = encode[part]
            ? encode[part](fieldDef, legendEncodingPart, model, channel, legendCmpt) // apply rule
            : legendEncodingPart; // no rule -- just default values
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
function getProperty(property, legend, channel, model) {
    const { encoding } = model;
    const fieldDef = getTypedFieldDef(encoding[channel]);
    const legendConfig = model.config.legend;
    const { timeUnit } = fieldDef;
    const scaleType = model.getScaleComponent(channel).get('type');
    switch (property) {
        case 'format':
            // We don't include temporal field here as we apply format in encode block
            return numberFormat(fieldDef, legend.format, model.config);
        case 'title':
            return fieldDefTitle(fieldDef, model.config, { allowDisabling: true }) || undefined;
        case 'type':
            return type({ legend, channel, timeUnit, scaleType, alwaysReturn: false });
        case 'direction':
            return direction({ legend, legendConfig, timeUnit, channel, scaleType });
        // TODO: enable when https://github.com/vega/vega/issues/1351 is fixed
        // case 'clipHeight':
        //   return getFirstDefined(specifiedLegend.clipHeight, properties.clipHeight(properties.type(...)));
        case 'labelOverlap':
            return getFirstDefined(legend.labelOverlap, properties.defaultLabelOverlap(scaleType));
        case 'gradientLength':
            return getFirstDefined(
            // do specified gradientLength first
            legend.gradientLength, legendConfig.gradientLength, 
            // Otherwise, use smart default based on plot height
            properties.defaultGradientLength({
                model,
                legend,
                legendConfig,
                channel,
                scaleType
            }));
        case 'values':
            return properties.values(legend, fieldDef);
    }
    // Otherwise, return specified property.
    return legend[property];
}
function parseNonUnitLegend(model) {
    const { legends, resolve } = model.component;
    for (const child of model.children) {
        parseLegend(child);
        keys(child.component.legends).forEach((channel) => {
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
    }
    keys(legends).forEach((channel) => {
        for (const child of model.children) {
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
    const mergedOrient = mergedLegend.getWithExplicit('orient');
    const childOrient = childLegend.getWithExplicit('orient');
    if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
        // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
        // Cannot merge due to inconsistent orient
        return undefined;
    }
    let typeMerged = false;
    // Otherwise, let's merge
    for (const prop of VG_LEGEND_PROPERTIES) {
        const mergedValueWithExplicit = mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        (v1, v2) => {
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