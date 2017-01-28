/** Constants and utilities for data type */
/** Data type based on level of measurement */

export namespace Type {
  export const QUANTITATIVE: 'quantitative' = 'quantitative';
  export const ORDINAL: 'ordinal' = 'ordinal';
  export const TEMPORAL: 'temporal' = 'temporal';
  export const NOMINAL: 'nominal' = 'nominal';
}
export type Type = typeof Type.QUANTITATIVE | typeof Type.ORDINAL | typeof Type.TEMPORAL | typeof Type.NOMINAL;

export const QUANTITATIVE = Type.QUANTITATIVE;
export const ORDINAL = Type.ORDINAL;
export const TEMPORAL = Type.TEMPORAL;
export const NOMINAL = Type.NOMINAL;

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
    }
  }
  // If we get invalid input, return undefined type.
  return undefined;
}
