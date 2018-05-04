"use strict";
/* tslint:disable quotemark */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var area_1 = require("../../../src/compile/mark/area");
var util_1 = require("../../util");
describe('Mark: Area', function () {
    function verticalArea(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "area",
            "encoding": __assign({ "x": { "timeUnit": "year", "field": "Year", "type": "temporal" }, "y": { "aggregate": "count", "type": "quantitative" } }, moreEncoding),
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
            "encoding": __assign({ "y": { "timeUnit": "year", "field": "Year", "type": "temporal" }, "x": { "aggregate": "count", "type": "quantitative" } }, moreEncoding),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvYXJlYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7Ozs7Ozs7Ozs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUFpRDtBQUNqRCx1REFBb0Q7QUFHcEQsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsc0JBQXNCLFlBQW1DO1FBQW5DLDZCQUFBLEVBQUEsaUJBQW1DO1FBQ3ZELE9BQU87WUFDTCxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsYUFFTixHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQyxFQUM5RCxHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUMsSUFDaEQsWUFBWSxDQUNoQjtZQUNILE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBQztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtRQUNsQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBQztnQkFDbEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFDO2FBQ2xHO1lBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO1NBQ3BDLENBQUMsQ0FBQztR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QUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgWCwgWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHthcmVhfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL2FyZWEnO1xuaW1wb3J0IHtFbmNvZGluZ30gZnJvbSAnLi4vLi4vLi4vc3JjL2VuY29kaW5nJztcbmltcG9ydCB7Tm9ybWFsaXplZFVuaXRTcGVjfSBmcm9tICcuLi8uLi8uLi9zcmMvc3BlYyc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNYXJrOiBBcmVhJywgZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHZlcnRpY2FsQXJlYShtb3JlRW5jb2Rpbmc6IEVuY29kaW5nPHN0cmluZz4gPSB7fSk6IE5vcm1hbGl6ZWRVbml0U3BlYyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgIFwiZW5jb2RpbmdcIjpcbiAgICAgICAge1xuICAgICAgICAgIFwieFwiOiB7XCJ0aW1lVW5pdFwiOiBcInllYXJcIiwgXCJmaWVsZFwiOiBcIlllYXJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAuLi5tb3JlRW5jb2RpbmcsXG4gICAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn1cbiAgICB9O1xuICB9XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGFyZWEsIHdpdGggbG9nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wifSxcbiAgICAgICAgXCJ5XCI6IHtcInNjYWxlXCI6IHtcInR5cGVcIjogJ2xvZyd9LCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL21vdmllcy5qc29uJ31cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXMgbm8gaGVpZ2h0JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N0YWNrZWQgdmVydGljYWwgYXJlYSwgd2l0aCBiaW5uZWQgZGltZW5zaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wifSxcbiAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcImZpZWxkXCI6ICdjJ31cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL21vdmllcy5qc29uJ31cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgYmluX21pZCBmb3IgeCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7ZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9JTURCX1JhdGluZ19taWQnLCBzY2FsZTogJ3gnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBhcmVhLCB3aXRoIHplcm89ZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIklNREJfUmF0aW5nXCJ9LFxuICAgICAgICBcInlcIjoge1wic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX0sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYXJlYS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhcyBubyBoZWlnaHQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYXJlYScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHZlcnRpY2FsQXJlYSgpKTtcbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyX1llYXInfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ2NvdW50XyonfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIGNvcnJlY3QgdmFsdWUgZm9yIHkyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBhcmVhIHdpdGggYmlubmVkIGRpbWVuc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHZlcnRpY2FsQXJlYSgpKTtcbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyX1llYXInfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ2NvdW50XyonfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdGhlIGNvcnJlY3QgdmFsdWUgZm9yIHkyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBzdGFja2VkIGFyZWEgd2l0aCBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh2ZXJ0aWNhbEFyZWEoe1xuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICB9KSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRoZSBjb3JyZWN0IHZhbHVlIGZvciB5IGFuZCB5MicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnY291bnRfKl9lbmQnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdjb3VudF8qX3N0YXJ0J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgb3JpZW50JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5vcmllbnQsIHt2YWx1ZTogJ3ZlcnRpY2FsJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZmlsbCwge3NjYWxlOiBDT0xPUiwgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGhvcml6b250YWxBcmVhKG1vcmVFbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiA9IHt9KTogTm9ybWFsaXplZFVuaXRTcGVjIHtcbiAgICByZXR1cm4ge1xuICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInRpbWVVbml0XCI6IFwieWVhclwiLCBcImZpZWxkXCI6IFwiWWVhclwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIC4uLm1vcmVFbmNvZGluZyxcbiAgICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2NhcnMuanNvblwifVxuICAgIH07XG4gIH1cblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBhcmVhJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoaG9yaXpvbnRhbEFyZWEoKSk7XG4gICAgY29uc3QgcHJvcHMgPSBhcmVhLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzY2FsZSBmb3IgeScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAneWVhcl9ZZWFyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICdjb3VudF8qJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRoZSBjb3JyZWN0IHZhbHVlIGZvciB4MicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnICwgdmFsdWU6IDB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYXJlYSwgd2l0aCBsb2cnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIklNREJfUmF0aW5nXCJ9LFxuICAgICAgICBcInhcIjoge1wic2NhbGVcIjoge1widHlwZVwiOiAnbG9nJ30sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBhcmVhLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHt2YWx1ZTogMH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG5vIHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBhcmVhLCB3aXRoIHplcm89ZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIklNREJfUmF0aW5nXCJ9LFxuICAgICAgICBcInhcIjoge1wic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX0sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBhcmVhLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHt2YWx1ZTogMH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG5vIHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBzdGFja2VkIGFyZWEgd2l0aCBjb2xvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShob3Jpem9udGFsQXJlYSh7XG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9KSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHRoZSBjb3JyZWN0IHZhbHVlIGZvciB4IGFuZCB4MicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnY291bnRfKl9lbmQnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdjb3VudF8qX3N0YXJ0J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgb3JpZW50JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5vcmllbnQsIHt2YWx1ZTogJ2hvcml6b250YWwnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIGNvbG9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5maWxsLCB7c2NhbGU6IENPTE9SLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3JhbmdlZCBhcmVhJywgZnVuY3Rpb24gKCkge1xuICAgIGl0ICgndmVydGljYWwgYXJlYSBzaG91bGQgd29yayB3aXRoIGFnZ3JlZ2F0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInRpbWVVbml0XCI6IFwieWVhclwiLCBcImZpZWxkXCI6IFwiWWVhclwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJXZWlnaHRfaW5fbGJzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInkyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwiV2VpZ2h0X2luX2xic1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICd5ZWFyX1llYXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21pbl9XZWlnaHRfaW5fbGJzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIGZpZWxkOiAnbWF4X1dlaWdodF9pbl9sYnMnfSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ2hvcml6b250YWwgYXJlYSBzaG91bGQgd29yayB3aXRoIGFnZ3JlZ2F0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInRpbWVVbml0XCI6IFwieWVhclwiLCBcImZpZWxkXCI6IFwiWWVhclwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJXZWlnaHRfaW5fbGJzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcIngyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwiV2VpZ2h0X2luX2xic1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGFyZWEuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICd5ZWFyX1llYXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ21pbl9XZWlnaHRfaW5fbGJzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAnbWF4X1dlaWdodF9pbl9sYnMnfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=