/* tslint:disable quote */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {extend} from '../../../src/util'
import {X, Y, COLOR} from '../../../src/channel';
import {area} from '../../../src/compile/mark/area';

describe('Mark: Area', function() {
  it('should return the correct mark type', function() {
    assert.equal(area.markType(), 'area');
  });

  function areaXY(moreEncoding = {}) {
    return {
      "mark": "area",
      "encoding": extend(
        {
          "x": {"field": "Displacement", "type": "quantitative"},
          "y": {"field": "Acceleration", "type": "quantitative"}
        },
        moreEncoding
      ),
      "data": {"url": "data/cars.json"}
    };
  }

  describe('with x, y', function() {
    const model = parseUnitModel(areaXY());
    const props = area.properties(model);

    it('should have scale for x', function() {
      assert.deepEqual(props.x, {scale: X, field: 'Displacement'});
    });

    it('should have scale for y', function(){
      assert.deepEqual(props.y, {scale: Y, field: 'Acceleration'});
    });
  });

  describe('with x, y, color', function () {
    const model = parseUnitModel(areaXY({
      "color": {"field": "Miles_per_Gallon", "type": "quantitative"}
    }));

    const props = area.properties(model);

    it('should have scale for color', function () {
      assert.deepEqual(props.fill, {scale: COLOR, field: 'Miles_per_Gallon'});
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
