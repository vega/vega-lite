/* tslint:disable:quotemark */

import {assert} from 'chai';

import {DataComponent} from '../../../src/compile/data/data';
import {summary} from '../../../src/compile/data/summary';
import {Model} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

describe('compile/data/summary', function () {
  const identity = {
    dataName(data: any) {
      return 'source';
    }
  } as Model;

  describe('unit (aggregated)', function() {
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

    it('should produce the correct summary component' ,function() {
      assert.deepEqual(model.component.data.summary, [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true},
        measures: {'*':{count: true}, Acceleration: {sum: true}}
      }]);
    });

    it('should assemble the correct aggregate transform', function() {
      const summaryData = summary.assemble(model.component.data, identity)[0];
      assert.deepEqual(summaryData, {
        'name': "summary",
        'source': 'source',
        'transform': [{
          'type': 'aggregate',
          'groupby': ['Origin'],
          'summarize': {
            '*': ['count'],
            'Acceleration': ['sum']
          }
        }]
      });
    });
  });

  describe('unit (aggregated with detail arrays)', function() {
    const model = parseUnitModel({
      mark: "point",
      encoding: {
        'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative"},
        'detail': [
          {'field': 'Origin', 'type': "ordinal"},
          {'field': 'Cylinders', 'type': "quantitative"}
        ]
      }
    });

    it('should produce the correct summary component', function() {
      model.component.data = {} as DataComponent;
      model.component.data.summary = summary.parseUnit(model);
      assert.deepEqual(model.component.data.summary, [{
        name: 'summary',
        // source will be added in assemble step
        dimensions: {Origin: true, Cylinders: true},
        measures: {Displacement: {mean: true}}
      }]);
    });

    it('should assemble the correct summary data', function() {
      const summaryData = summary.assemble(model.component.data, identity)[0];
      assert.deepEqual(summaryData, {
        'name': "summary",
        'source': 'source',
        'transform': [{
          'type': 'aggregate',
          'groupby': ['Origin', 'Cylinders'],
          'summarize': {
            'Displacement': ['mean']
          }
        }]
      });
    });
  });
});
