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
