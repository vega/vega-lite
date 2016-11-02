/** Constants and utilities for data type */

export namespace Type {
  export const QUANTITATIVE: 'quantitative' = 'quantitative';
  export type QUANTITATIVE = typeof QUANTITATIVE;
  export const ORDINAL: 'ordinal' = 'ordinal';
  export type ORDINAL = typeof ORDINAL;
  export const TEMPORAL: 'temporal' = 'temporal';
  export type TEMPORAL = typeof TEMPORAL;
  export const NOMINAL: 'nominal' = 'nominal';
  export type NOMINAL = typeof NOMINAL;
}
export type Type = Type.QUANTITATIVE | Type.ORDINAL | Type.TEMPORAL | Type.NOMINAL;

export const QUANTITATIVE = Type.QUANTITATIVE;
export const ORDINAL = Type.ORDINAL;
export const TEMPORAL = Type.TEMPORAL;
export const NOMINAL = Type.NOMINAL;

/**
 * Mapping from full type names to short type names.
 * @type {Object}
 */
export const SHORT_TYPE = {
  quantitative: 'Q',
  temporal: 'T',
  nominal: 'N',
  ordinal: 'O'
};
/**
 * Mapping from short type names to full type names.
 * @type {Object}
 */
export const TYPE_FROM_SHORT_TYPE = {
  Q: QUANTITATIVE,
  T: TEMPORAL,
  O: ORDINAL,
  N: NOMINAL
};

/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
export function getFullName(type: Type): Type {
  const typeString = <any>type;  // force type as string so we can translate short types
  return TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] || // short type is uppercase by default
         typeString.toLowerCase();
}
