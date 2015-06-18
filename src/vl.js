'use strict';

require('./globals');

var util = require('./util'),
    consts = require('./consts');

var vl = {};

util.extend(vl, consts, util);

vl.Encoding = require('./Encoding');
vl.compiler = require('./compiler/compiler');
vl.compile = vl.compiler.compile;
vl.data = require('./data');
vl.enc = require('./enc');
vl.field = require('./field');
vl.schema = require('./schema/schema');
vl.toShorthand = vl.Encoding.shorthand;

module.exports = vl;