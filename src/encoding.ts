// utility for encoding mapping
import {FieldDef, PositionFieldDef, LegendFieldDef, OrderFieldDef, ValueDef,TextFieldDef, isFieldDef} from './fielddef';
import {Channel, CHANNELS} from './channel';
import {Facet} from './facet';
import {isArray, some} from './util';

export interface Encoding {
  /**
   * X coordinates for `point`, `circle`, `square`,
   * `line`, `rule`, `text`, and `tick`
   * (or to width and height for `bar` and `area` marks).
   */
  x?: PositionFieldDef | ValueDef<number>;

  /**
   * Y coordinates for `point`, `circle`, `square`,
   * `line`, `rule`, `text`, and `tick`
   * (or to width and height for `bar` and `area` marks).
   */
  y?: PositionFieldDef | ValueDef<number>;

  /**
   * X2 coordinates for ranged `bar`, `rule`, `area`
   */
  x2?: FieldDef | ValueDef<number>;

  /**
   * Y2 coordinates for ranged `bar`, `rule`, `area`
   */
  y2?: FieldDef | ValueDef<number>;

  /**
   * Color of the marks – either fill or stroke color based on mark type.
   * (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /
   * stroke color for `line` and `point`.)
   */
  color?: LegendFieldDef | ValueDef<string>;

  /**
   * Opacity of the marks – either can be a value or in a range.
   */
  opacity?: LegendFieldDef | ValueDef<number>;

  /**
   * Size of the mark.
   * - For `point`, `square` and `circle`
   * – the symbol size, or pixel area of the mark.
   * - For `bar` and `tick` – the bar and tick's size.
   * - For `text` – the text's font size.
   * - Size is currently unsupported for `line` and `area`.
   */
  size?: LegendFieldDef | ValueDef<number>;

  /**
   * The symbol's shape (only for `point` marks). The supported values are
   * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
   * or `"triangle-down"`, or else a custom SVG path string.
   */
  shape?: LegendFieldDef | ValueDef<string>; // TODO: maybe distinguish ordinal-only

  /**
   * Additional levels of detail for grouping data in aggregate views and
   * in line and area marks without mapping data to a specific visual channel.
   */
  detail?: FieldDef | FieldDef[];

  /**
   * Text of the `text` mark.
   */
  text?: TextFieldDef | ValueDef<string|number>;

  /**
   * stack order for stacked marks or order of data points in line marks.
   */
  order?: OrderFieldDef | OrderFieldDef[];
}

export interface EncodingWithFacet extends Encoding, Facet {}

export function channelHasField(encoding: EncodingWithFacet, channel: Channel): boolean {
  const channelDef = encoding && encoding[channel];
  if (channelDef) {
    if (isArray(channelDef)) {
      return some(channelDef, (fieldDef) => !!fieldDef.field);
    } else {
      return isFieldDef(channelDef);
    }
  }
  return false;
}

export function isAggregate(encoding: EncodingWithFacet) {
  return some(CHANNELS, (channel) => {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      if (isArray(channelDef)) {
        return some(channelDef, (fieldDef) => !!fieldDef.aggregate);
      } else {
        return isFieldDef(channelDef) && !!channelDef.aggregate;
      }
    }
    return false;
  });
}

export function isRanged(encoding: EncodingWithFacet) {
  return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}

export function fieldDefs(encoding: EncodingWithFacet): FieldDef[] {
  let arr: FieldDef[] = [];
  CHANNELS.forEach(function(channel) {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      (isArray(channelDef) ? channelDef : [channelDef]).forEach((fieldDef) => {
        arr.push(fieldDef);
      });
    }
  });
  return arr;
};

export function forEach(mapping: any,
    f: (fd: FieldDef, c: Channel) => void,
    thisArg?: any) {
  if (!mapping) {
    return;
  }

  Object.keys(mapping).forEach((c: any) => {
    const channel: Channel = c;
    if (isArray(mapping[channel])) {
      mapping[channel].forEach(function(fieldDef: FieldDef) {
        f.call(thisArg, fieldDef, channel);
      });
    } else {
      f.call(thisArg, mapping[channel], channel);
    }
  });
}

export function reduce<T, U>(mapping: U,
    f: (acc: any, fd: FieldDef, c: Channel) => U,
    init: T, thisArg?: any) {
  if (!mapping) {
    return init;
  }

  return Object.keys(mapping).reduce((r: T, c: any) => {
    const channel: Channel = c;
    if (isArray(mapping[channel])) {
      return mapping[channel].reduce(function(r1: T, fieldDef: FieldDef) {
        return f.call(thisArg, r1, fieldDef, channel);
      }, r);
    } else {
      return f.call(thisArg, r, mapping[channel], channel);
    }
  }, init);
}
