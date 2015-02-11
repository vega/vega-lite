var globals = require('../globals');

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

module.exports = function(spec, encoding) {
  var filters = encoding.filter();

  if (!spec.data[0].transform)
    spec.data[0].transform = [];

  // add custom filters
  for (i in filters) {
    var filter = filters[i];

    var condition = '';
    var operator = filter.operator;
    var operands = filter.operands;

    if (BINARY[operator]) {
      // expects a field and a value
      if (operator === '=') {
        operator = '==';
      }

      var op1 = operands[0];
      var op2 = operands[1];
      condition = 'd.data.' + op1 + operator + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (j in operands) {
        condition += 'd.data.' + operands[j] + '!=null'
        if (j < operands.length - 1) {
          condition += ' && '
        }
      }
    } else {
      console.warn('Unsupported operator: ', operator);
    }

    spec.data[0].transform.push({
      type: 'filter',
      test: condition
    });
  };

  // remove 0 values if we use log function
  encoding.forEach(function(encType, field) {
    if (encoding.scale(encType).type === 'log') {
      spec.data[0].transform.push({
        type: 'filter',
        test: 'd.data.' + field.name + '>0'
      });
    }
  });
};

