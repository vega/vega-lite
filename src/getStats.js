var util = require('./util');

var getStats = module.exports = function(data){ // hack
  var stats = {};
  var fields = util.keys(data[0]);

  fields.forEach(function(k) {
    var stat = util.minmax(data, k);
    stat.cardinality = util.uniq(data, k);
    //TODO(kanitw): better type inference here
    stat.type = (typeof data[0][k] === "number") ? "Q" :
      isNaN(Date.parse(data[0][k])) ? "O" : "T";
    stat.count = data.length;
    stats[k] = stat;
  });
  return stats;
}
