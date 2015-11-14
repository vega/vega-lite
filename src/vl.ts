import VlEncoding from './Encoding';

import * as vlData from './data';
import * as vlEnc from './enc';
import * as vlEncDef from './encdef';
import * as vlCompiler from './compiler/compiler';
import * as vlSchema from './schema/schema';

import {format as d3Format} from 'd3-format';

export * from './util';
export * from './consts';

export {default as Encoding} from './Encoding';
export var compiler = vlCompiler;
export var compile = vlCompiler.compile;
export var data = vlData;
export var enc = vlEnc;
export var encDef = vlEncDef;
export var schema = vlSchema;
export var toShorthand = VlEncoding.shorthand;
export var format = d3Format;

export const version = '__VERSION__';
