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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize(verticalArea());
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize(verticalArea());
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize(verticalArea({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize(horizontalArea());
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize(horizontalArea({
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
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvYXJlYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0RBQWlEO0FBQ2pELHVEQUFvRDtBQUdwRCxtQ0FBb0U7QUFFcEUsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixzQkFBc0IsWUFBbUM7UUFBbkMsNkJBQUEsRUFBQSxpQkFBbUM7UUFDdkQsTUFBTSxDQUFDO1lBQ0wsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLHFCQUVOLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDLEVBQzlELEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxJQUNoRCxZQUFZLENBQ2hCO1lBQ0gsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFDO1NBQ2xDLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1FBQ2xDLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO1lBQ3JELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDO2dCQUNsRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUM7YUFDbEc7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsb0JBQW9CLEVBQUU7WUFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDhDQUE4QyxFQUFFO1FBQ3ZELElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO1lBQ3JELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDO2dCQUNsRSxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztnQkFDdEUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDO2FBQzNDO1lBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdDQUFnQyxFQUFFO1FBQ3pDLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO1lBQ3JELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDO2dCQUNsRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUM7YUFDbEc7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsb0JBQW9CLEVBQUU7WUFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixJQUFNLEtBQUssR0FBRywrQ0FBd0MsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUNBQXFDLEVBQUU7UUFDOUMsSUFBTSxLQUFLLEdBQUcsK0NBQXdDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtDQUFrQyxFQUFFO1FBQzNDLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDLFlBQVksQ0FBQztZQUNsRSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7U0FDckQsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1lBQzlELGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUU7WUFDL0IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLGVBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsd0JBQXdCLFlBQW1DO1FBQW5DLDZCQUFBLEVBQUEsaUJBQW1DO1FBQ3pELE1BQU0sQ0FBQztZQUNMLE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxxQkFDTixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxFQUM5RCxHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsSUFDaEQsWUFBWSxDQUNoQjtZQUNILE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBQztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRywrQ0FBd0MsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFHLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsSUFBTSxLQUFLLEdBQUcsK0NBQXdDLENBQUM7WUFDckQsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUM7Z0JBQ2xFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQzthQUNsRztZQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztTQUNwQyxDQUFDLENBQUM7UUFFSCxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtZQUN2QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtDQUFrQyxFQUFFO1FBQzNDLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO1lBQ3JELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDO2dCQUNsRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUM7YUFDbEc7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsb0JBQW9CLEVBQUU7WUFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7WUFDekIsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxvQ0FBb0MsRUFBRTtRQUM3QyxJQUFNLEtBQUssR0FBRywrQ0FBd0MsQ0FBQyxjQUFjLENBQUM7WUFDcEUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hELENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztZQUM5RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxlQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsRUFBRSxDQUFFLDBDQUEwQyxFQUFFO1lBQzlDLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO2dCQUNyRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQztvQkFDOUQsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQzNFLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUM3RTthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztZQUM1RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBQyxDQUFDLENBQUM7WUFDcEUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFFLDRDQUE0QyxFQUFFO1lBQ2hELElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO2dCQUNyRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQztvQkFDOUQsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQzNFLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUM3RTthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztZQUM1RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBQyxDQUFDLENBQUM7WUFDcEUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9