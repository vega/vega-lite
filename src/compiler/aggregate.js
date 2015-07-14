'use strict';

require('../globals');

var util = require('../util');

module.exports = aggregates;

function aggregates(dataTable, encoding, opt) {
  opt = opt || {};

  var dims = {}, meas = {}, detail = {}, facets = {};

  encoding.forEach(function(field, encType) {
    if (field.aggregate) {
      if (field.aggregate === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggregate + '|'+ field.name] = {
          op: field.aggregate,
          field: encoding.fieldRef(encType, {nofn: true})
        };
      }
    } else {
      dims[field.name] = encoding.fieldRef(encType);
      if (encType == ROW || encType == COL) {
        facets[field.name] = dims[field.name];
      }else if (encType !== X && encType !== Y) {
        detail[field.name] = dims[field.name];
      }
    }
  });
  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0) {
    if (!dataTable.transform) dataTable.transform = [];
    dataTable.transform.push({
      type: 'aggregate',
      groupby: dims,
      fields: meas
    });
  }
  return {
    details: util.vals(detail),
    dims: dims,
    facets: util.vals(facets),
    aggregated: meas.length > 0
  };
}
