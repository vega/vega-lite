/* tslint:disable quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {extend} from '../../../src/util';
import {X, Y, COLOR} from '../../../src/channel';
import {area} from '../../../src/compile/mark/area';

describe('Mark: Area', function() {
  it('should return the correct mark type', function() {
    assert.equal(area.markType(), 'area');
  });

  function verticalArea(moreEncoding = {}) {
    return {
      "mark": "area",
      "encoding": extend(
        {
          "x": {"timeUnit": "year", "field": "Year", "type": "temporal"},
          "y": {"aggregate": "count", "field": "*", "type": "quantitative"}
        },
        moreEncoding
      ),
      "data": {"url": "data/cars.json"}
    };
  }

  describe('vertical area, with log', function() {
    const model = parseUnitModel({
      "mark": "area",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const props = area.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', function(){
      assert.isUndefined(props.height);
    });
  });

  describe('vertical area, with zero=false', function() {
    const model = parseUnitModel({
      "mark": "area",
      "encoding": {
        "x": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "y": {"scale": {"zero": false}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });
    const props = area.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.y2, {field: {group: 'height'}});
    });

    it('should has no height', function(){
      assert.isUndefined(props.height);
    });
  });

  describe('vertical area', function() {
    const model = parseUnitModel(verticalArea());
    const props = area.properties(model);

    it('should have scale for x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'year_Year'});
    });

    it('should have scale for y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'count'});
    });

    it('should have the correct value for y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', value: 0});
    });
  });

  describe('vertical stacked area with color', function () {
    const model = parseUnitModel(verticalArea({
      "color": {"field": "Origin", "type": "quantitative"}
    }));

    const props = area.properties(model);

    it('should have the correct value for y', () => {
      assert.deepEqual(props.y, {scale: 'y', field: 'count_start'});
    });

    it('should have the correct value for y2', () => {
      assert.deepEqual(props.y2, {scale: 'y', field: 'count_end'});
    });

    it('should have correct orient', () => {
      assert.deepEqual(props.orient, {value: 'vertical'});
    });

    it('should have scale for color', function () {
      assert.deepEqual(props.fill, {scale: COLOR, field: 'Origin'});
    });
  });

  function horizontalArea(moreEncoding = {}) {
    return {
      "mark": "area",
      "encoding": extend(
        {
          "y": {"timeUnit": "year", "field": "Year", "type": "temporal"},
          "x": {"aggregate": "count", "field": "*", "type": "quantitative"}
        },
        moreEncoding
      ),
      "data": {"url": "data/cars.json"}
    };
  }

  describe('horizontal area', function() {
    const model = parseUnitModel(horizontalArea());
    const props = area.properties(model);

    it('should have scale for y', function() {
      assert.deepEqual(props.y, {scale: Y, field: 'year_Year'});
    });

    it('should have scale for x', function(){
      assert.deepEqual(props.x, {scale: X, field: 'count'});
    });

    it('should have the correct value for x2', () => {
      assert.deepEqual(props.x2, {scale: 'x' , value: 0});
    });
  });

  describe('horizontal area, with log', function() {
    const model = parseUnitModel({
      "mark": "area",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"type": 'log'}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });

    const props = area.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', function(){
      assert.isUndefined(props.width);
    });
  });

  describe('horizontal area, with zero=false', function() {
    const model = parseUnitModel({
      "mark": "area",
      "encoding": {
        "y": {"bin": true, "type": "quantitative", "field": "IMDB_Rating"},
        "x": {"scale": {"zero": false}, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean"}
      },
      "data": {"url": 'data/movies.json'}
    });

    const props = area.properties(model);

    it('should end on axis', function() {
      assert.deepEqual(props.x2, {value: 0});
    });

    it('should have no width', function(){
      assert.isUndefined(props.width);
    });
  });

  describe('horizontal stacked area with color', function () {
    const model = parseUnitModel(horizontalArea({
      "color": {"field": "Origin", "type": "nominal"}
    }));

    const props = area.properties(model);

    it('should have the correct value for x', () => {
      assert.deepEqual(props.x, {scale: 'x', field: 'count_start'});
    });

    it('should have the correct value for x2', () => {
      assert.deepEqual(props.x2, {scale: 'x', field: 'count_end'});
    });

    it('should have correct orient', () => {
      assert.deepEqual(props.orient, {value: 'horizontal'});
    });

    it('should have scale for color', function () {
      assert.deepEqual(props.fill, {scale: COLOR, field: 'Origin'});
    });
  });

  describe('ranged area', function () {
    it ('vertical area should work with aggregate', function() {
      const model = parseUnitModel({
        "data": {"url": "data/cars.json"},
        "mark": "area",
        "encoding": {
          "x": {"timeUnit": "year", "field": "Year", "type": "temporal" },
          "y": {"aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
          "y2": {"aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
        }
      });
      const props = area.properties(model);
      assert.deepEqual(props.x, { scale: 'x', field: 'year_Year'});
      assert.deepEqual(props.y, { scale: 'y', field: 'min_Weight_in_lbs' });
      assert.deepEqual(props.y2, { scale: 'y', field: 'max_Weight_in_lbs' });
    });

    it ('horizontal area should work with aggregate', function() {
      const model = parseUnitModel({
        "data": {"url": "data/cars.json"},
        "mark": "area",
        "encoding": {
          "y": {"timeUnit": "year", "field": "Year", "type": "temporal" },
          "x": {"aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
          "x2": {"aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
        }
      });
      const props = area.properties(model);
      assert.deepEqual(props.y, { scale: 'y', field: 'year_Year'});
      assert.deepEqual(props.x, { scale: 'x', field: 'min_Weight_in_lbs' });
      assert.deepEqual(props.x2, { scale: 'x', field: 'max_Weight_in_lbs' });
    });
  });
});
