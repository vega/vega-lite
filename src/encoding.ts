
import {Channel, CHANNELS, supportMark} from './channel';
import {Facet} from './facet';
import {
  ChannelDef,
  ConditionalFieldDef,
  ConditionalValueDef,
  Field,
  FieldDef,
  getFieldDef,
  hasConditionFieldDef,
  isConditionalDef,
  isFieldDef,
  isValueDef,
  LegendFieldDef,
  normalize,
  normalizeFieldDef,
  OrderFieldDef,
  PositionFieldDef,
  TextFieldDef,
  ValueDef
} from './fielddef';
import * as log from './log';
import {Mark} from './mark';
import {isArray, keys, some} from './util';

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
   * X2 coordinates for ranged  `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // TODO: Ham need to add default behavior
  x2?: FieldDef<F> | ValueDef;

  /**
   * Y2 coordinates for ranged  `"area"`, `"bar"`, `"rect"`, and  `"rule"`.
   */
  // TODO: Ham need to add default behavior
  y2?: FieldDef<F> | ValueDef;

  /**
   * Color of the marks – either fill or stroke color based on mark type.
   * By default, `color` represents fill color for `"area"`, `"bar"`, `"tick"`,
   * `"text"`, `"circle"`, and `"square"` / stroke color for `"line"` and `"point"`.
   *
   * __Default value:__ If undefined, the default color depends on [mark config](config.html#mark)'s `color` property.
   *
   * _Note:_ See the scale documentation for more information about customizing [color scheme](scale.html#scheme).
   */
  color?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;

  /**
   * Opacity of the marks – either can be a value or a range.
   *
   * __Default value:__ If undefined, the default opacity depends on [mark config](config.html#mark)'s `opacity` property.
   */
  opacity?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;

  /**
   * Size of the mark.
   * - For `"point"`, `"square"` and `"circle"`, – the symbol size, or pixel area of the mark.
   * - For `"bar"` and `"tick"` – the bar and tick's size.
   * - For `"text"` – the text's font size.
   * - Size is currently unsupported for `"line"`, `"area"`, and `"rect"`.
   */
  size?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>;

  /**
   * The symbol's shape (only for `point` marks). The supported values are
   * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
   * or `"triangle-down"`, or else a custom SVG path string.
   * __Default value:__ If undefined, the default shape depends on [mark config](config.html#point-config)'s `shape` property.
   */
  shape?: ConditionalFieldDef<LegendFieldDef<F>> | ConditionalValueDef<LegendFieldDef<F>>; // TODO: maybe distinguish ordinal-only

  /**
   * Additional levels of detail for grouping data in aggregate views and
   * in line and area marks without mapping data to a specific visual channel.
   */
  detail?: FieldDef<F> | FieldDef<F>[];

  /**
   * Text of the `text` mark.
   */
  text?: ConditionalFieldDef<TextFieldDef<F>> | ConditionalValueDef<TextFieldDef<F>>;

  /**
   * The tooltip text to show upon mouse hover.
   */
  tooltip?: ConditionalFieldDef<TextFieldDef<F>> | ConditionalValueDef<TextFieldDef<F>>;

  /**
   * Stack order for stacked marks or order of data points in line marks for connected scatter plots.
   *
   * __Note__: In aggregate plots, `order` field should be `aggregate`d to avoid creating additional aggregation grouping.
   */
  order?: OrderFieldDef<F> | OrderFieldDef<F>[];
}

export interface EncodingWithFacet<F> extends Encoding<F>, Facet<F> {}

export function channelHasField(encoding: EncodingWithFacet<Field>, channel: Channel): boolean {
  const channelDef = encoding && encoding[channel];
  if (channelDef) {
    if (isArray(channelDef)) {
      return some(channelDef, (fieldDef) => !!fieldDef.field);
    } else {
      return isFieldDef(channelDef) || hasConditionFieldDef(channelDef);
    }
  }
  return false;
}


export function isAggregate(encoding: EncodingWithFacet<Field>) {
  return some(CHANNELS, (channel) => {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      if (isArray(channelDef)) {
        return some(channelDef, (fieldDef) => !!fieldDef.aggregate);
      } else {
        const fieldDef = getFieldDef(channelDef);
        return fieldDef && !!fieldDef.aggregate;
      }
    }
    return false;
  });
}

export function normalizeEncoding(encoding: Encoding<string>, mark: Mark): Encoding<string> {
  return keys(encoding).reduce((normalizedEncoding: Encoding<string>, channel: Channel) => {
    if (!supportMark(channel, mark)) {
      // Drop unsupported channel

      log.warn(log.message.incompatibleChannel(channel, mark));
      return normalizedEncoding;
    }

    // Drop line's size if the field is aggregated.
    if (channel === 'size' && mark === 'line') {
      const fieldDef = getFieldDef(encoding[channel]);
      if (fieldDef && fieldDef.aggregate) {
        log.warn(log.message.incompatibleChannel(channel, mark, 'when the field is aggregated.'));
        return normalizedEncoding;
      }
    }

    if (channel === 'detail' || channel === 'order') {
      const channelDef = encoding[channel];
      if (channelDef) {
        // Array of fieldDefs for detail channel (or production rule)
        normalizedEncoding[channel] = (isArray(channelDef) ? channelDef : [channelDef])
          .reduce((fieldDefs: FieldDef<string>[], fieldDef: FieldDef<string>) => {
            if (!isFieldDef(fieldDef)) {
              log.warn(log.message.emptyFieldDef(fieldDef, channel));
            } else {
              fieldDefs.push(normalizeFieldDef(fieldDef, channel));
            }
            return fieldDefs;
          }, []);
      }
    } else {
      // FIXME: remove this casting.  (I don't know why Typescript doesn't infer this correctly here.)
      const channelDef = encoding[channel] as ChannelDef<string>;
      if (!isFieldDef(channelDef) && !isValueDef(channelDef) && !isConditionalDef(channelDef)) {
        log.warn(log.message.emptyFieldDef(channelDef, channel));
        return normalizedEncoding;
      }
      normalizedEncoding[channel] = normalize(channelDef, channel);
    }
    return normalizedEncoding;
  }, {});
}


export function isRanged(encoding: EncodingWithFacet<any>) {
  return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}

export function fieldDefs(encoding: EncodingWithFacet<Field>): FieldDef<Field>[] {
  const arr: FieldDef<Field>[] = [];
  CHANNELS.forEach(function(channel) {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      (isArray(channelDef) ? channelDef : [channelDef]).forEach((def) => {
        if (isFieldDef(def)) {
          arr.push(def);
        } else if (hasConditionFieldDef(def)) {
          arr.push(def.condition);
        }
      });
    }
  });
  return arr;
}

export function forEach(mapping: any,
    f: (fd: FieldDef<string>, c: Channel) => void,
    thisArg?: any) {
  if (!mapping) {
    return;
  }

  keys(mapping).forEach((c: any) => {
    const channel: Channel = c;
    if (isArray(mapping[channel])) {
      mapping[channel].forEach(function(channelDef: ChannelDef<string>) {
        f.call(thisArg, channelDef, channel);
      });
    } else {
      f.call(thisArg, mapping[channel], channel);
    }
  });
}

export function reduce<T, U>(mapping: U,
    f: (acc: any, fd: FieldDef<string>, c: Channel) => U,
    init: T, thisArg?: any) {
  if (!mapping) {
    return init;
  }

  return keys(mapping).reduce((r: T, c: any) => {
    const channel: Channel = c;
    if (isArray(mapping[channel])) {
      return mapping[channel].reduce(function(r1: T, channelDef: ChannelDef<string>) {
        return f.call(thisArg, r1, channelDef, channel);
      }, r);
    } else {
      return f.call(thisArg, r, mapping[channel], channel);
    }
  }, init);
}
