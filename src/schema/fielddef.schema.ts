import {axis, Axis} from './axis.schema';
import {bin, Bin} from './bin.schema';
import {Legend} from './legend.schema';
import {typicalScale, ordinalOnlyScale, Scale} from './scale.schema';
import {sort, Sort} from './sort.schema';

import {AGGREGATE_OPS} from '../aggregate';
import {toMap, duplicate} from '../util';
import {mergeDeep} from './schemautil';
import {TIMEUNITS} from '../timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL, Type} from '../type';

/**
 *  Interface for any kind of FieldDef;
 *  For simplicity, we do not declare multiple interfaces of FieldDef like
 *  we do for JSON schema.
 */
export interface FieldDef {
  field?: string;
  type?: Type;
  value?: any;

  // function
  timeUnit?: string;
  bin?: boolean | Bin;

  aggregate?: string;
  sort?: Sort | string;

  // override vega components
  axis?: Axis | boolean;
  legend?: Legend | boolean;
  scale?: Scale;

  // TODO: maybe extend this in other app?
  // unused metadata -- for other application
  displayName?: string;
}

export var fieldDef = {
  type: 'object',
  properties: {
    field: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: [NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL]
    },
    timeUnit: {
      type: 'string',
      enum: TIMEUNITS,
      supportedTypes: toMap([TEMPORAL])
    },
    bin: bin,
  }
};

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

export var typicalField = mergeDeep(duplicate(fieldDef), {
  properties: {
    sort: sort,
    aggregate: aggregate
  }
});

export var positionalField = mergeDeep(duplicate(typicalField), {
  required: ['field', 'type'], // TODO: remove if possible
  properties: {
    scale: mergeDeep(duplicate(typicalScale), {
      // replacing default values for just these two axes
      properties: {
        padding: {default: 1},
        bandWidth: {default: 21}
      }
    }),
    axis: axis
  }
});

export var textField = mergeDeep(duplicate(fieldDef), {
  properties: {
    aggregate: aggregate
  }
});

export var onlyOrdinalField = mergeDeep(duplicate(fieldDef), {
  properties: {
    sort: sort,
    scale: ordinalOnlyScale
  }
});

export var facetField = mergeDeep(duplicate(onlyOrdinalField), {
  required: ['field', 'type'],
  properties: {
    sort: sort,
    axis: axis
  }
});
