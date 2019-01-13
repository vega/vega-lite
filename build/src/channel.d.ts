import { RangeType } from './compile/scale/type';
import { Encoding } from './encoding';
import { Mark } from './mark';
import { FacetMapping } from './spec/facet';
import { Flag } from './util';
export declare namespace Channel {
    const ROW: 'row';
    const COLUMN: 'column';
    const X: 'x';
    const Y: 'y';
    const X2: 'x2';
    const Y2: 'y2';
    const XERROR: 'xError';
    const YERROR: 'yError';
    const XERROR2: 'xError2';
    const YERROR2: 'yError2';
    const LATITUDE: 'latitude';
    const LONGITUDE: 'longitude';
    const LATITUDE2: 'latitude2';
    const LONGITUDE2: 'longitude2';
    const COLOR: 'color';
    const FILL: 'fill';
    const STROKE: 'stroke';
    const SHAPE: 'shape';
    const SIZE: 'size';
    const OPACITY: 'opacity';
    const FILLOPACITY: 'fillOpacity';
    const STROKEOPACITY: 'strokeOpacity';
    const STROKEWIDTH: 'strokeWidth';
    const TEXT: 'text';
    const ORDER: 'order';
    const DETAIL: 'detail';
    const KEY: 'key';
    const TOOLTIP: 'tooltip';
    const HREF: 'href';
}
export declare type Channel = keyof Encoding<any> | keyof FacetMapping<any>;
export declare const X: "x";
export declare const Y: "y";
export declare const X2: "x2";
export declare const Y2: "y2";
export declare const XERROR: "xError";
export declare const YERROR: "yError";
export declare const XERROR2: "xError2";
export declare const YERROR2: "yError2";
export declare const LATITUDE: "latitude";
export declare const LATITUDE2: "latitude2";
export declare const LONGITUDE: "longitude";
export declare const LONGITUDE2: "longitude2";
export declare const ROW: "row";
export declare const COLUMN: "column";
export declare const SHAPE: "shape";
export declare const SIZE: "size";
export declare const COLOR: "color";
export declare const FILL: "fill";
export declare const STROKE: "stroke";
export declare const TEXT: "text";
export declare const DETAIL: "detail";
export declare const KEY: "key";
export declare const ORDER: "order";
export declare const OPACITY: "opacity";
export declare const FILLOPACITY: "fillOpacity";
export declare const STROKEOPACITY: "strokeOpacity";
export declare const STROKEWIDTH: "strokeWidth";
export declare const TOOLTIP: "tooltip";
export declare const HREF: "href";
export declare type GeoPositionChannel = 'longitude' | 'latitude' | 'longitude2' | 'latitude2';
export declare const GEOPOSITION_CHANNEL_INDEX: Flag<GeoPositionChannel>;
export declare const GEOPOSITION_CHANNELS: ("longitude" | "latitude" | "longitude2" | "latitude2")[];
export declare type ColorChannel = 'color' | 'fill' | 'stroke';
export declare function isColorChannel(channel: Channel): channel is ColorChannel;
export declare const CHANNELS: Channel[];
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
 */
export declare const SINGLE_DEF_CHANNELS: SingleDefChannel[];
export declare type SingleDefChannel = 'x' | 'y' | 'x2' | 'y2' | 'xError' | 'yError' | 'xError2' | 'yError2' | 'longitude' | 'latitude' | 'longitude2' | 'latitude2' | 'row' | 'column' | 'color' | 'fill' | 'stroke' | 'strokeWidth' | 'size' | 'shape' | 'fillOpacity' | 'strokeOpacity' | 'opacity' | 'text' | 'tooltip' | 'href' | 'key';
export declare function isChannel(str: string): str is Channel;
export declare function isSecondaryRangeChannel(c: Channel): c is 'x2' | 'y2' | 'latitude2' | 'longitude2';
export declare function getMainRangeChannel(channel: Channel): Channel;
export declare const UNIT_CHANNELS: ("text" | "shape" | "x" | "y" | "x2" | "y2" | "xError" | "xError2" | "yError" | "yError2" | "longitude" | "latitude" | "longitude2" | "latitude2" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "detail" | "key" | "tooltip" | "href" | "order")[];
export declare const NONPOSITION_CHANNELS: ("text" | "shape" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "detail" | "key" | "tooltip" | "href" | "order")[];
export declare type NonPositionChannel = typeof NONPOSITION_CHANNELS[0];
export declare const POSITION_SCALE_CHANNELS: ("x" | "y")[];
export declare type PositionScaleChannel = typeof POSITION_SCALE_CHANNELS[0];
export declare const NONPOSITION_SCALE_CHANNELS: ("shape" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size")[];
export declare type NonPositionScaleChannel = typeof NONPOSITION_SCALE_CHANNELS[0];
export declare function isNonPositionScaleChannel(channel: Channel): channel is NonPositionScaleChannel;
/** List of channels with scales */
export declare const SCALE_CHANNELS: ("shape" | "x" | "y" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size")[];
export declare type ScaleChannel = typeof SCALE_CHANNELS[0];
export declare function isScaleChannel(channel: Channel): channel is ScaleChannel;
export declare type SupportedMark = {
    [mark in Mark]?: 'always' | 'binned';
};
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export declare function supportMark(channel: Channel, mark: Mark): "binned" | "always";
export declare function rangeType(channel: Channel): RangeType;
