import {AGGREGATE_OPS} from '../aggregate';
import {ORDINAL, QUANTITATIVE} from '../type';
import {toMap} from '../util';

export interface Sort {
  field: string;
  op: string;
  order?: string;
}

export var sort = {
  default: 'ascending',
  supportedTypes: toMap([QUANTITATIVE, ORDINAL]),
  oneOf: [
    {
      type: 'string',
      enum: ['ascending', 'descending', 'unsorted']
    },
    { // sort by aggregation of another field
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
    }
  ]
};
