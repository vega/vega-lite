'use strict';

require('../globals');

module.exports = subfaceting;

function subfaceting(group, mdef, details, encoding) {
  var m = group.marks;
  var g = {
    name: 'subfacet',
    type: 'group',
    from: mdef.from,
    properties: {
      enter: {
        width: {field: {group: 'width'}},
        height: {field: {group: 'height'}}
      }
    },
    marks: m
  };

  group.marks = [g];
  delete mdef.from; // (move to the new g)

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.push({type: 'facet', groupby: details});
}
