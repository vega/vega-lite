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
            return util_1.contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);
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