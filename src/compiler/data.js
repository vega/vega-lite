'use strict';

require('../globals');

module.exports = data;

var vlfield = require('../field');

function data(encoding) {
  var def = [data.raw(encoding)];

  // TODO(kanitw): Aug 8, 2015 - if aggregate add TABLE
  def.push(data.aggregated(encoding));
  // TODO(kanitw): Aug 8, 2015 - for each et, if sorted add sorted-et
  return def;
}

// FIXME test
data.raw = function(encoding) {
  var raw = {name: RAW},
    values = encoding.data().values;

  if (encoding.hasValues()) {
    raw.values = values;
  } else {
    raw.url = encoding.data().url;
    raw.format.type = encoding.data().formatType;
  }

  raw.format = encoding.reduce(function(format, field) {
    var name;
    if (field.type == T) {
      format.parse = format.parse || {};
      format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      format.parse = format.parse || {};
      if (vlfield.isCount(field)) {
        name = 'count';
      } else {
        name = field.name;
      }
      format.parse[name] = 'number';
    }
  }, {});

  return raw;
};

data.aggregated = function() {
  return {name: TABLE, source: RAW};
};