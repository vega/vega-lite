"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var timeunit_1 = require("../../timeunit");
var util = require("../../util");
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function type(specifiedType, channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    var defaultScaleType = defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
    if (!channel_1.hasScale(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (specifiedType !== undefined) {
        // for binned fields we don't allow overriding the default scale
        if (fieldDef.bin) {
            // TODO: generalize this as a method in fieldDef that determines scale type support for a fieldDef (looking at functions and type)
            log.warn(log.message.cannotOverrideBinScaleType(channel, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the channel
        if (channel_1.supportScaleType(channel, specifiedType)) {
            return specifiedType;
        }
        else {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
            return defaultScaleType;
        }
    }
    return defaultScaleType;
}
exports.default = type;
/**
 * Determine appropriate default scale type.
 */
function defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['row', 'column'], channel)) {
        return 'band';
    }
    switch (fieldDef.type) {
        case 'nominal':
            if (channel === 'color' || channel_1.rangeType(channel) === 'discrete') {
                return 'ordinal';
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'ordinal':
            if (channel === 'color') {
                return 'ordinal';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                return 'ordinal';
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
                return 'ordinal';
            }
            if (timeunit_1.isDiscreteByDefault(fieldDef.timeUnit)) {
                return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            }
            return 'time';
        case 'quantitative':
            if (channel === 'color') {
                if (fieldDef.bin) {
                    return 'bin-ordinal';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            if (fieldDef.bin) {
                return 'bin-linear';
            }
            return 'linear';
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['x', 'y'], channel)) {
        if (mark === 'rect') {
            // The rect mark should fit into a band.
            return 'band';
        }
        if (mark === 'bar') {
            // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
            // However, for non-fit mode, point scale provides better center position.
            if (haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
                return 'point';
            }
            return 'band';
        }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return 'point';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBaUM7QUFFakMseUNBQTZFO0FBRzdFLDJDQUFtRDtBQUduRCxpQ0FBbUM7QUFJbkM7OztHQUdHO0FBQ0gsb0NBQW9DO0FBQ3BDLGNBQ0UsYUFBd0IsRUFBRSxPQUFnQixFQUFFLFFBQWtCLEVBQUUsSUFBVSxFQUMxRSxlQUF3QixFQUFFLGtCQUEwQixFQUFFLFdBQXdCO0lBRTlFLElBQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVoSCxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLHVDQUF1QztRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGdFQUFnRTtRQUNoRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqQixrSUFBa0k7WUFDbEksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsMEJBQWdCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FB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