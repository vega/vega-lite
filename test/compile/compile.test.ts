/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import * as compile from '../../src/compile/compile';

describe('Compile', function() {

  describe('compileRootGroup()', function() {

    describe('non-ordinal', function() {
      const model = parseModel({
        "description": "A scatterplot showing horsepower and miles per gallons.",
        "data": {"url": "data/cars.json"},
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"},
        }
      });

      const rootGroup = compile.compileRootGroup(model);

      it('should not refer to layout data', function() {
        assert.notDeepEqual(rootGroup.from, {"data": "layout"});
      });

    });

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

      const rootGroup = compile.compileRootGroup(model);

      it('should refer to layout data', function() {
        assert.deepEqual(rootGroup.from, {"data": "layout"});
      });

    });

  });
});
