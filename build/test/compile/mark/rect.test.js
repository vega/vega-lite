/* tslint:disable quotemark */
import { assert } from 'chai';
import { rect } from '../../../src/compile/mark/rect';
import * as log from '../../../src/log';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Rect', function () {
    describe('simple vertical', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "x": { "field": "Origin", "type": "nominal" },
                "y": { "type": "quantitative", "field": 'Acceleration', "aggregate": "mean" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw bar, with y from zero to field value and x band', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'Origin' });
            assert.deepEqual(props.width, { scale: 'x', band: true });
            assert.deepEqual(props.y, { scale: 'y', field: 'mean_Acceleration' });
            assert.deepEqual(props.y2, { scale: 'y', value: 0 });
            assert.isUndefined(props.height);
        });
    });
    describe('simple horizontal', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw bar from zero to field value and y band', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
            assert.deepEqual(props.height, { scale: 'y', band: true });
            assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
            assert.deepEqual(props.x2, { scale: 'x', value: 0 });
            assert.isUndefined(props.width);
        });
    });
    describe('simple horizontal with size field', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "y": { "field": "Origin", "type": "nominal" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" },
                "size": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        log.wrap(function (localLogger) {
            it('should draw bar from zero to field value and with band value for x/width', function () {
                assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
                assert.deepEqual(props.height, { scale: 'y', band: true });
                assert.deepEqual(props.x, { scale: 'x', field: 'mean_Acceleration' });
                assert.deepEqual(props.x2, { scale: 'x', value: 0 });
                assert.isUndefined(props.width);
            });
            it('should throw warning', function () {
                assert.equal(localLogger.warns[0], log.message.cannotApplySizeToNonOrientedMark('rect'));
            });
        });
    });
    describe('horizontal binned', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "y": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw bar with y and y2', function () {
            assert.deepEqual(props.y2, { scale: 'y', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.y, { scale: 'y', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.height);
        });
    });
    describe('vertical binned', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "x": { "bin": true, "field": 'Horsepower', "type": "quantitative" },
                "y": { "aggregate": "mean", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw bar with x and x2', function () {
            assert.deepEqual(props.x2, { scale: 'x', field: 'bin_maxbins_10_Horsepower' });
            assert.deepEqual(props.x, { scale: 'x', field: 'bin_maxbins_10_Horsepower_end' });
            assert.isUndefined(props.width);
        });
    });
    describe('simple ranged', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": 'data/cars.json' },
            "mark": "rect",
            "encoding": {
                "y": { "aggregate": "min", "field": 'Horsepower', "type": "quantitative" },
                "y2": { "aggregate": "max", "field": 'Horsepower', "type": "quantitative" },
                "x": { "aggregate": "min", "field": 'Acceleration', "type": "quantitative" },
                "x2": { "aggregate": "max", "field": 'Acceleration', "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw rectangle with x, x2, y, y2', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'min_Acceleration' });
            assert.deepEqual(props.x2, { scale: 'x', field: 'max_Acceleration' });
            assert.deepEqual(props.y, { scale: 'y', field: 'min_Horsepower' });
            assert.deepEqual(props.y2, { scale: 'y', field: 'max_Horsepower' });
        });
    });
    describe('simple heatmap', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": "data/cars.json" },
            "mark": "rect",
            "encoding": {
                "y": { "field": "Origin", "type": "ordinal" },
                "x": { "field": "Cylinders", "type": "ordinal" },
                "color": { "aggregate": "mean", "field": "Horsepower", "type": "quantitative" }
            }
        });
        var props = rect.encodeEntry(model);
        it('should draw rect with x and y bands', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'Cylinders' });
            assert.deepEqual(props.width, { scale: 'x', band: true });
            assert.deepEqual(props.y, { scale: 'y', field: 'Origin' });
            assert.deepEqual(props.height, { scale: 'y', band: true });
        });
    });
});
//# sourceMappingURL=rect.test.js.map