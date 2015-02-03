var expect = require('chai').expect;

var axis = require('../../src/compile/axis'),
  Encoding = require('../../src/Encoding');

describe('Axis', function() {
  describe('(X) for Time Data', function() {
    var fieldName = 'a',
      fn = 'month',
      encoding = Encoding.fromSpec({
        enc: {
          x: {name: fieldName, type: 'T', fn: fn}
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
    it('should use custom label', function() {
      expect(_axis.properties.labels.text.scale).to.equal('time-'+ fn);
    });
    it('should rotate label', function() {
      expect(_axis.properties.labels.angle.value).to.equal(270);
    });
  });
});
