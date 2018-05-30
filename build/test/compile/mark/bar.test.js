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
    it('should draw vertical bar, with y from zero to field value and bar with quantitative x, x2, and y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "bin_start", "type": "quantitative" },
                "x2": { "field": "bin_end", "type": "quantitative" },
                "y": { "type": "quantitative", "field": 'Acceleration' }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'bin_start' });
        chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'bin_end' });
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'Acceleration' });
        chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        chai_1.assert.isUndefined(props.height);
    });
    it('should draw vertical bar, with y from zero to field value and with band value for x/width when domain that includes zero is specified', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "domain": [-1, 1] } }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
        chai_1.assert.deepEqual(props.width, { scale: 'x', band: true });
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        chai_1.assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        chai_1.assert.isUndefined(props.height);
    });
    it('should draw vertical bar, with y from "group: height" to field value when domain that excludes zero is specified', log.wrap(function (logger) {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "domain": [1, 2] } }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
        chai_1.assert.isUndefined(props.height);
        chai_1.assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { zeroFalse: false }));
    }));
    it('should draw vertical bar, with y from "group: height" to field value when zero=false for y-scale', log.wrap(function (logger) {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "zero": false } }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
        chai_1.assert.isUndefined(props.height);
        chai_1.assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { zeroFalse: true }));
    }));
    it('should draw vertical bar, with y from "group: height" to field value when y-scale type is log', log.wrap(function (logger) {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "type": "log" } }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        chai_1.assert.deepEqual(props.y2, { field: { group: 'height' } });
        chai_1.assert.isUndefined(props.height);
        chai_1.assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { scaleType: 'log' }));
    }));
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
    it('should draw horizontal bar, with y from zero to field value and bar with quantitative x, x2, and y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "bin_start", "type": "quantitative" },
                "y2": { "field": "bin_end", "type": "quantitative" },
                "x": { "type": "quantitative", "field": 'Acceleration' }
            }
        });
        var props = bar_1.bar.encodeEntry(model);
        chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'bin_start' });
        chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'bin_end' });
        chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'Acceleration' });
        chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
        chai_1.assert.isUndefined(props.height);
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
    describe('simple horizontal with size value in mark def', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": { "type": "bar", "size": 5 },
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
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
        it('should draw bar from zero to field value and with band value for x/width', function () {
            chai_1.assert.deepEqual(props.yc, { scale: 'y', field: 'Origin', band: 0.5 });
            chai_1.assert.deepEqual(props.height, { scale: 'size', field: 'mean_Horsepower' });
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            chai_1.assert.isUndefined(props.width);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9iYXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIscURBQWtEO0FBQ2xELHNDQUF3QztBQUN4QywwQ0FBbUQ7QUFDbkQsNENBQXNEO0FBQ3RELG1DQUFnRTtBQUVoRSxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7WUFDakMsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUMzQyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQzthQUM1RTtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFNBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFckMsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDekQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FB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RUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7WUFDNUQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtiYXJ9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvYmFyJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7ZGVmYXVsdEJhckNvbmZpZ30gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtkZWZhdWx0U2NhbGVDb25maWd9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNYXJrOiBCYXInLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3NpbXBsZSB2ZXJ0aWNhbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciwgd2l0aCB5IGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgd2l0aCBiYW5kIHZhbHVlIGZvciB4L3dpZHRoICcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7c2NhbGU6ICd4JywgYmFuZDogdHJ1ZX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZHJhdyB2ZXJ0aWNhbCBiYXIsIHdpdGggeSBmcm9tIHplcm8gdG8gZmllbGQgdmFsdWUgYW5kIGJhciB3aXRoIHF1YW50aXRhdGl2ZSB4LCB4MiwgYW5kIHknLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImJpbl9zdGFydFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJiaW5fZW5kXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJ31cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdiaW5fc3RhcnQnfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX2VuZCd9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgdmFsdWU6IDB9KTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBkcmF3IHZlcnRpY2FsIGJhciwgd2l0aCB5IGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgd2l0aCBiYW5kIHZhbHVlIGZvciB4L3dpZHRoIHdoZW4gZG9tYWluIHRoYXQgaW5jbHVkZXMgemVybyBpcyBzcGVjaWZpZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJzY2FsZVwiOiB7XCJkb21haW5cIjogWy0xLCAxXX19XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAneCcsIGJhbmQ6IHRydWV9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCB2YWx1ZTogMH0pO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGRyYXcgdmVydGljYWwgYmFyLCB3aXRoIHkgZnJvbSBcImdyb3VwOiBoZWlnaHRcIiB0byBmaWVsZCB2YWx1ZSB3aGVuIGRvbWFpbiB0aGF0IGV4Y2x1ZGVzIHplcm8gaXMgc3BlY2lmaWVkJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwic2NhbGVcIjoge1wiZG9tYWluXCI6IFsxLCAyXX19XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbid9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG5cbiAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5ub25aZXJvU2NhbGVVc2VkV2l0aExlbmd0aE1hcmsoJ2JhcicsICd5Jywge3plcm9GYWxzZTogZmFsc2V9KSk7XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIGRyYXcgdmVydGljYWwgYmFyLCB3aXRoIHkgZnJvbSBcImdyb3VwOiBoZWlnaHRcIiB0byBmaWVsZCB2YWx1ZSB3aGVuIHplcm89ZmFsc2UgZm9yIHktc2NhbGUnLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfX1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcblxuICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyaygnYmFyJywgJ3knLCB7emVyb0ZhbHNlOiB0cnVlfSkpO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCBkcmF3IHZlcnRpY2FsIGJhciwgd2l0aCB5IGZyb20gXCJncm91cDogaGVpZ2h0XCIgdG8gZmllbGQgdmFsdWUgd2hlbiB5LXNjYWxlIHR5cGUgaXMgbG9nJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiBcImxvZ1wifX1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcblxuICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyaygnYmFyJywgJ3knLCB7c2NhbGVUeXBlOiAnbG9nJ30pKTtcbiAgfSkpO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciBmcm9tIHplcm8gdG8gZmllbGQgdmFsdWUgYW5kIHdpdGggYmFuZCB2YWx1ZSBmb3IgeC93aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3NjYWxlOiAneScsIGJhbmQ6IHRydWV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZHJhdyBob3Jpem9udGFsIGJhciwgd2l0aCB5IGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgYmFyIHdpdGggcXVhbnRpdGF0aXZlIHgsIHgyLCBhbmQgeScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYmluX3N0YXJ0XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcImJpbl9lbmRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9zdGFydCd9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fZW5kJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnQWNjZWxlcmF0aW9uJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2ltcGxlIGhvcml6b250YWwgd2l0aCBwb2ludCBzY2FsZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJwb2ludFwifX0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgZnJvbSB6ZXJvIHRvIGZpZWxkIHZhbHVlIGFuZCB5IHdpdGggY2VudGVyIHBvc2l0aW9uIGFuZCBoZWlnaHQgPSByYW5nZVN0ZXAgLSAxJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdPcmlnaW4nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3ZhbHVlOiBkZWZhdWx0U2NhbGVDb25maWcucmFuZ2VTdGVwIC0gMX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIHdpdGggc2l6ZSB2YWx1ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaGVpZ2h0IHRvIDUgYW5kIGNlbnRlciB5JywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHt2YWx1ZTogNX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnT3JpZ2luJywgYmFuZDogMC41fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCB3aXRoIHNpemUgdmFsdWUgaW4gbWFyayBkZWYnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwiYmFyXCIsIFwic2l6ZVwiOiA1fSxcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaGVpZ2h0IHRvIDUgYW5kIGNlbnRlciB5JywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHt2YWx1ZTogNX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnT3JpZ2luJywgYmFuZDogMC41fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCB3aXRoIHNpemUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJzaXplXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgd2l0aCBiYW5kIHZhbHVlIGZvciB4L3dpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdPcmlnaW4nLCBiYW5kOiAwLjV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7c2NhbGU6ICdzaXplJywgZmllbGQ6ICdtZWFuX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIHZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBhbmQgeTInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQsIHNvcnQgZGVzY2VuZGluZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzb3J0XCI6IFwiZGVzY2VuZGluZ1wifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHkgYW5kIHkyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkLCByZXZlcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInJldmVyc2VcIjogdHJ1ZX19LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBhbmQgeTInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInLCBvZmZzZXQ6IGRlZmF1bHRCYXJDb25maWcuYmluU3BhY2luZ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZCd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYmlubmVkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHggYW5kIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYmlubmVkLCBzb3J0IGRlc2NlbmRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic29ydFwiOiBcImRlc2NlbmRpbmdcIn0sXG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB4IGFuZCB4MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnLCBvZmZzZXQ6IGRlZmF1bHRCYXJDb25maWcuYmluU3BhY2luZ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQgd2l0aCBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfcmFuZ2UnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3NjYWxlOiAneScsIGJhbmQ6IHRydWV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCB3aXRoIG9yZGluYWwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9yYW5nZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtzY2FsZTogJ3gnLCBiYW5kOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkIHdpdGggbm8gc3BhY2luZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfSxcbiAgICAgIFwiY29uZmlnXCI6IHtcImJhclwiOiB7XCJiaW5TcGFjaW5nXCI6IDB9fVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5IGFuZCB5MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCB3aXRoIG5vIHNwYWNpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJiYXJcIjoge1wiYmluU3BhY2luZ1wiOiAwfX1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeCBhbmQgeDInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIGJpbm5lZCB3aXRoIHNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwic2l6ZVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5IGNlbnRlcmVkIG9uIGJpbl9taWQgYW5kIGhlaWdodCA9IHNpemUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtzaWduYWw6ICcoc2NhbGUoXCJ5XCIsIGRhdHVtW1wiYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlclwiXSkgKyBzY2FsZShcInlcIiwgZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZFwiXSkpLzInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3NjYWxlOiAnc2l6ZScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBiaW5uZWQgd2l0aCBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInNpemVcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeCBjZW50ZXJlZCBvbiBiaW5fbWlkIGFuZCB3aWR0aCA9IHNpemUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzaWduYWw6ICcoc2NhbGUoXFxcInhcXFwiLCBkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlclxcXCJdKSArIHNjYWxlKFxcXCJ4XFxcIiwgZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kXFxcIl0pKS8yJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAnc2l6ZScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCwgd2l0aCBsb2cnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJzY2FsZVwiOiB7XCJ0eXBlXCI6ICdsb2cnfSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMgYW5kIGhhcyBubyBoZWlnaHQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCwgd2l0aCBsb2cnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJzY2FsZVwiOiB7XCJ0eXBlXCI6ICdsb2cnfSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcyBhbmQgaGFzIG5vIHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7dmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCwgd2l0aCBmaXQgbW9kZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwid2lkdGhcIjogMTIwLFxuICAgICAgXCJoZWlnaHRcIjogMTIwLFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB4IGFuZCB3aXRoIGJhbmQgdHJ1ZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge1xuICAgICAgICBzY2FsZTogJ3gnLFxuICAgICAgICBmaWVsZDogJ09yaWdpbicsXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtcbiAgICAgICAgc2NhbGU6ICd4JyxcbiAgICAgICAgYmFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCwgd2l0aCBmaXQgbW9kZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwid2lkdGhcIjogMTIwLFxuICAgICAgXCJoZWlnaHRcIjogMTIwLFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB5IHdpdGggYmFuZCB0cnVlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7XG4gICAgICAgIHNjYWxlOiAneScsXG4gICAgICAgIGZpZWxkOiAnT3JpZ2luJyxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtcbiAgICAgICAgc2NhbGU6ICd5JyxcbiAgICAgICAgYmFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgd2l0aCB6ZXJvPWZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX0sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzIG5hZCBoYXZlIG5vIGhlaWdodCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdob3Jpem9udGFsIHdpdGggemVybz1mYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9LCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcyBhbmQgaGF2ZSBubyB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3ZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnMUQgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9fSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9tb3ZpZXMuanNvbid9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgeSBlbmQgb24gYXhpcywgaGF2ZSBuby1oZWlnaHQgYW5kIGhhdmUgeC1vZmZzZXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnc3VtX1VTX0dyb3NzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICd3aWR0aCdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnMUQgdmVydGljYWwgd2l0aCBzaXplIHZhbHVlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9tb3ZpZXMuanNvbid9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgd2lkdGggPSA1JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7dmFsdWU6IDV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJzFEIHZlcnRpY2FsIHdpdGggYmFyU2l6ZSBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwiYmFyXCI6IHtcImRpc2NyZXRlQmFuZFNpemVcIjogNX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHdpZHRoID0gNScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3ZhbHVlOiA1fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcxRCBob3Jpem9udGFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6ICdzdW0nfX0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL21vdmllcy5qc29uJ31cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzLCBoYXZlIG5vIHdpZHRoLCBhbmQgaGF2ZSB5LW9mZnNldCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdzdW1fVVNfR3Jvc3MnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnaGVpZ2h0J1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdReFEgaG9yaXpvbnRhbCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgZ2VuZXJhbGx5IGEgdGVycmlibGUgaWRlYSwgYnV0IHdlIHNob3VsZCBzdGlsbCB0ZXN0XG4gICAgLy8gaWYgdGhlIG91dHB1dCBzaG93IGV4cGVjdGVkIHJlc3VsdHNcblxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgXCJtYXJrXCI6IHtcIm9yaWVudFwiOiBcImhvcml6b250YWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGhvcml6b250YWwgYmFyIHVzaW5nIHgsIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IGRlZmF1bHRCYXJDb25maWcuY29udGludW91c0JhbmRTaXplfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdReFEgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGdlbmVyYWxseSBhIHRlcnJpYmxlIGlkZWEsIGJ1dCB3ZSBzaG91bGQgc3RpbGwgdGVzdFxuICAgIC8vIGlmIHRoZSBvdXRwdXQgc2hvdyBleHBlY3RlZCByZXN1bHRzXG5cbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwibWFya1wiOiB7XCJvcmllbnRcIjogXCJ2ZXJ0aWNhbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgaG9yaXpvbnRhbCBiYXIgdXNpbmcgeCwgeDInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHt2YWx1ZTogZGVmYXVsdEJhckNvbmZpZy5jb250aW51b3VzQmFuZFNpemV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCB2YWx1ZTogMH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnT3hOJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBnZW5lcmFsbHkgYSB0ZXJyaWJsZSBpZGVhLCBidXQgd2Ugc2hvdWxkIHN0aWxsIHRlc3RcbiAgICAvLyBpZiB0aGUgb3V0cHV0IHNob3cgZXhwZWN0ZWQgcmVzdWx0c1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSB2ZXJ0aWNhbCBiYXIgdXNpbmcgeCwgd2lkdGgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiAnT3JpZ2luJywgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogJ0N5bGluZGVycycsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnT3JpZ2luJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAneCcsIGJhbmQ6IHRydWV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnQ3lsaW5kZXJzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtzY2FsZTogJ3knLCBiYW5kOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyYW5nZWQgYmFyJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogZ2FudHQgY2hhcnQgd2l0aCB0ZW1wb3JhbFxuXG4gICAgLy8gVE9ETzogZ2FudHQgY2hhcnQgd2l0aCBvcmRpbmFsXG5cbiAgICBpdCgndmVydGljYWwgYmFycyBzaG91bGQgd29yayB3aXRoIGFnZ3JlZ2F0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJhZ2dyZWdhdGVcIjogXCJxMVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInEzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdhZ2UnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ3ExX3Blb3BsZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ3EzX3Blb3BsZSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdob3Jpem9udGFsIGJhcnMgc2hvdWxkIHdvcmsgd2l0aCBhZ2dyZWdhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwiYWdncmVnYXRlXCI6IFwicTFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJhZ2dyZWdhdGVcIjogXCJxM1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYWdlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdxMV9wZW9wbGUnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdxM19wZW9wbGUnfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=