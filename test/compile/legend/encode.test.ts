/* tslint:disable:quotemark */

import {assert} from 'chai';
import {SignalRef} from '../../../node_modules/vega';
import {COLOR, SIZE} from '../../../src/channel';
import {LegendComponent} from '../../../src/compile/legend/component';
import * as encode from '../../../src/compile/legend/encode';
import {TimeUnit} from '../../../src/timeunit';
import {TEMPORAL} from '../../../src/type';
import {parseUnitModelWithScale} from '../../util';

describe('compile/legend', function() {
  const symbolLegend = new LegendComponent({type: 'symbol'});
  const gradientLegend = new LegendComponent({type: 'gradient'});

  describe('encode.symbols', function() {
    it('should not have fill, strokeDash, or strokeDashOffset', function() {

      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR, symbolLegend);
        assert.deepEqual(symbol.fill, {value: 'transparent'});
        assert.isUndefined((symbol||{}).strokeDash);
        assert.isUndefined((symbol||{}).strokeDashOffset);
    });

    it('should have fill if a color encoding exists', function() {

      const symbol = encode.symbols({field: 'a', type: 'quantitative'}, {}, parseUnitModelWithScale({
          mark: {
            type: "circle",
            opacity: 0.3
          },
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"},
            size: {field: "a", type: "quantitative"}
          }
        }), SIZE, symbolLegend);
        assert.deepEqual(symbol.fill, {value: 'black'});
        assert.deepEqual(symbol.fillOpacity, {value: 0.3});
    });

    it('should return specific symbols.shape.value if user has specified', function() {

      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            shape: {value: "square"}}
        }), COLOR, symbolLegend);
        assert.deepEqual(symbol.shape['value'], 'square');
    });

    it('should have default opacity', function() {

      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"}}
        }), COLOR, symbolLegend);
      assert.deepEqual(symbol.opacity['value'], 0.7); // default opacity is 0.7.
    });

    it('should return the maximum value when there is a condition', function() {

      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            opacity: {
              condition: {selection: "brush", value: 1},
              value: 0
            }}
        }), COLOR, symbolLegend);
        assert.deepEqual(symbol.opacity['value'], 1);
    });
  });

  describe('encode.gradient', function() {
    it('should have default opacity', function() {
      const gradient = encode.gradient({field: 'a', type: 'quantitative'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "quantitative"}}
        }), COLOR, gradientLegend);

      assert.deepEqual(gradient.opacity['value'], 0.7); // default opacity is 0.7.
    });
  });

  describe('encode.labels', function() {
    it('should return correct expression for the timeUnit: TimeUnit.MONTH', function() {

      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      const label = encode.labels(fieldDef, {}, model, COLOR, gradientLegend);
      const expected = `timeFormat(datum.value, '%b')`;
      assert.deepEqual((label.text as SignalRef).signal, expected);
    });

    it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function() {

      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "quarter"}}
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.QUARTER};
      const label = encode.labels(fieldDef, {}, model, COLOR, gradientLegend);
      const expected = `'Q' + quarter(datum.value)`;
      assert.deepEqual((label.text as SignalRef).signal, expected);
    });
  });
});
