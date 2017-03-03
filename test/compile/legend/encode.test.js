/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var encode = require("../../../src/compile/legend/encode");
var timeunit_1 = require("../../../src/timeunit");
var type_1 = require("../../../src/type");
describe('compile/legend', function () {
    describe('encode.symbols', function () {
        it('should initialize if filled', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.strokeWidth.value, 2);
        });
        it('should not have strokeDash and strokeDashOffset', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                }
            }), channel_1.COLOR);
            chai_1.assert.isUndefined(symbol.strokeDash);
            chai_1.assert.isUndefined(symbol.strokeDashOffset);
        });
        it('should return specific color value', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "symbolColor": "red" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.fill.value, "red");
        });
        it('should return specific shape value', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "symbolShape": "diamond" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.shape.value, "diamond");
        });
        it('should return specific size of the symbol', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "symbolSize": 20 } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.size.value, 20);
        });
        it('should return not override size of the symbol for size channel', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    size: { field: "b", type: "quantitative", legend: { "symbolSize": 20 } }
                }
            }), channel_1.SIZE);
            chai_1.assert.isUndefined(symbol.size);
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
        it('should return specific width of the symbol', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "symbolStrokeWidth": 20 } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.strokeWidth.value, 20);
        });
        it('should create legend for SVG path', function () {
            var symbol = encode.symbols({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal" }
                },
                config: {
                    point: {
                        shape: "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z"
                    }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(symbol.shape.value, "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z");
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
        it('should return alignment value of the label', function () {
            var label = encode.labels({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "labelAlign": "left" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(label.align.value, "left");
        });
        it('should return color value of the label', function () {
            var label = encode.labels({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "labelColor": "blue" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(label.fill.value, "blue");
        });
        it('should return font of the label', function () {
            var label = encode.labels({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "labelFont": "what" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(label.font.value, "what");
        });
        it('should return font size of the label', function () {
            var label = encode.labels({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "labelFontSize": 20 } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(label.fontSize.value, 20);
        });
        it('should return baseline of the label', function () {
            var label = encode.labels({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "labelBaseline": "middle" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(label.baseline.value, "middle");
        });
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
    describe('encode.title', function () {
        it('should return color of the title', function () {
            var title = encode.title({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "titleColor": "black" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(title.fill.value, "black");
        });
        it('should return font of the title', function () {
            var title = encode.title({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "titleFont": "abcd" } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(title.font.value, "abcd");
        });
        it('should return font size of the title', function () {
            var title = encode.title({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "titleFontSize": 22 } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(title.fontSize.value, 22);
        });
        it('should return font weight of the title', function () {
            var title = encode.title({ field: 'a' }, {}, util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "nominal" },
                    color: { field: "a", type: "nominal", legend: { "titleFontWeight": 5 } }
                }
            }), channel_1.COLOR);
            chai_1.assert.deepEqual(title.fontWeight.value, 5);
        });
    });
});
//# sourceMappingURL=encode.test.js.map