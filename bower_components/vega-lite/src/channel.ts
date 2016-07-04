/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

import {Mark} from './mark';
import {contains, without} from './util';

export enum Channel {
  X = 'x' as any,
  Y = 'y' as any,
  X2 = 'x2' as any,
  Y2 = 'y2' as any,
  ROW = 'row' as any,
  COLUMN = 'column' as any,
  SHAPE = 'shape' as any,
  SIZE = 'size' as any,
  COLOR = 'color' as any,
  TEXT = 'text' as any,
  DETAIL = 'detail' as any,
  LABEL = 'label' as any,
  PATH = 'path' as any,
  ORDER = 'order' as any,
  OPACITY = 'opacity' as any
}

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
export const LABEL = Channel.LABEL;
export const PATH = Channel.PATH;
export const ORDER = Channel.ORDER;
export const OPACITY = Channel.OPACITY;

export const CHANNELS = [X, Y, X2, Y2, ROW, COLUMN, SIZE, SHAPE, COLOR, PATH, ORDER, OPACITY, TEXT, DETAIL, LABEL];

export const UNIT_CHANNELS = without(CHANNELS, [ROW, COLUMN]);
export const UNIT_SCALE_CHANNELS = without(UNIT_CHANNELS, [PATH, ORDER, DETAIL, TEXT, LABEL, X2, Y2]);
export const NONSPATIAL_CHANNELS = without(UNIT_CHANNELS, [X, Y, X2, Y2]);
export const NONSPATIAL_SCALE_CHANNELS = without(UNIT_SCALE_CHANNELS, [X, Y, X2, Y2]);

/** Channels that can serve as groupings for stacked charts. */
export const STACK_GROUP_CHANNELS = [COLOR, DETAIL, ORDER, OPACITY, SIZE];

export interface SupportedMark {
  point?: boolean;
  tick?: boolean;
  rule?: boolean;
  circle?: boolean;
  square?: boolean;
  bar?: boolean;
  line?: boolean;
  area?: boolean;
  text?: boolean;
};

/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
export function supportMark(channel: Channel, mark: Mark) {
  return !!getSupportedMark(channel)[mark];
}

/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
export function getSupportedMark(channel: Channel): SupportedMark {
  switch (channel) {
    case X:
    case Y:
    case COLOR:
    case DETAIL:
    case ORDER:
    case OPACITY:
    case ROW:
    case COLUMN:
      return { // all marks
        point: true, tick: true, rule: true, circle: true, square: true,
        bar: true, line: true, area: true, text: true
      };
    case X2:
    case Y2:
      return {
        rule: true, bar: true, area: true
      };
    case SIZE:
      return {
        point: true, tick: true, rule: true, circle: true, square: true,
        bar: true, text: true
      };
    case SHAPE:
      return {point: true};
    case TEXT:
      return {text: true};
    case PATH:
      return {line: true};
  }
  return {};
}

export interface SupportedRole {
  measure: boolean;
  dimension: boolean;
};

/**
 * Return whether a channel supports dimension / measure role
 * @param  channel
 * @return A dictionary mapping role to boolean values.
 */
export function getSupportedRole(channel: Channel): SupportedRole {
  switch (channel) {
    case X:
    case Y:
    case COLOR:
    case OPACITY:
    case LABEL:
    case DETAIL:
      return {
        measure: true,
        dimension: true
      };
    case ROW:
    case COLUMN:
    case SHAPE:
      return {
        measure: false,
        dimension: true
      };
    case X2:
    case Y2:
    case SIZE:
    case TEXT:
      return {
        measure: true,
        dimension: false
      };
    case PATH:
      return {
        measure: false,
        dimension: true
      };
  }
  throw new Error('Invalid encoding channel' + channel);
}

export function hasScale(channel: Channel) {
  return !contains([DETAIL, PATH, TEXT, LABEL, ORDER], channel);
}
