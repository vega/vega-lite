// utility for encoding mapping
import {FieldDef, PositionChannelDef, FacetChannelDef, ChannelDefWithLegend, OrderChannelDef} from './fielddef';
import {Channel, CHANNELS} from './channel';
import {isArray, any as anyIn} from './util';

// TODO: once we decompose facet, rename this to Encoding
export interface UnitEncoding {
  x?: PositionChannelDef;
  y?: PositionChannelDef;
  color?: ChannelDefWithLegend;
  size?: ChannelDefWithLegend;
  shape?: ChannelDefWithLegend; // TODO: maybe distinguish ordinal-only
  detail?: FieldDef | FieldDef[];
  text?: FieldDef;
  label?: FieldDef;

  path?: OrderChannelDef | OrderChannelDef[];
  order?: OrderChannelDef | OrderChannelDef[];
}

// TODO: once we decompose facet, rename this to ExtendedEncoding
export interface Encoding extends UnitEncoding {
  row?: FacetChannelDef;
  column?: FacetChannelDef;
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
    f: (fd: FieldDef, c: Channel, i: number) => void,
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
