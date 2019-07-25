import { RangeType } from './compile/scale/type';
import { Encoding } from './encoding';
import { Mark } from './mark';
import { EncodingFacetMapping, EncodingFacetMapping as ExtendedFacetMapping } from './spec/facet';
export declare type Channel = keyof Encoding<any> | keyof ExtendedFacetMapping<any>;
export declare const ROW: 'row';
export declare const COLUMN: 'column';
export declare const FACET: 'facet';
export declare const X: 'x';
export declare const Y: 'y';
export declare const X2: 'x2';
export declare const Y2: 'y2';
export declare const LATITUDE: 'latitude';
export declare const LONGITUDE: 'longitude';
export declare const LATITUDE2: 'latitude2';
export declare const LONGITUDE2: 'longitude2';
export declare const COLOR: 'color';
export declare const FILL: 'fill';
export declare const STROKE: 'stroke';
export declare const SHAPE: 'shape';
export declare const SIZE: 'size';
export declare const OPACITY: 'opacity';
export declare const FILLOPACITY: 'fillOpacity';
export declare const STROKEOPACITY: 'strokeOpacity';
export declare const STROKEWIDTH: 'strokeWidth';
export declare const TEXT: 'text';
export declare const ORDER: 'order';
export declare const DETAIL: 'detail';
export declare const KEY: 'key';
export declare const TOOLTIP: 'tooltip';
export declare const HREF: 'href';
export declare type PositionChannel = 'x' | 'y' | 'x2' | 'y2';
export declare function isPositionChannel(c: Channel): c is PositionChannel;
export declare type GeoPositionChannel = 'longitude' | 'latitude' | 'longitude2' | 'latitude2';
export declare function getPositionChannelFromLatLong(channel: GeoPositionChannel): PositionChannel;
export declare function isGeoPositionChannel(c: Channel): c is GeoPositionChannel;
export declare const GEOPOSITION_CHANNELS: GeoPositionChannel[];
export declare type ColorChannel = 'color' | 'fill' | 'stroke';
export declare function isColorChannel(channel: Channel): channel is ColorChannel;
export declare type FacetChannel = keyof EncodingFacetMapping<any>;
export declare const FACET_CHANNELS: ("facet" | "row" | "column")[];
export declare const CHANNELS: Channel[];
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projection won't work with "detail" and "order".)
 */
export declare const SINGLE_DEF_CHANNELS: ("x" | "y" | "x2" | "y2" | "longitude" | "latitude" | "longitude2" | "latitude2" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape" | "key" | "text" | "tooltip" | "href" | "facet" | "row" | "column")[];
export declare type SingleDefChannel = typeof SINGLE_DEF_CHANNELS[number];
export declare const SINGLE_DEF_UNIT_CHANNELS: ("x" | "y" | "x2" | "y2" | "longitude" | "latitude" | "longitude2" | "latitude2" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape" | "key" | "text" | "tooltip" | "href")[];
export declare type SingleDefUnitChannel = typeof SINGLE_DEF_UNIT_CHANNELS[number];
export declare function isSingleDefUnitChannel(str: string): str is SingleDefUnitChannel;
export declare function isChannel(str: string): str is Channel;
export declare type SecondaryRangeChannel = 'x2' | 'y2' | 'latitude2' | 'longitude2';
export declare const SECONDARY_RANGE_CHANNEL: SecondaryRangeChannel[];
export declare function isSecondaryRangeChannel(c: Channel): c is SecondaryRangeChannel;
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export declare function getMainRangeChannel(channel: Channel): Channel;
export declare const UNIT_CHANNELS: ("x" | "y" | "x2" | "y2" | "longitude" | "latitude" | "longitude2" | "latitude2" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape" | "detail" | "key" | "text" | "tooltip" | "href" | "order")[];
export declare const NONPOSITION_CHANNELS: ("color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape" | "detail" | "key" | "text" | "tooltip" | "href" | "order")[];
export declare type NonPositionChannel = typeof NONPOSITION_CHANNELS[0];
export declare const POSITION_SCALE_CHANNELS: ("x" | "y")[];
export declare type PositionScaleChannel = typeof POSITION_SCALE_CHANNELS[0];
export declare const NONPOSITION_SCALE_CHANNELS: ("color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape")[];
export declare type NonPositionScaleChannel = typeof NONPOSITION_SCALE_CHANNELS[0];
export declare function isNonPositionScaleChannel(channel: Channel): channel is NonPositionScaleChannel;
/**
 * @returns whether Vega supports legends for a particular channel
 */
export declare function supportLegend(channel: NonPositionScaleChannel): boolean;
/** List of channels with scales */
export declare const SCALE_CHANNELS: ("x" | "y" | "color" | "fill" | "stroke" | "opacity" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "size" | "shape")[];
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
//# sourceMappingURL=channel.d.ts.map