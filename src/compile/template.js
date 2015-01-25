var globals = require('../globals');

var groupdef = require('./group').def,
  vldata = require('../data');

module.exports = template;

function template(encoding, size, stats) { //hack use stats

  var data = {name: TABLE, format: {type: encoding.config('dataFormatType')}},
    dataUrl = vldata.getUrl(encoding, stats);
  if (dataUrl) data.url = dataUrl;

  var preaggregatedData = encoding.config('useVegaServer');

  encoding.forEach(function(encType, field) {
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    }else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (field.aggr === 'count') {
        var name = 'count';
      } else if (preaggregatedData && field.bin) {
        var name = 'bin_' + field.name;
      } else if (preaggregatedData && field.aggr) {
        var name = field.aggr + '_' + field.name;
      } else {
        var name = field.name;
      }
      data.format.parse[name] = 'number';
    }
  });

  return {
    width: size.width,
    height: size.height,
    padding: 'auto',
    data: [data],
    marks: [groupdef('cell', {
      width: size.cellWidth ? {value: size.cellWidth} : undefined,
      height: size.cellHeight ? {value: size.cellHeight} : undefined
    })]
  };
}
