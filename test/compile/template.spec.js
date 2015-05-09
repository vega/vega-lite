'use strict';

var expect = require('chai').expect;

var template = require('../../src/compile/template'),
  Encoding = require('../../src/Encoding');

describe('Template', function() {
  describe('with explicit values', function() {
    var encoding = Encoding.fromSpec({
        data: {
          values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
        }
      });

    var _tmpl = template(encoding, {});

    it('should have values', function() {
      expect(_tmpl.data[0].name).to.equal('raw');
      expect(_tmpl.data[0].values).to.deep.equal([{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
    });
  });

  describe('with link to url', function() {
    var encoding = Encoding.fromSpec({
        data: {
          url: 'http://foo.bar'
        }
      });

    var _tmpl = template(encoding, {});

    it('should have format json', function() {
      expect(_tmpl.data[0].name).to.equal('raw');
      expect(_tmpl.data[0].format.type).to.equal('json');
    });
    it('should have correct url', function() {
      expect(_tmpl.data[0].url).to.equal('http://foo.bar');
    });
  });
});
