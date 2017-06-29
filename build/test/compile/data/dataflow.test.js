"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
describe('compile/data/dataflow', function () {
    describe('DataFlowNode', function () {
        describe('swap', function () {
            it('should correctly swap two nodes in a simple chain', function () {
                var a = new dataflow_1.DataFlowNode('a');
                var b = new dataflow_1.DataFlowNode('b');
                b.parent = a;
                var c = new dataflow_1.DataFlowNode('c');
                c.parent = b;
                var d = new dataflow_1.DataFlowNode('d');
                d.parent = c;
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
                var root = new dataflow_1.DataFlowNode('root');
                var parent = new dataflow_1.DataFlowNode('parent');
                parent.parent = root;
                var node = new dataflow_1.DataFlowNode('node');
                node.parent = parent;
                var child1 = new dataflow_1.DataFlowNode('child1');
                child1.parent = node;
                var child2 = new dataflow_1.DataFlowNode('child2');
                child2.parent = node;
                var parentChild1 = new dataflow_1.DataFlowNode('parentChild1');
                parentChild1.parent = parent;
                var parentChild2 = new dataflow_1.DataFlowNode('parentChild2');
                parentChild2.parent = parent;
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
            });
        });
        describe('remove', function () {
            it('should remove node from dataflow', function () {
                var a = new dataflow_1.DataFlowNode('a');
                var b = new dataflow_1.DataFlowNode('b');
                b.parent = a;
                var c = new dataflow_1.DataFlowNode('c');
                c.parent = b;
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
                var a = new dataflow_1.DataFlowNode('a');
                var anotherChild = new dataflow_1.DataFlowNode('a');
                var b = new dataflow_1.DataFlowNode('b');
                var c = new dataflow_1.DataFlowNode('c');
                anotherChild.parent = a;
                c.parent = a;
                b.insertAsParentOf(c);
                chai_1.assert.sameDeepMembers(a.children, [anotherChild, b]);
                chai_1.assert.equal(b.parent, a);
                chai_1.assert.equal(c.parent, b);
                chai_1.assert.equal(anotherChild.parent, a);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUVoRSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ2YsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO2dCQUN0RCxJQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLElBQU0sQ0FBQyxHQUFHLElBQUksdUJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBRWIsSUFBTSxDQUFDLEdBQUcsSUFBSSx1QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFFYixJQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUViLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFbkIsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFR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