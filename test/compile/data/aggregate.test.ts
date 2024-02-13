import {AggregateNode} from '../../../src/compile/data/aggregate';
import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX} from '../../../src/compile/data/timeunit';
import {AggregateTransform} from '../../../src/transform';
import {internalField} from '../../../src/util';
import {parseUnitModel} from '../../util';
import {PlaceholderDataFlowNode} from './util';

describe('compile/data/aggregate', () => {
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
      const parent = new PlaceholderDataFlowNode(null);
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
      expect(agg.hash()).toBe(
        `Aggregate {"dimensions":"Set(\\"Origin\\")","measures":{"*":{"count":{"aliases":"Set(\\"${internalField(
          'count'
        )}\\")"}},"Acceleration":{"sum":{"aliases":"Set(\\"sum_Acceleration\\")"}}}}`
      );
    });
  });

  describe('makeFromEncoding', () => {
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
        fields: ['Acceleration', null],
        as: ['sum_Acceleration', internalField('count')]
      });
    });

    it('should produce the correct summary component for timeBinWithOffset', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'Acceleration',
            type: 'quantitative'
          },
          x: {
            timeUnit: 'yearmonth',
            field: 'date',
            type: 'temporal',
            bandPosition: 0
          }
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: [
          'yearmonth_date',
          'yearmonth_date_end',
          `yearmonth_date_${OFFSETTED_RECT_START_SUFFIX}`,
          `yearmonth_date_${OFFSETTED_RECT_END_SUFFIX}`
        ],
        ops: ['sum'],
        fields: ['Acceleration'],
        as: ['sum_Acceleration']
      });
    });

    it('should produce the correct aggregate component for maps', () => {
      const model = parseUnitModel({
        mark: 'rule',
        encoding: {
          latitude: {field: 'latitude', type: 'quantitative'},
          longitude: {field: 'longitude', type: 'quantitative'},
          latitude2: {field: 'latitude2'},
          longitude2: {field: 'longitude2'},
          color: {
            aggregate: 'count',
            type: 'quantitative'
          }
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['x', 'x2', 'y', 'y2'],
        ops: ['count'],
        fields: [null],
        as: [internalField('count')]
      });
    });

    it('should produce the correct summary component for aggregated plot with detail arrays', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: 'mean', field: 'Displacement', type: 'quantitative'},
          detail: [
            {field: 'Origin', type: 'ordinal'},
            {field: 'Cylinders', type: 'quantitative'}
          ]
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
            condition: {param: 'a', field: 'Origin', type: 'ordinal'},
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
        fields: [null],
        as: [internalField('count')]
      });
    });

    it('should add correct dimension when field is in scale range', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {timeUnit: 'year', field: 'date'},
          y: {aggregate: 'mean', field: 'Displacement', type: 'quantitative'},
          color: {field: 'symbol', type: 'nominal', scale: {range: {field: 'color'}}}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['year_date', 'symbol', 'color'],
        ops: ['mean'],
        fields: ['Displacement'],
        as: ['mean_Displacement']
      });
    });

    it('adds correct measure for argmin/max', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: {argmin: 'a'}, field: 'b', type: 'quantitative'},
          y: {aggregate: {argmax: 'c'}, field: 'd', type: 'quantitative'}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: [],
        ops: ['argmin', 'argmax'],
        fields: ['a', 'c'],
        as: ['argmin_a', 'argmax_c']
      });
    });

    it('should produce the correct summary component for exponential', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {aggregate: {exponential: 0.25}, field: 'Displacement', type: 'quantitative'},
          y: {aggregate: 'sum', field: 'Acceleration', type: 'quantitative'}
        }
      });

      const agg = AggregateNode.makeFromEncoding(null, model);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: [],
        ops: ['exponential', 'sum'],
        fields: ['Displacement', 'Acceleration'],
        as: ['exponential_Displacement', 'sum_Acceleration'],
        aggregate_params: [0.25, null]
      });
    });
  });

  describe('makeFromTransform', () => {
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

    it('should produce the correct summary component from transform array with exponential', () => {
      const t: AggregateTransform = {
        aggregate: [
          {op: 'sum', field: 'Acceleration', as: 'Acceleration_sum'},
          {op: {exponential: 0.3}, field: 'Displacement', as: 'Displacement_exponential'}
        ],
        groupby: ['Group']
      };

      const agg = AggregateNode.makeFromTransform(null, t);
      expect(agg.assemble()).toEqual({
        type: 'aggregate',
        groupby: ['Group'],
        ops: ['sum', 'exponential'],
        fields: ['Acceleration', 'Displacement'],
        as: ['Acceleration_sum', 'Displacement_exponential'],
        aggregate_params: [null, 0.3]
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
      expect(agg.producedFields()).toEqual(new Set(['AvgDisplacement', 'Acceleration_sum']));
    });
  });

  describe('merge', () => {
    it('should not merge AggregateNodes with different dimensions', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const agg1 = new AggregateNode(parent, new Set(['a', 'b']), {});
      const agg2 = new AggregateNode(parent, new Set(['a']), {});

      expect(agg1.merge(agg2)).toBe(false);
    });
    it('should merge AggregateNodes with same dimensions', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const agg1 = new AggregateNode(parent, new Set(['a', 'b']), {a: {mean: {aliases: new Set(['a_mean'])}}});
      const agg2 = new AggregateNode(parent, new Set(['a', 'b']), {b: {mean: {aliases: new Set(['b_mean'])}}});

      expect(agg1.merge(agg2)).toBe(true);
      expect(agg1.producedFields()).toEqual(new Set(['a_mean', 'b_mean']));
    });
    it('should merge AggregateNodes without losing aggregateParam', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const agg1 = new AggregateNode(parent, new Set(['a', 'b']), {
        a: {sum: {aliases: new Set(['a_sum'])}}
      });
      const agg2 = new AggregateNode(parent, new Set(['a', 'b']), {
        b: {exponential: {aliases: new Set(['b_exponential']), aggregateParam: 0.5}}
      });

      expect(agg1.merge(agg2)).toBe(true);
      expect(agg1.assemble()).toEqual({
        ops: ['sum', 'exponential'],
        type: 'aggregate',
        as: ['a_sum', 'b_exponential'],
        fields: ['a', 'b'],
        groupby: ['a', 'b'],
        aggregate_params: [null, 0.5]
      });
    });
  });

  describe('assemble()', () => {
    it('should escape nested accesses', () => {
      const agg = new AggregateNode(null, new Set(['foo.bar']), {
        'foo.baz': {mean: {aliases: new Set(['foo_baz_mean'])}}
      });
      expect(agg.assemble()).toEqual({
        as: ['foo_baz_mean'],
        fields: ['foo\\.baz'],
        groupby: ['foo\\.bar'],
        ops: ['mean'],
        type: 'aggregate'
      });
    });
  });
});
