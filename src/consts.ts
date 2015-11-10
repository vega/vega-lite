export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED = 'stacked';
export const INDEX = 'index';

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
}

// export enum Type {
//   Q,  // Quantitative
//   O,  // Ordinal
//   N,  // Nominal
//   T,  // Time
// };

export namespace Type {
  export const O = 'O';
  export const Q = 'Q';
  export const N = 'N';
  export const T = 'T';
}

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
