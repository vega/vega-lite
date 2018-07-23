import {isArray} from 'vega-util';
import {isAggregateOp} from './aggregate';
import {isBinning} from './bin';
import {Channel, CHANNELS, isChannel, supportMark} from './channel';
import {Config} from './config';
import {FacetMapping} from './facet';
import {
  ChannelDef,
  Field,
  FieldDef,
  FieldDefWithCondition,
  FieldDefWithoutScale,
  getFieldDef,
  hasConditionalFieldDef,
  isConditionalDef,
  isFieldDef,
  isValueDef,
  MarkPropFieldDef,
  normalize,
  normalizeFieldDef,
  OrderFieldDef,
  PositionFieldDef,
  TextFieldDef,
  title,
  ValueDef,
  ValueDefWithCondition,
  vgField
} from './fielddef';
import * as log from './log';
import {Mark} from './mark';
import {AggregatedFieldDef, BinTransform, TimeUnitTransform} from './transform';
import {keys, some} from './util';

export interface Encoding<F> {
  /**
   * X coordinates of the marks, or width of horizontal `"bar"` and `"area"`.
   */
  x?: PositionFieldDef<F> | ValueDef;

  /**
   * Y coordinates of the marks, or height of vertical `"bar"` and `"area"`.
   */
  y?: PositionFieldDef<F> | ValueDef;

  /**
   * X2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // TODO: Ham need to add default behavior
  x2?: FieldDefWithoutScale<F> | ValueDef;

  /**
   * Y2 coordinates for ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // TODO: Ham need to add default behavior
  y2?: FieldDefWithoutScale<F> | ValueDef;

  /**
   * Longitude position of geographically projected marks.
   */
  longitude?: FieldDefWithoutScale<F>;

  /**
   * Latitude position of geographically projected marks.
   */
  latitude?: FieldDefWithoutScale<F>;

  /**
   * Longitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  longitude2?: FieldDefWithoutScale<F>;

  /**
   * Latitude-2 position for geographically projected ranged `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  latitude2?: FieldDefWithoutScale<F>;

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
  color?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>;

  /**
   * Fill color of the marks.
   * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
   *
   * _Note:_ When using `fill` channel, `color ` channel will be ignored. To customize both fill and stroke, please use `fill` and `stroke` channels (not `fill` and `color`).
   */
  fill?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>;

  /**
   * Stroke color of the marks.
   * __Default value:__ If undefined, the default color depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `color` property.
   *
   * _Note:_ When using `stroke` channel, `color ` channel will be ignored. To customize both stroke and fill, please use `stroke` and `fill` channels (not `stroke` and `color`).
   */
  stroke?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>;

  /**
   * Opacity of the marks – either can be a value or a range.
   *
   * __Default value:__ If undefined, the default opacity depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#mark)'s `opacity` property.
   */
  opacity?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>;

  /**
   * Size of the mark.
   * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
   * - For `"bar"` and `"tick"` – the bar and tick's size.
   * - For `"text"` – the text's font size.
   * - Size is unsupported for `"line"`, `"area"`, and `"rect"`. (Use `"trail"` instead of line with varying size)
   */
  size?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>;

  /**
   * For `point` marks the supported values are
   * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
   * or `"triangle-down"`, or else a custom SVG path string.
   * For `geoshape` marks it should be a field definition of the geojson data
   *
   * __Default value:__ If undefined, the default shape depends on [mark config](https://vega.github.io/vega-lite/docs/config.html#point-config)'s `shape` property.
   */
  shape?: FieldDefWithCondition<MarkPropFieldDef<F>> | ValueDefWithCondition<MarkPropFieldDef<F>>; // TODO: maybe distinguish ordinal-only
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
  text?: FieldDefWithCondition<TextFieldDef<F>> | ValueDefWithCondition<TextFieldDef<F>>;

  /**
   * The tooltip text to show upon mouse hover.
   */
  tooltip?: FieldDefWithCondition<TextFieldDef<F>> | ValueDefWithCondition<TextFieldDef<F>> | TextFieldDef<F>[];

  /**
   * A URL to load upon mouse click.
   */
  href?: FieldDefWithCondition<FieldDefWithoutScale<F>> | ValueDefWithCondition<FieldDefWithoutScale<F>>;

  /**
   * Order of the marks.
   * - For stacked marks, this `order` channel encodes [stack order](https://vega.github.io/vega-lite/docs/stack.html#order).
   * - For line and trail marks, this `order` channel encodes order of data points in the lines. This can be useful for creating [a connected scatterplot](https://vega.github.io/vega-lite/examples/connected_scatterplot.html).  Setting `order` to `{"value": null}` makes the line marks use the original order in the data sources.
   * - Otherwise, this `order` channel encodes layer order of the marks.
   *
   * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
   */
  order?: OrderFieldDef<F> | OrderFieldDef<F>[] | ValueDef;
}

export interface EncodingWithFacet<F> extends Encoding<F>, FacetMapping<F> {}

export function channelHasField<T>(encoding: EncodingWithFacet<T>, channel: Channel): boolean {
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

export function extractTransformsFromEncoding(oldEncoding: Encoding<string>, config: Config) {
  const groupby: string[] = [];
  const bins: BinTransform[] = [];
  const timeUnits: TimeUnitTransform[] = [];
  const aggregate: AggregatedFieldDef[] = [];
  const encoding: Encoding<string> = {};

  forEach(oldEncoding, (channelDef, channel) => {
    if (isFieldDef(channelDef)) {
      const transformedField = vgField(channelDef, {forAs: true});
      if (channelDef.aggregate && isAggregateOp(channelDef.aggregate)) {
        aggregate.push({
          op: channelDef.aggregate,
          field: channelDef.field,
          as: transformedField
        });
      } else {
        // Add bin or timeUnit transform if applicable
        const bin = channelDef.bin;
        if (isBinning(bin)) {
          const {field} = channelDef;
          bins.push({bin, field, as: transformedField});
        } else if (channelDef.timeUnit) {
          const {timeUnit, field} = channelDef;
          timeUnits.push({timeUnit, field, as: transformedField});
        }

        // TODO(@alanbanh): make bin correct
        groupby.push(transformedField);
      }
      // now the field should refer to post-transformed field instead
      encoding[channel] = {
        field: vgField(channelDef),
        type: channelDef.type,
        title: title(channelDef, config, {allowDisabling: true})
      };
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

export function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string> {
  return keys(encoding).reduce((normalizedEncoding: Encoding<string>, channel: Channel | string) => {
    if (!isChannel(channel)) {
      // Drop invalid channel
      log.warn(log.message.invalidEncodingChannel(channel));
      return normalizedEncoding;
    }

    if (!supportMark(encoding, channel, mark)) {
      // Drop unsupported channel
      log.warn(log.message.incompatibleChannel(channel, mark));
      return normalizedEncoding;
    }

    // Drop line's size if the field is aggregated.
    if (channel === 'size' && mark === 'line') {
      const fieldDef = getFieldDef(encoding[channel]);
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
      if (!isFieldDef(channelDef) && !isValueDef(channelDef) && !isConditionalDef(channelDef)) {
        log.warn(log.message.emptyFieldDef(channelDef, channel));
        return normalizedEncoding;
      }
      normalizedEncoding[channel] = normalize(channelDef as ChannelDef<string>, channel);
    }
    return normalizedEncoding;
  }, {});
}

export function isRanged(encoding: EncodingWithFacet<any>) {
  return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}

export function fieldDefs<T>(encoding: EncodingWithFacet<T>): FieldDef<T>[] {
  const arr: FieldDef<T>[] = [];
  CHANNELS.forEach(channel => {
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
  });
  return arr;
}

export function forEach(mapping: any, f: (fd: FieldDef<string>, c: Channel) => void, thisArg?: any) {
  if (!mapping) {
    return;
  }

  for (const channel of keys(mapping)) {
    if (isArray(mapping[channel])) {
      mapping[channel].forEach((channelDef: ChannelDef<string>) => {
        f.call(thisArg, channelDef, channel);
      });
    } else {
      f.call(thisArg, mapping[channel], channel);
    }
  }
}

export function reduce<T, U extends {[k in Channel]?: any}>(
  mapping: U,
  f: (acc: any, fd: FieldDef<string>, c: Channel) => U,
  init: T,
  thisArg?: any
) {
  if (!mapping) {
    return init;
  }

  return keys(mapping).reduce((r, channel) => {
    const map = mapping[channel];
    if (isArray(map)) {
      return map.reduce((r1: T, channelDef: ChannelDef<string>) => {
        return f.call(thisArg, r1, channelDef, channel);
      }, r);
    } else {
      return f.call(thisArg, r, map, channel);
    }
  }, init);
}
