'use strict';

var expect = require('chai').expect;

var data = require('../../src/compiler/data'),
  Encoding = require('../../src/Encoding');

describe('data', function () {
  describe('for aggregate encoding', function () {
    it('should contain two tables', function() {
      var encoding = Encoding.fromSpec({
          encoding: {
            x: {name: 'a', type: 'T'},
            y: {name: 'b', type: 'Q', scale: {type: 'log'}, aggregate: 'sum'}
          }
        });

      var _data = data(encoding);
      expect(_data.length).to.equal(2);
    });
  });

  describe('when contains log in non-aggregate', function () {
    var rawEncodingWithLog = Encoding.fromSpec({
        encoding: {
          x: {name: 'a', type: 'T'},
          y: {name: 'b', type: 'Q', scale: {type: 'log'}}
        }
      });

    var _data = data(rawEncodingWithLog);
    it('should contains one table', function() {
      expect(_data.length).to.equal(1);
    });
    it('should have filter non-positive in raw', function() {
      var rawTransform = _data[0].transform;
      expect(rawTransform[rawTransform.length - 1]).to.eql({
        type: 'filter',
        test: 'datum.b > 0'
      });
    });
  });
});

describe('data.raw', function() {
  describe('with explicit values', function() {
    var encoding = Encoding.fromSpec({
      data: {
        values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
      }
    });

    var raw = data.raw(encoding, {});

    it('should have values', function() {
      expect(raw.name).to.equal('raw');
      expect(raw.values).to.deep.equal([{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
    });

    it('should have raw.format if not required', function(){
      expect(raw.format).to.eql(undefined);
    });
  });

  describe('with link to url', function() {
    var encoding = Encoding.fromSpec({
        data: {
          url: 'http://foo.bar'
        }
      });

    var raw = data.raw(encoding);

    it('should have format json', function() {
      expect(raw.name).to.equal('raw');
      expect(raw.format.type).to.equal('json');
    });
    it('should have correct url', function() {
      expect(raw.url).to.equal('http://foo.bar');
    });
  });

  describe('formatParse', function () {
    it('should have correct parse', function() {
      var encoding = Encoding.fromSpec({
          encoding: {
            x: {name: 'a', type: 'T'},
            y: {name: 'b', type: 'Q'},
            color: {name: '*', type: 'Q', aggregate: 'count'}
          }
        });

      var raw = data.raw(encoding);
      expect(raw.format.parse).to.eql({
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
        x: {name: 'a', type:'T', timeUnit: 'year'},
        y: {
          'bin': {'maxbins': 15},
          'name': 'Acceleration',
          'type': 'Q'
        }
      }
    });

    var stats = {
      Acceleration: {
        min: 0,
        max: 100
      }
    };

    describe('bin', function() {
      it('should add bin transform', function() {
        var transform = data.raw.transform.bin(encoding, stats);

        expect(transform[0]).to.eql({
          type: 'bin',
          field: 'Acceleration',
          output: {bin: 'bin_Acceleration'},
          maxbins: 15,
          min: 0,
          max: 100
        });
      });
    });

    describe('nullFilter', function() {
      var spec = {
          marktype: 'point',
          encoding: {
            y: {name: 'Q', type:'Q'},
            x: {name: 'T', type:'T'},
            color: {name: 'O', type:'O'}
          }
        };

      it('should add filterNull for Q and T by default', function () {
        var encoding = Encoding.fromSpec(spec);
        expect(data.raw.transform.nullFilter(encoding))
          .to.eql([{
            type: 'filter',
            test: 'datum.T!==null && datum.Q!==null'
          }]);
      });

      it('should add filterNull for O when specified', function () {
        var encoding = Encoding.fromSpec(spec, {
          config: {
            filterNull: {O: true}
          }
        });
        expect(data.raw.transform.nullFilter(encoding))
          .to.eql([{
            type: 'filter',
            test:'datum.T!==null && datum.Q!==null && datum.O!==null'
          }]);
      });
      // });
    });

    describe('filter', function () {
      it('should return array that contains a filter transform', function () {
        expect(data.raw.transform.filter(encoding))
          .to.eql([{
            type: 'filter',
            test: 'datum.a > datum.b && datum.c === datum.d'
          }]);
      });
    });

    describe('time', function() {
      it('should add formula transform', function() {
        var transform = data.raw.transform.time(encoding);
        expect(transform[0]).to.eql({
          type: 'formula',
          field: 'year_a',
          expr: 'utcyear(datum.a)'
        });
      });
    });

    it('should have null filter, timeUnit, bin then filter', function () {
      var transform = data.raw.transform(encoding, stats);
      expect(transform[0].type).to.eql('filter');
      expect(transform[1].type).to.eql('formula');
      expect(transform[2].type).to.eql('bin');
      expect(transform[3].type).to.eql('filter');
    });

  });
});


describe('data.aggregated', function () {
  it('should return correct aggregation', function() {
    var encoding = Encoding.fromSpec({
        encoding: {
          'y': {
            'aggregate': 'sum',
            'name': 'Acceleration',
            'type': 'Q'
          },
          'x': {
            'name': 'origin',
            "type": "O"
          },
          color: {name: '*', type: 'Q', aggregate: 'count'}
        }
      });

    var aggregated = data.aggregate(encoding);
    expect(aggregated ).to.eql({
      "name": AGGREGATE,
      "source": "raw",
      "transform": [{
        "type": "aggregate",
        "groupby": ["origin"],
        "summarize": {
          '*': ['count'],
          'Acceleration': ['sum']
        }
      }]
    });
  });
});