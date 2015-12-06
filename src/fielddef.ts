// utility for a field definition object

import {FieldDef} from './schema/fielddef.schema';
import {contains, getbins} from './util';
import * as time from './compiler/time';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from './type';


// TODO remove these "isDimension/isMeasure" stuff
function _isFieldDimension(fieldDef: FieldDef) {
  return contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin ||
    (fieldDef.type === TEMPORAL && !!fieldDef.timeUnit);
}

export function isDimension(fieldDef: FieldDef) {
  return fieldDef && _isFieldDimension(fieldDef);
}

export function isMeasure(fieldDef: FieldDef) {
  return fieldDef && !_isFieldDimension(fieldDef);
}

export const COUNT_DISPLAYNAME = 'Number of Records';

export function count(): FieldDef {
  return { field: '*', aggregate: 'count', type: QUANTITATIVE, displayName: COUNT_DISPLAYNAME };
}

export function isCount(fieldDef: FieldDef) {
  return fieldDef.aggregate === 'count';
}

// FIXME remove this, and the getbins method
// FIXME this depends on channel
export function cardinality(fieldDef: FieldDef, stats, filterNull = {}) {
  // FIXME need to take filter into account

  var stat = stats[fieldDef.field];
  var type = fieldDef.type;

  if (fieldDef.bin) {
    // need to reassign bin, otherwise compilation will fail due to a TS bug.
    const bin = fieldDef.bin;
    let maxbins = (typeof bin === 'boolean') ? undefined : bin.maxbins;
    if (maxbins === undefined) {
      maxbins = 10;
    }

    var bins = getbins(stat, maxbins);
    return (bins.stop - bins.start) / bins.step;
  }
  if (fieldDef.type === TEMPORAL) {
    var cardinality = time.cardinality(fieldDef, stats, filterNull, type);
    if (cardinality !== null) { return cardinality; }
    // otherwise use calculation below
  }
  if (fieldDef.aggregate) {
    return 1;
  }

  // remove null
  return stat.distinct -
    (stat.missing > 0 && filterNull[type] ? 1 : 0);
}
