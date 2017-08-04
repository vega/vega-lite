// utility for a field definition object

import {AGGREGATE_OP_INDEX, AggregateOp, isCountingAggregateOp} from './aggregate';
import {Axis} from './axis';
import {autoMaxBins, Bin, binToString} from './bin';
import {Channel, rangeType} from './channel';
import {CompositeAggregate} from './compositemark';
import {Config} from './config';
import {Field} from './fielddef';
import {Legend} from './legend';
import * as log from './log';
import {LogicalOperand} from './logical';
import {Scale, ScaleType} from './scale';
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
  value: T;
}

/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type while V defines the underlying ValueDef type.
 */
export type Conditional<F extends FieldDef<any>, V extends ValueDef<any>> = ConditionalFieldDef<F, V> | ConditionalValueDef<F, V> | ConditionOnlyDef<F, V>;


export type Condition<T> = {
  selection: LogicalOperand<string>;
} & T;

/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */
export type ConditionalFieldDef<F extends FieldDef<any>, V extends ValueDef<any>> = F & {condition?: Condition<V>};

export interface ConditionOnlyDef <F extends FieldDef<any>, V extends ValueDef<any>> {
  condition: Condition<F> | Condition<V>;
}


/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export type ConditionalValueDef<F extends FieldDef<any>, V extends ValueDef<any>> = V & {condition?: Condition<F> | Condition<V>;};

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

export interface FieldDefBase<F> {

  /**
   * __Required.__ Name of the field from which to pull a data value.
   *
   * __Note:__ `field` is not required if `aggregate` is `count`.
   */
  field?: F;

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

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F> {
  /**
   * The encoded field's type of measurement. This can be either a full type
   * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`)
   * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
   * This property is case-insensitive.
   */
  type: Type;
}

export interface ScaleFieldDef<F> extends FieldDef<F> {
  scale?: Scale;
  /**
   * Sort order for a field with discrete domain.
   * This can be `"ascending"`, `"descending"`, `null`, or a [sort field definition object](sort.html#sort-field) for sorting by an aggregate calculation of a specified sort field.
   *
   * __Note:__ For fields with continuous domain, please use `"scale": {"reverse": true}` to flip the scale instead.
   */
  sort?: SortField | SortOrder;
}

export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
  /**
   * By default, Vega-Lite automatically creates axes for `x` and `y` channels when they are encoded.
   * If `axis` is not defined, default axis properties are applied.
   * User can provide set `axis` to an object to customize [axis properties](axis.html#axis-properties)
   * or set `axis` to `null` to remove the axis.
   * @nullable
   */
  axis?: Axis;

  /**
   * Type of stacking offset if the field should be stacked.
   * "none" or null, if the field should not be stacked.
   */
  stack?: StackOffset;
}

export interface LegendFieldDef<F> extends ScaleFieldDef<F> {
   /**
    * @nullable
    */
  legend?: Legend;
}

// Detail

// Order Path have no scale

export interface OrderFieldDef<F> extends FieldDef<F> {
  sort?: SortOrder;
}

export interface TextFieldDef<F> extends FieldDef<F> {
  // FIXME: add more reference to Vega's format pattern or d3's format pattern.
  /**
   * The formatting pattern for text value. If not defined, this will be determined automatically.
   */
  format?: string;
}

export type ChannelDef<F> = Conditional<FieldDef<F>, ValueDef<any>>;

export function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is Conditional<FieldDef<F>, ValueDef<any>> {
  return !!channelDef && !!channelDef.condition;
}

/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionFieldDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef<any> & {condition: Condition<FieldDef<F>>}) {
  return !!channelDef && !!channelDef.condition && isFieldDef(channelDef.condition);
}

export function isFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FieldDef<F> | PositionFieldDef<F> | LegendFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F> {
  return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}

export function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef<any> {
  return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}

export function isScaleFieldDef(channelDef: ChannelDef<any>): channelDef is ScaleFieldDef<any> {
    return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
}

export interface FieldRefOption {
  /** exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
  expr?: 'datum' | 'parent';
  /** prepend fn with custom function prefix */
  prefix?: string;
  /** append suffix to the field ref for bin (default='start') */
  binSuffix?: 'start' | 'end' | 'range' | 'mid';
  /** append suffix to the field ref (general) */
  suffix?: string;
  /** Overrride which aggregate to use. Needed for unaggregated domain. */
  aggregate?: AggregateOp;
}

export function field(fieldDef: FieldDefBase<string>, opt: FieldRefOption = {}): string {
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

export function isCount(fieldDef: FieldDefBase<Field>) {
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
 * Returns the fieldDef -- either from the outer channelDef or from the condition of channelDef.
 * @param channelDef
 */
export function getFieldDef<F>(channelDef: ChannelDef<F>): FieldDef<F> {
  if (isFieldDef(channelDef)) {
    return channelDef;
  } else if (hasConditionFieldDef(channelDef)) {
    return channelDef.condition;
  }
  return undefined;
}

/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(channelDef: ChannelDef<string>, channel: Channel): ChannelDef<any> {
  // If a fieldDef contains a field, we need type.
  if (isFieldDef(channelDef)) {
    return normalizeFieldDef(channelDef, channel);
  } else if (hasConditionFieldDef(channelDef)) {
    return {
      ...channelDef,
      // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
      condition: normalizeFieldDef(channelDef.condition, channel) as Condition<FieldDef<string>>
    };
  }
  return channelDef;
}
export function normalizeFieldDef(fieldDef: FieldDef<string>, channel: Channel) {
  // Drop invalid aggregate
  if (fieldDef.aggregate && !AGGREGATE_OP_INDEX[fieldDef.aggregate]) {
    const {aggregate, ...fieldDefWithoutAggregate} = fieldDef;
    log.warn(log.message.invalidAggregate(fieldDef.aggregate));
    fieldDef = fieldDefWithoutAggregate;
  }

  // Normalize bin
  if (fieldDef.bin) {
    fieldDef = {
      ...fieldDef,
      bin: normalizeBin(fieldDef.bin, channel)
    };
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
    if (isCountingAggregateOp(fieldDef.aggregate) && fieldDef.type !== 'quantitative') {
      log.warn(log.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
      fieldDef = {
        ...fieldDef,
        type: 'quantitative'
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

export function normalizeBin(bin: Bin|boolean, channel: Channel) {
  if (isBoolean(bin)) {
    return {maxbins: autoMaxBins(channel)};
  } else if (!bin.maxbins && !bin.step) {
    return {...bin, maxbins: autoMaxBins(channel)};
  } else {
    return bin;
  }
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
