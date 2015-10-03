'use strict';

require('../globals');

module.exports = subfaceting;

function subfaceting(group, mdef, details, stack, encoding) {
  var m = group.marks;
  var g = {
    _name: 'subfacet',
    type: 'group',
    from: mdef.from,
    properties: {
      enter: {
        width: {group: 'width'},
        height: {group: 'height'}
      }
    },
    marks: m
  };

  group.marks = [g];
  delete mdef.from; // (move to the new g)

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: 'facet', keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: 'sort', by: encoding.fieldRef(COLOR)});
  }
}
