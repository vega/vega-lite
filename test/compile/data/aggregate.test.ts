/* tslint:disable:quotemark */

import {assert} from 'chai';

import {AggregateNode} from '../../../src/compile/data/aggregate';
import {StringSet} from '../../../src/util';
import {VgAggregateTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/summary', function () {
  describe('clone', function() {
    it('should have correct type', function() {
      const agg = new AggregateNode({}, {});
      assert(agg instanceof AggregateNode);
      const clone = agg.clone();
      assert(clone instanceof AggregateNode);
    });

    it('should have make a deep copy', function() {
      const agg = new AggregateNode({foo: true}, {});
      const clone = agg.clone();
      clone.addDimensions(['bar']);
      assert.deepEqual<StringSet>(clone.dependentFields(), {'foo': true, 'bar': true});
      assert.deepEqual<StringSet>(agg.dependentFields(), {'foo': true});
    });
  });

  describe('parseUnit', function() {
    it('should produce the correct summary component for sum(Acceleration) and count(*)' , () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          'y': {
            'aggregate': 'sum',
            'field': 'Acceleration',
            'type': "quantitative"
          },
          'x': {
            'field': 'Origin',
            'type': "ordinal"
          },
          color: {field: '*', type: "quantitative", aggregate: 'count'}
        }
      });

      const agg = AggregateNode.make(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: ['Origin'],
        ops: ['sum', 'count'],
        fields: ['Acceleration', '*']
      });
    });

    it('should produce the correct summary component for aggregated plot with detail arrays', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          'x': {'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative"},
          'detail': [
            {'field': 'Origin', 'type': "ordinal"},
            {'field': 'Cylinders', 'type': "quantitative"}
          ]
        }
      });

      const agg = AggregateNode.make(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: ['Origin', 'Cylinders'],
        ops: ['mean'],
        fields: ['Displacement']
      });
    });

    it('should add min and max if needed for unaggregated scale domain', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          'x': {'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative", scale: {domain: 'unaggregated'}},
        }
      });

      const agg = AggregateNode.make(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: [],
        ops: ['mean', 'min', 'max'],
        fields: ['Displacement', 'Displacement', 'Displacement']
      });
    });

    it('should add correct dimensions when binning', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          'x': {'bin': true, 'field': 'Displacement', 'type': "quantitative"},
          'y': {'bin': true, 'field': 'Acceleration', 'type': "ordinal"},
          'color': {'aggregate': 'count', 'type': "quantitative"}
        }
      });

      const agg = AggregateNode.make(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: [
          'bin_maxbins_10_Displacement_start',
          'bin_maxbins_10_Displacement_end',
          'bin_maxbins_10_Acceleration_start',
          'bin_maxbins_10_Acceleration_end',
          'bin_maxbins_10_Acceleration_range'
        ],
        ops: ['count'],
        fields: ['*']
      });
    });
  });
});
