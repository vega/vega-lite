/* tslint:disable quote */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {extend} from '../../../src/util'
import {X, Y, COLOR} from '../../../src/channel';
import {path} from '../../../src/compile/mark/path';

describe('Mark: path', function() {
  it('should return the correct mark type', function() {
    assert.equal(path.markType(), 'path');
  });

  function lineXY(moreEncoding = {}) {
    const spec = {
      "data": {
        "url":"data/us-10m.json",
        "format": {"type": "topojson", "feature": "states"}
      },
      "mark": "path",
      "encoding": {
        "path":{
            "type":"geojson"
        },
        "color": { "value": "#dedede"}
      }
    };
    return spec;
  }

  describe('with color, stroke and path', function() {
    const model = parseUnitModel(lineXY());
    const props = path.properties(model);

    it('should have correct color', function() {
      assert.deepEqual(props.fill.value, "#dedede");
    });

    it('should have correct stroke', function() {
      assert.deepEqual(props.stroke.value, "white");
    });

    it('should have correct path field', function() {
      assert.deepEqual(props.path.field, "layout_path");
    });
  });

});
