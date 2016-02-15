import {AGGREGATE_OPS} from '../aggregate';
import {ORDINAL, QUANTITATIVE} from '../type';
import {toMap} from '../util';

export type SortEnum = string; // TODO: string literal "ascending", "descending", "none"

export interface SortField {
  field: string;
  op: string;
  order?: string;
}

export const sortEnum = {
  default: 'ascending',
  type: 'string',
  enum: ['ascending', 'descending', 'none']
};

const sortField = { // sort by aggregation of another field
  type: 'object',
  required: ['field', 'op'],
  properties: {
    field: {
      type: 'string',
      description: 'The field name to aggregate over.'
    },
    op: {
      type: 'string',
      enum: AGGREGATE_OPS,
      description: 'The field name to aggregate over.'
    },
    order: {
      type: 'string',
      enum: ['ascending', 'descending']
    }
  }
};

export var sort = {
  default: 'ascending',
  supportedTypes: toMap([QUANTITATIVE, ORDINAL]),
  oneOf: [
    sortEnum,
    sortField
  ]
};
