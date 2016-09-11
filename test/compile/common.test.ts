/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {defaultConfig} from '../../src/config';
import {TimeUnit} from '../../src/timeunit';
import {field, FieldDef} from '../../src/fielddef';
import {TEMPORAL, QUANTITATIVE, ORDINAL, NOMINAL} from '../../src/type';
import {numberFormat, timeTemplate, applyColorAndOpacity, hasGeoTransform, geoTransform} from '../../src/compile/common';


describe('Common', function() {
  describe('timeFormat()', function() {
    it('should get the right time template for month with shortTimeLabels=true', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, true, defaultConfig);
      assert.equal(template,'{{datum.month_a | time:\'%b\'}}');
    });

    it('should get the right time template for month with shortTimeLabels=false', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.MONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, undefined, false, defaultConfig);
      assert.equal(template,'{{datum.month_a | time:\'%B\'}}');
    });

    it('should get the right time template for yearmonth with custom format', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.YEARMONTH, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.MONTH, '%Y', true, defaultConfig);
      assert.equal(template,'{{datum.yearmonth_a | time:\'%Y\'}}');
    });

    it('should get the right time template for quarter', function() {
      const fieldDef: FieldDef = {timeUnit: TimeUnit.QUARTER, field: 'a', type: TEMPORAL};
      const template = timeTemplate(field(fieldDef, {datum: true}), TimeUnit.QUARTER, undefined, true, defaultConfig);
      assert.equal(template, 'Q{{datum.quarter_a | quarter}}');
    });

    it('should get the right time template for yearquarter', function() {
      const template = timeTemplate('datum.data', TimeUnit.YEARQUARTER, undefined, true, defaultConfig);
      assert.equal(template, '{{datum.data | time:\'%y-\'}}Q{{datum.data | quarter}}');
    });
  });

  describe('numberFormat()', function() {
    it('should use number format for quantitative scale', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: 'd'}), 'd');
    });

    it('should support empty number format', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, undefined, {numberFormat: ''}), '');
    });

    it('should use format if provided', function() {
      assert.equal(numberFormat({field: 'a', type: QUANTITATIVE}, 'a', 'd'), 'a');
    });

    it('should not use number format for binned quantitative scale', function() {
      assert.equal(numberFormat({bin: true, field: 'a', type: QUANTITATIVE}, undefined, 'd'), undefined);
    });

    it('should not use number format for non-quantitative scale', function() {
      for (let type of [TEMPORAL, NOMINAL, ORDINAL]) {
        assert.equal(numberFormat({bin: true, field: 'a', type: type}, undefined, 'd'), undefined);
      }
    });
  });

  describe('applyColorAndOpacity()', function() {
    it('opacity should be mapped to a field if specified', function() {
      const model = parseUnitModel({
        "data": {"url": "data/movies.json"},
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"field": "US_Gross", "type": "quantitative"}
        }
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.field, 'US_Gross');
    });

    it('opacity should be mapped to a value if specified', function() {
      const model = parseUnitModel({
        "data": {"url": "data/movies.json"},
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"value": 0.5}
        }
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.value, 0.5);
    });
  });

  describe('hasGeoTransform()', function() {
    describe('geopath transform', function() {
      it('satisfy both condition', function() {
        const model = parseUnitModel({
          "data": {
            "url": "data/us-10m.json",
            "format": {"type": "topojson", "feature": "states"}
          },
          "mark": "path",
          "encoding": {"path": {"type": "geojson"}},
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('only path mark condition is satisfied', function() {
        const model = parseUnitModel({
          "data": {
            "url": "data/us-10m.json",
            "format": {"type": "topojson", "feature": "states"}
          },
          "mark": "path"
        });
        assert.deepEqual(hasGeoTransform(model), false);
      });
    });

    describe('geo transform', function() {
      it('x is of type longitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('x is of type latitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "latitude"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('y is of type longitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "y": {"field": "latitude","type": "longitude"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('y is of type latitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "y": {"field": "latitude","type": "latitude"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('Both x and y are specified to be latitude/longitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"},
            "y": {"field": "latitude","type": "latitude"}
          }
        });

        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('Both x and y are specified to be not latitude/longitude', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "quantitative"},
            "y": {"field": "latitude","type": "quantitative"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), false);
      });
    });
  });

  describe('geoTransform()', function() {
    it('should have tranform type geopath ', function() {
      const model = parseUnitModel({
        "data": {
          "url": "data/us-10m.json",
          "format": {"type": "topojson", "feature": "states"}
        },
        "projection":{
          "type":"albersUsa",
          "scale":1000,
          "translate":[400, 250],
          "center":[0, 0]
        },
        "mark": "path",
        "encoding": {"path": {"type": "geojson"}},
      });

      let transform = geoTransform(model);
      assert.deepEqual(transform.type, "geopath");
      assert.deepEqual(transform.projection, "albersUsa");
      assert.deepEqual(transform.scale, 1000);
      assert.deepEqual(transform.translate, [400, 250]);
      assert.deepEqual(transform.center, [0, 0]);
    });

    it('should have tranform type geo ', function() {
        const model = parseUnitModel({
          "data": {"url": "data/airports.csv"},
          "projection": {
            "type": "albersUsa",
            "scale": 1000,
            "translate": [400, 250],
            "center": [0, 0]
          },
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"}
          }
        });

      let transform = geoTransform(model);
      assert.deepEqual(transform.type, "geo");
      assert.deepEqual(transform.projection, "albersUsa");
      assert.deepEqual(transform.scale, 1000);
      assert.deepEqual(transform.translate, [400, 250]);
      assert.deepEqual(transform.center, [0, 0]);
    });
  });
});
