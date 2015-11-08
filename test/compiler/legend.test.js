'use strict';

var expect = require('chai').expect;

var legend = require('../../src/compiler/legend'),
  Encoding = require('../../src/Encoding').Encoding;

describe('Legend', function() {
  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = legend.title('color', Encoding.fromSpec({
          encoding: {
            color: {name: 'a', legend: {title: 'Custom'}}
          }
        }));
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var encoding = Encoding.fromSpec({
          encoding: {
            color: {name: 'a', legend: {}}
          }
        });

      var title = legend.title('color', encoding);
      expect(title).to.eql('a');
    });
  });
});
