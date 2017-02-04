/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
"use strict";
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
    Channel.OFFSET = 'offset';
    Channel.ANCHOR = 'anchor';
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
exports.ANCHOR = Channel.ANCHOR;
exports.OFFSET = Channel.OFFSET;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.OFFSET, exports.ANCHOR, exports.TEXT, exports.DETAIL];
// CHANNELS without COLUMN, ROW
exports.UNIT_CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.OFFSET, exports.ANCHOR, exports.TEXT, exports.DETAIL];
// UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT
exports.UNIT_SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
// UNIT_SCALE_CHANNELS with ROW, COLUMN
exports.SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY, exports.ROW, exports.COLUMN];
// UNIT_CHANNELS without X, Y, X2, Y2;
// FIXME: does ANCHOR and OFFSET belong here
exports.NONSPATIAL_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_SCALE_CHANNELS without X, Y;
exports.NONSPATIAL_SCALE_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
/** Channels that can serve as groupings for stacked charts. */
// FIXME: does ANCHOR and OFFSET belong here
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
;
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
                bar: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
        case exports.ANCHOR:
        case exports.OFFSET:
            return { label: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
;
/**
 * Return whether a channel supports dimension / measure role
 * @param  channel
 * @return A dictionary mapping role to boolean values.
 */
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.OPACITY:
        case exports.ORDER:
        case exports.DETAIL:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.ANCHOR:
        case exports.COLUMN:
        case exports.SHAPE:
            return {
                measure: false,
                dimension: true
            };
        case exports.OFFSET:
        case exports.X2:
        case exports.Y2:
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
    }
    throw new Error('Invalid encoding channel ' + channel);
}
exports.getSupportedRole = getSupportedRole;
function hasScale(channel) {
    return util_1.contains(exports.SCALE_CHANNELS, channel);
}
exports.hasScale = hasScale;
function supportScaleType(channel, scaleType) {
    // Position does not work with ordinal (lookup) scale and sequential (which is only for color)
    var POSITION_SCALE_TYPE_INDEX = util_1.toSet(util_1.without(scale_1.SCALE_TYPES, ['ordinal', 'sequential']));
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
function getRangeType(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.ROW:
        case exports.COLUMN:
        case exports.SIZE:
        case exports.OPACITY:
            return 'continuous';
        case exports.SHAPE:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case exports.COLOR:
            return 'flexible';
        // No scale, no range type.
        case exports.X2:
        case exports.Y2:
        case exports.ANCHOR:
        case exports.OFFSET:
        case exports.DETAIL:
        case exports.TEXT:
        case exports.ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('getRangeType not implemented for ' + channel);
}
exports.getRangeType = getRangeType;
//# sourceMappingURL=channel.js.map