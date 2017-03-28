/* tslint:disable:quotemark */

import {assert} from 'chai';

import {summary} from '../../../src/compile/data/aggregate';
import {DataComponent} from '../../../src/compile/data/data';
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

      model.component.data = {} as DataComponent;
      model.component.data.summary = summary.parseUnit(model);
      assert.deepEqual(model.component.data.summary, [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true},
        measures: {'*':{count: true}, Acceleration: {sum: true}}
      }]);
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
      model.component.data = {} as DataComponent;
      model.component.data.summary = summary.parseUnit(model);
      assert.deepEqual(model.component.data.summary, [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true, Cylinders: true},
        measures: {Displacement: {mean: true}}
      }]);
    });

    it('should add min and max if needed for unaggregated scale domain', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          'x': {'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative", scale: {domain: 'unaggregated'}},
        }
      });
      model.component.data = {} as DataComponent;
      model.component.data.summary = summary.parseUnit(model);
      assert.deepEqual(model.component.data.summary, [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {},
        measures: {Displacement: {mean: true, min: true, max: true}}
      }]);
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    it('should produce child\'s filter if child has no source and the facet has no filter', function() {
      // TODO: write
    });

    it('should produce child\'s filter and its own filter if child has no source and the facet has filter', function() {
      // TODO: write
    });
  });

  describe('assemble', function() {
    it('should assemble the correct summary data', function() {
      const summaryComponent = [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true},
        measures: {'*':{count: true}, Acceleration: {sum: true}}
      }];
      const aggregates = summary.assemble(summaryComponent);
      assert.deepEqual(aggregates, [{
        'type': 'aggregate',
        'groupby': ['Origin'],
        'fields': ['*', 'Acceleration'],
        'ops': ['count', 'sum']
      }]);
    });

    it('should assemble the correct summary data', function() {
      const summaryComponent = [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true, Cylinders: true},
        measures: {Displacement: {mean: true}}
      }];
      const aggregates = summary.assemble(summaryComponent);
      assert.deepEqual(aggregates, [{
        'type': 'aggregate',
        'groupby': ['Origin', 'Cylinders'],
        'fields': ['Displacement'],
        'ops': ['mean']
      }]);
    });
  });
});
