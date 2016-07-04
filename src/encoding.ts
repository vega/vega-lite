// utility for encoding mapping
import {FieldDef, PositionChannelDef, FacetChannelDef, ChannelDefWithLegend, OrderChannelDef} from './fielddef';
import {Channel, CHANNELS} from './channel';
import {isArray, some} from './util';

// TODO: once we decompose facet, rename this to Encoding
export interface UnitEncoding {
  /**
   * X coordinates for `point`, `circle`, `square`,
   * `line`, `rule`, `text`, and `tick`
   * (or to width and height for `bar` and `area` marks).
   */
  x?: PositionChannelDef;

  /**
   * Y coordinates for `point`, `circle`, `square`,
   * `line`, `rule`, `text`, and `tick`
   * (or to width and height for `bar` and `area` marks).
   */
  y?: PositionChannelDef;

  /**
   * X2 coordinates for ranged `bar`, `rule`, `area`
   */
  x2?: PositionChannelDef;

  /**
   * Y2 coordinates for ranged `bar`, `rule`, `area`
   */
  y2?: PositionChannelDef;

  /**
   * Color of the marks – either fill or stroke color based on mark type.
   * (By default, fill color for `area`, `bar`, `tick`, `text`, `circle`, and `square` /
   * stroke color for `line` and `point`.)
   */
  color?: ChannelDefWithLegend;
  /**
   * Opacity of the marks – either can be a value or in a range.
   */
  opacity?: ChannelDefWithLegend;

  /**
   * Size of the mark.
   * - For `point`, `square` and `circle`
   * – the symbol size, or pixel area of the mark.
   * - For `bar` and `tick` – the bar and tick's size.
   * - For `text` – the text's font size.
   * - Size is currently unsupported for `line` and `area`.
   */
  size?: ChannelDefWithLegend;

  /**
   * The symbol's shape (only for `point` marks). The supported values are
   * `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`,
   * or `"triangle-down"`.
   */
  shape?: ChannelDefWithLegend; // TODO: maybe distinguish ordinal-only

  /**
   * Additional levels of detail for grouping data in aggregate views and
   * in line and area marks without mapping data to a specific visual channel.
   */
  detail?: FieldDef | FieldDef[];

  /**
   * Text of the `text` mark.
   */
  text?: FieldDef;

  label?: FieldDef;

  /**
   * Order of data points in line marks.
   */
  path?: OrderChannelDef | OrderChannelDef[];

  /**
   * Layer order for non-stacked marks, or stack order for stacked marks.
   */
  order?: OrderChannelDef | OrderChannelDef[];
}

// TODO: once we decompose facet, rename this to ExtendedEncoding
export interface Encoding extends UnitEncoding {
  /**
   * Vertical facets for trellis plots.
   */
  row?: FacetChannelDef;

  /**
   * Horizontal facets for trellis plots.
   */
  column?: FacetChannelDef;
}

export function countRetinal(encoding: Encoding) {
  let count = 0;
  if (encoding.color) { count++; }
  if (encoding.opacity) { count++; }
  if (encoding.size) { count++; }
  if (encoding.shape) { count++; }
  return count;
}

export function channels(encoding: Encoding) {
  return CHANNELS.filter(function(channel) {
    return has(encoding, channel);
  });
}

// TOD: rename this to hasChannelField and only use we really want it.
export function has(encoding: Encoding, channel: Channel): boolean {
  const channelEncoding = encoding && encoding[channel];
  return channelEncoding && (
    channelEncoding.field !== undefined ||
    // TODO: check that we have field in the array
    (isArray(channelEncoding) && channelEncoding.length > 0)
  );
}

export function isAggregate(encoding: Encoding) {
  return some(CHANNELS, (channel) => {
    if (has(encoding, channel) && encoding[channel].aggregate) {
      return true;
    }
    return false;
  });
}

export function isRanged(encoding: Encoding) {
  return encoding && ((!!encoding.x && !!encoding.x2) || (!!encoding.y && !!encoding.y2));
}

export function fieldDefs(encoding: Encoding): FieldDef[] {
  let arr = [];
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      if (isArray(encoding[channel])) {
        encoding[channel].forEach(function(fieldDef) {
          arr.push(fieldDef);
        });
      } else {
        arr.push(encoding[channel]);
      }
    }
  });
  return arr;
};

export function forEach(encoding: Encoding,
    f: (fd: FieldDef, c: Channel, i: number) => void,
    thisArg?: any) {
  channelMappingForEach(CHANNELS, encoding, f, thisArg);
}

export function channelMappingForEach(channels: Channel[], mapping: any,
    f: (fd: FieldDef, c: Channel, i: number) => void,
    thisArg?: any) {
  let i = 0;
  channels.forEach(function(channel) {
    if (has(mapping, channel)) {
      if (isArray(mapping[channel])) {
        mapping[channel].forEach(function(fieldDef) {
            f.call(thisArg, fieldDef, channel, i++);
        });
      } else {
        f.call(thisArg, mapping[channel], channel, i++);
      }
    }
  });
}

export function map(encoding: Encoding,
    f: (fd: FieldDef, c: Channel, i: number) => any,
    thisArg?: any) {
  return channelMappingMap(CHANNELS, encoding, f , thisArg);
}

export function channelMappingMap(channels: Channel[], mapping: any,
    f: (fd: FieldDef, c: Channel, i: number) => any,
    thisArg?: any) {
  let arr = [];
  channels.forEach(function(channel) {
    if (has(mapping, channel)) {
      if (isArray(mapping[channel])) {
        mapping[channel].forEach(function(fieldDef) {
          arr.push(f.call(thisArg, fieldDef, channel));
        });
      } else {
        arr.push(f.call(thisArg, mapping[channel], channel));
      }
    }
  });
  return arr;
}
export function reduce(encoding: Encoding,
    f: (acc: any, fd: FieldDef, c: Channel) => any,
    init,
    thisArg?: any) {
  return channelMappingReduce(CHANNELS, encoding, f, init, thisArg);
}

export function channelMappingReduce(channels: Channel[], mapping: any,
    f: (acc: any, fd: FieldDef, c: Channel) => any,
    init,
    thisArg?: any) {
  let r = init;
  CHANNELS.forEach(function(channel) {
    if (has(mapping, channel)) {
      if (isArray(mapping[channel])) {
        mapping[channel].forEach(function(fieldDef) {
            r = f.call(thisArg, r, fieldDef, channel);
        });
      } else {
        r = f.call(thisArg, r, mapping[channel], channel);
      }
    }
  });
  return r;
}
