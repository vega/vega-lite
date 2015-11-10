'use strict';

var schema = require('./schema').schema;

process.stdout.write(JSON.stringify(schema, null, 4) + '\n');
