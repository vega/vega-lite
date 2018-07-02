/* tslint:disable:quotemark */
import { assert } from 'chai';
import { COLOR } from '../../../src/channel';
import * as encode from '../../../src/compile/legend/encode';
import { TimeUnit } from '../../../src/timeunit';
import { TEMPORAL } from '../../../src/type';
import { parseUnitModelWithScale } from '../../util';
describe('compile/legend', function () {
    describe('encode.symbols', function () {
        it('should not have fill, strokeDash, or strokeDashOffset', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            }), COLOR, 'symbol');
            assert.deepEqual(symbol.fill, { value: 'transparent' });
            assert.isUndefined((symbol || {}).strokeDash);
            assert.isUndefined((symbol || {}).strokeDashOffset);
        });
        it('should return specific symbols.shape.value if user has specified', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    shape: { value: "square" }
                }
            }), COLOR, 'symbol');
            assert.deepEqual(symbol.shape['value'], 'square');
        });
        it('should have default opacity', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" }
                }
            }), COLOR, 'symbol');
            assert.deepEqual(symbol.opacity['value'], 0.7); // default opacity is 0.7.
        });
        it('should return the maximum value when there is a condition', function () {
            var symbol = encode.symbols({ field: 'a', type: 'nominal' }, {}, parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    opacity: {
                        condition: { selection: "brush", value: 1 },
                        value: 0
                    }
                }
            }), COLOR, 'symbol');
            assert.deepEqual(symbol.opacity['value'], 1);
        });
    });
    describe('encode.gradient', function () {
        it('should have default opacity', function () {
            var gradient = encode.gradient({ field: 'a', type: 'quantitative' }, {}, parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative" }
                }
            }), COLOR, 'gradient');
            assert.deepEqual(gradient.opacity['value'], 0.7); // default opacity is 0.7.
        });
    });
    describe('encode.labels', function () {
        it('should return correct expression for the timeUnit: TimeUnit.MONTH', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var fieldDef = { field: 'a', type: TEMPORAL, timeUnit: TimeUnit.MONTH };
            var label = encode.labels(fieldDef, {}, model, COLOR, 'gradient');
            var expected = "timeFormat(datum.value, '%b')";
            assert.deepEqual(label.text.signal, expected);
        });
        it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var fieldDef = { field: 'a', type: TEMPORAL, timeUnit: TimeUnit.QUARTER };
            var label = encode.labels(fieldDef, {}, model, COLOR, 'gradient');
            var expected = "'Q' + quarter(datum.value)";
            assert.deepEqual(label.text.signal, expected);
        });
    });
});
//# sourceMappingURL=encode.test.js.map