/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, COLOR} from '../../src/channel';
import {line} from '../../src/compile/mark-line';

describe('Mark: Line', function() {
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
        def = line.properties(e);
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
      const def = line.properties(e);
      it('should have scale for color', function () {
        expect(def.stroke).to.eql({scale: COLOR, field: 'Acceleration'});
      });
    });
  });
});
