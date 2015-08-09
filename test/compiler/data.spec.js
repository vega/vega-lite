'use strict';

var expect = require('chai').expect;

var data = require('../../src/compiler/data'),
  Encoding = require('../../src/Encoding');

describe('data.raw()', function() {
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
});
