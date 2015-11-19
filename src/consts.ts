/** Constants for data type */
export namespace Type {
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
  export function getFullName(type: String) {
    return Type.TYPE_FROM_SHORT_TYPE[type.toUpperCase()] || // short type is uppercase by default
           type.toLowerCase();
  }
}

//TODO this should become TIMEUNIT.LIST
export const TIMEUNITS = [
  'year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'
];

// TODO: see if there is a nice way to import from Vega schema
export const AGGREGATE_OPS = [
  'values', 'count', 'valid', 'missing', 'distinct',
  'sum', 'mean', 'average', 'variance', 'variancep', 'stdev',
  'stdevp', 'median', 'q1', 'q3', 'modeskew', 'min', 'max',
  'argmin', 'argmax'
];

// TODO: remove
export const MAXBINS_DEFAULT = 15;

export namespace Shorthand {
  export const DELIM = '|';
  export const ASSIGN = '=';
  export const TYPE = ',';
  export const FUNC = '_';
}
