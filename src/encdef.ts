// utility for field

import {TimeUnits, Type, Shorthand, ValidAggregateOps, MAXBINS_DEFAULT} from './consts';
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
export function fieldRef(field, opt) {
  opt = opt || {};

  var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''),
    name = field.name;

  if (isCount(field)) {
    return f + 'count';
  } else if (opt.fn) {
    return f + opt.fn + '_' + name;
  } else if (!opt.nofn && field.bin) {
    var bin_suffix = opt.bin_suffix || '_start';
    return f + 'bin_' + name + bin_suffix;
  } else if (!opt.nofn && !opt.noAggregate && field.aggregate) {
    return f + field.aggregate + '_' + name;
  } else if (!opt.nofn && field.timeUnit) {
    return f + field.timeUnit + '_' + name;
  }  else {
    return f + name;
  }
}

export function shorthand(f) {
  return (f.aggregate ? f.aggregate + Shorthand.Func : '') +
    (f.timeUnit ? f.timeUnit + Shorthand.Func : '') +
    (f.bin ? 'bin' + Shorthand.Func : '') +
    (f.name || '') + Shorthand.Type + f.type;
}

export function shorthands(fields, delim) {
  delim = delim || Shorthand.Delim;
  return fields.map(shorthand).join(delim);
}

export function fromShorthand(shorthand: string) {
  var split = shorthand.split(Shorthand.Type), i;

  var o: any = {
    name: split[0].trim(),
    type: split[1].trim()
  };

  // check aggregate type
  for (i in ValidAggregateOps) {
    var a = ValidAggregateOps[i];
    if (o.name.indexOf(a + '_') === 0) {
      o.name = o.name.substr(a.length + 1);
      if (a == 'count' && o.name.length === 0) o.name = '*';
      o.aggregate = a;
      break;
    }
  }

  for (i in TimeUnits) {
    var tu = TimeUnits[i];
    if (o.name && o.name.indexOf(tu + '_') === 0) {
      o.name = o.name.substr(o.name.length + 1);
      o.timeUnit = tu;
      break;
    }
  }

  // check bin
  if (o.name && o.name.indexOf('bin_') === 0) {
    o.name = o.name.substr(4);
    o.bin = true;
  }

  return o;
}

export function isType(fieldDef, type: Type) {
  var t: string = fieldDef.type;
  return Type[t] === type;
}

export function isTypes(fieldDef, types: Array<Type>) {
  for (var t=0; t<types.length; t++) {
    if(isType(fieldDef, types[t])) return true;
  }
  return false;
}

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
export function isOrdinalScale(field) {
  return  isTypes(field, [Type.N, Type.O]) ||
    ( isType(field, Type.T) && field.timeUnit && time.isOrdinalFn(field.timeUnit) );
}

function isFieldDimension(field) {
  return  isTypes(field, [Type.N, Type.O]) || !!field.bin ||
    ( isType(field, Type.T) && !!field.timeUnit );
}

/**
 * For encoding, use encoding.isDimension() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
export function isDimension(field) {
  return field && isFieldDimension(field);
}

export function isMeasure(field) {
  return field && !isFieldDimension(field);
}

export function count() {
  return {name:'*', aggregate: 'count', type: Type.Q, displayName: COUNT_DISPLAYNAME};
}

export const COUNT_DISPLAYNAME = 'Number of Records';

export function isCount(field) {
  return field.aggregate === 'count';
}

/**
 * For encoding, use encoding.cardinality() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
export function cardinality(field, stats, filterNull = {}) {
  // FIXME need to take filter into account

  var stat = stats[field.name];
  var type = field.type;

  if (field.bin) {
    var bins = util.getbins(stat, field.bin.maxbins || MAXBINS_DEFAULT);
    return (bins.stop - bins.start) / bins.step;
  }
  if (isType(field, Type.T)) {
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
