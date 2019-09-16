import { __rest } from "tslib";
import { keys, stringify, vals } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { mergeLegendComponent } from './parse';
function setLegendEncode(legend, part, vgProp, vgRef) {
    legend.encode = legend.encode || {};
    legend.encode[part] = legend.encode[part] || {};
    legend.encode[part].update = legend.encode[part].update || {};
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
    return vals(legendByDomain)
        .flat()
        .map((legendCmpt) => {
        const _a = legendCmpt.combine(), { labelExpr } = _a, legend = __rest(_a, ["labelExpr"]);
        if (legend.encode && legend.encode.symbols) {
            const out = legend.encode.symbols.update;
            if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
                // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
                out.stroke = { value: 'transparent' };
            }
            if (legend.fill) {
                // If top-level fill is defined, for non color channel's legend, we need remove fill.
                delete out.fill;
            }
        }
        if (labelExpr !== undefined) {
            let expr = labelExpr;
            if (legend.encode &&
                legend.encode.labels &&
                legend.encode.labels.update &&
                isSignalRef(legend.encode.labels.update.text)) {
                expr = labelExpr.replace('datum.label', legend.encode.labels.update.text.signal);
            }
            setLegendEncode(legend, 'labels', 'text', { signal: expr });
        }
        return legend;
    });
}
//# sourceMappingURL=assemble.js.map