var globals = require('../globals'),
  util = require('../util');

module.exports = binning;

function binning(spec, encoding, opt) {
  opt = opt || {};
  var bins = {};

  if (opt.preaggregatedData) {
    return;
  }

  if (!spec.transform) spec.transform = [];

  encoding.forEach(function(vv, d) {
    if (d.bin) {
      spec.transform.push({
        type: 'bin',
        field: 'data.' + d.name,
        output: 'data.bin_' + d.name,
        maxbins: encoding.enc(vv).maxbins
      });
    }
  });
}
