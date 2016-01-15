/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {point} from '../../src/compile/mark-point';

describe('Mark: Point', function() {
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
    const model = parseModel({
      "mark": "point",
      "encoding": {"x": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered', function() {
      expect(props.y).to.eql({value: model.fieldDef(Y).scale.bandWidth / 2});
    });

    it('should scale on x', function() {
      expect(props.x).to.eql({scale: X, field: 'year'});
    });
  });

  describe('1D, vertical', function() {
    const model = parseModel({
      "mark": "point",
      "encoding": {"y": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered', function() {
      expect(props.x).to.eql({value: model.fieldDef(X).scale.bandWidth / 2});
    });

    it('should scale on y', function() {
      expect(props.y).to.eql({scale: Y, field: 'year'});
    });
  });

  describe('2D, x and y', function() {
    const model = parseModel(pointXY());
    const props = point.properties(model);

    it('should scale on x', function() {
      expect(props.x).to.eql({scale: X, field: 'year'});
    });
    it('should scale on y', function(){
      expect(props.y).to.eql({scale: Y, field: 'yield'});
    });
  });

  describe('3D', function() {
    describe('x,y,size', function () {
      const model = parseModel(pointXY({
        "size": {"field": "*", "type": "quantitative", "aggregate": "count"}
      }));
      const props = point.properties(model);

      it('should have scale for size', function () {
        expect(props.size).to.eql({scale: SIZE, field: 'count'});
      });
    });

    describe('x,y,color', function () {
      const model = parseModel(pointXY({
        "color": {"field": "yield", "type": "quantitative"}
      }));
      const props = point.properties(model);

      it('should have scale for color', function () {
        expect(props.stroke).to.eql({scale: COLOR, field: 'yield'});
      });
    });

    describe('x,y,shape', function () {
      const model = parseModel(pointXY({
        "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
      }));
      const props = point.properties(model);
      
      it('should have scale for shape', function () {
        expect(props.shape).to.eql({scale: SHAPE, field: 'bin_yield_range'});
      });
    });
  });
});
