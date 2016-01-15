/* tslint:disable quote */

import {expect} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, COLOR} from '../../src/channel';
import {area} from '../../src/compile/mark-area';

describe('Mark: Area', function() {

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

  describe('with x, y', function() {
    const model = parseModel(areaXY());
    const props = area.properties(model);

    it('should have scale for x', function() {
      expect(props.x).to.eql({scale: X, field: 'Displacement'});
    });

    it('should have scale for y', function(){
      expect(props.y).to.eql({scale: Y, field: 'Acceleration'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseModel(areaXY({
      "color": {"field": "Miles_per_Gallon", "type": "quantitative"}
    }));

    const props = area.properties(model);

    it('should have scale for color', function () {
      expect(props.fill).to.eql({scale: COLOR, field: 'Miles_per_Gallon'});
    });
  });
});
