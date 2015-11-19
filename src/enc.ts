// utility for enc
import {CHANNELS} from './channel';
import {Shorthand} from './consts';
import * as vlFieldDef from './fielddef';
import * as util from './util';

let channels = CHANNELS;

export function countRetinal(enc) {
  var count = 0;
  if (enc.color) count++;
  if (enc.size) count++;
  if (enc.shape) count++;
  return count;
}

export function has(enc, channel) {
  var fieldDef = enc && enc[channel];
  return fieldDef && fieldDef.name;
}

export function isAggregate(enc) {
  for (var k in enc) {
    if (has(enc, k) && enc[k].aggregate) {
      return true;
    }
  }
  return false;
}

export function forEach(enc, f) {
  var i = 0;
  channels.forEach(function(channel) {
    if (has(enc, channel)) {
      f(enc[channel], channel, i++);
    }
  });
}

export function map(enc, f) {
  var arr = [];
  channels.forEach(function(k) {
    if (has(enc, k)) {
      arr.push(f(enc[k], k, enc));
    }
  });
  return arr;
}

export function reduce(enc, f, init) {
  var r = init;
  channels.forEach(function(k) {
    if (has(enc, k)) {
      r = f(r, enc[k], k,  enc);
    }
  });
  return r;
}

/**
 * return key-value pairs of field name and list of fields of that field name
 */
export function fields(enc) {
  return reduce(enc, function (m, field) {
    var fieldList = m[field.name] = m[field.name] || [];
    var containsType = fieldList.containsType = fieldList.containsType || {};

    if (fieldList.indexOf(field) === -1) {
      fieldList.push(field);
      // augment the array with containsType.Q / O / N / T
      containsType[field.type] = true;
    }
    return m;
  }, {});
}

export function shorthand(enc) {
  return map(enc, function(field, channel) {
    return channel + Shorthand.ASSIGN + vlFieldDef.shorthand(field);
  }).join(Shorthand.DELIM);
}

export function fromShorthand(shorthand) {
  var enc = util.isArray(shorthand) ? shorthand : shorthand.split(Shorthand.DELIM);
  return enc.reduce(function(m, e) {
    var split = e.split(Shorthand.ASSIGN),
        enctype = split[0].trim(),
        field = split[1];

    m[enctype] = vlFieldDef.fromShorthand(field);
    return m;
  }, {});
}
