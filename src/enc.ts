// utility for enc

import {Enctype, Type, Shorthand} from './consts';
import * as vlEncDef from './encdef';
import * as util from './util';

let encTypes = Enctype.LIST; 

export function countRetinal(enc) {
  var count = 0;
  if (enc.color) count++;
  if (enc.size) count++;
  if (enc.shape) count++;
  return count;
}

export function has(enc, encType) {
  var fieldDef = enc && enc[encType];
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
  encTypes.forEach(function(k) {
    if (has(enc, k)) {
      f(enc[k], k, i++);
    }
  });
}

export function map(enc, f) {
  var arr = [];
  encTypes.forEach(function(k) {
    if (has(enc, k)) {
      arr.push(f(enc[k], k, enc));
    }
  });
  return arr;
}

export function reduce(enc, f, init) {
  var r = init;
  encTypes.forEach(function(k) {
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
      containsType[Type[field.type]] = true;
    }
    return m;
  }, {});
}

export function shorthand(enc) {
  return map(enc, function(field, et) {
    return et + Shorthand.Assign + vlEncDef.shorthand(field);
  }).join(Shorthand.Delim);
}

export function fromShorthand(shorthand) {
  var enc = util.isArray(shorthand) ? shorthand : shorthand.split(Shorthand.Delim);
  return enc.reduce(function(m, e) {
    var split = e.split(Shorthand.Assign),
        enctype = split[0].trim(),
        field = split[1];

    m[enctype] = vlEncDef.fromShorthand(field);
    return m;
  }, {});
}
