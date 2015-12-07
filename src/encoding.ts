// utility for encoding mapping
import {Encoding} from './schema/encoding.schema';
import {FieldDef} from './schema/fielddef.schema';
import {Channel, CHANNELS} from './channel';

export function countRetinal(encoding: Encoding) {
  var count = 0;
  if (encoding.color) { count++; }
  if (encoding.size) { count++; }
  if (encoding.shape) { count++; }
  return count;
}

export function has(encoding: Encoding, channel: Channel) {
  var fieldDef: FieldDef = encoding && encoding[channel];
  return fieldDef && fieldDef.field;
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
  CHANNELS.forEach(function(k) {
    if (has(encoding, k)) {
      arr.push(encoding[k]);
    }
  });
  return arr;
};

export function forEach(encoding: Encoding,
  f: (fd: FieldDef, c: Channel, i: number) => void) {
  var i = 0;
  CHANNELS.forEach(function(channel) {
    if (has(encoding, channel)) {
      f(encoding[channel], channel, i++);
    }
  });
}

export function map(encoding: Encoding,
  f: (fd: FieldDef, c: Channel, e: Encoding) => any) {
  var arr = [];
  CHANNELS.forEach(function(k) {
    if (has(encoding, k)) {
      arr.push(f(encoding[k], k, encoding));
    }
  });
  return arr;
}

export function reduce(encoding: Encoding,
  f: (acc: any, fd: FieldDef, c: Channel, e: Encoding) => any,
  init) {
  var r = init;
  CHANNELS.forEach(function(k) {
    if (has(encoding, k)) {
      r = f(r, encoding[k], k, encoding);
    }
  });
  return r;
}
