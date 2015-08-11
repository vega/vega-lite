'use strict';

require('../globals');

module.exports = data;

var vlfield = require('../field'),
  util = require('../util');

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

  raw.transform = data.raw.transform(encoding);
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

data.raw.transform = function(encoding) {
  return data.raw.transform.time(encoding).concat(
    data.raw.transform.filter(encoding)
  );
};

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

data.raw.transform.time = function(encoding) {
  return encoding.reduce(function(transform, field, encType) {
    if (field.type === T && field.timeUnit) {
      transform.push({
        type: 'formula',
        field: encoding.fieldRef(encType),
        expr: data.raw.transform.time.fn(field) +
          '(' + encoding.fieldRef(encType, {nofn: true, d: true}) + ')'
      });
    }
    return transform;
  }, []);
};

data.raw.transform.time.fn = function(field) {
  // Add other time unit
  return 'utc' + field.timeUnit;

};

data.raw.transform.filter = function(encoding) {
  var filters = encoding.filter().reduce(function(f, filter) {
    var condition = '';
    var operator = filter.operator;
    var operands = filter.operands;

    var d = 'd.' + (encoding._vega2 ? '' : 'data.');

    if (BINARY[operator]) {
      // expects a field and a value
      if (operator === '=') {
        operator = '==';
      }

      var op1 = operands[0];
      var op2 = operands[1];
      condition = d + op1 + ' ' + operator + ' ' + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (var j=0; j<operands.length; j++) {
        condition += d + operands[j] + '!==null';
        if (j < operands.length - 1) {
          condition += ' && ';
        }
      }
    } else {
      util.warn('Unsupported operator: ', operator);
      return f;
    }
    f.push('(' + condition + ')');
    return f;
  }, []);
  if (filters.length === 0) return [];

  return [{
      type: 'filter',
      test: filters.join(' && ')
  }];
};

data.aggregated = function() {
  return {name: TABLE, source: RAW};
};