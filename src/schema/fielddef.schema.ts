import {axis, Axis} from './axis.schema';
import {bin, Bin} from './bin.schema';
import {legend, Legend} from './legend.schema';
import {typicalScale, ordinalOnlyScale, Scale} from './scale.schema';
import {sort, sortEnum, Sort} from './sort.schema';

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

const fieldDef = {
  type: 'object',
  properties: {
    field: {
      type: 'string'
    },
    value: {
      type: ['string', 'number']
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
    aggregate: aggregate,
  }
};

export interface ChannelDefWithScale extends FieldDef {
  scale?: Scale;
  sort?: Sort;
}

const channelDefWithScale = mergeDeep(duplicate(fieldDef), {
  properties: {
    scale: typicalScale,
    sort: sort
  }
});


export interface PositionChannelDef extends ChannelDefWithScale {
  axis?: Axis;
}

export const positionChannelDef = mergeDeep(duplicate(channelDefWithScale), {
  required: ['field', 'type'], // TODO: remove if possible
  properties: {
    scale: {
      // TODO: remove
      // replacing default values for just these two axes
      properties: {
        padding: {default: 1}
      }
    },
    axis: axis
  }
});

export interface ChannelDefWithLegend extends ChannelDefWithScale {
  legend?: Legend;
}

export const channelDefWithLegend = mergeDeep(duplicate(channelDefWithScale), {
  properties: {
    legend: legend
  }
});

// Detail
export const detailChannelDefs = {
  default: undefined,
  oneOf: [duplicate(fieldDef), {
    type: 'array',
    items: duplicate(fieldDef)
  }]
};

// Order Path have no scale

export interface OrderChannelDef extends FieldDef {
  sort?: Sort;
}

const orderChannelDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    sort: sortEnum
  }
});

export const orderChannelDefs = {
  default: undefined,
  oneOf: [duplicate(orderChannelDef), {
    type: 'array',
    items: duplicate(orderChannelDef)
  }]
};

// Text has default value = `Abc`
export const textChannelDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    value: {
      type: 'string',
      default: 'Abc' // TODO: move this default into config!
    }
  }
});

// Shape / Row / Column only supports ordinal scale

const ordinalChannelDef = mergeDeep(duplicate(fieldDef), {
  properties: {
    scale: ordinalOnlyScale,
    sort: sort
  }
});

export const shapeChannelDef =  mergeDeep(duplicate(ordinalChannelDef), {
  properties: {
    legend: legend
  }
});

// TODO: consider if we want to distinguish ordinalOnlyScale from scale
export type FacetChannelDef = PositionChannelDef;

export const facetChannelDef = mergeDeep(duplicate(ordinalChannelDef), {
  required: ['field', 'type'],
  properties: {
    axis: axis
  }
});
