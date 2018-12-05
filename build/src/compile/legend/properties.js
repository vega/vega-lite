import { valueArray } from '../../fielddef';
import { hasContinuousDomain } from '../../scale';
import { contains, getFirstDefined } from '../../util';
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
export function defaultGradientLength(model, legend, legendConfig) {
    var gradientDirection = legendConfig.gradientDirection, gradientHorizontalMaxLength = legendConfig.gradientHorizontalMaxLength, gradientHorizontalMinLength = legendConfig.gradientHorizontalMinLength, gradientVerticalMaxLength = legendConfig.gradientVerticalMaxLength, gradientVerticalMinLength = legendConfig.gradientVerticalMinLength;
    var direction = getFirstDefined(legend.direction, gradientDirection);
    if (direction === 'horizontal') {
        var orient = getFirstDefined(legend.orient, legendConfig.orient);
        if (orient === 'top' || orient === 'bottom') {
            return gradientLengthSignal(model, 'width', gradientHorizontalMinLength, gradientHorizontalMaxLength);
        }
        else {
            return gradientHorizontalMinLength;
        }
    }
    else {
        return gradientLengthSignal(model, 'height', gradientVerticalMinLength, gradientVerticalMaxLength);
    }
}
function gradientLengthSignal(model, sizeType, min, max) {
    var sizeSignal = model.getSizeSignalRef(sizeType).signal;
    return { signal: "clamp(" + sizeSignal + ", " + min + ", " + max + ")" };
}
export function labelOverlap(scaleType) {
    if (contains(['quantile', 'threshold', 'log'], scaleType)) {
        return 'greedy';
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map