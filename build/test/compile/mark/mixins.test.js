"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var mixins_1 = require("../../../src/compile/mark/mixins");
var log = tslib_1.__importStar(require("../../../src/log"));
var util_1 = require("../../util");
describe('compile/mark/mixins', function () {
    describe('color()', function () {
        it('color should be mapped to fill for bar', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "color" });
        });
        it('color should be mapped to stroke for point', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "color" });
            chai_1.assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('add transparent fill when stroke is encoded', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.deepEqual(colorMixins.stroke, { "field": "gender", "scale": "stroke" });
            chai_1.assert.propertyVal(colorMixins.fill, 'value', "transparent");
        });
        it('ignores color if fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.isUndefined(colorMixins.stroke);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('ignores color property if fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            var colorMixins = mixins_1.color(model);
            chai_1.assert.isUndefined(colorMixins.stroke);
            chai_1.assert.deepEqual(colorMixins.fill, { "field": "gender", "scale": "fill" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply stroke property over color property', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "stroke": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { stroke: true }));
        }));
        it('should apply ignore color property when fill is specified', log.wrap(function (logger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red", "fill": "blue" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.isUndefined(props.stroke);
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('property', { fill: true }));
        }));
        it('should apply color property', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "point", "color": "red" },
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply color from mark-specific config over general mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "blue" }, "point": { "color": "red" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "red" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "mark": { "color": "red", "stroke": "blue" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
        });
        it('should apply stroke mark config over color mark config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
                },
                "config": { "point": { "color": "red", "stroke": "blue" } }
            });
            var props = mixins_1.color(model);
            chai_1.assert.deepEqual(props.stroke, { value: "blue" });
        });
    });
    describe('tooltip()', function () {
        it('generates tooltip object signal for an array of tooltip fields', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "tooltip": [
                        { "field": "Horsepower", "type": "quantitative" },
                        { "field": "Acceleration", "type": "quantitative" }
                    ]
                }
            });
            var props = mixins_1.tooltip(model);
            chai_1.assert.deepEqual(props.tooltip, { signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}' });
        });
    });
    describe('midPoint()', function () {
        it('should return correctly for lat/lng', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            [channel_1.X, channel_1.Y].forEach(function (channel) {
                var mixins = mixins_1.pointPosition(channel, model, 'zeroOrMin');
                chai_1.assert.equal(mixins[channel].field, model.getName(channel));
            });
        });
    });
});
//# sourceMappingURL=mixins.test.js.map