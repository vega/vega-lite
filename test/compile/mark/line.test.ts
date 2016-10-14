/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {X, Y, COLOR} from '../../../src/channel';
import {line} from '../../../src/compile/mark/line';

describe('Mark: Line', function() {
  it('should return the correct mark type', function() {
    assert.equal(line.markType(), 'line');
  });

  describe('with x, y', function() {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "line",
      "encoding": {
        "x": {"field": "year", "type": "ordinal"},
        "y": {"field": "yield", "type": "quantitative"}
      }
    });
    const props = line.properties(model);

    it('should have scale for x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });

    it('should have scale for y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "line",
      "encoding": {
        "x": {"field": "year", "type": "ordinal"},
        "y": {"field": "yield", "type": "quantitative"},
        "color": {"field": "Acceleration", "type": "quantitative"}
      }
    });
    const props = line.properties(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'Acceleration'});
    });
  });

  describe('with stacked y', function() {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "line",
      "encoding": {
        "x": {"field": "year", "type": "ordinal"},
        "y": {"field": "yield", "type": "quantitative", "aggregate": "sum"},
        "color": {"field": "a", "type": "nominal"}
      },
      "config": {"mark": {"stacked": "zero"}}
    });
    const props = line.properties(model);

    it('should use y_end', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'sum_yield_end'});
    });
  });

  describe('with stacked x', function() {
    const model = parseUnitModel({
      "data": {"url": "data/barley.json"},
      "mark": "line",
      "encoding": {
        "y": {"field": "year", "type": "ordinal"},
        "x": {"field": "yield", "type": "quantitative", "aggregate": "sum"},
        "color": {"field": "a", "type": "nominal"}
      },
      "config": {"mark": {"stacked": "zero"}}
    });
    const props = line.properties(model);

    it('should use x_end', function() {
      assert.deepEqual(props.x, {scale: X, field: 'sum_yield_end'});
    });
  });
});
