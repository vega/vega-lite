import {AxisProperties} from './axis.schema';
import {BinProperties} from './bin.schema';
import {LegendProperties} from './legend.schema';
import {Scale} from './scale.schema';
import {SortField, SortEnum} from './sort.schema';

import {AGGREGATE_OPS} from '../aggregate';
import {toMap} from '../util';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL, Type} from '../type';

/**
 *  Interface for any kind of FieldDef;
 *  For simplicity, we do not declare multiple interfaces of FieldDef like
 *  we do for JSON schema.
 */
export interface FieldDef {
  field?: string;
  type?: Type;
  value?: number | string | boolean;

  // function
  timeUnit?: string;
  bin?: boolean | BinProperties;
  aggregate?: string;

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
export interface ChannelDefWithScale extends FieldDef {
  scale?: Scale;
  sort?: SortField | SortEnum;
}

export interface PositionChannelDef extends ChannelDefWithScale {
  axis?: boolean | AxisProperties;
}
export interface ChannelDefWithLegend extends ChannelDefWithScale {
  legend?: LegendProperties;
}

// Detail

// Order Path have no scale

export interface OrderChannelDef extends FieldDef {
  sort?: SortEnum;
}

// TODO: consider if we want to distinguish ordinalOnlyScale from scale
export type FacetChannelDef = PositionChannelDef;
