'use strict';

require('../globals');

module.exports = stacking;

function stacking(encoding, mdef, stack) {
  var groupby = stack.groupby;
  var field = stack.value;

  var valName = encoding.fieldRef(field);
  var startField = valName + '_start';
  var endField = valName + '_end';

  // add stack transform to mark
  var transform = {
    type: 'stack',
    groupby: [encoding.fieldRef(groupby)],
    field: encoding.fieldRef(field),
    sortby: [(stack.properties.reverse ? '' : '-') + encoding.fieldRef(stack.stack)],
    output: {start: startField, end: endField}
  };

  if (stack.properties.offset) {
    transform.offset = stack.properties.offset;
  }

  mdef.from.transform = [transform];

  // TODO(#276): This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[field] = mdef.properties.enter[field] = {
    scale: field,
    field: startField
  };
  mdef.properties.update[field + '2'] = mdef.properties.enter[field + '2'] = {
    scale: field,
    field: endField
  };

  return field; //return stack encoding
}
