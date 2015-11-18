/**
 * Names for data sources / table for output vega
 */
export namespace Table {
  export const SUMMARY = 'summary';
  export const SOURCE = 'source';
  export const STACKED = 'stacked';
}

// export enum Enctype {
//   X, Y, COL, ROW, SIZE, SHAPE, COLOR, TEXT, DETAIL
// }

/**
 * Encoding Channel
 */
export namespace Enctype {
  export const X = 'x';
  export const Y = 'y';
  export const ROW = 'row';
  export const COL = 'col';
  export const SHAPE = 'shape';
  export const SIZE = 'size';
  export const COLOR = 'color';
  export const TEXT = 'text';
  export const DETAIL = 'detail';

  export const LIST = [
    Enctype.X, Enctype.Y,
    Enctype.ROW, Enctype.COL,
    Enctype.SIZE, Enctype.SHAPE, Enctype.COLOR,
    Enctype.TEXT, Enctype.DETAIL
  ];

  export type Type = string;

  interface SupportedRole {
    [role:string]:boolean;
  };

  /**
   * @param  {Enctype.Type}  channel
   * @return {SupportedRole} return whether a channel supports dimension / measure role
   */
  export function getSupportedRole(channel: Enctype.Type): SupportedRole {
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
}

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
