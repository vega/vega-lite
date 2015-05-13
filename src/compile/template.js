'use strict';

require('../globals');

var groupdef = require('./group').def,
  vlfield = require('../field');

module.exports = template;

function template(encoding, layout, stats) {
  // jshint unused:false

  var data = {name: RAW, format: {}},
    table = {name: TABLE, source: RAW},
    dataUrl = encoding.data('url'),
    dataType = encoding.data('formatType'),
    values = encoding.data('values');

  if (encoding.hasValues()) {
    data.values = values;
  } else {
    data.url = dataUrl;
    data.format.type = dataType;
  }

  encoding.forEach(function(field, encType) {
    var name;
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (vlfield.isCount(field)) {
        name = 'count';
      } else {
        name = field.name;
      }
      data.format.parse[name] = 'number';
    }
  });

  return {
    width: layout.width,
    height: layout.height,
    padding: 'auto',
    data: [data, table],
    marks: [groupdef('cell', {
      width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
      height: layout.cellHeight ? {value: layout.cellHeight} : undefined
    })]
  };
}
