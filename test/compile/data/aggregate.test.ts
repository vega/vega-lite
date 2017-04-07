/* tslint:disable:quotemark */

import {assert} from 'chai';

import {AggregateNode} from '../../../src/compile/data/aggregate';
import {VgAggregateTransform} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/data/summary', function () {
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

      const agg = new AggregateNode(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: ['Origin'],
        ops: ['count', 'sum'],
        fields: ['*', 'Acceleration']
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

      const agg = new AggregateNode(model);
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

      const agg = new AggregateNode(model);
      assert.deepEqual<VgAggregateTransform>(agg.assemble(), {
        type: 'aggregate',
        groupby: [],
        ops: ['mean', 'min', 'max'],
        fields: ['Displacement', 'Displacement', 'Displacement']
      });
    });
  });
});
