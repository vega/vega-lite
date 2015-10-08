'use strict';

require('../globals');

module.exports = stacking;

function stacking(encoding, mdef, stack) {
  var dim = stack.dimension;
  var val = stack.value;

  var valName = encoding.fieldRef(val);
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
