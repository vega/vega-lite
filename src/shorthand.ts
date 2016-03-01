/** module for shorthand */

import {Encoding} from './encoding';
import {FieldDef} from './fielddef';
import {ExtendedUnitSpec} from './spec';

import {AggregateOp, AGGREGATE_OPS} from './aggregate';
import {TIMEUNITS} from './timeunit';
import {SHORT_TYPE, TYPE_FROM_SHORT_TYPE} from './type';
import * as vlEncoding from './encoding';
import {Mark} from './mark';

export const DELIM = '|';
export const ASSIGN = '=';
export const TYPE = ',';
export const FUNC = '_';


export function shorten(spec: ExtendedUnitSpec): string {
  return 'mark' + ASSIGN + spec.mark +
    DELIM + shortenEncoding(spec.encoding);
}

export function parse(shorthand: string, data?, config?) {
  let split = shorthand.split(DELIM),
    mark = split.shift().split(ASSIGN)[1].trim(),
    encoding = parseEncoding(split.join(DELIM));

  let spec:ExtendedUnitSpec = {
    mark: Mark[mark],
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

export function shortenEncoding(encoding: Encoding): string {
  return vlEncoding.map(encoding, function(fieldDef, channel) {
    return channel + ASSIGN + shortenFieldDef(fieldDef);
  }).join(DELIM);
}

export function parseEncoding(encodingShorthand: string): Encoding {
  return encodingShorthand.split(DELIM).reduce(function(m, e) {
    const split = e.split(ASSIGN),
        enctype = split[0].trim(),
        fieldDefShorthand = split[1];

    m[enctype] = parseFieldDef(fieldDefShorthand);
    return m;
  }, {});
}

export function shortenFieldDef(fieldDef: FieldDef): string {
  return (fieldDef.aggregate ? fieldDef.aggregate + FUNC : '') +
    (fieldDef.timeUnit ? fieldDef.timeUnit + FUNC : '') +
    (fieldDef.bin ? 'bin' + FUNC : '') +
    (fieldDef.field || '') + TYPE + SHORT_TYPE[fieldDef.type];
}

export function shortenFieldDefs(fieldDefs: FieldDef[], delim = DELIM): string {
  return fieldDefs.map(shortenFieldDef).join(delim);
}

export function parseFieldDef(fieldDefShorthand: string): FieldDef {
  const split = fieldDefShorthand.split(TYPE);

  let fieldDef: FieldDef = {
    field: split[0].trim(),
    type: TYPE_FROM_SHORT_TYPE[split[1].trim()]
  };

  // check aggregate type
  for (let i = 0; i < AGGREGATE_OPS.length; i++) {
    let a = AGGREGATE_OPS[i];
    if (fieldDef.field.indexOf(a + '_') === 0) {
      fieldDef.field = fieldDef.field.substr(a.toString().length + 1);
      if (a === AggregateOp.COUNT && fieldDef.field.length === 0) {
        fieldDef.field = '*';
      }
      fieldDef.aggregate = a;
      break;
    }
  }

  for (let i = 0; i < TIMEUNITS.length; i++) {
    let tu = TIMEUNITS[i];
    if (fieldDef.field && fieldDef.field.indexOf(tu + '_') === 0) {
      fieldDef.field = fieldDef.field.substr(fieldDef.field.length + 1);
      fieldDef.timeUnit = tu;
      break;
    }
  }

  // check bin
  if (fieldDef.field && fieldDef.field.indexOf('bin_') === 0) {
    fieldDef.field = fieldDef.field.substr(4);
    fieldDef.bin = true;
  }

  return fieldDef;
}
