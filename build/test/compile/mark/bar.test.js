/* tslint:disable quotemark */
import { assert } from 'chai';
import { bar } from '../../../src/compile/mark/bar';
import * as log from '../../../src/log';
import { defaultBarConfig } from '../../../src/mark';
import { defaultScaleConfig } from '../../../src/scale';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Bar', function () {
    describe('simple vertical', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar, with y from zero to field value and with band value for x/width ', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
            assert.deepEqual(props.width, { scale: 'x', band: true });
            assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            assert.isUndefined(props.height);
        });
    });
    it('should draw vertical bar, with y from zero to field value and with band value for x/width when domain that includes zero is specified', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "domain": [-1, 1] } }
            }
        });
        var props = bar.encodeEntry(model);
        assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
        assert.deepEqual(props.width, { scale: 'x', band: true });
        assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        assert.isUndefined(props.height);
    });
    it('should draw vertical bar, with y from "group: height" to field value when domain that excludes zero is specified', log.wrap(function (logger) {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "domain": [1, 2] } }
            }
        });
        var props = bar.encodeEntry(model);
        assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        assert.deepEqual(props.y2, { field: { group: 'height' } });
        assert.isUndefined(props.height);
        assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { zeroFalse: false }));
    }));
    it('should draw vertical bar, with y from "group: height" to field value when zero=false for y-scale', log.wrap(function (logger) {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "zero": false } }
            }
        });
        var props = bar.encodeEntry(model);
        assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        assert.deepEqual(props.y2, { field: { group: 'height' } });
        assert.isUndefined(props.height);
        assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { zeroFalse: true }));
    }));
    it('should draw vertical bar, with y from "group: height" to field value when y-scale type is log', log.wrap(function (logger) {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean", "scale": { "type": "log" } }
            }
        });
        var props = bar.encodeEntry(model);
        assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
        assert.deepEqual(props.y2, { field: { group: 'height' } });
        assert.isUndefined(props.height);
        assert.equal(logger.warns[0], log.message.nonZeroScaleUsedWithLengthMark('bar', 'y', { scaleType: 'log' }));
    }));
    describe('simple horizontal', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar from zero to field value and with band value for x/width', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
            assert.deepEqual(props.height, { scale: 'y', band: true });
            assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal with point scale', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal", "scale": { "type": "point" } },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar from zero to field value and y with center position and height = rangeStep - 1', function () {
            assert.deepEqual(props.yc, { scale: 'y', field: 'Origin' });
            assert.deepEqual(props.height, { value: defaultScaleConfig.rangeStep - 1 });
            assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal with size value', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "value": 5 }
            }
        });
        var props = bar.encodeEntry(model);
        it('should set height to 5 and center y', function () {
            assert.deepEqual(props.height, { value: 5 });
            assert.deepEqual(props.yc, { scale: 'y', field: 'Origin', band: 0.5 });
        });
    });
    describe('simple horizontal with size value in mark def', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": { "type": "bar", "size": 5 },
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should set height to 5 and center y', function () {
            assert.deepEqual(props.height, { value: 5 });
            assert.deepEqual(props.yc, { scale: 'y', field: 'Origin', band: 0.5 });
        });
    });
    describe('simple horizontal with size field', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        log.wrap(function (localLogger) {
            it('should draw bar from zero to field value and with band value for x/width', function () {
                assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
                assert.deepEqual(props.height, { scale: 'y', band: true });
                assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
                assert.deepEqual(props.x2, { scale: 'x', value: 0 });
                assert.isUndefined(props.width);
            });
            it('should throw warning', function () {
                assert.equal(localLogger.warns[0], log.message.cannotUseSizeFieldWithBandSize('y'));
            });
        });
    });
    describe('horizontal binned', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end', offset: defaultBarConfig.binSpacing });
            assert.isUndefined(props.height);
        });
    });
    describe('horizontal binned, sort descending', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing });
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.height);
        });
    });
    describe('horizontal binned, reverse', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative", "scale": { "reverse": true } },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing });
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.height);
        });
    });
    describe('vertical binned', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower', offset: defaultBarConfig.binSpacing });
            assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.width);
        });
    });
    describe('vertical binned, sort descending', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative", "sort": "descending" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end', offset: defaultBarConfig.binSpacing });
            assert.isUndefined(props.width);
        });
    });
    describe('horizontal binned with ordinal', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "ordinal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_range' });
            assert.deepEqual(props.height, { scale: 'y', band: true });
        });
    });
    describe('vertical binned with ordinal', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "ordinal" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_range' });
            assert.deepEqual(props.width, { scale: 'x', band: true });
        });
    });
    describe('horizontal binned with no spacing', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            },
            "config": { "bar": { "binSpacing": 0 } }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.height);
        });
    });
    describe('vertical binned with no spacing', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            },
            "config": { "bar": { "binSpacing": 0 } }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal binned with size', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with y centered on bin_mid and height = size field', function () {
            assert.deepEqual(props.yc, { signal: '(scale("y", datum["bin_maxbins_10_Horsepower"]) + scale("y", datum["bin_maxbins_10_Horsepower_end"]))/2' });
            assert.deepEqual(props.height, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical binned with size', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should draw bar with x centered on bin_mid and width = size field', function () {
            assert.deepEqual(props.xc, { signal: '(scale(\"x\", datum[\"bin_maxbins_10_Horsepower\"]) + scale(\"x\", datum[\"bin_maxbins_10_Horsepower_end\"]))/2' });
            assert.deepEqual(props.width, { scale: 'size', field: 'mean_Acceleration' });
        });
    });
    describe('vertical, with log', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should end on axis and has no height', function () {
            assert.deepEqual(props.y2, { field: { group: 'height' } });
            assert.isUndefined(props.height);
        });
    });
    describe('horizontal, with log', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "scale": { "type": 'log' }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should end on axis and has no width', function () {
            assert.deepEqual(props.x2, { value: 0 });
            assert.isUndefined(props.width);
        });
    });
    describe('vertical, with fit mode', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "width": 120,
            "height": 120,
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should use x and with band true', function () {
            assert.deepEqual(props.x, {
                scale: 'x',
                field: 'Origin',
            });
            assert.deepEqual(props.width, {
                scale: 'x',
                band: true,
            });
        });
    });
    describe('horizontal, with fit mode', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "width": 120,
            "height": 120,
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should use y with band true', function () {
            assert.deepEqual(props.y, {
                scale: 'y',
                field: 'Origin',
            });
            assert.deepEqual(props.height, {
                scale: 'y',
                band: true,
            });
        });
    });
    describe('vertical with zero=false', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "scale": { "zero": false }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should end on axis nad have no height', function () {
            assert.deepEqual(props.y2, { field: { group: 'height' } });
            assert.isUndefined(props.height);
        });
    });
    describe('horizontal with zero=false', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "bar",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "scale": { "zero": false }, "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = bar.encodeEntry(model);
        it('should end on axis and have no width', function () {
            assert.deepEqual(props.x2, { value: 0 });
            assert.isUndefined(props.width);
        });
    });
    describe('1D vertical', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "bar",
            "encoding": { "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" } },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar.encodeEntry(model);
        it('should have y end on axis, have no-height and have x-offset', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'sum_US_Gross' });
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            assert.isUndefined(props.height);
            assert.deepEqual(props.xc, {
                mult: 0.5,
                signal: 'width'
            });
        });
    });
    describe('1D vertical with size value', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "bar",
            "encoding": {
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" },
                "size": { "value": 5 }
            },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar.encodeEntry(model);
        it('should have width = 5', function () {
            assert.deepEqual(props.width, { value: 5 });
        });
    });
    describe('1D vertical with barSize config', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/movies.json' },
            "mark": "bar",
            "encoding": {
                "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
            },
            "config": {
                "bar": { "discreteBandSize": 5 }
            }
        });
        var props = bar.encodeEntry(model);
        it('should have width = 5', function () {
            assert.deepEqual(props.width, { value: 5 });
        });
    });
    describe('1D horizontal', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "bar",
            "encoding": { "x": { "type": "quantitative", "field": 'US_Gross', "aggregate": 'sum' } },
            "data": { "url": 'data/movies.json' }
        });
        var props = bar.encodeEntry(model);
        it('should end on axis, have no width, and have y-offset', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'sum_US_Gross' });
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            assert.isUndefined(props.width);
            assert.deepEqual(props.yc, {
                mult: 0.5,
                signal: 'height'
            });
        });
    });
    describe('QxQ horizontal', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        var model = parseUnitModelWithScaleAndLayoutSize({
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
        var props = bar.encodeEntry(model);
        it('should produce horizontal bar using x, x2', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'Acceleration' });
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            assert.deepEqual(props.yc, { scale: 'y', field: 'Horsepower' });
            assert.deepEqual(props.height, { value: defaultBarConfig.continuousBandSize });
        });
    });
    describe('QxQ vertical', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        var model = parseUnitModelWithScaleAndLayoutSize({
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
        var props = bar.encodeEntry(model);
        it('should produce horizontal bar using x, x2', function () {
            assert.deepEqual(props.xc, { scale: 'x', field: 'Acceleration' });
            assert.deepEqual(props.width, { value: defaultBarConfig.continuousBandSize });
            assert.deepEqual(props.y, { scale: 'y', field: 'Horsepower' });
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
        });
    });
    describe('OxN', function () {
        // This is generally a terrible idea, but we should still test
        // if the output show expected results
        it('should produce vertical bar using x, width', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": 'data/cars.json' },
                "mark": "bar",
                "encoding": {
                    "x": { "field": 'Origin', "type": "nominal" },
                    "y": { "field": 'Cylinders', "type": "ordinal" }
                }
            });
            var props = bar.encodeEntry(model);
            assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
            assert.deepEqual(props.width, { scale: 'x', band: true });
            assert.deepEqual(props.y, { scale: 'y', field: 'Cylinders' });
            assert.deepEqual(props.height, { scale: 'y', band: true });
        });
    });
    describe('ranged bar', function () {
        // TODO: gantt chart with temporal
        // TODO: gantt chart with ordinal
        it('vertical bars should work with aggregate', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "age", "type": "ordinal" },
                    "y": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "y2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar.encodeEntry(model);
            assert.deepEqual(props.x, { scale: 'x', field: 'age' });
            assert.deepEqual(props.y, { scale: 'y', field: 'q1_people' });
            assert.deepEqual(props.y2, { scale: 'y', field: 'q3_people' });
        });
        it('horizontal bars should work with aggregate', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/population.json" },
                "mark": "bar",
                "encoding": {
                    "y": { "field": "age", "type": "ordinal" },
                    "x": { "field": "people", "aggregate": "q1", "type": "quantitative" },
                    "x2": { "field": "people", "aggregate": "q3", "type": "quantitative" }
                }
            });
            var props = bar.encodeEntry(model);
            assert.deepEqual(props.y, { scale: 'y', field: 'age' });
            assert.deepEqual(props.x, { scale: 'x', field: 'q1_people' });
            assert.deepEqual(props.x2, { scale: 'x', field: 'q3_people' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbWFyay9iYXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDbEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsb0NBQW9DLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFaEUsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7WUFDakQsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFDO1lBQ2pDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDM0MsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUM7YUFDNUU7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXJDLEVBQUUsQ0FBQyxtRkFBbUYsRUFBRTtZQUN0RixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUMs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LE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDeEMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ25FLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUNyRTthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YmFyfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL2Jhcic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge2RlZmF1bHRCYXJDb25maWd9IGZyb20gJy4uLy4uLy4uL3NyYy9tYXJrJztcbmltcG9ydCB7ZGVmYXVsdFNjYWxlQ29uZmlnfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyazogQmFyJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdzaW1wbGUgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIsIHdpdGggeSBmcm9tIHplcm8gdG8gZmllbGQgdmFsdWUgYW5kIHdpdGggYmFuZCB2YWx1ZSBmb3IgeC93aWR0aCAnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnT3JpZ2luJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAneCcsIGJhbmQ6IHRydWV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGRyYXcgdmVydGljYWwgYmFyLCB3aXRoIHkgZnJvbSB6ZXJvIHRvIGZpZWxkIHZhbHVlIGFuZCB3aXRoIGJhbmQgdmFsdWUgZm9yIHgvd2lkdGggd2hlbiBkb21haW4gdGhhdCBpbmNsdWRlcyB6ZXJvIGlzIHNwZWNpZmllZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcInNjYWxlXCI6IHtcImRvbWFpblwiOiBbLTEsIDFdfX1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7c2NhbGU6ICd4JywgYmFuZDogdHJ1ZX0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZHJhdyB2ZXJ0aWNhbCBiYXIsIHdpdGggeSBmcm9tIFwiZ3JvdXA6IGhlaWdodFwiIHRvIGZpZWxkIHZhbHVlIHdoZW4gZG9tYWluIHRoYXQgZXhjbHVkZXMgemVybyBpcyBzcGVjaWZpZWQnLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJzY2FsZVwiOiB7XCJkb21haW5cIjogWzEsIDJdfX1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcblxuICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vblplcm9TY2FsZVVzZWRXaXRoTGVuZ3RoTWFyaygnYmFyJywgJ3knLCB7emVyb0ZhbHNlOiBmYWxzZX0pKTtcbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgZHJhdyB2ZXJ0aWNhbCBiYXIsIHdpdGggeSBmcm9tIFwiZ3JvdXA6IGhlaWdodFwiIHRvIGZpZWxkIHZhbHVlIHdoZW4gemVybz1mYWxzZSBmb3IgeS1zY2FsZScsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9fVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0pO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2Uubm9uWmVyb1NjYWxlVXNlZFdpdGhMZW5ndGhNYXJrKCdiYXInLCAneScsIHt6ZXJvRmFsc2U6IHRydWV9KSk7XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIGRyYXcgdmVydGljYWwgYmFyLCB3aXRoIHkgZnJvbSBcImdyb3VwOiBoZWlnaHRcIiB0byBmaWVsZCB2YWx1ZSB3aGVuIHktc2NhbGUgdHlwZSBpcyBsb2cnLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9fVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0pO1xuICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2Uubm9uWmVyb1NjYWxlVXNlZFdpdGhMZW5ndGhNYXJrKCdiYXInLCAneScsIHtzY2FsZVR5cGU6ICdsb2cnfSkpO1xuICB9KSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgd2l0aCBiYW5kIHZhbHVlIGZvciB4L3dpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7c2NhbGU6ICd5JywgYmFuZDogdHJ1ZX0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIHdpdGggcG9pbnQgc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIn19LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIGZyb20gemVybyB0byBmaWVsZCB2YWx1ZSBhbmQgeSB3aXRoIGNlbnRlciBwb3NpdGlvbiBhbmQgaGVpZ2h0ID0gcmFuZ2VTdGVwIC0gMScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnT3JpZ2luJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHt2YWx1ZTogZGVmYXVsdFNjYWxlQ29uZmlnLnJhbmdlU3RlcCAtIDF9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaW1wbGUgaG9yaXpvbnRhbCB3aXRoIHNpemUgdmFsdWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGhlaWdodCB0byA1IGFuZCBjZW50ZXIgeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IDV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtzY2FsZTogJ3knLCBmaWVsZDogJ09yaWdpbicsIGJhbmQ6IDAuNX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2ltcGxlIGhvcml6b250YWwgd2l0aCBzaXplIHZhbHVlIGluIG1hcmsgZGVmJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImJhclwiLCBcInNpemVcIjogNX0sXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGhlaWdodCB0byA1IGFuZCBjZW50ZXIgeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IDV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtzY2FsZTogJ3knLCBmaWVsZDogJ09yaWdpbicsIGJhbmQ6IDAuNX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2ltcGxlIGhvcml6b250YWwgd2l0aCBzaXplIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwic2l6ZVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkcmF3IGJhciBmcm9tIHplcm8gdG8gZmllbGQgdmFsdWUgYW5kIHdpdGggYmFuZCB2YWx1ZSBmb3IgeC93aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ09yaWdpbid9KTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtzY2FsZTogJ3knLCBiYW5kOiB0cnVlfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdGhyb3cgd2FybmluZycsICgpPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmNhbm5vdFVzZVNpemVGaWVsZFdpdGhCYW5kU2l6ZSgneScpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBhbmQgeTInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQsIHNvcnQgZGVzY2VuZGluZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzb3J0XCI6IFwiZGVzY2VuZGluZ1wifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHkgYW5kIHkyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnkyLCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkLCByZXZlcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInJldmVyc2VcIjogdHJ1ZX19LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeSBhbmQgeTInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInLCBvZmZzZXQ6IGRlZmF1bHRCYXJDb25maWcuYmluU3BhY2luZ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6ICd5JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZCd9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYmlubmVkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHggYW5kIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyJywgb2Zmc2V0OiBkZWZhdWx0QmFyQ29uZmlnLmJpblNwYWNpbmd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgYmlubmVkLCBzb3J0IGRlc2NlbmRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic29ydFwiOiBcImRlc2NlbmRpbmdcIn0sXG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB4IGFuZCB4MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnLCBvZmZzZXQ6IGRlZmF1bHRCYXJDb25maWcuYmluU3BhY2luZ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCBiaW5uZWQgd2l0aCBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfcmFuZ2UnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3NjYWxlOiAneScsIGJhbmQ6IHRydWV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCB3aXRoIG9yZGluYWwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcmF3IGJhciB3aXRoIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9yYW5nZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtzY2FsZTogJ3gnLCBiYW5kOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2hvcml6b250YWwgYmlubmVkIHdpdGggbm8gc3BhY2luZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfSxcbiAgICAgIFwiY29uZmlnXCI6IHtcImJhclwiOiB7XCJiaW5TcGFjaW5nXCI6IDB9fVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5IGFuZCB5MicsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlcl9lbmQnfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3ZlcnRpY2FsIGJpbm5lZCB3aXRoIG5vIHNwYWNpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJiYXJcIjoge1wiYmluU3BhY2luZ1wiOiAwfX1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeCBhbmQgeDInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kJ30pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLndpZHRoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NpbXBsZSBob3Jpem9udGFsIGJpbm5lZCB3aXRoIHNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6ICdIb3JzZXBvd2VyJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwic2l6ZVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZHJhdyBiYXIgd2l0aCB5IGNlbnRlcmVkIG9uIGJpbl9taWQgYW5kIGhlaWdodCA9IHNpemUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueWMsIHtzaWduYWw6ICcoc2NhbGUoXCJ5XCIsIGRhdHVtW1wiYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlclwiXSkgKyBzY2FsZShcInlcIiwgZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9Ib3JzZXBvd2VyX2VuZFwiXSkpLzInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmhlaWdodCwge3NjYWxlOiAnc2l6ZScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCBiaW5uZWQgd2l0aCBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInNpemVcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGRyYXcgYmFyIHdpdGggeCBjZW50ZXJlZCBvbiBiaW5fbWlkIGFuZCB3aWR0aCA9IHNpemUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzaWduYWw6ICcoc2NhbGUoXFxcInhcXFwiLCBkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfSG9yc2Vwb3dlclxcXCJdKSArIHNjYWxlKFxcXCJ4XFxcIiwgZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX0hvcnNlcG93ZXJfZW5kXFxcIl0pKS8yJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAnc2l6ZScsIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCwgd2l0aCBsb2cnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieVwiOiB7XCJzY2FsZVwiOiB7XCJ0eXBlXCI6ICdsb2cnfSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgZW5kIG9uIGF4aXMgYW5kIGhhcyBubyBoZWlnaHQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy5oZWlnaHQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCwgd2l0aCBsb2cnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL2NhcnMuanNvbid9LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJzY2FsZVwiOiB7XCJ0eXBlXCI6ICdsb2cnfSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcyBhbmQgaGFzIG5vIHdpZHRoJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7dmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd2ZXJ0aWNhbCwgd2l0aCBmaXQgbW9kZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwid2lkdGhcIjogMTIwLFxuICAgICAgXCJoZWlnaHRcIjogMTIwLFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB4IGFuZCB3aXRoIGJhbmQgdHJ1ZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge1xuICAgICAgICBzY2FsZTogJ3gnLFxuICAgICAgICBmaWVsZDogJ09yaWdpbicsXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHtcbiAgICAgICAgc2NhbGU6ICd4JyxcbiAgICAgICAgYmFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaG9yaXpvbnRhbCwgd2l0aCBmaXQgbW9kZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwid2lkdGhcIjogMTIwLFxuICAgICAgXCJoZWlnaHRcIjogMTIwLFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB5IHdpdGggYmFuZCB0cnVlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7XG4gICAgICAgIHNjYWxlOiAneScsXG4gICAgICAgIGZpZWxkOiAnT3JpZ2luJyxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtcbiAgICAgICAgc2NhbGU6ICd5JyxcbiAgICAgICAgYmFuZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndmVydGljYWwgd2l0aCB6ZXJvPWZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX0sIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdBY2NlbGVyYXRpb24nLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzIG5hZCBoYXZlIG5vIGhlaWdodCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge2ZpZWxkOiB7Z3JvdXA6ICdoZWlnaHQnfX0pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHByb3BzLmhlaWdodCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdob3Jpem9udGFsIHdpdGggemVybz1mYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9LCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgaXQoJ3Nob3VsZCBlbmQgb24gYXhpcyBhbmQgaGF2ZSBubyB3aWR0aCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54Miwge3ZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMud2lkdGgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnMUQgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9fSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9tb3ZpZXMuanNvbid9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgeSBlbmQgb24gYXhpcywgaGF2ZSBuby1oZWlnaHQgYW5kIGhhdmUgeC1vZmZzZXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnc3VtX1VTX0dyb3NzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Miwge3NjYWxlOiAneScsIHZhbHVlOiAwfSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQocHJvcHMuaGVpZ2h0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICd3aWR0aCdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnMUQgdmVydGljYWwgd2l0aCBzaXplIHZhbHVlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9tb3ZpZXMuanNvbid9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgd2lkdGggPSA1JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLndpZHRoLCB7dmFsdWU6IDV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJzFEIHZlcnRpY2FsIHdpdGggYmFyU2l6ZSBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvbW92aWVzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwiYmFyXCI6IHtcImRpc2NyZXRlQmFuZFNpemVcIjogNX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHdpZHRoID0gNScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3ZhbHVlOiA1fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcxRCBob3Jpem9udGFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6ICdzdW0nfX0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6ICdkYXRhL21vdmllcy5qc29uJ31cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGVuZCBvbiBheGlzLCBoYXZlIG5vIHdpZHRoLCBhbmQgaGF2ZSB5LW9mZnNldCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdzdW1fVVNfR3Jvc3MnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgdmFsdWU6IDB9KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChwcm9wcy53aWR0aCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnljLCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnaGVpZ2h0J1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdReFEgaG9yaXpvbnRhbCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgZ2VuZXJhbGx5IGEgdGVycmlibGUgaWRlYSwgYnV0IHdlIHNob3VsZCBzdGlsbCB0ZXN0XG4gICAgLy8gaWYgdGhlIG91dHB1dCBzaG93IGV4cGVjdGVkIHJlc3VsdHNcblxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiAnQWNjZWxlcmF0aW9uJywgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiAnSG9yc2Vwb3dlcicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgXCJtYXJrXCI6IHtcIm9yaWVudFwiOiBcImhvcml6b250YWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGhvcml6b250YWwgYmFyIHVzaW5nIHgsIHgyJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueDIsIHtzY2FsZTogJ3gnLCB2YWx1ZTogMH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55Yywge3NjYWxlOiAneScsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuaGVpZ2h0LCB7dmFsdWU6IGRlZmF1bHRCYXJDb25maWcuY29udGludW91c0JhbmRTaXplfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdReFEgdmVydGljYWwnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGdlbmVyYWxseSBhIHRlcnJpYmxlIGlkZWEsIGJ1dCB3ZSBzaG91bGQgc3RpbGwgdGVzdFxuICAgIC8vIGlmIHRoZSBvdXRwdXQgc2hvdyBleHBlY3RlZCByZXN1bHRzXG5cbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogJ2RhdGEvY2Fycy5qc29uJ30sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogJ0FjY2VsZXJhdGlvbicsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogJ0hvcnNlcG93ZXInLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwibWFya1wiOiB7XCJvcmllbnRcIjogXCJ2ZXJ0aWNhbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgaG9yaXpvbnRhbCBiYXIgdXNpbmcgeCwgeDInLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueGMsIHtzY2FsZTogJ3gnLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMud2lkdGgsIHt2YWx1ZTogZGVmYXVsdEJhckNvbmZpZy5jb250aW51b3VzQmFuZFNpemV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnSG9yc2Vwb3dlcid9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCB2YWx1ZTogMH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnT3hOJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBnZW5lcmFsbHkgYSB0ZXJyaWJsZSBpZGVhLCBidXQgd2Ugc2hvdWxkIHN0aWxsIHRlc3RcbiAgICAvLyBpZiB0aGUgb3V0cHV0IHNob3cgZXhwZWN0ZWQgcmVzdWx0c1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSB2ZXJ0aWNhbCBiYXIgdXNpbmcgeCwgd2lkdGgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiAnZGF0YS9jYXJzLmpzb24nfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiAnT3JpZ2luJywgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogJ0N5bGluZGVycycsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGJhci5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiAneCcsIGZpZWxkOiAnT3JpZ2luJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy53aWR0aCwge3NjYWxlOiAneCcsIGJhbmQ6IHRydWV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnQ3lsaW5kZXJzJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5oZWlnaHQsIHtzY2FsZTogJ3knLCBiYW5kOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyYW5nZWQgYmFyJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogZ2FudHQgY2hhcnQgd2l0aCB0ZW1wb3JhbFxuXG4gICAgLy8gVE9ETzogZ2FudHQgY2hhcnQgd2l0aCBvcmRpbmFsXG5cbiAgICBpdCgndmVydGljYWwgYmFycyBzaG91bGQgd29yayB3aXRoIGFnZ3JlZ2F0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJhZ2dyZWdhdGVcIjogXCJxMVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInEzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcHJvcHMgPSBiYXIuZW5jb2RlRW50cnkobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdhZ2UnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogJ3knLCBmaWVsZDogJ3ExX3Blb3BsZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueTIsIHtzY2FsZTogJ3knLCBmaWVsZDogJ3EzX3Blb3BsZSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdob3Jpem9udGFsIGJhcnMgc2hvdWxkIHdvcmsgd2l0aCBhZ2dyZWdhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwiYWdncmVnYXRlXCI6IFwicTFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJhZ2dyZWdhdGVcIjogXCJxM1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHByb3BzID0gYmFyLmVuY29kZUVudHJ5KG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiAneScsIGZpZWxkOiAnYWdlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6ICd4JywgZmllbGQ6ICdxMV9wZW9wbGUnfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngyLCB7c2NhbGU6ICd4JywgZmllbGQ6ICdxM19wZW9wbGUnfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=