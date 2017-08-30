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