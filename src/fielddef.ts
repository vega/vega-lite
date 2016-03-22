// utility for a field definition object

import {AggregateOp, AGGREGATE_OPS} from './aggregate';
import {AxisProperties} from './axis';
import {BinProperties} from './bin';
import {LegendProperties} from './legend';
import {Scale} from './scale';
import {SortField, SortOrder} from './sort';
import {TimeUnit} from './timeunit';
import {Type, NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from './type';
import {contains, toMap, isObject, hash} from './util';

export type RepeatRef = {
  repeat: string
}
export type Field = string | RepeatRef;

export function isRepeatRef(field: Field): field is RepeatRef {
  if (isObject(field)) {
    return 'repeat' in (field as any);
  }
  return false;
}

/**
 *  Interface for any kind of FieldDef;
 *  For simplicity, we do not declare multiple interfaces of FieldDef like
 *  we do for JSON schema.
 */
export interface FieldDef {
  field?: Field;
  type?: Type;
  value?: number | string | boolean;

  // function
  timeUnit?: TimeUnit;
  bin?: boolean | BinProperties;
  aggregate?: AggregateOp;

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
  sort?: SortField | SortOrder;
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
  sort?: SortOrder;
}

// TODO: consider if we want to distinguish ordinalOnlyScale from scale
export type FacetChannelDef = PositionChannelDef;



export interface FieldRefOption {
  /** exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** exclude aggregation function */
  noAggregate?: boolean;
  /** include 'datum.' */
  datum?: boolean;
  /** replace fn with custom function prefix */
  fn?: string;
  /** prepend fn with custom function prefix */
  prefn?: string;
  /** append suffix to the field ref for bin (default='_start') */
  binSuffix?: string;
  /** append suffix to the field ref (general) */
  suffix?: string;
}

export function field(fieldDef: FieldDef, opt: FieldRefOption = {}) {
  const prefix = (opt.datum ? 'datum.' : '') + (opt.prefn || '');
  const suffix = opt.suffix || '';
  const field = fieldDef.field;

  if (isCount(fieldDef)) {
    return prefix + 'count' + suffix;
  } else if (opt.fn) {
    return prefix + opt.fn + '_' + field + suffix;
  } else if (!opt.nofn && fieldDef.bin) {
    return prefix + 'bin_' + field + (opt.binSuffix || suffix || '_start');
  } else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
    return prefix + fieldDef.aggregate + '_' + field + suffix;
  } else if (!opt.nofn && fieldDef.timeUnit) {
    return prefix + fieldDef.timeUnit + '_' + field + suffix;
  } else {
    return prefix + field;
  }
}

function _isFieldDimension(fieldDef: FieldDef) {
  return contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin ||
    (fieldDef.type === TEMPORAL && !!fieldDef.timeUnit);
}

export function isDimension(fieldDef: FieldDef) {
  return fieldDef && fieldDef.field && _isFieldDimension(fieldDef);
}

export function isMeasure(fieldDef: FieldDef) {
  return fieldDef && fieldDef.field && !_isFieldDimension(fieldDef);
}

export const COUNT_DISPLAYNAME = 'Number of Records';

export function count(): FieldDef {
  return { field: '*', aggregate: AggregateOp.COUNT, type: QUANTITATIVE, displayName: COUNT_DISPLAYNAME };
}

export function isCount(fieldDef: FieldDef) {
  return fieldDef.aggregate === AggregateOp.COUNT;
}

export function title(fieldDef: FieldDef) {
  if (isCount(fieldDef)) {
    return COUNT_DISPLAYNAME;
  }
  const fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
  if (fn) {
    return fn.toString().toUpperCase() + '(' + fieldDef.field + ')';
  } else {
    return hash(fieldDef.field);
  }
}
