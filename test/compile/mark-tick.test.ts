// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
import {assert} from 'chai';
import {parseModel} from '../util';
import {X, Y} from '../../src/channel';
import {tick} from '../../src/compile/mark-tick';

describe('Mark: Tick', function() {
  it('should return the correct mark type', function() {
    assert.equal(tick.markType(), 'rect');
  });

  describe('with quantitative x', function() {
    const model = parseModel({
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
  });

  describe('with quantitative y', function() {
    const model = parseModel({
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
  });

  describe('with quantitative x and ordinal y', function() {
    const model = parseModel({
      'mark': 'tick',
      'encoding':
        {
          'x': {'field': 'Horsepower', 'type': 'quantitative'},
          'y': {'field': 'Cylinders','type': 'ordinal'}
        },
      'data': {'url': 'data/cars.json'},
    });
    const props = tick.properties(model);

    it('should scale on x', function() {
      assert.deepEqual(props.xc, {scale: X, field: 'Horsepower'});
    });

    it('should scale on y', function() {
      assert.deepEqual(props.yc, {scale: Y, field: 'Cylinders'});
    });
  });
});
