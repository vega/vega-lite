'use strict';

var schema = require('./schema').schema,
  schemaUtil = require('./schemautil'),
  json3 = require('../../lib/json3-compactstringify.js');

process.stdout.write(json3.stringify(schemaUtil.instantiate(schema), null, 1, 80) + '\n');
