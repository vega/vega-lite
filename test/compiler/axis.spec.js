'use strict';

var expect = require('chai').expect;

var axis = require('../../src/compiler/axis'),
  Encoding = require('../../src/Encoding');

describe('Axis', function() {
  var stats = {a: {distinct: 5}, b: {distinct: 32}},
    layout = {
      cellWidth: 60,  // default characterWidth = 6
      cellHeight: 60
    };

  describe('(X) for Time Data', function() {
    var field = 'a',
      timeUnit = 'month',
      encoding = Encoding.fromSpec({
        encoding: {
          x: {name: field, type: 'T', timeUnit: timeUnit}
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


  describe('grid()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('hideTicks()', function () {
    var def = axis.hideTicks({properties:{}});
    it('should adjust ticks', function () {
      expect(def.properties.ticks).to.eql({opacity: {value: 0}});
    });
    it('should adjust majorTicks', function () {
      expect(def.properties.majorTicks).to.eql({opacity: {value: 0}});
    });
    it('should adjust axis', function () {
      expect(def.properties.axis).to.eql({opacity: {value: 0}});
    });
  });

  describe('labels.scale()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('labels.format()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('labels.angle()', function () {
    it('should set explicitly specified angle', function () {
      var def = axis.labels.angle({}, Encoding.fromSpec({
        encoding: {
          x: {name: 'a', type: 'T', axis:{labelAngle: 90}}
        }
      }), 'x');
      expect(def.properties.labels.angle).to.eql({value: 90});
    });
  });

  describe('labels.rotate()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      var def = axis.orient({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a', axis:{orient: 'bottom'}}
          }
        }), 'x', stats);
      expect(def.orient).to.eql('bottom');
    });

    it('should return undefined by default', function () {
      var def = axis.orient({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a'}
          }
        }), 'x', stats);
      expect(def.orient).to.eql(undefined);
    });

    it('should return top for COL', function () {
      var def = axis.orient({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a'},
            col: {name: 'a'}
          }
        }), 'col', stats);
      expect(def.orient).to.eql('top');
    });

    it('should return top for X with high cardinality, ordinal Y', function () {
      var def = axis.orient({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a'},
            y: {name: 'b', type: 'O'}
          }
        }), 'x', stats);
      expect(def.orient).to.eql('top');
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var def = axis.title({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a', axis: {title: 'Custom'}}
          }
        }), 'x', stats, layout);
      expect(def.title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var def = axis.title({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a', axis: {titleMaxLength: '3'}}
          }
        }), 'x', layout);
      expect(def.title).to.eql('a');
    });

    it('should add return fieldTitle by default', function () {
      var def = axis.title({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a', aggregate: 'sum', axis: {titleMaxLength: '10'}}
          }
        }), 'x', layout);
      expect(def.title).to.eql('SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      var def = axis.title({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'a', aggregate: 'sum', axis: {titleMaxLength: '3'}}
          }
        }), 'x', layout);
      expect(def.title).to.eql('SU…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      var def = axis.title({}, Encoding.fromSpec({
          encoding: {
            x: {name: 'abcdefghijkl'}
          }
        }), 'x', layout);
      expect(def.title).to.eql('abcdefghi…');
    });
  });

  describe('titleOffset()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });
});
