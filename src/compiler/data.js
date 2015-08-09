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

data.raw = function(encoding) {
  var raw = {name: RAW};

  // Data source (url or inline)
  if (encoding.hasValues()) {
    raw.values = encoding.data().values;
  } else {
    raw.url = encoding.data().url;
    raw.format = {type: encoding.data().formatType};
  }

  // Set format.parse if needed
  var parse = data.raw.formatParse(encoding);
  if (parse) {
    raw.format = raw.format || {};
    raw.format.parse = parse;
  }

  return raw;
};

data.raw.formatParse = function(encoding) {
  var parse;

  encoding.forEach(function(field) {
    if (field.type == T) {
      parse = parse || {};
      parse[field.name] = 'date';
    } else if (field.type == Q) {
      var name = vlfield.isCount(field) ? 'count' : field.name;
      parse = parse || {};
      parse[name] = 'number';
    }
  });

  return parse;
};

data.aggregated = function() {
  return {name: TABLE, source: RAW};
};