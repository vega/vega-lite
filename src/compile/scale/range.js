"use strict";
var log = require("../../log");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var util = require("../../util");
function parseRange(scale) {
    if (scale.rangeStep) {
        return { step: scale.rangeStep };
    }
    else if (scale.scheme) {
        var scheme = scale.scheme;
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
        else {
            return { scheme: scheme };
        }
    }
    return scale.range;
}
exports.parseRange = parseRange;
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
function rangeMixins(channel, scaleType, type, specifiedScale, config, zero, mark, topLevelSize, xyRangeSteps) {
    var specifiedRangeStepIsNull = false;
    // Check if any of the range properties is specified.
    // If so, check if it is compatible and make sure that we only output one of the properties
    for (var _i = 0, _a = ['range', 'rangeStep', 'scheme']; _i < _a.length; _i++) {
        var property = _a[_i];
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
                        return { range: specifiedScale[property] };
                    case 'scheme':
                        return { scheme: specifiedScale[property] };
                    case 'rangeStep':
                        if (topLevelSize === undefined) {
                            var stepSize = specifiedScale[property];
                            if (stepSize !== null) {
                                return { rangeStep: stepSize };
                            }
                            else {
                                specifiedRangeStepIsNull = true;
                            }
                        }
                        else {
                            // If top-level size is specified, we ignore specified rangeStep.
                            log.warn(log.message.rangeStepDropped(channel));
                        }
                }
            }
        }
    }
    switch (channel) {
        // TODO: revise row/column when facetSpec has top-level width/height
        case channel_1.ROW:
            return { range: 'height' };
        case channel_1.COLUMN:
            return { range: 'width' };
        case channel_1.X:
        case channel_1.Y:
            if (topLevelSize === undefined) {
                if (util.contains(['point', 'band'], scaleType) && !specifiedRangeStepIsNull) {
                    if (channel === channel_1.X && mark === 'text') {
                        if (config.scale.textXRangeStep) {
                            return { rangeStep: config.scale.textXRangeStep };
                        }
                    }
                    else {
                        if (config.scale.rangeStep) {
                            return { rangeStep: config.scale.rangeStep };
                        }
                    }
                }
                // If specified range step is null or the range step config is null.
                // Use default topLevelSize rule/config
                topLevelSize = channel === channel_1.X ? config.cell.width : config.cell.height;
            }
            return { range: channel === channel_1.X ? [0, topLevelSize] : [topLevelSize, 0] };
        case channel_1.SIZE:
            // TODO: support custom rangeMin, rangeMax
            var rangeMin = sizeRangeMin(mark, zero, config);
            var rangeMax = sizeRangeMax(mark, xyRangeSteps, config);
            return { range: [rangeMin, rangeMax] };
        case channel_1.SHAPE:
        case channel_1.COLOR:
            return { range: defaultRange(channel, scaleType, type, mark) };
        case channel_1.OPACITY:
            // TODO: support custom rangeMin, rangeMax
            return { range: [config.mark.minOpacity, config.mark.maxOpacity] };
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rangeMixins;
function defaultRange(channel, scaleType, type, mark) {
    switch (channel) {
        case channel_1.SHAPE:
            return 'symbol';
        case channel_1.COLOR:
            if (scaleType === 'ordinal') {
                // Only nominal data uses ordinal scale by default
                return type === 'nominal' ? 'category' : 'ordinal';
            }
            return mark === 'rect' ? 'heatmap' : 'ramp';
    }
}
function sizeRangeMin(mark, zero, config) {
    if (zero) {
        return 0;
    }
    switch (mark) {
        case 'bar':
            return config.bar.minBandSize !== undefined ? config.bar.minBandSize : config.bar.continuousBandSize;
        case 'tick':
            return config.tick.minBandSize;
        case 'rule':
            return config.rule.minStrokeWidth;
        case 'text':
            return config.text.minFontSize;
        case 'point':
            return config.point.minSize;
        case 'square':
            return config.square.minSize;
        case 'circle':
            return config.circle.minSize;
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
            if (config.bar.maxBandSize !== undefined) {
                return config.bar.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.mark) - 1;
        case 'tick':
            if (config.tick.maxBandSize !== undefined) {
                return config.tick.maxBandSize;
            }
            return minXYRangeStep(xyRangeSteps, config.mark) - 1;
        case 'rule':
            return config.rule.maxStrokeWidth;
        case 'text':
            return config.text.maxFontSize;
        case 'point':
        case 'square':
        case 'circle':
            if (config[mark].maxSize) {
                return config[mark].maxSize;
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