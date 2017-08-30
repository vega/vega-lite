"use strict";
/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
    Channel.TOOLTIP = 'tooltip';
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
exports.TOOLTIP = Channel.TOOLTIP;
var UNIT_CHANNEL_INDEX = {
    x: 1,
    y: 1,
    x2: 1,
    y2: 1,
    size: 1,
    shape: 1,
    color: 1,
    order: 1,
    opacity: 1,
    text: 1,
    detail: 1,
    tooltip: 1
};
var FACET_CHANNEL_INDEX = {
    row: 1,
    column: 1
};
var CHANNEL_INDEX = tslib_1.__assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
exports.CHANNELS = util_1.flagKeys(CHANNEL_INDEX);
var _o = CHANNEL_INDEX.order, _d = CHANNEL_INDEX.detail, SINGLE_DEF_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail"]);
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projecttion won't work with "detail" and "order".)
 */
exports.SINGLE_DEF_CHANNELS = util_1.flagKeys(SINGLE_DEF_CHANNEL_INDEX);
function isChannel(str) {
    return !!CHANNEL_INDEX[str];
}
exports.isChannel = isChannel;
// CHANNELS without COLUMN, ROW
exports.UNIT_CHANNELS = util_1.flagKeys(UNIT_CHANNEL_INDEX);
// NONSPATIAL_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
var _x = UNIT_CHANNEL_INDEX.x, _y = UNIT_CHANNEL_INDEX.y, 
// x2 and y2 share the same scale as x and y
_x2 = UNIT_CHANNEL_INDEX.x2, _y2 = UNIT_CHANNEL_INDEX.y2, 
// The rest of unit channels then have scale
NONSPATIAL_CHANNEL_INDEX = tslib_1.__rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2"]);
exports.NONSPATIAL_CHANNELS = util_1.flagKeys(NONSPATIAL_CHANNEL_INDEX);
// SPATIAL_SCALE_CHANNELS = X and Y;
var SPATIAL_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
exports.SPATIAL_SCALE_CHANNELS = util_1.flagKeys(SPATIAL_SCALE_CHANNEL_INDEX);
// NON_SPATIAL_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
var 
// x2 and y2 share the same scale as x and y
// text and tooltip has format instead of scale
_t = NONSPATIAL_CHANNEL_INDEX.text, _tt = NONSPATIAL_CHANNEL_INDEX.tooltip, 
// detail and order have no scale
_dd = NONSPATIAL_CHANNEL_INDEX.detail, _oo = NONSPATIAL_CHANNEL_INDEX.order, NONSPATIAL_SCALE_CHANNEL_INDEX = tslib_1.__rest(NONSPATIAL_CHANNEL_INDEX, ["text", "tooltip", "detail", "order"]);
exports.NONSPATIAL_SCALE_CHANNELS = util_1.flagKeys(NONSPATIAL_SCALE_CHANNEL_INDEX);
// Declare SCALE_CHANNEL_INDEX
var SCALE_CHANNEL_INDEX = tslib_1.__assign({}, SPATIAL_SCALE_CHANNEL_INDEX, NONSPATIAL_SCALE_CHANNEL_INDEX);
/** List of channels with scales */
exports.SCALE_CHANNELS = util_1.flagKeys(SCALE_CHANNEL_INDEX);
function isScaleChannel(channel) {
    return !!SCALE_CHANNEL_INDEX[channel];
}
exports.isScaleChannel = isScaleChannel;
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
        case exports.TOOLTIP:
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
}
exports.getSupportedMark = getSupportedMark;
function rangeType(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.SIZE:
        case exports.OPACITY:
        // X2 and Y2 use X and Y scales, so they similarly have continuous range.
        case exports.X2:
        case exports.Y2:
            return 'continuous';
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
        // TEXT and TOOLTIP have no scale but have discrete output
        case exports.TEXT:
        case exports.TOOLTIP:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case exports.COLOR:
            return 'flexible';
        // No scale, no range type.
        case exports.DETAIL:
        case exports.ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('getSupportedRole not implemented for ' + channel);
}
exports.rangeType = rangeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7OztBQU9ILCtCQUFnRDtBQUVoRCxJQUFpQixPQUFPLENBc0J2QjtBQXRCRCxXQUFpQixPQUFPO0lBQ3RCLFFBQVE7SUFDSyxXQUFHLEdBQVUsS0FBSyxDQUFDO0lBQ25CLGNBQU0sR0FBYSxRQUFRLENBQUM7SUFFekMsV0FBVztJQUNFLFNBQUMsR0FBUSxHQUFHLENBQUM7SUFDYixTQUFDLEdBQVEsR0FBRyxDQUFDO0lBQ2IsVUFBRSxHQUFTLElBQUksQ0FBQztJQUNoQixVQUFFLEdBQVMsSUFBSSxDQUFDO0lBRTdCLDJCQUEyQjtJQUNkLGFBQUssR0FBWSxPQUFPLENBQUM7SUFDekIsYUFBSyxHQUFZLE9BQU8sQ0FBQztJQUN6QixZQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ3RCLGVBQU8sR0FBYyxTQUFTLENBQUM7SUFFNUMsb0JBQW9CO0lBQ1AsWUFBSSxHQUFXLE1BQU0sQ0FBQztJQUN0QixhQUFLLEdBQVksT0FBTyxDQUFDO0lBQ3pCLGNBQU0sR0FBYSxRQUFRLENBQUM7SUFDNUIsZUFBTyxHQUFjLFNBQVMsQ0FBQztBQUM5QyxDQUFDLEVBdEJnQixPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFzQnZCO0FBSVksUUFBQSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNkLFFBQUEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDZCxRQUFBLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDaEIsUUFBQSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUNsQixRQUFBLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3hCLFFBQUEsS0FBSyxHQUFHLE9BQU8s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