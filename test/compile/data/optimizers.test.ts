/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ImputeNode} from '../../../src/compile/data/impute';
import {mergeChildren, mergeIdenticalTransforms} from '../../../src/compile/data/optimizers';
import {Transform} from '../../../src/transform';

describe('compile/data/optimizer', () => {
  describe('mergeIdenticalTransforms', () => {
    it('should merge two impute nodes with identical transforms', () => {
      const transform: Transform = {
        impute: 'y',
        key: 'x',
        method: 'value',
        value: 200
      };
      const root = new DataFlowNode(null, 'root');
      const transform1 = new ImputeNode(root, transform);
      // @ts-ignore
      const transform2 = new ImputeNode(root, transform);
      mergeIdenticalTransforms(root);
      assert.equal(root.children.length, 1);
      assert.deepEqual(root.children[0], transform1);
    });

    it('should not merge if only two children have the same transform', () => {
      const transform: Transform = {
        impute: 'y',
        key: 'x',
        method: 'value',
        value: 200
      };
      const root = new DataFlowNode(null, 'root');
      // @ts-ignore
      const transform1 = new ImputeNode(root, transform);
      // @ts-ignore
      const transform2 = new ImputeNode(root, transform);
      // @ts-ignore
      const transform3 = new ImputeNode(root, {filter: 'datum.x > 2'});

      mergeIdenticalTransforms(root);
      assert.equal(root.children.length, 3);
    });
  });

  describe('mergeChildren', () => {
    it('should merge children correctly', () => {
      const parent = new DataFlowNode(null, 'root');

      const a = new DataFlowNode(parent, 'a');
      const b = new DataFlowNode(parent, 'b');

      const a1 = new DataFlowNode(a, 'a1');
      const a2 = new DataFlowNode(a, 'a2');

      const b1 = new DataFlowNode(b, 'b1');
      const b2 = new DataFlowNode(b, 'b2');

      expect(parent.children).toHaveLength(2);
      expect(a.children).toHaveLength(2);
      expect(b.children).toHaveLength(2);

      mergeChildren(parent);

      expect(parent.children).toHaveLength(1);
      expect(a.children).toHaveLength(4);

      expect(a1.parent).toBe(a);
      expect(a2.parent).toBe(a);
      expect(b1.parent).toBe(a);
      expect(b2.parent).toBe(a);
    });
  });
});
