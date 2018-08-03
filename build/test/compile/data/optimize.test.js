"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var optimize_1 = require("../../../src/compile/data/optimize");
describe('compile/data/optimize', function () {
    describe('mergeParse', function () {
        it('should merge non-conflicting ParseNodes', function () {
            var root = new dataflow_1.DataFlowNode(null, 'root');
            // ts-ignore is used to suppress the noUnusedLocals error
            // @ts-ignore
            var parse1 = new formatparse_1.ParseNode(root, { a: 'number', b: 'string' });
            // @ts-ignore
            var parse2 = new formatparse_1.ParseNode(root, { b: 'string', c: 'boolean' });
            optimize_1.mergeParse(root);
            chai_1.assert.deepEqual(root.children.length, 1);
            var mergedParseNode = root.children[0];
            chai_1.assert.deepEqual(mergedParseNode.parse, { a: 'number', b: 'string', c: 'boolean' });
        });
        it('should not merge conflicting ParseNodes', function () {
            var root = new dataflow_1.DataFlowNode(null, 'root');
            // @ts-ignore
            var parse1 = new formatparse_1.ParseNode(root, { a: 'number', b: 'string' });
            // @ts-ignore
            var parse2 = new formatparse_1.ParseNode(root, { a: 'boolean', d: 'date' });
            optimize_1.mergeParse(root);
            chai_1.assert.deepEqual(root.children.length, 1);
            var mergedParseNode = root.children[0];
            chai_1.assert.deepEqual(mergedParseNode.parse, { b: 'string', d: 'date' });
            var children = mergedParseNode.children;
            chai_1.assert.deepEqual(children[0].parse, { a: 'number' });
            chai_1.assert.deepEqual(children[1].parse, { a: 'boolean' });
        });
    });
});
//# sourceMappingURL=optimize.test.js.map