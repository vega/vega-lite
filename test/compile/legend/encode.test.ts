/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseUnitModel} from '../../util';
import {COLOR, SHAPE, SIZE, OPACITY} from '../../../src/channel';
import * as encode from '../../../src/compile/legend/encode';
import {TimeUnit} from '../../../src/timeunit';
import {TEMPORAL, QUANTITATIVE} from '../../../src/type';

describe('compile/legend', function() {
  describe('encode.symbols', function() {
    it('should have strokeWidth if filled (by default)', function() {
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

    it('should return not override size of the symbol for shape channel', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            shape: {field: "b", type: "nominal", legend: {"shape": "circle"}}}
        }), SHAPE);
        assert.isUndefined(symbol.size);
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
});
