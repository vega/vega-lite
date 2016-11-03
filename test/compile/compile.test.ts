/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';

import {compile, assembleRootGroup} from '../../src/compile/compile';


describe('Compile', function() {
  it('should throw error for invalid spec', () => {
    assert.throws(() => {
      compile({} as any);
    }, Error, log.message.INVALID_SPEC);
  });

  describe('assembleRootGroup()', function() {
    it('produce correct from and size.', function() {
      const model = parseUnitModel({
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

      assert.deepEqual(rootGroup.from, {"data": "layout"});
      assert.deepEqual(rootGroup.encode.update.width, {field: "width"});
      assert.deepEqual(rootGroup.encode.update.height, {field: "height"});
    });

    it('produce correct from and size when a chart name is provided.', function() {
      const model = parseUnitModel({
        "name": "chart",
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

      assert.deepEqual(rootGroup.from, {"data": "chart_layout"});
      assert.deepEqual(rootGroup.encode.update.width, {field:"chart_width"});
      assert.deepEqual(rootGroup.encode.update.height, {field:"chart_height"});
    });

  });
});
