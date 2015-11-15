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
export function fieldRef(encDef, opt) {
  opt = opt || {};

  var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''),
    name = encDef.name;

  if (isCount(encDef)) {
    return f + 'count';
  } else if (opt.fn) {
    return f + opt.fn + '_' + name;
  } else if (!opt.nofn && encDef.bin) {
    var bin_suffix = opt.bin_suffix || '_start';
    return f + 'bin_' + name + bin_suffix;
  } else if (!opt.nofn && !opt.noAggregate && encDef.aggregate) {
    return f + encDef.aggregate + '_' + name;
  } else if (!opt.nofn && encDef.timeUnit) {
    return f + encDef.timeUnit + '_' + name;
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

export function shorthands(encDefs, delim) {
  delim = delim || Shorthand.Delim;
  return encDefs.map(shorthand).join(delim);
}

export function fromShorthand(shorthand: string) {
  var split = shorthand.split(Shorthand.Type), i;

  var encDef: any = {
    name: split[0].trim(),
    type: split[1].trim()
  };

  // check aggregate type
  for (i in AGGREGATE_OPS) {
    var a = AGGREGATE_OPS[i];
    if (encDef.name.indexOf(a + '_') === 0) {
      encDef.name = encDef.name.substr(a.length + 1);
      if (a == 'count' && encDef.name.length === 0) encDef.name = '*';
      encDef.aggregate = a;
      break;
    }
  }

  for (i in TIMEUNITS) {
    var tu = TIMEUNITS[i];
    if (encDef.name && encDef.name.indexOf(tu + '_') === 0) {
      encDef.name = encDef.name.substr(encDef.name.length + 1);
      encDef.timeUnit = tu;
      break;
    }
  }

  // check bin
  if (encDef.name && encDef.name.indexOf('bin_') === 0) {
    encDef.name = encDef.name.substr(4);
    encDef.bin = true;
  }

  return encDef;
}

export function isTypes(encDef, types: Array<String>) {
  for (var t = 0; t < types.length; t++) {
    if (encDef.type === t) {
      return true;
    }
  }
  return false;
}

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
export function isOrdinalScale(encDef) {
  return  isTypes(encDef, [Type.N, Type.O]) ||
    (encDef.type === Type.T && encDef.timeUnit && time.isOrdinalFn(encDef.timeUnit) );
}

function _isFieldDimension(encDef) {
  return  isTypes(encDef, [Type.N, Type.O]) || !!encDef.bin ||
    (encDef.type === Type.T && !!encDef.timeUnit );
}

/**
 * For encoding, use encoding.isDimension() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
export function isDimension(encDef) {
  return encDef && _isFieldDimension(encDef);
}

export function isMeasure(encDef) {
  return encDef && !_isFieldDimension(encDef);
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
  if (field.type === Type.T) {
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
