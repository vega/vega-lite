/* tslint:disable:quotemark */
import { assert } from 'chai';
import { SampleTransformNode } from '../../../src/compile/data/sample';
describe('compile/data/sample', function () {
    describe('SampleTransformNode', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                sample: 500
            };
            var sample = new SampleTransformNode(null, transform);
            assert.deepEqual(sample.assemble(), {
                type: 'sample',
                size: 500
            });
        });
    });
});
//# sourceMappingURL=sample.test.js.map