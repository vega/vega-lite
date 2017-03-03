"use strict";
var chai_1 = require("chai");
var Ajv = require("ajv");
var util_1 = require("util");
var specSchema = require('../vega-lite-schema.json');
var metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
describe('Schema', function () {
    it('should be valid', function () {
        var ajv = new Ajv({
            allErrors: true,
            verbose: true
        });
        ajv.addMetaSchema(metaSchema, 'http://json-schema.org/draft-04/schema#');
        // now validate our data against the schema
        var valid = ajv.validateSchema(specSchema);
        if (!valid) {
            console.log(util_1.inspect(ajv.errors, { depth: 10, colors: true }));
        }
        chai_1.assert.equal(valid, true);
    });
});
//# sourceMappingURL=schema.test.js.map