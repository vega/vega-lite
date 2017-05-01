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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWZsb3cudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2RhdGFmbG93LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUVoRSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ2YsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO2dCQUN0RCxJQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLElBQU0sQ0FBQyxHQUFHLElBQUksdUJBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBRWIsSUFBTSxDQUFDLEdBQUcsSUFBSSx1QkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFFYixJQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUViLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFbkIsYUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxhQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFR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