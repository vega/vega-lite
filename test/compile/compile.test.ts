/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';

import * as log from '../../src/log';

import {compile, assembleRootGroup} from '../../src/compile/compile';


describe('Compile', function() {
  it('should throw error for invalid spec', () => {
    assert.throws(() => {
      compile({});
    }, Error, log.message.INVALID_SPEC);
  });

  describe('compile', () => {
    it('should return a spec with basic top-level properties, size signals, data and marks', () => {
      const spec = compile({
        "data": {
          "values": [{"a": "A","b": 28}]
        },
        "mark": "point"
      }).spec;

      assert.equal(spec.padding, 5);
      assert.equal(spec.autosize, 'pad');
      assert.deepEqual(spec.signals, [
        {
          name: 'width',
          update: "data('layout')[0].width"
        },
        {
          name: 'height',
          update: "data('layout')[0].height"
        }
      ]);

      assert.equal(spec.data.length, 2); // just source and layout
      assert.equal(spec.marks.length, 1); // just the root group
    });
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
