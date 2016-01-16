/* tslint:disable quote */

import {assert} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util';
import {text} from '../../src/compile/mark-text';
import {X, Y} from '../../src/channel';

describe('Mark: Text', function() {
  function textXY(moreEncoding = {}) {
    const spec = {
      "mark": "text",
      "encoding": extend(
        {
          "x": {"field": "Acceleration", "type": "ordinal"},
          "y": {"field": "Displacement", "type": "quantitative"}
        },
        moreEncoding
      ),
      "data": {"url": "data/cars.json"}
    };
    return spec;
  }

  describe('with x, y', function() {
    const model = parseModel(textXY());
    const props = text.properties(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'Acceleration'});
    });
    it('should scale on y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'Displacement'});
    });

    it('should be centered', function() {
      assert.deepEqual(props.align, {value: "center"});
    });


  });
});
