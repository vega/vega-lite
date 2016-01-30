import {axis, Axis} from './axis.schema';
import {bin, Bin} from './bin.schema';
import {legend, Legend} from './legend.schema';
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

const fieldDef = {
  type: 'object',
  properties: {
    field: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: [NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL]
    },
    bin: bin,
    timeUnit: {
      type: 'string',
      enum: TIMEUNITS,
      supportedTypes: toMap([TEMPORAL])
    },
    sort: sort
  }
};

export const aggregate = {
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

const aggregableFieldDefWithScale = mergeDeep(duplicate(fieldDef), {
  properties: {
    aggregate: aggregate,
    scale: typicalScale
  }
});

export const positionFieldDef = mergeDeep(duplicate(aggregableFieldDefWithScale), {
  required: ['field', 'type'], // TODO: remove if possible
  properties: {
    scale: {
      // replacing default values for just these two axes
      properties: {
        padding: {default: 1},
        bandWidth: {default: 21}
      }
    },
    axis: axis
  }
});

export const colorFieldDef = mergeDeep(duplicate(aggregableFieldDefWithScale), {
  properties: {
    legend: legend
  }
});

export const sizeFieldDef = colorFieldDef;

// no scale
const orderFieldDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    aggregate: aggregate
  }
});

export const orderFieldDefs = {
  default: undefined,
  oneOf: [duplicate(orderFieldDef), {
    type: 'array',
    items: duplicate(orderFieldDef)
  }]
};

export const textFieldDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    aggregate: aggregate,
    value: {
      type: 'string',
      default: 'Abc'
    }
  }
});

const ordinalOnlyFieldDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    scale: ordinalOnlyScale
  }
});

export const shapeFieldDef =  mergeDeep(duplicate(ordinalOnlyFieldDef), {
  properties: {
    legend: legend
  }
});

export const facetFieldDef = mergeDeep(duplicate(ordinalOnlyFieldDef), {
  required: ['field', 'type'],
  properties: {
    axis: axis
  }
});
