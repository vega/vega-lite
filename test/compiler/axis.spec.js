'use strict';

var expect = require('chai').expect;

var axis = require('../../src/compiler/axis'),
  Encoding = require('../../src/Encoding');

describe('Axis', function() {
  describe('(X) for Time Data', function() {
    var fieldName = 'a',
      timeUnit = 'month',
      encoding = Encoding.fromSpec({
        encoding: {
          x: {name: fieldName, type: 'T', timeUnit: timeUnit}
        }
      });
    var _axis = axis.def('x', encoding, {
      width: 200,
      height: 200,
      cellWidth: 200,
      cellHeight: 200,
      x: {
        axisTitleOffset: 60
      },
      y: {
        axisTitleOffset: 60
      }
    });

    //FIXME decouple the test here

    it('should use custom label', function() {
      expect(_axis.properties.labels.text.scale).to.equal('time-'+ timeUnit);
    });
    it('should rotate label', function() {
      expect(_axis.properties.labels.angle.value).to.equal(270);
    });
  });
});
