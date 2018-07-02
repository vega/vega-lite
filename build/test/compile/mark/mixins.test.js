/* tslint:disable:quotemark */
import { assert } from 'chai';
import { X, Y } from '../../../src/channel';
import { color, pointPosition, tooltip } from '../../../src/compile/mark/mixins';
import * as log from '../../../src/log';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/mark/mixins', function () {
    describe('color()', function () {
        it('color should be mapped to fill for bar', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "color" });
        });
        it('color should be mapped to stroke for point', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "color" });
            assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('add transparent fill when stroke is encoded', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "stroke": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "stroke" });
            assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('ignores color if fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "fill": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    },
                    "color": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.isUndefined(colorMixins.stroke);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('ignores color property if fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": {
                        "field": "gender", "type": "nominal",
                        "scale": { "rangeStep": 6 },
                        "axis": null
                    },
                    "fill": {
                        "field": "gender", "type": "nominal",
                        "scale": { "range": ["#EA98D2", "#659CCA"] }
                    }
                },
                "data": { "url": "data/population.json" }
            });
            var colorMixins = color(model);
            assert.isUndefined(colorMixins.stroke);
            assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply stroke property over color property', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "stroke": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
            assert.equal(logger.warns[0], log.message.droppingColor('property', { stroke: true }));
        }));
        it('should apply ignore color property when fill is specified', log.wrap(function (logger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "fill": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.isUndefined(props.stroke);
            assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply color property', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply color from mark-specific config over general mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "blue" }, "point": { "color": "red" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "red", "stroke": "blue" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "point": { "color": "red", "stroke": "blue" } }
            });
            var props = color(model);
            assert.deepEqual(props.stroke, { value: "blue" });
        });
    });
    describe('tooltip()', function () {
        it('generates tooltip object signal for an array of tooltip fields', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "tooltip": [
                        { "field": "Horsepower", "type": "quantitative" },
                        { "field": "Acceleration", "type": "quantitative" }
                    ]
                }
            });
            var props = tooltip(model);
            assert.deepEqual(props.tooltip, { signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}' });
        });
    });
    describe('midPoint()', function () {
        it('should return correctly for lat/lng', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "data": {
                    "url": "data/zipcodes.csv",
                    "format": {
                        "type": "csv"
                    }
                },
                "mark": "point",
                "encoding": {
                    "longitude": {
                        "field": "longitude",
                        "type": "quantitative"
                    },
                    "latitude": {
                        "field": "latitude",
                        "type": "quantitative"
                    }
                }
            });
            [X, Y].forEach(function (channel) {
                var mixins = pointPosition(channel, model, 'zeroOrMin');
                assert.equal(mixins[channel].field, model.getName(channel));
            });
        });
    });
});
//# sourceMappingURL=mixins.test.js.map