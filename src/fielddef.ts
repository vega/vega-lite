// utility for a field definition object

import {AggregateOp, AGGREGATE_OPS} from './aggregate';
import {Axis} from './axis';
import {Bin} from './bin';
import {Config} from './config';
import {Legend} from './legend';
import {Scale, ScaleType} from './scale';
import {SortField, SortOrder} from './sort';
import {TimeUnit} from './timeunit';
import {Type, NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from './type';
import {contains, getbins, toMap} from './util';

/**
 *  Interface for any kind of FieldDef;
 *  For simplicity, we do not declare multiple interfaces of FieldDef like
 *  we do for JSON schema.
 */
export interface FieldDef {
  /**
   * Name of the field from which to pull a data value.
   */
  field?: string;

  /**
   * The encoded field's type of measurement. This can be either a full type
   * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
   * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
   * This property is case insensitive.
   */
  type?: Type;

  /**
   * A constant value in visual domain.
   */
  value?: number | string | boolean;

  // function

  /**
   * Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`).
   */
  timeUnit?: TimeUnit;

  /**
   * Flag for binning a `quantitative` field, or a bin property object
   * for binning parameters.
   */
  bin?: boolean | Bin;

  /**
   * Aggregation function for the field
   * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
   */
  aggregate?: AggregateOp;

  /**
   * Title for axis or legend.
   */
  title?: string;
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
  axis?: boolean | Axis;
}
export interface ChannelDefWithLegend extends ChannelDefWithScale {
  legend?: Legend;
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
  /** scaleType */
  scaleType?: ScaleType;
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
    const binSuffix = opt.binSuffix || (
      opt.scaleType === ScaleType.ORDINAL ?
        // For ordinal scale type, use `_range` as suffix.
        '_range' :
        // For non-ordinal scale or unknown, use `_start` as suffix.
        '_start'
    );
    return prefix + 'bin_' + field + binSuffix;
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

export function count(): FieldDef {
  return { field: '*', aggregate: AggregateOp.COUNT, type: QUANTITATIVE};
}

export function isCount(fieldDef: FieldDef) {
  return fieldDef.aggregate === AggregateOp.COUNT;
}

// FIXME remove this, and the getbins method
// FIXME this depends on channel
export function cardinality(fieldDef: FieldDef, stats, filterNull = {}) {
  // FIXME need to take filter into account

  const stat = stats[fieldDef.field],
  type = fieldDef.type;

  if (fieldDef.bin) {
    // need to reassign bin, otherwise compilation will fail due to a TS bug.
    const bin = fieldDef.bin;
    let maxbins = (typeof bin === 'boolean') ? undefined : bin.maxbins;
    if (maxbins === undefined) {
      maxbins = 10;
    }

    const bins = getbins(stat, maxbins);
    return (bins.stop - bins.start) / bins.step;
  }
  if (type === TEMPORAL) {
    const timeUnit = fieldDef.timeUnit;
    switch (timeUnit) {
      case TimeUnit.SECONDS: return 60;
      case TimeUnit.MINUTES: return 60;
      case TimeUnit.HOURS: return 24;
      case TimeUnit.DAY: return 7;
      case TimeUnit.DATE: return 31;
      case TimeUnit.MONTH: return 12;
      case TimeUnit.QUARTER: return 4;
      case TimeUnit.YEAR:
        const yearstat = stats['year_' + fieldDef.field];

        if (!yearstat) { return null; }

        return yearstat.distinct -
          (stat.missing > 0 && filterNull[type] ? 1 : 0);
    }
    // otherwise use calculation below
  }
  if (fieldDef.aggregate) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.missing > 0 && filterNull[type] ? 1 : 0);
}

export function title(fieldDef: FieldDef, config: Config) {
  if (fieldDef.title != null) {
    return fieldDef.title;
  }
  if (isCount(fieldDef)) {
    return config.countTitle;
  }
  const fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
  if (fn) {
    return fn.toString().toUpperCase() + '(' + fieldDef.field + ')';
  } else {
    return fieldDef.field;
  }
}
