import {DataFlowNode} from '../../../src/compile/data/dataflow';

describe('compile/data/dataflow', () => {
  describe('swap', () => {
    it('should correctly swap two nodes in a simple chain', () => {
      const a = new DataFlowNode(null, 'a');
      const b = new DataFlowNode(a, 'b');

      const c = new DataFlowNode(b, 'c');

      const d = new DataFlowNode(c, 'd');

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
      const root = new DataFlowNode(null, 'root');
      const parent = new DataFlowNode(root, 'parent');

      const node = new DataFlowNode(parent, 'node');

      const child1 = new DataFlowNode(node, 'child1');
      const child2 = new DataFlowNode(node, 'child2');

      const parentChild1 = new DataFlowNode(parent, 'parentChild1');
      const parentChild2 = new DataFlowNode(parent, 'parentChild2');

      node.swapWithParent();

      expect(root.numChildren()).toBe(1);
      expect(root.children[0].debugName).toBe('node');
      expect(node.parent.debugName).toBe('root');

      expect(node.numChildren()).toBe(1);
      expect(node.children[0].debugName).toBe('parent');
      expect(parent.parent.debugName).toBe('node');

      expect(parent.numChildren()).toBe(4);
      parent.children.forEach(c => {
        expect(c.numChildren()).toBe(0);
        expect(c.parent.debugName).toBe('parent');
      });

      expect(child1.debugName).toBe('child1');
      expect(child2.debugName).toBe('child2');
      expect(parentChild1.debugName).toBe('parentChild1');
      expect(parentChild2.debugName).toBe('parentChild2');
    });
  });

  describe('remove', () => {
    it('should remove node from dataflow', () => {
      const a = new DataFlowNode(null, 'a');
      const b = new DataFlowNode(a, 'b');

      const c = new DataFlowNode(b, 'c');

      expect(a.children).toEqual([b]);
      expect(b.parent).toBe(a);
      expect(c.parent).toBe(b);

      b.remove();

      expect(a.children).toEqual([c]);
      expect(c.parent).toBe(a);
    });

    it('should maintain order', () => {
      const root = new DataFlowNode(null, 'root');

      const rootChild1 = new DataFlowNode(root, 'rootChild1');
      const node = new DataFlowNode(root, 'node');
      const rootChild2 = new DataFlowNode(root, 'rootChild2');

      const child1 = new DataFlowNode(node, 'child1');
      const child2 = new DataFlowNode(node, 'child2');

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
      const a = new DataFlowNode(null, 'a');
      const anotherChild = new DataFlowNode(a, 'a');
      const b = new DataFlowNode(null, 'b');
      const c = new DataFlowNode(a, 'c');

      b.insertAsParentOf(c);

      expect(a.children).toEqual(expect.arrayContaining([anotherChild, b]));
      expect(b.parent).toBe(a);
      expect(c.parent).toBe(b);
      expect(anotherChild.parent).toBe(a);
    });
  });

  describe('addChild', () => {
    it('should add child to node', () => {
      const a = new DataFlowNode(null, 'a');
      const b = new DataFlowNode(null, 'b');

      a.addChild(b);

      expect(b.parent).toBeNull();
      expect(a.children).toEqual([b]);
    });

    it('should not add the same child twice', () => {
      const a = new DataFlowNode(null, 'a');
      const b = new DataFlowNode(null, 'b');

      a.addChild(b);
      a.addChild(b);

      expect(b.parent).toBeNull();
      expect(a.children).toEqual([b]);
    });
  });

  describe('clone', () => {
    it('should not work', () => {
      const a = new DataFlowNode(null, 'a');

      expect(a.clone).toThrowError();
    });
  });
});
