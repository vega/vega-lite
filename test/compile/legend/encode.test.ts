/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {COLOR, SHAPE, SIZE, OPACITY} from '../../../src/channel';
import * as encode from '../../../src/compile/legend/encode';
import {TimeUnit} from '../../../src/timeunit';
import {TEMPORAL, QUANTITATIVE} from '../../../src/type';

describe('compile/legend', function() {
  describe('encode.symbols', function() {
    it('should initialize if filled', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR);
        assert.deepEqual(symbol.strokeWidth.value, 2);
    });

    it('should not have strokeDash and strokeDashOffset', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR);
        assert.isUndefined(symbol.strokeDash);
        assert.isUndefined(symbol.strokeDashOffset);
    });

    it('should return specific color value', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal",  legend: {"symbolColor": "red"}}
          }
        }), COLOR);
        assert.deepEqual(symbol.fill.value, "red");
    });

    it('should return specific shape value', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolShape": "diamond"}}
          }
        }), COLOR);
        assert.deepEqual(symbol.shape.value, "diamond");
    });

    it('should return specific size of the symbol', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolSize": 20}}}
        }), COLOR);
        assert.deepEqual(symbol.size.value, 20);
    });

    it('should return not override size of the symbol for size channel', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            size: {field: "b", type: "quantitative", legend: {"symbolSize": 20}}}
        }), SIZE);
        assert.isUndefined(symbol.size);
    });

    it('should return not override size of the symbol for shape channel', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            shape: {field: "b", type: "nominal", legend: {"shape": "circle"}}}
        }), SHAPE);
        assert.isUndefined(symbol.size);
    });

    it('should return specific width of the symbol', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"symbolStrokeWidth": 20}}}
        }), COLOR);
        assert.deepEqual(symbol.strokeWidth.value, 20);
    });

    it('should create legend for SVG path', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          },
          config: {
            point: {
              shape: "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z"
            }
          }
        }), COLOR);

        assert.deepEqual(symbol.shape.value, "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z");
    });

    it('should override color for binned and continous scales', function() {
      const symbol = encode.symbols({field: 'a', bin: true}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "quantitative", bin: true}}
        }), COLOR);
        assert.deepEqual(symbol.stroke, {"scale": "color","field": "value"});
    });

    it('should override size for binned and continous scales', function() {
      const symbol = encode.symbols({field: 'a', bin: true}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            size: {field: "a", type: "quantitative", bin: true}}
        }), SIZE);
        assert.deepEqual(symbol.size, {"scale": "size","field": "value"});
    });

    it('should override opacity for binned and continous scales', function() {
      const symbol = encode.symbols({field: 'a', bin: true}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            opacity: {field: "a", type: "quantitative", bin: true}}
        }), OPACITY);
        assert.deepEqual(symbol.opacity, {"scale": "opacity","field": "value"});
    });
  });

  describe('encode.labels', function() {
    it('should return alignment value of the label', function() {
      const label = encode.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelAlign": "left"}}}
        }), COLOR);
        assert.deepEqual(label.align.value, "left");
    });

    it('should return color value of the label', function() {
      const label = encode.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelColor": "blue"}}}
        }), COLOR);
        assert.deepEqual(label.fill.value, "blue");
    });

    it('should return font of the label', function() {
      const label = encode.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelFont": "what"}}}
        }), COLOR);
        assert.deepEqual(label.font.value, "what");
    });

    it('should return font size of the label', function() {
      const label = encode.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelFontSize": 20}}}
        }), COLOR);
        assert.deepEqual(label.fontSize.value, 20);
    });

    it('should return baseline of the label', function() {
      const label = encode.labels({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"labelBaseline": "middle"}}}
        }), COLOR);
        assert.deepEqual(label.baseline.value, "middle");
    });

    it('should return correct expression for the timeUnit: TimeUnit.MONTH', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "month"}}
      });
      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      let expected = `timeFormat(datum.value, '%b')`;
      assert.deepEqual(label.text.signal, expected);
    });

    it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "quarter"}}
      });
      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.QUARTER};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      let expected = `'Q' + quarter(datum.value)`;
      assert.deepEqual(label.text.signal, expected);
    });

    it('should use special scale for binned and continuous scales to set label text', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "quantitative", bin: true}}
      });
      const fieldDef = {field: 'a', type: QUANTITATIVE, bin: true};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      let expected = {
        field: "value",
        scale: "color_bin_legend_label"
      };
      assert.deepEqual(label.text, expected);
    });
  });

  describe('encode.title', function() {
    it('should return color of the title', function() {
      const title = encode.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleColor": "black"}}}
        }), COLOR);
        assert.deepEqual(title.fill.value, "black");
    });

    it('should return font of the title', function() {
      const title = encode.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFont": "abcd"}}}
        }), COLOR);
        assert.deepEqual(title.font.value, "abcd");
    });

    it('should return font size of the title', function() {
      const title = encode.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFontSize": 22}}}
        }), COLOR);
        assert.deepEqual(title.fontSize.value, 22);
    });

    it('should return font weight of the title', function() {
      const title = encode.title({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal", legend: {"titleFontWeight": 5}}}
        }), COLOR);
        assert.deepEqual(title.fontWeight.value, 5);
    });
  });
});
