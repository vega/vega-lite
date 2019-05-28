import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ImputeNode} from '../../../src/compile/data/impute';
import {optimizeDataflow} from '../../../src/compile/data/optimize';
import {MergeIdenticalNodes, MergeTimeUnits} from '../../../src/compile/data/optimizers';
import {Transform} from '../../../src/transform';
import {parseLayerModel} from '../../util';
import {FilterNode} from './../../../src/compile/data/filter';
import {TimeUnitNode, TimeUnitComponent} from '../../../src/compile/data/timeunit';
import {hash} from '../../../src/util';

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

  describe('MergeBins', () => {
    it('should rename signals when merging BinNodes', () => {
      const transform = {
        bin: {extent: [0, 100], anchor: 6},
        field: 'Acceleration',
        as: ['binned_acceleration_start', 'binned_acceleration_stop']
      };
      const model = parseLayerModel({
        layer: [
          {
            transform: [transform],
            mark: 'rect',
            encoding: {}
          },
          {
            transform: [transform],
            mark: 'rect',
            encoding: {}
          }
        ]
      });
      model.parse();
      optimizeDataflow(model.component.data, model);
      expect(model.getSignalName('layer_0_bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins')).toEqual(
        'layer_1_bin_extent_0_100_anchor_6_maxbins_10_Acceleration_bins'
      );
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
});
