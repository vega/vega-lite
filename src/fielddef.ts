// Declaration and utility for variants of a field definition object
import {AggregateOp} from 'vega';
import {isArray, isBoolean, isNumber, isString} from 'vega-util';
import {isAggregateOp, isCountingAggregateOp} from './aggregate';
import {Axis} from './axis';
import {autoMaxBins, BinParams, binToString, isBinned, isBinning} from './bin';
import {Channel, POSITION_SCALE_CHANNELS, rangeType} from './channel';
import {CompositeAggregate} from './compositemark';
import {Config} from './config';
import {DateTime, dateTimeExpr, isDateTime} from './datetime';
import {isFacetFieldDef} from './facet';
import {Guide, TitleMixins} from './guide';
import {ImputeParams} from './impute';
import {Legend} from './legend';
import * as log from './log';
import {LogicalOperand} from './logical';
import {Predicate} from './predicate';
import {Scale} from './scale';
import {Sort, SortOrder} from './sort';
import {StackOffset} from './stack';
import {
  getLocalTimeUnit,
  getTimeUnitParts,
  isLocalSingleTimeUnit,
  isUtcSingleTimeUnit,
  normalizeTimeUnit,
  TimeUnit
} from './timeunit';
import {AggregatedFieldDef, WindowFieldDef} from './transform';
import {getFullName, QUANTITATIVE, Type} from './type';
import {contains, flatAccessWithDatum, getFirstDefined, replacePathInField, titlecase} from './util';

type Value = number | string | boolean | null;

/**
 * Definition object for a constant value of an encoding channel.
 */
export interface ValueDef {
  /**
   * A constant value in visual domain (e.g., `"red"` / "#0099ff" for color, values between `0` to `1` for opacity).
   */
  value: Value;
}

/**
 * Generic type for conditional channelDef.
 * F defines the underlying FieldDef type.
 */
export type ChannelDefWithCondition<F extends FieldDef<any>> = FieldDefWithCondition<F> | ValueDefWithCondition<F>;

export type Conditional<T> = ConditionalPredicate<T> | ConditionalSelection<T>;

export type ConditionalPredicate<T> = {
  test: LogicalOperand<Predicate>;
} & T;

export type ConditionalSelection<T> = {
  /**
   * A [selection name](https://vega.github.io/vega-lite/docs/selection.html), or a series of [composed selections](https://vega.github.io/vega-lite/docs/selection.html#compose).
   */
  selection: LogicalOperand<string>;
} & T;

export function isConditionalSelection<T>(c: Conditional<T>): c is ConditionalSelection<T> {
  return c['selection'];
}

export interface ConditionValueDefMixins {
  /**
   * One or more value definition(s) with a selection predicate.
   *
   * __Note:__ A field definition's `condition` property can only contain [value definitions](https://vega.github.io/vega-lite/docs/encoding.html#value-def)
   * since Vega-Lite only allows at most one encoded field per encoding channel.
   */
  condition?: Conditional<ValueDef> | Conditional<ValueDef>[];
}

/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */

export type FieldDefWithCondition<F extends FieldDef<any>> = F & ConditionValueDefMixins;

/**
 * A ValueDef with Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */
export interface ValueDefWithCondition<F extends FieldDef<any>> {
  /**
   * A field definition or one or more value definition(s) with a selection predicate.
   */
  condition?: Conditional<F> | Conditional<ValueDef> | Conditional<ValueDef>[];

  /**
   * A constant value in visual domain.
   */
  value?: Value;
}

/**
 * Reference to a repeated value.
 */
export interface RepeatRef {
  repeat: 'row' | 'column';
}

export type Field = string | RepeatRef;

export function isRepeatRef(field: Field): field is RepeatRef {
  return field && !isString(field) && 'repeat' in field;
}

/** @hide */
export type HiddenCompositeAggregate = CompositeAggregate;

export type Aggregate = AggregateOp | HiddenCompositeAggregate;

export interface GenericBinMixins<B> {
  /**
   * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
   *
   * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
   *
   * - To indicate that the data for the `x` (or `y`) channel are already binned, you can set the `bin` property of the `x` (or `y`) channel to `"binned"` and map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
   *
   * __Default value:__ `false`
   */
  bin?: B;
}

export type BaseBinMixins = GenericBinMixins<boolean | BinParams | 'binned'>;
export type BinWithoutBinnedMixins = GenericBinMixins<boolean | BinParams>;

export interface FieldDefBase<F> extends BaseBinMixins {
  /**
   * __Required.__ A string defining the name of the field from which to pull a data value
   * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
   *
   * __Note:__ Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
   * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
   * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
   *
   * __Note:__ `field` is not required if `aggregate` is `count`.
   */
  field?: F;

  // function

  /**
   * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
   * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
   *
   * __Default value:__ `undefined` (None)
   */
  timeUnit?: TimeUnit;

  /**
   * Aggregation function for the field
   * (e.g., `mean`, `sum`, `median`, `min`, `max`, `count`).
   *
   * __Default value:__ `undefined` (None)
   */
  aggregate?: Aggregate;
}

export function toFieldDefBase(fieldDef: FieldDef<string>): FieldDefBase<string> {
  const {field, timeUnit, bin, aggregate} = fieldDef;
  return {
    ...(timeUnit ? {timeUnit} : {}),
    ...(bin ? {bin} : {}),
    ...(aggregate ? {aggregate} : {}),
    field
  };
}

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export interface FieldDef<F> extends FieldDefBase<F>, TitleMixins {
  /**
   * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
   * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
   */
  // * or an initial character of the type name (`"Q"`, `"T"`, `"O"`, `"N"`).
  // * This property is case-insensitive.
  type: Type;
}

export interface SortableFieldDef<F> extends FieldDef<F> {
  /**
   * Sort order for the encoded field.
   *
   * For continuous fields (quantitative or temporal), `sort` can be either `"ascending"` or `"descending"`.
   *
   * For discrete fields, `sort` can be one of the following:
   * - `"ascending"` or `"descending"` -- for sorting by the values' natural order in Javascript.
   * - [A sort field definition](https://vega.github.io/vega-lite/docs/sort.html#sort-field) for sorting by another field.
   * - [An array specifying the field values in preferred order](https://vega.github.io/vega-lite/docs/sort.html#sort-array). In this case, the sort order will obey the values in the array, followed by any unspecified values in their original order.  For discrete time field, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).
   * - `null` indicating no sort.
   *
   * __Default value:__ `"ascending"`
   *
   * __Note:__ `null` is not supported for `row` and `column`.
   */
  sort?: Sort<F>;
}

export interface ScaleFieldDef<F> extends SortableFieldDef<F> {
  /**
   * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
   *
   * If `null`, the scale will be [disabled and the data value will be directly encoded](https://vega.github.io/vega-lite/docs/scale.html#disable).
   *
   * __Default value:__ If undefined, default [scale properties](https://vega.github.io/vega-lite/docs/scale.html) are applied.
   */
  scale?: Scale | null;
}

/**
 * Field Def without scale (and without bin: "binned" support).
 */
export type FieldDefWithoutScale<F> = FieldDef<F> & BinWithoutBinnedMixins;

export interface PositionFieldDef<F> extends ScaleFieldDef<F> {
  /**
   * An object defining properties of axis's gridlines, ticks and labels.
   * If `null`, the axis for the encoding channel will be removed.
   *
   * __Default value:__ If undefined, default [axis properties](https://vega.github.io/vega-lite/docs/axis.html) are applied.
   */
  axis?: Axis | null;

  /**
   * Type of stacking offset if the field should be stacked.
   * `stack` is only applicable for `x` and `y` channels with continuous domains.
   * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
   *
   * `stack` can be one of the following values:
   * - `"zero"`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](https://vega.github.io/vega-lite/docs/stack.html#bar) and [area](https://vega.github.io/vega-lite/docs/stack.html#area) chart).
   * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](https://vega.github.io/vega-lite/docs/stack.html#normalized). <br/>
   * -`"center"` - stacking with center baseline (for [streamgraph](https://vega.github.io/vega-lite/docs/stack.html#streamgraph)).
   * - `null` - No-stacking. This will produce layered [bar](https://vega.github.io/vega-lite/docs/stack.html#layered-bar-chart) and area chart.
   *
   * __Default value:__ `zero` for plots with all of the following conditions are true:
   * (1) the mark is `bar` or `area`;
   * (2) the stacked measure channel (x or y) has a linear scale;
   * (3) At least one of non-position channels mapped to an unaggregated field that is different from x and y.  Otherwise, `null` by default.
   */
  stack?: StackOffset | null;

  /**
   * An object defining the properties of the Impute Operation to be applied.
   * The field value of the other positional channel is taken as `key` of the `Impute` Operation.
   * The field of the `color` channel if specified is used as `groupby` of the `Impute` Operation.
   */
  impute?: ImputeParams;
}

/**
 * Field definition of a mark property, which can contain a legend.
 */
export type MarkPropFieldDef<F> = ScaleFieldDef<F> &
  BinWithoutBinnedMixins & {
    /**
     * An object defining properties of the legend.
     * If `null`, the legend for the encoding channel will be removed.
     *
     * __Default value:__ If undefined, default [legend properties](https://vega.github.io/vega-lite/docs/legend.html) are applied.
     */
    legend?: Legend | null;
  };

// Detail

// Order Path have no scale

export interface OrderFieldDef<F> extends FieldDefWithoutScale<F> {
  /**
   * The sort order. One of `"ascending"` (default) or `"descending"`.
   */
  sort?: SortOrder;
}

export interface TextFieldDef<F> extends FieldDefWithoutScale<F> {
  /**
   * The [formatting pattern](https://vega.gFieldDefWithoutBinnedithub.io/vega-lite/docs/format.html) for a text field. If not defined, this will be determined automatically.
   */
  format?: string;
}

export type ChannelDef<F> = ChannelDefWithCondition<FieldDef<F>>;

export function isConditionalDef<F>(channelDef: ChannelDef<F>): channelDef is ChannelDefWithCondition<FieldDef<F>> {
  return !!channelDef && !!channelDef.condition;
}

/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionalFieldDef<F>(
  channelDef: ChannelDef<F>
): channelDef is ValueDef & {condition: Conditional<FieldDef<F>>} {
  return !!channelDef && !!channelDef.condition && !isArray(channelDef.condition) && isFieldDef(channelDef.condition);
}

export function hasConditionalValueDef<F>(
  channelDef: ChannelDef<F>
): channelDef is ValueDef & {condition: Conditional<ValueDef> | Conditional<ValueDef>[]} {
  return !!channelDef && !!channelDef.condition && (isArray(channelDef.condition) || isValueDef(channelDef.condition));
}

export function isFieldDef<F>(
  channelDef: ChannelDef<F>
): channelDef is
  | FieldDef<F>
  | PositionFieldDef<F>
  | ScaleFieldDef<F>
  | MarkPropFieldDef<F>
  | OrderFieldDef<F>
  | TextFieldDef<F> {
  return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}

export function isStringFieldDef(channelDef: ChannelDef<string | RepeatRef>): channelDef is FieldDef<string> {
  return isFieldDef(channelDef) && isString(channelDef.field);
}

export function isValueDef<F>(channelDef: ChannelDef<F>): channelDef is ValueDef {
  return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}

export function isScaleFieldDef<F>(channelDef: ChannelDef<F>): channelDef is ScaleFieldDef<F> {
  return !!channelDef && (!!channelDef['scale'] || !!channelDef['sort']);
}

export function isPositionFieldDef<F>(channelDef: ChannelDef<F>): channelDef is PositionFieldDef<F> {
  return !!channelDef && (!!channelDef['axis'] || !!channelDef['stack'] || !!channelDef['impute']);
}

export function isMarkPropFieldDef<F>(channelDef: ChannelDef<F>): channelDef is MarkPropFieldDef<F> {
  return !!channelDef && !!channelDef['legend'];
}

export function isTextFieldDef<F>(channelDef: ChannelDef<F>): channelDef is TextFieldDef<F> {
  return !!channelDef && !!channelDef['format'];
}

export interface FieldRefOption {
  /** Exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** Wrap the field with datum or parent (e.g., datum['...'] for Vega Expression */
  expr?: 'datum' | 'parent';
  /** Prepend fn with custom function prefix */
  prefix?: string;
  /** Append suffix to the field ref for bin (default='start') */
  binSuffix?: 'end' | 'range' | 'mid';
  /** Append suffix to the field ref (general) */
  suffix?: string;
  /**
   * Use the field name for `as` in a transform.
   * We will not escape nested acceses because Vega transform outputs cannot be nested.
   */
  forAs?: boolean;
}

function isOpFieldDef(
  fieldDef: FieldDefBase<string> | WindowFieldDef | AggregatedFieldDef
): fieldDef is WindowFieldDef | AggregatedFieldDef {
  return !!fieldDef['op'];
}

/**
 * Get a Vega field reference from a Vega-Lite field def.
 */
export function vgField(
  fieldDef: FieldDefBase<string> | WindowFieldDef | AggregatedFieldDef,
  opt: FieldRefOption = {}
): string {
  let field = fieldDef.field;
  const prefix = opt.prefix;
  let suffix = opt.suffix;

  if (isCount(fieldDef)) {
    field = 'count_*';
  } else {
    let fn: string;

    if (!opt.nofn) {
      if (isOpFieldDef(fieldDef)) {
        fn = fieldDef.op;
      } else if (isBinning(fieldDef.bin)) {
        fn = binToString(fieldDef.bin);
        suffix = opt.binSuffix || '';
      } else if (fieldDef.aggregate) {
        fn = String(fieldDef.aggregate);
      } else if (fieldDef.timeUnit) {
        fn = String(fieldDef.timeUnit);
      }
    }

    if (fn) {
      field = field ? `${fn}_${field}` : fn;
    }
  }

  if (suffix) {
    field = `${field}_${suffix}`;
  }

  if (prefix) {
    field = `${prefix}_${field}`;
  }

  if (opt.forAs) {
    return field;
  } else if (opt.expr) {
    // Expression to access flattened field. No need to escape dots.
    return flatAccessWithDatum(field, opt.expr);
  } else {
    // We flattened all fields so paths should have become dot.
    return replacePathInField(field);
  }
}

export function isDiscrete(fieldDef: FieldDef<Field>) {
  switch (fieldDef.type) {
    case 'nominal':
    case 'ordinal':
    case 'geojson':
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

export type FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => string;

export function verbalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config) {
  const {field: field, bin, timeUnit, aggregate} = fieldDef;
  if (aggregate === 'count') {
    return config.countTitle;
  } else if (isBinning(bin)) {
    return `${field} (binned)`;
  } else if (timeUnit) {
    const units = getTimeUnitParts(timeUnit).join('-');
    return `${field} (${units})`;
  } else if (aggregate) {
    return `${titlecase(aggregate)} of ${field}`;
  }
  return field;
}

export function functionalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config) {
  const fn = fieldDef.aggregate || fieldDef.timeUnit || (isBinning(fieldDef.bin) && 'bin');
  if (fn) {
    return fn.toUpperCase() + '(' + fieldDef.field + ')';
  } else {
    return fieldDef.field;
  }
}

export const defaultTitleFormatter: FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => {
  switch (config.fieldTitle) {
    case 'plain':
      return fieldDef.field;
    case 'functional':
      return functionalTitleFormatter(fieldDef, config);
    default:
      return verbalTitleFormatter(fieldDef, config);
  }
};

let titleFormatter = defaultTitleFormatter;

export function setTitleFormatter(formatter: FieldTitleFormatter) {
  titleFormatter = formatter;
}

export function resetTitleFormatter() {
  setTitleFormatter(defaultTitleFormatter);
}

export function title(fieldDef: FieldDef<string>, config: Config, {allowDisabling}: {allowDisabling: boolean}) {
  const guide = getGuide(fieldDef) || {};
  const guideTitle = guide.title;
  if (allowDisabling) {
    return getFirstDefined(guideTitle, fieldDef.title, defaultTitle(fieldDef, config));
  } else {
    return guideTitle || fieldDef.title || defaultTitle(fieldDef, config);
  }
}

export function getGuide(fieldDef: FieldDef<string>): Guide {
  if (isPositionFieldDef(fieldDef) && fieldDef.axis) {
    return fieldDef.axis;
  } else if (isMarkPropFieldDef(fieldDef) && fieldDef.legend) {
    return fieldDef.legend;
  } else if (isFacetFieldDef(fieldDef) && fieldDef.header) {
    return fieldDef.header;
  }
  return undefined;
}

export function defaultTitle(fieldDef: FieldDefBase<string>, config: Config) {
  return titleFormatter(fieldDef, config);
}

export function format(fieldDef: FieldDef<string>) {
  if (isTextFieldDef(fieldDef) && fieldDef.format) {
    return fieldDef.format;
  } else {
    const guide = getGuide(fieldDef) || {};
    return guide.format;
  }
}

export function defaultType(fieldDef: FieldDef<Field>, channel: Channel): Type {
  if (fieldDef.timeUnit) {
    return 'temporal';
  }
  if (isBinning(fieldDef.bin)) {
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
  } else if (hasConditionalFieldDef(channelDef)) {
    return channelDef.condition;
  }
  return undefined;
}

/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function normalize(channelDef: ChannelDef<string>, channel: Channel): ChannelDef<any> {
  if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
    const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
    log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
    return {value: channelDef};
  }

  // If a fieldDef contains a field, we need type.
  if (isFieldDef(channelDef)) {
    return normalizeFieldDef(channelDef, channel);
  } else if (hasConditionalFieldDef(channelDef)) {
    return {
      ...channelDef,
      // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
      condition: normalizeFieldDef(channelDef.condition, channel) as Conditional<FieldDef<string>>
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
  if (isBinning(fieldDef.bin)) {
    fieldDef = {
      ...fieldDef,
      bin: normalizeBin(fieldDef.bin, channel)
    };
  }

  if (isBinned(fieldDef.bin) && !contains(POSITION_SCALE_CHANNELS, channel)) {
    log.warn(`Channel ${channel} should not be used with "binned" bin`);
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

export function normalizeBin(bin: BinParams | boolean, channel: Channel) {
  if (isBoolean(bin)) {
    return {maxbins: autoMaxBins(channel)};
  } else if (!bin.maxbins && !bin.step) {
    return {...bin, maxbins: autoMaxBins(channel)};
  } else {
    return bin;
  }
}

const COMPATIBLE = {compatible: true};
export function channelCompatibility(
  fieldDef: FieldDef<Field>,
  channel: Channel
): {compatible: boolean; warning?: string} {
  const type = fieldDef.type;

  if (type === 'geojson' && channel !== 'shape') {
    return {
      compatible: false,
      warning: `Channel ${channel} should not be used with a geojson data.`
    };
  }

  switch (channel) {
    case 'row':
    case 'column':
      if (isContinuous(fieldDef)) {
        return {
          compatible: false,
          warning: log.message.facetChannelShouldBeDiscrete(channel)
        };
      }
      return COMPATIBLE;

    case 'x':
    case 'y':
    case 'color':
    case 'fill':
    case 'stroke':
    case 'text':
    case 'detail':
    case 'key':
    case 'tooltip':
    case 'href':
      return COMPATIBLE;

    case 'longitude':
    case 'longitude2':
    case 'latitude':
    case 'latitude2':
      if (type !== QUANTITATIVE) {
        return {
          compatible: false,
          warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
        };
      }
      return COMPATIBLE;

    case 'opacity':
    case 'size':
    case 'x2':
    case 'y2':
      if (type === 'nominal' && !fieldDef['sort']) {
        return {
          compatible: false,
          warning: `Channel ${channel} should not be used with an unsorted discrete field.`
        };
      }
      return COMPATIBLE;

    case 'shape':
      if (fieldDef.type !== 'nominal' && fieldDef.type !== 'geojson') {
        return {
          compatible: false,
          warning: 'Shape channel should be used with only either nominal or geojson data'
        };
      }
      return COMPATIBLE;

    case 'order':
      if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
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
  return fieldDef.type === 'quantitative' || isBinning(fieldDef.bin);
}

export function isTimeFieldDef(fieldDef: FieldDef<any>) {
  return fieldDef.type === 'temporal' || !!fieldDef.timeUnit;
}

/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export function valueExpr(
  v: number | string | boolean | DateTime,
  {
    timeUnit,
    type,
    time,
    undefinedIfExprNotRequired
  }: {
    timeUnit: TimeUnit;
    type?: Type;
    time?: boolean;
    undefinedIfExprNotRequired?: boolean;
  }
): string {
  let expr;
  if (isDateTime(v)) {
    expr = dateTimeExpr(v, true);
  } else if (isString(v) || isNumber(v)) {
    if (timeUnit || type === 'temporal') {
      if (isLocalSingleTimeUnit(timeUnit)) {
        expr = dateTimeExpr({[timeUnit]: v}, true);
      } else if (isUtcSingleTimeUnit(timeUnit)) {
        // FIXME is this really correct?
        expr = valueExpr(v, {timeUnit: getLocalTimeUnit(timeUnit)});
      } else {
        // just pass the string to date function (which will call JS Date.parse())
        expr = `datetime(${JSON.stringify(v)})`;
      }
    }
  }
  if (expr) {
    return time ? `time(${expr})` : expr;
  }
  // number or boolean or normal string
  return undefinedIfExprNotRequired ? undefined : JSON.stringify(v);
}

/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export function valueArray(fieldDef: FieldDef<string>, values: (number | string | boolean | DateTime)[]) {
  const {timeUnit, type} = fieldDef;
  return values.map(v => {
    const expr = valueExpr(v, {timeUnit, type, undefinedIfExprNotRequired: true});
    // return signal for the expression if we need an expression
    if (expr !== undefined) {
      return {signal: expr};
    }
    // otherwise just return the original value
    return v;
  });
}
