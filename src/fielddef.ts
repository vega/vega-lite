// utility for a field definition object

import {AggregateOp} from './aggregate';
import {Axis} from './axis';
import {Bin} from './bin';
import {Channel, getSupportedRole} from './channel';
import {Config} from './config';
import {Legend} from './legend';
import * as log from './log';
import {Scale} from './scale';
import {SortField, SortOrder} from './sort';
import {TimeUnit} from './timeunit';
import {Type, NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL, getFullName} from './type';
import {contains} from './util';

/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef<T> {
  /**
   * A constant value in visual domain.
   */
  value?: T;
}

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
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

export interface ScaleFieldDef extends FieldDef {
  scale?: Scale;
  sort?: SortField | SortOrder;
}

export interface PositionFieldDef extends ScaleFieldDef {
  /**
   * @nullable
   */
  axis?: Axis;
}
export interface LegendFieldDef extends ScaleFieldDef {
   /**
    * @nullable
    */
  legend?: Legend;
}

// Detail

// Order Path have no scale

export interface OrderFieldDef extends FieldDef {
  sort?: SortOrder;
}

export type ChannelDef = FieldDef | ValueDef<any>;

export function isFieldDef(channelDef: ChannelDef): channelDef is FieldDef | PositionFieldDef | LegendFieldDef | OrderFieldDef  {
  return channelDef && !!channelDef['field'];
}

export function isValueDef(channelDef: ChannelDef): channelDef is ValueDef<any> {
  return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}

// TODO: consider if we want to distinguish ordinalOnlyScale from scale
export type FacetFieldDef = PositionFieldDef;

export interface FieldRefOption {
  /** exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** exclude aggregation function */
  noAggregate?: boolean;
  /** Wrap the field inside datum[...] per Vega convention */
  datum?: boolean;
  /** prepend fn with custom function prefix */
  prefix?: string;
  /** append suffix to the field ref for bin (default='start') */
  binSuffix?: 'start' | 'end' | 'range';
  /** append suffix to the field ref (general) */
  suffix?: string;
}

export function field(fieldDef: FieldDef, opt: FieldRefOption = {}) {
  let field = fieldDef.field;
  let prefix = opt.prefix;
  let suffix = opt.suffix;

  if (isCount(fieldDef)) {
    field = 'count_*';
  } else {
    let fn: string = undefined;

    if (!opt.nofn) {
      if (fieldDef.bin) {
        fn = 'bin';
        suffix = opt.binSuffix;
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
  return fieldDef && isFieldDef(fieldDef) && _isFieldDimension(fieldDef);
}

export function isMeasure(fieldDef: FieldDef) {
  return fieldDef && isFieldDef(fieldDef) && !_isFieldDimension(fieldDef);
}

export function count(): FieldDef {
  return {field: '*', aggregate: 'count', type: QUANTITATIVE};
}

export function isCount(fieldDef: FieldDef) {
  return fieldDef.aggregate === 'count';
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

export function defaultType(fieldDef: FieldDef, channel: Channel): Type {
  if (!!fieldDef.timeUnit) {
    return 'temporal';
  }
  if (!!fieldDef.bin) {
    return 'quantitative';
  }
  const canBeMeasure = getSupportedRole(channel).measure;
  return canBeMeasure ? 'quantitative' : 'nominal';
}

/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(fieldDef: FieldDef, channel: Channel) {
  // If a fieldDef contains a field, we need type.
  if (fieldDef.field) { // TODO: or datum
    // convert short type to full type
    const fullType = getFullName(fieldDef.type);
    if (fullType) {
      fieldDef.type = fullType;
    } else {
      // If type is empty / invalid, then augment with default type
      const newType = defaultType(fieldDef, channel);
      log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
      fieldDef.type = newType;
    }
  }
  return fieldDef;
}
