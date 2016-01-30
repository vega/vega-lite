/* tslint:disable quote */

import {assert} from 'chai';
import {parseModel} from '../util';
import {extend} from '../../src/util'
import {X, Y, SIZE, COLOR, SHAPE} from '../../src/channel';
import {point, square, circle} from '../../src/compile/mark-point';

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
    const model = parseModel({
      "mark": "point",
      "encoding": {"x": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered on y', function() {
      assert.deepEqual(props.y, {value: model.fieldDef(Y).scale.bandWidth / 2});
    });

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
  });

  describe('with y', function() {
    const model = parseModel({
      "mark": "point",
      "encoding": {"y": {"field": "year", "type": "ordinal"}},
      "data": {"url": "data/barley.json"}
    });

    const props = point.properties(model);

    it('should be centered on x', function() {
      assert.deepEqual(props.x, {value: model.fieldDef(X).scale.bandWidth / 2});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'year'});
    });
  });

  describe('with x and y', function() {
    const model = parseModel(pointXY());
    const props = point.properties(model);

    it('should scale on x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year'});
    });
    it('should scale on y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'yield'});
    });
  });

  describe('with x, y, size', function () {
    const model = parseModel(pointXY({
      "size": {"field": "*", "type": "quantitative", "aggregate": "count"}
    }));
    const props = point.properties(model);

    it('should have scale for size', function () {
      assert.deepEqual(props.size, {scale: SIZE, field: 'count'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseModel(pointXY({
      "color": {"field": "yield", "type": "quantitative"}
    }));
    const props = point.properties(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.stroke, {scale: COLOR, field: 'yield'});
    });
  });

  describe('with x, y, shape', function () {
    const model = parseModel(pointXY({
      "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
    }));
    const props = point.properties(model);

    it('should have scale for shape', function () {
      assert.deepEqual(props.shape, {scale: SHAPE, field: 'bin_yield_range'});
    });
  });
});

describe('Mark: Square', function() {
  it('should return the correct mark type', function() {
    assert.equal(square.markType(), 'symbol');
  });

  it('should have correct shape', function() {
    const model = parseModel({
      "mark": "square",
      "encoding": {
        "color": {"value": "blue"}
      }
    });
    const props = square.properties(model);

    assert.equal(props.shape.value, 'square');
  });

  it('should be filled by default', function() {
    const model = parseModel({
      "mark": "square",
      "config": {
        "mark": {"color": "blue"}
      }
    });
    const props = square.properties(model);

    assert.equal(props.fill.value, 'blue');
  });

  it('should support config.mark.filled:false', function() {
    const model = parseModel({
      "mark": "square",
      "config" : {
        "mark" : {
          "color": "blue",
          "filled" : false
        }
      }
    });

    const props = square.properties(model);

    assert.equal(props.stroke.value, 'blue');
    assert.isUndefined(props.fill, 'no fill was defined');
  });
});

describe('Mark: Circle', function() {
  it('should return the correct mark type', function() {
    assert.equal(circle.markType(), 'symbol');
  });

  const model = parseModel({
    "mark": "circle",
    "config": {
      "mark": {"color": "blue"}
    }
  });
  const props = circle.properties(model);

  it('should have correct shape', function() {
    assert.equal(props.shape.value, 'circle');
  });

  it('should be filled by default', function() {
    assert.equal(props.fill.value, 'blue');
  });

  it('should support config.mark.filled:false', function() {
    const model = parseModel({
      "mark": "circle",
      "config" : {
        "mark" : {
          "color": "blue",
          "filled" : false
        }
      }
    });

    const props = circle.properties(model);

    assert.equal(props.stroke.value, 'blue');
    assert.isUndefined(props.fill);
  });
});
