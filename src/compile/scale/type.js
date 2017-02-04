"use strict";
var log = require("../../log");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var util = require("../../util");
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function type(specifiedType, type, channel, timeUnit, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (!channel_1.hasScale(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (specifiedType !== undefined) {
        // Check if explicitly specified scale type is supported by the channel
        if (channel_1.supportScaleType(channel, specifiedType)) {
            return specifiedType;
        }
        else {
            var newScaleType = defaultType(type, channel, timeUnit, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, newScaleType));
            return newScaleType;
        }
    }
    return defaultType(type, channel, timeUnit, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = type;
/**
 * Determine appropriate default scale type.
 */
function defaultType(type, channel, timeUnit, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['row', 'column'], channel)) {
        return scale_1.ScaleType.BAND;
    }
    switch (type) {
        case 'nominal':
            if (channel === 'color' || channel_1.getRangeType(channel) === 'discrete') {
                return scale_1.ScaleType.ORDINAL;
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'ordinal':
            if (channel === 'color') {
                return scale_1.ScaleType.ORDINAL;
            }
            else if (channel_1.getRangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                return scale_1.ScaleType.ORDINAL;
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'temporal':
            if (channel === 'color') {
                // Always use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.getRangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return scale_1.ScaleType.ORDINAL;
            }
            switch (timeUnit) {
                // These time unit use discrete scale by default
                case 'hours':
                case 'day':
                case 'month':
                case 'quarter':
                    return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            }
            return scale_1.ScaleType.TIME;
        case 'quantitative':
            if (channel === 'color') {
                // Always use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.getRangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return scale_1.ScaleType.ORDINAL;
            }
            return scale_1.ScaleType.LINEAR;
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(type));
}
/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['x', 'y'], channel)) {
        if (mark === 'rect') {
            // The rect mark should fit into a band.
            return scale_1.ScaleType.BAND;
        }
        if (mark === 'bar') {
            // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
            // However, for non-fit mode, point scale provides better center position.
            if (haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
                return scale_1.ScaleType.POINT;
            }
            return scale_1.ScaleType.BAND;
        }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return scale_1.ScaleType.POINT;
}
function haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (hasTopLevelSize) {
        // if topLevelSize is provided, rangeStep will be dropped.
        return false;
    }
    if (specifiedRangeStep !== undefined) {
        return specifiedRangeStep !== null;
    }
    return !!scaleConfig.rangeStep;
}
//# sourceMappingURL=type.js.map