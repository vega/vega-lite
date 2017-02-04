/* tslint:disable quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var text_1 = require("../../../src/compile/mark/text");
var channel_1 = require("../../../src/channel");
describe('Mark: Text', function () {
    describe('with nothing', function () {
        var spec = {
            "mark": "text",
            "encoding": {},
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseUnitModel(spec);
        var props = text_1.text.encodeEntry(model);
        it('should have placeholder text', function () {
            chai_1.assert.deepEqual(props.text, { value: "Abc" });
        });
    });
    describe('with stacked x', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModel({
            "mark": "text",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "mark": { "stacked": "zero" } }
        });
        var props = text_1.text.encodeEntry(model);
        it('should use stack_end on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModel({
            "mark": "text",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "mark": { "stacked": "zero" } }
        });
        var props = text_1.text.encodeEntry(model);
        it('should use stack_end on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative and format', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "quantitative" }
            },
            "config": {
                "text": {
                    "format": "d"
                }
            }
        };
        var model = util_1.parseUnitModel(spec);
        var props = text_1.text.encodeEntry(model);
        it('should use number template', function () {
            chai_1.assert.deepEqual(props.text, { signal: "format(datum[\"foo\"], 'd')" });
        });
    });
    describe('with temporal', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "temporal" }
            }
        };
        var model = util_1.parseUnitModel(spec);
        var props = text_1.text.encodeEntry(model);
        it('should use date template', function () {
            chai_1.assert.deepEqual(props.text, { signal: "timeFormat(datum[\"foo\"], '%b %d, %Y')" });
        });
    });
    describe('with x, y, text (ordinal)', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "x": { "field": "Acceleration", "type": "ordinal" },
                "y": { "field": "Displacement", "type": "quantitative" },
                "text": { "field": "Origin", "type": "ordinal" },
            },
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseUnitModel(spec);
        var props = text_1.text.encodeEntry(model);
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'Acceleration' });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'Displacement' });
        });
        it('should be centered', function () {
            chai_1.assert.deepEqual(props.align, { value: "center" });
        });
        it('should map text without template', function () {
            chai_1.assert.deepEqual(props.text, { field: "Origin" });
        });
    });
    describe('with row, column, text, and color', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "row": { "field": "Origin", "type": "ordinal" },
                "column": { "field": "Cylinders", "type": "ordinal" },
                "text": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" },
                "color": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" },
                "size": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" }
            },
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseModel(spec);
        var props = text_1.text.encodeEntry(model.children()[0]);
        it('should fit cell on x', function () {
            chai_1.assert.deepEqual(props.x, { field: { group: 'width' }, offset: -5 });
        });
        it('should center on y', function () {
            chai_1.assert.deepEqual(props.y, { value: 10.5 });
        });
        it('should map text to expression', function () {
            chai_1.assert.deepEqual(props.text, {
                signal: "format(datum[\"mean_Acceleration\"], 's')"
            });
        });
        it('should map color to fill', function () {
            chai_1.assert.deepEqual(props.fill, {
                scale: 'child_color',
                field: 'mean_Acceleration'
            });
        });
        it('should map size to fontSize', function () {
            chai_1.assert.deepEqual(props.fontSize, {
                scale: 'child_size',
                field: 'mean_Acceleration'
            });
        });
    });
});
//# sourceMappingURL=text.test.js.map