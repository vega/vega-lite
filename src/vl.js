var globals = require("./globals"),
    util = require("./util"),
    consts = require('./consts');

var vl = util.merge(consts, util);

vl.Encoding = require('./Encoding');
vl.axis = require('./axis');
vl.compile = require('./compile');
vl.data = require('./data');
vl.legends = require('./legends');
vl.marks = require('./marks')
vl.scale = require('./scale');
vl.schema = require('./schema');

module.exports = vl;