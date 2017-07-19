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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQkFBNkI7QUFDN0IsK0JBQXVDO0FBSXZDLElBQWlCLFNBQVMsQ0FzQnpCO0FBdEJELFdBQWlCLFNBQVM7SUFDeEIsNEJBQTRCO0lBQ2YsZ0JBQU0sR0FBYSxRQUFRLENBQUM7SUFDNUIsb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBQ3hDLGFBQUcsR0FBVSxLQUFLLENBQUM7SUFDbkIsYUFBRyxHQUFVLEtBQUssQ0FBQztJQUNuQixjQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ25DLG9CQUFvQjtJQUNQLGNBQUksR0FBVyxNQUFNLENBQUM7SUFDdEIsYUFBRyxHQUFXLEtBQUssQ0FBQztJQUNqQyxhQUFhO0lBQ0Esb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBRXJELGdDQUFnQztJQUNuQixrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxtQkFBUyxHQUFnQixXQUFXLENBQUM7SUFFckMsaUJBQU8sR0FBYyxTQUFTLENBQUM7SUFDL0IscUJBQVcsR0FBa0IsYUFBYSxDQUFDO0lBQzNDLGVBQUssR0FBWSxPQUFPLENBQUM7SUFDekIsY0FBSSxHQUFXLE1BQU0sQ0FBQztBQUNyQyxDQUFDLEVBdEJnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXNCekI7QUFTWSxRQUFBLFdBQVcsR0FBZ0I7SUFDdEMsNEJBQTRCO0lBQzVCLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNO0lBQzVDLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsS0FBSztJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osV0FBVztJQUNYLFNBQVMsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU07Q0FDMUMsQ0FBQztBQUVGOzs7R0FHRztBQUNILElBQU0sb0JBQW9C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