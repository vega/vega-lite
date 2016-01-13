// utility for encoding mapping
import {Encoding} from './schema/encoding.schema';
import {FieldDef} from './schema/fielddef.schema';
import {Channel, CHANNELS} from './channel';
import {isArray} from './util';

export function countRetinal(encoding: Encoding) {
  var count = 0;
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
  for (var k in encoding) {
    if (has(encoding, k) && encoding[k].aggregate) {
      return true;
    }
  }
  return false;
}

export function fieldDefs(encoding: Encoding): FieldDef[] {
  var arr = [];
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
  var i = 0;
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
  var arr = [];
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
  var r = init;
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
