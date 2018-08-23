import { valueArray } from '../../fielddef';
import { hasContinuousDomain } from '../../scale';
import { contains } from '../../util';
export function values(legend, fieldDef) {
    var vals = legend.values;
    if (vals) {
        return valueArray(fieldDef, vals);
    }
    return undefined;
}
export function clipHeight(scaleType) {
    if (hasContinuousDomain(scaleType)) {
        return 20;
    }
    return undefined;
}
export function labelOverlap(scaleType) {
    if (contains(['quantile', 'threshold', 'log'], scaleType)) {
        return 'greedy';
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map