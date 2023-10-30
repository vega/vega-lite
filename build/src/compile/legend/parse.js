import { COLOR, SHAPE } from '../../channel';
import { getFieldOrDatumDef, isFieldDef } from '../../channeldef';
import { LEGEND_SCALE_CHANNELS } from '../../legend';
import { normalizeTimeUnit } from '../../timeunit';
import { GEOJSON } from '../../type';
import { deleteNestedProperty, isEmpty, keys, varName } from '../../util';
import { mergeTitleComponent } from '../common';
import { guideEncodeEntry } from '../guide';
import { isUnitModel } from '../model';
import { parseGuideResolve } from '../resolve';
import { parseInteractiveLegend } from '../selection/legends';
import { defaultTieBreaker, makeImplicit, mergeValuesWithExplicit } from '../split';
import { LegendComponent, LEGEND_COMPONENT_PROPERTIES } from './component';
import { legendEncodeRules } from './encode';
import { getDirection, getLegendType, legendRules } from './properties';
export function parseLegend(model) {
    const legendComponent = isUnitModel(model) ? parseUnitLegend(model) : parseNonUnitLegend(model);
    model.component.legends = legendComponent;
    return legendComponent;
}
function parseUnitLegend(model) {
    const { encoding } = model;
    const legendComponent = {};
    for (const channel of [COLOR, ...LEGEND_SCALE_CHANNELS]) {
        const def = getFieldOrDatumDef(encoding[channel]);
        if (!def || !model.getScaleComponent(channel)) {
            continue;
        }
        if (channel === SHAPE && isFieldDef(def) && def.type === GEOJSON) {
            continue;
        }
        legendComponent[channel] = parseLegendForChannel(model, channel);
    }
    return legendComponent;
}
function getLegendDefWithScale(model, channel) {
    const scale = model.scaleName(channel);
    if (model.mark === 'trail') {
        if (channel === 'color') {
            // trail is a filled mark, but its default symbolType ("stroke") should use "stroke"
            return { stroke: scale };
        }
        else if (channel === 'size') {
            return { strokeWidth: scale };
        }
    }
    if (channel === 'color') {
        return model.markDef.filled ? { fill: scale } : { stroke: scale };
    }
    return { [channel]: scale };
}
// eslint-disable-next-line @typescript-eslint/ban-types
function isExplicit(value, property, legend, fieldDef) {
    switch (property) {
        case 'disable':
            return legend !== undefined; // if axis is specified or null/false, then its enable/disable state is explicit
        case 'values':
            // specified legend.values is already respected, but may get transformed.
            return !!legend?.values;
        case 'title':
            // title can be explicit if fieldDef.title is set
            if (property === 'title' && value === fieldDef?.title) {
                return true;
            }
    }
    // Otherwise, things are explicit if the returned value matches the specified property
    return value === (legend || {})[property];
}
export function parseLegendForChannel(model, channel) {
    let legend = model.legend(channel);
    const { markDef, encoding, config } = model;
    const legendConfig = config.legend;
    const legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));
    parseInteractiveLegend(model, channel, legendCmpt);
    const disable = legend !== undefined ? !legend : legendConfig.disable;
    legendCmpt.set('disable', disable, legend !== undefined);
    if (disable) {
        return legendCmpt;
    }
    legend = legend || {};
    const scaleType = model.getScaleComponent(channel).get('type');
    const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
    const timeUnit = isFieldDef(fieldOrDatumDef) ? normalizeTimeUnit(fieldOrDatumDef.timeUnit)?.unit : undefined;
    const orient = legend.orient || config.legend.orient || 'right';
    const legendType = getLegendType({ legend, channel, timeUnit, scaleType });
    const direction = getDirection({ legend, legendType, orient, legendConfig });
    const ruleParams = {
        legend,
        channel,
        model,
        markDef,
        encoding,
        fieldOrDatumDef,
        legendConfig,
        config,
        scaleType,
        orient,
        legendType,
        direction
    };
    for (const property of LEGEND_COMPONENT_PROPERTIES) {
        if ((legendType === 'gradient' && property.startsWith('symbol')) ||
            (legendType === 'symbol' && property.startsWith('gradient'))) {
            continue;
        }
        const value = property in legendRules ? legendRules[property](ruleParams) : legend[property];
        if (value !== undefined) {
            const explicit = isExplicit(value, property, legend, model.fieldDef(channel));
            if (explicit || config.legend[property] === undefined) {
                legendCmpt.set(property, value, explicit);
            }
        }
    }
    const legendEncoding = legend?.encoding ?? {};
    const selections = legendCmpt.get('selections');
    const legendEncode = {};
    const legendEncodeParams = { fieldOrDatumDef, model, channel, legendCmpt, legendType };
    for (const part of ['labels', 'legend', 'title', 'symbols', 'gradient', 'entries']) {
        const legendEncodingPart = guideEncodeEntry(legendEncoding[part] ?? {}, model);
        const value = part in legendEncodeRules
            ? legendEncodeRules[part](legendEncodingPart, legendEncodeParams) // apply rule
            : legendEncodingPart; // no rule -- just default values
        if (value !== undefined && !isEmpty(value)) {
            legendEncode[part] = {
                ...(selections?.length && isFieldDef(fieldOrDatumDef)
                    ? { name: `${varName(fieldOrDatumDef.field)}_legend_${part}` }
                    : {}),
                ...(selections?.length ? { interactive: !!selections } : {}),
                update: value
            };
        }
    }
    if (!isEmpty(legendEncode)) {
        legendCmpt.set('encode', legendEncode, !!legend?.encoding);
    }
    return legendCmpt;
}
function parseNonUnitLegend(model) {
    const { legends, resolve } = model.component;
    for (const child of model.children) {
        parseLegend(child);
        for (const channel of keys(child.component.legends)) {
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
        }
    }
    for (const channel of keys(legends)) {
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
    }
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
    for (const prop of LEGEND_COMPONENT_PROPERTIES) {
        const mergedValueWithExplicit = mergeValuesWithExplicit(mergedLegend.getWithExplicit(prop), childLegend.getWithExplicit(prop), prop, 'legend', 
        // Tie breaker function
        (v1, v2) => {
            switch (prop) {
                case 'symbolType':
                    return mergeSymbolType(v1, v2);
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
        if (mergedLegend.implicit?.encode?.gradient) {
            deleteNestedProperty(mergedLegend.implicit, ['encode', 'gradient']);
        }
        if (mergedLegend.explicit?.encode?.gradient) {
            deleteNestedProperty(mergedLegend.explicit, ['encode', 'gradient']);
        }
    }
    return mergedLegend;
}
function mergeSymbolType(st1, st2) {
    if (st2.value === 'circle') {
        // prefer "circle" over "stroke"
        return st2;
    }
    return st1;
}
//# sourceMappingURL=parse.js.map