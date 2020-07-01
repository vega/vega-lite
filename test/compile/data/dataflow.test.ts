import {OutputNode} from '../../../src/compile/data/dataflow';
import {DataSourceType} from '../../../src/data';
import * as log from '../../../src/log';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/dataflow', () => {
  describe('DataFlowNode', () => {
    describe('swap', () => {
      it('should correctly swap two nodes in a simple chain', () => {
        const a = new PlaceholderDataFlowNode(null, 'a');
        const b = new PlaceholderDataFlowNode(a, 'b');

        const c = new PlaceholderDataFlowNode(b, 'c');

        const d = new PlaceholderDataFlowNode(c, 'd');

        c.swapWithParent();

        expect(a.numChildren()).toBe(1);
        expect(a.children[0].debugName).toBe('c');

        expect(b.numChildren()).toBe(1);
        expect(b.children[0].debugName).toBe('d');

        expect(c.numChildren()).toBe(1);
        expect(c.children[0].debugName).toBe('b');

        expect(d.numChildren()).toBe(0);
      });

      it('should correctly swap two nodes', () => {
        const root = new PlaceholderDataFlowNode(null, 'root');
        const parent = new PlaceholderDataFlowNode(root, 'parent');

        const node = new PlaceholderDataFlowNode(parent, 'node');

        const child1 = new PlaceholderDataFlowNode(node, 'child1');
        const child2 = new PlaceholderDataFlowNode(node, 'child2');

        const parentChild1 = new PlaceholderDataFlowNode(parent, 'parentChild1');
        const parentChild2 = new PlaceholderDataFlowNode(parent, 'parentChild2');

        node.swapWithParent();

        expect(root.numChildren()).toBe(1);
        expect(root.children[0].debugName).toBe('node');
        expect(node.parent.debugName).toBe('root');

        expect(node.numChildren()).toBe(1);
        expect(node.children[0].debugName).toBe('parent');
        expect(parent.parent.debugName).toBe('node');

        expect(parent.numChildren()).toBe(4);
        for (const c of parent.children) {
          expect(c.numChildren()).toBe(0);
          expect(c.parent.debugName).toBe('parent');
        }

        expect(child1.debugName).toBe('child1');
        expect(child2.debugName).toBe('child2');
        expect(parentChild1.debugName).toBe('parentChild1');
        expect(parentChild2.debugName).toBe('parentChild2');
      });
    });

    describe('remove', () => {
      it('should remove node from dataflow', () => {
        const a = new PlaceholderDataFlowNode(null, 'a');
        const b = new PlaceholderDataFlowNode(a, 'b');

        const c = new PlaceholderDataFlowNode(b, 'c');

        expect(a.children).toEqual([b]);
        expect(b.parent).toBe(a);
        expect(c.parent).toBe(b);

        b.remove();

        expect(a.children).toEqual([c]);
        expect(c.parent).toBe(a);
      });

      it('should maintain order', () => {
        const root = new PlaceholderDataFlowNode(null, 'root');

        const rootChild1 = new PlaceholderDataFlowNode(root, 'rootChild1');
        const node = new PlaceholderDataFlowNode(root, 'node');
        const rootChild2 = new PlaceholderDataFlowNode(root, 'rootChild2');

        const child1 = new PlaceholderDataFlowNode(node, 'child1');
        const child2 = new PlaceholderDataFlowNode(node, 'child2');

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

    describe('insertAsParentOf', () => {
      it('should insert node into dataflow', () => {
        const a = new PlaceholderDataFlowNode(null, 'a');
        const anotherChild = new PlaceholderDataFlowNode(a, 'a');
        const b = new PlaceholderDataFlowNode(null, 'b');
        const c = new PlaceholderDataFlowNode(a, 'c');

        b.insertAsParentOf(c);

        expect(a.children).toEqual(expect.arrayContaining([anotherChild, b]));
        expect(b.parent).toBe(a);
        expect(c.parent).toBe(b);
        expect(anotherChild.parent).toBe(a);
      });
    });

    describe('addChild', () => {
      it('should add child to node', () => {
        const a = new PlaceholderDataFlowNode(null, 'a');
        const b = new PlaceholderDataFlowNode(null, 'b');

        a.addChild(b);

        expect(b.parent).toBeNull();
        expect(a.children).toEqual([b]);
      });

      it(
        'should not add the same child twice',
        log.wrap(localWrapper => {
          const a = new PlaceholderDataFlowNode(null, 'a');
          const b = new PlaceholderDataFlowNode(null, 'b');

          a.addChild(b);
          a.addChild(b);

          expect(b.parent).toBeNull();
          expect(a.children).toEqual([b]);
          expect(localWrapper.warns[0]).toEqual(log.message.ADD_SAME_CHILD_TWICE);
        })
      );
    });

    describe('clone', () => {
      it('should not work', () => {
        const a = new PlaceholderDataFlowNode(null, 'a');

        expect(a.clone).toThrow();
      });
    });
  });

  describe('OutputNode', () => {
    describe('dependentFields', () => {
      it('should return empty set', () => {
        const flatten = new OutputNode(null, 'src', DataSourceType.Main, {});
        expect(flatten.dependentFields()).toEqual(new Set());
      });
    });

    describe('producedFields', () => {
      it('should return empty set', () => {
        const flatten = new OutputNode(null, 'src', DataSourceType.Main, {});
        expect(flatten.producedFields()).toEqual(new Set());
      });
    });
  });
});
