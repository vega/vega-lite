import {isArray} from 'vega-util';
import {isAggregateOp} from './aggregate';
import {isBinning} from './bin';
import {Channel, CHANNELS, isChannel, isNonPositionScaleChannel, isSecondaryRangeChannel, supportMark} from './channel';
import {Config} from './config';
import {
  binRequiresRange,
  ChannelDef,
  ColorFieldDefWithCondition,
  ColorValueDefWithCondition,
  Field,
  FieldDef,
  FieldDefWithoutScale,
  getFieldDef,
  getGuide,
  getTypedFieldDef,
  hasConditionalFieldDef,
  isConditionalDef,
  isFieldDef,
  isTypedFieldDef,
  isValueDef,
  LatLongFieldDef,
  normalize,
  normalizeFieldDef,
  NumericFieldDefWithCondition,
  NumericValueDefWithCondition,
  OrderFieldDef,
  PositionFieldDef,
  RepeatRef,
  SecondaryFieldDef,
  ShapeFieldDefWithCondition,
  ShapeValueDefWithCondition,
  StringFieldDefWithCondition,
  StringValueDefWithCondition,
  TextFieldDef,
  TextFieldDefWithCondition,
  TextValueDefWithCondition,
  title,
  TypedFieldDef,
  ValueDef,
  vgField
} from './fielddef';
import * as log from './log';
import {Mark} from './mark';
import {FacetMapping} from './spec/facet';
import {getDateTimeComponents} from './timeunit';
import {AggregatedFieldDef, BinTransform, TimeUnitTransform} from './transform';
import {Type} from './type';
import {keys, some} from './util';

export interface Encoding<F extends Field> {
  /**
   * X coordinates of the marks, or width of horizontal `"bar"` and `"area"`.
   *
   * The `value` of this channel can be a number or a string `"width"`.
   */
  x?: PositionFieldDef<F> | ValueDef<number | 'width'>;

  /**
   * Y coordinates of the marks, or height of vertical `"bar"` and `"area"`.
   *
   * The `value` of this channel can be a number or a string `"height"`.
   */
  y?: PositionFieldDef<F> | ValueDef<number | 'height'>;

  /**
   * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   *
   * The `value` of this channel can be a number or a string `"width"`.
   */
  // TODO: Ham need to add default behavior
  // `x2` cannot have type as it should have the same type as `x`
  x2?: SecondaryFieldDef<F> | ValueDef<number | 'width'>;

  /**
   * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   *
   * The `value` of this channel can be a number or a string `"height"`.
   */
  // TODO: Ham need to add default behavior
  // `y2` cannot have type as it should have the same type as `y`
  y2?: SecondaryFieldDef<F> | ValueDef<number | 'height'>;

  /**
   * Error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  xError?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Secondary error value of x coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  // `xError2` cannot have type as it should have the same type as `xError`
  xError2?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  yError?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Secondary error value of y coordinates for error specified `"errorbar"` and `"errorband"`.
   */
  // `yError2` cannot have type as it should have the same type as `yError`
  yError2?: SecondaryFieldDef<F> | ValueDef<number>;

  /**
   * Longitude position of geographically projected marks.
   */
  longitude?: LatLongFieldDef<F>;

  /**
   * Latitude position of geographically projected marks.
   */
  latitude?: LatLongFieldDef<F>;

  /**
   * Longitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // `longitude2` cannot have type as it should have the same type as `longitude`
  longitude2?: SecondaryFieldDef<F>;

  /**
   * Latitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // `latitude2` cannot have type as it should have the same type as `latitude`
  latitude2?: SecondaryFieldDef<F>;

  /**
   * Color of the marks – either fill or stroke color based on  the `filled` property of mark definition.
   * By default, `color` represents fill color for `"area"`, `"bar"`, `"tick"`,
   * `"text"`, `"trail"`, `"circle"`, and `"square"` / stroke color for `"line"` and `"point"`.
   *
   * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
   *
   * _Note:_
   * 1) For fine-grained control over both fill and stroke colors of the marks, please use the `fill` and `stroke` channels.  If either `fill` or `stroke` channel is specified, `color` channel will be ignored.
   * 2) See the scale documentation for more information about customizing [color scheme](https://vega.github.io/vega-lite/docs/scale.html#scheme).
   */
  color?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;

  /**
   * Fill color of the marks.
   * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
   *
   * _Note:_ When using `fill` channel, `color ` channel will be ignored. To customize both fill and stroke, please use `fill` and `stroke` channels (not `fill` and `color`).
   */
  fill?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;

  /**
   * Stroke color of the marks.
   * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
   *
   * _Note:_ When using `stroke` channel, `color ` channel will be ignored. To customize both stroke and fill, please use `stroke` and `fill` channels (not `stroke` and `color`).
   */

  stroke?: ColorFieldDefWithCondition<F> | ColorValueDefWithCondition<F>;

  /**
   * Opacity of the marks.
   *
   * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `opacity` property.
   */
  opacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;

  /**
   * Fill opacity of the marks.
   *
   * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `fillOpacity` property.
   */
  fillOpacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;

  /**
   * Stroke opacity of the marks.
   *
   * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `strokeOpacity` property.
   */
  strokeOpacity?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;

  /**
   * Stroke width of the marks.
   *
   * __Default value:__ If undefined, the default stroke width depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `strokeWidth` property.
   */
  strokeWidth?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;

  /**
   * Size of the mark.
   * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
   * - For `"bar"` and `"tick"` – the bar and tick's size.
   * - For `"text"` – the text's font size.
   * - Size is unsupported for `"line"`, `"area"`, and `"rect"`. (Use `"trail"` instead of line with varying size)
   */
  size?: NumericFieldDefWithCondition<F> | NumericValueDefWithCondition<F>;

  /**
   * For `point` marks the supported values are
   * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
   * or `"triangle-down"`, or else a custom SVG path string.
   * For `geoshape` marks it should be a field definition of the geojson data
   *
   * __Default value:__ If undefined, the default shape depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#point-config)'s `shape` property.
   */
  shape?: ShapeFieldDefWithCondition<F> | ShapeValueDefWithCondition<F>;
  /**
   * Additional levels of detail for grouping data in aggregate views and
   * in line, trail, and area marks without mapping data to a specific visual channel.
   */
  detail?: FieldDefWithoutScale<F> | FieldDefWithoutScale<F>[];

  /**
   * A data field to use as a unique key for data binding. When a visualization’s data is updated, the key value will be used to match data elements to existing mark instances. Use a key channel to enable object constancy for transitions over dynamic data.
   */
  key?: FieldDefWithoutScale<F>;

  /**
   * Text of the `text` mark.
   */
  text?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F>;

  /**
   * The tooltip text to show upon mouse hover.
   */
  tooltip?: TextFieldDefWithCondition<F> | TextValueDefWithCondition<F> | TextFieldDef<F>[] | null;

  /**
   * A URL to load upon mouse click.
   */
  href?: StringFieldDefWithCondition<F> | StringValueDefWithCondition<F>;

  /**
   * Order of the marks.
   * - For stacked marks, this `order` channel encodes [stack order](https://vega.github.io/vega-lite/docs/stack.html#order).
   * - For line and trail marks, this `order` channel encodes order of data points in the lines. This can be useful for creating [a connected scatterplot](https://vega.github.io/vega-lite/examples/connected_scatterplot.html).  Setting `order` to `{"value": null}` makes the line marks use the original order in the data sources.
   * - Otherwise, this `order` channel encodes layer order of the marks.
   *
   * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
   */
  order?: OrderFieldDef<F> | OrderFieldDef<F>[] | ValueDef<number>;
}

export interface EncodingWithFacet<F extends Field> extends Encoding<F>, FacetMapping<F> {}

export function channelHasField<F extends Field>(encoding: EncodingWithFacet<F>, channel: Channel): boolean {
  const channelDef = encoding && encoding[channel];
  if (channelDef) {
    if (isArray(channelDef)) {
      return some(channelDef, fieldDef => !!fieldDef.field);
    } else {
      return isFieldDef(channelDef) || hasConditionalFieldDef(channelDef);
    }
  }
  return false;
}

export function isAggregate(encoding: EncodingWithFacet<Field>) {
  return some(CHANNELS, channel => {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      if (isArray(channelDef)) {
        return some(channelDef, fieldDef => !!fieldDef.aggregate);
      } else {
        const fieldDef = getFieldDef(channelDef);
        return fieldDef && !!fieldDef.aggregate;
      }
    }
    return false;
  });
}
export function extractTransformsFromEncoding(oldEncoding: Encoding<string | RepeatRef>, config: Config) {
  const groupby: string[] = [];
  const bins: BinTransform[] = [];
  const timeUnits: TimeUnitTransform[] = [];
  const aggregate: AggregatedFieldDef[] = [];
  const encoding: Encoding<string> = {};

  forEach(oldEncoding, (channelDef, channel) => {
    // Extract potential embedded transformations along with remaining properties
    if (isFieldDef(channelDef)) {
      const {field, aggregate: aggOp, timeUnit, bin, ...remaining} = channelDef;
      if (aggOp || timeUnit || bin) {
        const guide = getGuide(channelDef);
        const isTitleDefined = guide && guide.title;
        const newField = vgField(channelDef, {forAs: true});
        const newChannelDef = {
          // Only add title if it doesn't exist
          ...(isTitleDefined ? [] : {title: title(channelDef, config, {allowDisabling: true})}),
          ...remaining,
          // Always overwrite field
          field: newField
        };
        const isPositionChannel: boolean = channel === Channel.X || channel === Channel.Y;
        if (aggOp && isAggregateOp(aggOp)) {
          const aggregateEntry: AggregatedFieldDef = {
            op: aggOp,
            as: newField
          };
          if (field) {
            aggregateEntry.field = field;
          }
          aggregate.push(aggregateEntry);
        } else if (isTypedFieldDef(channelDef) && isBinning(bin)) {
          bins.push({bin, field, as: newField});
          // Add additional groupbys for range and end of bins
          groupby.push(vgField(channelDef, {binSuffix: 'end'}));
          if (binRequiresRange(channelDef, channel)) {
            groupby.push(vgField(channelDef, {binSuffix: 'range'}));
          }
          // Create accompanying 'x2' or 'y2' field if channel is 'x' or 'y' respectively
          if (isPositionChannel) {
            const secondaryChannel: TypedFieldDef<string> = {
              field: newField + '_end',
              type: Type.QUANTITATIVE
            };
            encoding[channel + '2'] = secondaryChannel;
          }
          newChannelDef['bin'] = 'binned';
          if (!isSecondaryRangeChannel(channel)) {
            newChannelDef['type'] = Type.QUANTITATIVE;
          }
        } else if (timeUnit) {
          timeUnits.push({timeUnit, field, as: newField});

          // Add formatting to appropriate property based on the type of channel we're processing
          const format = getDateTimeComponents(timeUnit, config.axis.shortTimeLabels).join(' ');
          if (isNonPositionScaleChannel(channel)) {
            newChannelDef['legend'] = {format, ...newChannelDef['legend']};
          } else if (isPositionChannel) {
            newChannelDef['axis'] = {format, ...newChannelDef['axis']};
          } else if (channel === 'text' || channel === 'tooltip') {
            newChannelDef['format'] = newChannelDef['format'] || format;
          }
        }
        if (!aggOp) {
          groupby.push(newField);
        }
        // now the field should refer to post-transformed field instead
        encoding[channel] = newChannelDef;
      } else {
        groupby.push(field);
        encoding[channel] = oldEncoding[channel];
      }
    } else {
      // For value def, just copy
      encoding[channel] = oldEncoding[channel];
    }
  });

  return {
    bins,
    timeUnits,
    aggregate,
    groupby,
    encoding
  };
}

export function markChannelCompatible(encoding: Encoding<string>, channel: Channel, mark: Mark) {
  const markSupported = supportMark(channel, mark);
  if (!markSupported) {
    return false;
  } else if (markSupported === 'binned') {
    const primaryFieldDef = encoding[channel === 'x2' ? 'x' : 'y'];

    // circle, point, square and tick only support x2/y2 when their corresponding x/y fieldDef
    // has "binned" data and thus need x2/y2 to specify the bin-end field.
    if (isFieldDef(primaryFieldDef) && isFieldDef(encoding[channel]) && primaryFieldDef.bin === 'binned') {
      return true;
    } else {
      return false;
    }
  }
  return true;
}

export function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string> {
  return keys(encoding).reduce((normalizedEncoding: Encoding<string>, channel: Channel | string) => {
    if (!isChannel(channel)) {
      // Drop invalid channel
      log.warn(log.message.invalidEncodingChannel(channel));
      return normalizedEncoding;
    }

    if (!markChannelCompatible(encoding, channel, mark)) {
      // Drop unsupported channel
      log.warn(log.message.incompatibleChannel(channel, mark));
      return normalizedEncoding;
    }

    // Drop line's size if the field is aggregated.
    if (channel === 'size' && mark === 'line') {
      const fieldDef = getTypedFieldDef(encoding[channel]);
      if (fieldDef && fieldDef.aggregate) {
        log.warn(log.message.LINE_WITH_VARYING_SIZE);
        return normalizedEncoding;
      }
    }

    // Drop color if either fill or stroke is specified
    if (channel === 'color' && ('fill' in encoding || 'stroke' in encoding)) {
      log.warn(log.message.droppingColor('encoding', {fill: 'fill' in encoding, stroke: 'stroke' in encoding}));
      return normalizedEncoding;
    }

    const channelDef = encoding[channel];
    if (
      channel === 'detail' ||
      (channel === 'order' && !isArray(channelDef) && !isValueDef(channelDef)) ||
      (channel === 'tooltip' && isArray(channelDef))
    ) {
      if (channelDef) {
        // Array of fieldDefs for detail channel (or production rule)
        normalizedEncoding[channel] = (isArray(channelDef) ? channelDef : [channelDef]).reduce(
          (defs: FieldDef<string>[], fieldDef: FieldDef<string>) => {
            if (!isFieldDef(fieldDef)) {
              log.warn(log.message.emptyFieldDef(fieldDef, channel));
            } else {
              defs.push(normalizeFieldDef(fieldDef, channel));
            }
            return defs;
          },
          []
        );
      }
    } else {
      if (channel === 'tooltip' && channelDef === null) {
        // Preserve null so we can use it to disable tooltip
        normalizedEncoding[channel] = null;
      } else if (!isFieldDef(channelDef) && !isValueDef(channelDef) && !isConditionalDef(channelDef)) {
        log.warn(log.message.emptyFieldDef(channelDef, channel));
        return normalizedEncoding;
      }
      normalizedEncoding[channel] = normalize(channelDef as ChannelDef, channel);
    }
    return normalizedEncoding;
  }, {});
}

export function isRanged(encoding: EncodingWithFacet<any>) {
  return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}

export function fieldDefs<F extends Field>(encoding: EncodingWithFacet<F>): FieldDef<F>[] {
  const arr: FieldDef<F>[] = [];
  for (const channel of keys(encoding)) {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      (isArray(channelDef) ? channelDef : [channelDef]).forEach(def => {
        if (isFieldDef(def)) {
          arr.push(def);
        } else if (hasConditionalFieldDef(def)) {
          arr.push(def.condition);
        }
      });
    }
  }
  return arr;
}

export function forEach(mapping: any, f: (cd: ChannelDef, c: Channel) => void, thisArg?: any) {
  if (!mapping) {
    return;
  }

  for (const channel of keys(mapping)) {
    if (isArray(mapping[channel])) {
      mapping[channel].forEach((channelDef: ChannelDef) => {
        f.call(thisArg, channelDef, channel);
      });
    } else {
      f.call(thisArg, mapping[channel], channel);
    }
  }
}

export function reduce<T, U extends {[k in Channel]?: any}>(
  mapping: U,
  f: (acc: any, fd: TypedFieldDef<string>, c: Channel) => U,
  init: T,
  thisArg?: any
) {
  if (!mapping) {
    return init;
  }

  return keys(mapping).reduce((r, channel) => {
    const map = mapping[channel];
    if (isArray(map)) {
      return map.reduce((r1: T, channelDef: ChannelDef) => {
        return f.call(thisArg, r1, channelDef, channel);
      }, r);
    } else {
      return f.call(thisArg, r, map, channel);
    }
  }, init);
}
