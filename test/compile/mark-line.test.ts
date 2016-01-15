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

  describe('with x, y', function() {
    const model = parseModel(lineXY());
    const props = line.properties(model);

    it('should have scale for x', function() {
      expect(props.x).to.eql({scale: X, field: 'year'});
    });

    it('should have scale for y', function(){
      expect(props.y).to.eql({scale: Y, field: 'yield'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseModel(lineXY({
      "color": {"field": "Acceleration", "type": "quantitative"}
    }));
    const props = line.properties(model);

    it('should have scale for color', function () {
      expect(props.stroke).to.eql({scale: COLOR, field: 'Acceleration'});
    });
  });
});
