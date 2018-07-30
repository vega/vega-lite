/* tslint:disable:quotemark */
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ImputeNode} from '../../../src/compile/data/impute';
import {MergeIdenticalNodes} from '../../../src/compile/data/optimizers';
import {Transform} from '../../../src/transform';
import {FilterNode} from './../../../src/compile/data/filter';

describe('compile/data/optimizer', () => {
  describe('mergeIdenticalNodes', () => {
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
      const optimizer = new MergeIdenticalNodes();
      optimizer.optimize(root);
      expect(root.children).toHaveLength(1);
      expect(root.children[0]).toEqual(transform1);
    });

    it('should merge only the children that have the same transform', () => {
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
      const transform3 = new FilterNode(root, null, 'datum.x > 2');
      // @ts-ignore
      const transform4 = new FilterNode(root, null, 'datum.x > 2');
      const optimizer = new MergeIdenticalNodes();
      optimizer.optimize(root);
      expect(root.children).toHaveLength(2);
      expect(root.children).toEqual([transform1, transform3]);
    });
  });

  describe('mergeNodes', () => {
    it('should merge nodes correctly', () => {
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
      const optimizer = new MergeIdenticalNodes();
      optimizer.mergeNodes(parent, [a, b]);

      expect(parent.children).toHaveLength(1);
      expect(a.children).toHaveLength(4);

      expect(a1.parent).toBe(a);
      expect(a2.parent).toBe(a);
      expect(b1.parent).toBe(a);
      expect(b2.parent).toBe(a);
    });
  });
});
