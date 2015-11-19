import {expect} from 'chai';

import data, {source, summary} from '../../src/compiler/data';
import {SUMMARY} from '../../src/data';
import Encoding from '../../src/Encoding';

describe('data', function () {
  describe('for aggregate encoding', function () {
    it('should contain two tables', function() {
      var encoding = Encoding.fromSpec({
          encoding: {
            x: {name: 'a', type: 'temporal'},
            y: {name: 'b', type: 'quantitative', scale: {type: 'log'}, aggregate: 'sum'}
          }
        });

      var _data = data(encoding);
      expect(_data.length).to.equal(2);
    });
  });

  describe('when contains log in non-aggregate', function () {
    var rawEncodingWithLog = Encoding.fromSpec({
        encoding: {
          x: {name: 'a', type: 'temporal'},
          y: {name: 'b', type: 'quantitative', scale: {type: 'log'}}
        }
      });

    var _data = data(rawEncodingWithLog);
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
    var encoding = Encoding.fromSpec({
      data: {
        values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
      }
    });

    var sourceDef = source.def(encoding);

    it('should have values', function() {
      expect(sourceDef.name).to.equal('source');
      expect(sourceDef.values).to.deep.equal([{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
    });

    it('should have source.format', function(){
      expect(sourceDef.format).to.eql({type: 'json'});
    });
  });

  describe('with link to url', function() {
    var encoding = Encoding.fromSpec({
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
      var encoding = Encoding.fromSpec({
          encoding: {
            x: {name: 'a', type: 'temporal'},
            y: {name: 'b', type: 'quantitative'},
            color: {name: '*', type: 'quantitative', aggregate: 'count'}
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
    var encoding = Encoding.fromSpec({
      data: {
        filter: 'datum.a > datum.b && datum.c === datum.d'
      },
      encoding: {
        x: {name: 'a', type:'temporal', timeUnit: 'year'},
        y: {
          'bin': {'maxbins': 15},
          'name': 'Acceleration',
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
          output: {start: 'bin_Acceleration_start', end: 'bin_Acceleration_end'},
          maxbins: 15
        });
      });
    });

    describe('nullFilter', function() {
      var spec = {
          marktype: 'point',
          encoding: {
            y: {name: 'qq', type:'quantitative'},
            x: {name: 'tt', type:'temporal'},
            color: {name: 'oo', type:'ordinal'}
          }
        };

      it('should add filterNull for Q and T by default', function () {
        var encoding = Encoding.fromSpec(spec);
        expect(source.nullFilterTransform(encoding))
          .to.eql([{
            type: 'filter',
            test: 'datum.tt!==null && datum.qq!==null'
          }]);
      });

      it('should add filterNull for O when specified', function () {
        var encoding = Encoding.fromSpec(spec, {
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
      expect(transform[3].type).to.eql('formula'); // formula for bin_mid
      expect(transform[4].type).to.eql('filter');
    });

  });
});


describe('data.summary', function () {
  it('should return correct aggregation', function() {
    var encoding = Encoding.fromSpec({
        encoding: {
          'y': {
            'aggregate': 'sum',
            'name': 'Acceleration',
            'type': 'quantitative'
          },
          'x': {
            'name': 'origin',
            'type': 'ordinal'
          },
          color: {name: '*', type: 'quantitative', aggregate: 'count'}
        }
      });

    var aggregated = summary.def(encoding);
    expect(aggregated ).to.eql({
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
