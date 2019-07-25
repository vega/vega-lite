import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {ImputeNode} from '../../../src/compile/data/impute';
import {MergeIdenticalNodes, MergeParse, MergeTimeUnits} from '../../../src/compile/data/optimizers';
import {TimeUnitComponent, TimeUnitNode} from '../../../src/compile/data/timeunit';
import {Transform} from '../../../src/transform';
import {hash} from '../../../src/util';
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
      new ImputeNode(root, transform);

      const optimizer = new MergeIdenticalNodes();
      optimizer.run(root);

      expect(root.children).toHaveLength(1);
      expect(root.children[0]).toEqual(transform1);
      expect(optimizer.mutatedFlag).toEqual(true);
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

      new ImputeNode(root, transform);
      const transform3 = new FilterNode(root, null, 'datum.x > 2');

      new FilterNode(root, null, 'datum.x > 2');

      const optimizer = new MergeIdenticalNodes();
      optimizer.run(root);

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
      optimizer.setMutated();
      expect(optimizer.mutatedFlag).toEqual(true);
      expect(parent.children).toHaveLength(1);
      expect(a.children).toHaveLength(4);

      expect(a1.parent).toBe(a);
      expect(a2.parent).toBe(a);
      expect(b1.parent).toBe(a);
      expect(b2.parent).toBe(a);
    });
  });

  describe('MergeTimeUnits', () => {
    it('should merge adjacent time unit nodes', () => {
      const parent = new DataFlowNode(null, 'root');

      const c1: TimeUnitComponent = {
        as: 'a_yr',
        timeUnit: 'year',
        field: 'a'
      };
      const c2: TimeUnitComponent = {
        as: 'b_yr',
        timeUnit: 'year',
        field: 'b'
      };
      const c3: TimeUnitComponent = {
        as: 'c_yr',
        timeUnit: 'year',
        field: 'c'
      };

      new TimeUnitNode(parent, {[hash(c1)]: c1, [hash(c2)]: c2});
      new TimeUnitNode(parent, {[hash(c1)]: c1, [hash(c3)]: c3});

      const optimizer = new MergeTimeUnits();
      optimizer.run(parent.children[0]);

      expect(parent.children).toHaveLength(1);

      const mergedNode: TimeUnitNode = parent.children[0] as TimeUnitNode;
      expect(mergedNode.producedFields()).toEqual(new Set(['a_yr', 'b_yr', 'c_yr']));
      expect(mergedNode.dependentFields()).toEqual(new Set(['a', 'b', 'c']));

      expect(mergedNode.assemble()).toEqual([
        {as: 'a_yr', expr: 'datetime(year(datum["a"]), 0, 1, 0, 0, 0, 0)', type: 'formula'},
        {as: 'c_yr', expr: 'datetime(year(datum["c"]), 0, 1, 0, 0, 0, 0)', type: 'formula'},
        {as: 'b_yr', expr: 'datetime(year(datum["b"]), 0, 1, 0, 0, 0, 0)', type: 'formula'}
      ]);
    });
  });

  describe('MergeParse', () => {
    it('should merge non-conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      new ParseNode(root, {b: 'string', c: 'boolean'});

      const optimizer = new MergeParse();
      optimizer.run(parse1);

      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({a: 'number', b: 'string', c: 'boolean'});
    });

    it('should not merge conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      new ParseNode(root, {a: 'boolean', d: 'date'});
      new ParseNode(root, {a: 'boolean', b: 'string'});

      const optimizer = new MergeParse();
      optimizer.run(parse1);

      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({b: 'string', d: 'date'});
      const children = mergedParseNode.children as [ParseNode, ParseNode];
      expect(children[0].parse).toEqual({a: 'number'});
      expect(children[1].parse).toEqual({a: 'boolean'});
    });

    it('should merge when there is no parse node', () => {
      const root = new DataFlowNode(null, 'root');
      const parse = new ParseNode(root, {a: 'number', b: 'string'});
      const parseChild = new DataFlowNode(parse);
      const otherChild = new DataFlowNode(root);

      const optimizer = new MergeParse();
      optimizer.run(parse);

      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({a: 'number', b: 'string'});
      const children = mergedParseNode.children;
      expect(children).toHaveLength(2);
      expect(children[0]).toEqual(otherChild);
      expect(children[1]).toEqual(parseChild);
    });
  });
});
