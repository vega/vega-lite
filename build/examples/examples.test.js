"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var compile_1 = require("../src/compile/compile");
var Ajv = require("ajv");
var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var vlSchema = require('../../build/vega-lite-schema.json');
var vgSchema = require('vega/build/vega-schema.json');
var ajv = new Ajv({
    validateSchema: false,
    extendRefs: true,
    allErrors: true
});
var validateVl = ajv.compile(vlSchema);
var validateVg = ajv.compile(vgSchema);
function validateVL(spec) {
    var valid = validateVl(spec);
    var errors = validateVl.errors;
    if (!valid) {
        console.log(inspect(errors, { depth: 10, colors: true }));
    }
    chai_1.assert(valid, errors && errors.map(function (err) { return err.message; }).join(', '));
    chai_1.assert.equal(spec.$schema, 'https://vega.github.io/schema/vega-lite/v2.json');
}
function validateVega(spec) {
    var vegaSpec = compile_1.compile(spec).spec;
    var valid = validateVg(vegaSpec);
    var errors = validateVg.errors;
    if (!valid) {
        console.log(inspect(errors, { depth: 10, colors: true }));
    }
    chai_1.assert(valid, errors && errors.map(function (err) { return err.message; }).join(', '));
}
describe('Examples', function () {
    var examples = fs.readdirSync('examples/specs');
    examples.forEach(function (example) {
        if (path.extname(example) !== '.json') {
            return;
        }
        var jsonSpec = JSON.parse(fs.readFileSync('examples/specs/' + example));
        describe(example, function () {
            it('should be valid vega-lite with proper $schema', function () {
                validateVL(jsonSpec);
            });
            it('should produce valid vega', function () {
                validateVega(jsonSpec);
            });
        });
    });
});
//# sourceMappingURL=examples.test.js.map