/* tslint:disable quotemark */
"use strict";
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
        it('should drop size field', function () {
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
                chai_1.assert.deepEqual(props.strokeWidth, { value: 2 });
                chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SIZE, mark_1.LINE));
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
            "config": { "mark": { "stacked": "zero" } }
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
            "config": { "mark": { "stacked": "zero" } }
        });
        var props = line_1.line.encodeEntry(model);
        it('should use x_end', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_yield_end' });
        });
    });
});
//# sourceMappingURL=line.test.js.map