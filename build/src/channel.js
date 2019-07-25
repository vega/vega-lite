/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
import * as tslib_1 from "tslib";
import { keys } from './util';
// Facet
export const ROW = 'row';
export const COLUMN = 'column';
export const FACET = 'facet';
// Position
export const X = 'x';
export const Y = 'y';
export const X2 = 'x2';
export const Y2 = 'y2';
// Geo Position
export const LATITUDE = 'latitude';
export const LONGITUDE = 'longitude';
export const LATITUDE2 = 'latitude2';
export const LONGITUDE2 = 'longitude2';
// Mark property with scale
export const COLOR = 'color';
export const FILL = 'fill';
export const STROKE = 'stroke';
export const SHAPE = 'shape';
export const SIZE = 'size';
export const OPACITY = 'opacity';
export const FILLOPACITY = 'fillOpacity';
export const STROKEOPACITY = 'strokeOpacity';
export const STROKEWIDTH = 'strokeWidth';
// Non-scale channel
export const TEXT = 'text';
export const ORDER = 'order';
export const DETAIL = 'detail';
export const KEY = 'key';
export const TOOLTIP = 'tooltip';
export const HREF = 'href';
const POSITION_CHANNEL_INDEX = {
    x: 1,
    y: 1,
    x2: 1,
    y2: 1
};
export function isPositionChannel(c) {
    return c in POSITION_CHANNEL_INDEX;
}
export function getPositionChannelFromLatLong(channel) {
    switch (channel) {
        case LATITUDE:
            return 'y';
        case LATITUDE2:
            return 'y2';
        case LONGITUDE:
            return 'x';
        case LONGITUDE2:
            return 'x2';
    }
}
const GEOPOSITION_CHANNEL_INDEX = {
    longitude: 1,
    longitude2: 1,
    latitude: 1,
    latitude2: 1
};
export function isGeoPositionChannel(c) {
    return c in GEOPOSITION_CHANNEL_INDEX;
}
export const GEOPOSITION_CHANNELS = keys(GEOPOSITION_CHANNEL_INDEX);
const UNIT_CHANNEL_INDEX = Object.assign({}, POSITION_CHANNEL_INDEX, GEOPOSITION_CHANNEL_INDEX, { 
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
    column: 1,
    facet: 1
};
export const FACET_CHANNELS = keys(FACET_CHANNEL_INDEX);
const CHANNEL_INDEX = Object.assign({}, UNIT_CHANNEL_INDEX, FACET_CHANNEL_INDEX);
export const CHANNELS = keys(CHANNEL_INDEX);
const { order: _o, detail: _d } = CHANNEL_INDEX, SINGLE_DEF_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail"]);
const { order: _o1, detail: _d1, row: _r, column: _c, facet: _f } = CHANNEL_INDEX, SINGLE_DEF_UNIT_CHANNEL_INDEX = tslib_1.__rest(CHANNEL_INDEX, ["order", "detail", "row", "column", "facet"]);
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
 */
export const SINGLE_DEF_CHANNELS = keys(SINGLE_DEF_CHANNEL_INDEX);
export const SINGLE_DEF_UNIT_CHANNELS = keys(SINGLE_DEF_UNIT_CHANNEL_INDEX);
// export type SingleDefChannel = SingleDefUnitChannel | 'row' | 'column' | 'facet';
export function isSingleDefUnitChannel(str) {
    return !!SINGLE_DEF_UNIT_CHANNEL_INDEX[str];
}
export function isChannel(str) {
    return !!CHANNEL_INDEX[str];
}
export const SECONDARY_RANGE_CHANNEL = ['x2', 'y2', 'latitude2', 'longitude2'];
export function isSecondaryRangeChannel(c) {
    const main = getMainRangeChannel(c);
    return main !== c;
}
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
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
export const UNIT_CHANNELS = keys(UNIT_CHANNEL_INDEX);
// NONPOSITION_CHANNELS = UNIT_CHANNELS without X, Y, X2, Y2;
const { x: _x, y: _y, 
// x2 and y2 share the same scale as x and y
x2: _x2, y2: _y2, latitude: _latitude, longitude: _longitude, latitude2: _latitude2, longitude2: _longitude2 } = UNIT_CHANNEL_INDEX, 
// The rest of unit channels then have scale
NONPOSITION_CHANNEL_INDEX = tslib_1.__rest(UNIT_CHANNEL_INDEX, ["x", "y", "x2", "y2", "latitude", "longitude", "latitude2", "longitude2"]);
export const NONPOSITION_CHANNELS = keys(NONPOSITION_CHANNEL_INDEX);
// POSITION_SCALE_CHANNELS = X and Y;
const POSITION_SCALE_CHANNEL_INDEX = { x: 1, y: 1 };
export const POSITION_SCALE_CHANNELS = keys(POSITION_SCALE_CHANNEL_INDEX);
// NON_POSITION_SCALE_CHANNEL = SCALE_CHANNELS without X, Y
const { 
// x2 and y2 share the same scale as x and y
// text and tooltip have format instead of scale,
// href has neither format, nor scale
text: _t, tooltip: _tt, href: _hr, 
// detail and order have no scale
detail: _dd, key: _k, order: _oo } = NONPOSITION_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX = tslib_1.__rest(NONPOSITION_CHANNEL_INDEX, ["text", "tooltip", "href", "detail", "key", "order"]);
export const NONPOSITION_SCALE_CHANNELS = keys(NONPOSITION_SCALE_CHANNEL_INDEX);
export function isNonPositionScaleChannel(channel) {
    return !!NONPOSITION_CHANNEL_INDEX[channel];
}
/**
 * @returns whether Vega supports legends for a particular channel
 */
export function supportLegend(channel) {
    switch (channel) {
        case COLOR:
        case FILL:
        case STROKE:
        case SIZE:
        case SHAPE:
        case OPACITY:
        case STROKEWIDTH:
            return true;
        case FILLOPACITY:
        case STROKEOPACITY:
            return false;
    }
}
// Declare SCALE_CHANNEL_INDEX
const SCALE_CHANNEL_INDEX = Object.assign({}, POSITION_SCALE_CHANNEL_INDEX, NONPOSITION_SCALE_CHANNEL_INDEX);
/** List of channels with scales */
export const SCALE_CHANNELS = keys(SCALE_CHANNEL_INDEX);
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
const ALL_MARKS = {
    // all marks
    area: 'always',
    bar: 'always',
    circle: 'always',
    geoshape: 'always',
    line: 'always',
    rule: 'always',
    point: 'always',
    rect: 'always',
    square: 'always',
    trail: 'always',
    text: 'always',
    tick: 'always'
};
const { geoshape: _g } = ALL_MARKS, ALL_MARKS_EXCEPT_GEOSHAPE = tslib_1.__rest(ALL_MARKS, ["geoshape"]);
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
        // falls through
        case DETAIL:
        case KEY:
        case TOOLTIP:
        case HREF:
        case ORDER: // TODO: revise (order might not support rect, which is not stackable?)
        case OPACITY:
        case FILLOPACITY:
        case STROKEOPACITY:
        case STROKEWIDTH:
        // falls through
        case FACET:
        case ROW: // falls through
        case COLUMN:
            return ALL_MARKS;
        case X:
        case Y:
        case LATITUDE:
        case LONGITUDE:
            // all marks except geoshape. geoshape does not use X, Y -- it uses a projection
            return ALL_MARKS_EXCEPT_GEOSHAPE;
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
                tick: 'binned',
                line: 'binned',
                trail: 'binned'
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
        // X2 and Y2 use X and Y scales, so they similarly have continuous range. [falls through]
        case X2:
        case Y2:
            return undefined;
        case FACET:
        case ROW:
        case COLUMN:
        case SHAPE:
        // TEXT, TOOLTIP, and HREF have no scale but have discrete output [falls through]
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