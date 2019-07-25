import { isColorChannel } from '../../channel';
import { valueArray } from '../../channeldef';
import { isContinuousToContinuous } from '../../scale';
import { contains, getFirstDefined } from '../../util';
import { getFirstConditionValue } from './encode';
export function values(legend, fieldDef) {
    const vals = legend.values;
    if (vals) {
        return valueArray(fieldDef, vals);
    }
    return undefined;
}
export function defaultSymbolType(mark, channel, shapeChannelDef, markShape) {
    if (channel !== 'shape') {
        // use the value from the shape encoding or the mark config if they exist
        const shape = getFirstConditionValue(shapeChannelDef) || markShape;
        if (shape) {
            return shape;
        }
    }
    switch (mark) {
        case 'bar':
        case 'rect':
        case 'square':
            return 'square';
        case 'line':
        case 'trail':
        case 'rule':
            return 'stroke';
        case 'point':
        case 'circle':
        case 'tick':
        case 'geoshape':
        case 'area':
        case 'text':
            return 'circle';
    }
}
export function clipHeight(legendType) {
    if (legendType === 'gradient') {
        return 20;
    }
    return undefined;
}
export function type(params) {
    const { legend } = params;
    return getFirstDefined(legend.type, defaultType(params));
}
export function defaultType({ channel, timeUnit, scaleType, alwaysReturn }) {
    // Following the logic in https://github.com/vega/vega-parser/blob/master/src/parsers/legend.js
    if (isColorChannel(channel)) {
        if (contains(['quarter', 'month', 'day'], timeUnit)) {
            return 'symbol';
        }
        if (isContinuousToContinuous(scaleType)) {
            return alwaysReturn ? 'gradient' : undefined;
        }
    }
    return alwaysReturn ? 'symbol' : undefined;
}
export function direction({ legend, legendConfig, timeUnit, channel, scaleType }) {
    const orient = getFirstDefined(legend.orient, legendConfig.orient, 'right');
    const legendType = type({ legend, channel, timeUnit, scaleType, alwaysReturn: true });
    return getFirstDefined(legend.direction, legendConfig[legendType ? 'gradientDirection' : 'symbolDirection'], defaultDirection(orient, legendType));
}
function defaultDirection(orient, legendType) {
    switch (orient) {
        case 'top':
        case 'bottom':
            return 'horizontal';
        case 'left':
        case 'right':
        case 'none':
        case undefined: // undefined = "right" in Vega
            return undefined; // vertical is Vega's default
        default:
            // top-left / ...
            // For inner legend, uses compact layout like Tableau
            return legendType === 'gradient' ? 'horizontal' : undefined;
    }
}
export function defaultGradientLength({ legend, legendConfig, model, channel, scaleType }) {
    const { gradientHorizontalMaxLength, gradientHorizontalMinLength, gradientVerticalMaxLength, gradientVerticalMinLength } = legendConfig;
    const dir = direction({ legend, legendConfig, channel, scaleType });
    if (dir === 'horizontal') {
        const orient = getFirstDefined(legend.orient, legendConfig.orient);
        if (orient === 'top' || orient === 'bottom') {
            return gradientLengthSignal(model, 'width', gradientHorizontalMinLength, gradientHorizontalMaxLength);
        }
        else {
            return gradientHorizontalMinLength;
        }
    }
    else {
        // vertical / undefined (Vega uses vertical by default)
        return gradientLengthSignal(model, 'height', gradientVerticalMinLength, gradientVerticalMaxLength);
    }
}
function gradientLengthSignal(model, sizeType, min, max) {
    const sizeSignal = model.getSizeSignalRef(sizeType).signal;
    return { signal: `clamp(${sizeSignal}, ${min}, ${max})` };
}
export function defaultLabelOverlap(scaleType) {
    if (contains(['quantile', 'threshold', 'log'], scaleType)) {
        return 'greedy';
    }
    return undefined;
}
//# sourceMappingURL=properties.js.map