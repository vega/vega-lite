/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {bar} from '../../../src/compile/mark/bar';

describe('Mark: Bar', function() {
  it('should return the correct mark type', function() {
    assert.equal(bar.markType(), 'rect');
  });

  describe('with size.value specified', function() {
    // TODO
  });

  describe('vertical, with log', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', function(){
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal, with log', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });

    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', function(){
      assert.isUndefined(props.width);
    });
  });

  describe('vertical, with zero=false', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"zero": false}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', function(){
      assert.isUndefined(props.height);
    });
  });

  describe('horizontal, with zero=false', function() {
    const model = parseUnitModel({
      "mark": "bar",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"zero": false}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });

    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', function(){
      assert.isUndefined(props.width);
    });
  });

  describe('vertical', function() {
    const model = parseUnitModel({
        "mark": "bar",
        "encoding": {"y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}},
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
    });

    it('should have no height', function(){
      assert.isUndefined(props.height);
    });

    it('should have x-offset', function(){
      assert.deepEqual(props.x.offset, 2);
    });
  });

  describe('horizontal', function() {
    const model = parseUnitModel({
        "mark": "bar",
        "encoding": {"x": {"type": "quantitative", "field": 'US_Gross', "aggregate": 'sum'}},
        "data": {"url": 'data/movies.json'}
      });
    const props = bar.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.x2, {scale: 'x', value: 0});
    });

    it('should have no width', function(){
      assert.isUndefined(props.width);
    });

    it('should have y-offset', function(){
      assert.deepEqual(props.y2, {
        field: {group: 'height'},
        offset: -1
      });
    });
  });

  describe('ranged bar', function() {
    it('vertical bars should work with aggregate', function() {
      const model = parseUnitModel({
        "data": { "url": "data/population.json" },
        "mark": "bar",
        "encoding": {
          "x": { "field": "age", "type": "ordinal" },
          "y": { "field": "people", "aggregate": "q1", "type": "quantitative"},
          "y2": { "field": "people", "aggregate": "q3", "type": "quantitative"}
        }
      });

      const props = bar.properties(model);
      assert.deepEqual(props.xc, { scale: 'x', field: 'age'});
      assert.deepEqual(props.y, { scale: 'y', field: 'q1_people' });
      assert.deepEqual(props.y2, { scale: 'y', field: 'q3_people' });
    });

    it('horizontal bars should work with aggregate', function() {
      const model = parseUnitModel({
        "data": { "url": "data/population.json" },
        "mark": "bar",
        "encoding": {
          "y": { "field": "age", "type": "ordinal" },
          "x": { "field": "people", "aggregate": "q1", "type": "quantitative"},
          "x2": { "field": "people", "aggregate": "q3", "type": "quantitative"}
        }
      });

      const props = bar.properties(model);
      assert.deepEqual(props.yc, { scale: 'y', field: 'age'});
      assert.deepEqual(props.x, { scale: 'x', field: 'q1_people' });
      assert.deepEqual(props.x2, { scale: 'x', field: 'q3_people' });
    });
  });
});
