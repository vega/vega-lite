import {toMap} from '../util';
import {TimeUnits, Type, ValidAggregateOps, MAXBINS_DEFAULT} from '../consts';

var Q = Type[Type.Q];
var O = Type[Type.O];
var N = Type[Type.N];
var T = Type[Type.T];

export var aggregate = {
  type: 'string',
  enum: ValidAggregateOps,
  supportedEnums: {
    Q: ValidAggregateOps,
    O: ['median','min','max'],
    N: [],
    T: ['mean', 'median', 'min', 'max'], // TODO: revise what should time support
    '': ['count']
  },
  supportedTypes: toMap([Q, N, O, T, ''])
};

export var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    maxbins: {
      type: 'integer',
      default: MAXBINS_DEFAULT,
      minimum: 2,
      description: 'Maximum number of bins.'
    }
  },
  supportedTypes: toMap([Q]) // TODO: add O after finishing #81
};

export var timeUnit = {
  type: 'string',
  enum: TimeUnits,
  supportedTypes: toMap([T])
};

export var sort = {
  default: 'ascending',
  supportedTypes: toMap([Q, O]),
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
          enum: ValidAggregateOps,
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
