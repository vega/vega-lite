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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGVnZW5kL2VuY29kZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBMEM7QUFDMUMsZ0RBQWlFO0FBQ2pFLDJEQUE2RDtBQUM3RCxrREFBK0M7QUFDL0MsMENBQXlEO0FBRXpELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBRSxFQUFFLHFCQUFjLENBQUM7Z0JBQzNELElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7b0JBQ2hDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDckM7YUFDRixDQUFDLEVBQUUsZUFBSyxDQUFDLENBQUM7WUFDWCxhQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxJQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLElBQUUsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpRUFBaUUsRUFBRTtZQUNwRSxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUUsRUFBRSxxQkFBYyxDQUFDO2dCQUMzRCxJQUFJLEVB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