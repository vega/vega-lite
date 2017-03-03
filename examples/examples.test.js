"use strict";
var chai_1 = require("chai");
var vl = require("../src/vl");
var Ajv = require("ajv");
var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var vlSchema = require('../vega-lite-schema.json');
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
}
function validateVega(spec) {
    var vegaSpec = vl.compile(spec).spec;
    console.log(inspect(vegaSpec));
    if (spec.description === 'A simple bar chart with embedded data.') {
        console.log(inspect(vegaSpec));
    }
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
            it('should be valid vega-lite', function () {
                validateVL(jsonSpec);
            });
            it('should produce valid vega', function () {
                validateVega(jsonSpec);
            });
        });
    });
});
//# sourceMappingURL=examples.test.js.map