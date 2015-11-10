export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED = 'stacked';
export const INDEX = 'index';

export enum Enctype {
  X, Y, COL, ROW, SIZE, SHAPE, COLOR, TEXT, DETAIL
}

export enum Type {
  Q,  // Quantitative
  O,  // Ordinal
  N,  // Nominal
  T,  // Time
};

export const ENCODING_TYPES = [
  Enctype.X, Enctype.Y,
  Enctype.ROW, Enctype.COL,
  Enctype.SIZE, Enctype.SHAPE, Enctype.COLOR, Enctype.TEXT, Enctype.DETAIL
];

export const SHORTHAND = {
  delim: '|',
  assign: '=',
  type: ',',
  func: '_'
};
