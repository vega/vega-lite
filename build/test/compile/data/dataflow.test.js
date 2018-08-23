/* tslint:disable:quotemark */
import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
describe('compile/data/dataflow', function () {
    describe('DataFlowNode', function () {
        describe('swap', function () {
            it('should correctly swap two nodes in a simple chain', function () {
                var a = new DataFlowNode(null, 'a');
                var b = new DataFlowNode(a, 'b');
                var c = new DataFlowNode(b, 'c');
                var d = new DataFlowNode(c, 'd');
                c.swapWithParent();
                assert.equal(a.numChildren(), 1);
                assert.equal(a.children[0].debugName, 'c');
                assert.equal(b.numChildren(), 1);
                assert.equal(b.children[0].debugName, 'd');
                assert.equal(c.numChildren(), 1);
                assert.equal(c.children[0].debugName, 'b');
                assert.equal(d.numChildren(), 0);
            });
            it('should correctly swap two nodes', function () {
                var root = new DataFlowNode(null, 'root');
                var parent = new DataFlowNode(root, 'parent');
                var node = new DataFlowNode(parent, 'node');
                var child1 = new DataFlowNode(node, 'child1');
                var child2 = new DataFlowNode(node, 'child2');
                var parentChild1 = new DataFlowNode(parent, 'parentChild1');
                var parentChild2 = new DataFlowNode(parent, 'parentChild2');
                node.swapWithParent();
                assert.equal(root.numChildren(), 1);
                assert.equal(root.children[0].debugName, 'node');
                assert.equal(node.parent.debugName, 'root');
                assert.equal(node.numChildren(), 1);
                assert.equal(node.children[0].debugName, 'parent');
                assert.equal(parent.parent.debugName, 'node');
                assert.equal(parent.numChildren(), 4);
                parent.children.forEach(function (c) {
                    assert.equal(c.numChildren(), 0);
                    assert.equal(c.parent.debugName, 'parent');
                });
                assert.equal(child1.debugName, 'child1');
                assert.equal(child2.debugName, 'child2');
                assert.equal(parentChild1.debugName, 'parentChild1');
                assert.equal(parentChild2.debugName, 'parentChild2');
            });
        });
        describe('remove', function () {
            it('should remove node from dataflow', function () {
                var a = new DataFlowNode(null, 'a');
                var b = new DataFlowNode(a, 'b');
                var c = new DataFlowNode(b, 'c');
                expect(a.children).toEqual([b]);
                assert.equal(b.parent, a);
                assert.equal(c.parent, b);
                b.remove();
                expect(a.children).toEqual([c]);
                assert.equal(c.parent, a);
            });
            it('should maintain order', function () {
                var root = new DataFlowNode(null, 'root');
                var rootChild1 = new DataFlowNode(root, 'rootChild1');
                var node = new DataFlowNode(root, 'node');
                var rootChild2 = new DataFlowNode(root, 'rootChild2');
                var child1 = new DataFlowNode(node, 'child1');
                var child2 = new DataFlowNode(node, 'child2');
                expect(root.children).toEqual([rootChild1, node, rootChild2]);
                assert.equal(rootChild1.parent, root);
                assert.equal(rootChild2.parent, root);
                assert.equal(node.parent, root);
                assert.equal(child1.parent, node);
                assert.equal(child2.parent, node);
                node.remove();
                expect(root.children).toEqual([rootChild1, child1, child2, rootChild2]);
                assert.equal(rootChild1.parent, root);
                assert.equal(rootChild2.parent, root);
                assert.equal(child1.parent, root);
                assert.equal(child2.parent, root);
            });
        });
        describe('insertAsParentOf', function () {
            it('should insert node into dataflow', function () {
                var a = new DataFlowNode(null, 'a');
                var anotherChild = new DataFlowNode(a, 'a');
                var b = new DataFlowNode(null, 'b');
                var c = new DataFlowNode(a, 'c');
                b.insertAsParentOf(c);
                assert.sameDeepMembers(a.children, [anotherChild, b]);
                assert.equal(b.parent, a);
                assert.equal(c.parent, b);
                assert.equal(anotherChild.parent, a);
            });
        });
    });
});
//# sourceMappingURL=dataflow.test.js.map