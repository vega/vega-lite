"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
describe('compile/data/dataflow', function () {
    describe('DataFlowNode', function () {
        describe('swap', function () {
            it('should correctly swap two nodes in a simple chain', function () {
                var a = new dataflow_1.DataFlowNode(null, 'a');
                var b = new dataflow_1.DataFlowNode(a, 'b');
                var c = new dataflow_1.DataFlowNode(b, 'c');
                var d = new dataflow_1.DataFlowNode(c, 'd');
                c.swapWithParent();
                chai_1.assert.equal(a.numChildren(), 1);
                chai_1.assert.equal(a.children[0].debugName, 'c');
                chai_1.assert.equal(b.numChildren(), 1);
                chai_1.assert.equal(b.children[0].debugName, 'd');
                chai_1.assert.equal(c.numChildren(), 1);
                chai_1.assert.equal(c.children[0].debugName, 'b');
                chai_1.assert.equal(d.numChildren(), 0);
            });
            it('should correctly swap two nodes', function () {
                var root = new dataflow_1.DataFlowNode(null, 'root');
                var parent = new dataflow_1.DataFlowNode(root, 'parent');
                var node = new dataflow_1.DataFlowNode(parent, 'node');
                var child1 = new dataflow_1.DataFlowNode(node, 'child1');
                var child2 = new dataflow_1.DataFlowNode(node, 'child2');
                var parentChild1 = new dataflow_1.DataFlowNode(parent, 'parentChild1');
                var parentChild2 = new dataflow_1.DataFlowNode(parent, 'parentChild2');
                node.swapWithParent();
                chai_1.assert.equal(root.numChildren(), 1);
                chai_1.assert.equal(root.children[0].debugName, 'node');
                chai_1.assert.equal(node.parent.debugName, 'root');
                chai_1.assert.equal(node.numChildren(), 1);
                chai_1.assert.equal(node.children[0].debugName, 'parent');
                chai_1.assert.equal(parent.parent.debugName, 'node');
                chai_1.assert.equal(parent.numChildren(), 4);
                parent.children.forEach(function (c) {
                    chai_1.assert.equal(c.numChildren(), 0);
                    chai_1.assert.equal(c.parent.debugName, 'parent');
                });
                chai_1.assert.equal(child1.debugName, 'child1');
                chai_1.assert.equal(child2.debugName, 'child2');
                chai_1.assert.equal(parentChild1.debugName, 'parentChild1');
                chai_1.assert.equal(parentChild2.debugName, 'parentChild2');
            });
        });
        describe('remove', function () {
            it('should remove node from dataflow', function () {
                var a = new dataflow_1.DataFlowNode(null, 'a');
                var b = new dataflow_1.DataFlowNode(a, 'b');
                var c = new dataflow_1.DataFlowNode(b, 'c');
                chai_1.assert.deepEqual(a.children, [b]);
                chai_1.assert.equal(b.parent, a);
                chai_1.assert.equal(c.parent, b);
                b.remove();
                chai_1.assert.deepEqual(a.children, [c]);
                chai_1.assert.equal(c.parent, a);
            });
        });
        describe('insertAsParentOf', function () {
            it('should insert node into dataflow', function () {
                var a = new dataflow_1.DataFlowNode(null, 'a');
                var anotherChild = new dataflow_1.DataFlowNode(a, 'a');
                var b = new dataflow_1.DataFlowNode(null, 'b');
                var c = new dataflow_1.DataFlowNode(a, 'c');
                b.insertAsParentOf(c);
                chai_1.assert.sameDeepMembers(a.children, [anotherChild, b]);
                chai_1.assert.equal(b.parent, a);
                chai_1.assert.equal(c.parent, b);
                chai_1.assert.equal(anotherChild.parent, a);
            });
        });
    });
});
//# sourceMappingURL=dataflow.test.js.map