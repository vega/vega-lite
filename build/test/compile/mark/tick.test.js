/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO:
// test mark-tick with the following test cases,
// looking at mark-point.test.ts as inspiration
//
// After finishing all test, make sure all lines in mark-tick.ts is tested
// (except the scaffold labels() method)
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var tick_1 = require("../../../src/compile/mark/tick");
describe('Mark: Tick', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModel({
            "mark": "tick",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should use stack_end on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked tick.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModel({
            "mark": "tick",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should use stack_end on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative x', function () {
        var model = util_1.parseUnitModel({
            'mark': 'tick',
            'encoding': { 'x': { 'field': 'Horsepower', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should be centered on y', function () {
            chai_1.assert.deepEqual(props.yc, { value: 10.5 });
        });
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'Horsepower' });
        });
        it('width should tick thickness with orient vertical', function () {
            chai_1.assert.deepEqual(props.width, { value: 1 });
        });
    });
    describe('with quantitative y', function () {
        var model = util_1.parseUnitModel({
            'mark': 'tick',
            'encoding': { 'y': { 'field': 'Cylinders', 'type': 'quantitative' } },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should be centered on x', function () {
            chai_1.assert.deepEqual(props.xc, { value: 10.5 });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'Cylinders' });
        });
        it('height should tick thickness with orient horizontal', function () {
            chai_1.assert.deepEqual(props.height, { value: 1 });
        });
    });
    describe('with quantitative x and ordinal y', function () {
        var model = util_1.parseUnitModel({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' }
            },
            'data': { 'url': 'data/cars.json' }
        });
        var props = tick_1.tick.encodeEntry(model);
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.xc, { scale: channel_1.X, field: 'Horsepower' });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.yc, { scale: channel_1.Y, field: 'Cylinders' });
        });
        it('wiidth should be tick thickness with default orient vertical', function () {
            chai_1.assert.deepEqual(props.width, { value: 1 });
        });
        it('height should be matched to field with default orient vertical', function () {
            chai_1.assert.deepEqual(props.height, { value: 14 });
        });
    });
    describe('width should be mapped to size', function () {
        var model = util_1.parseUnitModel({
            'mark': 'tick',
            'config': { 'mark': { 'orient': 'vertical' } },
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick_1.tick.encodeEntry(model);
        it('width should change with size field', function () {
            chai_1.assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': channel_1.SIZE });
        });
    });
    describe('height should be mapped to size', function () {
        var model = util_1.parseUnitModel({
            'mark': 'tick',
            'encoding': {
                'x': { 'field': 'Horsepower', 'type': 'quantitative' },
                'y': { 'field': 'Cylinders', 'type': 'ordinal' },
                'size': { 'field': 'Acceleration', 'type': 'quantitative' }
            },
            'data': { 'url': 'data/cars.json' },
        });
        var props = tick_1.tick.encodeEntry(model);
        it('height should change with size field', function () {
            chai_1.assert.deepEqual(props.height, { 'field': 'Acceleration', 'scale': channel_1.SIZE });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGljay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRzlCLFFBQVE7QUFDUixnREFBZ0Q7QUFDaEQsK0NBQStDO0FBQy9DLEVBQUU7QUFDRiwwRUFBMEU7QUFDMUUsd0NBQXdDO0FBQ3hDLDZCQUE0QjtBQUM1QixtQ0FBMEM7QUFDMUMsZ0RBQWdEO0FBQ2hELHVEQUFvRDtBQUVwRCxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQy9ELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzthQUMzQztZQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztZQUNuQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUcsTUFBTSxFQUFDO1NBQzdCLENBQUMsQ0FBQztRQUVILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUdILFFBQVEs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