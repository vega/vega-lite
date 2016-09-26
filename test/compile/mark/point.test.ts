/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {extend} from '../../../src/util';
import {X, Y, SIZE, COLOR, SHAPE} from '../../../src/channel';
import {point, square, circle} from '../../../src/compile/mark/point';

describe('Mark: Point', function() {
  it('should return the correct mark type', function() {
    assert.equal(point.markType(), 'symbol');
  });

  function pointXY(moreEncoding = {}) {
    const spec = {
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
    return spec;
  }

  describe('with x', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {"x": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered on y', function() {
      assert.deepEqual(props.y, {value: 21 / 2});
    });

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
  });

  describe('with y', function() {
    const model = parseUnitModel({
      "mark": "point",
      "encoding": {"y": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered on x', function() {
      assert.deepEqual(props.x, {value: 21 / 2});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'year'});
    });
  });

  describe('with x and y', function() {
    const model = parseUnitModel(pointXY());
    const props = point.properties(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
    it('should scale on y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });
  });

  describe('with x, y, size', function () {
    const model = parseUnitModel(pointXY({
      "size": {"field": "*", "type": "quantitative", "aggregate": "count"}
    }));
    const props = point.properties(model);

    it('should have scale for size', function () {
      assert.deepEqual(props.size, {scale: SIZE, field: 'count'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseUnitModel(pointXY({
      "color": {"field": "yield", "type": "quantitative"}
    }));
    const props = point.properties(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, shape', function () {
    const model = parseUnitModel(pointXY({
      "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
    }));
    const props = point.properties(model);

    it('should have scale for shape', function () {
      assert.deepEqual(props.shape, {scale: SHAPE, field: 'bin_yield_range'});
    });
  });

  describe('with constant color, shape, and size', function() {
    const model = parseUnitModel(pointXY({
      "shape": {"value": "circle"},
      "color": {"value": "red"},
      "size": {"value": 23}
    }));
    const props = point.properties(model);
    it('should correct shape, color and size', function () {
      assert.deepEqual(props.shape, {value: "circle"});
      assert.deepEqual(props.stroke, {value: "red"});
      assert.deepEqual(props.size, {value: 23});
    });
  });

  describe('with configs', function() {
    it('should apply stroke config over color config', function() {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"color":"red", "stroke": "blue"}}
      });
      const props = point.properties(model);
      assert.deepEqual(props.stroke, {value: "blue"});
    });

    it('should apply color config', function() {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "x": {"field": "Horsepower","type": "quantitative"},
          "y": {"field": "Miles_per_Gallon","type": "quantitative"}
        },
        "config": {"mark": {"color":"red"}}
      });
      const props = point.properties(model);
      assert.deepEqual(props.stroke, {value: "red"});
    });
  });
});

describe('Mark: Square', function() {
  it('should return the correct mark type', function() {
    assert.equal(square.markType(), 'symbol');
  });

  it('should have correct shape', function() {
    const model = parseUnitModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.properties(model);

    assert.equal(props.shape.value, 'square');
  });

  it('should be filled by default', function() {
    const model = parseUnitModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.properties(model);

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

    const props = square.properties(model);

    assert.equal(props.stroke.value, 'blue');
    assert.equal(props.fill.value, 'transparent');
  });
});

describe('Mark: Circle', function() {
  it('should return the correct mark type', function() {
    assert.equal(circle.markType(), 'symbol');
  });

  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "color": {"value": "blue"}
    }
  });
  const props = circle.properties(model);

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

    const filledCircleProps = circle.properties(filledCircleModel);

    assert.equal(filledCircleProps.stroke.value, 'blue');
    assert.equal(filledCircleProps.fill.value, 'transparent');
  });
});
