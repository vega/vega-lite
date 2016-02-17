import {AGGREGATE_OPS} from '../aggregate';
import {ORDINAL, QUANTITATIVE} from '../type';
import {toMap} from '../util';

export type SortEnum = string; // TODO: string literal "ascending", "descending", "none"

export interface SortField {
  /** The field name to aggregate over. */
  field: string;
  /** The field name to aggregate over. */
  op: string;
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
      type: 'string',
      enum: AGGREGATE_OPS
    },
    order: {
      type: 'string',
      enum: ['ascending', 'descending']
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
