"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var scale_1 = require("../../scale");
var timeunit_1 = require("../../timeunit");
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
            if (channel === 'color' || channel_1.rangeType(channel) === 'discrete') {
                return scale_1.ScaleType.ORDINAL;
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'ordinal':
            if (channel === 'color') {
                return scale_1.ScaleType.ORDINAL;
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
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
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return scale_1.ScaleType.ORDINAL;
            }
            if (timeunit_1.isDiscreteByDefault(timeUnit)) {
                return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            }
            return scale_1.ScaleType.TIME;
        case 'quantitative':
            if (channel === 'color') {
                // Always use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMseUNBQTZFO0FBRTdFLHFDQUFtRDtBQUNuRCwyQ0FBNkQ7QUFHN0QsaUNBQW1DO0FBSW5DOzs7R0FHRztBQUNILG9DQUFvQztBQUNwQyxjQUNFLGFBQXdCLEVBQUUsSUFBVSxFQUFFLE9BQWdCLEVBQUUsUUFBa0IsRUFBRSxJQUFVLEVBQ3RGLGVBQXdCLEVBQUUsa0JBQTBCLEVBQUUsV0FBd0I7SUFFOUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2Qix1Q0FBdUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoQyx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsMEJBQWdCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQU0sWUFBWSxHQUFHLFdBQVcsQ0FDOUIsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUM3QixlQUFlLEVBQUUsa0JBQWtCLEVBQUcsV0FBVyxDQUNsRCxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FDaEIsSUFBSSxFQUFFLE9BQU8s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