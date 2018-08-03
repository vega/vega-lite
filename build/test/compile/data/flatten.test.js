"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var flatten_1 = require("../../../src/compile/data/flatten");
describe('compile/data/flatten', function () {
    describe('FlattenTransformNode', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                flatten: ['a', 'b'],
                as: ['a', 'b']
            };
            var flatten = new flatten_1.FlattenTransformNode(null, transform);
            chai_1.assert.deepEqual(flatten.assemble(), {
                type: 'flatten',
                fields: ['a', 'b'],
                as: ['a', 'b']
            });
        });
        it('should handle missing "as" field', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new flatten_1.FlattenTransformNode(null, transform);
            chai_1.assert.deepEqual(flatten.assemble(), {
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
            var flatten = new flatten_1.FlattenTransformNode(null, transform);
            chai_1.assert.deepEqual(flatten.assemble(), {
                type: 'flatten',
                fields: ['a', 'b'],
                as: ['A', 'b']
            });
        });
        it('should return proper produced fields', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new flatten_1.FlattenTransformNode(null, transform);
            chai_1.assert.deepEqual(flatten.producedFields(), { a: true, b: true });
        });
        it('should generate the correct hash', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var flatten = new flatten_1.FlattenTransformNode(null, transform);
            chai_1.assert.deepEqual(flatten.hash(), 'FlattenTransform {"as":["a","b"],"flatten":["a","b"]}');
        });
    });
});
//# sourceMappingURL=flatten.test.js.map