/// <reference path="../typings/json3.d.ts"/>

import * as schema from './schema';
import * as schemaUtil from './schemautil';
import {stringify} from 'lib/json3-compactstringify.js';

process.stdout.write(stringify(schemaUtil.instantiate(schema), null, 1, 80) + '\n');
