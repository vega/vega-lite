'use strict';

require('../globals');

module.exports = binning;

function binning(dataTable, encoding, opt) {
  opt = opt || {};

  if (!dataTable.transform) dataTable.transform = [];

  encoding.forEach(function(field, encType) {
    if (encoding.bin(encType)) {
      dataTable.transform.push({
        type: 'bin',
        field: encoding.fieldRef(encType, {nofn: true}),
        output: encoding.fieldRef(encType),
        maxbins: encoding.bin(encType).maxbins
      });
    }
  });

  return dataTable;
}
