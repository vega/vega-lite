import {Flag} from './util';
/** Constants and utilities for data type */
/** Data type based on level of measurement */

export namespace Type {
  export const QUANTITATIVE: 'quantitative' = 'quantitative';
  export const ORDINAL: 'ordinal' = 'ordinal';
  export const TEMPORAL: 'temporal' = 'temporal';
  export const NOMINAL: 'nominal' = 'nominal';

  export const LATITUDE: 'latitude' = 'latitude';
  export const LONGITUDE: 'longitude' = 'longitude';
  export const GEOJSON: 'geojson' = 'geojson';
}
export type BasicType = typeof Type.QUANTITATIVE | typeof Type.ORDINAL | typeof Type.TEMPORAL | typeof Type.NOMINAL;
export type GeoType = typeof Type.LATITUDE | typeof Type.LONGITUDE | typeof Type.GEOJSON;

export type Type = BasicType | GeoType;

const TYPE_INDEX: Flag<Type> = {
  quantitative: 1,
  ordinal: 1,
  temporal: 1,
  nominal: 1,
  latitude: 1,
  longitude: 1,
  geojson: 1
};

export function isType(t: any): t is Type {
  return !!TYPE_INDEX[t];
}

export const QUANTITATIVE = Type.QUANTITATIVE;
export const ORDINAL = Type.ORDINAL;
export const TEMPORAL = Type.TEMPORAL;
export const NOMINAL = Type.NOMINAL;

export const LATITUDE = Type.LATITUDE;
export const LONGITUDE = Type.LONGITUDE;
export const GEOJSON = Type.GEOJSON;

/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
export function getFullName(type: Type|string): Type {
  if (type) {
    type = type.toLowerCase();
    switch (type) {
      case 'q':
      case QUANTITATIVE:
        return 'quantitative';
      case 't':
      case TEMPORAL:
        return 'temporal';
      case 'o':
      case ORDINAL:
        return 'ordinal';
      case 'n':
      case NOMINAL:
        return 'nominal';
      case LATITUDE:
        return 'latitude';
      case LONGITUDE:
        return 'longitude';
      case GEOJSON:
        return 'geojson';
    }
  }
  // If we get invalid input, return undefined type.
  return undefined;
}
