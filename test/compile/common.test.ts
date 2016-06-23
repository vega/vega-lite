/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {X} from '../../src/channel';
import {timeFormat, formatMixins, applyColorAndOpacity, hasGeoTransform, geoTransform} from '../../src/compile/common';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(timeFormat(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), '%b');

      assert.equal(timeFormat(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X), '%B');

      assert.equal(timeFormat(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }), X), undefined);
    });
  });

  describe('format()', function() {
    it('should use time format type for time scale', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }), X, undefined), {
        formatType: 'time',
        format: '%B'
      });
    });

    it('should use default time format if we don\'t have a good format', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal"}
        }
      }), X, undefined), {
        formatType: 'time',
        format: '%Y-%m-%d'
      });
    });

    it('should use number format for quantitative scale', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: 'd'
        }
      }), X, undefined), {
        format: 'd'
      });
    });

    it('should support empty number format', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        },
        config: {
          numberFormat: ''
        }
      }), X, undefined), {
        format: ''
      });
    });

    it('should use format if provided', function() {
      assert.deepEqual(formatMixins(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', type: "quantitative"}
        }
      }), X, 'foo'), {
        format: 'foo'
      });
    });
  });

  describe('applyColorAndOpacity()', function() {
    it('opacity should be mapped to a field if specified', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"field": "US_Gross", "type": "quantitative"}
        },
        "data": {"url": "data/movies.json"}
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.field, 'US_Gross');
    });

    it('opacity should be mapped to a value if specified', function() {
      const model = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true},
          "opacity": {"value": 0.5}
        },
        "data": {"url": "data/movies.json"}
      });

      let p: any = {};
      applyColorAndOpacity(p, model);
      assert.deepEqual(p.opacity.value, 0.5);
    });
  });

  describe('hasGeoTransform()', function() {
    describe('should return true iff path mark is specified and encoding.geopath.type is geojson', function() {
      it('both conditions are satisfied', function() {
        const model = parseUnitModel({
          "mark": "path",
          "encoding": {"geopath": {"type": "geojson"}},
          "data": {
            "url": "data/us-10m.json",
            "format": {"type": "topojson", "feature": "states"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('only path mark condition is satisfied', function() {
        const model = parseUnitModel({
          "mark": "path",
          "data": {
            "url": "data/us-10m.json",
            "format": {"type": "topojson", "feature": "states"}
          }
        });
        assert.deepEqual(hasGeoTransform(model), false);
      });
    });

    describe('should return true iff x/y is of type longitude/latitude', function() {
      it('x is of type longitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"}
          },
          "data": {"url": "data/airports.csv"}
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('x is of type latitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "latitude"}
          },
          "data": {"url": "data/airports.csv"}
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('y is of type longitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "y": {"field": "latitude","type": "longitude"}
          },
          "data": {"url": "data/airports.csv"}
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('y is of type latitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "y": {"field": "latitude","type": "latitude"}
          },
          "data": {"url": "data/airports.csv"}
        });
        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('Both x and y are specified to be latitude/longitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"},
            "y": {"field": "latitude","type": "latitude"}
          },
          "data": {"url": "data/airports.csv"}
        });

        assert.deepEqual(hasGeoTransform(model), true);
      });

      it('Both x and y are specified to be not latitude/longitude', function() {
        const model = parseUnitModel({
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "quantitative"},
            "y": {"field": "latitude","type": "quantitative"}
          },
          "data": {"url": "data/airports.csv"}
        });
        assert.deepEqual(hasGeoTransform(model), false);
      });
    });
  });

  describe('geoTransform()', function() {
    it('should have tranform type geopath ', function() {
      const model = parseUnitModel({
        "mark": "path",
        "encoding": {"geopath": {"type": "geojson"}},
        "data": {
          "url": "data/us-10m.json",
          "format": {"type": "topojson", "feature": "states"}
        },
        "projection":{
          "type":"albersUsa",
          "scale":1000,
          "translate":[400, 250],
          "center":[0, 0]
        }
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
          "mark": "point",
          "encoding": {
            "x": {"field": "longitude","type": "longitude"}
          },
          "data": {"url": "data/airports.csv"},
          "projection": {
            "type": "albersUsa",
            "scale": 1000,
            "translate": [400, 250],
            "center": [0, 0]
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
