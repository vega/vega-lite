/* tslint:disable:quotemark */
import { assert } from 'chai';
import { SampleTransformNode } from '../../../src/compile/data/sample';
import { DataFlowNode } from './../../../src/compile/data/dataflow';
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
        it('should generate the correct hash', function () {
            var transform = {
                sample: 500
            };
            var sample = new SampleTransformNode(null, transform);
            assert.deepEqual(sample.hash(), 'SampleTransform {"sample":500}');
        });
        it('should never clone parent', function () {
            var parent = new DataFlowNode(null);
            var sample = new SampleTransformNode(parent, {
                sample: 500
            });
            expect(sample.clone().parent).toBeNull();
        });
    });
});
//# sourceMappingURL=sample.test.js.map