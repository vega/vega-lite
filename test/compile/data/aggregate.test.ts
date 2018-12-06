import {AggregateNode} from '../../../src/compile/data/aggregate';
import {AggregateTransform} from '../../../src/transform';
import {parseUnitModel} from '../../util';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

describe('compile/data/summary', () => {
  describe('clone', () => {
    it('should have correct type', () => {
      const agg = new AggregateNode(null, new Set(), {});
      expect(agg instanceof AggregateNode).toBeTruthy();
      const clone = agg.clone();
      expect(clone instanceof AggregateNode).toBeTruthy();
    });

    it('should have made a deep copy', () => {
      const agg = new AggregateNode(null, new Set(['foo']), {});
      const clone = agg.clone();
      clone.addDimensions(['bar']);
      expect(clone.dependentFields()).toEqual(new Set(['foo', 'bar']));
      expect(agg.dependentFields()).toEqual(new Set(['foo']));
    });

    it('should never clone parent', () => {
      const parent = new DataFlowNode(null);
      const aggregate = new AggregateNode(parent, new Set(), {});
      expect(aggregate.clone().parent).toBeNull();
    });
  });

  describe('hash', () => {
    it('should generate the correct hash', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'Acceleration',
            type: 'quantitative'
          },
          x: {
            field: 'Origin',
            type: 'ordinal'
          },
          color: {type: 'quantitative', aggregate: 'count'}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.hash()).toEqual(
        'Aggregate {"dimensions":{"Origin":true},"measures":{"*":{"count":{"count_*":true}},"Acceleration":{"sum":{"sum_Acceleration":true}}}}'
      );
    });
  });

  describe('parseUnit', () => {
    it('should produce the correct summary component for sum(Acceleration) and count(*)', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'Acceleration',
            type: 'quantitative'
          },
          x: {
            field: 'Origin',
            type: 'ordinal'
          },
          color: {type: 'quantitative', aggregate: 'count'}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Origin'],
        ops: ['sum', 'count'],
        fields: ['Acceleration', '*'],
        as: ['sum_Acceleration', 'count_*']
      });
    });

    it('should produce the correct summary component for aggregated plot with detail arrays', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'mean', field: 'Displacement', type: 'quantitative'},
          detail: [{field: 'Origin', type: 'ordinal'}, {field: 'Cylinders', type: 'quantitative'}]
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Origin', 'Cylinders'],
        ops: ['mean'],
        fields: ['Displacement'],
        as: ['mean_Displacement']
      });
    });

    it('should include conditional field in the summary component', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'mean', field: 'Displacement', type: 'quantitative'},
          color: {
            condition: {selection: 'a', field: 'Origin', type: 'ordinal'},
            value: 'red'
          }
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Origin'],
        ops: ['mean'],
        fields: ['Displacement'],
        as: ['mean_Displacement']
      });
    });

    it('should add min and max if needed for unaggregated scale domain', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'mean', field: 'Displacement', type: 'quantitative', scale: {domain: 'unaggregated'}}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: [],
        ops: ['mean', 'min', 'max'],
        fields: ['Displacement', 'Displacement', 'Displacement'],
        as: ['mean_Displacement', 'min_Displacement', 'max_Displacement']
      });
    });

    it('should add correct dimensions when binning', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {bin: true, field: 'Displacement', type: 'quantitative'},
          y: {bin: true, field: 'Acceleration', type: 'ordinal'},
          color: {aggregate: 'count', type: 'quantitative'}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: [
          'bin_maxbins_10_Displacement',
          'bin_maxbins_10_Displacement_end',
          'bin_maxbins_10_Acceleration',
          'bin_maxbins_10_Acceleration_end',
          'bin_maxbins_10_Acceleration_range'
        ],
        ops: ['count'],
        fields: ['*'],
        as: ['count_*']
      });
    });

    it('should produce the correct summary component from transform array', () => {
      const t: AggregateTransform = {
        aggregate: [
          {op: 'mean', field: 'Displacement', as: 'Displacement_mean'},
          {op: 'sum', field: 'Acceleration', as: 'Acceleration_sum'}
        ],
        groupby: ['Group']
      };

      const agg = AggregateNode.makeFromTransform(null, t);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Group'],
        ops: ['mean', 'sum'],
        fields: ['Displacement', 'Acceleration'],
        as: ['Displacement_mean', 'Acceleration_sum']
      });
    });

    it('should produce the correct summary component from transform array with different aggregrations for the same field', () => {
      const t: AggregateTransform = {
        aggregate: [
          {op: 'mean', field: 'Displacement', as: 'Displacement_mean'},
          {op: 'max', field: 'Displacement', as: 'Displacement_max'},
          {op: 'sum', field: 'Acceleration', as: 'Acceleration_sum'}
        ],
        groupby: ['Group']
      };

      const agg = AggregateNode.makeFromTransform(null, t);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Group'],
        ops: ['mean', 'max', 'sum'],
        fields: ['Displacement', 'Displacement', 'Acceleration'],
        as: ['Displacement_mean', 'Displacement_max', 'Acceleration_sum']
      });
    });
  });

  describe('producedFields', () => {
    it('should produce the correct fields', () => {
      const t: AggregateTransform = {
        aggregate: [
          {op: 'mean', field: 'Displacement', as: 'AvgDisplacement'},
          {op: 'sum', field: 'Acceleration', as: 'Acceleration_sum'}
        ],
        groupby: ['Group']
      };

      const agg = AggregateNode.makeFromTransform(null, t);
      expect(agg.producedFields()).toEqual({
        AvgDisplacement: true,
        Acceleration_sum: true
      });
    });
  });

  describe('merge', () => {
    it('should not merge AggregateNodes with different dimensions', () => {
      const parent = new DataFlowNode(null);
      const agg1 = new AggregateNode(parent, new Set(['a', 'b']), {});
      const agg2 = new AggregateNode(parent, new Set(['a']), {});

      expect(agg1.merge(agg2)).toBe(false);
    });
    it('should merge AggregateNodes with same dimensions', () => {
      const parent = new DataFlowNode(null);
      const agg1 = new AggregateNode(parent, new Set(['a', 'b']), {a: {mean: new Set(['a_mean'])}});
      const agg2 = new AggregateNode(parent, new Set(['a', 'b']), {b: {mean: new Set(['b_mean'])}});

      expect(agg1.merge(agg2)).toBe(true);
      expect(agg1.producedFields()).toEqual(new Set(['a_mean', 'b_mean']));
    });
  });
});
