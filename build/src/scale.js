"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var util_1 = require("./util");
var ScaleType;
(function (ScaleType) {
    // Continuous - Quantitative
    ScaleType.LINEAR = 'linear';
    ScaleType.BIN_LINEAR = 'bin-linear';
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
    ScaleType.BIN_ORDINAL = 'bin-ordinal';
    ScaleType.POINT = 'point';
    ScaleType.BAND = 'band';
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.SCALE_TYPES = [
    // Continuous - Quantitative
    'linear', 'bin-linear', 'log', 'pow', 'sqrt',
    // Continuous - Time
    'time', 'utc',
    // Sequential
    'sequential',
    // Discrete
    'ordinal', 'bin-ordinal', 'point', 'band',
];
exports.CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'bin-linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
var CONTINUOUS_TO_CONTINUOUS_INDEX = util_1.toSet(exports.CONTINUOUS_TO_CONTINUOUS_SCALES);
exports.CONTINUOUS_DOMAIN_SCALES = exports.CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
var CONTINUOUS_DOMAIN_INDEX = util_1.toSet(exports.CONTINUOUS_DOMAIN_SCALES);
exports.DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
var DISCRETE_DOMAIN_INDEX = util_1.toSet(exports.DISCRETE_DOMAIN_SCALES);
var BIN_SCALES_INDEX = util_1.toSet(['bin-linear', 'bin-ordinal']);
exports.TIME_SCALE_TYPES = ['time', 'utc'];
function hasDiscreteDomain(type) {
    return type in DISCRETE_DOMAIN_INDEX;
}
exports.hasDiscreteDomain = hasDiscreteDomain;
function isBinScale(type) {
    return type in BIN_SCALES_INDEX;
}
exports.isBinScale = isBinScale;
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
            return scaleType === 'linear' || scaleType === 'bin-linear';
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
            return scaleType === 'bin-ordinal' || (!hasDiscreteDomain(scaleType) && !util_1.contains(['log', 'time', 'utc', 'bin-linear'], scaleType));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQkFBNkI7QUFDN0IsK0JBQXVDO0FBRXZDLElBQWlCLFNBQVMsQ0FzQnpCO0FBdEJELFdBQWlCLFNBQVM7SUFDeEIsNEJBQTRCO0lBQ2YsZ0JBQU0sR0FBYSxRQUFRLENBQUM7SUFDNUIsb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBQ3hDLGFBQUcsR0FBVSxLQUFLLENBQUM7SUFDbkIsYUFBRyxHQUFVLEtBQUssQ0FBQztJQUNuQixjQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ25DLG9CQUFvQjtJQUNQLGNBQUksR0FBVyxNQUFNLENBQUM7SUFDdEIsYUFBRyxHQUFXLEtBQUssQ0FBQztJQUNqQyxhQUFhO0lBQ0Esb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBRXJELGdDQUFnQztJQUNuQixrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxtQkFBUyxHQUFnQixXQUFXLENBQUM7SUFFckMsaUJBQU8sR0FBYyxTQUFTLENBQUM7SUFDL0IscUJBQVcsR0FBa0IsYUFBYSxDQUFDO0lBQzNDLGVBQUssR0FBWSxPQUFPLENBQUM7SUFDekIsY0FBSSxHQUFXLE1BQU0sQ0FBQztBQUNyQyxDQUFDLEVBdEJnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXNCekI7QUFTWSxRQUFBLFdBQVcsR0FBZ0I7SUFDdEMsNEJBQTRCO0lBQzVCLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNO0lBQzVDLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsS0FBSztJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osV0FBVztJQUNYLFNBQVMsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU07Q0FDMUMsQ0FBQztBQUVXLFFBQUEsK0JBQStCLEdBQWdCLENBQUMs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