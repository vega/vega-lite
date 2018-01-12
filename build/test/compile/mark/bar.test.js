"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bar_1 = require("../../../src/compile/mark/bar");
var log = require("../../../src/log");
var mark_1 = require("../../../src/mark");
var scale_1 = require("../../../src/scale");
var util_1 = require("../../util");
describe('Mark: Bar', function () {
    describe('simple vertical', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar, with y from zero to field value and with band value for x/width ', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
            chai_1.assert.deepEqual(props.width, { scale: 'x', band: true });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('simple horizontal', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar from zero to field value and with band value for x/width', function () {
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
            chai_1.assert.deepEqual(props.height, { scale: 'y', band: true });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal with point scale', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal", "scale": { "type": "point" } },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar from zero to field value and y with center position and height = rangeStep - 1', function () {
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Origin' });
            chai_1.assert.deepEqual(props.height, { value: scale_1.defaultScaleConfig.rangeStep - 1 });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal with size value', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "value": 5 }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should set height to 5 and center y', function () {
            chai_1.assert.deepEqual(props.height, { value: 5 });
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Origin', band: 0.5 });
        });
    });
    describe('simple horizontal with size field', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        log.wrap(function (localLogger) {
            it('should draw bar from zero to field value and with band value for x/width', function () {
                chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
                chai_1.assert.deepEqual(props.height, { scale: 'y', band: true });
                chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
                chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
                chai_1.assert.isUndefined(props.width);
            });
            it('should throw warning', function () {
                chai_1.assert.equal(localLogger.warns[0], log.message.cannotUseSizeFieldWithBandSize('y'));
            });
        });
    });
    describe('horizontal binned', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('horizontal binned, sort descending', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('horizontal binned, reverse', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative", "scale": { "reverse": true } },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical binned', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end' });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('vertical binned, sort descending', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end', offset: mark_1.defaultBarConfig.binSpacing });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('horizontal binned with ordinal', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "ordinal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y', function () {
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_range' });
            chai_1.assert.deepEqual(props.height, { scale: 'y', band: true });
        });
    });
    describe('vertical binned with ordinal', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "ordinal" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should draw bar with y', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_range' });
            chai_1.assert.deepEqual(props.width, { scale: 'x', band: true });
        });
    });
    describe('horizontal binned with no spacing', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            chai_1.assert.isUndefined(props.height);
        });
    });
    describe('vertical binned with no spacing', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end' });
            chai_1.assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal binned with size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            chai_1.assert.deepEqual(props.yc, { signal: '(scale("y", datum["bin_maxbins_10_Horsepower"]) + scale("y", datum["bin_maxbins_10_Horsepower_end"]))/2' });
            chai_1.assert.deepEqual(props.height, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical binned with size', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            chai_1.assert.deepEqual(props.xc, { signal: '(scale(\"x\", datum[\"bin_maxbins_10_Horsepower\"]) + scale(\"x\", datum[\"bin_maxbins_10_Horsepower_end\"]))/2' });
            chai_1.assert.deepEqual(props.width, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical, with log', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
                mult: 0.5,
                signal: 'width'
            });
        });
    });
    describe('1D vertical with size value', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "bar",
            "encoding": { "x": { "type": "quantitative", "field": 'US_Gross', "aggregate": 'sum' } },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar_1.bar.encodeEntry(model);
        it('should end on axis, have no width, and have y-offset', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'sum_US_Gross' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
            chai_1.assert.deepEqual(props.yc, {
                mult: 0.5,
                signal: 'height'
            });
        });
    });
    describe('QxQ horizontal', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        it('should produce vertical bar using x, width', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": 'data/cars.json' },
                "mark": "bar",
                "encoding": {
                    "x": { "field": 'Origin', "type": "nominal" },
                    "y": { "field": 'Cylinders', "type": "ordinal" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
            chai_1.assert.deepEqual(props.width, { scale: 'x', band: true });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'Cylinders' });
            chai_1.assert.deepEqual(props.height, { scale: 'y', band: true });
        });
    });
    describe('ranged bar', function () {
        // TODO: gantt chart with temporal
        // TODO: gantt chart with ordinal
        it('vertical bars should work with aggregate', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "age", "type": "ordinal" },
                    "y": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "y2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'age' });
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'q1_people' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'q3_people' });
        });
        it('horizontal bars should work with aggregate', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "y": { "field": "age", "type": "ordinal" },
                    "x": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "x2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar_1.bar.encodeEntry(model);
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'age' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'q1_people' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'q3_people' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9iYXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIscURBQWtEO0FBQ2xELHNDQUF3QztBQUN4QywwQ0FBbUQ7QUFDbkQsNENBQXNEO0FBQ3RELG1DQUFnRTtBQUVoRSxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7WUFDakMsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUMzQyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQzthQUM1RTtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFNBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckMsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDekQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FB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LDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7Z0JBQ3ZDLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3hDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNuRSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztpQkFDckU7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLEtBQUssR0FBRyxTQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDdEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztZQUM1RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2Jhcn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9iYXInO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtkZWZhdWx0QmFyQ29uZmlnfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge2RlZmF1bHRTY2FsZUNvbmZpZ30gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcms6IEJhcicsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnc2ltcGxlIHZlcnRpY2FsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyLCB3aXRoIHkgZnJvbSB6ZXJvIHRvIGZpZWxkIHZhbHVlIGFuZCB3aXRoIGJhbmQgdmFsdWUgZm9yIHgvd2lkdGggJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtzY2FsZTogJ3gnLCBiYW5kOiB0cnVlfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgd2l0aCBiYW5kIHZhbHVlIGZvciB4L3dpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7c2NhbGU6ICd5JywgYmFuZDogdHJ1ZX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIHdpdGggcG9pbnQgc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIn19LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgeSB3aXRoIGNlbnRlciBwb3NpdGlvbiBhbmQgaGVpZ2h0ID0gcmFuZ2VTdGVwIC0gMScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnT3JpZ2luJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHt2YWx1ZTogZGVmYXVsdFNjYWxlQ29uZmlnLnJhbmdlU3RlcCAtIDF9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCB3aXRoIHNpemUgdmFsdWUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaGVpZ2h0IHRvIDUgYW5kIGNlbnRlciB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3ZhbHVlOiA1fSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdPcmlnaW4nLCBiYW5kOiAwLjV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIHdpdGggc2l6ZSBmaWVsZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInNpemVcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgZnJvbSB6ZXJvIHRvIGZpZWxkIHZhbHVlIGFuZCB3aXRoIGJhbmQgdmFsdWUgZm9yIHgvd2lkdGgnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7c2NhbGU6ICd5JywgYmFuZDogdHJ1ZX0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHRocm93IHdhcm5pbmcnLCAoKT0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5jYW5ub3RVc2VTaXplRmllbGRXaXRoQmFuZFNpemUoJ3knKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHkgYW5kIHkyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZCcsIG9mZnNldDogZGVmYXVsdEJhckNvbmZpZy5iaW5TcGFjaW5nfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkLCBzb3J0IGRlc2NlbmRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic29ydFwiOiBcImRlc2NlbmRpbmdcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5IGFuZCB5MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcicsIG9mZnNldDogZGVmYXVsdEJhckNvbmZpZy5iaW5TcGFjaW5nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdob3Jpem9udGFsIGJpbm5lZCwgcmV2ZXJzZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJyZXZlcnNlXCI6IHRydWV9fSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHkgYW5kIHkyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB4IGFuZCB4MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcicsIG9mZnNldDogZGVmYXVsdEJhckNvbmZpZy5iaW5TcGFjaW5nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCwgc29ydCBkZXNjZW5kaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNvcnRcIjogXCJkZXNjZW5kaW5nXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeCBhbmQgeDInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkIHdpdGggb3JkaW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX3JhbmdlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtzY2FsZTogJ3knLCBiYW5kOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBiaW5uZWQgd2l0aCBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfcmFuZ2UnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7c2NhbGU6ICd4JywgYmFuZDogdHJ1ZX0pO1xuICAgIH0pO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdob3Jpem9udGFsIGJpbm5lZCB3aXRoIG5vIHNwYWNpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJiYXJcIjoge1wiYmluU3BhY2luZ1wiOiAwfX1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBhbmQgeTInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBiaW5uZWQgd2l0aCBubyBzcGFjaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9LFxuICAgICAgXCJjb25maWdcIjoge1wiYmFyXCI6IHtcImJpblNwYWNpbmdcIjogMH19XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHggYW5kIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZCd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCBiaW5uZWQgd2l0aCBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInNpemVcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBjZW50ZXJlZCBvbiBiaW5fbWlkIGFuZCBoZWlnaHQgPSBzaXplIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2lnbmFsOiAnKHNjYWxlKFwieVwiLCBkYXR1bVtcImJpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJcIl0pICsgc2NhbGUoXCJ5XCIsIGRhdHVtW1wiYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmRcIl0pKS8yJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtzY2FsZTogJ3NpemUnLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYmlubmVkIHdpdGggc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJzaXplXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHggY2VudGVyZWQgb24gYmluX21pZCBhbmQgd2lkdGggPSBzaXplIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7c2lnbmFsOiAnKHNjYWxlKFxcXCJ4XFxcIiwgZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJcXFwiXSkgKyBzY2FsZShcXFwieFxcXCIsIGRhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZFxcXCJdKSkvMid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtzY2FsZTogJ3NpemUnLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwsIHdpdGggbG9nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wic2NhbGVcIjoge1widHlwZVwiOiAnbG9nJ30sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzIGFuZCBoYXMgbm8gaGVpZ2h0JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwsIHdpdGggbG9nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wic2NhbGVcIjoge1widHlwZVwiOiAnbG9nJ30sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMgYW5kIGhhcyBubyB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3ZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwsIHdpdGggZml0IG1vZGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIndpZHRoXCI6IDEyMCxcbiAgICAgIFwiaGVpZ2h0XCI6IDEyMCxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgeCBhbmQgd2l0aCBiYW5kIHRydWUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtcbiAgICAgICAgc2NhbGU6ICd4JyxcbiAgICAgICAgZmllbGQ6ICdPcmlnaW4nLFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7XG4gICAgICAgIHNjYWxlOiAneCcsXG4gICAgICAgIGJhbmQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwsIHdpdGggZml0IG1vZGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIndpZHRoXCI6IDEyMCxcbiAgICAgIFwiaGVpZ2h0XCI6IDEyMCxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgeSB3aXRoIGJhbmQgdHJ1ZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge1xuICAgICAgICBzY2FsZTogJ3knLFxuICAgICAgICBmaWVsZDogJ09yaWdpbicsXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7XG4gICAgICAgIHNjYWxlOiAneScsXG4gICAgICAgIGJhbmQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIHdpdGggemVybz1mYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9LCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcyBuYWQgaGF2ZSBubyBoZWlnaHQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCB3aXRoIHplcm89ZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMgYW5kIGhhdmUgbm8gd2lkdGgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHt2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJzFEIHZlcnRpY2FsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifX0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHkgZW5kIG9uIGF4aXMsIGhhdmUgbm8taGVpZ2h0IGFuZCBoYXZlIHgtb2Zmc2V0JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ3N1bV9VU19Hcm9zcyd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnd2lkdGgnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJzFEIHZlcnRpY2FsIHdpdGggc2l6ZSB2YWx1ZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHdpZHRoID0gNScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3ZhbHVlOiA1fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcxRCB2ZXJ0aWNhbCB3aXRoIGJhclNpemUgY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL21vdmllcy5qc29uJ30sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICBcImJhclwiOiB7XCJkaXNjcmV0ZUJhbmRTaXplXCI6IDV9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB3aWR0aCA9IDUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHt2YWx1ZTogNX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnMUQgaG9yaXpvbnRhbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiAnc3VtJ319LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9tb3ZpZXMuanNvbid9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcywgaGF2ZSBubyB3aWR0aCwgYW5kIGhhdmUgeS1vZmZzZXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnc3VtX1VTX0dyb3NzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIHZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUXhRIGhvcml6b250YWwnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGdlbmVyYWxseSBhIHRlcnJpYmxlIGlkZWEsIGJ1dCB3ZSBzaG91bGQgc3RpbGwgdGVzdFxuICAgIC8vIGlmIHRoZSBvdXRwdXQgc2hvdyBleHBlY3RlZCByZXN1bHRzXG5cbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwibWFya1wiOiB7XCJvcmllbnRcIjogXCJob3Jpem9udGFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBob3Jpem9udGFsIGJhciB1c2luZyB4LCB4MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdBY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtzY2FsZTogJ3knLCBmaWVsZDogJ0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3ZhbHVlOiBkZWZhdWx0QmFyQ29uZmlnLmNvbnRpbnVvdXNCYW5kU2l6ZX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUXhRIHZlcnRpY2FsJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBnZW5lcmFsbHkgYSB0ZXJyaWJsZSBpZGVhLCBidXQgd2Ugc2hvdWxkIHN0aWxsIHRlc3RcbiAgICAvLyBpZiB0aGUgb3V0cHV0IHNob3cgZXhwZWN0ZWQgcmVzdWx0c1xuXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICBcIm1hcmtcIjoge1wib3JpZW50XCI6IFwidmVydGljYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGhvcml6b250YWwgYmFyIHVzaW5nIHgsIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnhjLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdBY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7dmFsdWU6IGRlZmF1bHRCYXJDb25maWcuY29udGludW91c0JhbmRTaXplfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgdmFsdWU6IDB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ094TicsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgZ2VuZXJhbGx5IGEgdGVycmlibGUgaWRlYSwgYnV0IHdlIHNob3VsZCBzdGlsbCB0ZXN0XG4gICAgLy8gaWYgdGhlIG91dHB1dCBzaG93IGV4cGVjdGVkIHJlc3VsdHNcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgdmVydGljYWwgYmFyIHVzaW5nIHgsIHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogJ09yaWdpbicsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6ICdDeWxpbmRlcnMnLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtzY2FsZTogJ3gnLCBiYW5kOiB0cnVlfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ0N5bGluZGVycyd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7c2NhbGU6ICd5JywgYmFuZDogdHJ1ZX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmFuZ2VkIGJhcicsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGdhbnR0IGNoYXJ0IHdpdGggdGVtcG9yYWxcblxuICAgIC8vIFRPRE86IGdhbnR0IGNoYXJ0IHdpdGggb3JkaW5hbFxuXG4gICAgaXQoJ3ZlcnRpY2FsIGJhcnMgc2hvdWxkIHdvcmsgd2l0aCBhZ2dyZWdhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwiYWdncmVnYXRlXCI6IFwicTFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieTJcIjoge1wiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJhZ2dyZWdhdGVcIjogXCJxM1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYWdlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdxMV9wZW9wbGUnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdxM19wZW9wbGUnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaG9yaXpvbnRhbCBiYXJzIHNob3VsZCB3b3JrIHdpdGggYWdncmVnYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInExXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcIngyXCI6IHtcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwiYWdncmVnYXRlXCI6IFwicTNcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2FnZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAncTFfcGVvcGxlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAncTNfcGVvcGxlJ30pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19