/* tslint:disable quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var bar_1 = require("../../../src/compile/mark/bar");
describe('Mark: Bar', function () {
    describe('simple vertical', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar, with y from zero to field value and x with center position and width = rangeStep - 1', function () {
            chai_1.assert.deepEqual(props.xc, { scale: 'x', field: 'Origin' });
            chai_1.assert.deepEqual(props.width, { value: scale_1.defaultScaleConfig.rangeStep - 1 });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('simple horizontal', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar from zero to field value and y with center position  and height = rangeStep - 1', function () {
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Origin' });
            chai_1.assert.deepEqual(props.height, { value: scale_1.defaultScaleConfig.rangeStep - 1 });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('horizontal binned', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_Horsepower_start' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_Horsepower_end', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical binned', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_Horsepower_start', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_Horsepower_end' });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('horizontal binned with no spacing', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            },
            "config": { "bar": { "binSpacing": 0 } }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_Horsepower_start' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_Horsepower_end' });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical binned with no spacing', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            },
            "config": { "bar": { "binSpacing": 0 } }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_Horsepower_start' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_Horsepower_end' });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal binned with size', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y centered on bin_mid and height = size field', function () {
            chai_1.assert.deepEqual(props.yc, { scale: 'y', signal: '(datum["bin_Horsepower_start"]+datum["bin_Horsepower_end"])/2' });
            chai_1.assert.deepEqual(props.height, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical binned with size', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with x centered on bin_mid and width = size field', function () {
            chai_1.assert.deepEqual(props.xc, { scale: 'x', signal: '(datum["bin_Horsepower_start"]+datum["bin_Horsepower_end"])/2' });
            chai_1.assert.deepEqual(props.width, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical, with log', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis and has no height', function () {
            chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('horizontal, with log', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis and has no width', function () {
            chai_1.assert.deepEqual(props.x2, { value: 0 });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('vertical, with fit mode', function () {
        var model = util_1.parseUnitModel({
            "width": 120,
            "height": 120,
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should use x and with band true', function () {
            chai_1.assert.deepEqual(props.x, {
                scale: 'x',
                field: 'Origin',
            });
            chai_1.assert.deepEqual(props.width, {
                scale: 'x',
                band: true,
            });
        });
    });
    describe('horizontal, with fit mode', function () {
        var model = util_1.parseUnitModel({
            "width": 120,
            "height": 120,
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should use y with band true', function () {
            chai_1.assert.deepEqual(props.y, {
                scale: 'y',
                field: 'Origin',
            });
            chai_1.assert.deepEqual(props.height, {
                scale: 'y',
                band: true,
            });
        });
    });
    describe('vertical with zero=false', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "scale": { "zero": false }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis nad have no height', function () {
            chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('horizontal with zero=false', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "scale": { "zero": false }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis and have no width', function () {
            chai_1.assert.deepEqual(props.x2, { value: 0 });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('1D vertical', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": { "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" } },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should have y end on axis, have no-height and have x-offset', function () {
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'sum_US_Gross' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            chai_1.assert.isUndefined(props.height);
            chai_1.assert.deepEqual(props.xc, {
                value: 10.5,
                offset: 1
            });
        });
    });
    describe('1D vertical with size value', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": {
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" },
                "size": { "value": 5 }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should have width = 5', function () {
            chai_1.assert.deepEqual(props.width, { value: 5 });
        });
    });
    describe('1D vertical with barSize config', function () {
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/movies.json' },
            "mark": "bar",
            "encoding": {
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
            },
            "config": {
                "bar": { "discreteBandSize": 5 }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should have width = 5', function () {
            chai_1.assert.deepEqual(props.width, { value: 5 });
        });
    });
    describe('1D horizontal', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": { "x": { "type": "quantitative", "field": 'US_Gross', "aggregate": 'sum' } },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis, have no width, and have y-offset', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'sum_US_Gross' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
            chai_1.assert.deepEqual(props.yc, { value: 10.5 });
        });
    });
    describe('QxQ horizontal', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": 'Acceleration', "type": "quantitative" },
                "y": { "field": 'Horsepower', "type": "quantitative" }
            },
            "config": {
                "mark": { "orient": "horizontal" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should produce horizontal bar using x, x2', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'Acceleration' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Horsepower' });
            chai_1.assert.deepEqual(props.height, { value: mark_1.defaultBarConfig.continuousBandSize });
        });
    });
    describe('QxQ vertical', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        var model = util_1.parseUnitModel({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": 'Acceleration', "type": "quantitative" },
                "y": { "field": 'Horsepower', "type": "quantitative" }
            },
            "config": {
                "mark": { "orient": "vertical" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should produce horizontal bar using x, x2', function () {
            chai_1.assert.deepEqual(props.xc, { scale: 'x', field: 'Acceleration' });
            chai_1.assert.deepEqual(props.width, { value: mark_1.defaultBarConfig.continuousBandSize });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'Horsepower' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        });
    });
    describe('OxN', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        it('should produce vertical bar using x, x2', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": 'data/cars.json' },
                "mark": "bar",
                "encoding": {
                    "x": { "field": 'Origin', "type": "nominal" },
                    "y": { "field": 'Cylinders', "type": "ordinal" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.xc, { scale: 'x', field: 'Origin' });
            chai_1.assert.deepEqual(props.width, { value: 20 });
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Cylinders' });
            chai_1.assert.deepEqual(props.height, { value: 20 });
        });
    });
    describe('ranged bar', function () {
        // TODO: gantt chart with temporal
        // TODO: gantt chart with ordinal
        it('vertical bars should work with aggregate', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "age", "type": "ordinal" },
                    "y": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "y2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.xc, { scale: 'x', field: 'age' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'q1_people' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'q3_people' });
        });
        it('horizontal bars should work with aggregate', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "y": { "field": "age", "type": "ordinal" },
                    "x": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "x2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'age' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'q1_people' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'q3_people' });
        });
    });
});
//# sourceMappingURL=bar.test.js.map