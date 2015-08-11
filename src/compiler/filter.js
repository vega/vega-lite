'use strict';

require('../globals');

var filter = module.exports = {};

// remove less than 0 values if we use log function
filter.filterLessThanZero = function(dataTable, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      dataTable.transform.push({
        type: 'filter',
        test: 'd.' + encoding.fieldRef(encType) + '>0'
      });
    }
  });
};
