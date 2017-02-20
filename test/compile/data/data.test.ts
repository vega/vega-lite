/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleData} from '../../../src/compile/data/data';
import {Model} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

function compileAssembleData(model: Model) {
  model.parseData();
  return assembleData(model, []);
}

describe('data', function () {
  describe('compileData & assembleData', function () {
    describe('for aggregate encoding', function () {
      it('should contain 2 tables', function() {
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              x: {field: 'a', type: "temporal"},
              y: {field: 'b', type: "quantitative", scale: {type: 'log'}, aggregate: 'sum'}
            }
          });

        const data = compileAssembleData(model);
        assert.equal(data.length, 2);
      });
    });

    describe('when contains log in non-aggregate', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal"},
          y: {field: 'b', type: "quantitative", scale: {type: 'log'}}
        }
      });

      const data = compileAssembleData(model);
      it('should contain 1 table', function() {
        assert.equal(data.length, 1);
      });
      it('should have filter non-positive in source', function() {
        const sourceTransform = data[0].transform;
        assert.deepEqual(sourceTransform[sourceTransform.length - 1], {
          type: 'filter',
          expr: 'datum["b"] > 0'
        });
      });
    });

    describe('stacked bar chart with binned dimension', () => {
      const model = parseUnitModel({
        "mark": "area",
        "encoding": {
          "x": {
            "bin": {"maxbins": 10},
            "field": "IMDB_Rating",
            "type": "quantitative"
          },
          "color": {
            "field": "Source",
            "type": "nominal"
          },
          "y": {
            "aggregate": "count",
            "type": "quantitative"
          }
        }
      });

      const data = compileAssembleData(model);
      it('should contains 3 tables', function() {
        assert.equal(data.length, 3);
      });

      it('should have collect transform as the last transform in stacked', function() {
        const stackedTransform = data[2].transform;
        assert.deepEqual(stackedTransform[stackedTransform.length - 1], {
          type: 'collect',
          sort: {
            "field": "bin_maxbins_10_IMDB_Rating_start",
            "order": "descending"
          }
        });
      });
    });
  });

  describe('assemble', function () {
    it('should have correct order of transforms (null filter, timeUnit, bin then filter)', function () {
      const model = parseUnitModel({
        transform: [{
            calculate: '2 * datum["b"]',
            as: 'b2'
          },
          {
            filter: 'datum["a"] > datum["b"] && datum["c"] === datum["d"]'
          }
        ],
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal", timeUnit: 'year'},
          y: {
            bin: {
              extent: [0, 100]
            },
            'field': 'Acceleration',
            'type': "quantitative"
          },
          size: {field: 'b2', type:'quantitative'}
        }
      });
      const transform = compileAssembleData(model)[0].transform;
      assert.deepEqual(transform[0].type, 'formula');
      assert.deepEqual(transform[1].type, 'filter');
      assert.deepEqual(transform[2].type, 'filter');
      assert.deepEqual(transform[3].type, 'bin');
      assert.deepEqual(transform[4].type, 'formula');
    });
  });
});


