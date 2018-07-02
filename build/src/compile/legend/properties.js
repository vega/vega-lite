import { isColorChannel } from '../../channel';
import { valueArray } from '../../fielddef';
import { isBinScale } from '../../scale';
import { contains } from '../../util';
export function values(legend, fieldDef) {
    var vals = legend.values;
    if (vals) {
        return valueArray(fieldDef, vals);
    }
    return undefined;
}
export function type(t, channel, scaleType) {
    if (isColorChannel(channel) && ((t === 'quantitative' && !isBinScale(scaleType)) ||
        (t === 'temporal' && contains(['time', 'utc'], scaleType)))) {
        return 'gradient';
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map