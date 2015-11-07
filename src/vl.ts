/// <reference path="./d3-format.d.ts"/>

import * as util from './util';
import * as consts from './consts';
import * as data from './data';
import * as enc from './enc';
import * as encDef from './encDef';
import {format} from 'd3-format';
import {Encoding} from './Encoding';

var vl:any = {};

util.extend(vl, consts, util);

vl.Encoding = Encoding;
vl.compiler = require('./compiler/compiler');
vl.compile = vl.compiler.compile;
vl.data = data;
vl.enc = enc;
vl.encDef = encDef;
vl.schema = require('./schema/schema');
vl.toShorthand = vl.Encoding.shorthand;
vl.format = format;
vl.version = '__VERSION__';

declare var module;
module.exports = vl;
