"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var util_1 = require("./util");
var ScaleType;
(function (ScaleType) {
    // Continuous - Quantitative
    ScaleType.LINEAR = 'linear';
    ScaleType.LOG = 'log';
    ScaleType.POW = 'pow';
    ScaleType.SQRT = 'sqrt';
    // Continuous - Time
    ScaleType.TIME = 'time';
    ScaleType.UTC = 'utc';
    // sequential
    ScaleType.SEQUENTIAL = 'sequential';
    // Quantile, Quantize, threshold
    ScaleType.QUANTILE = 'quantile';
    ScaleType.QUANTIZE = 'quantize';
    ScaleType.THRESHOLD = 'threshold';
    ScaleType.ORDINAL = 'ordinal';
    ScaleType.POINT = 'point';
    ScaleType.BAND = 'band';
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.SCALE_TYPES = [
    // Continuous - Quantitative
    'linear', 'log', 'pow', 'sqrt',
    // Continuous - Time
    'time', 'utc',
    // Sequential
    'sequential',
    // Discrete
    'ordinal', 'point', 'band',
];
exports.CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
var CONTINUOUS_TO_CONTINUOUS_INDEX = util_1.toSet(exports.CONTINUOUS_TO_CONTINUOUS_SCALES);
exports.CONTINUOUS_DOMAIN_SCALES = exports.CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
var CONTINUOUS_DOMAIN_INDEX = util_1.toSet(exports.CONTINUOUS_DOMAIN_SCALES);
exports.DISCRETE_DOMAIN_SCALES = ['ordinal', 'point', 'band'];
var DISCRETE_DOMAIN_INDEX = util_1.toSet(exports.DISCRETE_DOMAIN_SCALES);
exports.TIME_SCALE_TYPES = ['time', 'utc'];
function hasDiscreteDomain(type) {
    return type in DISCRETE_DOMAIN_INDEX;
}
exports.hasDiscreteDomain = hasDiscreteDomain;
function hasContinuousDomain(type) {
    return type in CONTINUOUS_DOMAIN_INDEX;
}
exports.hasContinuousDomain = hasContinuousDomain;
function isContinuousToContinuous(type) {
    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
}
exports.isContinuousToContinuous = isContinuousToContinuous;
exports.defaultScaleConfig = {
    round: true,
    textXRangeStep: 90,
    rangeStep: 21,
    pointPadding: 0.5,
    bandPaddingInner: 0.1,
    facetSpacing: 16,
    minFontSize: 8,
    maxFontSize: 40,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    minStrokeWidth: 1,
    maxStrokeWidth: 4,
    shapes: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down']
};
function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
exports.isExtendedScheme = isExtendedScheme;
exports.SCALE_PROPERTIES = [
    'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'paddingInner', 'paddingOuter', 'clamp', 'nice',
    'exponent', 'zero', 'interpolate'
];
function scaleTypeSupportProperty(scaleType, propName) {
    switch (propName) {
        case 'type':
        case 'domain':
        case 'range':
        case 'scheme':
            return true;
        case 'interpolate':
            return scaleType === 'linear';
        case 'round':
            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
        case 'rangeStep':
        case 'padding':
        case 'paddingOuter':
            return util_1.contains(['point', 'band'], scaleType);
        case 'paddingInner':
            return scaleType === 'band';
        case 'clamp':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
        case 'nice':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType === 'quantize';
        case 'exponent':
            return scaleType === 'pow' || scaleType === 'log';
        case 'zero':
            // TODO: what about quantize, threshold?
            return !hasDiscreteDomain(scaleType) && !util_1.contains(['log', 'time', 'utc'], scaleType);
    }
    /* istanbul ignore next: should never reach here*/
    throw new Error("Invalid scale property " + propName + ".");
}
exports.scaleTypeSupportProperty = scaleTypeSupportProperty;
/**
 * Returns undefined if the input channel supports the input scale property name
 */
function channelScalePropertyIncompatability(channel, propName) {
    switch (propName) {
        case 'range':
            // User should not customize range for position and facet channel directly.
            if (channel === 'x' || channel === 'y') {
                return log.message.CANNOT_USE_RANGE_WITH_POSITION;
            }
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('range');
            }
            return undefined; // GOOD!
        // band / point
        case 'rangeStep':
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('rangeStep');
            }
            return undefined; // GOOD!
        case 'padding':
        case 'paddingInner':
        case 'paddingOuter':
            if (channel === 'row' || channel === 'column') {
                /*
                 * We do not use d3 scale's padding for row/column because padding there
                 * is a ratio ([0, 1]) and it causes the padding to be decimals.
                 * Therefore, we manually calculate "spacing" in the layout by ourselves.
                 */
                return log.message.CANNOT_USE_PADDING_WITH_FACET;
            }
            return undefined; // GOOD!
        case 'interpolate':
        case 'scheme':
            if (channel !== 'color') {
                return log.message.cannotUseScalePropertyWithNonColor(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'round':
        case 'clamp':
        case 'exponent':
        case 'nice':
        case 'zero':
            // These channel do not have strict requirement
            return undefined; // GOOD!
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error('Invalid scale property "${propName}".');
}
exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNkI7QUFHN0IsK0JBQXVDO0FBRXZDLElBQWlCLFNBQVMsQ0FxQnpCO0FBckJELFdBQWlCLFNBQVM7SUFDeEIsNEJBQTRCO0lBQ2YsZ0JBQU0sR0FBYSxRQUFRLENBQUM7SUFDNUIsYUFBRyxHQUFVLEtBQUssQ0FBQztJQUNuQixhQUFHLEdBQVUsS0FBSyxDQUFDO0lBQ25CLGNBQUksR0FBVyxNQUFNLENBQUM7SUFDbkMsb0JBQW9CO0lBQ1AsY0FBSSxHQUFXLE1BQU0sQ0FBQztJQUN0QixhQUFHLEdBQVcsS0FBSyxDQUFDO0lBQ2pDLGFBQWE7SUFDQSxvQkFBVSxHQUFpQixZQUFZLENBQUM7SUFFckQsZ0NBQWdDO0lBQ25CLGtCQUFRLEdBQWUsVUFBVSxDQUFDO0lBQ2xDLGtCQUFRLEdBQWUsVUFBVSxDQUFDO0lBQ2xDLG1CQUFTLEdBQWdCLFdBQVcsQ0FBQztJQUVyQyxpQkFBTyxHQUFjLFNBQVMsQ0FBQztJQUMvQixlQUFLLEdBQVksT0FBTyxDQUFDO0lBQ3pCLGNBQUksR0FBVyxNQUFNLENBQUM7QUFFckMsQ0FBQyxFQXJCZ0IsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFxQnpCO0FBU1ksUUFBQSxXQUFXLEdBQWdCO0lBQ3RDLDRCQUE0QjtJQUM1QixRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNO0lBQzlCLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsS0FBSztJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osV0FBVztJQUNYLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTTtDQUMzQixDQUFDO0FBRVcsUUFBQSwrQkFBK0IsR0FBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVHLElBQU0s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