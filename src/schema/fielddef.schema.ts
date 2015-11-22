import {Axis} from './axis.schema';
import {bin, Bin} from './bin.schema';
import {Legend} from './legend.schema';
import {typicalScale, ordinalOnlyScale, Scale} from './scale.schema';
import {Sort} from './sort.schema';

import {AGGREGATE_OPS} from '../aggregate';
import {toMap, duplicate} from '../util';
import {merge} from './schemautil';
import {TIMEUNITS} from '../timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';

export interface FieldDef {
  field?: string;
  type?: string;
  value?: any;

  // function
  aggregate?: string;
  timeUnit?: string;
  bin?: boolean | Bin;

  sort?: Sort | string;

  // override vega components
  axis?: Axis;
  legend?: Legend | boolean;
  scale?: Scale;

  // text
  align?: string;
  baseline?: string;
  color?: string;
  margin?: number;
  placeholder?: string;
  font?: any; // declare font
  format?: string;

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

export var typicalField = merge(duplicate(fieldDef), {
  properties: {
    aggregate: aggregate,
    scale: typicalScale
  }
});

export var onlyOrdinalField = merge(duplicate(fieldDef), {
  properties: {
    aggregate: {
      type: 'string',
      enum: ['count'],
      supportedTypes: toMap([NOMINAL, ORDINAL])
    },
    scale: ordinalOnlyScale
  }
});
