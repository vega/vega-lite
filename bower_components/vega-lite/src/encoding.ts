// utility for encoding mapping
import {FieldDef, PositionChannelDef, FacetChannelDef, ChannelDefWithLegend, OrderChannelDef} from './fielddef';
import {Channel, CHANNELS} from './channel';
import {isArray, any as anyIn} from './util';

export interface Encoding {
  x?: PositionChannelDef;
  y?: PositionChannelDef;
  row?: FacetChannelDef;
  column?: FacetChannelDef;
  color?: ChannelDefWithLegend;
  size?: ChannelDefWithLegend;
  shape?: ChannelDefWithLegend; // TODO: maybe distinguish ordinal-only
  detail?: FieldDef | FieldDef[];
  text?: FieldDef;
  label?: FieldDef;

  path?: OrderChannelDef | OrderChannelDef[];
  order?: OrderChannelDef | OrderChannelDef[];
}


export function countRetinal(encoding: Encoding) {
  let count = 0;
  if (encoding.color) { count++; }
  if (encoding.size) { count++; }
  if (encoding.shape) { count++; }
  return count;
}

export function channels(encoding: Encoding) {
  return CHANNELS.filter(function(channel) {
    return has(encoding, channel);
  });
}

export function has(encoding: Encoding, channel: Channel): boolean {
  const channelEncoding = encoding && encoding[channel];
  return channelEncoding && (
    channelEncoding.field !== undefined ||
    (isArray(channelEncoding) && channelEncoding.length > 0)
  );
}

export function isAggregate(encoding: Encoding) {
  return anyIn(CHANNELS, (channel) => {
    if (has(encoding, channel) && encoding[channel].aggregate) {
      return true;
    }
    return false;
  });
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
  let i = 0;
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      if (isArray(encoding[channel])) {
        encoding[channel].forEach(function(fieldDef) {
            f.call(thisArg, fieldDef, channel, i++);
        });
      } else {
        f.call(thisArg, encoding[channel], channel, i++);
      }
    }
  });
}

export function map(encoding: Encoding,
    f: (fd: FieldDef, c: Channel, e: Encoding) => any,
    thisArg?: any) {
  let arr = [];
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      if (isArray(encoding[channel])) {
        encoding[channel].forEach(function(fieldDef) {
          arr.push(f.call(thisArg, fieldDef, channel, encoding));
        });
      } else {
        arr.push(f.call(thisArg, encoding[channel], channel, encoding));
      }
    }
  });
  return arr;
}

export function reduce(encoding: Encoding,
    f: (acc: any, fd: FieldDef, c: Channel, e: Encoding) => any,
    init,
    thisArg?: any) {
  let r = init;
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      if (isArray(encoding[channel])) {
        encoding[channel].forEach(function(fieldDef) {
            r = f.call(thisArg, r, fieldDef, channel, encoding);
        });
      } else {
        r = f.call(thisArg, r, encoding[channel], channel, encoding);
      }
    }
  });
  return r;
}
