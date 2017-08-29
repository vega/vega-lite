"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
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
/**
 * Index for scale categories -- only scale of the same categories can be merged together.
 * Current implementation is trying to be conservative and avoid merging scale type that might not work together
 */
var SCALE_CATEGORY_INDEX = {
    linear: 'numeric',
    log: 'numeric',
    pow: 'numeric',
    sqrt: 'numeric',
    'bin-linear': 'bin-linear',
    time: 'time',
    utc: 'time',
    sequential: 'sequential',
    ordinal: 'ordinal',
    'bin-ordinal': 'bin-ordinal',
    point: 'ordinal-position',
    band: 'ordinal-position'
};
exports.SCALE_TYPES = util_1.keys(SCALE_CATEGORY_INDEX);
function getScaleCategory(scaleType) {
    return SCALE_CATEGORY_INDEX[scaleType];
}
exports.getScaleCategory = getScaleCategory;
/**
 * Whether the two given scale types can be merged together.
 */
function scaleCompatible(scaleType1, scaleType2) {
    return SCALE_CATEGORY_INDEX[scaleType1] === SCALE_CATEGORY_INDEX[scaleType2];
}
exports.scaleCompatible = scaleCompatible;
/**
 * Index for scale predecence -- high score = higher priority for merging.
 */
var SCALE_PRECEDENCE_INDEX = {
    // numeric
    linear: 0,
    log: 1,
    pow: 1,
    sqrt: 1,
    // time
    time: 0,
    utc: 0,
    // ordinal-position
    point: 0,
    band: 1,
    // non grouped types
    'bin-linear': 0,
    sequential: 0,
    ordinal: 0,
    'bin-ordinal': 0,
};
/**
 * Return scale categories -- only scale of the same categories can be merged together.
 */
function scaleTypePrecedence(scaleType) {
    return SCALE_PRECEDENCE_INDEX[scaleType];
}
exports.scaleTypePrecedence = scaleTypePrecedence;
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
    minBandSize: 2,
    minFontSize: 8,
    maxFontSize: 40,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    minStrokeWidth: 1,
    maxStrokeWidth: 4
};
function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
exports.isExtendedScheme = isExtendedScheme;
function isSelectionDomain(domain) {
    return domain && domain['selection'];
}
exports.isSelectionDomain = isSelectionDomain;
exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = [
    'reverse', 'round',
    // quantitative / time
    'clamp', 'nice',
    // quantitative
    'exponent', 'interpolate', 'zero',
    // ordinal
    'padding', 'paddingInner', 'paddingOuter',
];
exports.SCALE_PROPERTIES = [].concat([
    'type', 'domain',
    'range', 'rangeStep', 'scheme'
], exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES);
function scaleTypeSupportProperty(scaleType, propName) {
    switch (propName) {
        case 'type':
        case 'domain':
        case 'reverse':
        case 'range':
            return true;
        case 'scheme':
            return util_1.contains(['sequential', 'ordinal', 'bin-ordinal', 'quantile', 'quantize'], scaleType);
        case 'interpolate':
            // FIXME(https://github.com/vega/vega-lite/issues/2902) how about ordinal?
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
            return scaleType === 'pow';
        case 'base':
            return scaleType === 'log';
        case 'zero':
            return hasContinuousDomain(scaleType) && !util_1.contains([
                'log',
                'time', 'utc',
                'bin-linear',
                'threshold',
                'quantile' // quantile depends on distribution so zero does not matter
            ], scaleType);
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
            return undefined; // GOOD!
        case 'interpolate':
        case 'scheme':
            if (channel !== 'color') {
                return log.message.cannotUseScalePropertyWithNonColor(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'exponent':
        case 'nice':
        case 'padding':
        case 'paddingInner':
        case 'paddingOuter':
        case 'rangeStep':
        case 'reverse':
        case 'round':
        case 'clamp':
        case 'zero':
            return undefined; // GOOD!
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error('Invalid scale property "${propName}".');
}
exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;
function channelSupportScaleType(channel, scaleType) {
    switch (channel) {
        case channel_1.Channel.X:
        case channel_1.Channel.Y:
        case channel_1.Channel.SIZE: // TODO: size and opacity can support ordinal with more modification
        case channel_1.Channel.OPACITY:
            // Although it generally doesn't make sense to use band with size and opacity,
            // it can also work since we use band: 0.5 to get midpoint.
            return isContinuousToContinuous(scaleType) || util_1.contains(['band', 'point'], scaleType);
        case channel_1.Channel.COLOR:
            return scaleType !== 'band'; // band does not make sense with color
        case channel_1.Channel.SHAPE:
            return scaleType === 'ordinal'; // shape = lookup only
    }
    /* istanbul ignore next: it should never reach here */
    return false;
}
exports.channelSupportScaleType = channelSupportScaleType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFHbEMsMkJBQTZCO0FBQzdCLCtCQUE2QztBQUc3QyxJQUFpQixTQUFTLENBc0J6QjtBQXRCRCxXQUFpQixTQUFTO0lBQ3hCLDRCQUE0QjtJQUNmLGdCQUFNLEdBQWEsUUFBUSxDQUFDO0lBQzVCLG9CQUFVLEdBQWlCLFlBQVksQ0FBQztJQUN4QyxhQUFHLEdBQVUsS0FBSyxDQUFDO0lBQ25CLGFBQUcsR0FBVSxLQUFLLENBQUM7SUFDbkIsY0FBSSxHQUFXLE1BQU0sQ0FBQztJQUNuQyxvQkFBb0I7SUFDUCxjQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ3RCLGFBQUcsR0FBVyxLQUFLLENBQUM7SUFDakMsYUFBYTtJQUNBLG9CQUFVLEdBQWlCLFlBQVksQ0FBQztJQUVyRCxnQ0FBZ0M7SUFDbkIsa0JBQVEsR0FBZSxVQUFVLENBQUM7SUFDbEMsa0JBQVEsR0FBZSxVQUFVLENBQUM7SUFDbEMsbUJBQVMsR0FBZ0IsV0FBVyxDQUFDO0lBRXJDLGlCQUFPLEdBQWMsU0FBUyxDQUFDO0lBQy9CLHFCQUFXLEdBQWtCLGFBQWEsQ0FBQztJQUMzQyxlQUFLLEdBQVksT0FBTyxDQUFDO0lBQ3pCLGNBQUksR0FBVyxNQUFNLENBQUM7QUFDckMsQ0FBQyxFQXRCZ0IsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFzQnpCO0FBVUQ7OztHQUdHO0FBQ0gsSUFBTSxvQkFBb0IsR0FHdEI7SUFDRixNQUFNLEVBQUUsU0FBUztJQUNqQixHQUFHLEVBQUUsU0FBUztJQUNkLEdBQUcsRUFBRSxTQUFTO0lBQ2QsSUFBSSxFQUFFLFNBQVM7SUFDZixZQUFZLEVBQUUsWUFBWTtJQUMxQixJQUFJLEVBQUUsTUFBTTtJQUNaLEdBQUcsRUFBRSxNQUFNO0lBQ1gsVUFBVSxFQUFFLFlBQVk7SUFDeEIsT0FBTyxFQUFFLFNB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