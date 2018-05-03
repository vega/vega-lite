/* tslint:disable quotemark */


// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
import { assert } from 'chai';
import { SIZE, X, Y } from '../../../src/channel';
import { tick } from '../../../src/compile/mark/tick';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';

describe('Mark: Tick', () =>  {
  describe('with stacked x', () =>  {
    // This is a simplified example for stacked tick.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "tick",
      "encoding": {
        "x": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack":  "zero"}
    });

    const props = tick.encodeEntry(model);

    it('should use stack_end on x', () =>  {
      assert.deepEqual(props.xc, {scale: X, field: 'sum_a_end'});
    });
  });


  describe('with stacked y', () =>  {
    // This is a simplified example for stacked tick.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      "mark": "tick",
      "encoding": {
        "y": {"aggregate": "sum", "field": "a", "type": "quantitative"},
        "color": {"field": "b", "type": "ordinal"}
      },
      "data": {"url": "data/barley.json"},
      "config": {"stack":  "zero"}
    });

    const props = tick.encodeEntry(model);

    it('should use stack_end on y', () =>  {
      assert.deepEqual(props.yc, {scale: Y, field: 'sum_a_end'});
    });
  });

  describe('with quantitative x', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'tick',
      'encoding': {'x': {'field': 'Horsepower', 'type': 'quantitative'}},
      'data': {'url': 'data/cars.json'}
    });

    const props = tick.encodeEntry(model);
    it('should be centered on y', () =>  {
      assert.deepEqual(props.yc, {
        mult: 0.5,
        signal: 'height'
      });
    });

    it('should scale on x', () =>  {
      assert.deepEqual(props.xc, {scale: X, field: 'Horsepower'});
    });

    it('width should tick thickness with orient vertical', () =>  {
      assert.deepEqual(props.width, {value: 1});
    });
  });

  describe('with quantitative y', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'tick',
      'encoding': {'y': {'field': 'Cylinders','type': 'quantitative'}},
      'data': {'url': 'data/cars.json'}
    });

    const props = tick.encodeEntry(model);
    it('should be centered on x', () =>  {
      assert.deepEqual(props.xc, {
        mult: 0.5,
        signal: 'width'
      });
    });

    it('should scale on y', () =>  {
      assert.deepEqual(props.yc, {scale: Y, field: 'Cylinders'});
    });

    it('height should tick thickness with orient horizontal', () =>  {
      assert.deepEqual(props.height, {value: 1});
    });
  });

  describe('with quantitative x and ordinal y', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'tick',
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders','type': 'ordinal'}
        },
      'data': {'url': 'data/cars.json'}
    });
    const props = tick.encodeEntry(model);

    it('should scale on x', () =>  {
      assert.deepEqual(props.xc, {scale: X, field: 'Horsepower'});
    });

    it('should scale on y', () =>  {
      assert.deepEqual(props.yc, {scale: Y, field: 'Cylinders'});
    });

    it('wiidth should be tick thickness with default orient vertical', () =>  {
      assert.deepEqual(props.width, {value: 1});
    });

    it('height should be matched to field with default orient vertical', () =>  {
      assert.deepEqual(props.height, {value: 14});
    });
  });

  describe('vertical ticks', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'tick',
      'config': {'mark': {'orient': 'vertical'}},
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders', 'type': 'ordinal'},
          'size': {'field': 'Acceleration', 'type': 'quantitative'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.encodeEntry(model);
    it('maps size to height', () =>  {
      assert.deepEqual(props.height, {'field': 'Acceleration', 'scale': SIZE});
    });
  });

  describe('vertical ticks with size in mark def', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': {'type': 'tick', 'size': 5},
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders', 'type': 'ordinal'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.encodeEntry(model);
    it('maps size to height in Vega', () =>  {
      assert.deepEqual(props.height, {value: 5});
    });
  });

  describe('vertical ticks (implicit)', () =>  {
    const model = parseUnitModelWithScaleAndLayoutSize({
      'mark': 'tick',
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders', 'type': 'ordinal'},
          'size': {'field': 'Acceleration', 'type': 'quantitative'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.encodeEntry(model);
    it('maps size to height in Vega', () =>  {
      assert.deepEqual(props.height, {'field': 'Acceleration', 'scale': SIZE});
    });
  });
});
