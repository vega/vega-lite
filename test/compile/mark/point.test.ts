/* tslint:disable quotemark */

import {assert} from 'chai';
import {COLOR, SHAPE, SIZE, X, Y} from '../../../src/channel';
import {circle, point, square} from '../../../src/compile/mark/point';
import {Encoding} from '../../../src/encoding';
import {defaultMarkConfig} from '../../../src/mark';
import {UnitSpec} from '../../../src/spec';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Point', function() {

  function pointXY(moreEncoding: Encoding<string> = {}): UnitSpec {
    return {
      "mark": "point",
      "encoding": {
          "x": {"field": "year", "type": "ordinal"},
          "y": {"field": "yield", "type": "quantitative"},
          ...moreEncoding,
      },
      "data": {"url": "data/barley.json"}
    };
  }

  describe('with x', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "point",
      "encoding": {"x": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.encodeEntry(model);

    it('should be centered on y', function() {
      assert.deepEqual(props.y, {
        mult: 0.5,
        signal: 'height'
      });
    });

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
  });

  describe('with stacked x', function() {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
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
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "point",
      "encoding": {"y": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.encodeEntry(model);

    it('should be centered on x', function() {
      assert.deepEqual(props.x, {
        mult: 0.5,
        signal: 'width'
      });
    });

    it('should scale on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'year'});
    });
  });

  describe('with stacked y', function() {
    // This is a simplified example for stacked point.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
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
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY());
    const props = point.encodeEntry(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });

    it('should be an unfilled circle', function() {
      assert.deepEqual(props.fill, {value: 'transparent'});
      assert.deepEqual(props.stroke, {value: defaultMarkConfig.color});
    });
  });

  describe('with band x and quantitative y', () => {
    it('should offset band position by half band', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "data": {"url": "data/barley.json"},
        "mark": "point",
        "encoding":{
          "x": {"field": "year", "type": "ordinal", "scale": {"type": "band"}},
          "y": {"field": "yield", "type": "quantitative"}
        }
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.x, {scale: 'x', field: 'year', band: 0.5});
    });
  });

  describe('with x, y, size', function () {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({
      "size": {"aggregate": "count", "type": "quantitative"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for size', function () {
      assert.deepEqual(props.size, {scale: SIZE, field: 'count_*'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({
      "color": {"field": "yield", "type": "quantitative"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, and condition-only color', function () {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        "color": {"condition": {"selection": "test", "field": "yield", "type": "quantitative"}}
      }),
      selection: {test: {type: 'single'}}
    });
    model.parseSelection();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', function () {
      assert.isArray(props.stroke);
      assert.equal(props.stroke['length'], 2);
      assert.equal(props.stroke[0].scale, COLOR);
      assert.equal(props.stroke[0].field, 'yield');
    });
  });

  describe('with x, y, and condition-only color', function () {
    const model = parseUnitModelWithScaleAndLayoutSize({
      ...pointXY({
        "color": {"condition": {"test": "true", "field": "yield", "type": "quantitative"}}
      })
    });
    model.parseSelection();
    const props = point.encodeEntry(model);

    it('should have one condition for color with scale for "yield"', function () {
      assert.isArray(props.stroke);
      assert.equal(props.stroke['length'], 2);
      assert.equal(props.stroke[0].test, "true");
      assert.equal(props.stroke[1].value, "#4c78a8");
    });
  });

  describe('with x, y, shape', function () {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({
      "shape": {"field": "site", "type": "nominal"}
    }));
    const props = point.encodeEntry(model);

    it('should have scale for shape', function () {
      assert.deepEqual(props.shape, {scale: SHAPE, field: 'site'});
    });
  });

  describe('with constant color, shape, and size', function() {
    const model = parseUnitModelWithScaleAndLayoutSize(pointXY({
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
      const model = parseUnitModelWithScaleAndLayoutSize({
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

    it('should apply stroke mark config over color mark config', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"color":"red", "stroke": "blue"}}
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.stroke, {value: "blue"});
    });

    it('should apply stroke mark config over color mark config', function() {
      const model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"point": {"color":"red", "stroke": "blue"}}
      });
      const props = point.encodeEntry(model);
      assert.deepEqual(props.stroke, {value: "blue"});
    });

  });

  describe('with tooltip', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "point",
      "encoding": {
        "tooltip": {"value": "foo"}
      }
    });
    const props = point.encodeEntry(model);

    it('should pass tooltip value to encoding', () => {
      assert.deepEqual(props.tooltip, {value: "foo"});
    });
  });

  describe('with href', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "point",
      "encoding": {
        "href": {"value": "https://idl.cs.washington.edu/"}
      }
    });
    const props = point.encodeEntry(model);

    it('should pass href value to encoding', () => {
      assert.deepEqual(props.href, {value: 'https://idl.cs.washington.edu/'});
    });
  });
});

describe('Mark: Square', function() {
  it('should have correct shape', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.encodeEntry(model);

    assert.propertyVal(props.shape, 'value', 'square');
  });

  it('should be filled by default', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.encodeEntry(model);

    assert.propertyVal(props.fill, 'value', 'blue');
  });

  it('with config.mark.filled:false should have transparent fill', function() {
    const model = parseUnitModelWithScaleAndLayoutSize({
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

    assert.propertyVal(props.stroke, 'value', 'blue');
    assert.propertyVal(props.fill, 'value', 'transparent');
  });
});

describe('Mark: Circle', function() {
  const model = parseUnitModelWithScaleAndLayoutSize({
    "mark": "circle",
    "encoding": {
      "color": {"value": "blue"}
    }
  });
  const props = circle.encodeEntry(model);

  it('should have correct shape', function() {
    assert.propertyVal(props.shape, 'value', 'circle');
  });

  it('should be filled by default', function() {
    assert.propertyVal(props.fill, 'value', 'blue');
  });

  it('with config.mark.filled:false should have transparent fill', function() {
    const filledCircleModel = parseUnitModelWithScaleAndLayoutSize({
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

    assert.propertyVal(filledCircleProps.stroke, 'value', 'blue');
    assert.propertyVal(filledCircleProps.fill, 'value', 'transparent');
  });
});
