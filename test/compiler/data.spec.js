'use strict';

var expect = require('chai').expect;

var data = require('../../src/compiler/data'),
  Encoding = require('../../src/Encoding');

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
            y: {name: 'b', type: 'Q'}
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
        x: {name: 'a', type:'T', timeUnit: 'year'}
      },
      filter: [{
        operator: '>',
        operands: ['a', 'b']
      },{
        operator: '<',
        operands: ['c', 'd']
      }]
    });

    describe('filter', function () {
      it('should return filter transform that include filter null', function () {
        var transform = data.raw.transform.filter(encoding);

        expect(transform[0]).to.eql({
          type: 'filter',
          test: '(d.data.a!==null) && (d.data.a > b) && (d.data.c < d)'
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

    it('should put time before filter', function () {
      var transform = data.raw.transform(encoding);
      expect(transform[0].type).to.eql('formula');
      expect(transform[1].type).to.eql('filter');
    });

  });
});
