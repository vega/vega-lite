import {toMap} from '../util';
import {TIMEUNITS, Type, AGGREGATE_OPS, MAXBINS_DEFAULT} from '../consts';

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
  supportedTypes: toMap([Type.Quantitative, Type.Nominal, Type.Ordinal, Type.Temporal, ''])
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
  supportedTypes: toMap([Type.Quantitative]) // TODO: add O after finishing #81
};

export var timeUnit = {
  type: 'string',
  enum: TIMEUNITS,
  supportedTypes: toMap([Type.Temporal])
};

export var sort = {
  default: 'ascending',
  supportedTypes: toMap([Type.Quantitative, Type.Ordinal]),
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
