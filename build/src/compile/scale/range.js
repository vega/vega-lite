"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.RANGE_PROPERTIES = ['range', 'rangeStep', 'scheme'];
/**
 * Return mixins that includes one of the range properties (range, rangeStep, scheme).
 */
function rangeMixins(channel, scaleType, type, specifiedScale, config, zero, mark, topLevelSize, xyRangeSteps) {
    var specifiedRangeStepIsNull = false;
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
            return { range: [config.scale.minOpacity, config.scale.maxOpacity] };
    }
    /* istanbul ignore next: should never reach here */
    throw new Error("Scale range undefined for channel " + channel);
}
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
            return config.scale.minBandSize !== undefined ? config.scale.minBandSize : config.bar.continuousBandSize;
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
            if (config.scale.minSize) {
                return config.scale.minSize;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUVqQyx5Q0FBc0Y7QUFHdEYscUNBQTBKO0FBRTFKLGlDQUFtQztBQUtuQyxvQkFBMkIsS0FBWTtJQUNyQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBQyxDQUFDO0lBQ2pDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyx3QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxDQUFDLEdBQWtCLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzNCLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFD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