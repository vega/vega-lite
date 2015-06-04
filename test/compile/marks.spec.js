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
    describe('vertical, with log', function() {
      var f = fixtures.bars.log_ver,
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.y2).to.eql({group: 'height'});
      });
      it('should has no height', function(){
        expect(def.height).to.be.undefined;
      });
    });

    describe('horizontal, with log', function() {
      var f = fixtures.bars.log_hor,
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should have no width', function(){
        expect(def.width).to.be.undefined;
      });
    });

    describe('1D, vertical', function() {
      var f = fixtures.bars['1d_ver'],
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.y2).to.eql({group: 'height'});
      });
      it('should have no height', function(){
        expect(def.height).to.be.undefined;
      });
      it('should have x-offset', function(){
        expect(def.x.offset).to.eql(5); // config.singleBarOffset
      });
    });

    describe('1D, horizontal', function() {
      var f = fixtures.bars['1d_hor'],
          e = Encoding.fromSpec(f),
          def = marks.bar.prop(e, mockLayout, {});
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should have no width', function(){
        expect(def.width).to.be.undefined;
      });
      it('should have y-offset', function(){
        expect(def.y2).to.eql({
          group: 'height',
          offset: -5 // -config.singleBarOffset
        });
      });
    });
  });

  // TODO add other type of marks
});