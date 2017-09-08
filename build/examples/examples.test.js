"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var chai_1 = require("chai");
var compile_1 = require("../src/compile/compile");
var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
var vlSchema = require('../../build/vega-lite-schema.json');
var vgSchema = require('vega/build/vega-schema.json');
var ajv = new Ajv({
    validateSchema: true,
    allErrors: true,
    extendRefs: 'fail'
});
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'), 'http://json-schema.org/draft-04/schema#');
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
var suffixLength = '_future.vl.json'.length;
describe('Examples', function () {
    var examples = fs.readdirSync('examples/specs');
    examples.forEach(function (example) {
        if (path.extname(example) !== '.json') {
            return;
        }
        var jsonSpec = JSON.parse(fs.readFileSync('examples/specs/' + example));
        describe(example, function () {
            it('should be valid vega-lite with proper $schema', function () {
                if (
                // Do not validate overlay example until we have redesigned it
                example.indexOf('overlay') >= 0 ||
                    // Also ignore box-plot examples until we support selections
                    example.indexOf('box-plot') >= 0 ||
                    // Also ignore all examples with "_future" suffix
                    example.lastIndexOf('_future.vl.json', example.length - suffixLength) >= 0) {
                    return;
                }
                validateVL(jsonSpec);
            });
            it('should produce valid vega', function () {
                validateVega(jsonSpec);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2V4YW1wbGVzL2V4YW1wbGVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBMkI7QUFDM0IsNkJBQTRCO0FBQzVCLGtEQUErQztBQUcvQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3hDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDOUQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFeEQsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7SUFDZixVQUFVLEVBQUUsTUFBTTtDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7QUFFaEgsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN6QyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXpDLG9CQUFvQixJQUEwQjtJQUM1QyxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUs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