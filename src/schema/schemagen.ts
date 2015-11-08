/// <reference path="../typings/json3.d.ts"/>

import * as schema from './schema';
import {stringify} from 'lib/json3-compactstringify.js';

process.stdout.write(stringify(schema, null, 1, 80) + '\n');
