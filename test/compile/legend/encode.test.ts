/* tslint:disable:quotemark */

import {assert} from 'chai';
import {COLOR} from '../../../src/channel';
import * as encode from '../../../src/compile/legend/encode';
import {TimeUnit} from '../../../src/timeunit';
import {NOMINAL, ORDINAL, TEMPORAL} from '../../../src/type';
import {parseUnitModel, parseUnitModelWithScale} from '../../util';

describe('compile/legend', function() {
  describe('encode.symbols', function() {
    it('should not have fill, strokeDash, or strokeDashOffset', function() {
      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
          mark: "point",
          encoding: {
            x: {field: "a", type: "nominal"},
            color: {field: "a", type: "nominal"}
          }
        }), COLOR);
        assert.isUndefined((symbol||{}).fill);
        assert.isUndefined((symbol||{}).strokeDash);
        assert.isUndefined((symbol||{}).strokeDashOffset);
    });

    it('should return specific symbols.shape.value if user has specified', function() {
      const symbol = encode.symbols({field: 'a', type: 'nominal'}, {}, parseUnitModelWithScale({
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
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.MONTH};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      const expected = `timeFormat(datum.value, '%b')`;
      assert.deepEqual(label.text.signal, expected);
    });

    it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function() {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "temporal", timeUnit: "quarter"}}
      });

      const fieldDef = {field: 'a', type: TEMPORAL, timeUnit: TimeUnit.QUARTER};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      const expected = `'Q' + quarter(datum.value)`;
      assert.deepEqual(label.text.signal, expected);
    });

     it('should return correct expression when you want to format the legend as integers', () => {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "ordinal", legend: {formatType: 'number', format: 'd'}}
        }
      });
      const fieldDef = {field: 'a', type: ORDINAL, legend: {formatType: 'number', format: "d"}};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      assert.deepEqual(label, {text: {signal: `format(a, 'd')`}});
    });

    it('should return correct expression when you want to format the legend in a time format', () => {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal"},
          color: {field: "a", type: "nominal", legend: {formatType: 'time', format: "%y"}}
        },
        config: {
          timeFormat: '%y',
          legend: {
            shortTimeLabels: false
          }
        }
      });
      const fieldDef = {field: 'a', type: NOMINAL, formatType: "time", legend: {formatType: 'time', format: "%y"}};
      const label = encode.labels(fieldDef, {}, model, COLOR);
      assert.deepEqual(label, {text: {signal: `timeFormat(datum.value, '%y')`}});
    });
  });
});
