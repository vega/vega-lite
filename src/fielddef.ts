// utility for a field definition object

import {AGGREGATE_OP_INDEX, AggregateOp} from './aggregate';
import {Axis} from './axis';
import {autoMaxBins, Bin, binToString} from './bin';
import {Channel, rangeType} from './channel';
import {CompositeAggregate} from './compositemark';
import {Config} from './config';
import {Field} from './fielddef';
import {Legend} from './legend';
import * as log from './log';
import {Scale} from './scale';
import {SortField, SortOrder} from './sort';
import {StackOffset} from './stack';
import {isDiscreteByDefault, TimeUnit} from './timeunit';
import {getFullName, Type} from './type';
import {isBoolean, isString, stringValue} from './util';

/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef<T> {
  /**
   * A constant value in visual domain.
   */
  value?: T;
}

export interface ConditionalValueDef<T> extends ValueDef<T> {
  condition?: Condition<T>;
}

/**
 * Reference to a repeated value.
 */
export type RepeatRef = {
  repeat: 'row' | 'column'
};

export type Field = string | RepeatRef;

export function isRepeatRef(field: Field): field is RepeatRef {
  return field && !isString(field) && 'repeat' in field;
}

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> {
  /**
   * __Required.__ Name of the field from which to pull a data value.
   *
   * __Note:__ `field` is not required if `aggregate` is `count`.
   */
  field?: F;

  /**
   * The encoded field's type of measurement. This can be either a full type
   * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
   * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
   * This property is case-insensitive.
   */
  type?: Type;


  // function

  /**
   * Time unit for a `temporal` field  (e.g., `year`, `yearmonth`, `month`, `hour`).
   *
   * __Default value:__ `undefined` (None)
   *
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
   *
   * __Default value:__ `undefined` (None)
   *
   */
  aggregate?: AggregateOp | CompositeAggregate;
}

export interface Condition<T> {
  selection: string;
  value: T;
}

export interface ScaleFieldDef<F> extends FieldDef<F> {
  scale?: Scale;
  /**
   * Sort order for a particular field.
   * For quantitative or temporal fields, this can be either `"ascending"` or `"descending"`
   * For quantitative or temporal fields, this can be `"ascending"`, `"descending"`, `"none"`, or a [sort field definition object](sort.html#sort-field) for sorting by an aggregate calculation of a specified sort field.
   *
   * __Default value:__ `"ascending"`
   *
   */
  sort?: SortField | SortOrder;
}

export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
  /**
   * @nullable
   */
  axis?: Axis;

  /**
   * Type of stacking offset if the field should be stacked.
   * "none" or null, if the field should not be stacked.
   */
  stack?: StackOffset;
}
export interface LegendFieldDef<F, T> extends ScaleFieldDef<F> {
   /**
    * @nullable
    */
  legend?: Legend;

  condition?: Condition<T>;
}

// Detail

// Order Path have no scale

export interface OrderFieldDef<F> extends FieldDef<F> {
  sort?: SortOrder;
}

export interface TextFieldDef<F> extends FieldDef<F> {
  // FIXME: add more reference to Vega's format pattern or d3's format pattern.
  condition?: Condition<string|number>;

  /**
   * The formatting pattern for text value. If not defined, this will be determined automatically.
   */
  format?: string;
}

export type ChannelDef<F> = FieldDef<F> | ValueDef<any>;

export function isFieldDef(channelDef: ChannelDef<any>): channelDef is FieldDef<any> | PositionFieldDef<any> | LegendFieldDef<any, any> | OrderFieldDef<any> | TextFieldDef<any> {
  return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}

export function isValueDef(channelDef: ChannelDef<any>): channelDef is ValueDef<any> {
  return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}

export interface FieldRefOption {
  /** exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
  expr?: 'datum' | 'parent';
  /** prepend fn with custom function prefix */
  prefix?: string;
  /** append suffix to the field ref for bin (default='start') */
  binSuffix?: 'start' | 'end' | 'range';
  /** append suffix to the field ref (general) */
  suffix?: string;
  /** Overrride which aggregate to use. Needed for unaggregated domain. */
  aggregate?: AggregateOp;
}

export function field(fieldDef: FieldDef<string>, opt: FieldRefOption = {}): string {
  let field = fieldDef.field;
  const prefix = opt.prefix;
  let suffix = opt.suffix;

  if (isCount(fieldDef)) {
    field = 'count_*';
  } else {
    let fn: string = undefined;

    if (!opt.nofn) {
      if (fieldDef.bin) {
        fn = binToString(fieldDef.bin);
        suffix = opt.binSuffix;
      } else if (fieldDef.aggregate) {
        fn = String(opt.aggregate || fieldDef.aggregate);
      } else if (fieldDef.timeUnit) {
        fn = String(fieldDef.timeUnit);
      }
    }

    if (fn) {
      field = `${fn}_${field}`;
    }
  }

  if (suffix) {
    field = `${field}_${suffix}`;
  }

  if (prefix) {
    field = `${prefix}_${field}`;
  }

  if (opt.expr) {
    field = `${opt.expr}[${stringValue(field)}]`;
  }

  return field;
}

export function isDiscrete(fieldDef: FieldDef<Field>) {
  switch (fieldDef.type) {
    case 'nominal':
    case 'ordinal':
      return true;
    case 'quantitative':
      return !!fieldDef.bin;
    case 'temporal':
      // TODO: deal with custom scale type case.
      return isDiscreteByDefault(fieldDef.timeUnit);
  }
  throw new Error(log.message.invalidFieldType(fieldDef.type));
}

export function isContinuous(fieldDef: FieldDef<Field>) {
  return !isDiscrete(fieldDef);
}

export function isCount(fieldDef: FieldDef<Field>) {
  return fieldDef.aggregate === 'count';
}

export function title(fieldDef: FieldDef<string>, config: Config) {
  if (isCount(fieldDef)) {
    return config.countTitle;
  }
  const fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
  if (fn) {
    return fn.toUpperCase() + '(' + fieldDef.field + ')';
  } else {
    return fieldDef.field;
  }
}

export function defaultType(fieldDef: FieldDef<Field>, channel: Channel): Type {
  if (fieldDef.timeUnit) {
    return 'temporal';
  }
  if (fieldDef.bin) {
    return 'quantitative';
  }
  switch (rangeType(channel)) {
    case 'continuous':
      return 'quantitative';
    case 'discrete':
      return 'nominal';
    case 'flexible': // color
      return 'nominal';
    default:
      return 'quantitative';
  }
}

/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(channelDef: ChannelDef<string>, channel: Channel) {
  // If a fieldDef contains a field, we need type.
  if (isFieldDef(channelDef)) { // TODO: or datum
    let fieldDef: FieldDef<Field> = channelDef;

    // Drop invalid aggregate
    if (fieldDef.aggregate && !AGGREGATE_OP_INDEX[fieldDef.aggregate]) {
      const {aggregate, ...fieldDefWithoutAggregate} = fieldDef;
      log.warn(log.message.invalidAggregate(fieldDef.aggregate));
      fieldDef = fieldDefWithoutAggregate;
    }

    // Normalize bin
    if (fieldDef.bin) {
      const bin = fieldDef.bin;
      if (isBoolean(bin)) {
        fieldDef = {
          ...fieldDef,
          bin: {maxbins: autoMaxBins(channel)}
        };
      } else if (!bin.maxbins && !bin.step) {
        fieldDef = {
          ...fieldDef,
          bin: {
            ...bin,
            maxbins: autoMaxBins(channel)
          }
        };
      }
    }

    // Normalize Type
    if (fieldDef.type) {
      const fullType = getFullName(fieldDef.type);
      if (fieldDef.type !== fullType) {
        // convert short type to full type
        fieldDef = {
          ...fieldDef,
          type: fullType
        };
      }
    } else {
      // If type is empty / invalid, then augment with default type
      const newType = defaultType(fieldDef, channel);
      log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
      fieldDef = {
          ...fieldDef,
        type: newType
      };
    }

    const {compatible, warning} = channelCompatibility(fieldDef, channel);
    if (!compatible) {
      log.warn(warning);
    }
    return fieldDef;
  }
  return channelDef;
}

const COMPATIBLE = {compatible: true};
export function channelCompatibility(fieldDef: FieldDef<Field>, channel: Channel): {compatible: boolean; warning?: string;} {
  switch (channel) {
    case 'row':
    case 'column':
      if (isContinuous(fieldDef) && !fieldDef.timeUnit) {
        // TODO:(https://github.com/vega/vega-lite/issues/2011):
        // with timeUnit it's not always strictly continuous
        return {
          compatible: false,
          warning: log.message.facetChannelShouldBeDiscrete(channel)
        };
      }
      return COMPATIBLE;

    case 'x':
    case 'y':
    case 'color':
    case 'text':
    case 'detail':
    case 'tooltip':
      return COMPATIBLE;

    case 'opacity':
    case 'size':
    case 'x2':
    case 'y2':
      if (isDiscrete(fieldDef) && !fieldDef.bin) {
        return {
          compatible: false,
          warning: `Channel ${channel} should not be used with discrete field.`
        };
      }
      return COMPATIBLE;

    case 'shape':
      if (fieldDef.type !== 'nominal') {
        return {
          compatible: false,
          warning: 'Shape channel should be used with nominal data only'
        };
      }
      return COMPATIBLE;

    case 'order':
      if (fieldDef.type === 'nominal') {
        return {
          compatible: false,
          warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
        };
      }
      return COMPATIBLE;
  }
  throw new Error('channelCompatability not implemented for channel ' + channel);
}
