/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';

describe('compile/data/dataflow', () => {
  describe('DataFlowNode', () => {
    describe('swap', () => {
      it('should correctly swap two nodes in a simple chain', () => {
        const a = new DataFlowNode(null, 'a');
        const b = new DataFlowNode(a, 'b');

        const c = new DataFlowNode(b, 'c');

        const d = new DataFlowNode(c, 'd');

        c.swapWithParent();

        assert.equal(a.numChildren(), 1);
        assert.equal(a.children[0].debugName, 'c');

        assert.equal(b.numChildren(), 1);
        assert.equal(b.children[0].debugName, 'd');

        assert.equal(c.numChildren(), 1);
        assert.equal(c.children[0].debugName, 'b');

        assert.equal(d.numChildren(), 0);
      });

      it('should correctly swap two nodes', () => {
        const root = new DataFlowNode(null, 'root');
        const parent = new DataFlowNode(root, 'parent');

        const node = new DataFlowNode(parent, 'node');

        const child1 = new DataFlowNode(node, 'child1');
        const child2 = new DataFlowNode(node, 'child2');

        const parentChild1 = new DataFlowNode(parent, 'parentChild1');
        const parentChild2 = new DataFlowNode(parent, 'parentChild2');

        node.swapWithParent();

        assert.equal(root.numChildren(), 1);
        assert.equal(root.children[0].debugName, 'node');
        assert.equal(node.parent.debugName, 'root');

        assert.equal(node.numChildren(), 1);
        assert.equal(node.children[0].debugName, 'parent');
        assert.equal(parent.parent.debugName, 'node');

        assert.equal(parent.numChildren(), 4);
        parent.children.forEach(c => {
          assert.equal(c.numChildren(), 0);
          assert.equal(c.parent.debugName, 'parent');
        });

        assert.equal(child1.debugName, 'child1');
        assert.equal(child2.debugName, 'child2');
        assert.equal(parentChild1.debugName, 'parentChild1');
        assert.equal(parentChild2.debugName, 'parentChild2');
      });
    });

    describe('remove', () => {
      it('should remove node from dataflow', () => {
        const a = new DataFlowNode(null, 'a');
        const b = new DataFlowNode(a, 'b');

        const c = new DataFlowNode(b, 'c');

        expect(a.children).toEqual([b]);
        assert.equal(b.parent, a);
        assert.equal(c.parent, b);

        b.remove();

        expect(a.children).toEqual([c]);
        assert.equal(c.parent, a);
      });

      it('should maintain order', () => {
        const root = new DataFlowNode(null, 'root');

        const rootChild1 = new DataFlowNode(root, 'rootChild1');
        const node = new DataFlowNode(root, 'node');
        const rootChild2 = new DataFlowNode(root, 'rootChild2');

        const child1 = new DataFlowNode(node, 'child1');
        const child2 = new DataFlowNode(node, 'child2');

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

    describe('insertAsParentOf', () => {
      it('should insert node into dataflow', () => {
        const a = new DataFlowNode(null, 'a');
        const anotherChild = new DataFlowNode(a, 'a');
        const b = new DataFlowNode(null, 'b');
        const c = new DataFlowNode(a, 'c');

        b.insertAsParentOf(c);

        assert.sameDeepMembers(a.children, [anotherChild, b]);
        assert.equal(b.parent, a);
        assert.equal(c.parent, b);
        assert.equal(anotherChild.parent, a);
      });
    });
  });
});
