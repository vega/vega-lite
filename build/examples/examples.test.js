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
    extendRefs: 'fail',
    allErrors: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2V4YW1wbGVzL2V4YW1wbGVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBMkI7QUFDM0IsNkJBQTRCO0FBQzVCLGtEQUErQztBQUcvQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ3hDLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFN0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDOUQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFeEQsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsVUFBVSxFQUFFLE1BQU07SUFDbEIsU0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsd0NBQXdDLENBQUMsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO0FBRWhILElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUV6QyxvQkFBb0IsSUFBMEI7SUFDNUMsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDRCxhQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBb0IsSUFBSyxPQUFBLEdBQUcsQ0FBQyxPQUFPLEVBQVgsQ0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFdEYsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlEQUFpRCxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVELHNCQUFzQixJQUEwQjtJQUM5QyxJQUFNLFFBQVEsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVwQyxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNELGFBQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFvQixJQUFLLE9BQUEsR0FBRyxDQUFDLE9BQU8sRUFBWCxDQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRUQsUUFBUSxDQUFDLFVBQVUsRUFBRTtJQUNuQixJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFbEQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFTLE9BQWU7UUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQUEsTUFBTSxDQUFDO1FBQUEsQ0FBQztRQUNoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUUxRSxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtnQkFDbEQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO2dCQUM5QixZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==