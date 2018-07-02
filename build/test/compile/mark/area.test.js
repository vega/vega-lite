/* tslint:disable quotemark */
import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { COLOR, X, Y } from '../../../src/channel';
import { area } from '../../../src/compile/mark/area';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
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
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area.encodeEntry(model);
        it('should end on axis', function () {
            assert.deepEqual(props.y2, { field: { group: 'height' } });
        });
        it('should has no height', function () {
            assert.isUndefined(props.height);
        });
    });
    describe('stacked vertical area, with binned dimension', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" },
                "color": { "type": "nominal", "field": 'c' }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area.encodeEntry(model);
        it('should use bin_mid for x', function () {
            assert.deepEqual(props.x, { field: 'bin_maxbins_10_IMDB_Rating_mid', scale: 'x' });
        });
    });
    describe('vertical area, with zero=false', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "x": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "y": { "scale": { "zero": false }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area.encodeEntry(model);
        it('should end on axis', function () {
            assert.deepEqual(props.y2, { field: { group: 'height' } });
        });
        it('should has no height', function () {
            assert.isUndefined(props.height);
        });
    });
    describe('vertical area', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
        var props = area.encodeEntry(model);
        it('should have scale for x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'year_Year' });
        });
        it('should have scale for y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'count_*' });
        });
        it('should have the correct value for y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        });
    });
    describe('vertical area with binned dimension', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(verticalArea());
        var props = area.encodeEntry(model);
        it('should have scale for x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'year_Year' });
        });
        it('should have scale for y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'count_*' });
        });
        it('should have the correct value for y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        });
    });
    describe('vertical stacked area with color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(verticalArea({
            "color": { "field": "Origin", "type": "quantitative" }
        }));
        var props = area.encodeEntry(model);
        it('should have the correct value for y and y2', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'count_*_end' });
            assert.deepEqual(props.y2, { scale: 'y', field: 'count_*_start' });
        });
        it('should have correct orient', function () {
            assert.deepEqual(props.orient, { value: 'vertical' });
        });
        it('should have scale for color', function () {
            assert.deepEqual(props.fill, { scale: COLOR, field: 'Origin' });
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
        var model = parseUnitModelWithScaleAndLayoutSize(horizontalArea());
        var props = area.encodeEntry(model);
        it('should have scale for y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'year_Year' });
        });
        it('should have scale for x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'count_*' });
        });
        it('should have the correct value for x2', function () {
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
        });
    });
    describe('horizontal area, with log', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "y": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "x": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area.encodeEntry(model);
        it('should end on axis', function () {
            assert.deepEqual(props.x2, { value: 0 });
        });
        it('should have no width', function () {
            assert.isUndefined(props.width);
        });
    });
    describe('horizontal area, with zero=false', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "area",
            "encoding": {
                "y": { "bin": true, "type": "quantitative", "field": "IMDB_Rating" },
                "x": { "scale": { "zero": false }, "type": "quantitative", "field": 'US_Gross', "aggregate": "mean" }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = area.encodeEntry(model);
        it('should end on axis', function () {
            assert.deepEqual(props.x2, { value: 0 });
        });
        it('should have no width', function () {
            assert.isUndefined(props.width);
        });
    });
    describe('horizontal stacked area with color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(horizontalArea({
            "color": { "field": "Origin", "type": "nominal" }
        }));
        var props = area.encodeEntry(model);
        it('should have the correct value for x and x2', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'count_*_end' });
            assert.deepEqual(props.x2, { scale: 'x', field: 'count_*_start' });
        });
        it('should have correct orient', function () {
            assert.deepEqual(props.orient, { value: 'horizontal' });
        });
        it('should have scale for color', function () {
            assert.deepEqual(props.fill, { scale: COLOR, field: 'Origin' });
        });
    });
    describe('ranged area', function () {
        it('vertical area should work with aggregate', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/cars.json" },
                "mark": "area",
                "encoding": {
                    "x": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                    "y": { "aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
                    "y2": { "aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
                }
            });
            var props = area.encodeEntry(model);
            assert.deepEqual(props.x, { scale: 'x', field: 'year_Year' });
            assert.deepEqual(props.y, { scale: 'y', field: 'min_Weight_in_lbs' });
            assert.deepEqual(props.y2, { scale: 'y', field: 'max_Weight_in_lbs' });
        });
        it('horizontal area should work with aggregate', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/cars.json" },
                "mark": "area",
                "encoding": {
                    "y": { "timeUnit": "year", "field": "Year", "type": "temporal" },
                    "x": { "aggregate": "min", "field": "Weight_in_lbs", "type": "quantitative" },
                    "x2": { "aggregate": "max", "field": "Weight_in_lbs", "type": "quantitative" }
                }
            });
            var props = area.encodeEntry(model);
            assert.deepEqual(props.y, { scale: 'y', field: 'year_Year' });
            assert.deepEqual(props.x, { scale: 'x', field: 'min_Weight_in_lbs' });
            assert.deepEqual(props.x2, { scale: 'x', field: 'max_Weight_in_lbs' });
        });
    });
});
//# sourceMappingURL=area.test.js.map