/* tslint:disable:quotemark */

import {assert} from 'chai';
import {compileData, source, summary, dates} from '../../src/compile/data';
import {parseModel} from '../util';
import {mergeDeep} from '../../src/schema/schemautil';

describe('Data', function () {
  describe('for aggregate encoding', function () {
    it('should contain two tables', function() {
      const model = parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "temporal"},
            y: {field: 'b', type: "quantitative", scale: {type: 'log'}, aggregate: 'sum'}
          }
        });

      const data = compileData(model);
      assert.equal(data.length, 2);
    });
  });

  describe('when contains log in non-aggregate', function () {
    const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal"},
          y: {field: 'b', type: "quantitative", scale: {type: 'log'}}
        }
      });

    const data = compileData(model);
    it('should contains one table', function() {
      assert.equal(data.length, 1);
    });
    it('should have filter non-positive in source', function() {
      const sourceTransform = data[0].transform;
      assert.deepEqual(sourceTransform[sourceTransform.length - 1], {
        type: 'filter',
        test: 'datum.b > 0'
      });
    });
  });
});

describe('data.source', function() {
  describe('with explicit values', function() {
    const model = parseModel({
      data: {
        values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
      }
    });

    const sourceDef = source.def(model);

    it('should have values', function() {
      assert.equal(sourceDef.name, 'source');
      assert.deepEqual(sourceDef.values, [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
    });

    it('should have source.format', function(){
      assert.deepEqual(sourceDef.format, {type: 'json'});
    });
  });

  describe('with link to url', function() {
    const model = parseModel({
        data: {
          url: 'http://foo.bar'
        }
      });

    const sourceDef = source.def(model);

    it('should have format json', function() {
      assert.equal(sourceDef.name, 'source');
      assert.equal(sourceDef.format.type, 'json');
    });
    it('should have correct url', function() {
      assert.equal(sourceDef.url, 'http://foo.bar');
    });
  });

  describe('formatParse', function () {
    it('should include parse for all applicable fields, and exclude calculated fields', function() {
      const model = parseModel({
          data: {
            calculate: [
              {field: 'b2', expr: 'datum.b * 2'}
            ]
          },
          mark: "point",
          encoding: {
            x: {field: 'a', type: "temporal"},
            y: {field: 'b', type: "quantitative"},
            color: {field: '*', type: "quantitative", aggregate: 'count'}
          }
        });

      const sourceDef = source.def(model);
      assert.deepEqual(sourceDef.format.parse, {
        'a': 'date',
        'b': 'number'
      });
    });
  });

  describe('transform', function () {
    describe('bin', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          y: {
            bin: { min: 0, max: 100 },
            'field': 'Acceleration',
            'type': "quantitative"
          }
        }
      });
      it('should add bin transform and correctly apply bin', function() {
        const transform = source.binTransform(model);

        assert.deepEqual(transform[0], {
          type: 'bin',
          field: 'Acceleration',
          output: {
            start: 'bin_Acceleration_start',
            mid: 'bin_Acceleration_mid',
            end: 'bin_Acceleration_end'
          },
          maxbins: 10,
          min: 0,
          max: 100
        });
      });
    });

    describe('nullFilter', function() {
      const spec = {
          mark: "point",
          encoding: {
            y: {field: 'qq', type: "quantitative"},
            x: {field: 'tt', type: "temporal"},
            color: {field: 'oo', type: "ordinal"}
          }
        };

      it('should add filterNull for Q and T by default', function () {
        const model = parseModel(spec);
        assert.deepEqual(source.nullFilterTransform(model), [{
          type: 'filter',
          test: 'datum.tt!==null && datum.qq!==null'
        }]);
      });

      it('should add filterNull for O when specified', function () {
        const model = parseModel(mergeDeep(spec, {
          config: {
            filterNull: true
          }
        }));
        assert.deepEqual(source.nullFilterTransform(model), [{
          type: 'filter',
          test:'datum.tt!==null && datum.qq!==null && datum.oo!==null'
        }]);
      });

      it('should add no null filter if filterNull is false', function () {
        const model = parseModel(mergeDeep(spec, {
          config: {
            filterNull: false
          }
        }));
        assert.deepEqual(source.nullFilterTransform(model), []);
      });
    });

    describe('filter', function () {
      const model = parseModel({
        data: {
          filter: 'datum.a > datum.b && datum.c === datum.d'
        }
      });
      it('should return array that contains a filter transform', function () {
        assert.deepEqual(source.filterTransform(model), [{
          type: 'filter',
          test: 'datum.a > datum.b && datum.c === datum.d'
        }]);
      });
    });

    describe('time', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal", timeUnit: 'year'}
        }
      });
      it('should add formula transform', function() {
        const transform = source.timeTransform(model);
        assert.deepEqual(transform[0], {
          type: 'formula',
          field: 'year_a',
          expr: 'datetime(year(datum.a), 0, 1, 0, 0, 0, 0)'
        });
      });
    });

    it('should have correct order of transforms (null filter, timeUnit, bin then filter)', function () {
      const model = parseModel({
        data: {
          filter: 'datum.a > datum.b && datum.c === datum.d'
        },
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal", timeUnit: 'year'},
          y: {
            bin: {
              min: 0,
              max: 100
            },
            'field': 'Acceleration',
            'type': "quantitative"
          }
        }
      });
      const transform = source.transform(model);
      assert.deepEqual(transform[0].type, 'filter');
      assert.deepEqual(transform[1].type, 'formula');
      assert.deepEqual(transform[2].type, 'bin');
      assert.deepEqual(transform[3].type, 'filter');
    });

  });
});

describe('data.dates', function() {
  it('should add data source with raw domain data', function() {
    const model = parseModel({
        mark: "point",
        encoding: {
          'y': {
            'aggregate': 'sum',
            'field': 'Acceleration',
            'type': "quantitative"
          },
          'x': {
            'field': 'date',
            'type': "temporal",
            'timeUnit': 'day'
          }
        }
      });

    const defs = dates.defs(model);

    assert.deepEqual(defs, [{
      name: 'day',
      transform: [
        {
          expr: 'datetime(2006, 0, datum.data+1, 0, 0, 0, 0)',
          field: 'date',
          type: 'formula'
        }
      ],
      values: [0,1,2,3,4,5,6]
    }]);
  });
});

describe('data.summary', function () {
  it('should return correct aggregation', function() {
    const model = parseModel({
        mark: "point",
        encoding: {
          'y': {
            'aggregate': 'sum',
            'field': 'Acceleration',
            'type': "quantitative"
          },
          'x': {
            'field': 'origin',
            'type': "ordinal"
          },
          color: {field: '*', type: "quantitative", aggregate: 'count'}
        }
      });

    const aggregated = summary.def(model);
    assert.deepEqual(aggregated, {
      'name': "summary",
      'source': 'source',
      'transform': [{
        'type': 'aggregate',
        'groupby': ['origin'],
        'summarize': {
          '*': ['count'],
          'Acceleration': ['sum']
        }
      }]
    });
  });

  it('should return correct aggregation for detail arrays', function() {
    const model = parseModel({
        mark: "point",
        encoding: {
          'y': {
            'aggregate': 'mean',
            'field': 'Acceleration',
            'type': "quantitative"
          },
          'x': {
            'aggregate': 'mean',
            'field': 'Displacement',
            'type': "quantitative"
          },
          'detail': [{
            'field': 'Origin',
            'type': "ordinal"
          },{
            'field': 'Cylinders',
            'type': "quantitative"
          }]
        }
      });

    const aggregated = summary.def(model);
    assert.deepEqual(aggregated, {
      'name': "summary",
      'source': 'source',
      'transform': [{
        'type': 'aggregate',
        'groupby': ['Origin', 'Cylinders'],
        'summarize': {
          'Displacement': ['mean'],
          'Acceleration': ['mean']
        }
      }]
    });
  });
});
