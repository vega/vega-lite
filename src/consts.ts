export namespace Table {
  export const SUMMARY = 'summary';
  export const SOURCE = 'source';
  export const STACKED = 'stacked';
}

// export enum Enctype {
//   X, Y, COL, ROW, SIZE, SHAPE, COLOR, TEXT, DETAIL
// }

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
  export const ShortType = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
  };
  /**
   * Mapping from short type names to full type names.
   * @type {Object}
   */
  export const TypeFromShortType = {
    Q: QUANTITATIVE,
    T: TEMPORAL,
    O: ORDINAL,
    N: NOMINAL
  };
}

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
export var MAXBINS_DEFAULT = 15;

export const Shorthand = {
  Delim: '|',
  Assign: '=',
  Type: ',',
  Func: '_'
};
