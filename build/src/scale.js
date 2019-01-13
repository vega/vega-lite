import * as tslib_1 from "tslib";
import { toSet } from 'vega-util';
import { Channel, CHANNELS, isColorChannel } from './channel';
import * as log from './log';
import { Type, TYPE_INDEX } from './type';
import { contains, flagKeys, keys } from './util';
export var ScaleType;
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
})(ScaleType || (ScaleType = {}));
/**
 * Index for scale categories -- only scale of the same categories can be merged together.
 * Current implementation is trying to be conservative and avoid merging scale type that might not work together
 */
const SCALE_CATEGORY_INDEX = {
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
    band: 'ordinal-position',
    quantile: 'discretizing',
    quantize: 'discretizing',
    threshold: 'discretizing'
};
export const SCALE_TYPES = keys(SCALE_CATEGORY_INDEX);
/**
 * Whether the two given scale types can be merged together.
 */
export function scaleCompatible(scaleType1, scaleType2) {
    const scaleCategory1 = SCALE_CATEGORY_INDEX[scaleType1];
    const scaleCategory2 = SCALE_CATEGORY_INDEX[scaleType2];
    return (scaleCategory1 === scaleCategory2 ||
        (scaleCategory1 === 'ordinal-position' && scaleCategory2 === 'time') ||
        (scaleCategory2 === 'ordinal-position' && scaleCategory1 === 'time'));
}
/**
 * Index for scale precedence -- high score = higher priority for merging.
 */
const SCALE_PRECEDENCE_INDEX = {
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
    quantile: 0,
    quantize: 0,
    threshold: 0
};
/**
 * Return scale categories -- only scale of the same categories can be merged together.
 */
export function scaleTypePrecedence(scaleType) {
    return SCALE_PRECEDENCE_INDEX[scaleType];
}
export const CONTINUOUS_TO_CONTINUOUS_SCALES = [
    'linear',
    'bin-linear',
    'log',
    'pow',
    'sqrt',
    'time',
    'utc'
];
const CONTINUOUS_TO_CONTINUOUS_INDEX = toSet(CONTINUOUS_TO_CONTINUOUS_SCALES);
export const CONTINUOUS_TO_DISCRETE_SCALES = ['quantile', 'quantize', 'threshold'];
const CONTINUOUS_TO_DISCRETE_INDEX = toSet(CONTINUOUS_TO_DISCRETE_SCALES);
export const CONTINUOUS_DOMAIN_SCALES = CONTINUOUS_TO_CONTINUOUS_SCALES.concat([
    'sequential',
    'quantile',
    'quantize',
    'threshold'
]);
const CONTINUOUS_DOMAIN_INDEX = toSet(CONTINUOUS_DOMAIN_SCALES);
export const DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
const DISCRETE_DOMAIN_INDEX = toSet(DISCRETE_DOMAIN_SCALES);
const BIN_SCALES_INDEX = toSet(['bin-linear', 'bin-ordinal']);
export const TIME_SCALE_TYPES = ['time', 'utc'];
export function hasDiscreteDomain(type) {
    return type in DISCRETE_DOMAIN_INDEX;
}
export function isBinScale(type) {
    return type in BIN_SCALES_INDEX;
}
export function hasContinuousDomain(type) {
    return type in CONTINUOUS_DOMAIN_INDEX;
}
export function isContinuousToContinuous(type) {
    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
}
export function isContinuousToDiscrete(type) {
    return type in CONTINUOUS_TO_DISCRETE_INDEX;
}
export const defaultScaleConfig = {
    textXRangeStep: 90,
    rangeStep: 20,
    pointPadding: 0.5,
    barBandPaddingInner: 0.1,
    rectBandPaddingInner: 0,
    facetSpacing: 16,
    minBandSize: 2,
    minFontSize: 8,
    maxFontSize: 40,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    minStrokeWidth: 1,
    maxStrokeWidth: 4,
    quantileCount: 4,
    quantizeCount: 4
};
export function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
export function isSelectionDomain(domain) {
    return domain && domain['selection'];
}
const SCALE_PROPERTY_INDEX = {
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
export const SCALE_PROPERTIES = flagKeys(SCALE_PROPERTY_INDEX);
const { type, domain, range, rangeStep, scheme } = SCALE_PROPERTY_INDEX, NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX = tslib_1.__rest(SCALE_PROPERTY_INDEX, ["type", "domain", "range", "rangeStep", "scheme"]);
export const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES = flagKeys(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTY_INDEX);
export const SCALE_TYPE_INDEX = generateScaleTypeIndex();
export function scaleTypeSupportProperty(scaleType, propName) {
    switch (propName) {
        case 'type':
        case 'domain':
        case 'reverse':
        case 'range':
            return true;
        case 'scheme':
            return contains(['sequential', 'ordinal', 'bin-ordinal', 'quantile', 'quantize', 'threshold'], scaleType);
        case 'interpolate':
            return contains(['linear', 'bin-linear', 'pow', 'log', 'sqrt', 'utc', 'time'], scaleType);
        case 'round':
            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
        case 'padding':
            return isContinuousToContinuous(scaleType) || contains(['point', 'band'], scaleType);
        case 'paddingOuter':
        case 'rangeStep':
            return contains(['point', 'band'], scaleType);
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
            return (hasContinuousDomain(scaleType) &&
                !contains([
                    'log',
                    'time',
                    'utc',
                    'bin-linear',
                    'threshold',
                    'quantile' // quantile depends on distribution so zero does not matter
                ], scaleType));
    }
    /* istanbul ignore next: should never reach here*/
    throw new Error(`Invalid scale property ${propName}.`);
}
/**
 * Returns undefined if the input channel supports the input scale property name
 */
export function channelScalePropertyIncompatability(channel, propName) {
    switch (propName) {
        case 'interpolate':
        case 'scheme':
            if (!isColorChannel(channel)) {
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
    throw new Error(`Invalid scale property "${propName}".`);
}
export function scaleTypeSupportDataType(specifiedType, fieldDefType, bin) {
    if (contains([Type.ORDINAL, Type.NOMINAL], fieldDefType)) {
        return specifiedType === undefined || hasDiscreteDomain(specifiedType);
    }
    else if (fieldDefType === Type.TEMPORAL) {
        return contains([ScaleType.TIME, ScaleType.UTC, ScaleType.SEQUENTIAL, undefined], specifiedType);
    }
    else if (fieldDefType === Type.QUANTITATIVE) {
        if (bin) {
            return contains([ScaleType.BIN_LINEAR, ScaleType.BIN_ORDINAL, ScaleType.LINEAR], specifiedType);
        }
        return contains([
            ScaleType.LOG,
            ScaleType.POW,
            ScaleType.SQRT,
            ScaleType.QUANTILE,
            ScaleType.QUANTIZE,
            ScaleType.THRESHOLD,
            ScaleType.LINEAR,
            ScaleType.SEQUENTIAL,
            undefined
        ], specifiedType);
    }
    return true;
}
export function channelSupportScaleType(channel, scaleType) {
    switch (channel) {
        case Channel.X:
        case Channel.Y:
            return isContinuousToContinuous(scaleType) || contains(['band', 'point'], scaleType);
        case Channel.SIZE: // TODO: size and opacity can support ordinal with more modification
        case Channel.STROKEWIDTH:
        case Channel.OPACITY:
        case Channel.FILLOPACITY:
        case Channel.STROKEOPACITY:
            // Although it generally doesn't make sense to use band with size and opacity,
            // it can also work since we use band: 0.5 to get midpoint.
            return (isContinuousToContinuous(scaleType) ||
                isContinuousToDiscrete(scaleType) ||
                contains(['band', 'point'], scaleType));
        case Channel.COLOR:
        case Channel.FILL:
        case Channel.STROKE:
            return scaleType !== 'band'; // band does not make sense with color
        case Channel.SHAPE:
            return scaleType === 'ordinal'; // shape = lookup only
    }
    /* istanbul ignore next: it should never reach here */
    return false;
}
export function getSupportedScaleType(channel, fieldDefType, bin) {
    return SCALE_TYPE_INDEX[generateScaleTypeIndexKey(channel, fieldDefType, bin)];
}
// generates ScaleTypeIndex where keys are encoding channels and values are list of valid ScaleTypes
function generateScaleTypeIndex() {
    const index = {};
    for (const channel of CHANNELS) {
        for (const fieldDefType of keys(TYPE_INDEX)) {
            for (const scaleType of SCALE_TYPES) {
                for (const bin of [false, true]) {
                    const key = generateScaleTypeIndexKey(channel, fieldDefType, bin);
                    if (channelSupportScaleType(channel, scaleType) && scaleTypeSupportDataType(scaleType, fieldDefType, bin)) {
                        index[key] = index[key] || [];
                        index[key].push(scaleType);
                    }
                }
            }
        }
    }
    return index;
}
function generateScaleTypeIndexKey(channel, fieldDefType, bin) {
    const key = channel + '_' + fieldDefType;
    return bin ? key + '_bin' : key;
}
//# sourceMappingURL=scale.js.map