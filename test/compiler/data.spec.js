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
    it('should  have filter zero in raw', function(){
      var rawTransform = _data[0].transform;
      expect(rawTransform[rawTransform.length - 1]).to.eql({
        type: 'filter',
        test: 'd.data.b > 0'
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
      encoding: {
        x: {name: 'a', type:'T', timeUnit: 'year'},
        y: {
          'bin': {'maxbins': 15},
          'name': 'Acceleration',
          'type': 'Q'
        }
      },
      filter: [{
        operator: '>',
        operands: ['a', 'b']
      },{
        operator: '=',
        operands: ['c', 'd']
      }]
    });

    describe('bin', function() {
      it('should add bin transform', function() {
        var transform = data.raw.transform.bin(encoding);
        expect(transform[0]).to.eql({
          type: 'bin',
          field: 'data.Acceleration',
          output: 'data.bin_Acceleration',
          maxbins: 15
        });
      });
    });

    describe('filter', function () {
      it('should return filter transform that include filter null', function () {
        var transform = data.raw.transform.filter(encoding);

        expect(transform[0]).to.eql({
          type: 'filter',
          test: '(d.data.a!==null) && (d.data.Acceleration!==null)' +
          ' && (d.data.a > b) && (d.data.c == d)'
        });
      });

      it('should exclude unsupported operator', function () {
        var badEncoding = Encoding.fromSpec({
          filter: [{
            operator: '*',
            operands: ['a', 'b']
          }]
        });

        var transform = data.raw.transform.filter(badEncoding);

        expect(transform.length).to.equal(0);
      });
    });

    describe('time', function() {
      it('should add formula transform', function() {
        var transform = data.raw.transform.time(encoding);
        expect(transform[0]).to.eql({
          type: 'formula',
          field: 'data.year_a',
          expr: 'utcyear(d.data.a)'
        });
      });
    });

    it('should time and bin before filter', function () {
      var transform = data.raw.transform(encoding);
      expect(transform[0].type).to.eql('formula');
      expect(transform[1].type).to.eql('bin');
      expect(transform[2].type).to.eql('filter');
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
        "groupby": ["data.origin"],
        "fields": [{
          "op": "sum",
          "field": "data.Acceleration"
        },{
          "op": "count",
          "field": "*"
        }]
      }]
    });
  });
});