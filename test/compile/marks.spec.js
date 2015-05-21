'use strict';

var expect = require('chai').expect;
var fixtures = require('../fixtures');

var marks = require('../../src/compile/marks'),
  Encoding = require('../../src/Encoding');

var mockLayout = {
  x: {useSmallBand: false},
  y: {useSmallBand: false}
};

describe('compile.marks', function() {
  describe('bar', function() {
    describe('of log - vertical', function() {
      var f = fixtures.log_bar_ver,
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.y2).to.eql({group: 'height'});
      });
      it('should has no height', function(){
        expect(def.height).to.be.undefined;
      });
    });

    describe('of log - horizontal', function() {
      var f = fixtures.log_bar_hor,
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should has no width', function(){
        expect(def.width).to.be.undefined;
      });
    });
  });
});