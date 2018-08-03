"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fold_1 = require("../../../src/compile/data/fold");
describe('compile/data/fold', function () {
    describe('FoldTransformNode', function () {
        it('should return a proper vg transform', function () {
            var transform = {
                fold: ['a', 'b'],
                as: ['a', 'b']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.assemble(), {
                type: 'fold',
                fields: ['a', 'b'],
                as: ['a', 'b']
            });
        });
        it('should handle missing "as" field', function () {
            var transform = {
                fold: ['a', 'b']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.assemble(), {
                type: 'fold',
                fields: ['a', 'b'],
                as: ['key', 'value']
            });
        });
        it('should handle partial "as" field', function () {
            var transform = {
                fold: ['a', 'b'],
                as: ['A']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.assemble(), {
                type: 'fold',
                fields: ['a', 'b'],
                as: ['A', 'value']
            });
        });
        it('should return proper produced fields for no "as"', function () {
            var transform = {
                fold: ['a', 'b']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.producedFields(), { key: true, value: true });
        });
        it('should return proper produced fields for complete "as"', function () {
            var transform = {
                fold: ['a', 'b'],
                as: ['A', 'B']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.producedFields(), { A: true, B: true });
        });
        it('should generate the correct hash', function () {
            var transform = {
                fold: ['a', 'b'],
                as: ['A', 'B']
            };
            var fold = new fold_1.FoldTransformNode(null, transform);
            chai_1.assert.deepEqual(fold.hash(), 'FoldTransform {"as":["A","B"],"fold":["a","b"]}');
        });
    });
});
//# sourceMappingURL=fold.test.js.map