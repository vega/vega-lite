import { LEGEND_SCALE_CHANNELS } from '../../legend';
import { keys, replaceAll, stringify, vals } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { mergeLegendComponent } from './parse';
function setLegendEncode(legend, part, vgProp, vgRef) {
    var _a, _b;
    legend.encode ?? (legend.encode = {});
    (_a = legend.encode)[part] ?? (_a[part] = {});
    (_b = legend.encode[part]).update ?? (_b.update = {});
    // TODO: remove as any after https://github.com/prisma/nexus-prisma/issues/291
    legend.encode[part].update[vgProp] = vgRef;
}
export function assembleLegends(model) {
    const legendComponentIndex = model.component.legends;
    const legendByDomain = {};
    for (const channel of keys(legendComponentIndex)) {
        const scaleComponent = model.getScaleComponent(channel);
        const domainHash = stringify(scaleComponent.get('domains'));
        if (legendByDomain[domainHash]) {
            for (const mergedLegendComponent of legendByDomain[domainHash]) {
                const merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
                if (!merged) {
                    // If cannot merge, need to add this legend separately
                    legendByDomain[domainHash].push(legendComponentIndex[channel]);
                }
            }
        }
        else {
            legendByDomain[domainHash] = [legendComponentIndex[channel].clone()];
        }
    }
    const legends = vals(legendByDomain)
        .flat()
        .map(l => assembleLegend(l, model.config))
        .filter(l => l !== undefined);
    return legends;
}
export function assembleLegend(legendCmpt, config) {
    const { disable, labelExpr, selections, ...legend } = legendCmpt.combine();
    if (disable) {
        return undefined;
    }
    if (config.aria === false && legend.aria == undefined) {
        legend.aria = false;
    }
    if (legend.encode?.symbols) {
        const out = legend.encode.symbols.update;
        if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
            // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
            out.stroke = { value: 'transparent' };
        }
        // Remove properties that the legend is encoding.
        for (const property of LEGEND_SCALE_CHANNELS) {
            if (legend[property]) {
                delete out[property];
            }
        }
    }
    if (!legend.title) {
        // title schema doesn't include null, ''
        delete legend.title;
    }
    if (labelExpr !== undefined) {
        let expr = labelExpr;
        if (legend.encode?.labels?.update && isSignalRef(legend.encode.labels.update.text)) {
            expr = replaceAll(labelExpr, 'datum.label', legend.encode.labels.update.text.signal);
        }
        setLegendEncode(legend, 'labels', 'text', { signal: expr });
    }
    return legend;
}
//# sourceMappingURL=assemble.js.map