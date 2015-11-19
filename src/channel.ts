/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

export const X = 'x';
export const Y = 'y';
export const ROW = 'row';
export const COL = 'col';
export const SHAPE = 'shape';
export const SIZE = 'size';
export const COLOR = 'color';
export const TEXT = 'text';
export const DETAIL = 'detail';

export const CHANNELS = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, TEXT, DETAIL];

export type Type = string;

interface SupportedRole {
  [role:string]:boolean;
};

/**
 * Return whether a channel supports dimension / measure role
 * @param  {Enctype.Type}  channel
 * @return {SupportedRole} A dictionary mapping role to boolean values.
 */
export function getSupportedRole(channel: Type): SupportedRole {
  switch (channel) {
    case X:
    case Y:
    case COLOR:
      return {
        measure: true,
        dimension: true
      };
    case ROW:
    case COL:
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
  throw new Error("Invalid encoding channel" + channel);
}
