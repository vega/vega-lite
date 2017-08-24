"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var channel_1 = require("../../channel");
var log = require("../../log");
var scale_1 = require("../../scale");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
var split_1 = require("../split");
var properties_1 = require("./properties");
exports.RANGE_PROPERTIES = ['range', 'rangeStep', 'scheme'];
function parseScaleRange(model) {
    if (model_1.isUnitModel(model)) {
        parseUnitScaleRange(model);
    }
    else {
        properties_1.parseNonUnitScaleProperty(model, 'range');
    }
}
exports.parseScaleRange = parseScaleRange;
function parseUnitScaleRange(model) {
    var localScaleComponents = model.component.scales;
    // use SCALE_CHANNELS instead of scales[channel] to ensure that x, y come first!
    channel_1.SCALE_CHANNELS.forEach(function (channel) {
        var localScaleCmpt = localScaleComponents[channel];
        if (!localScaleCmpt) {
            return;
        }
        var specifiedScale = model.specifiedScales[channel];
        var fieldDef = model.fieldDef(channel);
        // Read if there is a specified width/height
        var sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
        var specifiedSize = sizeType ? model.component.layoutSize.get(sizeType) : undefined;
        var xyRangeSteps = getXYRangeStep(model);
        var rangeWithExplicit = parseRangeForChannel(channel, localScaleCmpt.get('type'), fieldDef.type, specifiedScale, model.config, localScaleCmpt.get('zero'), model.mark(), specifiedSize, model.getName(sizeType), xyRangeSteps);
        localScaleCmpt.setWithExplicit('range', rangeWithExplicit);
    });
}
function getXYRangeStep(model) {
    var xyRangeSteps = [];
    var xScale = model.getScaleComponent('x');
    var xRange = xScale && xScale.get('range');
    if (xRange && vega_schema_1.isVgRangeStep(xRange) && vega_util_1.isNumber(xRange.step)) {
        xyRangeSteps.push(xRange.step);
    }
    var yScale = model.getScaleComponent('y');
    var yRange = yScale && yScale.get('range');
    if (yRange && vega_schema_1.isVgRangeStep(yRange) && vega_util_1.isNumber(yRange.step)) {
        xyRangeSteps.push(yRange.step);
    }
    return xyRangeSteps;
}
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
function parseRangeForChannel(channel, scaleType, type, specifiedScale, config, zero, mark, specifiedSize, sizeSignal, xyRangeSteps) {
    var noRangeStep = !!specifiedSize || specifiedScale.rangeStep === null;
    // Check if any of the range properties is specified.
    // If so, check if it is compatible and make sure that we only output one of the properties
    for (var _i = 0, RANGE_PROPERTIES_1 = exports.RANGE_PROPERTIES; _i < RANGE_PROPERTIES_1.length; _i++) {
        var property = RANGE_PROPERTIES_1[_i];
        if (specifiedScale[property] !== undefined) {
            var supportedByScaleType = scale_1.scaleTypeSupportProperty(scaleType, property);
            var channelIncompatability = scale_1.channelScalePropertyIncompatability(channel, property);
            if (!supportedByScaleType) {
                log.warn(log.message.scalePropertyNotWorkWithScaleType(scaleType, property, channel));
            }
            else if (channelIncompatability) {
                log.warn(channelIncompatability);
            }
            else {
                switch (property) {
                    case 'range':
                        return split_1.makeImplicit(specifiedScale[property]);
                    case 'scheme':
                        return split_1.makeImplicit(parseScheme(specifiedScale[property]));
                    case 'rangeStep':
                        var rangeStep = specifiedScale[property];
                        if (rangeStep !== null) {
                            if (specifiedSize === undefined) {
                                return split_1.makeImplicit({ step: rangeStep });
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
    return {
        explicit: false,
        value: defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep)
    };
}
exports.parseRangeForChannel = parseRangeForChannel;
function parseScheme(scheme) {
    if (scale_1.isExtendedScheme(scheme)) {
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
function defaultRange(channel, scaleType, type, config, zero, mark, sizeSignal, xyRangeSteps, noRangeStep) {
    switch (channel) {
        case channel_1.X:
        case channel_1.Y:
            if (util.contains(['point', 'band'], scaleType) && !noRangeStep) {
                if (channel === channel_1.X && mark === 'text') {
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
            // If range step is null, assign temporary range signals,
            // which will be later replaced with proper signals in assemble.
            // We cannot set the right size signal here since parseLayoutSize() happens after parseScale().
            return channel === channel_1.X ? [0, { signal: sizeSignal }] : [{ signal: sizeSignal }, 0];
        case channel_1.SIZE:
            // TODO: support custom rangeMin, rangeMax
            var rangeMin = sizeRangeMin(mark, zero, config);
            var rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
            return [rangeMin, rangeMax];
        case channel_1.SHAPE:
            return 'symbol';
        case channel_1.COLOR:
            if (scaleType === 'ordinal') {
                // Only nominal data uses ordinal scale by default
                return type === 'nominal' ? 'category' : 'ordinal';
            }
            return mark === 'rect' ? 'heatmap' : 'ramp';
        case channel_1.OPACITY:
            // TODO: support custom rangeMin, rangeMax
            return [config.scale.minOpacity, config.scale.maxOpacity];
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
exports.defaultRange = defaultRange;
function sizeRangeMin(mark, zero, config) {
    if (zero) {
        return 0;
    }
    switch (mark) {
        case 'bar':
        case 'tick':
            return config.scale.minBandSize;
        case 'line':
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
    // TODO(#1168): make max size scale based on rangeStep / overall plot size
    switch (mark) {
        case 'bar':
        case 'tick':
            if (config.scale.maxBandSize !== undefined) {
                return config.scale.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.scale) - 1;
        case 'line':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUNuQyx5Q0FBdUc7QUFFdkcsK0JBQWlDO0FBRWpDLHFDQUEwSjtBQUUxSixpQ0FBbUM7QUFDbkMsaURBQW1FO0FBRW5FLGtDQUE0QztBQUM1QyxrQ0FBZ0Q7QUFHaEQsMkNBQXVEO0FBSzFDLFFBQUEsZ0JBQWdCLEdBQW9CLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUdsRix5QkFBZ0MsS0FBWTtJQUMxQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixzQ0FBeUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQztBQUNILENBQUM7QUFORCwwQ0FNQztBQUVELDZCQUE2QixLQUFnQjtJQUMzQyxJQUFPLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUUxRSxnRkFBZ0Y7SUFDaEYsd0JBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFxQjtRQUMzQyxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6Qyw0Q0FBNEM7UUFDNUMsSUFBTSxRQUFR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