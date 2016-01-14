/* tslint:disable:quotemark */

import {expect} from 'chai';

import {compileData, source, summary} from '../../src/compiler/data';
import {SUMMARY} from '../../src/data';
import {Model} from '../../src/compiler/Model'; // FIXME use parseModel
import {POINT} from '../../src/mark';
import {TEMPORAL, QUANTITATIVE, ORDINAL} from '../../src/type';

describe('data', function () {
  describe('for aggregate encoding', function () {
    it('should contain two tables', function() {
      var encoding = new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: TEMPORAL},
            y: {field: 'b', type: QUANTITATIVE, scale: {type: 'log'}, aggregate: 'sum'}
          }
        });

      var _data = compileData(encoding);
      expect(_data.length).to.equal(2);
    });
  });

  describe('when contains log in non-aggregate', function () {
    var rawEncodingWithLog = new Model({
        mark: POINT,
        encoding: {
          x: {field: 'a', type: TEMPORAL},
          y: {field: 'b', type: QUANTITATIVE, scale: {type: 'log'}}
        }
      });

    var _data = compileData(rawEncodingWithLog);
    it('should contains one table', function() {
      expect(_data.length).to.equal(1);
    });
    it('should have filter non-positive in source', function() {
      var sourceTransform = _data[0].transform;
      expect(sourceTransform[sourceTransform.length - 1]).to.eql({
        type: 'filter',
        test: 'datum.b > 0'
      });
    });
  });
});

describe('data.source', function() {
  describe('with explicit values', function() {
    var model = new Model({
      data: {
        values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
      }
    });

    var sourceDef = source.def(model);

    it('should have values', function() {
      expect(sourceDef.name).to.equal('source');
      expect(sourceDef.values).to.deep.equal([{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
    });

    it('should have source.format', function(){
      expect(sourceDef.format).to.eql({type: 'json'});
    });
  });

  describe('with link to url', function() {
    var encoding = new Model({
        data: {
          url: 'http://foo.bar'
        }
      });

    var sourceDef = source.def(encoding);

    it('should have format json', function() {
      expect(sourceDef.name).to.equal('source');
      expect(sourceDef.format.type).to.equal('json');
    });
    it('should have correct url', function() {
      expect(sourceDef.url).to.equal('http://foo.bar');
    });
  });

  describe('formatParse', function () {
    it('should include parse for all applicable fields, and exclude calculated fields', function() {
      var encoding = new Model({
          data: {
            calculate: [
              {field: 'b2', expr: 'datum.b * 2'}
            ]
          },
          mark: POINT,
          encoding: {
            x: {field: 'a', type: TEMPORAL},
            y: {field: 'b', type: QUANTITATIVE},
            color: {field: '*', type: QUANTITATIVE, aggregate: 'count'}
          }
        });

      var sourceDef = source.def(encoding);
      expect(sourceDef.format.parse).to.eql({
        'a': 'date',
        'b': 'number'
      });
    });
  });

  describe('transform', function () {
    var encoding = new Model({
      data: {
        filter: 'datum.a > datum.b && datum.c === datum.d'
      },
      mark: POINT,
      encoding: {
        x: {field: 'a', type: TEMPORAL, timeUnit: 'year'},
        y: {
          bin: {
            min: 0,
            max: 100
          },
          'field': 'Acceleration',
          'type': QUANTITATIVE
        }
      }
    });

    describe('bin', function() {
      it('should add bin transform and correctly apply bin', function() {
        var transform = source.binTransform(encoding);

        expect(transform[0]).to.eql({
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
      var spec = {
          mark: POINT,
          encoding: {
            y: {field: 'qq', type: QUANTITATIVE},
            x: {field: 'tt', type: TEMPORAL},
            color: {field: 'oo', type: ORDINAL}
          }
        };

      it('should add filterNull for Q and T by default', function () {
        var enc = new Model(spec);
        expect(source.nullFilterTransform(enc))
          .to.eql([{
            type: 'filter',
            test: 'datum.tt!==null && datum.qq!==null'
          }]);
      });

      it('should add filterNull for O when specified', function () {
        var enc = new Model(spec, {
          config: {
            filterNull: true
          }
        });
        expect(source.nullFilterTransform(enc))
          .to.eql([{
            type: 'filter',
            test:'datum.tt!==null && datum.qq!==null && datum.oo!==null'
          }]);
      });

      it('should add no null filter if filterNull is false', function () {
        var enc = new Model(spec, {
          config: {
            filterNull: false
          }
        });
        expect(source.nullFilterTransform(enc))
          .to.eql([]);
      });
    });

    describe('filter', function () {
      it('should return array that contains a filter transform', function () {
        expect(source.filterTransform(encoding))
          .to.eql([{
            type: 'filter',
            test: 'datum.a > datum.b && datum.c === datum.d'
          }]);
      });
    });

    describe('time', function() {
      it('should add formula transform', function() {
        var transform = source.timeTransform(encoding);
        expect(transform[0]).to.eql({
          type: 'formula',
          field: 'year_a',
          expr: 'utcyear(datum.a)'
        });
      });
    });

    it('should have null filter, timeUnit, bin then filter', function () {
      var transform = source.transform(encoding);
      expect(transform[0].type).to.eql('filter');
      expect(transform[1].type).to.eql('formula');
      expect(transform[2].type).to.eql('bin');
      expect(transform[3].type).to.eql('filter');
    });

  });
});


describe('data.summary', function () {
  it('should return correct aggregation', function() {
    var encoding = new Model({
        mark: POINT,
        encoding: {
          'y': {
            'aggregate': 'sum',
            'field': 'Acceleration',
            'type': QUANTITATIVE
          },
          'x': {
            'field': 'origin',
            'type': ORDINAL
          },
          color: {field: '*', type: QUANTITATIVE, aggregate: 'count'}
        }
      });

    var aggregated = summary.def(encoding);
    expect(aggregated).to.eql({
      'name': SUMMARY,
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
    var encoding = new Model({
        mark: POINT,
        encoding: {
          'y': {
            'aggregate': 'mean',
            'field': 'Acceleration',
            'type': QUANTITATIVE
          },
          'x': {
            'aggregate': 'mean',
            'field': 'Displacement',
            'type': QUANTITATIVE
          },
          'detail': [{
            'field': 'Origin',
            'type': ORDINAL
          },{
            'field': 'Cylinders',
            'type': QUANTITATIVE
          }]
        }
      });

    var aggregated = summary.def(encoding);
    expect(aggregated).to.eql({
      'name': SUMMARY,
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
