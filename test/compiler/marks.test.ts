import {expect} from 'chai';
import {bars, points, lines, area} from '../fixtures';
import * as marks from '../../src/compiler/marks';
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {Model} from '../../src/compiler/Model';


describe('compile.marks', function() {
  describe('bar', function() {
    describe('vertical, with log', function() {
      var f = bars.log_ver,
          e = new Model(f),
          def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.y2).to.eql({field: {group: 'height'}});
      });
      it('should has no height', function(){
        expect(def.height).to.be.undefined;
      });
    });

    describe('horizontal, with log', function() {
      var f = bars.log_hor,
          e = new Model(f),
          def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should have no width', function(){
        expect(def.width).to.be.undefined;
      });
    });

    describe('1D, vertical', function() {
      var f = bars['1d_ver'],
          e = new Model(f),
          def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.y2).to.eql({field: {group: 'height'}});
      });
      it('should have no height', function(){
        expect(def.height).to.be.undefined;
      });
      it('should have x-offset', function(){
        expect(def.x.offset).to.eql(2);
      });
    });

    describe('1D, horizontal', function() {
      var f = bars['1d_hor'],
          e = new Model(f),
          def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should have no width', function(){
        expect(def.width).to.be.undefined;
      });
      it('should have y-offset', function(){
        expect(def.y2).to.eql({
          field: {group: 'height'},
          offset: -1
        });
      });
    });
  });

  describe('point', function() {
    describe('1D, horizontal', function() {
      var f = points['1d_hor'],
          e = new Model(f),
          def = marks.point.properties(e);
      it('should be centered', function() {
        expect(def.y).to.eql({value: e.fieldDef(Y).scale.bandWidth / 2});
      });
      it('should scale on x', function() {
        expect(def.x).to.eql({scale: X, field: 'year'});
      });
    });

    describe('1D, vertical', function() {
      var f = points['1d_ver'],
          e = new Model(f),
          def = marks.point.properties(e);
      it('should be centered', function() {
        expect(def.x).to.eql({value: e.fieldDef(X).scale.bandWidth / 2});
      });
      it('should scale on y', function() {
        expect(def.y).to.eql({scale: Y, field: 'year'});
      });
    });

    describe('2D, x and y', function() {
      var f = points['x,y'],
          e = new Model(f),
          def = marks.point.properties(e);
      it('should scale on x', function() {
        expect(def.x).to.eql({scale: X, field: 'year'});
      });
      it('should scale on y', function(){
        expect(def.y).to.eql({scale: Y, field: 'yield'});
      });
    });

    describe('3D', function() {
      describe('x,y,size', function () {
        var f = points['x,y,size'],
            e = new Model(f),
            def = marks.point.properties(e);
        it('should have scale for size', function () {
          expect(def.size).to.eql({scale: SIZE, field: 'count'});
        });
      });

      describe('x,y,color', function () {
        var f = points['x,y,stroke'],
            e = new Model(f),
            def = marks.point.properties(e);
        it('should have scale for color', function () {
          expect(def.stroke).to.eql({scale: COLOR, field: 'yield'});
        });
      });

      describe('x,y,shape', function () {
        var f = points['x,y,shape'],
            e = new Model(f),
            def = marks.point.properties(e);
        it('should have scale for shape', function () {
          expect(def.shape).to.eql({scale: SHAPE, field: 'bin_yield_range'});
        });
      });
    });
  });

  describe('line', function() {
    describe('2D, x and y', function() {
      var f = lines['x,y'],
          e = new Model(f),
          def = marks.line.properties(e);
      it('should have scale for x', function() {
        expect(def.x).to.eql({scale: X, field: 'year'});
      });
      it('should have scale for y', function(){
        expect(def.y).to.eql({scale: Y, field: 'yield'});
      });
    });

    describe('3D', function() {
      describe('x,y,color', function () {
        var f = lines['x,y,stroke'],
            e = new Model(f),
            def = marks.line.properties(e);
        it('should have scale for color', function () {
          expect(def.stroke).to.eql({scale: COLOR, field: 'Acceleration'});
        });
      });
    });
  });

  describe('area', function() {
    describe('2D, x and y', function() {
      var f = area['x,y'],
          e = new Model(f),
          def = marks.area.properties(e);
      it('should have scale for x', function() {
        expect(def.x).to.eql({scale: X, field: 'Displacement'});
      });
      it('should have scale for y', function(){
        expect(def.y).to.eql({scale: Y, field: 'Acceleration'});
      });
    });

    describe('3D', function() {
      describe('x,y,color', function () {
        var f = area['x,y,color'],
            e = new Model(f),
            def = marks.area.properties(e);
        it('should have scale for color', function () {
          expect(def.fill).to.eql({scale: COLOR, field: 'Miles_per_Gallon'});
        });
      });
    });
  });

  // TODO add other type of marks
});
