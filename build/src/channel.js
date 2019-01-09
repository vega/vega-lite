/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
import * as tslib_1 from "tslib";
import { flagKeys } from './util';
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
    Channel.XERROR = 'xError';
    Channel.YERROR = 'yError';
    Channel.XERROR2 = 'xError2';
    Channel.YERROR2 = 'yError2';
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
    Channel.FILLOPACITY = 'fillOpacity';
    Channel.STROKEOPACITY = 'strokeOpacity';
    Channel.STROKEWIDTH = 'strokeWidth';
    // Non-scale channel
    Channel.TEXT = 'text';
    Channel.ORDER = 'order';
    Channel.DETAIL = 'detail';
    Channel.KEY = 'key';
    Channel.TOOLTIP = 'tooltip';
    Channel.HREF = 'href';
})(Channel || (Channel = {}));
export const X = Channel.X;
export const Y = Channel.Y;
export const X2 = Channel.X2;
export const Y2 = Channel.Y2;
export const XERROR = Channel.XERROR;
export const YERROR = Channel.YERROR;
export const XERROR2 = Channel.XERROR2;
export const YERROR2 = Channel.YERROR2;
export const LATITUDE = Channel.LATITUDE;
export const LATITUDE2 = Channel.LATITUDE2;
export const LONGITUDE = Channel.LONGITUDE;
export const LONGITUDE2 = Channel.LONGITUDE2;
export const ROW = Channel.ROW;
export const COLUMN = Channel.COLUMN;
export const SHAPE = Channel.SHAPE;
export const SIZE = Channel.SIZE;
export const COLOR = Channel.COLOR;
export const FILL = Channel.FILL;
export const STROKE = Channel.STROKE;
export const TEXT = Channel.TEXT;
export const DETAIL = Channel.DETAIL;
export const KEY = Channel.KEY;
export const ORDER = Channel.ORDER;
export const OPACITY = Channel.OPACITY;
export const FILLOPACITY = Channel.FILLOPACITY;
export const STROKEOPACITY = Channel.STROKEOPACITY;
export const STROKEWIDTH = Channel.STROKEWIDTH;
export const TOOLTIP = Channel.TOOLTIP;
export const HREF = Channel.HREF;
export const GEOPOSITION_CHANNEL_INDEX = {
    longitude: 1,
    longitude2: 1,
    latitude: 1,
    latitude2: 1
};
export const GEOPOSITION_CHANNELS = flagKeys(GEOPOSITION_CHANNEL_INDEX);
const UNIT_CHANNEL_INDEX = Object.assign({ 
    // position
    x: 1, y: 1, x2: 1, y2: 1, xError: 1, yError: 1, xError2: 1, yError2: 1 }, GEOPOSITION_CHANNEL_INDEX, { 
    // color
    color: 1, fill: 1, stroke: 1, 
    // other non-position with scale
    opacity: 1, fillOpacity: 1, strokeOpacity: 1, strokeWidth: 1, size: 1, shape: 1, 
    // channels without scales
    order: 1, text: 1, detail: 1, key: 1, tooltip: 1, href: 1 });
export function isColorChannel(channel) {
    return channel === 'color' || channel === 'fill' || channel === 'stroke';
}
const FACET_CHANNEL_INDEX = {
    row: 1,
    column: 1
};
const CHANNEL_INDEX = Object.assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
export const CHANNELS = flagKeys(CHANNEL_INDEX);
const { order: _o, detail: _d } = CHANNEL_INDEX, SINGLE_DEF_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail"]);
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
 */
export const SINGLE_DEF_CHANNELS = flagKeys(SINGLE_DEF_CHANNEL_INDEX);
export function isChannel(str) {
    return !!CHANNEL_INDEX[str];
}
export function isSecondaryRangeChannel(c) {
    const main = getMainRangeChannel(c);
    return main !== c;
}
export function getMainRangeChannel(channel) {
    switch (channel) {
        case 'x2':
            return 'x';
        case 'y2':
            return 'y';
        case 'latitude2':
            return 'latitude';
        case 'longitude2':
            return 'longitude';
    }
    return channel;
}
// CHANNELS without COLUMN, ROW
export const UNIT_CHANNELS = flagKeys(UNIT_CHANNEL_INDEX);
// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
const { x: _x, y: _y, 
// x2 and y2 share the same scale as x and y
x2: _x2, y2: _y2, xError: _xError, yError: _yError, xError2: _xError2, yError2: _yError2, latitude: _latitude, longitude: _longitude, latitude2: _latitude2, longitude2: _longitude2 } = UNIT_CHANNEL_INDEX, 
// The rest of unit channels then have scale
NONPOSITION_CHANNEL_INDEX = tslib_1.__rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "xError", "yError", "xError2", "yError2", "latitude", "longitude", "latitude2", "longitude2"]);
export const NONPOSITION_CHANNELS = flagKeys(NONPOSITION_CHANNEL_INDEX);
// POSITION_SCALE_CHANNELS = X and Y;
const POSITION_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
export const POSITION_SCALE_CHANNELS = flagKeys(POSITION_SCALE_CHANNEL_INDEX);
// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
const { 
// x2 and y2 share the same scale as x and y
// text and tooltip have format instead of scale,
// href has neither format, nor scale
text: _t, tooltip: _tt, href: _hr, 
// detail and order have no scale
detail: _dd, key: _k, order: _oo } = NONPOSITION_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX = tslib_1.__rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "detail", "key", "order"]);
export const NONPOSITION_SCALE_CHANNELS = flagKeys(NONPOSITION_SCALE_CHANNEL_INDEX);
export function isNonPositionScaleChannel(channel) {
    return !!NONPOSITION_CHANNEL_INDEX[channel];
}
// Declare SCALE_CHANNEL_INDEX
const SCALE_CHANNEL_INDEX = Object.assign({}, POSITION_SCALE_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX);
/** List of channels with scales */
export const SCALE_CHANNELS = flagKeys(SCALE_CHANNEL_INDEX);
export function isScaleChannel(channel) {
    return !!SCALE_CHANNEL_INDEX[channel];
}
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export function supportMark(channel, mark) {
    return getSupportedMark(channel)[mark];
}
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to 'always', 'binned', or undefined
 */
function getSupportedMark(channel) {
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
        case FILLOPACITY:
        case STROKEOPACITY:
        case STROKEWIDTH:
        case ROW:
        case COLUMN:
            return {
                // all marks
                point: 'always',
                tick: 'always',
                rule: 'always',
                circle: 'always',
                square: 'always',
                bar: 'always',
                rect: 'always',
                line: 'always',
                trail: 'always',
                area: 'always',
                text: 'always',
                geoshape: 'always'
            };
        case X:
        case Y:
        case LATITUDE:
        case LONGITUDE:
            return {
                // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
                point: 'always',
                tick: 'always',
                rule: 'always',
                circle: 'always',
                square: 'always',
                bar: 'always',
                rect: 'always',
                line: 'always',
                trail: 'always',
                area: 'always',
                text: 'always'
            };
        case X2:
        case Y2:
        case LATITUDE2:
        case LONGITUDE2:
            return {
                rule: 'always',
                bar: 'always',
                rect: 'always',
                area: 'always',
                circle: 'binned',
                point: 'binned',
                square: 'binned',
                tick: 'binned'
            };
        case SIZE:
            return {
                point: 'always',
                tick: 'always',
                rule: 'always',
                circle: 'always',
                square: 'always',
                bar: 'always',
                text: 'always',
                line: 'always',
                trail: 'always'
            };
        case SHAPE:
            return { point: 'always', geoshape: 'always' };
        case TEXT:
            return { text: 'always' };
        case XERROR:
        case YERROR:
        case XERROR2:
        case YERROR2:
            return {};
    }
}
export function rangeType(channel) {
    switch (channel) {
        case X:
        case Y:
        case SIZE:
        case STROKEWIDTH:
        case OPACITY:
        case FILLOPACITY:
        case STROKEOPACITY:
        // X2 and Y2 use X and Y scales, so they similarly have continuous range.
        case X2:
        case Y2:
        case XERROR:
        case YERROR:
        case XERROR2:
        case YERROR2:
            return undefined;
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