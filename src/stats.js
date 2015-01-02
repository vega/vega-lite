var vl = require("./vl");

// Returns the stats for the dataset.
// Stats is a map from each field name to an object with min, max, count, cardinality and type.
var getStats = function(data){ // hack
  var stats = {};
  var fields = vl.keys(data[0]);

  fields.forEach(function(k) {
    var stat = minmax(data, k);
    stat.cardinality = uniq(data, k);
    //TODO(kanitw): better type inference here
    stat.type = (typeof data[0][k] === "number") ? vl.dataTypes.Q :
      isNaN(Date.parse(data[0][k])) ? vl.dataTypes.O : vl.dataTypes.T;
    stat.count = data.length;
    stats[k] = stat;
  });
  return stats;
}

function uniq(data, field) {
  var map = {}, count = 0, i, k;
  for (i=0; i<data.length; ++i) {
    k = data[i][field];
    if (!map[k]) {
      map[k] = 1;
      count += 1;
    }
  }
  return count;
}

function minmax(data, field) {
  var stats = {min: +Infinity, max: -Infinity};
  for (i=0; i<data.length; ++i) {
    var v = data[i][field];
    if (v > stats.max) stats.max = v;
    if (v < stats.min) stats.min = v;
  }
  return stats;
}

module.exports = getStats;