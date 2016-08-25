// utility for a field definition object

import {AggregateOp} from './aggregate';
import {Axis} from './axis';
import {Bin} from './bin';
import {Config} from './config';
import {Legend} from './legend';
import {Scale, ScaleType} from './scale';
import {SortField, SortOrder} from './sort';
import {TimeUnit} from './timeunit';
import {Type, NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from './type';
import {contains} from './util';

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
  /** Wrap the field inside datum[...] per Vega convention */
  datum?: boolean;
  /** replace fn with custom function prefix */
  fn?: string;
  /** prepend fn with custom function prefix */
  prefix?: string;
  /** scaleType */
  scaleType?: ScaleType;
  /** append suffix to the field ref for bin (default='start') */
  binSuffix?: string;
  /** append suffix to the field ref (general) */
  suffix?: string;
}

export function field(fieldDef: FieldDef, opt: FieldRefOption = {}) {
  let field = fieldDef.field;
  let prefix = opt.prefix;
  let suffix = opt.suffix;

  if (isCount(fieldDef)) {
    field = 'count';
  } else {
    let fn = opt.fn;

    if (!opt.nofn) {
      if (fieldDef.bin) {
        fn = 'bin';

        suffix = opt.binSuffix || (
          opt.scaleType === ScaleType.ORDINAL ?
            // For ordinal scale type, use `range` as suffix.
            'range' :
            // For non-ordinal scale or unknown, use `start` as suffix.
            'start'
        );
      } else if (!opt.noAggregate && fieldDef.aggregate) {
        fn = String(fieldDef.aggregate);
      } else if (fieldDef.timeUnit) {
        fn = String(fieldDef.timeUnit);
      }
    }

    if (!!fn) {
      field = `${fn}_${field}`;
    }
  }

  if (!!suffix) {
    field = `${field}_${suffix}`;
  }

  if (!!prefix) {
    field = `${prefix}_${field}`;
  }

  if (opt.datum) {
    field = `datum["${field}"]`;
  }

  return field;
}

function _isFieldDimension(fieldDef: FieldDef) {
  if (contains([NOMINAL, ORDINAL], fieldDef.type)) {
    return true;
  } else if(!!fieldDef.bin) {
    return true;
  } else if (fieldDef.type === TEMPORAL) {
    return !!fieldDef.timeUnit;
  }
  return false;
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
