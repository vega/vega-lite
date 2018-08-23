import * as tslib_1 from "tslib";
import { isArray, isNumber } from 'vega-util';
import { COLOR, FILL, OPACITY, SCALE_CHANNELS, SHAPE, SIZE, STROKE, X, Y } from '../../channel';
import { isVgScheme } from '../../config';
import * as log from '../../log';
import { channelScalePropertyIncompatability, hasContinuousDomain, isContinuousToContinuous, isContinuousToDiscrete, isExtendedScheme, scaleTypeSupportProperty } from '../../scale';
import * as util from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { isUnitModel } from '../model';
import { makeExplicit, makeImplicit } from '../split';
import { parseNonUnitScaleProperty } from './properties';
export var RANGE_PROPERTIES = ['range', 'rangeStep', 'scheme'];
export function parseScaleRange(model) {
    if (isUnitModel(model)) {
        parseUnitScaleRange(model);
    }
    else {
        parseNonUnitScaleProperty(model, 'range');
    }
}
function parseUnitScaleRange(model) {
    var localScaleComponents = model.component.scales;
    // use SCALE_CHANNELS instead of scales[channel] to ensure that x, y come first!
    SCALE_CHANNELS.forEach(function (channel) {
        var localScaleCmpt = localScaleComponents[channel];
        if (!localScaleCmpt) {
            return;
        }
        var mergedScaleCmpt = model.getScaleComponent(channel);
        var specifiedScale = model.specifiedScales[channel];
        var fieldDef = model.fieldDef(channel);
        // Read if there is a specified width/height
        var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
        var sizeSpecified = sizeType ? !!model.component.layoutSize.get(sizeType) : undefined;
        var scaleType = mergedScaleCmpt.get('type');
        // if autosize is fit, size cannot be data driven
        var rangeStep = util.contains(['point', 'band'], scaleType) || !!specifiedScale.rangeStep;
        if (sizeType && model.fit && !sizeSpecified && rangeStep) {
            log.warn(log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
            sizeSpecified = true;
        }
        var xyRangeSteps = getXYRangeStep(model);
        var rangeWithExplicit = parseRangeForChannel(channel, scaleType, fieldDef.type, specifiedScale, model.config, localScaleCmpt.get('zero'), model.mark, sizeSpecified, model.getName(sizeType), xyRangeSteps);
        localScaleCmpt.setWithExplicit('range', rangeWithExplicit);
    });
}
function getXYRangeStep(model) {
    var xyRangeSteps = [];
    var xScale = model.getScaleComponent('x');
    var xRange = xScale && xScale.get('range');
    if (xRange && isVgRangeStep(xRange) && isNumber(xRange.step)) {
        xyRangeSteps.push(xRange.step);
    }
    var yScale = model.getScaleComponent('y');
    var yRange = yScale && yScale.get('range');
    if (yRange && isVgRangeStep(yRange) && isNumber(yRange.step)) {
        xyRangeSteps.push(yRange.step);
    }
    return xyRangeSteps;
}
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
export function parseRangeForChannel(channel, scaleType, type, specifiedScale, config, zero, mark, sizeSpecified, sizeSignal, xyRangeSteps) {
    var noRangeStep = sizeSpecified || specifiedScale.rangeStep === null;
    // Check if any of the range properties is specified.
    // If so, check if it is compatible and make sure that we only output one of the properties
    for (var _i = 0, RANGE_PROPERTIES_1 = RANGE_PROPERTIES; _i < RANGE_PROPERTIES_1.length; _i++) {
        var property = RANGE_PROPERTIES_1[_i];
        if (specifiedScale[property] !== undefined) {
            var supportedByScaleType = scaleTypeSupportProperty(scaleType, property);
            var channelIncompatability = channelScalePropertyIncompatability(channel, property);
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
            }
            else if (channelIncompatability) {
                // channel
                log.warn(channelIncompatability);
            }
            else {
                switch (property) {
                    case 'range':
                        return makeExplicit(specifiedScale[property]);
                    case 'scheme':
                        return makeExplicit(parseScheme(specifiedScale[property]));
                    case 'rangeStep':
                        var rangeStep = specifiedScale[property];
                        if (rangeStep !== null) {
                            if (!sizeSpecified) {
                                return makeExplicit({ step: rangeStep });
                            }
                            else {
                                // If top-level size is specified, we ignore specified rangeStep.
                                log.warn(log.message.rangeStepDropped(channel));
                            }
                        }
                }
            }
        }
    }
    return makeImplicit(defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep, specifiedScale.domain));
}
function parseScheme(scheme) {
    if (isExtendedScheme(scheme)) {
        var r = { scheme: scheme.name };
        if (scheme.count) {
            r.count = scheme.count;
        }
        if (scheme.extent) {
            r.extent = scheme.extent;
        }
        return r;
    }
    return { scheme: scheme };
}
export function defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep, domain) {
    switch (channel) {
        case X:
        case Y:
            if (util.contains(['point', 'band'], scaleType) && !noRangeStep) {
                if (channel === X && mark === 'text') {
                    if (config.scale.textXRangeStep) {
                        return { step: config.scale.textXRangeStep };
                    }
                }
                else {
                    if (config.scale.rangeStep) {
                        return { step: config.scale.rangeStep };
                    }
                }
            }
            // If range step is null, use zero to width or height.
            // Note that these range signals are temporary
            // as they can be merged and renamed.
            // (We do not have the right size signal here since parseLayoutSize() happens after parseScale().)
            // We will later replace these temporary names with
            // the final name in assembleScaleRange()
            if (channel === Y && hasContinuousDomain(scaleType)) {
                // For y continuous scale, we have to start from the height as the bottom part has the max value.
                return [{ signal: sizeSignal }, 0];
            }
            else {
                return [0, { signal: sizeSignal }];
            }
        case SIZE:
            // TODO: support custom rangeMin, rangeMax
            var rangeMin = sizeRangeMin(mark, zero, config);
            var rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
            if (isContinuousToDiscrete(scaleType)) {
                return interpolateRange(rangeMin, rangeMax, defaultContinuousToDiscreteCount(scaleType, config, domain, channel));
            }
            else {
                return [rangeMin, rangeMax];
            }
        case SHAPE:
            return 'symbol';
        case COLOR:
        case FILL:
        case STROKE:
            if (scaleType === 'ordinal') {
                // Only nominal data uses ordinal scale by default
                return type === 'nominal' ? 'category' : 'ordinal';
            }
            else if (isContinuousToDiscrete(scaleType)) {
                var count = defaultContinuousToDiscreteCount(scaleType, config, domain, channel);
                if (config.range && isVgScheme(config.range.ordinal)) {
                    return tslib_1.__assign({}, config.range.ordinal, { count: count });
                }
                else {
                    return { scheme: 'blues', count: count };
                }
            }
            else if (isContinuousToContinuous(scaleType)) {
                // Manually set colors for now. We will revise this after https://github.com/vega/vega/issues/1369
                return ['#f7fbff', '#0e427f'];
            }
            else {
                return mark === 'rect' || mark === 'geoshape' ? 'heatmap' : 'ramp';
            }
        case OPACITY:
            // TODO: support custom rangeMin, rangeMax
            return [config.scale.minOpacity, config.scale.maxOpacity];
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
export function defaultContinuousToDiscreteCount(scaleType, config, domain, channel) {
    switch (scaleType) {
        case 'quantile':
            return config.scale.quantileCount;
        case 'quantize':
            return config.scale.quantizeCount;
        case 'threshold':
            if (domain !== undefined && isArray(domain)) {
                return domain.length + 1;
            }
            else {
                log.warn(log.message.domainRequiredForThresholdScale(channel));
                // default threshold boundaries for threshold scale since domain has cardinality of 2
                return 3;
            }
    }
}
/**
 * Returns the linear interpolation of the range according to the cardinality
 *
 * @param rangeMin start of the range
 * @param rangeMax end of the range
 * @param cardinality number of values in the output range
 */
export function interpolateRange(rangeMin, rangeMax, cardinality) {
    var ranges = [];
    var step = (rangeMax - rangeMin) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        ranges.push(rangeMin + i * step);
    }
    return ranges;
}
function sizeRangeMin(mark, zero, config) {
    if (zero) {
        return 0;
    }
    switch (mark) {
        case 'bar':
        case 'tick':
            return config.scale.minBandSize;
        case 'line':
        case 'trail':
        case 'rule':
            return config.scale.minStrokeWidth;
        case 'text':
            return config.scale.minFontSize;
        case 'point':
        case 'square':
        case 'circle':
            return config.scale.minSize;
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMin not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
function sizeRangeMax(mark, xyRangeSteps, config) {
    var scaleConfig = config.scale;
    switch (mark) {
        case 'bar':
        case 'tick':
            if (config.scale.maxBandSize !== undefined) {
                return config.scale.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.scale) - 1;
        case 'line':
        case 'trail':
        case 'rule':
            return config.scale.maxStrokeWidth;
        case 'text':
            return config.scale.maxFontSize;
        case 'point':
        case 'square':
        case 'circle':
            if (config.scale.maxSize) {
                return config.scale.maxSize;
            }
            // FIXME this case totally should be refactored
            var pointStep = minXYRangeStep(xyRangeSteps, scaleConfig);
            return (pointStep - 2) * (pointStep - 2);
    }
    /* istanbul ignore next: should never reach here */
    // sizeRangeMax not implemented for the mark
    throw new Error(log.message.incompatibleChannel('size', mark));
}
/**
 * @returns {number} Range step of x or y or minimum between the two if both are ordinal scale.
 */
function minXYRangeStep(xyRangeSteps, scaleConfig) {
    if (xyRangeSteps.length > 0) {
        return Math.min.apply(null, xyRangeSteps);
    }
    if (scaleConfig.rangeStep) {
        return scaleConfig.rangeStep;
    }
    return 21; // FIXME: re-evaluate the default value here.
}
//# sourceMappingURL=range.js.map