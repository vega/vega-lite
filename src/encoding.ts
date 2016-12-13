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
  x2?: FieldDef;

  /**
   * Y2 coordinates for ranged `bar`, `rule`, `area`
   */
  y2?: FieldDef;

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
   * or `"triangle-down"`, or else a custom SVG path string.
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
   * stack order for stacked marks or order of data points in line marks.
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
  let arr: FieldDef[] = [];
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      if (isArray(encoding[channel])) {
        encoding[channel].forEach(function(fieldDef: FieldDef) {
          arr.push(fieldDef);
        });
      } else {
        arr.push(encoding[channel]);
      }
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

export function reduce<T>(mapping: any,
    f: (acc: any, fd: FieldDef, c: Channel) => any,
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
