/** Constants and utilities for data type */

export const QUANTITATIVE = 'quantitative';
export const ORDINAL = 'ordinal';
export const TEMPORAL = 'temporal';
export const NOMINAL = 'nominal';

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
 * @param  {String} type
 * @return {String} Full type name.
 */
export function getFullName(type: string): string {
  return TYPE_FROM_SHORT_TYPE[type.toUpperCase()] || // short type is uppercase by default
         type.toLowerCase();
}
