/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';

describe('compile/data/dataflow', function() {
  describe('DataFlowNode', function() {
    describe('swap', () => {
      it('should correctly swap two nodes in a simple chain', function() {
        const a = new DataFlowNode('a');
        const b = new DataFlowNode('b');
        b.parent = a;

        const c = new DataFlowNode('c');
        c.parent = b;

        const d = new DataFlowNode('d');
        d.parent = c;

        c.swapWithParent();

        assert.equal(a.numChildren(), 1);
        assert.equal(a.children[0].debugName, 'c');

        assert.equal(b.numChildren(), 1);
        assert.equal(b.children[0].debugName, 'd');

        assert.equal(c.numChildren(), 1);
        assert.equal(c.children[0].debugName, 'b');

        assert.equal(d.numChildren(), 0);
      });

      it('should correctly swap two nodes', function() {
        const root = new DataFlowNode('root');
        const parent = new DataFlowNode('parent');
        parent.parent = root;

        const node = new DataFlowNode('node');
        node.parent = parent;

        const child1 = new DataFlowNode('child1');
        child1.parent = node;

        const child2 = new DataFlowNode('child2');
        child2.parent = node;

        const parentChild1 = new DataFlowNode('parentChild1');
        parentChild1.parent = parent;

        const parentChild2 = new DataFlowNode('parentChild2');
        parentChild2.parent = parent;

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
      });
    });

    describe('remove', function() {
      it('should remove node from dataflow', function() {
        const a = new DataFlowNode('a');
        const b = new DataFlowNode('b');
        b.parent = a;

        const c = new DataFlowNode('c');
        c.parent = b;

        assert.deepEqual(a.children, [b]);
        assert.equal(b.parent, a);
        assert.equal(c.parent, b);

        b.remove();

        assert.deepEqual(a.children, [c]);
        assert.equal(c.parent, a);
      });
    });

    describe('insertAsParentOf', function() {
      it('should insert node into dataflow', function() {
        const a = new DataFlowNode('a');
        const anotherChild = new DataFlowNode('a');
        const b = new DataFlowNode('b');
        const c = new DataFlowNode('c');

        anotherChild.parent = a;
        c.parent = a;

        b.insertAsParentOf(c);

        assert.sameDeepMembers(a.children, [anotherChild, b]);
        assert.equal(b.parent, a);
        assert.equal(c.parent, b);
        assert.equal(anotherChild.parent, a);
      });
    });
  });
});
