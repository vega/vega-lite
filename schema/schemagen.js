var schema = require("../src/schema").encoding,
  json3 = require("../lib/json3-compactstringify.js");

process.stdout.write(json3.stringify(schema, null, 1, 80) + "\n");
