import {toMap} from '../util';
import {TIMEUNITS, AGGREGATE_OPS, MAXBINS_DEFAULT} from '../consts';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';

export var aggregate = {
  type: 'string',
  enum: AGGREGATE_OPS,
  supportedEnums: {
    quantitative: AGGREGATE_OPS,
    ordinal: ['median','min','max'],
    nominal: [],
    temporal: ['mean', 'median', 'min', 'max'], // TODO: revise what should time support
    '': ['count']
  },
  supportedTypes: toMap([QUANTITATIVE, NOMINAL, ORDINAL, TEMPORAL, ''])
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
  supportedTypes: toMap([QUANTITATIVE]) // TODO: add O after finishing #81
};

export var timeUnit = {
  type: 'string',
  enum: TIMEUNITS,
  supportedTypes: toMap([TEMPORAL])
};

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

export var stack = {
  type: ['boolean', 'object'],
  default: true,
  description: 'Enable stacking (for bar and area marks only).',
  properties: {
    reverse: {
      type: 'boolean',
      default: false,
      description: 'Whether to reverse the stack\'s sortby.'
    },
    offset: {
      type: 'string',
      default: undefined,
      enum: ['zero', 'center', 'normalize']
      // TODO(#620) refer to Vega spec once it doesn't throw error
      // enum: vgStackSchema.properties.offset.oneOf[0].enum
    }
  }
};
