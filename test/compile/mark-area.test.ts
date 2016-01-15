/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, COLOR} from '../../src/channel';
import {area} from '../../src/compile/mark-area';

describe('compile/mark-area', function() {

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
        def = area.properties(e);
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
      const def = area.properties(e);
      it('should have scale for color', function () {
        expect(def.fill).to.eql({scale: COLOR, field: 'Miles_per_Gallon'});
      });
    });
  });
});
