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
var CHANNEL_INDEX = util_1.toSet(exports.CHANNELS);
function isChannel(str) {
    return !!CHANNEL_INDEX[str];
}
exports.isChannel = isChannel;
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