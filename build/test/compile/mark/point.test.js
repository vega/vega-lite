/* tslint:disable quotemark */
import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { COLOR, SHAPE, SIZE, X, Y } from '../../../src/channel';
import { circle, point, square } from '../../../src/compile/mark/point';
import { defaultMarkConfig } from '../../../src/mark';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Point', function () {
    function pointXY(moreEncoding) {
        if (moreEncoding === void 0) { moreEncoding = {}; }
        return {
            "mark": "point",
            "encoding": tslib_1.__assign({ "x": { "field": "year", "type": "ordinal" }, "y": { "field": "yield", "type": "quantitative" } }, moreEncoding),
            "data": { "url": "data/barley.json" }
        };
    }
    describe('with x', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": { "x": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = point.encodeEntry(model);
        it('should be centered on y', function () {
            assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'year' });
        });
    });
    describe('with stacked x', function () {
        // This is a simplified example for stacked point.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = point.encodeEntry(model);
        it('should use stack_end on x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'sum_a_end' });
        });
    });
    describe('with y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": { "y": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = point.encodeEntry(model);
        it('should be centered on x', function () {
            assert.deepEqual(props.x, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'year' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked point.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = point.encodeEntry(model);
        it('should use stack_end on y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'sum_a_end' });
        });
    });
    describe('with x and y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(pointXY());
        var props = point.encodeEntry(model);
        it('should scale on x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'year' });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'yield' });
        });
        it('should be an unfilled circle', function () {
            assert.deepEqual(props.fill, { value: 'transparent' });
            assert.deepEqual(props.stroke, { value: defaultMarkConfig.color });
        });
    });
    describe('with band x and quantitative y', function () {
        it('should offset band position by half band', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/barley.json" },
                "mark": "point",
                "encoding": {
                    "x": { "field": "year", "type": "ordinal", "scale": { "type": "band" } },
                    "y": { "field": "yield", "type": "quantitative" }
                }
            });
            var props = point.encodeEntry(model);
            assert.deepEqual(props.x, { scale: 'x', field: 'year', band: 0.5 });
        });
    });
    describe('with x, y, size', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(pointXY({
            "size": { "aggregate": "count", "type": "quantitative" }
        }));
        var props = point.encodeEntry(model);
        it('should have scale for size', function () {
            assert.deepEqual(props.size, { scale: SIZE, field: 'count_*' });
        });
    });
    describe('with x, y, color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(pointXY({
            "color": { "field": "yield", "type": "quantitative" }
        }));
        var props = point.encodeEntry(model);
        it('should have scale for color', function () {
            assert.deepEqual(props.stroke, { scale: COLOR, field: 'yield' });
        });
    });
    describe('with x, y, and condition-only color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(tslib_1.__assign({}, pointXY({
            "color": { "condition": { "selection": "test", "field": "yield", "type": "quantitative" } }
        }), { selection: { test: { type: 'single' } } }));
        model.parseSelection();
        var props = point.encodeEntry(model);
        it('should have one condition for color with scale for "yield"', function () {
            assert.isArray(props.stroke);
            assert.equal(props.stroke['length'], 2);
            assert.equal(props.stroke[0].scale, COLOR);
            assert.equal(props.stroke[0].field, 'yield');
        });
    });
    describe('with x, y, and condition-only color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(tslib_1.__assign({}, pointXY({
            "color": { "condition": { "test": "true", "field": "yield", "type": "quantitative" } }
        })));
        model.parseSelection();
        var props = point.encodeEntry(model);
        it('should have one condition for color with scale for "yield"', function () {
            assert.isArray(props.stroke);
            assert.equal(props.stroke['length'], 2);
            assert.equal(props.stroke[0].test, "true");
            assert.equal(props.stroke[1].value, "#4c78a8");
        });
    });
    describe('with x, y, shape', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(pointXY({
            "shape": { "field": "site", "type": "nominal" }
        }));
        var props = point.encodeEntry(model);
        it('should have scale for shape', function () {
            assert.deepEqual(props.shape, { scale: SHAPE, field: 'site' });
        });
    });
    describe('with constant color, shape, and size', function () {
        var model = parseUnitModelWithScaleAndLayoutSize(pointXY({
            "shape": { "value": "circle" },
            "color": { "value": "red" },
            "size": { "value": 23 }
        }));
        var props = point.encodeEntry(model);
        it('should correct shape, color and size', function () {
            assert.deepEqual(props.shape, { value: "circle" });
            assert.deepEqual(props.stroke, { value: "red" });
            assert.deepEqual(props.size, { value: 23 });
        });
    });
    describe('with tooltip', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "tooltip": { "value": "foo" }
            }
        });
        var props = point.encodeEntry(model);
        it('should pass tooltip value to encoding', function () {
            assert.deepEqual(props.tooltip, { value: "foo" });
        });
    });
    describe('with href', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "point",
            "encoding": {
                "href": { "value": "https://idl.cs.washington.edu/" }
            }
        });
        var props = point.encodeEntry(model);
        it('should pass href value to encoding', function () {
            assert.deepEqual(props.href, { value: 'https://idl.cs.washington.edu/' });
        });
    });
});
describe('Mark: Square', function () {
    it('should have correct shape', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            }
        });
        var props = square.encodeEntry(model);
        assert.propertyVal(props.shape, 'value', 'square');
    });
    it('should be filled by default', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            }
        });
        var props = square.encodeEntry(model);
        assert.propertyVal(props.fill, 'value', 'blue');
    });
    it('with config.mark.filled:false should have transparent fill', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "square",
            "encoding": {
                "color": { "value": "blue" }
            },
            "config": {
                "mark": {
                    "filled": false
                }
            }
        });
        var props = square.encodeEntry(model);
        assert.propertyVal(props.stroke, 'value', 'blue');
        assert.propertyVal(props.fill, 'value', 'transparent');
    });
});
describe('Mark: Circle', function () {
    var model = parseUnitModelWithScaleAndLayoutSize({
        "mark": "circle",
        "encoding": {
            "color": { "value": "blue" }
        }
    });
    var props = circle.encodeEntry(model);
    it('should have correct shape', function () {
        assert.propertyVal(props.shape, 'value', 'circle');
    });
    it('should be filled by default', function () {
        assert.propertyVal(props.fill, 'value', 'blue');
    });
    it('with config.mark.filled:false should have transparent fill', function () {
        var filledCircleModel = parseUnitModelWithScaleAndLayoutSize({
            "mark": "circle",
            "encoding": {
                "color": { "value": "blue" }
            },
            "config": {
                "mark": {
                    "filled": false
                }
            }
        });
        var filledCircleProps = circle.encodeEntry(filledCircleModel);
        assert.propertyVal(filledCircleProps.stroke, 'value', 'blue');
        assert.propertyVal(filledCircleProps.fill, 'value', 'transparent');
    });
});
//# sourceMappingURL=point.test.js.map