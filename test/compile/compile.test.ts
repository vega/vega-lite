/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import * as compile from '../../src/compile/compile';

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

      const rootGroup = compile.compileRootGroup(model);

      it('should refer to layout data', function() {
        assert.deepEqual(rootGroup.from, {"data": "layout"});
      });

    });

  });

  describe('compileTitle()', function() {
    describe('ordinal', function() {
      const titleName = "titleName";
      const model = parseModel({
        "title": titleName,
        "data": {
          "values": [
            {"a": "A"}
          ]
        },
        "mark": "point",
        "encoding": {
          "x": {"field": "a", "type": "ordinal"}
        }
      });

      const titleGroup = compile.compileTitle(model);

      it('should refer to layout data', function() {
        assert.deepEqual(titleGroup.from, {"data": "layout"});
      });

      it('should have type of text', function() {
        assert.deepEqual(titleGroup.type, "text");
      });

      it('should have title set correctly', function() {
        assert.deepEqual(titleGroup.properties.update.text.value, titleName);
      });
    });

  });

});
