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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUVqQyx5Q0FBc0Y7QUFHdEYscUNBQTBKO0FBRTFKLGlDQUFtQztBQUtuQyxvQkFBMkIsS0FBWTtJQUNyQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBQyxDQUFDO0lBQ2pDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyx3QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLEdBQWtCLEVBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3pCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzNCLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFD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