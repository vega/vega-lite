/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import {assembleRootGroup} from '../../src/compile/compile';

describe('Compile', function() {

  describe('compileRootGroup()', function() {
    describe('ordinal', function() {
      const model = parseModel({
        "description": "A simple bar chart with embedded data.",
        "data": {
          "values": [
            {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
            {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
            {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
          ]
        },
        "mark": "bar",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"},
          "y": {"field": "b", "type": "quantitative"}
        }
      });

      const rootGroup = assembleRootGroup(model);

      it('should refer to layout data', function() {
        assert.deepEqual(rootGroup.from, {"data": "layout"});
      });

    });

  });
});
