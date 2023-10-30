import { RangeType } from './compile/scale/type';
import { Encoding } from './encoding';
import { Mark } from './mark';
import { EncodingFacetMapping } from './spec/facet';
export type Channel = keyof Encoding<any>;
export type ExtendedChannel = Channel | FacetChannel;
export declare const ROW: "row";
export declare const COLUMN: "column";
export declare const FACET: "facet";
export declare const X: "x";
export declare const Y: "y";
export declare const X2: "x2";
export declare const Y2: "y2";
export declare const XOFFSET: "xOffset";
export declare const YOFFSET: "yOffset";
export declare const RADIUS: "radius";
export declare const RADIUS2: "radius2";
export declare const THETA: "theta";
export declare const THETA2: "theta2";
export declare const LATITUDE: "latitude";
export declare const LONGITUDE: "longitude";
export declare const LATITUDE2: "latitude2";
export declare const LONGITUDE2: "longitude2";
export declare const COLOR: "color";
export declare const FILL: "fill";
export declare const STROKE: "stroke";
export declare const SHAPE: "shape";
export declare const SIZE: "size";
export declare const ANGLE: "angle";
export declare const OPACITY: "opacity";
export declare const FILLOPACITY: "fillOpacity";
export declare const STROKEOPACITY: "strokeOpacity";
export declare const STROKEWIDTH: "strokeWidth";
export declare const STROKEDASH: "strokeDash";
export declare const TEXT: "text";
export declare const ORDER: "order";
export declare const DETAIL: "detail";
export declare const KEY: "key";
export declare const TOOLTIP: "tooltip";
export declare const HREF: "href";
export declare const URL: "url";
export declare const DESCRIPTION: "description";
declare const POSITION_CHANNEL_INDEX: {
    readonly x: 1;
    readonly y: 1;
    readonly x2: 1;
    readonly y2: 1;
};
export type PositionChannel = keyof typeof POSITION_CHANNEL_INDEX;
declare const POLAR_POSITION_CHANNEL_INDEX: {
    readonly theta: 1;
    readonly theta2: 1;
    readonly radius: 1;
    readonly radius2: 1;
};
export type PolarPositionChannel = keyof typeof POLAR_POSITION_CHANNEL_INDEX;
export declare function isPolarPositionChannel(c: Channel): c is PolarPositionChannel;
declare const GEO_POSIITON_CHANNEL_INDEX: {
    readonly longitude: 1;
    readonly longitude2: 1;
    readonly latitude: 1;
    readonly latitude2: 1;
};
export type GeoPositionChannel = keyof typeof GEO_POSIITON_CHANNEL_INDEX;
export declare function getPositionChannelFromLatLong(channel: GeoPositionChannel): PositionChannel;
export declare function isGeoPositionChannel(c: Channel): c is GeoPositionChannel;
export declare const GEOPOSITION_CHANNELS: ("longitude" | "latitude" | "longitude2" | "latitude2")[];
export type ColorChannel = 'color' | 'fill' | 'stroke';
export declare function isColorChannel(channel: Channel): channel is ColorChannel;
export type FacetChannel = keyof EncodingFacetMapping<any, any>;
export declare const FACET_CHANNELS: (keyof EncodingFacetMapping<any, any>)[];
export declare const CHANNELS: ("fill" | "stroke" | "angle" | "detail" | "key" | "url" | "color" | "fillOpacity" | "opacity" | "order" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "description" | "x" | "x2" | "y" | "y2" | "strokeDash" | "tooltip" | "shape" | "radius" | "theta" | "facet" | "href" | "theta2" | "radius2" | "xOffset" | "yOffset" | "longitude" | "latitude" | "longitude2" | "latitude2" | "row" | "column")[];
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them. Similarly, selection projection won't work with "detail" and "order".)
 */
export declare const SINGLE_DEF_CHANNELS: ("fill" | "stroke" | "angle" | "key" | "url" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "description" | "x" | "x2" | "y" | "y2" | "strokeDash" | "shape" | "radius" | "theta" | "facet" | "href" | "theta2" | "radius2" | "xOffset" | "yOffset" | "longitude" | "latitude" | "longitude2" | "latitude2" | "row" | "column")[];
export type SingleDefChannel = (typeof SINGLE_DEF_CHANNELS)[number];
export declare const SINGLE_DEF_UNIT_CHANNELS: ("fill" | "stroke" | "angle" | "key" | "url" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "description" | "x" | "x2" | "y" | "y2" | "strokeDash" | "shape" | "radius" | "theta" | "href" | "theta2" | "radius2" | "xOffset" | "yOffset" | "longitude" | "latitude" | "longitude2" | "latitude2")[];
export type SingleDefUnitChannel = (typeof SINGLE_DEF_UNIT_CHANNELS)[number];
export declare function isSingleDefUnitChannel(str: string): str is SingleDefUnitChannel;
export declare function isChannel(str: string): str is Channel;
export type SecondaryRangeChannel = 'x2' | 'y2' | 'latitude2' | 'longitude2' | 'theta2' | 'radius2';
export declare const SECONDARY_RANGE_CHANNEL: SecondaryRangeChannel[];
export declare function isSecondaryRangeChannel(c: ExtendedChannel): c is SecondaryRangeChannel;
export type MainChannelOf<C extends ExtendedChannel> = C extends 'x2' ? 'x' : C extends 'y2' ? 'y' : C extends 'latitude2' ? 'latitude' : C extends 'longitude2' ? 'longitude' : C extends 'theta2' ? 'theta' : C extends 'radius2' ? 'radius' : C;
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export declare function getMainRangeChannel<C extends ExtendedChannel>(channel: C): MainChannelOf<C>;
export type SecondaryChannelOf<C extends Channel> = C extends 'x' ? 'x2' : C extends 'y' ? 'y2' : C extends 'latitude' ? 'latitude2' : C extends 'longitude' ? 'longitude2' : C extends 'theta' ? 'theta2' : C extends 'radius' ? 'radius2' : undefined;
export declare function getVgPositionChannel(channel: PolarPositionChannel | PositionChannel): "x" | "x2" | "y" | "y2" | "innerRadius" | "outerRadius" | "startAngle" | "endAngle";
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export declare function getSecondaryRangeChannel<C extends Channel>(channel: C): SecondaryChannelOf<C> | undefined;
export declare function getSizeChannel(channel: PositionChannel): 'width' | 'height';
export declare function getSizeChannel(channel: Channel): 'width' | 'height' | undefined;
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export declare function getOffsetChannel(channel: Channel): "xOffset" | "yOffset" | "x2Offset" | "y2Offset" | "thetaOffset" | "radiusOffset" | "theta2Offset" | "radius2Offset";
/**
 * Get the main channel for a range channel. E.g. `x` for `x2`.
 */
export declare function getOffsetScaleChannel(channel: Channel): OffsetScaleChannel;
export declare function getMainChannelFromOffsetChannel(channel: OffsetScaleChannel): PositionScaleChannel;
export declare const UNIT_CHANNELS: (keyof Encoding<any>)[];
export declare const NONPOSITION_CHANNELS: ("fill" | "stroke" | "angle" | "detail" | "key" | "url" | "color" | "fillOpacity" | "opacity" | "order" | "strokeOpacity" | "strokeWidth" | "text" | "size" | "description" | "strokeDash" | "tooltip" | "shape" | "href")[];
export type NonPositionChannel = (typeof NONPOSITION_CHANNELS)[number];
declare const POSITION_SCALE_CHANNEL_INDEX: {
    readonly x: 1;
    readonly y: 1;
};
export declare const POSITION_SCALE_CHANNELS: ("x" | "y")[];
export type PositionScaleChannel = keyof typeof POSITION_SCALE_CHANNEL_INDEX;
export declare function isXorY(channel: ExtendedChannel): channel is PositionScaleChannel;
export declare const POLAR_POSITION_SCALE_CHANNEL_INDEX: {
    readonly theta: 1;
    readonly radius: 1;
};
export declare const POLAR_POSITION_SCALE_CHANNELS: ("radius" | "theta")[];
export type PolarPositionScaleChannel = keyof typeof POLAR_POSITION_SCALE_CHANNEL_INDEX;
export declare function getPositionScaleChannel(sizeType: 'width' | 'height'): PositionScaleChannel;
export declare const OFFSET_SCALE_CHANNELS: ("xOffset" | "yOffset")[];
export type OffsetScaleChannel = (typeof OFFSET_SCALE_CHANNELS)[0];
export declare function isXorYOffset(channel: Channel): channel is OffsetScaleChannel;
export declare const NONPOSITION_SCALE_CHANNELS: ("fill" | "stroke" | "angle" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "size" | "strokeDash" | "shape")[];
export type NonPositionScaleChannel = (typeof NONPOSITION_SCALE_CHANNELS)[number];
export declare function isNonPositionScaleChannel(channel: Channel): channel is NonPositionScaleChannel;
/**
 * @returns whether Vega supports legends for a particular channel
 */
export declare function supportLegend(channel: NonPositionScaleChannel): boolean;
/** List of channels with scales */
export declare const SCALE_CHANNELS: ("fill" | "stroke" | "angle" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "size" | "x" | "y" | "strokeDash" | "shape" | "radius" | "theta" | "xOffset" | "yOffset")[];
export type ScaleChannel = (typeof SCALE_CHANNELS)[number];
export declare function isScaleChannel(channel: Channel): channel is ScaleChannel;
export type SupportedMark = Partial<Record<Mark, 'always' | 'binned'>>;
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export declare function supportMark(channel: ExtendedChannel, mark: Mark): "always" | "binned";
export declare function rangeType(channel: ExtendedChannel): RangeType;
export {};
//# sourceMappingURL=channel.d.ts.map