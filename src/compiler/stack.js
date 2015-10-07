'use strict';

require('../globals');

var  marks = require('./marks');

module.exports = stacking;

function stacking(data, encoding, mdef) {
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim=null, val=null, idx =null,
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
      summarize: [{ops: ['sum'], field: encoding.fieldRef(val)}] // TODO check if field with aggregate is correct?
    }]
  };

  if (facets && facets.length > 0) {
    stacked.transform.push({ //calculate max for each facet
      type: 'aggregate',
      groupby: facets,
      summarize: [{
        ops: ['max'],
        field: encoding.fieldName(val, {fn: 'sum'})
      }]
    });
  }

  data.push(stacked);

  var valName = encoding.fieldName(val);
  var startField = valName + '_start';
  var endField = valName + '_end';

  // add stack transform to mark
  mdef.from.transform = [{
    type: 'stack',
    groupby: encoding.fieldRef(dim),
    field: encoding.fieldRef(val),
    // TODO consider adding sortby
    // FIXME: figure out why renamed output does not work
    output: {layout_start: startField, layout_end: endField}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {
    scale: val,
    // field: startField
    field: 'layout_start'
  };
  mdef.properties.update[val + '2'] = mdef.properties.enter[val + '2'] = {
    scale: val,
    // TODO: use renamed output
    // field: endField
    field: 'layout_end'
  };

  return val; //return stack encoding
}
