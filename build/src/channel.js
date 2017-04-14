/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("./scale");
var util_1 = require("./util");
var Channel;
(function (Channel) {
    // Facet
    Channel.ROW = 'row';
    Channel.COLUMN = 'column';
    // Position
    Channel.X = 'x';
    Channel.Y = 'y';
    Channel.X2 = 'x2';
    Channel.Y2 = 'y2';
    // Mark property with scale
    Channel.COLOR = 'color';
    Channel.SHAPE = 'shape';
    Channel.SIZE = 'size';
    Channel.OPACITY = 'opacity';
    // Non-scale channel
    Channel.TEXT = 'text';
    Channel.ORDER = 'order';
    Channel.DETAIL = 'detail';
})(Channel = exports.Channel || (exports.Channel = {}));
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.X2 = Channel.X2;
exports.Y2 = Channel.Y2;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// CHANNELS without COLUMN, ROW
exports.UNIT_CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT
exports.UNIT_SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
// UNIT_SCALE_CHANNELS with ROW, COLUMN
exports.SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY, exports.ROW, exports.COLUMN];
// UNIT_CHANNELS without X, Y, X2, Y2;
exports.NONSPATIAL_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_SCALE_CHANNELS without X, Y;
exports.NONSPATIAL_SCALE_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
exports.LEVEL_OF_DETAIL_CHANNELS = util_1.without(exports.NONSPATIAL_CHANNELS, ['order']);
/** Channels that can serve as groupings for stacked charts. */
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
function supportMark(channel, mark) {
    return mark in getSupportedMark(channel);
}
exports.supportMark = supportMark;
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER: // TODO: revise (order might not support rect, which is not stackable?)
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, rect: true, line: true, area: true, text: true
            };
        case exports.X2:
        case exports.Y2:
            return {
                rule: true, bar: true, rect: true, area: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true, line: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.TEXT, exports.ORDER], channel);
}
exports.hasScale = hasScale;
// Position does not work with ordinal (lookup) scale and sequential (which is only for color)
var POSITION_SCALE_TYPE_INDEX = util_1.toSet(util_1.without(scale_1.SCALE_TYPES, ['ordinal', 'sequential']));
function supportScaleType(channel, scaleType) {
    switch (channel) {
        case exports.ROW:
        case exports.COLUMN:
            return scaleType === 'band'; // row / column currently supports band only
        case exports.X:
        case exports.Y:
        case exports.SIZE: // TODO: size and opacity can support ordinal with more modification
        case exports.OPACITY:
            // Although it generally doesn't make sense to use band with size and opacity,
            // it can also work since we use band: 0.5 to get midpoint.
            return scaleType in POSITION_SCALE_TYPE_INDEX;
        case exports.COLOR:
            return scaleType !== 'band'; // band does not make sense with color
        case exports.SHAPE:
            return scaleType === 'ordinal'; // shape = lookup only
    }
    /* istanbul ignore next: it should never reach here */
    return false;
}
exports.supportScaleType = supportScaleType;
function rangeType(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.SIZE:
        case exports.OPACITY:
            return 'continuous';
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case exports.COLOR:
            return 'flexible';
        // No scale, no range type.
        case exports.X2:
        case exports.Y2:
        case exports.DETAIL:
        case exports.TEXT:
        case exports.ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('getSupportedRole not implemented for ' + channel);
}
exports.rangeType = rangeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7O0FBTUgsaUNBQStDO0FBQy9DLCtCQUFnRDtBQUVoRCxJQUFpQixPQUFPLENBcUJ2QjtBQXJCRCxXQUFpQixPQUFPO0lBQ3RCLFFBQVE7SUFDSyxXQUFHLEdBQVUsS0FBSyxDQUFDO0lBQ25CLGNBQU0sR0FBYSxRQUFRLENBQUM7SUFFekMsV0FBVztJQUNFLFNBQUMsR0FBUSxHQUFHLENBQUM7SUFDYixTQUFDLEdBQVEsR0FBRyxDQUFDO0lBQ2IsVUFBRSxHQUFTLElBQUksQ0FBQztJQUNoQixVQUFFLEdBQVMsSUFBSSxDQUFDO0lBRTdCLDJCQUEyQjtJQUNkLGFBQUssR0FBWSxPQUFPLENBQUM7SUFDekIsYUFBSyxHQUFZLE9BQU8sQ0FBQztJQUN6QixZQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ3RCLGVBQU8sR0FBYyxTQUFTLENBQUM7SUFFNUMsb0JBQW9CO0lBQ1AsWUFBSSxHQUFXLE1BQU0sQ0FBQztJQUN0QixhQUFLLEdBQVksT0FBTyxDQUFDO0lBQ3pCLGNBQU0sR0FBYSxRQUFRLENBQUM7QUFDM0MsQ0FBQyxFQXJCZ0IsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBcUJ2QjtBQUlZLFFBQUEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDZCxRQUFBLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2QsUUFBQSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUNoQixRQUFBLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDbEIsUUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN4QixRQUFBLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFD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