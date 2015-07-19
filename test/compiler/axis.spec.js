'use strict';

var expect = require('chai').expect;

var axis = require('../../src/compiler/axis'),
  Encoding = require('../../src/Encoding');

describe('Axis', function() {
  var stats = {a: {distinct: 5}, b: {distinct: 32}};

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
    }, stats);

    //FIXME decouple the test here

    it('should use custom label', function() {
      expect(_axis.properties.labels.text.scale).to.equal('time-'+ timeUnit);
    });
    it('should rotate label', function() {
      expect(_axis.properties.labels.angle.value).to.equal(270);
    });
  });

  describe('orient', function () {
    it('should return specified orient', function () {
      var orient = axis.orient('x', Encoding.fromSpec({
          encoding: {
            x: {name: 'a', axis:{orient: 'bottom'}}
          }
        }), stats);
      expect(orient).to.eql('bottom');
    });

    it('should return undefined by default', function () {
      var orient = axis.orient('x', Encoding.fromSpec({
          encoding: {
            x: {name: 'a'}
          }
        }), stats);
      expect(orient).to.eql(undefined);
    });

    it('should return top for COL', function () {
      var orient = axis.orient('col', Encoding.fromSpec({
          encoding: {
            x: {name: 'a'},
            col: {name: 'a'}
          }
        }), stats);
      expect(orient).to.eql('top');
    });

    it('should return top for X with high cardinality, ordinal Y', function () {
      var orient = axis.orient('x', Encoding.fromSpec({
          encoding: {
            x: {name: 'a'},
            y: {name: 'b', type: 'O'}
          }
        }), stats);
      expect(orient).to.eql('top');
    });
  });
});
