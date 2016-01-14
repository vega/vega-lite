/* tslint:disable quote */

import {expect} from 'chai';
import * as marks from '../../src/compiler/marks';
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {parseModel} from '../util';
import {extend} from '../../src/util'

describe('compile.marks', function() {
  describe('bar', function() {
    describe('vertical, with log', function() {
      const e = parseModel({
        "mark": "bar",
        "encoding": {
          "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
          "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
        },
        "data": {"url": 'data/movies.json'}
      }),
          def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.y2).to.eql({field: {group: 'height'}});
      });
      it('should has no height', function(){
        expect(def.height).to.be.undefined;
      });
    });

    describe('horizontal, with log', function() {
      const e = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
          "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
        },
        "data": {"url": 'data/movies.json'}
      });
      const def = marks.bar.properties(e);
      it('should end on axis', function() {
        expect(def.x2).to.eql({value: 0});
      });
      it('should have no width', function(){
        expect(def.width).to.be.undefined;
      });
    });

    describe('1D, vertical', function() {
      const e = parseModel({
          "mark": "bar",
          "encoding": {"y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}},
          "data": {"url": 'data/movies.json'}
        }),
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
      const e = parseModel({
          "mark": "bar",
          "encoding": {"x": {"type": "quantitative", "field": 'US_Gross', "aggregate": 'sum'}},
          "data": {"url": 'data/movies.json'}
        }),
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
    function pointXY(moreEncoding = {}) {
      const spec = {
        "mark": "point",
        "encoding": extend(
          {
            "x": {"field": "year", "type": "ordinal"},
            "y": {"field": "yield", "type": "quantitative"}
          },
          moreEncoding
        ),
        "data": {"url": "data/barley.json"}
      };
      return spec;
    }

    describe('1D, horizontal', function() {
      const e = parseModel({
        "mark": "point",
        "encoding": {"x": {"field": "year", "type": "ordinal"}},
        "data": {"url": "data/barley.json"}
      });
      const def = marks.point.properties(e);
      it('should be centered', function() {
        expect(def.y).to.eql({value: e.fieldDef(Y).scale.bandWidth / 2});
      });
      it('should scale on x', function() {
        expect(def.x).to.eql({scale: X, field: 'year'});
      });
    });

    describe('1D, vertical', function() {
      const e = parseModel({
        "mark": "point",
        "encoding": {"y": {"field": "year", "type": "ordinal"}},
        "data": {"url": "data/barley.json"}
      });
      const def = marks.point.properties(e);
      it('should be centered', function() {
        expect(def.x).to.eql({value: e.fieldDef(X).scale.bandWidth / 2});
      });
      it('should scale on y', function() {
        expect(def.y).to.eql({scale: Y, field: 'year'});
      });
    });

    describe('2D, x and y', function() {
      const e = parseModel(pointXY());
      const def = marks.point.properties(e);
      it('should scale on x', function() {
        expect(def.x).to.eql({scale: X, field: 'year'});
      });
      it('should scale on y', function(){
        expect(def.y).to.eql({scale: Y, field: 'yield'});
      });
    });

    describe('3D', function() {
      describe('x,y,size', function () {
        const e = parseModel(pointXY({
          "size": {"field": "*", "type": "quantitative", "aggregate": "count"}
        }));
        const def = marks.point.properties(e);
        it('should have scale for size', function () {
          expect(def.size).to.eql({scale: SIZE, field: 'count'});
        });
      });

      describe('x,y,color', function () {
        const e = parseModel(pointXY({
          "color": {"field": "yield", "type": "quantitative"}
        }));
        const def = marks.point.properties(e);
        it('should have scale for color', function () {
          expect(def.stroke).to.eql({scale: COLOR, field: 'yield'});
        });
      });

      describe('x,y,shape', function () {
        const e = parseModel(pointXY({
          "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
        }));
        const def = marks.point.properties(e);
        it('should have scale for shape', function () {
          expect(def.shape).to.eql({scale: SHAPE, field: 'bin_yield_range'});
        });
      });
    });
  });

  describe('line', function() {
    function lineXY(moreEncoding = {}) {
      const spec = {
        "mark": "line",
        "encoding": extend(
          {
            "x": {"field": "year", "type": "ordinal"},
            "y": {"field": "yield", "type": "quantitative"}
          },
          moreEncoding
        ),
        "data": {"url": "data/barley.json"}
      };
      return spec;
    }

    describe('2D, x and y', function() {
      const e = parseModel(lineXY()),
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
        const e = parseModel(lineXY({
          "color": {"field": "Acceleration", "type": "quantitative"}
        }));
        const def = marks.line.properties(e);
        it('should have scale for color', function () {
          expect(def.stroke).to.eql({scale: COLOR, field: 'Acceleration'});
        });
      });
    });
  });

  describe('area', function() {

    function areaXY(moreEncoding = {}) {
      return {
        "mark": "area",
        "encoding": extend(
          {
            "x": {"field": "Displacement", "type": "quantitative"},
            "y": {"field": "Acceleration", "type": "quantitative"}
          },
          moreEncoding
        ),
        "data": {"url": "data/cars.json"}
      };
    }

    describe('2D, x and y', function() {
      const e = parseModel(areaXY()),
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
        const e = parseModel(areaXY({
          "color": {"field": "Miles_per_Gallon", "type": "quantitative"}
        }));
        const def = marks.area.properties(e);
        it('should have scale for color', function () {
          expect(def.fill).to.eql({scale: COLOR, field: 'Miles_per_Gallon'});
        });
      });
    });
  });

  // TODO add other type of marks
});
