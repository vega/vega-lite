import {AGGREGATE_OPS} from '../aggregate';
import {ORDINAL, QUANTITATIVE} from '../type';
import {toMap} from '../util';

export type SortEnum = string; // TODO: string literal "ascending", "descending", "none"

export interface SortField {
  /**
   * The field name to aggregate over.
   */
  field: string;
  /**
   * The field name to aggregate over.
   * @enum ["values", "count", "valid", "missing", "distinct",
   *   "sum", "mean", "average", "variance", "variancep", "stdev",
   *   "stdevp", "median", "q1", "q3", "modeskew", "min", "max",
   *   "argmin", "argmax"]
   *
   */
  op: string;

  /**
   * @enum: ["ascending", "descending"]
   */
  order?: string;
}

export const sortEnum = {
  type: 'string',
  enum: ['ascending', 'descending', 'none']
};

const sortField = { // sort by aggregation of another field
  type: 'object',
  required: ['field', 'op'],
  properties: {
    field: {
      type: 'string'
    },
    op: {
      type: 'string'
    },
    order: {
      type: 'string'
    }
  }
};

export var sort = {
  supportedTypes: toMap([QUANTITATIVE, ORDINAL]),
  oneOf: [
    sortEnum,
    sortField
  ]
};
