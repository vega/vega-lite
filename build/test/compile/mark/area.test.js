/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var util_2 = require("../../../src/util");
var channel_1 = require("../../../src/channel");
var area_1 = require("../../../src/compile/mark/area");
describe('Mark: Area', function () {
    function verticalArea(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "area",
            "encoding": util_2.extend({
                "x": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                "y": { "aggregate": "count", "field": "*", "type": "quantitative" }
            }, moreEncoding),
            "data": { "url": "data/cars.json" }
        };
    }
    describe('vertical area, with log', function () {
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area_1.area.encodeEntry(model);
        it('should end on axis', function () {
            chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
        });
        it('should has no height', function () {
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical area, with zero=false', function () {
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "scale": { "zero": false }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area_1.area.encodeEntry(model);
        it('should end on axis', function () {
            chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
        });
        it('should has no height', function () {
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical area', function () {
        var model = util_1.parseUnitModel(verticalArea());
        var props = area_1.area.encodeEntry(model);
        it('should have scale for x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year_Year' });
        });
        it('should have scale for y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'count_*' });
        });
        it('should have the correct value for y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        });
    });
    describe('vertical stacked area with color', function () {
        var model = util_1.parseUnitModel(verticalArea({
            "color": { "field": "Origin", "type": "quantitative" }
        }));
        var props = area_1.area.encodeEntry(model);
        it('should have the correct value for y and y2', function () {
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'count_*_end' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'count_*_start' });
        });
        it('should have correct orient', function () {
            chai_1.assert.deepEqual(props.orient, { value: 'vertical' });
        });
        it('should have scale for color', function () {
            chai_1.assert.deepEqual(props.fill, { scale: channel_1.COLOR, field: 'Origin' });
        });
    });
    function horizontalArea(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "area",
            "encoding": util_2.extend({
                "y": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                "x": { "aggregate": "count", "field": "*", "type": "quantitative" }
            }, moreEncoding),
            "data": { "url": "data/cars.json" }
        };
    }
    describe('horizontal area', function () {
        var model = util_1.parseUnitModel(horizontalArea());
        var props = area_1.area.encodeEntry(model);
        it('should have scale for y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'year_Year' });
        });
        it('should have scale for x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'count_*' });
        });
        it('should have the correct value for x2', function () {
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
        });
    });
    describe('horizontal area, with log', function () {
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "y": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "x": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area_1.area.encodeEntry(model);
        it('should end on axis', function () {
            chai_1.assert.deepEqual(props.x2, { value: 0 });
        });
        it('should have no width', function () {
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('horizontal area, with zero=false', function () {
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "y": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "x": { "scale": { "zero": false }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area_1.area.encodeEntry(model);
        it('should end on axis', function () {
            chai_1.assert.deepEqual(props.x2, { value: 0 });
        });
        it('should have no width', function () {
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('horizontal stacked area with color', function () {
        var model = util_1.parseUnitModel(horizontalArea({
            "color": { "field": "Origin", "type": "nominal" }
        }));
        var props = area_1.area.encodeEntry(model);
        it('should have the correct value for x and x2', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'count_*_end' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'count_*_start' });
        });
        it('should have correct orient', function () {
            chai_1.assert.deepEqual(props.orient, { value: 'horizontal' });
        });
        it('should have scale for color', function () {
            chai_1.assert.deepEqual(props.fill, { scale: channel_1.COLOR, field: 'Origin' });
        });
    });
    describe('ranged area', function () {
        it('vertical area should work with aggregate', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/cars.json" },
                "mark": "area",
                "encoding": {
                    "x": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                    "y": { "aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
                    "y2": { "aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
                }
            });
            var props = area_1.area.encodeEntry(model);
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'year_Year' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'min_Weight_in_lbs' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'max_Weight_in_lbs' });
        });
        it('horizontal area should work with aggregate', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/cars.json" },
                "mark": "area",
                "encoding": {
                    "y": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                    "x": { "aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
                    "x2": { "aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
                }
            });
            var props = area_1.area.encodeEntry(model);
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'year_Year' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'min_Weight_in_lbs' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'max_Weight_in_lbs' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvYXJlYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBMEM7QUFDMUMsMENBQXlDO0FBQ3pDLGdEQUFpRDtBQUNqRCx1REFBb0Q7QUFHcEQsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixzQkFBc0IsWUFBaUI7UUFBakIsNkJBQUEsRUFBQSxpQkFBaUI7UUFDckMsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUUsYUFBTSxDQUNoQjtnQkFDRSxHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQztnQkFDOUQsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7YUFDbEUsRUFDRCxZQUFZLENBQ2I7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7U0FDbEMsQ0FBQztJQUNKLENBQUM7SUFFRCxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztZQUMzQixNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBQztnQkFDbEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFDO2FBQ2xHO1lBQ0QsTUFB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