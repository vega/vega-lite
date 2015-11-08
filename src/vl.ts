import {Encoding} from './Encoding';

import * as util from './util';
import * as consts from './consts';
import * as data from './data';
import * as enc from './enc';
import * as encDef from './encdef';
import * as compiler from './compiler/compiler';
import * as schema from './schema/schema';

import {format} from 'd3-format';

var vl:any = {};

util.extend(vl, consts, util);

vl.Encoding = Encoding;
vl.compiler = compiler;
vl.compile = vl.compiler.compile;
vl.data = data;
vl.enc = enc;
vl.encDef = encDef;
vl.schema = schema;
vl.toShorthand = vl.Encoding.shorthand;
vl.format = format;
vl.version = '__VERSION__';

declare var module;
module.exports = vl;
