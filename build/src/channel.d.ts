import { RangeType } from './compile/scale/type';
import { Encoding } from './encoding';
import { FacetMapping } from './facet';
import { Mark } from './mark';
export declare namespace Channel {
    const ROW: 'row';
    const COLUMN: 'column';
    const X: 'x';
    const Y: 'y';
    const X2: 'x2';
    const Y2: 'y2';
    const COLOR: 'color';
    const SHAPE: 'shape';
    const SIZE: 'size';
    const OPACITY: 'opacity';
    const TEXT: 'text';
    const ORDER: 'order';
    const DETAIL: 'detail';
    const TOOLTIP: 'tooltip';
    const HREF: 'href';
}
export declare type Channel = keyof Encoding<any> | keyof FacetMapping<any>;
export declare const X: "x";
export declare const Y: "y";
export declare const X2: "x2";
export declare const Y2: "y2";
export declare const ROW: "row";
export declare const COLUMN: "column";
export declare const SHAPE: "shape";
export declare const SIZE: "size";
export declare const COLOR: "color";
export declare const TEXT: "text";
export declare const DETAIL: "detail";
export declare const ORDER: "order";
export declare const OPACITY: "opacity";
export declare const TOOLTIP: "tooltip";
export declare const HREF: "href";
export declare const CHANNELS: Channel[];
/**
 * Channels that cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projecttion won't work with "detail" and "order".)
 */
export declare const SINGLE_DEF_CHANNELS: SingleDefChannel[];
export declare type SingleDefChannel = 'x' | 'y' | 'x2' | 'y2' | 'row' | 'column' | 'size' | 'shape' | 'color' | 'opacity' | 'text' | 'tooltip' | 'href';
export declare function isChannel(str: string): str is Channel;
export declare const UNIT_CHANNELS: ("text" | "x" | "y" | "x2" | "y2" | "color" | "opacity" | "size" | "shape" | "detail" | "tooltip" | "href" | "order")[];
export declare const NONPOSITION_CHANNELS: ("text" | "color" | "opacity" | "size" | "shape" | "detail" | "tooltip" | "href" | "order")[];
export declare type NonPositionChannel = typeof NONPOSITION_CHANNELS[0];
export declare const POSITION_SCALE_CHANNELS: ("x" | "y")[];
export declare type PositionScaleChannel = typeof POSITION_SCALE_CHANNELS[0];
export declare const NONPOSITION_SCALE_CHANNELS: ("color" | "opacity" | "size" | "shape")[];
export declare type NonPositionScaleChannel = typeof NONPOSITION_SCALE_CHANNELS[0];
/** List of channels with scales */
export declare const SCALE_CHANNELS: ("x" | "y" | "color" | "opacity" | "size" | "shape")[];
export declare type ScaleChannel = typeof SCALE_CHANNELS[0];
export declare function isScaleChannel(channel: Channel): channel is ScaleChannel;
export interface SupportedMark {
    point?: boolean;
    tick?: boolean;
    rule?: boolean;
    circle?: boolean;
    square?: boolean;
    bar?: boolean;
    rect?: boolean;
    line?: boolean;
    geoshape?: boolean;
    area?: boolean;
    text?: boolean;
}
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export declare function supportMark(channel: Channel, mark: Mark): boolean;
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
export declare function getSupportedMark(channel: Channel): SupportedMark;
export declare function rangeType(channel: Channel): RangeType;
