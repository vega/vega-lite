/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {point} from '../../src/compiler/marks-point';

describe('compile/marks-point', function() {
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
    const def = point.properties(e);
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
    const def = point.properties(e);
    it('should be centered', function() {
      expect(def.x).to.eql({value: e.fieldDef(X).scale.bandWidth / 2});
    });
    it('should scale on y', function() {
      expect(def.y).to.eql({scale: Y, field: 'year'});
    });
  });

  describe('2D, x and y', function() {
    const e = parseModel(pointXY());
    const def = point.properties(e);
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
      const def = point.properties(e);
      it('should have scale for size', function () {
        expect(def.size).to.eql({scale: SIZE, field: 'count'});
      });
    });

    describe('x,y,color', function () {
      const e = parseModel(pointXY({
        "color": {"field": "yield", "type": "quantitative"}
      }));
      const def = point.properties(e);
      it('should have scale for color', function () {
        expect(def.stroke).to.eql({scale: COLOR, field: 'yield'});
      });
    });

    describe('x,y,shape', function () {
      const e = parseModel(pointXY({
        "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
      }));
      const def = point.properties(e);
      it('should have scale for shape', function () {
        expect(def.shape).to.eql({scale: SHAPE, field: 'bin_yield_range'});
      });
    });
  });
});
