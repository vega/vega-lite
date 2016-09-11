/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {parseMark} from '../../../src/compile/mark/mark';

describe('Mark (Non-path based Mark)', function() {
  describe('Bar', function() {
    describe('Aggregated with a color with binned x', function () {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "x": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
          "y": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
          "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
        }
      });

      it('should stack data correctly', function() {
        const markGroup = parseMark(model);
        const stackTransform = markGroup[0].from.transform[0];
        assert.equal(stackTransform.type, 'stack');

        assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_mid']);
        assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
        assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
      });
    });

    describe('Aggregated with a color with binned x', function () {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": "Cost__Other", "aggregate": "sum"},
          "x": {"bin": true, "type": "quantitative", "field": "Cost__Total_$"},
          "color": {"type": "ordinal", "field": "Effect__Amount_of_damage"}
        }
      });

      it('should stack data correctly', function() {
        const markGroup = parseMark(model);
        const stackTransform = markGroup[0].from.transform[0];
        assert.equal(stackTransform.type, 'stack');

        assert.deepEqual(stackTransform.groupby, ['bin_Cost__Total_$_mid']);
        assert.deepEqual(stackTransform.field, 'sum_Cost__Other');
        assert.deepEqual(stackTransform.sortby, ['-Effect__Amount_of_damage']);
      });
    });
  });

  describe('Projection', function() {
    describe('Projection with geopath', function () {
      const model = parseUnitModel({
        "mark": "path",
        "encoding": {
          "path":{
              "type":"geojson"
          }
        },
        "projection": {
          "type": "albersUsa",
          "scale": 1,
          "translate": [1, 2],
          "center": [0, 0]
        }
      });

      it('should add transform in from with correct projection properties', function() {
        const markGroup = parseMark(model);
        // Get the marks from the wrapper
        const marks = markGroup[0].marks;
        const geoTransform = marks[0].from.transform[0];
        assert.equal(geoTransform.type, 'geopath');
        assert.equal(geoTransform.projection, 'albersUsa');
        assert.equal(geoTransform.scale, 1);
        assert.deepEqual(geoTransform.translate, [1, 2]);
        assert.deepEqual(geoTransform.center, [0, 0]);
      });
    });

    describe('Projection with geo', function () {
      const model = parseUnitModel({
        "mark": "point",
        "encoding": {
          "y": {"type": "latitude", "field": "foo"},
        }
      });

      it('should stack data correctly', function() {
        const markGroup = parseMark(model);
        // Get the marks from the wrapper
        const marks = markGroup[0].marks;
        const geoTransform = marks[0].from.transform[0];
        assert.equal(geoTransform.type, 'geo');
        assert.equal(geoTransform.lat, 'foo');
      });
    });
  });
});
