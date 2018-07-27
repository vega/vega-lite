/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
import * as tslib_1 from "tslib";
import { isBinned } from './bin';
import { isFieldDef } from './fielddef';
import { CIRCLE, POINT, SQUARE, TICK } from './mark';
import { contains, flagKeys } from './util';
export var Channel;
(function (Channel) {
    // Facet
    Channel.ROW = 'row';
    Channel.COLUMN = 'column';
    // Position
    Channel.X = 'x';
    Channel.Y = 'y';
    Channel.X2 = 'x2';
    Channel.Y2 = 'y2';
    // Geo Position
    Channel.LATITUDE = 'latitude';
    Channel.LONGITUDE = 'longitude';
    Channel.LATITUDE2 = 'latitude2';
    Channel.LONGITUDE2 = 'longitude2';
    // Mark property with scale
    Channel.COLOR = 'color';
    Channel.FILL = 'fill';
    Channel.STROKE = 'stroke';
    Channel.SHAPE = 'shape';
    Channel.SIZE = 'size';
    Channel.OPACITY = 'opacity';
    // Non-scale channel
    Channel.TEXT = 'text';
    Channel.ORDER = 'order';
    Channel.DETAIL = 'detail';
    Channel.KEY = 'key';
    Channel.TOOLTIP = 'tooltip';
    Channel.HREF = 'href';
})(Channel || (Channel = {}));
export var X = Channel.X;
export var Y = Channel.Y;
export var X2 = Channel.X2;
export var Y2 = Channel.Y2;
export var LATITUDE = Channel.LATITUDE;
export var LATITUDE2 = Channel.LATITUDE2;
export var LONGITUDE = Channel.LONGITUDE;
export var LONGITUDE2 = Channel.LONGITUDE2;
export var ROW = Channel.ROW;
export var COLUMN = Channel.COLUMN;
export var SHAPE = Channel.SHAPE;
export var SIZE = Channel.SIZE;
export var COLOR = Channel.COLOR;
export var FILL = Channel.FILL;
export var STROKE = Channel.STROKE;
export var TEXT = Channel.TEXT;
export var DETAIL = Channel.DETAIL;
export var KEY = Channel.KEY;
export var ORDER = Channel.ORDER;
export var OPACITY = Channel.OPACITY;
export var TOOLTIP = Channel.TOOLTIP;
export var HREF = Channel.HREF;
export var GEOPOSITION_CHANNEL_INDEX = {
    longitude: 1,
    longitude2: 1,
    latitude: 1,
    latitude2: 1
};
export var GEOPOSITION_CHANNELS = flagKeys(GEOPOSITION_CHANNEL_INDEX);
var UNIT_CHANNEL_INDEX = tslib_1.__assign({ 
    // position
    x: 1, y: 1, x2: 1, y2: 1 }, GEOPOSITION_CHANNEL_INDEX, { 
    // color
    color: 1, fill: 1, stroke: 1, 
    // other non-position with scale
    opacity: 1, size: 1, shape: 1, 
    // channels without scales
    order: 1, text: 1, detail: 1, key: 1, tooltip: 1, href: 1 });
export function isColorChannel(channel) {
    return channel === 'color' || channel === 'fill' || channel === 'stroke';
}
var FACET_CHANNEL_INDEX = {
    row: 1,
    column: 1
};
var CHANNEL_INDEX = tslib_1.__assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
export var CHANNELS = flagKeys(CHANNEL_INDEX);
var _o = CHANNEL_INDEX.order, _d = CHANNEL_INDEX.detail, SINGLE_DEF_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail"]);
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
 */
export var SINGLE_DEF_CHANNELS = flagKeys(SINGLE_DEF_CHANNEL_INDEX);
export function isChannel(str) {
    return !!CHANNEL_INDEX[str];
}
// CHANNELS without COLUMN, ROW
export var UNIT_CHANNELS = flagKeys(UNIT_CHANNEL_INDEX);
// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
var _x = UNIT_CHANNEL_INDEX.x, _y = UNIT_CHANNEL_INDEX.y, 
// x2 and y2 share the same scale as x and y
_x2 = UNIT_CHANNEL_INDEX.x2, _y2 = UNIT_CHANNEL_INDEX.y2, _latitude = UNIT_CHANNEL_INDEX.latitude, _longitude = UNIT_CHANNEL_INDEX.longitude, _latitude2 = UNIT_CHANNEL_INDEX.latitude2, _longitude2 = UNIT_CHANNEL_INDEX.longitude2, 
// The rest of unit channels then have scale
NONPOSITION_CHANNEL_INDEX = tslib_1.__rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "latitude", "longitude", "latitude2", "longitude2"]);
export var NONPOSITION_CHANNELS = flagKeys(NONPOSITION_CHANNEL_INDEX);
// POSITION_SCALE_CHANNELS = X and Y;
var POSITION_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
export var POSITION_SCALE_CHANNELS = flagKeys(POSITION_SCALE_CHANNEL_INDEX);
// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
var 
// x2 and y2 share the same scale as x and y
// text and tooltip have format instead of scale,
// href has neither format, nor scale
_t = NONPOSITION_CHANNEL_INDEX.text, _tt = NONPOSITION_CHANNEL_INDEX.tooltip, _hr = NONPOSITION_CHANNEL_INDEX.href, 
// detail and order have no scale
_dd = NONPOSITION_CHANNEL_INDEX.detail, _k = NONPOSITION_CHANNEL_INDEX.key, _oo = NONPOSITION_CHANNEL_INDEX.order, NONPOSITION_SCALE_CHANNEL_INDEX = tslib_1.__rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "detail", "key", "order"]);
export var NONPOSITION_SCALE_CHANNELS = flagKeys(NONPOSITION_SCALE_CHANNEL_INDEX);
// Declare SCALE_CHANNEL_INDEX
var SCALE_CHANNEL_INDEX = tslib_1.__assign({}, POSITION_SCALE_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX);
/** List of channels with scales */
export var SCALE_CHANNELS = flagKeys(SCALE_CHANNEL_INDEX);
export function isScaleChannel(channel) {
    return !!SCALE_CHANNEL_INDEX[channel];
}
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export function supportMark(encoding, channel, mark) {
    if (contains([CIRCLE, POINT, SQUARE, TICK], mark) && contains([X2, Y2], channel)) {
        var primaryFieldDef = encoding[channel === X2 ? X : Y];
        // circle, point, square and tick only support x2/y2 when their corresponding x/y fieldDef
        // has "binned" data and thus need x2/y2 to specify the bin-end field.
        if (isFieldDef(primaryFieldDef) && isFieldDef(encoding[channel]) && isBinned(primaryFieldDef.bin)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return mark in getSupportedMark(channel);
    }
}
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
export function getSupportedMark(channel) {
    switch (channel) {
        case COLOR:
        case FILL:
        case STROKE:
        case DETAIL:
        case KEY:
        case TOOLTIP:
        case HREF:
        case ORDER: // TODO: revise (order might not support rect, which is not stackable?)
        case OPACITY:
        case ROW:
        case COLUMN:
            return {
                // all marks
                point: true,
                tick: true,
                rule: true,
                circle: true,
                square: true,
                bar: true,
                rect: true,
                line: true,
                trail: true,
                area: true,
                text: true,
                geoshape: true
            };
        case X:
        case Y:
        case LATITUDE:
        case LONGITUDE:
            return {
                // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
                point: true,
                tick: true,
                rule: true,
                circle: true,
                square: true,
                bar: true,
                rect: true,
                line: true,
                trail: true,
                area: true,
                text: true
            };
        case X2:
        case Y2:
        case LATITUDE2:
        case LONGITUDE2:
            return {
                rule: true,
                bar: true,
                rect: true,
                area: true
            };
        case SIZE:
            return {
                point: true,
                tick: true,
                rule: true,
                circle: true,
                square: true,
                bar: true,
                text: true,
                line: true,
                trail: true
            };
        case SHAPE:
            return { point: true, geoshape: true };
        case TEXT:
            return { text: true };
    }
}
export function rangeType(channel) {
    switch (channel) {
        case X:
        case Y:
        case SIZE:
        case OPACITY:
        // X2 and Y2 use X and Y scales, so they similarly have continuous range.
        case X2:
        case Y2:
            return 'continuous';
        case ROW:
        case COLUMN:
        case SHAPE:
        // TEXT, TOOLTIP, and HREF have no scale but have discrete output
        case TEXT:
        case TOOLTIP:
        case HREF:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case COLOR:
        case FILL:
        case STROKE:
            return 'flexible';
        // No scale, no range type.
        case LATITUDE:
        case LONGITUDE:
        case LATITUDE2:
        case LONGITUDE2:
        case DETAIL:
        case KEY:
        case ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('rangeType not implemented for ' + channel);
}
//# sourceMappingURL=channel.js.map