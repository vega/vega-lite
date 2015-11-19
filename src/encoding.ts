// utility for encoding mapping

import {CHANNELS} from './channel';
import * as vlFieldDef from './fielddef';
import * as util from './util';

let channels = CHANNELS;

export function countRetinal(encoding) {
  var count = 0;
  if (encoding.color) count++;
  if (encoding.size) count++;
  if (encoding.shape) count++;
  return count;
}

export function has(encoding, channel) {
  var fieldDef = encoding && encoding[channel];
  return fieldDef && fieldDef.name;
}

export function isAggregate(encoding) {
  for (var k in encoding) {
    if (has(encoding, k) && encoding[k].aggregate) {
      return true;
    }
  }
  return false;
}

export function forEach(encoding, f) {
  var i = 0;
  channels.forEach(function(channel) {
    if (has(encoding, channel)) {
      f(encoding[channel], channel, i++);
    }
  });
}

export function map(encoding, f) {
  var arr = [];
  channels.forEach(function(k) {
    if (has(encoding, k)) {
      arr.push(f(encoding[k], k, encoding));
    }
  });
  return arr;
}

export function reduce(encoding, f, init) {
  var r = init;
  channels.forEach(function(k) {
    if (has(encoding, k)) {
      r = f(r, encoding[k], k,  encoding);
    }
  });
  return r;
}

/**
 * return key-value pairs of field name and list of fields of that field name
 */
export function fields(encoding) {
  return reduce(encoding, function (m, fieldDef) {
    var fieldList = m[fieldDef.name] = m[fieldDef.name] || [];
    var containsType = fieldList.containsType = fieldList.containsType || {};

    if (fieldList.indexOf(fieldDef) === -1) {
      fieldList.push(fieldDef);
      // augment the array with containsType.Q / O / N / T
      containsType[fieldDef.type] = true;
    }
    return m;
  }, {});
}
