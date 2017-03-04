/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var log = require("../../../src/log");
var channel_1 = require("../../../src/channel");
var mark_1 = require("../../../src/mark");
var line_1 = require("../../../src/compile/mark/line");
describe('Mark: Line', function () {
    describe('with x, y', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative" }
            }
        });
        var props = line_1.line.encodeEntry(model);
        it('should have scale for x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year' });
        });
        it('should have scale for y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'yield' });
        });
    });
    describe('with x, y, color', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative" },
                "color": { "field": "Acceleration", "type": "quantitative" }
            }
        });
        var props = line_1.line.encodeEntry(model);
        it('should have scale for color', function () {
            chai_1.assert.deepEqual(props.stroke, { scale: channel_1.COLOR, field: 'Acceleration' });
        });
    });
    describe('with x, y, size', function () {
        it('should have scale for size', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "data": { "url": "data/barley.json" },
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "year", "type": "ordinal" },
                        "y": { "field": "yield", "type": "quantitative", "aggregate": "mean" },
                        "size": { "field": "variety", "type": "nominal" }
                    }
                });
                var props = line_1.line.encodeEntry(model);
                chai_1.assert.deepEqual(props.strokeWidth, { scale: 'size', field: 'variety' });
            });
        });
        it('should drop aggregate size field', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "data": { "url": "data/barley.json" },
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "year", "type": "ordinal" },
                        "y": { "field": "yield", "type": "quantitative", "aggregate": "mean" },
                        "size": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" }
                    }
                });
                var props = line_1.line.encodeEntry(model);
                // If size field is dropped, then strokeWidth only have value
                chai_1.assert.isNotOk(props.strokeWidth && props.strokeWidth.scale);
                chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SIZE, mark_1.LINE, 'when the field is aggregated.'));
            });
        });
    });
    describe('with stacked y', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative", "aggregate": "sum" },
                "color": { "field": "a", "type": "nominal" }
            },
            "config": { "stack": "zero" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should use y_end', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'sum_yield_end' });
        });
    });
    describe('with stacked x', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "y": { "field": "year", "type": "ordinal" },
                "x": { "field": "yield", "type": "quantitative", "aggregate": "sum" },
                "color": { "field": "a", "type": "nominal" }
            },
            "config": { "stack": "zero" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should use x_end', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_yield_end' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbGluZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBMEM7QUFFMUMsc0NBQXdDO0FBRXhDLGdEQUF1RDtBQUN2RCwwQ0FBdUM7QUFDdkMsdURBQW9EO0FBRXBELFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFFckIsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztZQUNuQyxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQ3pDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQzthQUNoRDtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxD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