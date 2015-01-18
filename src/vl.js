(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.vl = factory();
  }
}(this, function() {


  var globals = require("./globals"),
    util = require("./util"),
    consts = require('./consts');

  var vl = util.merge(consts, util);

  vl.Encoding = require('./Encoding');
  vl.axis = require('./axis');
  vl.getDataUrl = require('./getDataUrl');
  vl.getStats = require('./getStats');
  vl.legends = require('./legends');
  vl.marks = require('./marks')
  vl.scale = require('./scale');
  vl.schema = require('./schema');
  vl.toVegaSpec = require('./toVegaSpec');

  if(window) window.vl = vl;
  module.exports = vl;

}));