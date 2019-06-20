"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var area_1 = require("../../../src/compile/mark/area");
var util_1 = require("../../util");
describe('Mark: Area', function () {
    function verticalArea(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "area",
            "encoding": tslib_1.__assign({ "x": { "timeUnit": "year", "field": "Year", "type": "temporal" }, "y": { "aggregate": "count", "type": "quantitative" } }, moreEncoding),
            "data": { "url": "data/cars.json" }
        };
    }
    describe('vertical area, with log', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
    describe('stacked vertical area, with binned dimension', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" },
                "color": { "type": "nominal", "field": 'c' }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area_1.area.encodeEntry(model);
        it('should use bin_mid for x', function () {
            chai_1.assert.deepEqual(props.x, { field: 'bin_maxbins_10_IMDB_Rating_mid', scale: 'x' });
        });
    });
    describe('vertical area, with zero=false', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(verticalArea());
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
    describe('vertical area with binned dimension', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(verticalArea());
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(verticalArea({
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
            "encoding": tslib_1.__assign({ "y": { "timeUnit": "year", "field": "Year", "type": "temporal" }, "x": { "aggregate": "count", "type": "quantitative" } }, moreEncoding),
            "data": { "url": "data/cars.json" }
        };
    }
    describe('horizontal area', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(horizontalArea());
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(horizontalArea({
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
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
//# sourceMappingURL=area.test.js.map