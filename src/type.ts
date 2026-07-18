import {hasOwnProperty} from 'vega-util';
import {keys} from './util.js';

/**
 * Data type based on level of measurement
 */
export const Type = {
  quantitative: 'quantitative',
  ordinal: 'ordinal',
  temporal: 'temporal',
  nominal: 'nominal',
  geojson: 'geojson',
} as const;

export type Type = keyof typeof Type;

export function isType(t: any): t is Type {
  return hasOwnProperty(Type, t);
}

/**
 * Type-only continuous check (does not consider binning).
 * A binned quantitative field still counts as continuous here, whereas the
 * field-aware `isDiscrete` in `./channeldef.js` treats it as discrete.
 */
export function isContinuous(type: Type): type is 'quantitative' | 'temporal' {
  return type === 'quantitative' || type === 'temporal';
}

/**
 * Type-only discrete check (does not consider binning).
 * For a field-aware version that treats binned quantitative fields as discrete,
 * use `isDiscrete` from `./channeldef.js`.
 * Note: `tooltipRefForEncoding` relies on this type-only check so that binned
 * quantitative fields keep the bin-range tooltip format instead of the
 * discrete format.
 */
export function isDiscrete(type: Type): type is 'ordinal' | 'nominal' {
  return type === 'ordinal' || type === 'nominal';
}

export const QUANTITATIVE = Type.quantitative;
export const ORDINAL = Type.ordinal;
export const TEMPORAL = Type.temporal;
export const NOMINAL = Type.nominal;

export const GEOJSON = Type.geojson;

export type StandardType = 'quantitative' | 'ordinal' | 'temporal' | 'nominal';

export const TYPES = keys(Type);

/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
export function getFullName(type: Type | string): Type | undefined {
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
      case GEOJSON:
        return 'geojson';
    }
  }
  // If we get invalid input, return undefined type.
  return undefined;
}
