import {Gradient, SignalRef, Text} from 'vega';
import {isArray, isBoolean, isNumber, isString} from 'vega-util';
import {Aggregate, isAggregateOp, isArgmaxDef, isArgminDef, isCountingAggregateOp} from './aggregate';
import {Axis} from './axis';
import {autoMaxBins, Bin, BinParams, binToString, isBinned, isBinning} from './bin';
import {
  ANGLE,
  DESCRIPTION,
  Channel,
  COLOR,
  COLUMN,
  DETAIL,
  FACET,
  FILL,
  FILLOPACITY,
  HREF,
  isScaleChannel,
  isSecondaryRangeChannel,
  isXorY,
  KEY,
  LATITUDE,
  LATITUDE2,
  LONGITUDE,
  LONGITUDE2,
  OPACITY,
  ORDER,
  RADIUS,
  RADIUS2,
  rangeType,
  ROW,
  SHAPE,
  SIZE,
  STROKE,
  STROKEDASH,
  STROKEOPACITY,
  STROKEWIDTH,
  TEXT,
  THETA,
  THETA2,
  TOOLTIP,
  URL,
  X,
  X2,
  Y,
  Y2
} from './channel';
import {getMarkConfig} from './compile/common';
import {isCustomFormatType} from './compile/format';
import {CompositeAggregate} from './compositemark';
import {Config} from './config';
import {DateTime, dateTimeToExpr, isDateTime} from './datetime';
import {Encoding} from './encoding';
import {FormatMixins, Guide, GuideEncodingConditionalValueDef, TitleMixins} from './guide';
import {ImputeParams} from './impute';
import {Legend} from './legend';
import * as log from './log';
import {LogicalComposition} from './logical';
import {isRectBasedMark, MarkDef} from './mark';
import {Predicate} from './predicate';
import {Scale} from './scale';
import {isSortByChannel, Sort, SortOrder} from './sort';
import {isFacetFieldDef} from './spec/facet';
import {StackOffset, StackProperties} from './stack';
import {
  getTimeUnitParts,
  isLocalSingleTimeUnit,
  normalizeTimeUnit,
  TimeUnit,
  TimeUnitParams,
  timeUnitToString
} from './timeunit';
import {AggregatedFieldDef, WindowFieldDef} from './transform';
import {getFullName, QUANTITATIVE, StandardType, Type} from './type';
import {
  contains,
  flatAccessWithDatum,
  getFirstDefined,
  internalField,
  replacePathInField,
  titleCase,
  removePathFromField
} from './util';
import {isSignalRef} from './vega.schema';

export type PrimitiveValue = number | string | boolean | null;

export type Value = PrimitiveValue | number[] | Gradient | Text | SignalRef;

/**
 * Definition object for a constant value (primitive value or gradient definition) of an encoding channel.
 */
export interface ValueDef<V extends Value = Value> {
  /**
   * A constant value in visual domain (e.g., `"red"` / `"#0099ff"` / [gradient definition](https://vega.github.io/vega-lite/docs/types.html#gradient) for color, values between `0` to `1` for opacity).
   */
  value: V;
}

export type XValueDef = ValueDef<number | 'width' | SignalRef>;

export type YValueDef = ValueDef<number | 'height' | SignalRef>;

export type NumericValueDef = ValueDef<number | SignalRef>;

/**
 * A ValueDef with Condition<ValueDef | FieldDef> where either the condition or the value are optional.
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */

/**
 * @minProperties 1
 */
export type ValueDefWithCondition<F extends FieldDef<any> | DatumDef<any>, V extends Value = Value> = Partial<
  ValueDef<V | SignalRef>
> & {
  /**
   * A field definition or one or more value definition(s) with a selection predicate.
   */
  condition?: Conditional<F> | Conditional<ValueDef<V | SignalRef>> | Conditional<ValueDef<V | SignalRef>>[];
};

export type StringValueDefWithCondition<F extends Field, T extends Type = StandardType> = ValueDefWithCondition<
  MarkPropFieldOrDatumDef<F, T>,
  string | null
>;

export type ColorGradientValueDefWithCondition<F extends Field, T extends Type = StandardType> = ValueDefWithCondition<
  MarkPropFieldOrDatumDef<F, T>,
  Gradient | string | null
>;

export type NumericValueDefWithCondition<F extends Field> = ValueDefWithCondition<
  MarkPropFieldOrDatumDef<F, StandardType>,
  number
>;
export type NumericArrayValueDefWithCondition<F extends Field> = ValueDefWithCondition<
  MarkPropFieldOrDatumDef<F, StandardType>,
  number[]
>;

export type TypeForShape = 'nominal' | 'ordinal' | 'geojson';

export type ShapeValueDefWithCondition<F extends Field> = StringValueDefWithCondition<F, TypeForShape>;

export type TextValueDefWithCondition<F extends Field> = ValueDefWithCondition<StringFieldDef<F>, Text>;

export type Conditional<CD extends FieldDef<any> | DatumDef | ValueDef<any> | SignalRef> =
  | ConditionalPredicate<CD>
  | ConditionalSelection<CD>;

export type ConditionalPredicate<CD extends FieldDef<any> | DatumDef | ValueDef<any> | SignalRef> = {
  /**
   * Predicate for triggering the condition
   */
  test: LogicalComposition<Predicate>;
} & CD;

export type ConditionalSelection<CD extends FieldDef<any> | DatumDef | ValueDef<any> | SignalRef> = {
  /**
   * A [selection name](https://vega.github.io/vega-lite/docs/selection.html), or a series of [composed selections](https://vega.github.io/vega-lite/docs/selection.html#compose).
   */
  selection: LogicalComposition<string>;
} & CD;

export function isConditionalSelection<T>(c: Conditional<T>): c is ConditionalSelection<T> {
  return c['selection'];
}

export interface ConditionValueDefMixins<V extends Value = Value> {
  /**
   * One or more value definition(s) with [a selection or a test predicate](https://vega.github.io/vega-lite/docs/condition.html).
   *
   * __Note:__ A field definition's `condition` property can only contain [conditional value definitions](https://vega.github.io/vega-lite/docs/condition.html#value)
   * since Vega-Lite only allows at most one encoded field per encoding channel.
   */
  condition?: Conditional<ValueDef<V>> | Conditional<ValueDef<V>>[];
}

/**
 * A FieldDef with Condition<ValueDef>
 * {
 *   condition: {value: ...},
 *   field: ...,
 *   ...
 * }
 */

export type FieldOrDatumDefWithCondition<F extends FieldDef<any, any> | DatumDef<any>, V extends Value = Value> = F &
  ConditionValueDefMixins<V | SignalRef>;

export type ColorGradientFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<
  MarkPropFieldDef<F, StandardType>,
  Gradient | string | null
>;

export type ColorGradientDatumDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<
  DatumDef<F>,
  Gradient | string | null
>;

export type NumericFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<
  MarkPropFieldDef<F, StandardType>,
  number
>;

export type NumericDatumDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<DatumDef<F>, number>;

export type NumericArrayFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<
  MarkPropFieldDef<F, StandardType>,
  number[]
>;

export type NumericArrayDatumDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<DatumDef<F>, number[]>;

export type ShapeFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<
  MarkPropFieldDef<F, TypeForShape>,
  string | null
>;

export type TextFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<StringFieldDef<F>, Text>;

export type TextDatumDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<StringDatumDef<F>, Text>;

export type StringFieldDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<StringFieldDef<F>, string>;

export type StringDatumDefWithCondition<F extends Field> = FieldOrDatumDefWithCondition<StringDatumDef<F>, string>;

/**
 * A ValueDef with optional Condition<ValueDef | FieldDef>
 * {
 *   condition: {field: ...} | {value: ...},
 *   value: ...,
 * }
 */

/**
 * Reference to a repeated value.
 */
export interface RepeatRef {
  repeat: 'row' | 'column' | 'repeat' | 'layer';
}

export type FieldName = string;
export type Field = FieldName | RepeatRef;

export function isRepeatRef(field: Field | any): field is RepeatRef {
  return field && !isString(field) && 'repeat' in field;
}

/** @@hidden */
export type HiddenCompositeAggregate = CompositeAggregate;

export interface FieldDefBase<F, B extends Bin = Bin> extends BandMixins {
  /**
   * __Required.__ A string defining the name of the field from which to pull a data value
   * or an object defining iterated values from the [`repeat`](https://vega.github.io/vega-lite/docs/repeat.html) operator.
   *
   * __See also:__ [`field`](https://vega.github.io/vega-lite/docs/field.html) documentation.
   *
   * __Notes:__
   * 1)  Dots (`.`) and brackets (`[` and `]`) can be used to access nested objects (e.g., `"field": "foo.bar"` and `"field": "foo['bar']"`).
   * If field names contain dots or brackets but are not nested, you can use `\\` to escape dots and brackets (e.g., `"a\\.b"` and `"a\\[0\\]"`).
   * See more details about escaping in the [field documentation](https://vega.github.io/vega-lite/docs/field.html).
   * 2) `field` is not required if `aggregate` is `count`.
   */
  field?: F;

  // function

  /**
   * Time unit (e.g., `year`, `yearmonth`, `month`, `hours`) for a temporal field.
   * or [a temporal field that gets casted as ordinal](https://vega.github.io/vega-lite/docs/type.html#cast).
   *
   * __Default value:__ `undefined` (None)
   *
   * __See also:__ [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html) documentation.
   */
  timeUnit?: TimeUnit | TimeUnitParams;

  /**
   * Aggregation function for the field
   * (e.g., `"mean"`, `"sum"`, `"median"`, `"min"`, `"max"`, `"count"`).
   *
   * __Default value:__ `undefined` (None)
   *
   * __See also:__ [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html) documentation.
   */
  aggregate?: Aggregate | HiddenCompositeAggregate;

  /**
   * A flag for binning a `quantitative` field, [an object defining binning parameters](https://vega.github.io/vega-lite/docs/bin.html#params), or indicating that the data for `x` or `y` channel are binned before they are imported into Vega-Lite (`"binned"`).
   *
   * - If `true`, default [binning parameters](https://vega.github.io/vega-lite/docs/bin.html) will be applied.
   *
   * - If `"binned"`, this indicates that the data for the `x` (or `y`) channel are already binned. You can map the bin-start field to `x` (or `y`) and the bin-end field to `x2` (or `y2`). The scale and axis will be formatted similar to binning in Vega-Lite.  To adjust the axis ticks based on the bin step, you can also set the axis's [`tickMinStep`](https://vega.github.io/vega-lite/docs/axis.html#ticks) property.
   *
   * __Default value:__ `false`
   *
   * __See also:__ [`bin`](https://vega.github.io/vega-lite/docs/bin.html) documentation.
   */
  bin?: B;
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

export interface TypeMixins<T extends Type> {
  /**
   * The encoded field's type of measurement (`"quantitative"`, `"temporal"`, `"ordinal"`, or `"nominal"`).
   * It can also be a `"geojson"` type for encoding ['geoshape'](https://vega.github.io/vega-lite/docs/geoshape.html).
   *
   *
   * __Note:__
   *
   * - Data values for a temporal field can be either a date-time string (e.g., `"2015-03-07 12:32:17"`, `"17:01"`, `"2015-03-16"`. `"2015"`) or a timestamp number (e.g., `1552199579097`).
   * - Data `type` describes the semantics of the data rather than the primitive data types (number, string, etc.). The same primitive data type can have different types of measurement. For example, numeric data can represent quantitative, ordinal, or nominal data.
   * - When using with [`bin`](https://vega.github.io/vega-lite/docs/bin.html), the `type` property can be either `"quantitative"` (for using a linear bin scale) or [`"ordinal"` (for using an ordinal bin scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
   * - When using with [`timeUnit`](https://vega.github.io/vega-lite/docs/timeunit.html), the `type` property can be either `"temporal"` (for using a temporal scale) or [`"ordinal"` (for using an ordinal scale)](https://vega.github.io/vega-lite/docs/type.html#cast-bin).
   * - When using with [`aggregate`](https://vega.github.io/vega-lite/docs/aggregate.html), the `type` property refers to the post-aggregation data type. For example, we can calculate count `distinct` of a categorical field `"cat"` using `{"aggregate": "distinct", "field": "cat", "type": "quantitative"}`. The `"type"` of the aggregate output is `"quantitative"`.
   * - Secondary channels (e.g., `x2`, `y2`, `xError`, `yError`) do not have `type` as they have exactly the same type as their primary channels (e.g., `x`, `y`).
   *
   * __See also:__ [`type`](https://vega.github.io/vega-lite/docs/type.html) documentation.
   */
  type: T;
}

/**
 *  Definition object for a data field, its type and transformation of an encoding channel.
 */
export type TypedFieldDef<
  F extends Field,
  T extends Type = any,
  B extends Bin = boolean | BinParams | 'binned' | null // This is equivalent to Bin but we use the full form so the docs has detailed types
> = FieldDefBase<F, B> & TitleMixins & TypeMixins<T>;

export interface SortableFieldDef<
  F extends Field,
  T extends Type = StandardType,
  B extends Bin = boolean | BinParams | null
> extends TypedFieldDef<F, T, B> {
  /**
   * Sort order for the encoded field.
   *
   * For continuous fields (quantitative or temporal), `sort` can be either `"ascending"` or `"descending"`.
   *
   * For discrete fields, `sort` can be one of the following:
   * - `"ascending"` or `"descending"` -- for sorting by the values' natural order in JavaScript.
   * - [A string indicating an encoding channel name to sort by](https://vega.github.io/vega-lite/docs/sort.html#sort-by-encoding) (e.g., `"x"` or `"y"`) with an optional minus prefix for descending sort (e.g., `"-x"` to sort by x-field, descending). This channel string is short-form of [a sort-by-encoding definition](https://vega.github.io/vega-lite/docs/sort.html#sort-by-encoding). For example, `"sort": "-x"` is equivalent to `"sort": {"encoding": "x", "order": "descending"}`.
   * - [A sort field definition](https://vega.github.io/vega-lite/docs/sort.html#sort-field) for sorting by another field.
   * - [An array specifying the field values in preferred order](https://vega.github.io/vega-lite/docs/sort.html#sort-array). In this case, the sort order will obey the values in the array, followed by any unspecified values in their original order. For discrete time field, values in the sort array can be [date-time definition objects](types#datetime). In addition, for time units `"month"` and `"day"`, the values can be the month or day names (case insensitive) or their 3-letter initials (e.g., `"Mon"`, `"Tue"`).
   * - `null` indicating no sort.
   *
   * __Default value:__ `"ascending"`
   *
   * __Note:__ `null` and sorting by another channel is not supported for `row` and `column`.
   *
   * __See also:__ [`sort`](https://vega.github.io/vega-lite/docs/sort.html) documentation.
   */
  sort?: Sort<F>;
}

export function isSortableFieldDef<F extends Field>(fieldDef: FieldDef<F>): fieldDef is SortableFieldDef<F> {
  return isTypedFieldDef(fieldDef) && 'sort' in fieldDef;
}

export type ScaleFieldDef<
  F extends Field,
  T extends Type = StandardType,
  B extends Bin = boolean | BinParams | null
> = SortableFieldDef<F, T, B> & ScaleMixins;

export interface ScaleMixins {
  /**
   * An object defining properties of the channel's scale, which is the function that transforms values in the data domain (numbers, dates, strings, etc) to visual values (pixels, colors, sizes) of the encoding channels.
   *
   * If `null`, the scale will be [disabled and the data value will be directly encoded](https://vega.github.io/vega-lite/docs/scale.html#disable).
   *
   * __Default value:__ If undefined, default [scale properties](https://vega.github.io/vega-lite/docs/scale.html) are applied.
   *
   * __See also:__ [`scale`](https://vega.github.io/vega-lite/docs/scale.html) documentation.
   */
  scale?: Scale | null;
}

export interface DatumDef<
  F extends Field = string,
  V extends PrimitiveValue | DateTime | SignalRef = PrimitiveValue | DateTime | SignalRef
> extends Partial<TypeMixins<Type>>, BandMixins {
  /**
   * A constant value in data domain.
   */
  datum?: F extends RepeatRef ? V | RepeatRef : V;
  // only apply Repeatref if field (F) can be RepeatRef
  // FIXME(https://github.com/microsoft/TypeScript/issues/37586):
  // `F extends RepeatRef` probably should be `RepeatRef extends F` but there is likely a bug in TS.
}

export type StringDatumDef<F extends Field = string> = DatumDef<F> & FormatMixins;

export type ScaleDatumDef<F extends Field = string> = ScaleMixins & DatumDef<F>;

/**
 * A field definition of a secondary channel that shares a scale with another primary channel. For example, `x2`, `xError` and `xError2` share the same scale with `x`.
 */
export type SecondaryFieldDef<F extends Field> = FieldDefBase<F, null> & TitleMixins; // x2/y2 shouldn't have bin, but we keep bin property for simplicity of the codebase.

export type SecondaryChannelDef<F extends Field> = Encoding<F>['x2' | 'y2'];

/**
 * Field Def without scale (and without bin: "binned" support).
 */
export type FieldDefWithoutScale<F extends Field, T extends Type = StandardType> = TypedFieldDef<F, T>;

export type LatLongFieldDef<F extends Field> = FieldDefBase<F, null> &
  TitleMixins &
  Partial<TypeMixins<'quantitative'>>; // Lat long shouldn't have bin, but we keep bin property for simplicity of the codebase.

export type PositionFieldDefBase<F extends Field> = ScaleFieldDef<
  F,
  StandardType,
  boolean | BinParams | 'binned' | null // This is equivalent to Bin but we use the full form so the docs has detailed types
> &
  PositionBaseMixins;

export type PositionDatumDefBase<F extends Field> = ScaleDatumDef<F> & PositionBaseMixins;

export interface PositionBaseMixins {
  /**
   * Type of stacking offset if the field should be stacked.
   * `stack` is only applicable for `x`, `y`, `theta`, and `radius` channels with continuous domains.
   * For example, `stack` of `y` can be used to customize stacking for a vertical bar chart.
   *
   * `stack` can be one of the following values:
   * - `"zero"` or `true`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](https://vega.github.io/vega-lite/docs/stack.html#bar) and [area](https://vega.github.io/vega-lite/docs/stack.html#area) chart).
   * - `"normalize"` - stacking with normalized domain (for creating [normalized stacked bar and area charts](https://vega.github.io/vega-lite/docs/stack.html#normalized). <br/>
   * -`"center"` - stacking with center baseline (for [streamgraph](https://vega.github.io/vega-lite/docs/stack.html#streamgraph)).
   * - `null` or `false` - No-stacking. This will produce layered [bar](https://vega.github.io/vega-lite/docs/stack.html#layered-bar-chart) and area chart.
   *
   * __Default value:__ `zero` for plots with all of the following conditions are true:
   * (1) the mark is `bar`, `area`, or `arc`;
   * (2) the stacked measure channel (x or y) has a linear scale;
   * (3) At least one of non-position channels mapped to an unaggregated field that is different from x and y. Otherwise, `null` by default.
   *
   * __See also:__ [`stack`](https://vega.github.io/vega-lite/docs/stack.html) documentation.
   */
  stack?: StackOffset | null | boolean;
}

export interface BandMixins {
  /**
   * For rect-based marks (`rect`, `bar`, and `image`), mark size relative to bandwidth of [band scales](https://vega.github.io/vega-lite/docs/scale.html#band), bins or time units. If set to `1`, the mark size is set to the bandwidth, the bin interval, or the time unit interval. If set to `0.5`, the mark size is half of the bandwidth or the time unit interval.
   *
   * For other marks, relative position on a band of a stacked, binned, time unit or band scale. If set to `0`, the marks will be positioned at the beginning of the band. If set to `0.5`, the marks will be positioned in the middle of the band.
   *
   * @minimum 0
   * @maximum 1
   */
  band?: number;
}

export type PositionFieldDef<F extends Field> = PositionFieldDefBase<F> & PositionMixins;

export type PositionDatumDef<F extends Field> = PositionDatumDefBase<F> & PositionMixins;

export interface PositionMixins {
  /**
   * An object defining properties of axis's gridlines, ticks and labels.
   * If `null`, the axis for the encoding channel will be removed.
   *
   * __Default value:__ If undefined, default [axis properties](https://vega.github.io/vega-lite/docs/axis.html) are applied.
   *
   * __See also:__ [`axis`](https://vega.github.io/vega-lite/docs/axis.html) documentation.
   */
  axis?: Axis | null;

  /**
   * An object defining the properties of the Impute Operation to be applied.
   * The field value of the other positional channel is taken as `key` of the `Impute` Operation.
   * The field of the `color` channel if specified is used as `groupby` of the `Impute` Operation.
   *
   * __See also:__ [`impute`](https://vega.github.io/vega-lite/docs/impute.html) documentation.
   */
  impute?: ImputeParams | null;
}

export type PolarFieldDef<F extends Field> = PositionFieldDefBase<F>;
export type PolarDatumDef<F extends Field> = PositionDatumDefBase<F>;

export function getBand({
  channel,
  fieldDef,
  fieldDef2,
  markDef: mark,
  stack,
  config,
  isMidPoint
}: {
  isMidPoint?: boolean;
  channel: Channel;
  fieldDef: FieldDef<string> | DatumDef;
  fieldDef2?: SecondaryChannelDef<string>;
  stack: StackProperties;
  markDef: MarkDef;
  config: Config;
}): number {
  if (isFieldOrDatumDef(fieldDef) && fieldDef.band !== undefined) {
    return fieldDef.band;
  }
  if (isFieldDef(fieldDef)) {
    const {timeUnit, bin} = fieldDef;

    if (timeUnit && !fieldDef2) {
      if (isMidPoint) {
        return getMarkConfig('timeUnitBandPosition', mark, config);
      } else {
        return isRectBasedMark(mark.type) ? getMarkConfig('timeUnitBand', mark, config) : 0;
      }
    } else if (isBinning(bin)) {
      return isRectBasedMark(mark.type) && !isMidPoint ? 1 : 0.5;
    }
  }
  if (stack?.fieldChannel === channel && isMidPoint) {
    return 0.5;
  }
  return undefined;
}

export function hasBand(
  channel: Channel,
  fieldDef: FieldDef<string>,
  fieldDef2: SecondaryChannelDef<string>,
  stack: StackProperties,
  markDef: MarkDef,
  config: Config
): boolean {
  if (isBinning(fieldDef.bin) || (fieldDef.timeUnit && isTypedFieldDef(fieldDef) && fieldDef.type === 'temporal')) {
    return !!getBand({channel, fieldDef, fieldDef2, stack, markDef, config});
  }
  return false;
}

/**
 * Field definition of a mark property, which can contain a legend.
 */
export type MarkPropFieldDef<F extends Field, T extends Type = Type> = ScaleFieldDef<F, T, boolean | BinParams | null> &
  LegendMixins;

export type MarkPropDatumDef<F extends Field> = LegendMixins & ScaleDatumDef<F>;

export type MarkPropFieldOrDatumDef<F extends Field, T extends Type = Type> =
  | MarkPropFieldDef<F, T>
  | MarkPropDatumDef<F>;

export interface LegendMixins {
  /**
   * An object defining properties of the legend.
   * If `null`, the legend for the encoding channel will be removed.
   *
   * __Default value:__ If undefined, default [legend properties](https://vega.github.io/vega-lite/docs/legend.html) are applied.
   *
   * __See also:__ [`legend`](https://vega.github.io/vega-lite/docs/legend.html) documentation.
   */
  legend?: Legend | null;
}

// Detail

// Order Path have no scale

export interface OrderFieldDef<F extends Field> extends FieldDefWithoutScale<F> {
  /**
   * The sort order. One of `"ascending"` (default) or `"descending"`.
   */
  sort?: SortOrder;
}

export interface StringFieldDef<F extends Field> extends FieldDefWithoutScale<F, StandardType>, FormatMixins {}

export type FieldDef<F extends Field, T extends Type = any> = SecondaryFieldDef<F> | TypedFieldDef<F, T>;
export type ChannelDef<F extends Field = string> = Encoding<F>[keyof Encoding<F>];

export function isConditionalDef<CD extends ChannelDef<any> | GuideEncodingConditionalValueDef | SignalRef>(
  channelDef: CD
): channelDef is CD & {condition: Conditional<any>} {
  return !!channelDef && 'condition' in channelDef;
}

/**
 * Return if a channelDef is a ConditionalValueDef with ConditionFieldDef
 */
export function hasConditionalFieldDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is {condition: Conditional<TypedFieldDef<F>>} {
  const condition = channelDef && channelDef['condition'];
  return !!condition && !isArray(condition) && isFieldDef(condition);
}

export function hasConditionalFieldOrDatumDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is {condition: Conditional<TypedFieldDef<F>>} {
  const condition = channelDef && channelDef['condition'];
  return !!condition && !isArray(condition) && isFieldOrDatumDef(condition);
}

export function hasConditionalValueDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is ValueDef<any> & {condition: Conditional<ValueDef<any>> | Conditional<ValueDef<any>>[]} {
  const condition = channelDef && channelDef['condition'];
  return !!condition && (isArray(condition) || isValueDef(condition));
}

export function isFieldDef<F extends Field>(
  channelDef: ChannelDef<F> | FieldDefBase<F> | DatumDef<F, any>
): channelDef is FieldDefBase<F> | TypedFieldDef<F> | SecondaryFieldDef<F> {
  // TODO: we can't use field in channelDef here as it's somehow failing runtime test
  return !!channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}

export function channelDefType<F extends Field>(channelDef: ChannelDef<F>): Type | undefined {
  return channelDef && channelDef['type'];
}

export function isDatumDef<F extends Field>(
  channelDef: ChannelDef<F> | FieldDefBase<F> | DatumDef<F, any>
): channelDef is DatumDef<F, any> {
  return !!channelDef && 'datum' in channelDef;
}

export function isContinuousFieldOrDatumDef<F extends Field>(cd: ChannelDef<F>) {
  // TODO: make datum support DateTime object
  return (isTypedFieldDef(cd) && isContinuous(cd)) || isNumericDataDef(cd);
}

export function isQuantitativeFieldOrDatumDef<F extends Field>(cd: ChannelDef<F>) {
  // TODO: make datum support DateTime object
  return channelDefType(cd) === 'quantitative' || isNumericDataDef(cd);
}

export function isNumericDataDef<F extends Field>(cd: ChannelDef<F>): cd is DatumDef<F, number> {
  return isDatumDef(cd) && isNumber(cd.datum);
}

export function isFieldOrDatumDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is FieldDef<F, any> | DatumDef<F> {
  return isFieldDef(channelDef) || isDatumDef(channelDef);
}

export function isTypedFieldDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is TypedFieldDef<F> {
  return !!channelDef && (('field' in channelDef && 'type' in channelDef) || channelDef['aggregate'] === 'count');
}

export function isValueDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is ValueDef<any> {
  return channelDef && 'value' in channelDef && 'value' in channelDef;
}

export function isScaleFieldDef<F extends Field>(channelDef: ChannelDef<F>): channelDef is ScaleFieldDef<F> {
  return !!channelDef && ('scale' in channelDef || 'sort' in channelDef);
}

export function isPositionFieldOrDatumDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is PositionFieldDef<F> | PositionDatumDef<F> {
  return channelDef && ('axis' in channelDef || 'stack' in channelDef || 'impute' in channelDef);
}

export function isMarkPropFieldOrDatumDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is MarkPropFieldDef<F, any> | MarkPropDatumDef<F> {
  return !!channelDef && 'legend' in channelDef;
}

export function isTextFieldOrDatumDef<F extends Field>(
  channelDef: ChannelDef<F>
): channelDef is StringFieldDef<F> | StringDatumDef<F> {
  return !!channelDef && ('format' in channelDef || 'formatType' in channelDef);
}

export interface FieldRefOption {
  /** Exclude bin, aggregate, timeUnit */
  nofn?: boolean;
  /** Wrap the field with datum, parent, or datum.datum (e.g., datum['...'] for Vega Expression */
  expr?: 'datum' | 'parent' | 'datum.datum';
  /** Prepend fn with custom function prefix */
  prefix?: string;
  /** Append suffix to the field ref for bin (default='start') */
  binSuffix?: 'end' | 'range' | 'mid';
  /** Append suffix to the field ref (general) */
  suffix?: string;
  /**
   * Use the field name for `as` in a transform.
   * We will not escape nested accesses because Vega transform outputs cannot be nested.
   */
  forAs?: boolean;
}

function isOpFieldDef(
  fieldDef: FieldDefBase<string> | WindowFieldDef | AggregatedFieldDef
): fieldDef is WindowFieldDef | AggregatedFieldDef {
  return 'op' in fieldDef;
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

  let argAccessor = ''; // for accessing argmin/argmax field at the end without getting escaped

  if (isCount(fieldDef)) {
    field = internalField('count');
  } else {
    let fn: string;

    if (!opt.nofn) {
      if (isOpFieldDef(fieldDef)) {
        fn = fieldDef.op;
      } else {
        const {bin, aggregate, timeUnit} = fieldDef;
        if (isBinning(bin)) {
          fn = binToString(bin);
          suffix = (opt.binSuffix ?? '') + (opt.suffix ?? '');
        } else if (aggregate) {
          if (isArgmaxDef(aggregate)) {
            argAccessor = `["${field}"]`;
            field = `argmax_${aggregate.argmax}`;
          } else if (isArgminDef(aggregate)) {
            argAccessor = `["${field}"]`;
            field = `argmin_${aggregate.argmin}`;
          } else {
            fn = String(aggregate);
          }
        } else if (timeUnit) {
          fn = timeUnitToString(timeUnit);
          suffix = ((!contains(['range', 'mid'], opt.binSuffix) && opt.binSuffix) || '') + (opt.suffix ?? '');
        }
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
    return removePathFromField(field);
  } else if (opt.expr) {
    // Expression to access flattened field. No need to escape dots.
    return flatAccessWithDatum(field, opt.expr) + argAccessor;
  } else {
    // We flattened all fields so paths should have become dot.
    return replacePathInField(field) + argAccessor;
  }
}

export function isDiscrete(def: TypedFieldDef<Field> | DatumDef<any, any>) {
  switch (def.type) {
    case 'nominal':
    case 'ordinal':
    case 'geojson':
      return true;
    case 'quantitative':
      return isFieldDef(def) && !!def.bin;
    case 'temporal':
      return false;
  }
  throw new Error(log.message.invalidFieldType(def.type));
}

export function isContinuous(fieldDef: TypedFieldDef<Field>) {
  return !isDiscrete(fieldDef);
}

export function isCount(fieldDef: FieldDefBase<Field>) {
  return fieldDef.aggregate === 'count';
}

export type FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => string;

export function verbalTitleFormatter(fieldDef: FieldDefBase<string>, config: Config) {
  const {field, bin, timeUnit, aggregate} = fieldDef;
  if (aggregate === 'count') {
    return config.countTitle;
  } else if (isBinning(bin)) {
    return `${field} (binned)`;
  } else if (timeUnit) {
    const unit = normalizeTimeUnit(timeUnit)?.unit;
    if (unit) {
      return `${field} (${getTimeUnitParts(unit).join('-')})`;
    }
  } else if (aggregate) {
    if (isArgmaxDef(aggregate)) {
      return `${field} for max ${aggregate.argmax}`;
    } else if (isArgminDef(aggregate)) {
      return `${field} for min ${aggregate.argmin}`;
    } else {
      return `${titleCase(aggregate)} of ${field}`;
    }
  }
  return field;
}

export function functionalTitleFormatter(fieldDef: FieldDefBase<string>) {
  const {aggregate, bin, timeUnit, field} = fieldDef;
  if (isArgmaxDef(aggregate)) {
    return `${field} for argmax(${aggregate.argmax})`;
  } else if (isArgminDef(aggregate)) {
    return `${field} for argmin(${aggregate.argmin})`;
  }

  const timeUnitParams = normalizeTimeUnit(timeUnit);

  const fn = aggregate || timeUnitParams?.unit || (timeUnitParams?.maxbins && 'timeunit') || (isBinning(bin) && 'bin');
  if (fn) {
    return fn.toUpperCase() + '(' + field + ')';
  } else {
    return field;
  }
}

export const defaultTitleFormatter: FieldTitleFormatter = (fieldDef: FieldDefBase<string>, config: Config) => {
  switch (config.fieldTitle) {
    case 'plain':
      return fieldDef.field;
    case 'functional':
      return functionalTitleFormatter(fieldDef);
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

export function title(
  fieldOrDatumDef: TypedFieldDef<string> | SecondaryFieldDef<string> | DatumDef,
  config: Config,
  {allowDisabling, includeDefault = true}: {allowDisabling: boolean; includeDefault?: boolean}
) {
  const guide = getGuide(fieldOrDatumDef) ?? {};
  const guideTitle = guide.title;

  if (!isFieldDef(fieldOrDatumDef)) {
    return guideTitle;
  }
  const fieldDef = fieldOrDatumDef;

  const def = includeDefault ? defaultTitle(fieldDef, config) : undefined;

  if (allowDisabling) {
    return getFirstDefined(guideTitle, fieldDef.title, def);
  } else {
    return guideTitle ?? fieldDef.title ?? def;
  }
}

export function getGuide(fieldDef: TypedFieldDef<string> | SecondaryFieldDef<string> | DatumDef): Guide {
  if (isPositionFieldOrDatumDef(fieldDef) && fieldDef.axis) {
    return fieldDef.axis;
  } else if (isMarkPropFieldOrDatumDef(fieldDef) && fieldDef.legend) {
    return fieldDef.legend;
  } else if (isFacetFieldDef(fieldDef) && fieldDef.header) {
    return fieldDef.header;
  }
  return undefined;
}

export function defaultTitle(fieldDef: FieldDefBase<string>, config: Config) {
  return titleFormatter(fieldDef, config);
}

export function getFormatMixins(fieldDef: TypedFieldDef<string> | DatumDef) {
  if (isTextFieldOrDatumDef(fieldDef)) {
    const {format, formatType} = fieldDef;
    return {format, formatType};
  } else {
    const guide = getGuide(fieldDef) ?? {};
    const {format, formatType} = guide;
    return {format, formatType};
  }
}

export function defaultType(fieldDef: TypedFieldDef<Field>, channel: Channel): Type {
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

export function getFieldDef<F extends Field>(channelDef: ChannelDef<F>): FieldDef<F> {
  if (isFieldDef(channelDef)) {
    return channelDef;
  } else if (hasConditionalFieldDef(channelDef)) {
    return channelDef.condition;
  }
  return undefined;
}

export function getFieldOrDatumDef<F extends Field = string, CD extends ChannelDef<F> = ChannelDef<F>>(
  channelDef: CD
): FieldDef<F> | DatumDef<F> {
  if (isFieldOrDatumDef<F>(channelDef)) {
    return channelDef;
  } else if (hasConditionalFieldOrDatumDef(channelDef)) {
    return channelDef.condition;
  }
  return undefined;
}

/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
export function initChannelDef(channelDef: ChannelDef<string>, channel: Channel, config: Config): ChannelDef<string> {
  if (isString(channelDef) || isNumber(channelDef) || isBoolean(channelDef)) {
    const primitiveType = isString(channelDef) ? 'string' : isNumber(channelDef) ? 'number' : 'boolean';
    log.warn(log.message.primitiveChannelDef(channel, primitiveType, channelDef));
    return {value: channelDef} as ValueDef<any>;
  }

  // If a fieldDef contains a field, we need type.
  if (isFieldOrDatumDef(channelDef)) {
    return initFieldOrDatumDef(channelDef, channel, config);
  } else if (hasConditionalFieldOrDatumDef(channelDef)) {
    return {
      ...channelDef,
      // Need to cast as normalizeFieldDef normally return FieldDef, but here we know that it is definitely Condition<FieldDef>
      condition: initFieldOrDatumDef(channelDef.condition, channel, config) as Conditional<TypedFieldDef<string>>
    };
  }
  return channelDef;
}

export function initFieldOrDatumDef(
  fd: FieldDef<string, any> | DatumDef,
  channel: Channel,
  config: Config
): FieldDef<string, any> | DatumDef {
  if (isTextFieldOrDatumDef(fd)) {
    const {format, formatType, ...rest} = fd;
    if (isCustomFormatType(formatType) && !config.customFormatTypes) {
      log.warn(log.message.customFormatTypeNotAllowed(channel));
      return initFieldOrDatumDef(rest, channel, config);
    }
  } else {
    const guideType = isPositionFieldOrDatumDef(fd)
      ? 'axis'
      : isMarkPropFieldOrDatumDef(fd)
      ? 'legend'
      : isFacetFieldDef(fd)
      ? 'header'
      : null;
    if (guideType && fd[guideType]) {
      const {format, formatType, ...newGuide} = fd[guideType];
      if (isCustomFormatType(formatType) && !config.customFormatTypes) {
        log.warn(log.message.customFormatTypeNotAllowed(channel));
        return initFieldOrDatumDef({...fd, [guideType]: newGuide}, channel, config);
      }
    }
  }

  if (isFieldDef(fd)) {
    return initFieldDef(fd, channel);
  }
  return initDatumDef(fd);
}

function initDatumDef(datumDef: DatumDef): DatumDef {
  let type = datumDef['type'];
  if (type) {
    return datumDef;
  }
  const {datum} = datumDef;
  type = isNumber(datum) ? 'quantitative' : isString(datum) ? 'nominal' : isDateTime(datum) ? 'temporal' : undefined;

  return {...datumDef, type};
}

export function initFieldDef(fd: FieldDef<string, any>, channel: Channel) {
  const {aggregate, timeUnit, bin, field} = fd;
  const fieldDef = {...fd};

  // Drop invalid aggregate
  if (aggregate && !isAggregateOp(aggregate) && !isArgmaxDef(aggregate) && !isArgminDef(aggregate)) {
    log.warn(log.message.invalidAggregate(aggregate));
    delete fieldDef.aggregate;
  }

  // Normalize Time Unit
  if (timeUnit) {
    fieldDef.timeUnit = normalizeTimeUnit(timeUnit);
  }

  if (field) {
    fieldDef.field = `${field}`;
  }

  // Normalize bin
  if (isBinning(bin)) {
    fieldDef.bin = normalizeBin(bin, channel);
  }

  if (isBinned(bin) && !isXorY(channel)) {
    log.warn(`Channel ${channel} should not be used with "binned" bin.`);
  }

  // Normalize Type
  if (isTypedFieldDef(fieldDef)) {
    const {type} = fieldDef;
    const fullType = getFullName(type);
    if (type !== fullType) {
      // convert short type to full type
      fieldDef.type = fullType;
    }
    if (type !== 'quantitative') {
      if (isCountingAggregateOp(aggregate)) {
        log.warn(log.message.invalidFieldTypeForCountAggregate(type, aggregate));
        fieldDef.type = 'quantitative';
      }
    }
  } else if (!isSecondaryRangeChannel(channel)) {
    // If type is empty / invalid, then augment with default type
    const newType = defaultType(fieldDef as TypedFieldDef<any>, channel);
    log.warn(log.message.missingFieldType(channel, newType));

    fieldDef['type'] = newType;
  }

  if (isTypedFieldDef(fieldDef)) {
    const {compatible, warning} = channelCompatibility(fieldDef, channel);
    if (!compatible) {
      log.warn(warning);
    }
  }

  if (isSortableFieldDef(fieldDef) && isString(fieldDef.sort)) {
    const {sort} = fieldDef;
    if (isSortByChannel(sort)) {
      return {
        ...fieldDef,
        sort: {encoding: sort}
      };
    }
    const sub = sort.substr(1);
    if (sort.charAt(0) === '-' && isSortByChannel(sub)) {
      return {
        ...fieldDef,
        sort: {encoding: sub, order: 'descending'}
      };
    }
  }

  if (isFacetFieldDef(fieldDef)) {
    const {header} = fieldDef;
    const {orient, ...rest} = header;
    if (orient) {
      return {
        ...fieldDef,
        header: {
          ...rest,
          labelOrient: header.labelOrient || orient,
          titleOrient: header.titleOrient || orient
        }
      };
    }
  }

  return fieldDef;
}

export function normalizeBin(bin: BinParams | boolean | 'binned', channel?: Channel) {
  if (isBoolean(bin)) {
    return {maxbins: autoMaxBins(channel)};
  } else if (bin === 'binned') {
    return {
      binned: true
    };
  } else if (!bin.maxbins && !bin.step) {
    return {...bin, maxbins: autoMaxBins(channel)};
  } else {
    return bin;
  }
}

const COMPATIBLE = {compatible: true};
export function channelCompatibility(
  fieldDef: TypedFieldDef<Field>,
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
    case ROW:
    case COLUMN:
    case FACET:
      if (isContinuous(fieldDef)) {
        return {
          compatible: false,
          warning: log.message.facetChannelShouldBeDiscrete(channel)
        };
      }
      return COMPATIBLE;

    case X:
    case Y:
    case COLOR:
    case FILL:
    case STROKE:
    case TEXT:
    case DETAIL:
    case KEY:
    case TOOLTIP:
    case HREF:
    case URL:
    case ANGLE:
    case THETA:
    case RADIUS:
    case DESCRIPTION:
      return COMPATIBLE;

    case LONGITUDE:
    case LONGITUDE2:
    case LATITUDE:
    case LATITUDE2:
      if (type !== QUANTITATIVE) {
        return {
          compatible: false,
          warning: `Channel ${channel} should be used with a quantitative field only, not ${fieldDef.type} field.`
        };
      }
      return COMPATIBLE;

    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:
    case STROKEWIDTH:
    case SIZE:
    case THETA2:
    case RADIUS2:
    case X2:
    case Y2:
      if (type === 'nominal' && !fieldDef['sort']) {
        return {
          compatible: false,
          warning: `Channel ${channel} should not be used with an unsorted discrete field.`
        };
      }
      return COMPATIBLE;

    case STROKEDASH:
      if (!contains(['ordinal', 'nominal'], fieldDef.type)) {
        return {
          compatible: false,
          warning: 'StrokeDash channel should be used with only discrete data.'
        };
      }
      return COMPATIBLE;

    case SHAPE:
      if (!contains(['ordinal', 'nominal', 'geojson'], fieldDef.type)) {
        return {
          compatible: false,
          warning: 'Shape channel should be used with only either discrete or geojson data.'
        };
      }
      return COMPATIBLE;

    case ORDER:
      if (fieldDef.type === 'nominal' && !('sort' in fieldDef)) {
        return {
          compatible: false,
          warning: `Channel order is inappropriate for nominal field, which has no inherent order.`
        };
      }
      return COMPATIBLE;
  }
}

/**
 * Check if the field def uses a time format or does not use any format but is temporal
 * (this does not cover field defs that are temporal but use a number format).
 */
export function isFieldOrDatumDefForTimeFormat(fieldOrDatumDef: FieldDef<string> | DatumDef): boolean {
  const {formatType} = getFormatMixins(fieldOrDatumDef);
  return formatType === 'time' || (!formatType && isTimeFieldDef(fieldOrDatumDef));
}

/**
 * Check if field def has type `temporal`. If you want to also cover field defs that use a time format, use `isTimeFormatFieldDef`.
 */
export function isTimeFieldDef(def: FieldDef<any> | DatumDef): boolean {
  return def && (def['type'] === 'temporal' || (isFieldDef(def) && !!def.timeUnit));
}

/**
 * Getting a value associated with a fielddef.
 * Convert the value to Vega expression if applicable (for datetime object, or string if the field def is temporal or has timeUnit)
 */
export function valueExpr(
  v: number | string | boolean | DateTime | SignalRef | number[],
  {
    timeUnit,
    type,
    wrapTime,
    undefinedIfExprNotRequired
  }: {
    timeUnit: TimeUnit | TimeUnitParams;
    type?: Type;
    wrapTime?: boolean;
    undefinedIfExprNotRequired?: boolean;
  }
): string {
  const unit = timeUnit && normalizeTimeUnit(timeUnit)?.unit;
  let isTime = unit || type === 'temporal';

  let expr;
  if (isSignalRef(v)) {
    expr = v.signal;
  } else if (isDateTime(v)) {
    isTime = true;
    expr = dateTimeToExpr(v);
  } else if (isString(v) || isNumber(v)) {
    if (isTime) {
      expr = `datetime(${JSON.stringify(v)})`;

      if (isLocalSingleTimeUnit(unit)) {
        // for single timeUnit, we will use dateTimeToExpr to convert number/string to match the timeUnit
        if ((isNumber(v) && v < 10000) || (isString(v) && isNaN(Date.parse(v)))) {
          expr = dateTimeToExpr({[unit]: v});
        }
      }
    }
  }
  if (expr) {
    return wrapTime && isTime ? `time(${expr})` : expr;
  }
  // number or boolean or normal string
  return undefinedIfExprNotRequired ? undefined : JSON.stringify(v);
}

/**
 * Standardize value array -- convert each value to Vega expression if applicable
 */
export function valueArray(
  fieldOrDatumDef: TypedFieldDef<string> | DatumDef,
  values: (number | string | boolean | DateTime)[]
) {
  const {type} = fieldOrDatumDef;
  return values.map(v => {
    const expr = valueExpr(v, {
      timeUnit: isFieldDef(fieldOrDatumDef) ? fieldOrDatumDef.timeUnit : undefined,
      type,
      undefinedIfExprNotRequired: true
    });
    // return signal for the expression if we need an expression
    if (expr !== undefined) {
      return {signal: expr};
    }
    // otherwise just return the original value
    return v;
  });
}

/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export function binRequiresRange(fieldDef: FieldDef<string>, channel: Channel): boolean {
  if (!isBinning(fieldDef.bin)) {
    console.warn('Only call this method for binned field defs.');
    return false;
  }

  // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
  // We could check whether the axis or legend exists (not disabled) but that seems overkill.
  return isScaleChannel(channel) && contains(['ordinal', 'nominal'], (fieldDef as ScaleFieldDef<string>).type);
}
