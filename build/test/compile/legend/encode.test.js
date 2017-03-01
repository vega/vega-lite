/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var encode = require("../../../src/compile/legend/encode");
var timeunit_1 = require("../../../src/timeunit");
var type_1 = require("../../../src/type");
describe('compile/legend', function () {
    describe('encode.symbols', function () {
        it('should not have strokeDash and strokeDashOffset', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR);
            chai_1.assert.isUndefined((symbol || {}).strokeDash);
            chai_1.assert.isUndefined((symbol || {}).strokeDashOffset);
        });
        it('should return not override size of the symbol for shape channel', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    shape: { field: "b", type: "nominal", legend: { "shape": "circle" } }
                }
            }), channel_1.SHAPE);
            chai_1.assert.isUndefined(symbol.size);
        });
        it('should return specific symbols.shape.value if user has specified', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    shape: { value: "square" }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.shape.value, 'square');
        });
        it('should override color for binned and continous scales', function () {
            var symbol = encode.symbols({ field: 'a', bin: true }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "quantitative", bin: true }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.stroke, { "scale": "color", "field": "value" });
        });
        it('should override size for binned and continous scales', function () {
            var symbol = encode.symbols({ field: 'a', bin: true }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    size: { field: "a", type: "quantitative", bin: true }
                }
            }), channel_1.SIZE);
            chai_1.assert.deepEqual(symbol.size, { "scale": "size", "field": "value" });
        });
        it('should override opacity for binned and continous scales', function () {
            var symbol = encode.symbols({ field: 'a', bin: true }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    opacity: { field: "a", type: "quantitative", bin: true }
                }
            }), channel_1.OPACITY);
            chai_1.assert.deepEqual(symbol.opacity, { "scale": "opacity", "field": "value" });
        });
    });
    describe('encode.labels', function () {
        it('should return correct expression for the timeUnit: TimeUnit.MONTH', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var fieldDef = { field: 'a', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.MONTH };
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR);
            var expected = "timeFormat(datum.value, '%b')";
            chai_1.assert.deepEqual(label.text.signal, expected);
        });
        it('should return correct expression for the timeUnit: TimeUnit.QUARTER', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var fieldDef = { field: 'a', type: type_1.TEMPORAL, timeUnit: timeunit_1.TimeUnit.QUARTER };
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR);
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.deepEqual(label.text.signal, expected);
        });
        it('should use special scale for binned and continuous scales to set label text', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal" },
                    color: { field: "a", type: "quantitative", bin: true }
                }
            });
            var fieldDef = { field: 'a', type: type_1.QUANTITATIVE, bin: true };
            var label = encode.labels(fieldDef, {}, model, channel_1.COLOR);
            var expected = {
                field: "value",
                scale: "color_bin_legend_label"
            };
            chai_1.assert.deepEqual(label.text, expected);
        });
    });
});
//# sourceMappingURL=encode.test.js.map