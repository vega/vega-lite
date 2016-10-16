/* tslint:disable quotemark */


// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {X, Y, SIZE} from '../../../src/channel';
import {tick} from '../../../src/compile/mark/tick';

describe('Mark: Tick', function() {
  it('should return the correct mark type', function() {
    assert.equal(tick.markType(), 'rect');
  });

  describe('with stacked x', function() {
    // This is a simplified example for stacked tick.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "tick",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"mark": {"stacked": "zero"}}
    });

    const props = tick.properties(model);

    it('should use stack_end on x', function() {
      assert.deepEqual(props.xc, {scale: X, field: 'sum_a_end'});
    });
  });


  describe('with stacked y', function() {
    // This is a simplified example for stacked tick.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModel({
      "mark": "tick",
      "encoding": {
        "y": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"mark": {"stacked": "zero"}}
    });

    const props = tick.properties(model);

    it('should use stack_end on y', function() {
      assert.deepEqual(props.yc, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with quantitative x', function() {
    const model = parseUnitModel({
      'mark': 'tick',
      'encoding': {'x': {'field': 'Horsepower', 'type': 'quantitative'}},
      'data': {'url': 'data/cars.json'}
    });

    const props = tick.properties(model);
    it('should be centered on y', function() {
      assert.deepEqual(props.yc, {value: 10.5});
    });

    it('should scale on x', function() {
      assert.deepEqual(props.xc, {scale: X, field: 'Horsepower'});
    });

    it('width should tick thickness with orient vertical', function() {
      assert.deepEqual(props.width, { value: 1});
    });
  });

  describe('with quantitative y', function() {
    const model = parseUnitModel({
      'mark': 'tick',
      'encoding': {'y': {'field': 'Cylinders','type': 'quantitative'}},
      'data': {'url': 'data/cars.json'}
    });

    const props = tick.properties(model);
    it('should be centered on x', function() {
      assert.deepEqual(props.xc, {value: 10.5});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.yc, {scale: Y, field: 'Cylinders'});
    });

    it('height should tick thickness with orient horizontal', function() {
      assert.deepEqual(props.height, { value: 1});
    });
  });

  describe('with quantitative x and ordinal y', function() {
    const model = parseUnitModel({
      'mark': 'tick',
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders','type': 'ordinal'}
        },
      'data': {'url': 'data/cars.json'}
    });
    const props = tick.properties(model);

    it('should scale on x', function() {
      assert.deepEqual(props.xc, {scale: X, field: 'Horsepower'});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.yc, {scale: Y, field: 'Cylinders'});
    });

    it('wiidth should be tick thickness with default orient vertical', function() {
      assert.deepEqual(props.width, { value: 1});
    });

    it('height should be matched to field with default orient vertical', function() {
      assert.deepEqual(props.height, { value: 14});
    });
  });

  describe('width should be mapped to size', function() {
    const model = parseUnitModel({
      'mark': 'tick',
      'config': {'mark': {'orient': 'vertical'}},
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders', 'type': 'ordinal'},
          'size': {'field': 'Acceleration'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.properties(model);
    it('width should change with size field', function() {
      assert.deepEqual(props.height, {'field': 'Acceleration', 'scale': SIZE});
    });
  });

  describe('height should be mapped to size', function() {
    const model = parseUnitModel({
      'mark': 'tick',
      'config': {'mark': {'orient': 'horizontal'}},
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders', 'type': 'ordinal'},
          'size': {'field': 'Acceleration'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.properties(model);
    it('height should change with size field', function() {
      assert.deepEqual(props.width, {'field': 'Acceleration', 'scale': SIZE});
    });
  });
});
