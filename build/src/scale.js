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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwyQkFBNkI7QUFDN0IsK0JBQXVDO0FBSXZDLElBQWlCLFNBQVMsQ0FzQnpCO0FBdEJELFdBQWlCLFNBQVM7SUFDeEIsNEJBQTRCO0lBQ2YsZ0JBQU0sR0FBYSxRQUFRLENBQUM7SUFDNUIsb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBQ3hDLGFBQUcsR0FBVSxLQUFLLENBQUM7SUFDbkIsYUFBRyxHQUFVLEtBQUssQ0FBQztJQUNuQixjQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ25DLG9CQUFvQjtJQUNQLGNBQUksR0FBVyxNQUFNLENBQUM7SUFDdEIsYUFBRyxHQUFXLEtBQUssQ0FBQztJQUNqQyxhQUFhO0lBQ0Esb0JBQVUsR0FBaUIsWUFBWSxDQUFDO0lBRXJELGdDQUFnQztJQUNuQixrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxrQkFBUSxHQUFlLFVBQVUsQ0FBQztJQUNsQyxtQkFBUyxHQUFnQixXQUFXLENBQUM7SUFFckMsaUJBQU8sR0FBYyxTQUFTLENBQUM7SUFDL0IscUJBQVcsR0FBa0IsYUFBYSxDQUFDO0lBQzNDLGVBQUssR0FBWSxPQUFPLENBQUM7SUFDekIsY0FBSSxHQUFXLE1BQU0sQ0FBQztBQUNyQyxDQUFDLEVBdEJnQixTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQXNCekI7QUFTWSxRQUFBLFdBQVcsR0FBZ0I7SUFDdEMsNEJBQTRCO0lBQzVCLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNO0lBQzVDLG9CQUFvQjtJQUNwQixNQUFNLEVBQUUsS0FBSztJQUNiLGFBQWE7SUFDYixZQUFZO0lBQ1osV0FBVztJQUNYLFNBQVMsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU07Q0FDMUMsQ0FBQztBQUVGOzs7R0FHRztBQUNILElBQU0sb0JBQW9C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