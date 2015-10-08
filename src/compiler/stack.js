'use strict';

require('../globals');

var  marks = require('./marks');

module.exports = stacking;

function stacking(data, encoding, mdef) {
  // check if the encoding supports stack
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim = null, val = null, idx = null,
    isXMeasure = encoding.isMeasure(X),
    isYMeasure = encoding.isMeasure(Y),
    facets = encoding.facets();

  if (isXMeasure && !isYMeasure) {
    dim = Y;
    val = X;
    idx = 0;
  } else if (isYMeasure && !isXMeasure) {
    dim = X;
    val = Y;
    idx = 1;
  } else {
    return null; // no stack encoding
  }

  // add transform to compute sums for scale
  var stacked = {
    name: STACKED,
    source: encoding.dataTable(),
    transform: [{
      type: 'aggregate',
      groupby: [encoding.fieldRef(dim)].concat(facets), // dim and other facets
      summarize: [{ops: ['sum'], field: encoding.fieldRef(val)}]
    }]
  };

  if (facets && facets.length > 0) {
    stacked.transform.push({ //calculate max for each facet
      type: 'aggregate',
      groupby: facets,
      summarize: [{
        ops: ['max'],
        // we want max of sum from above transform
        field: encoding.fieldRef(val, {prefn: 'sum_'})
      }]
    });
  }

  data.push(stacked);

  var valName = encoding.encDef(val).name;
  var startField = valName + '_start';
  var endField = valName + '_end';

  // add stack transform to mark
  mdef.from.transform = [{
    type: 'stack',
    groupby: encoding.fieldRef(dim),
    field: encoding.fieldRef(val),
    // TODO(#39) add sort by
    output: {start: startField, end: endField}
  }];

  // TODO(#276): This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {
    scale: val,
    field: startField
  };
  mdef.properties.update[val + '2'] = mdef.properties.enter[val + '2'] = {
    scale: val,
    field: endField
  };

  return val; //return stack encoding
}
