// utility for Encoding Definition

import {TIMEUNITS, Type, Shorthand, AGGREGATE_OPS, MAXBINS_DEFAULT} from './consts';
import * as util from './util';
import * as time from './compiler/time';

/**
 * @param field
 * @param opt
 *   opt.nofn -- exclude bin, aggregate, timeUnit
 *   opt.noAggregate -- exclude aggregation function
 *   opt.datum - include 'datum.'
 *   opt.fn - replace fn with custom function prefix
 *   opt.prefn - prepend fn with custom function prefix
 *   opt.bin_suffix - append suffix to the field ref for bin (default='_start')

 * @return {[type]}       [description]
 */
export function fieldRef(fieldDef, opt) {
  opt = opt || {};

  var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''),
    name = fieldDef.name;

  if (isCount(fieldDef)) {
    return f + 'count';
  } else if (opt.fn) {
    return f + opt.fn + '_' + name;
  } else if (!opt.nofn && fieldDef.bin) {
    var bin_suffix = opt.bin_suffix || '_start';
    return f + 'bin_' + name + bin_suffix;
  } else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
    return f + fieldDef.aggregate + '_' + name;
  } else if (!opt.nofn && fieldDef.timeUnit) {
    return f + fieldDef.timeUnit + '_' + name;
  }  else {
    return f + name;
  }
}

export function shorthand(f) {
  return (f.aggregate ? f.aggregate + Shorthand.Func : '') +
    (f.timeUnit ? f.timeUnit + Shorthand.Func : '') +
    (f.bin ? 'bin' + Shorthand.Func : '') +
    (f.name || '') + Shorthand.Type + Type.ShortType[f.type];
}

export function shorthands(fieldDefs, delim) {
  delim = delim || Shorthand.Delim;
  return fieldDefs.map(shorthand).join(delim);
}

export function fromShorthand(shorthand: string) {
  var split = shorthand.split(Shorthand.Type), i;

  var fieldDef: any = {
    name: split[0].trim(),
    type: Type.TypeFromShortType[split[1].trim()]
  };

  // check aggregate type
  for (i in AGGREGATE_OPS) {
    var a = AGGREGATE_OPS[i];
    if (fieldDef.name.indexOf(a + '_') === 0) {
      fieldDef.name = fieldDef.name.substr(a.length + 1);
      if (a == 'count' && fieldDef.name.length === 0) fieldDef.name = '*';
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

export function isTypes(fieldDef, types: Array<String>) {
  for (var t = 0; t < types.length; t++) {
    if (fieldDef.type === types[t]) {
      return true;
    }
  }
  return false;
}

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
export function isOrdinalScale(fieldDef) {
  return  isTypes(fieldDef, [Type.Nominal, Type.Ordinal]) ||
    (fieldDef.type === Type.Temporal && fieldDef.timeUnit && time.isOrdinalFn(fieldDef.timeUnit) );
}

function _isFieldDimension(fieldDef) {
  return  isTypes(fieldDef, [Type.Nominal, Type.Ordinal]) || !!fieldDef.bin ||
    (fieldDef.type === Type.Temporal && !!fieldDef.timeUnit );
}

export function isDimension(fieldDef) {
  return fieldDef && _isFieldDimension(fieldDef);
}

export function isMeasure(fieldDef) {
  return fieldDef && !_isFieldDimension(fieldDef);
}

export function count() {
  return {name:'*', aggregate: 'count', type: Type.Quantitative, displayName: COUNT_DISPLAYNAME};
}

export const COUNT_DISPLAYNAME = 'Number of Records';

export function isCount(field) {
  return field.aggregate === 'count';
}

export function cardinality(field, stats, filterNull = {}) {
  // FIXME need to take filter into account

  var stat = stats[field.name];
  var type = field.type;

  if (field.bin) {
    var bins = util.getbins(stat, field.bin.maxbins || MAXBINS_DEFAULT);
    return (bins.stop - bins.start) / bins.step;
  }
  if (field.type === Type.Temporal) {
    var cardinality = time.cardinality(field, stats, filterNull, type);
    if(cardinality !== null) return cardinality;
    //otherwise use calculation below
  }
  if (field.aggregate) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.missing > 0 && filterNull[type] ? 1 : 0);
}
