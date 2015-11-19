/** module for shorthand */

import {AGGREGATE_OPS} from './aggregate';
import {TIMEUNITS} from './timeunit';
import {SHORT_TYPE, TYPE_FROM_SHORT_TYPE} from './type';
import * as util from './util';

export const DELIM = '|';
export const ASSIGN = '=';
export const TYPE = ',';
export const FUNC = '_';


export function shorten(spec): string {
  return 'mark' + ASSIGN + spec.marktype +
    DELIM + shortenEncoding(spec.encoding);
}

export function parse(shorthand: string, data?, config?) {
  let split = shorthand.split(DELIM),
    marktype = split.shift().split(ASSIGN)[1].trim(),
    encoding = parseEncoding(split.join(DELIM));

  let spec:any = {
    marktype: marktype,
    encoding: encoding
  };

  if (data !== undefined) {
    spec.data = data;
  }
  if (config !== undefined) {
    spec.config = config;
  }
  return spec;
}


export function shortenEncoding(encoding): string {
  return util.map(encoding, function(fieldDef, channel) {
    return channel + ASSIGN + shortenFieldDef(fieldDef);
  }).join(DELIM);
}

export function parseEncoding(encodingShorthand: string) {
  return encodingShorthand.split(DELIM).reduce(function(m, e) {
    var split = e.split(ASSIGN),
        enctype = split[0].trim(),
        fieldDefShorthand = split[1];

    m[enctype] = parseFieldDef(fieldDefShorthand);
    return m;
  }, {});
}

export function shortenFieldDef(fieldDef) {
  return (fieldDef.aggregate ? fieldDef.aggregate + FUNC : '') +
    (fieldDef.timeUnit ? fieldDef.timeUnit + FUNC : '') +
    (fieldDef.bin ? 'bin' + FUNC : '') +
    (fieldDef.name || '') + TYPE + SHORT_TYPE[fieldDef.type];
}

export function parseFieldDefs(fieldDefs, delim = DELIM) {
  return fieldDefs.map(parseFieldDef).join(delim);
}

export function parseFieldDef(fieldDefShorthand: string) {
  var split = fieldDefShorthand.split(TYPE), i;

  var fieldDef: any = {
    name: split[0].trim(),
    type: TYPE_FROM_SHORT_TYPE[split[1].trim()]
  };

  // check aggregate type
  for (i in AGGREGATE_OPS) {
    var a = AGGREGATE_OPS[i];
    if (fieldDef.name.indexOf(a + '_') === 0) {
      fieldDef.name = fieldDef.name.substr(a.length + 1);
      if (a === 'count' && fieldDef.name.length === 0) fieldDef.name = '*';
      fieldDef.aggregate = a;
      break;
    }
  }

  for (i in TIMEUNITS) {
    var tu = TIMEUNITS[i];
    if (fieldDef.name && fieldDef.name.indexOf(tu + '_') === 0) {
      fieldDef.name = fieldDef.name.substr(fieldDef.name.length + 1);
      fieldDef.timeUnit = tu;
      break;
    }
  }

  // check bin
  if (fieldDef.name && fieldDef.name.indexOf('bin_') === 0) {
    fieldDef.name = fieldDef.name.substr(4);
    fieldDef.bin = true;
  }

  return fieldDef;
}
