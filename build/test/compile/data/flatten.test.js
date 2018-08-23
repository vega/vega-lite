/* tslint:disable:quotemark */
import { assert } from 'chai';
import { FlattenTransformNode } from '../../../src/compile/data/flatten';
describe('compile/data/flatten', function () {
    describe('FlattenTransformNode', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                flatten: ['a', 'b'],
                as: ['a', 'b']
            };
            var flatten = new FlattenTransformNode(null, transform);
            assert.deepEqual(flatten.assemble(), {
                type: 'flatten',
                fields: ['a', 'b'],
                as: ['a', 'b']
            });
        });
        it('should handle missing "as" field', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new FlattenTransformNode(null, transform);
            assert.deepEqual(flatten.assemble(), {
                type: 'flatten',
                fields: ['a', 'b'],
                as: ['a', 'b']
            });
        });
        it('should handle partial "as" field', function () {
            var transform = {
                flatten: ['a', 'b'],
                as: ['A']
            };
            var flatten = new FlattenTransformNode(null, transform);
            assert.deepEqual(flatten.assemble(), {
                type: 'flatten',
                fields: ['a', 'b'],
                as: ['A', 'b']
            });
        });
        it('should return proper produced fields', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new FlattenTransformNode(null, transform);
            assert.deepEqual(flatten.producedFields(), { a: true, b: true });
        });
        it('should generate the correct hash', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new FlattenTransformNode(null, transform);
            assert.deepEqual(flatten.hash(), 'FlattenTransform {"as":["a","b"],"flatten":["a","b"]}');
        });
    });
});
//# sourceMappingURL=flatten.test.js.map