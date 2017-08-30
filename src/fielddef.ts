// utility for a field definition object

import {AggregateOp, isAggregateOp, isCountingAggregateOp} from './aggregate';
import {Axis} from './axis';
import {autoMaxBins, BinParams, binToString} from './bin';
import {Channel, rangeType} from './channel';
import {CompositeAggregate} from './compositemark';
import {Config} from './config';
import {Field} from './fielddef';
import {Legend} from './legend';
import * as log from './log';
import {LogicalOperand} from './logical';
import {Scale} from './scale';
import {SortField, SortOrder} from './sort';
import {StackOffset} from './stack';
import {normalizeTimeUnit, TimeUnit} from './timeunit';
import {getFullName, Type} from './type';
import {isBoolean, isString, stringValue} from './util';

/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef {
  /**
   * A constant value in visual domain.
   */
  value: number | string | boolean;
}

/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type.
 */
export type ConditionalChannelDef<F extends FieldDef<any>> = ConditionalFieldDef<F> | ConditionalValueDef<F>;


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
export type ConditionalFieldDef<F extends FieldDef<any>> = F & {
  /**
   * A value definition with a selection predicate.
   *
   * __Note:__ A field definition's `condition` property can only be a [value definition](encoding.html#value)
   * since Vega-Lite only allows at mosty  one encoded field per encoding channel.
   */
  condition?: Condition<ValueDef>
};

/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export interface ConditionalValueDef<F extends FieldDef<any>> {
  /**
   * A field definition or a value definition with a selection predicate.
   */
  condition?: Condition<F> | Condition<ValueDef>;

  /**
   * A constant value in visual domain.
   */
  value?: number | string | boolean;
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

export type Aggregate = AggregateOp | CompositeAggregate;

export interface FieldDefBase<F> {

  /**
   * __Required.__ A string defining the name of the field from which to pull a data value
   * or an object defining iterated values from the [`repeat`](repeat.html) operator.
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
   * A flag for binning a `quantitative` field, or [an object defining binning parameters](bin.html#params).
   * If `true`, default [binning parameters](bin.html) will be applied.
   *
   * __Default value:__ `false`
   */
  bin?: boolean | BinParams;

  /**
   * Aggregation function for the field
   * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
   *
   * __Default value:__ `undefined` (None)
   *
   */
  aggregate?: Aggregate;
}

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F> {
  /**
   * The encoded field's type of measurement. This can be either a full type
   * name (`"quantitative"`, `"temporal"`, `"ordinal"`,  and `"nominal"`).
   */
  // * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
  // * This property is case-insensitive.
  type: Type;
}

export interface ScaleFieldDef<F> extends FieldDef<F> {
  /**
   * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
   *
   * __Default value:__ If undefined, default [scale properties](scale.html) are applied.
   */
  scale?: Scale;

  /**
   * Sort order for the encoded field.
   * Supported `sort` values include `"ascending"`, `"descending"` and `null` (no sorting).
   * For fields with discrete domains, `sort` can also be a [sort field definition object](sort.html#sort-field).
   *
   * __Default value:__ `"ascending"`
   *
   * @nullable
   */
  sort?: SortOrder | SortField;
}

export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
  /**
   * An object defining properties of axis's gridlines, ticks and labels.
   * If `null`, the axis for the encoding channel will be removed.
   *
   * __Default value:__ If undefined, default [axis properties](axis.html) are applied.
   *
   * @nullable
   */
  axis?: Axis;

  /**
   * Type of stacking offset if the field should be stacked.
   * `stack` is only applicable for `x` and `y` channels with continuous domains.
   * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
   *
   * `stack` can be one of the following values:
   * - `"zero"`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](stack.html#bar) and [area](stack.html#area) chart).
   * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](stack.html#normalized). <br/>
   * -`"center"` - stacking with center baseline (for [streamgraph](stack.html#streamgraph)).
   * - `"none"` - No-stacking. This will produce layered [bar](stack.html#layered-bar-chart) and area chart.
   *
   * __Default value:__ `zero` for plots with all of the following conditions are true: (1) `bar` or `area` marks (2) At least one of `color`, `opacity`, `size`, or `detail` channel mapped to a group-by field (3) one position channel has a linear scale and summative aggregation function (e.g., `sum`, `count`) and (4) the other position channel either has discrete domain or unmapped.  Otherwise `"none"` by default.
   */
  stack?: StackOffset;
}

export interface LegendFieldDef<F> extends ScaleFieldDef<F> {
   /**
    * An object defining properties of the legend.
    * If `null`, the legend for the encoding channel will be removed.
    *
    * __Default value:__ If undefined, default [legend properties](legend.html) are applied.
    *
    * @nullable
    */
  legend?: Legend;
}

// Detail

// Order Path have no scale

export interface OrderFieldDef<F> extends FieldDef<F> {
  /**
   * The sort order. One of `"ascending"` (default) or `"descending"`.
   */
  sort?: SortOrder;
}

export interface TextFieldDef<F> extends FieldDef<F> {
  // FIXME: add more reference to Vega's format pattern or d3's format pattern.
  /**
   * The [formatting pattern](format.html) for a text field. If not defined, this will be determined automatically.
   */
  format?: string;
}

export type ChannelDef<F> = ConditionalChannelDef<FieldDef<F>>;

export function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is ConditionalChannelDef<FieldDef<F>> {
  return !!channelDef && !!channelDef.condition;
}

/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionFieldDef<F>(channelDef: ChannelDef<F>): channelDef is (ValueDef & {condition: Condition<FieldDef<F>>}) {
  return !!channelDef && !!channelDef.condition && isFieldDef(channelDef.condition);
}

export function isFieldDef<F>(channelDef: ChannelDef<F>): channelDef is FieldDef<F> | PositionFieldDef<F> | LegendFieldDef<F> | OrderFieldDef<F> | TextFieldDef<F> {
  return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}

export function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef {
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
  binSuffix?: 'end' | 'range' | 'mid';
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
        suffix = opt.binSuffix || '';
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
      return false;
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
  if (fieldDef.aggregate && !isAggregateOp(fieldDef.aggregate)) {
    const {aggregate, ...fieldDefWithoutAggregate} = fieldDef;
    log.warn(log.message.invalidAggregate(fieldDef.aggregate));
    fieldDef = fieldDefWithoutAggregate;
  }

  // Normalize Time Unit
  if (fieldDef.timeUnit) {
    fieldDef = {
      ...fieldDef,
      timeUnit: normalizeTimeUnit(fieldDef.timeUnit)
    };
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
    if (fieldDef.type !== 'quantitative') {
      if (isCountingAggregateOp(fieldDef.aggregate)) {
        log.warn(log.message.invalidFieldTypeForCountAggregate(fieldDef.type, fieldDef.aggregate));
        fieldDef = {
          ...fieldDef,
          type: 'quantitative'
        };
      }
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

export function normalizeBin(bin: BinParams|boolean, channel: Channel) {
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

export function isNumberFieldDef(fieldDef: FieldDef<any>) {
  return fieldDef.type === 'quantitative' || !!fieldDef.bin;
}

export function isTimeFieldDef(fieldDef: FieldDef<any>) {
  return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
}
