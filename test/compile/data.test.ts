/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleData} from '../../src/compile/data/data';
import {bin} from '../../src/compile/data/bin';
import {filter} from '../../src/compile/data/filter';
import {nullFilter} from '../../src/compile/data/nullfilter';
import {source} from '../../src/compile/data/source';
import {stackScale} from '../../src/compile/data/stackscale';
import {summary} from '../../src/compile/data/summary';
import {timeUnit} from '../../src/compile/data/timeunit';
import {timeUnitDomain} from '../../src/compile/data/timeunitdomain';
import {formatParse} from '../../src/compile/data/formatparse';
import {nonPositiveFilter} from '../../src/compile/data/nonpositivenullfilter';
import {DataComponent} from '../../src/compile/data/data';
import {Model} from '../../src/compile/model';
import {parseUnitModel} from '../util';
import {mergeDeep, vals} from '../../src/util';

function compileAssembleData(model) {
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
      it('should contains 1 table', function() {
        assert.equal(data.length, 1);
      });
      it('should have filter non-positive in source', function() {
        const sourceTransform = data[0].transform;
        assert.deepEqual(sourceTransform[sourceTransform.length - 1], {
          type: 'filter',
          test: 'datum["b"] > 0'
        });
      });
    });
  });

  describe('assemble', function () {
    it('should have correct order of transforms (null filter, timeUnit, bin then filter)', function () {
      const model = parseUnitModel({
        transform: {
          calculate: [{
            field: 'b2',
            expr: '2 * datum["b"]'
          }],
          filter: 'datum["a"] > datum["b"] && datum["c"] === datum["d"]'
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

describe('data: source', function() {
  describe('compileUnit', function() {
    describe('with explicit values', function() {
      const model = parseUnitModel({
        data: {
          values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
        }
      });

      const sourceComponent = source.parseUnit(model);

      it('should have values', function() {
        assert.equal(sourceComponent.name, 'source');
        assert.deepEqual(sourceComponent.values, [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
      });

      it('should have source.format.type', function(){
        assert.deepEqual(sourceComponent.format.type, 'json');
      });
    });

    describe('with link to url', function() {
      const model = parseUnitModel({
          data: {
            url: 'http://foo.bar',
          }
        });

      const sourceComponent = source.parseUnit(model);

      it('should have format.type json', function() {
        assert.equal(sourceComponent.name, 'source');
        assert.equal(sourceComponent.format.type, 'json');
      });
      it('should have correct url', function() {
        assert.equal(sourceComponent.url, 'http://foo.bar');
      });
    });

    describe('with no data specified', function() {
      const model = parseUnitModel({});
      const sourceComponent = source.parseUnit(model);
      it('should provide placeholder source data', function() {
        assert.deepEqual(sourceComponent, {name: 'source'});
      });
    });

    describe('data format', function() {
      describe('json', () => {
        it('should include property if specified', function() {
          const model = parseUnitModel({
            data: {
              url: 'http://foo.bar',
              format: {type: 'json', property: 'baz'}
            }
          });
          const sourceComponent = source.parseUnit(model);
          assert.equal(sourceComponent.format.property, 'baz');
        });
      });

      describe('topojson', () => {
        describe('feature property is specified', function() {
          const model = parseUnitModel({
              data: {
                url: 'http://foo.bar',
                format: {type: 'topojson', feature: 'baz'}
              }
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.name, 'source');
            assert.equal(sourceComponent.format.type, 'topojson');
          });
          it('should have format.feature baz', function() {
            assert.equal(sourceComponent.format.feature, 'baz');
          });
        });

        describe('mesh property is specified', function() {
          const model = parseUnitModel({
              data: {
                url: 'http://foo.bar',
                format: {type: 'topojson', mesh: 'baz'}
              }
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.name, 'source');
            assert.equal(sourceComponent.format.type, 'topojson');
          });
          it('should have format.mesh baz', function() {
            assert.equal(sourceComponent.format.mesh, 'baz');
          });
        });
      });
    });

  });
});


describe('data: formatParse', function () {
  describe('compileUnit', function() {
    it('should include parse for all applicable fields, and exclude calculated fields', function() {
      const model = parseUnitModel({
        transform: {
          calculate: [
            {field: 'b2', expr: 'datum["b"] * 2'}
          ]
        },
        mark: "point",
        encoding: {
          x: {field: 'a', type: "temporal"},
          y: {field: 'b', type: "quantitative"},
          color: {field: '*', type: "quantitative", aggregate: 'count'},
          size: {field: 'b2', type: "quantitative"},
        }
      });

      const formatParseComponent = formatParse.parseUnit(model);
      assert.deepEqual(formatParseComponent, {
        'a': 'date',
        'b': 'number'
      });
    });
  });


  describe('assemble', function() {
    // TODO: write test
  });
});

describe('data: bin', function() {
  describe('compileUnit', function() {
    const model = parseUnitModel({
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
      const transform = vals(bin.parseUnit(model))[0];

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

  describe('assemble', function() {
    // TODO: write test
  });
});

describe('data: nullFilter', function() {
  describe('compileUnit', function() {
    const spec = {
      mark: "point",
      encoding: {
        y: {field: 'qq', type: "quantitative"},
        x: {field: 'tt', type: "temporal"},
        color: {field: 'oo', type: "ordinal"}
      }
    };

    it('should add filterNull for Q and T by default', function () {
      const model = parseUnitModel(spec);
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"},
        oo: null
      });
    });

    it('should add filterNull for O when specified', function () {
      const model = parseUnitModel(mergeDeep(spec, {
        transform: {
          filterNull: true
        }
      }));
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"},
        oo: {field: 'oo', type: "ordinal"}
      });
    });

    it('should add no null filter if filterInvalid is false', function () {
      const model = parseUnitModel(mergeDeep(spec, {
        transform: {
          filterInvalid: false
        }
      }));
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: null,
        tt: null,
        oo: null
      });
    });

    it('should add no null filter if filterNull is false', function () {
      const model = parseUnitModel(mergeDeep(spec, {
        transform: {
          filterNull: false
        }
      }));
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: null,
        tt: null,
        oo: null
      });
    });

    it ('should add no null filter for count field', () => {
      const model = parseUnitModel({
        transform: {
          filterNull: true
        },
        mark: "point",
        encoding: {
          y: {aggregate: 'count', field: '*', type: "quantitative"}
        }
      });

      assert.deepEqual(nullFilter.parseUnit(model), {});
    });

    describe('assemble', () => {
      // TODO:
    });
  });

  describe('compileFacet', function() {
    it('should produce child\'s filter if child has no source and the facet has no filter', function() {
      // TODO: write
    });

    it('should produce child\'s filter and its own filter if child has no source and the facet has filter', function() {
      // TODO: write
    });
  });

  describe('assemble', function() {
    // TODO: write
  });
});

describe('data: filter', function () {
  describe('compileUnit', function () {
    const model = parseUnitModel({
      transform: {
        filter: 'datum["a"] > datum["b"] && datum["c"] === datum["d"]'
      }
    });
    it('should return array that contains a filter transform', function () {
      assert.deepEqual(filter.parseUnit(model), 'datum["a"] > datum["b"] && datum["c"] === datum["d"]');
    });
  });

  describe('assemble', function() {
    // TODO: write
  });
});

describe('data: formula', function() {
  describe('unit', function() {
    // FIXME: write
  });

  describe('facet', function() {
    // FIXME: write
  });
});

describe('data: timeUnit', function () {
  describe('compileUnit', function() {
    const model = parseUnitModel({
      mark: "point",
      encoding: {
        x: {field: 'a', type: "temporal", timeUnit: 'year'}
      }
    });
    it('should add formula transform', function() {
      const transform = vals(timeUnit.parseUnit(model));
      assert.deepEqual(transform[0], {
        type: 'formula',
        field: 'year_a',
        expr: 'datetime(year(datum["a"]), 0, 1, 0, 0, 0, 0)'
      });
    });
  });

  describe('compileFacet', function() {
    // TODO: write
  });

  describe('assemble', function() {
    // TODO: write
  });
});


describe('data: timeUnitDomain', function() {
  describe('unit: day', function() {
    const model = parseUnitModel({
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

    it('should be compiled into correct string set', function() {
      model.component.data = {} as DataComponent;
      model.component.data.timeUnitDomain = timeUnitDomain.parseUnit(model);
      assert.deepEqual(model.component.data.timeUnitDomain, {day: true});
    });

    it('should assemble data source with raw domain data', function() {
      const defs = timeUnitDomain.assemble(model.component.data);

      assert.deepEqual(defs, [{
        name: 'day',
        transform: [
          {
            expr: 'datetime(2006, 0, datum["data"]+1, 0, 0, 0, 0)',
            field: 'date',
            type: 'formula'
          }
        ],
        values: [0,1,2,3,4,5,6]
      }]);
    });
  });

  describe('unit: day', function() {
    // TODO: write more unit test for other timeUnit domain, for both ones that produces
    // custom domain and one that do not.
  });

  describe('facet', function() {
    // TODO: write
  });
});

describe('data: colorRank', function () {
  // TODO: write
});

describe('data: nonPositiveFilter', function () {
  describe('unit (with log scale)', function() {
    const model = parseUnitModel({
      mark: "point",
      encoding: {
        x: {field: 'a', type: "temporal"},
        y: {field: 'b', type: "quantitative", scale: {type: 'log'}}
      }
    });
    it('should produce the correct nonPositiveFilter component' ,function () {
      model.component.data = {} as DataComponent;
      model.component.data.nonPositiveFilter = nonPositiveFilter.parseUnit(model);
      assert.deepEqual(model.component.data.nonPositiveFilter, {
        b: true,
        a: false
      });
    });

    it('should assemble the correct filter transform', function() {
      const filterTransform = nonPositiveFilter.assemble(model.component.data)[0];
      assert.deepEqual(filterTransform, {
        type: 'filter',
        test: 'datum["b"] > 0'
      });
    });
  });

  describe('unit (with aggregated log scale)', function() {
    // TODO: write
  });

  describe('facet', function() {
    // TODO: write
  });
});

describe('data: stack', function() {
  describe('unit without stack', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {}
    });

    it('should not produce stack component', function() {
      model.component.data = {} as DataComponent;
      model.component.data.stackScale = stackScale.parseUnit(model);
      assert.equal(model.component.data.stackScale, null);
    });
  });

  describe('unit with color and binned x', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });
    model.component.data = {} as DataComponent;
    model.component.data.stackScale = stackScale.parseUnit(model);

    it('should produce the correct stack component', function() {
      const stackedData = model.component.data.stackScale;
      assert.equal(stackedData.transform[0].groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should assemble stack summary data correctly', function() {
      // simply return identity
      const summaryData = stackScale.assemble(model.component.data);
      assert.deepEqual(summaryData, model.component.data.stackScale);
    });
  });

  describe('unit with color and binned y', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "y": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
        "x": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
        "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
      }
    });

    model.component.data = {} as DataComponent;
    model.component.data.stackScale = stackScale.parseUnit(model);

    it('should produce the correct stack component', function() {
      const stackedData = model.component.data.stackScale;
      assert.equal(stackedData.transform[0].groupby[0], 'bin_Cost__Total_$_start');
    });

    it('should assemble stack summary data correctly', function() {
      // simply return identity
      const summaryData = stackScale.assemble(model.component.data);
      assert.deepEqual(summaryData, model.component.data.stackScale);
    });
  });

  describe('facet', function() {
    // TODO: write
  });
});

describe('data: summary', function () {
  const identity = {
    dataName(data) {
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
