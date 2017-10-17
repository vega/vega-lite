"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
/**
 * Whether the two given scale types can be merged together.
 */
function scaleCompatible(scaleType1, scaleType2) {
    var scaleCategory1 = SCALE_CATEGORY_INDEX[scaleType1];
    var scaleCategory2 = SCALE_CATEGORY_INDEX[scaleType2];
    return scaleCategory1 === scaleCategory2 ||
        (scaleCategory1 === 'ordinal-position' && scaleCategory2 === 'time') ||
        (scaleCategory2 === 'ordinal-position' && scaleCategory1 === 'time');
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
    // ordinal-position -- these have higher precedence than continuous scales as they support more types of data
    point: 10,
    band: 11,
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
var SCALE_PROPERTY_INDEX = {
    type: 1,
    domain: 1,
    range: 1,
    rangeStep: 1,
    scheme: 1,
    // Other properties
    reverse: 1,
    round: 1,
    // quantitative / time
    clamp: 1,
    nice: 1,
    // quantitative
    base: 1,
    exponent: 1,
    interpolate: 1,
    zero: 1,
    // band/point
    padding: 1,
    paddingInner: 1,
    paddingOuter: 1
};
exports.SCALE_PROPERTIES = util_1.flagKeys(SCALE_PROPERTY_INDEX);
var type = SCALE_PROPERTY_INDEX.type, domain = SCALE_PROPERTY_INDEX.domain, range = SCALE_PROPERTY_INDEX.range, rangeStep = SCALE_PROPERTY_INDEX.rangeStep, scheme = SCALE_PROPERTY_INDEX.scheme, NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX = tslib_1.__rest(SCALE_PROPERTY_INDEX, ["type", "domain", "range", "rangeStep", "scheme"]);
exports.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = util_1.flagKeys(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX);
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
        case 'padding':
            return isContinuousToContinuous(scaleType) || util_1.contains(['point', 'band'], scaleType);
        case 'paddingOuter':
        case 'rangeStep':
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
        case 'interpolate':
        case 'scheme':
            if (channel !== 'color') {
                return log.message.cannotUseScalePropertyWithNonColor(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'range':
        case 'base':
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
    throw new Error("Invalid scale property \"" + propName + "\".");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NhbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWtDO0FBR2xDLDJCQUE2QjtBQUM3QiwrQkFBNkQ7QUFFN0QsSUFBaUIsU0FBUyxDQXNCekI7QUF0QkQsV0FBaUIsU0FBUztJQUN4Qiw0QkFBNEI7SUFDZixnQkFBTSxHQUFhLFFBQVEsQ0FBQztJQUM1QixvQkFBVSxHQUFpQixZQUFZLENBQUM7SUFDeEMsYUFBRyxHQUFVLEtBQUssQ0FBQztJQUNuQixhQUFHLEdBQVUsS0FBSyxDQUFDO0lBQ25CLGNBQUksR0FBVyxNQUFNLENBQUM7SUFDbkMsb0JBQW9CO0lBQ1AsY0FBSSxHQUFXLE1BQU0sQ0FBQztJQUN0QixhQUFHLEdBQVcsS0FBSyxDQUFDO0lBQ2pDLGFBQWE7SUFDQSxvQkFBVSxHQUFpQixZQUFZLENBQUM7SUFFckQsZ0NBQWdDO0lBQ25CLGtCQUFRLEdBQWUsVUFBVSxDQUFDO0lBQ2xDLGtCQUFRLEdBQWUsVUFBVSxDQUFDO0lBQ2xDLG1CQUFTLEdBQWdCLFdBQVcsQ0FBQztJQUVyQyxpQkFBTyxHQUFjLFNBQVMsQ0FBQztJQUMvQixxQkFBVyxHQUFrQixhQUFhLENBQUM7SUFDM0MsZUFBSyxHQUFZLE9BQU8sQ0FBQztJQUN6QixjQUFJLEdBQVcsTUFBTSxDQUFDO0FBQ3JDLENBQUMsRUF0QmdCLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBc0J6QjtBQVVEOzs7R0FHRztBQUNILElBQU0sb0JBQW9CLEdBR3RCO0lBQ0YsTUFBTSxFQUFFLFNBQVM7SUFDakIsR0FBRyxFQUFFLFNBQVM7SUFDZCxHQUFHLEVBQUUsU0FBUztJQUNkLElBQUksRUFBRSxTQUFTO0lBQ2YsWUFBWSxFQUFFLFlBQVk7SUFDMUIsSUFBSSxFQUFFLE1BQU07SUFDWixHQUFHLEVBQUUsTUFBTTtJQUNYLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLE9BQU8sRUFBRSxT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