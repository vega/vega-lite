import { flatten, keys, stringify, vals } from '../../util';
import { mergeLegendComponent } from './parse';
export function assembleLegends(model) {
    const legendComponentIndex = model.component.legends;
    const legendByDomain = {};
    for (const channel of keys(legendComponentIndex)) {
        const scaleComponent = model.getScaleComponent(channel);
        const domainHash = stringify(scaleComponent.domains);
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
    return flatten(vals(legendByDomain)).map((legendCmpt) => {
        const legend = legendCmpt.combine();
        // For non color channel's legend, we need to override symbol stroke config from Vega config
        if (legend.encode && legend.encode.symbols) {
            const out = legend.encode.symbols.update;
            if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
                // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
                out.stroke = { value: 'transparent' };
            }
        }
        return legend;
    });
}
//# sourceMappingURL=assemble.js.map