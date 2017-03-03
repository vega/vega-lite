"use strict";
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
    useRawDomain: false,
};
function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
exports.isExtendedScheme = isExtendedScheme;
exports.SCALE_PROPERTIES = [
    'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'clamp', 'nice',
    'exponent', 'zero', 'interpolate',
    // FIXME: determine if 'useRawDomain' should really be included here
    'useRawDomain'
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
        case 'useRawDomain':
            // TODO: 'quantize', 'quantile', 'threshold'
            return isContinuousToContinuous(scaleType) || util_1.contains(['quantize', 'quantile', 'threshold'], scaleType);
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
                return log.message.CANNOT_USE_SCALE_PROPERTY_WITH_NON_COLOR(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'round':
        case 'clamp':
        case 'exponent':
        case 'nice':
        case 'zero':
        case 'useRawDomain':
            // These channel do not have strict requirement
            return undefined; // GOOD!
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error('Invalid scale property "${propName}".');
}
exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;
//# sourceMappingURL=scale.js.map