import {Model as vlModel} from './compiler/Model';
import * as vlChannel from './channel';
import * as vlData from './data';
import * as vlEnc from './enc';
import * as vlFieldDef from './fielddef';
import * as vlCompiler from './compiler/compiler';
import * as vlSchema from './schema/schema';
import * as vlType from './type';
import * as vlValidate from './validate';

// TODO: revise if we can remove this
import {format as d3Format} from 'd3-format';

export * from './util';
export * from './consts';

// TODO() rename this
export var Encoding = vlModel;

export var channel = vlChannel;
export var compiler = vlCompiler;
export var compile = vlCompiler.compile;
export var data = vlData;
// TODO(#727) rename to encoding
export var enc = vlEnc;
export var fieldDef = vlFieldDef;
export var schema = vlSchema;
// TODO: revise if we can remove this
export var toShorthand = vlModel.shorthand;
export var type = vlType;
export var format = d3Format;
export var validate = vlValidate;

export const version = '__VERSION__';
