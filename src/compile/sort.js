var globals = require('../globals');

module.exports = addSortTransforms;

// adds new transforms that produce sorted fields
function addSortTransforms(spec, encoding, opt) {
  var datasetMapping = {};
  var counter = 0;

  encoding.forEach(function(encType, field) {
    var sortBy = encoding.sort(encType);
    if (sortBy.length > 0) {
      var fields = sortBy.map(function(d) {
        return {
          op: d.aggr,
          field: 'data.' + d.name
        };
      });

      var byClause = sortBy.map(function(d) {
        return (d.reverse ? '-' : '') + 'data.' + d.aggr + '_' + d.name;
      });

      var dataName = 'sorted' + counter++;

      spec.data.push({
        name: dataName,
        source: RAW,
        transform: [
          {
            type: 'aggregate',
            groupby: ['data.' + field.name],
            fields: fields
          },
          {
            type: 'sort',
            by: byClause
          }
        ]
      });

      datasetMapping[encType] = dataName;
    }
  });

  return {
    spec: spec,
    mapping: datasetMapping,
    getDataset: function(encType) {
      var data = datasetMapping[encType];
      if (!data) {
        return TABLE;
      }
      return data;
    },
    hasOrderedSource: function(encType) {
      return encType in datasetMapping;
    }
  };
}
