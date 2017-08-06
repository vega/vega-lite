/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

import {RangeType} from './compile/scale/type';
import {Encoding} from './encoding';
import {Facet} from './facet';
import {Mark} from './mark';
import {SCALE_TYPES, ScaleType} from './scale';
import {contains, toSet, without} from './util';


export namespace Channel {
  // Facet
  export const ROW: 'row' = 'row';
  export const COLUMN: 'column' = 'column';

  // Position
  export const X: 'x' = 'x';
  export const Y: 'y' = 'y';
  export const X2: 'x2' = 'x2';
  export const Y2: 'y2' = 'y2';

  // Mark property with scale
  export const COLOR: 'color' = 'color';
  export const SHAPE: 'shape' = 'shape';
  export const SIZE: 'size' = 'size';
  export const OPACITY: 'opacity' = 'opacity';

  // Non-scale channel
  export const TEXT: 'text' = 'text';
  export const ORDER: 'order' = 'order';
  export const DETAIL: 'detail' = 'detail';
  export const TOOLTIP: 'tooltip' = 'tooltip';
}

export type Channel = keyof Encoding<any> | keyof Facet<any>;

export const X = Channel.X;
export const Y = Channel.Y;
export const X2 = Channel.X2;
export const Y2 = Channel.Y2;
export const ROW = Channel.ROW;
export const COLUMN = Channel.COLUMN;
export const SHAPE = Channel.SHAPE;
export const SIZE = Channel.SIZE;
export const COLOR = Channel.COLOR;
export const TEXT = Channel.TEXT;
export const DETAIL = Channel.DETAIL;
export const ORDER = Channel.ORDER;
export const OPACITY = Channel.OPACITY;
export const TOOLTIP = Channel.TOOLTIP;


export const CHANNELS = [X, Y, X2, Y2, ROW, COLUMN, SIZE, SHAPE, COLOR, ORDER, OPACITY, TEXT, DETAIL, TOOLTIP];
const CHANNEL_INDEX = toSet(CHANNELS);

/**
 * Channels cannot have an array of channelDef.
 * model.fieldDef, getFieldDef only work for these channels.
 *
 * (The only two channels that can have an array of channelDefs are "detail" and "order".
 * Since there can be multiple fieldDefs for detail and order, getFieldDef/model.fieldDef
 * are not applicable for them.  Similarly, selection projecttion won't work with "detail" and "order".)
 */
export const SINGLE_DEF_CHANNELS = [X, Y, X2, Y2, ROW, COLUMN, SIZE, SHAPE, COLOR, OPACITY, TEXT, TOOLTIP];

// export type SingleDefChannel = typeof SINGLE_DEF_CHANNELS[0];
// FIXME somehow the typeof above leads to the following error when running npm run schema
// UnknownNodeError: Unknown node "SingleDefChannel" (ts.SyntaxKind = 171) at /Users/kanitw/Documents/_code/_idl/_visrec/vega-lite/src/selection.ts(17,14)
export type SingleDefChannel = 'x' | 'y' | 'x2' | 'y2' | 'row' | 'column' | 'size' | 'shape' | 'color' | 'opacity' | 'text' | 'tooltip';

export function isChannel(str: string): str is Channel {
  return !!CHANNEL_INDEX[str];
}

// CHANNELS without COLUMN, ROW
export const UNIT_CHANNELS = [X, Y, X2, Y2, SIZE, SHAPE, COLOR, ORDER, OPACITY, TEXT, DETAIL, TOOLTIP];

/** List of channels with scales */
export const SCALE_CHANNELS = [X, Y, SIZE, SHAPE, COLOR, OPACITY];
export type ScaleChannel = typeof SCALE_CHANNELS[0];

const SCALE_CHANNEL_INDEX = toSet(SCALE_CHANNELS);

export function isScaleChannel(channel: Channel): channel is ScaleChannel {
  return !!SCALE_CHANNEL_INDEX[channel];
}

// UNIT_CHANNELS without X, Y, X2, Y2;
export const NONSPATIAL_CHANNELS = [SIZE, SHAPE, COLOR, ORDER, OPACITY, TEXT, DETAIL, TOOLTIP];

// X and Y;
export const SPATIAL_SCALE_CHANNELS = [X, Y];
export type SpatialScaleChannel = typeof SPATIAL_SCALE_CHANNELS[0];

// SCALE_CHANNELS without X, Y;
export const NONSPATIAL_SCALE_CHANNELS = [SIZE, SHAPE, COLOR, OPACITY];
export type NonspatialScaleChannel = typeof NONSPATIAL_SCALE_CHANNELS[0];

export const LEVEL_OF_DETAIL_CHANNELS = without(NONSPATIAL_CHANNELS, ['order'] as Channel[]);

/** Channels that can serve as groupings for stacked charts. */
export const STACK_BY_CHANNELS = [COLOR, DETAIL, ORDER, OPACITY, SIZE];
export type StackByChannel = typeof STACK_BY_CHANNELS[0];

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
  tooltip?: boolean;
}

/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export function supportMark(channel: Channel, mark: Mark) {
  return mark in getSupportedMark(channel);
}

/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
export function getSupportedMark(channel: Channel): SupportedMark {
  switch (channel) {
    case COLOR:
    case DETAIL:
    case TOOLTIP:
    case ORDER:    // TODO: revise (order might not support rect, which is not stackable?)
    case OPACITY:
    case ROW:
    case COLUMN:
      return { // all marks
        point: true, tick: true, rule: true, circle: true, square: true,
        bar: true, rect: true, line: true, area: true, text: true, geoshape: true
      };
    case X:
    case Y:
      return { // all marks
        point: true, tick: true, rule: true, circle: true, square: true,
        bar: true, rect: true, line: true, area: true, text: true
      };
    case X2:
    case Y2:
      return {
        rule: true, bar: true, rect: true, area: true
      };
    case SIZE:
      return {
        point: true, tick: true, rule: true, circle: true, square: true,
        bar: true, text: true, line: true
      };
    case SHAPE:
      return {point: true, geoshape: true};
    case TEXT:
      return {text: true};
  }
}

export function hasScale(channel: Channel) {
  return !contains([DETAIL, TEXT, ORDER, TOOLTIP], channel);
}

// Position does not work with ordinal (lookup) scale and sequential (which is only for color)
const POSITION_SCALE_TYPE_INDEX = toSet(without(SCALE_TYPES, ['ordinal', 'sequential'] as ScaleType[]));

export function supportScaleType(channel: Channel, scaleType: ScaleType): boolean {
  switch (channel) {
    case ROW:
    case COLUMN:
      return scaleType === 'band'; // row / column currently supports band only
    case X:
    case Y:
    case SIZE: // TODO: size and opacity can support ordinal with more modification
    case OPACITY:
      // Although it generally doesn't make sense to use band with size and opacity,
      // it can also work since we use band: 0.5 to get midpoint.
      return scaleType in POSITION_SCALE_TYPE_INDEX;
    case COLOR:
      return scaleType !== 'band';    // band does not make sense with color
    case SHAPE:
      return scaleType === 'ordinal'; // shape = lookup only
  }
  /* istanbul ignore next: it should never reach here */
  return false;
}

export function rangeType(channel: Channel): RangeType {
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
    // TEXT and TOOLTIP have no scale but have discrete output
    case TEXT:
    case TOOLTIP:
      return 'discrete';

    // Color can be either continuous or discrete, depending on scale type.
    case COLOR:
      return 'flexible';

    // No scale, no range type.
    case DETAIL:
    case ORDER:
      return undefined;
  }
  /* istanbul ignore next: should never reach here. */
  throw new Error('getSupportedRole not implemented for ' + channel);
}
