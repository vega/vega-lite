import {AGGREGATE_OPS} from '../aggregate';
import {ORDINAL, QUANTITATIVE} from '../type';
import {toMap, isObject} from '../util';

export interface Sort {
  field: string;
  op: string;
  order?: string;
}

export function isSort(object: any): object is Sort {
  // usually, the object is either Sort or boolean so we only do a simple check here
  return isObject(object);
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
