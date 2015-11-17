import vlEncoding from './Encoding';
import * as vlData from './data';
import * as vlEnc from './enc';
import * as vlFieldDef from './encdef';
import * as vlCompiler from './compiler/compiler';
import * as vlSchema from './schema/schema';
import * as vlValidate from './validate';

// TODO: revise if we can remove this
import {format as d3Format} from 'd3-format';

export * from './util';
export * from './consts';

// TODO(#727) split this into two namespace
export var Encoding = vlEncoding;
export var compiler = vlCompiler;
export var compile = vlCompiler.compile;
export var data = vlData;
// TODO(#727) rename to encoding
export var enc = vlEnc;
export var encDef = vlFieldDef;
export var schema = vlSchema;
// TODO: revise if we can remove this
export var toShorthand = vlEncoding.shorthand;
export var format = d3Format;
export var validate = vlValidate;

export const version = '__VERSION__';
