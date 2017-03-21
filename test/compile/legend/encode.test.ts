/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR, SHAPE} from '../../../src/channel';
import * as encode from '../../../src/compile/legend/encode';
import {TimeUnit} from '../../../src/timeunit';
import {TEMPORAL} from '../../../src/type';
import {parseUnitModel} from '../../util';

describe('compile/legend', function() {
  describe('encode.symbols', function() {
    it('should not have strokeDash and strokeDashOffset', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR);
        assert.isUndefined((symbol||{}).strokeDash);
        assert.isUndefined((symbol||{}).strokeDashOffset);
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

    it('should return specific symbols.shape.value if user has specified', function() {
      const symbol = encode.symbols({field: 'a'}, {}, parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            shape: {value: "square"}}
        }), COLOR);
        assert.deepEqual(symbol.shape.value, 'square');
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
  });
});
