"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sample_1 = require("../../../src/compile/data/sample");
describe('compile/data/sample', function () {
    describe('SampleTransformNode', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                sample: 500
            };
            var sample = new sample_1.SampleTransformNode(null, transform);
            chai_1.assert.deepEqual(sample.assemble(), {
                type: 'sample',
                size: 500
            });
        });
        it('should generate the correct hash', function () {
            var transform = {
                sample: 500
            };
            var sample = new sample_1.SampleTransformNode(null, transform);
            chai_1.assert.deepEqual(sample.hash(), 'SampleTransform {"sample":500}');
        });
    });
});
//# sourceMappingURL=sample.test.js.map