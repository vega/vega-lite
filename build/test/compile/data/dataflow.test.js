/* tslint:disable:quotemark */
import { DataFlowNode } from '../../../src/compile/data/dataflow';
describe('compile/data/dataflow', function () {
    describe('swap', function () {
        it('should correctly swap two nodes in a simple chain', function () {
            var a = new DataFlowNode(null, 'a');
            var b = new DataFlowNode(a, 'b');
            var c = new DataFlowNode(b, 'c');
            var d = new DataFlowNode(c, 'd');
            c.swapWithParent();
            expect(a.numChildren()).toBe(1);
            expect(a.children[0].debugName).toBe('c');
            expect(b.numChildren()).toBe(1);
            expect(b.children[0].debugName).toBe('d');
            expect(c.numChildren()).toBe(1);
            expect(c.children[0].debugName).toBe('b');
            expect(d.numChildren()).toBe(0);
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
            expect(root.numChildren()).toBe(1);
            expect(root.children[0].debugName).toBe('node');
            expect(node.parent.debugName).toBe('root');
            expect(node.numChildren()).toBe(1);
            expect(node.children[0].debugName).toBe('parent');
            expect(parent.parent.debugName).toBe('node');
            expect(parent.numChildren()).toBe(4);
            parent.children.forEach(function (c) {
                expect(c.numChildren()).toBe(0);
                expect(c.parent.debugName).toBe('parent');
            });
            expect(child1.debugName).toBe('child1');
            expect(child2.debugName).toBe('child2');
            expect(parentChild1.debugName).toBe('parentChild1');
            expect(parentChild2.debugName).toBe('parentChild2');
        });
    });
    describe('remove', function () {
        it('should remove node from dataflow', function () {
            var a = new DataFlowNode(null, 'a');
            var b = new DataFlowNode(a, 'b');
            var c = new DataFlowNode(b, 'c');
            expect(a.children).toEqual([b]);
            expect(b.parent).toBe(a);
            expect(c.parent).toBe(b);
            b.remove();
            expect(a.children).toEqual([c]);
            expect(c.parent).toBe(a);
        });
        it('should maintain order', function () {
            var root = new DataFlowNode(null, 'root');
            var rootChild1 = new DataFlowNode(root, 'rootChild1');
            var node = new DataFlowNode(root, 'node');
            var rootChild2 = new DataFlowNode(root, 'rootChild2');
            var child1 = new DataFlowNode(node, 'child1');
            var child2 = new DataFlowNode(node, 'child2');
            expect(root.children).toEqual([rootChild1, node, rootChild2]);
            expect(rootChild1.parent).toBe(root);
            expect(rootChild2.parent).toBe(root);
            expect(node.parent).toBe(root);
            expect(child1.parent).toBe(node);
            expect(child2.parent).toBe(node);
            node.remove();
            expect(root.children).toEqual([rootChild1, child1, child2, rootChild2]);
            expect(rootChild1.parent).toBe(root);
            expect(rootChild2.parent).toBe(root);
            expect(child1.parent).toBe(root);
            expect(child2.parent).toBe(root);
        });
    });
    describe('insertAsParentOf', function () {
        it('should insert node into dataflow', function () {
            var a = new DataFlowNode(null, 'a');
            var anotherChild = new DataFlowNode(a, 'a');
            var b = new DataFlowNode(null, 'b');
            var c = new DataFlowNode(a, 'c');
            b.insertAsParentOf(c);
            expect(a.children).toEqual(expect.arrayContaining([anotherChild, b]));
            expect(b.parent).toBe(a);
            expect(c.parent).toBe(b);
            expect(anotherChild.parent).toBe(a);
        });
    });
    describe('addChild', function () {
        it('should add child to node', function () {
            var a = new DataFlowNode(null, 'a');
            var b = new DataFlowNode(null, 'b');
            a.addChild(b);
            expect(b.parent).toBeNull();
            expect(a.children).toEqual([b]);
        });
        it('should not add the same child twice', function () {
            var a = new DataFlowNode(null, 'a');
            var b = new DataFlowNode(null, 'b');
            a.addChild(b);
            a.addChild(b);
            expect(b.parent).toBeNull();
            expect(a.children).toEqual([b]);
        });
    });
    describe('clone', function () {
        it('should not work', function () {
            var a = new DataFlowNode(null, 'a');
            expect(a.clone).toThrowError();
        });
    });
});
//# sourceMappingURL=dataflow.test.js.map