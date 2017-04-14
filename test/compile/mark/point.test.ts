/* tslint:disable quotemark */

import {assert} from 'chai';
import {COLOR, SHAPE, SIZE, X, Y} from '../../../src/channel';
import {circle, point, square} from '../../../src/compile/mark/point';
import {defaultMarkConfig} from '../../../src/mark';
import {UnitSpec} from '../../../src/spec';
import {extend} from '../../../src/util';
import {parseUnitModel} from '../../util';

describe('Mark: Point', function() {

  function pointXY(moreEncoding = {}): UnitSpec {
    return {
      "mark": "point",
      "encoding": extend(
        {
          "x": {"field": "year", "type": "ordinal"},
          "y": {"field": "yield", "type": "quantitative"}
        },
        moreEncoding
      ),
      "data": {"url": "data/barley.json"}
    };
  }

  describe('with x', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {"x": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.encodeEntry(model);

    it('should be centered on y', function() {
      assert.deepEqual(props.y, {value: 21 / 2});
    });

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
  });

  describe('with stacked x', function() {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack": "zero"}
    });

    const props = point.encodeEntry(model);

    it('should use stack_end on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'sum_a_end'});
    });
  });

  describe('with y', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {"y": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.encodeEntry(model);

    it('should be centered on x', function() {
      assert.deepEqual(props.x, {value: 21 / 2});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'year'});
    });
  });

  describe('with stacked y', function() {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {
        "y": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack": "zero"}
    });

    const props = point.encodeEntry(model);

    it('should use stack_end on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with x and y', function() {
    const model = parseUnitModel(pointXY());
    const props = point.encodeEntry(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });

    it('should scale on y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });

    it('should be an unfilled circle', function(){
      assert.deepEqual(props.fill, {value: 'transparent'});
      assert.deepEqual(props.stroke, {value: defaultMarkConfig.color});
    });
  });

  describe('with band x and quantitative y', () => {
    it('should offset band position by half band', () => {
      const model = parseUnitModel({
        "data": {"url": "data/barley.json"},
        "mark": "point",
        "encoding":{
          "x": {"field": "year", "type": "ordinal", "scale": {"type": "band"}},
          "y": {"field": "yield", "type": "quantitative"}
        }
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.x, {scale: 'x', field: 'year', offset: {scale: 'x', band: 0.5}});
    });
  });

  describe('with x, y, size', function () {
    const model = parseUnitModel(pointXY({
      "size": {"aggregate": "count", "type": "quantitative"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for size', function () {
      assert.deepEqual(props.size, {scale: SIZE, field: 'count_*'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseUnitModel(pointXY({
      "color": {"field": "yield", "type": "quantitative"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, shape', function () {
    const model = parseUnitModel(pointXY({
      "shape": {"field": "site", "type": "nominal"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for shape', function () {
      assert.deepEqual(props.shape, {scale: SHAPE, field: 'site'});
    });
  });

  describe('with constant color, shape, and size', function() {
    const model = parseUnitModel(pointXY({
      "shape": {"value": "circle"},
      "color": {"value": "red"},
      "size": {"value": 23}
    }));
    const props = point.encodeEntry(model);
    it('should correct shape, color and size', function () {
      assert.deepEqual(props.shape, {value: "circle"});
      assert.deepEqual(props.stroke, {value: "red"});
      assert.deepEqual(props.size, {value: 23});
    });
  });

  describe('with configs', function() {
    it('should apply color from mark-specific config over general mark config', function() {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"color":"blue"}, "point": {"color":"red"}}
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.stroke, {value: "red"});
    });

    it('should apply color config and not apply stroke config', function() {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"color":"red", "stroke": "blue"}}
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.stroke, {value: "red"});
    });

    it('should not apply stroke config but instead output default color', function() {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"stroke": "red"}}
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.stroke, {value: defaultMarkConfig.color});
    });
  });
});

describe('Mark: Square', function() {
  it('should have correct shape', function() {
    const model = parseUnitModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.encodeEntry(model);

    assert.equal(props.shape.value, 'square');
  });

  it('should be filled by default', function() {
    const model = parseUnitModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.encodeEntry(model);

    assert.equal(props.fill.value, 'blue');
  });

  it('with config.mark.filled:false should have transparent fill', function() {
    const model = parseUnitModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      },
      "config" : {
        "mark" : {
          "filled" : false
        }
      }
    });

    const props = square.encodeEntry(model);

    assert.equal(props.stroke.value, 'blue');
    assert.equal(props.fill.value, 'transparent');
  });
});

describe('Mark: Circle', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "color": {"value": "blue"}
    }
  });
  const props = circle.encodeEntry(model);

  it('should have correct shape', function() {
    assert.equal(props.shape.value, 'circle');
  });

  it('should be filled by default', function() {
    assert.equal(props.fill.value, 'blue');
  });

  it('with config.mark.filled:false should have transparent fill', function() {
    const filledCircleModel = parseUnitModel({
      "mark": "circle",
      "encoding": {
        "color": {"value": "blue"}
      },
      "config" : {
        "mark" : {
          "filled" : false
        }
      }
    });

    const filledCircleProps = circle.encodeEntry(filledCircleModel);

    assert.equal(filledCircleProps.stroke.value, 'blue');
    assert.equal(filledCircleProps.fill.value, 'transparent');
  });
});
