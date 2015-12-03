import {expect} from 'chai';

import {compileData, source, summary} from '../../src/compiler/data';
import {SUMMARY} from '../../src/data';
import {Model} from '../../src/compiler/Model';
import {POINT} from '../../src/marktype';

describe('data', function () {
  describe('for aggregate encoding', function () {
    it('should contain two tables', function() {
      var encoding = new Model({
          encoding: {
            x: {field: 'a', type: 'temporal'},
            y: {field: 'b', type: 'quantitative', scale: {type: 'log'}, aggregate: 'sum'}
          }
        });

      var _data = compileData(encoding);
      expect(_data.length).to.equal(2);
    });
  });

  describe('when contains log in non-aggregate', function () {
    var rawEncodingWithLog = new Model({
        encoding: {
          x: {field: 'a', type: 'temporal'},
          y: {field: 'b', type: 'quantitative', scale: {type: 'log'}}
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
    it('should have correct parse', function() {
      var encoding = new Model({
          encoding: {
            x: {field: 'a', type: 'temporal'},
            y: {field: 'b', type: 'quantitative'},
            color: {field: '*', type: 'quantitative', aggregate: 'count'}
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
      encoding: {
        x: {field: 'a', type:'temporal', timeUnit: 'year'},
        y: {
          'bin': {'maxbins': 15},
          'field': 'Acceleration',
          'type': 'quantitative'
        }
      }
    });

    describe('bin', function() {
      it('should add bin transform', function() {
        var transform = source.binTransform(encoding);

        expect(transform[0]).to.eql({
          type: 'bin',
          field: 'Acceleration',
          output: {
            start: 'bin_Acceleration_start',
            mid: 'bin_Acceleration_mid',
            end: 'bin_Acceleration_end'
          },
          maxbins: 15
        });
      });
    });

    describe('nullFilter', function() {
      var spec = {
          marktype: POINT,
          encoding: {
            y: {field: 'qq', type:'quantitative'},
            x: {field: 'tt', type:'temporal'},
            color: {field: 'oo', type:'ordinal'}
          }
        };

      it('should add filterNull for Q and T by default', function () {
        var encoding = new Model(spec);
        expect(source.nullFilterTransform(encoding))
          .to.eql([{
            type: 'filter',
            test: 'datum.tt!==null && datum.qq!==null'
          }]);
      });

      it('should add filterNull for O when specified', function () {
        var encoding = new Model(spec, {
          config: {
            filterNull: {ordinal: true}
          }
        });
        expect(source.nullFilterTransform(encoding))
          .to.eql([{
            type: 'filter',
            test:'datum.tt!==null && datum.qq!==null && datum.oo!==null'
          }]);
      });
      // });
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
        encoding: {
          'y': {
            'aggregate': 'sum',
            'field': 'Acceleration',
            'type': 'quantitative'
          },
          'x': {
            'field': 'origin',
            'type': 'ordinal'
          },
          color: {field: '*', type: 'quantitative', aggregate: 'count'}
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
});
