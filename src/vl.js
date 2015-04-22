'use strict';

var globals = require('./globals'),
    util = require('./util'),
    consts = require('./consts');

var vl = {};  // util.merge(consts, util);

vl.consts = consts;
vl.util = util;

vl.Encoding = require('./Encoding');
vl.compile = require('./compile/compile');
vl.data = require('./data');
vl.field = require('./field');
vl.enc = require('./enc');
vl.schema = require('./schema/schema');
vl.toShorthand = vl.Encoding.shorthand;


module.exports = vl;
