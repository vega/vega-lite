/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

export const X = 'x';
export const Y = 'y';
export const ROW = 'row';
export const COLUMN = 'column';
export const SHAPE = 'shape';
export const SIZE = 'size';
export const COLOR = 'color';
export const TEXT = 'text';
export const DETAIL = 'detail';

export const CHANNELS = [X, Y, ROW, COLUMN, SIZE, SHAPE, COLOR, TEXT, DETAIL];

export type Channel = string;

interface SupportedMarktype {
  [marktype: string]: boolean;
};

/**
 * Return whether a channel supports a particular mark type.
 * @param  {string} channel  channel name
 * @param  {string} marktype
 * @return {boolean}
 */
export function supportMarktype(channel: Channel, marktype) {
  return !!getSupportedMarktype(channel)[marktype];
}

/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param  {Enctype.Type}  channel
 * @return {SupportedRole} A dictionary mapping mark types to boolean values.
 */
export function getSupportedMarktype(channel: Channel): SupportedMarktype {
  switch (channel) {
    case X:
    case Y:
      return {
        point: true, tick: true, circle: true, square: true ,
        bar: true, line: true, area: true
      };
    case ROW:
    case COLUMN:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, line: true, area: true, text: true
      };
    case SIZE:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, text: true
      };
    case COLOR:
    case DETAIL:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, line: true, area: true, text: true
      };
    case SHAPE:
      return {point: true};
    case TEXT:
      return {text: true};
  }
  return {};
}

interface SupportedRole {
  [role:string]:boolean;
};

/**
 * Return whether a channel supports dimension / measure role
 * @param  {Enctype.Type}  channel
 * @return {SupportedRole} A dictionary mapping role to boolean values.
 */
export function getSupportedRole(channel: Channel): SupportedRole {
  switch (channel) {
    case X:
    case Y:
    case COLOR:
      return {
        measure: true,
        dimension: true
      };
    case ROW:
    case COLUMN:
    case SHAPE:
    case DETAIL:
      return {
        measure: false,
        dimension: true
      };
    case SIZE:
    case TEXT:
      return {
        measure: true,
        dimension: false
      };
  }
  throw new Error('Invalid encoding channel' + channel);
}
