/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../util';
import {COLOR, X} from '../../src/channel';
import * as legend from '../../src/compile/legend';

describe('Legend', function() {
  describe('parseLegend()', function() {
    it('should output explicitly specified properties', function() {
      it('should produce a Vega axis object with correct type and scale', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        });
        const def = legend.parseLegend(model, X);
        assert.isObject(def);
        assert.equal(def.title, "a");
      });
    });
  });

  describe('offset()', function () {
    it('should add explicitly specified offset', function () {
      const offset = legend.offset({offset: 10}, {field: 'a'});
      assert.deepEqual(offset, 10);
    });

    it('should return 0 by default', function () {
      const offset = legend.offset({}, {field: 'a'});
      assert.deepEqual(offset, 0);
    });
  });

  describe('orient()', function () {
    it('should add explicitly specified orient', function () {
      const orient = legend.orient({orient: "horizontal"}, {field: 'a'});
      assert.deepEqual(orient, "horizontal");
    });

    it('should return vertical by default', function () {
      const orient = legend.orient({}, {field: 'a'});
      assert.deepEqual(orient, "vertical");
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = legend.title({title: 'Custom'}, {field: 'a'});
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = legend.title({}, {field: 'a'});
      assert.deepEqual(title, 'a');
    });
  });

  describe('formatMixins()', function() {
    it('should not be added for bin', function() {
      assert.deepEqual(legend.formatMixins({}, parseUnitModel({
        mark: "point",
        encoding: {
          x: {field:'a', bin: true}
        }
      }), X), {});
    });
  });

  describe('properties.symbols', function() {
    it('should initialize if filled', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR);
        assert.deepEqual(symbol.strokeWidth.value, 2);
    });

    it('should return specific color value', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal",  legend: {"symbolColor": "red"}}
          }
        }), COLOR);
        assert.deepEqual(symbol.fill.value, "red");
    });

    it('should return specific shape value', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolShape": "diamond"}}
          }
        }), COLOR);
        assert.deepEqual(symbol.shape.value, "diamond");
    });

    it('should return specific size of the symbol', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolSize": 20}}}
        }), COLOR);
        assert.deepEqual(symbol.size.value, 20);
    });

    it('should return specific width of the symbol', function() {
      const symbol = legend.properties.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolStrokeWidth": 20}}}
        }), COLOR);
        assert.deepEqual(symbol.strokeWidth.value, 20);
    });
  });

  describe('properties.labels', function() {
    it('should return alignment value of the label', function() {
      const label = legend.properties.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelAlign": "left"}}}
        }), COLOR);
        assert.deepEqual(label.align.value, "left");
    });

    it('should return color value of the label', function() {
      const label = legend.properties.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelColor": "blue"}}}
        }), COLOR);
        assert.deepEqual(label.stroke.value, "blue");
    });

    it('should return font of the label', function() {
      const label = legend.properties.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelFont": "what"}}}
        }), COLOR);
        assert.deepEqual(label.font.value, "what");
    });

    it('should return font size of the label', function() {
      const label = legend.properties.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelFontSize": 20}}}
        }), COLOR);
        assert.deepEqual(label.fontSize.value, 20);
    });

    it('should return baseline of the label', function() {
      const label = legend.properties.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelBaseline": "middle"}}}
        }), COLOR);
        assert.deepEqual(label.baseline.value, "middle");
    });
  });

  describe('properties.title', function() {
    it('should return color of the title', function() {
      const title = legend.properties.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleColor": "black"}}}
        }), COLOR);
        assert.deepEqual(title.stroke.value, "black");
    });

    it('should return font of the title', function() {
      const title = legend.properties.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFont": "abcd"}}}
        }), COLOR);
        assert.deepEqual(title.font.value, "abcd");
    });

    it('should return font size of the title', function() {
      const title = legend.properties.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFontSize": 22}}}
        }), COLOR);
        assert.deepEqual(title.fontSize.value, 22);
    });

    it('should return font weight of the title', function() {
      const title = legend.properties.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFontWeight": 5}}}
        }), COLOR);
        assert.deepEqual(title.fontWeight.value, 5);
    });
  });
});
