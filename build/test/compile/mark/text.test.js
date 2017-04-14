/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var text_1 = require("../../../src/compile/mark/text");
var util_1 = require("../../util");
describe('Mark: Text', function () {
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
            "config": { "stack": "zero" }
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
            "config": { "stack": "zero" }
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
                "text": { "field": "foo", "type": "quantitative", "format": "d" }
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
        var props = text_1.text.encodeEntry(model.children[0]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGV4dC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBMEM7QUFDMUMsdURBQW9EO0FBRXBELG1DQUFzRDtBQUV0RCxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQy9ELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzthQUMzQztZQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztZQUNuQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUcsTUFBTSxFQUFDO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLHFCQUFjLENB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