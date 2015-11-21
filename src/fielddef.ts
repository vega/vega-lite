// utility for a field definition object

import {FieldDef} from './schema/fielddef.schema';
import {Bin} from './schema/bin.schema';

import {MAXBINS_DEFAULT} from './bin';
import {AGGREGATE_OPS} from './aggregate';
import * as util from './util';
import * as time from './compiler/time';
import {TIMEUNITS} from './timeunit';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL, SHORT_TYPE, TYPE_FROM_SHORT_TYPE} from './type';

export interface FieldRefOption {
  nofn?: boolean;
  noAggregate?: boolean;
  datum?: boolean;
  fn?: string;
  prefn?: string;
  binSuffix?: string;
}

/**
 * @param field
 * @param opt
 *   opt.nofn -- exclude bin, aggregate, timeUnit
 *   opt.noAggregate -- exclude aggregation function
 *   opt.datum - include 'datum.'
 *   opt.fn - replace fn with custom function prefix
 *   opt.prefn - prepend fn with custom function prefix
 *   opt.binSuffix - append suffix to the field ref for bin (default='_start')

 * @return {[type]}       [description]
 */
export function fieldRef(fieldDef: FieldDef, opt?: FieldRefOption) {
  opt = opt || {};

  var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''),
    name = fieldDef.name;

  if (isCount(fieldDef)) {
    return f + 'count';
  } else if (opt.fn) {
    return f + opt.fn + '_' + name;
  } else if (!opt.nofn && fieldDef.bin) {
    var binSuffix = opt.binSuffix || '_start';
    return f + 'bin_' + name + binSuffix;
  } else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
    return f + fieldDef.aggregate + '_' + name;
  } else if (!opt.nofn && fieldDef.timeUnit) {
    return f + fieldDef.timeUnit + '_' + name;
  }  else {
    return f + name;
  }
}

export function isTypes(fieldDef: FieldDef, types: Array<String>) {
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
export function isOrdinalScale(fieldDef: FieldDef) {
  return  isTypes(fieldDef, [NOMINAL, ORDINAL]) ||
    (fieldDef.type === TEMPORAL && fieldDef.timeUnit && time.isOrdinalFn(fieldDef.timeUnit) );
}


// TODO remove these "isDimension/isMeasure" stuff
function _isFieldDimension(fieldDef: FieldDef) {
  return  isTypes(fieldDef, [NOMINAL, ORDINAL]) || !!fieldDef.bin ||
    (fieldDef.type === TEMPORAL && !!fieldDef.timeUnit );
}

export function isDimension(fieldDef: FieldDef) {
  return fieldDef && _isFieldDimension(fieldDef);
}

export function isMeasure(fieldDef: FieldDef) {
  return fieldDef && !_isFieldDimension(fieldDef);
}

export function count() {
  return {name:'*', aggregate: 'count', type: QUANTITATIVE, displayName: COUNT_DISPLAYNAME};
}

export const COUNT_DISPLAYNAME = 'Number of Records';

export function isCount(fieldDef: FieldDef) {
  return fieldDef.aggregate === 'count';
}

export function cardinality(fieldDef: FieldDef, stats, filterNull = {}) {
  // FIXME need to take filter into account

  var stat = stats[fieldDef.name];
  var type = fieldDef.type;

  if (fieldDef.bin) {
    // need to reassign bin, otherwise compilation will fail due to a TS bug.
    const bin = fieldDef.bin;
    const maxbins = (typeof bin === 'boolean') ? MAXBINS_DEFAULT : bin.maxbins;

    var bins = util.getbins(stat, maxbins);
    return (bins.stop - bins.start) / bins.step;
  }
  if (fieldDef.type === TEMPORAL) {
    var cardinality = time.cardinality(fieldDef, stats, filterNull, type);
    if(cardinality !== null) return cardinality;
    //otherwise use calculation below
  }
  if (fieldDef.aggregate) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.missing > 0 && filterNull[type] ? 1 : 0);
}
