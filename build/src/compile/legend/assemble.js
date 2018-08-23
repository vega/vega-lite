import { flatten, keys, stringify, vals } from '../../util';
import { mergeLegendComponent } from './parse';
export function assembleLegends(model) {
    var legendComponentIndex = model.component.legends;
    var legendByDomain = {};
    for (var _i = 0, _a = keys(legendComponentIndex); _i < _a.length; _i++) {
        var channel = _a[_i];
        var scaleComponent = model.getScaleComponent(channel);
        var domainHash = stringify(scaleComponent.domains);
        if (legendByDomain[domainHash]) {
            for (var _b = 0, _c = legendByDomain[domainHash]; _b < _c.length; _b++) {
                var mergedLegendComponent = _c[_b];
                var merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
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
    return flatten(vals(legendByDomain)).map(function (legendCmpt) { return legendCmpt.combine(); });
}
//# sourceMappingURL=assemble.js.map