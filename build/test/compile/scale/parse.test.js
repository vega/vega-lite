"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var parse_1 = require("../../../src/compile/scale/parse");
var selection_1 = require("../../../src/compile/selection/selection");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('src/compile', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', function () {
        chai_1.assert.deepEqual(util_1.toSet(scale_1.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES), util_1.toSet(util_1.without(scale_1.SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme'])));
    });
    describe('parseScaleCore', function () {
        it('respects explicit scale type', function () {
            var model = util_2.parseModel({
                "data": { "url": "data/seattle-weather.csv" },
                "layer": [
                    {
                        "mark": "bar",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative"
                            }
                        }
                    },
                    {
                        "mark": "rule",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative",
                                "scale": { "type": "log" }
                            }
                        }
                    }
                ]
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.equal(model.getScaleComponent('y').explicit.type, 'log');
        });
        it('respects explicit scale type', function () {
            var model = util_2.parseModel({
                "data": { "url": "data/seattle-weather.csv" },
                "layer": [
                    {
                        "mark": "bar",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative",
                                "scale": { "type": "log" }
                            }
                        }
                    },
                    {
                        "mark": "rule",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.equal(model.getScaleComponent('y').explicit.type, 'log');
        });
        // TODO: this actually shouldn't get merged
        it('favors the first explicit scale type', log.wrap(function (localLogger) {
            var model = util_2.parseModel({
                "data": { "url": "data/seattle-weather.csv" },
                "layer": [
                    {
                        "mark": "bar",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative",
                                "scale": { "type": "log" }
                            }
                        }
                    },
                    {
                        "mark": "rule",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative",
                                "scale": { "type": "pow" }
                            }
                        }
                    }
                ]
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.equal(model.getScaleComponent('y').explicit.type, 'log');
            chai_1.assert.equal(localLogger.warns[0], log.message.mergeConflictingProperty('type', 'scale', 'log', 'pow'));
        }));
        it('favors the band over point', function () {
            var model = util_2.parseModel({
                "data": { "url": "data/seattle-weather.csv" },
                "layer": [
                    {
                        "mark": "point",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative"
                            },
                            "x": { "field": "weather", "type": "nominal" }
                        }
                    }, {
                        "mark": "bar",
                        "encoding": {
                            "y": {
                                "aggregate": "mean",
                                "field": "precipitation",
                                "type": "quantitative"
                            },
                            "x": { "field": "weather", "type": "nominal" }
                        }
                    },
                ]
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.equal(model.getScaleComponent('x').implicit.type, 'band');
        });
    });
    describe('parseScale', function () {
        describe('x ordinal point', function () {
            it('should create an x point scale with rangeStep and no range', function () {
                var model = util_2.parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: { field: 'origin', type: "nominal" }
                    }
                });
                var scale = model.getScaleComponent('x');
                chai_1.assert.equal(scale.implicit.type, 'point');
                chai_1.assert.deepEqual(scale.implicit.range, { step: 21 });
            });
        });
        it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { field: 'origin', type: "nominal", scale: { type: 'band', padding: 0.6 } }
                }
            });
            var scale = model.getScaleComponent('x');
            chai_1.assert.equal(scale.explicit.padding, 0.6);
            chai_1.assert.isUndefined(scale.get('paddingInner'));
            chai_1.assert.isUndefined(scale.get('paddingOuter'));
        });
        it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { field: 'origin', type: "nominal", scale: { type: 'band' } }
                },
                config: {
                    scale: { bandPaddingInner: 0.3 }
                }
            });
            var scale = model.getScaleComponent('x');
            chai_1.assert.equal(scale.implicit.paddingInner, 0.3);
            chai_1.assert.equal(scale.implicit.paddingOuter, 0.15);
            chai_1.assert.isUndefined(scale.get('padding'));
        });
        describe('nominal with color', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "nominal" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create correct color scale', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'ordinal');
                chai_1.assert.deepEqual(scale.implicit.domain, {
                    data: 'main',
                    field: 'origin',
                    sort: true
                });
                chai_1.assert.equal(scale.implicit.range, 'category');
            });
        });
        describe('ordinal with color', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "ordinal" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create sequential color scale', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'ordinal');
                chai_1.assert.deepEqual(scale.implicit.domain, {
                    data: 'main',
                    field: 'origin',
                    sort: true
                });
            });
        });
        describe('quantitative with color', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create linear color scale', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'sequential');
                chai_1.assert.equal(scale.implicit.range, 'ramp');
                chai_1.assert.deepEqual(scale.implicit.domain, {
                    data: 'main',
                    field: 'origin'
                });
            });
        });
        describe('color with bin', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'bin-ordinal');
            });
        });
        describe('ordinal color with bin', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "ordinal", bin: true }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'ordinal');
            });
        });
        describe('opacity with bin', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    opacity: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('opacity');
            it('should add correct scales', function () {
                chai_1.assert.equal(scale.implicit.name, 'opacity');
                chai_1.assert.equal(scale.implicit.type, 'bin-linear');
            });
        });
        describe('size with bin', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    size: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('size');
            it('should add correct scales', function () {
                chai_1.assert.equal(scale.implicit.name, 'size');
                chai_1.assert.equal(scale.implicit.type, 'bin-linear');
            });
        });
        describe('color with time unit', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "temporal", timeUnit: "year" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                chai_1.assert.equal(scale.implicit.name, 'color');
                chai_1.assert.equal(scale.implicit.type, 'sequential');
            });
        });
        describe('selection domain', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "area",
                encoding: {
                    x: {
                        field: "date", type: "temporal",
                        scale: { domain: { selection: "brush", encoding: "x" } },
                    },
                    y: {
                        field: "date", type: "temporal",
                        scale: { domain: { selection: "foobar", field: "Miles_per_Gallon" } },
                    }
                }
            });
            var xScale = model.getScaleComponent('x');
            var yscale = model.getScaleComponent('y');
            it('should add a raw selection domain', function () {
                chai_1.assert.property(xScale.explicit, 'domainRaw');
                chai_1.assert.propertyVal(xScale.explicit.domainRaw, 'signal', selection_1.SELECTION_DOMAIN + '{"selection":"brush","encoding":"x"}');
                chai_1.assert.property(yscale.explicit, 'domainRaw');
                chai_1.assert.propertyVal(yscale.explicit.domainRaw, 'signal', selection_1.SELECTION_DOMAIN + '{"selection":"foobar","field":"Miles_per_Gallon"}');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwwREFBZ0U7QUFDaEUsc0VBQTBFO0FBQzFFLHNDQUF3QztBQUN4Qyw0Q0FBaUc7QUFDakcsMENBQWlEO0FBQ2pELG1DQUErRDtBQUUvRCxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLEVBQUUsQ0FBQyx1R0FBdUcsRUFBRTtRQUMxRyxhQUFNLENBQUMsU0FBUyxDQUNkLFlBQUssQ0FBQyxtREFBMkMsQ0FBQyxFQUNsRCxZQUFLLENBQUMsY0FBTyxDQUFDLHdCQUFnQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDckYsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUM7Z0JBQzNDLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsS0FBSzt3QkFDYixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYztnQ0FDdEIsT0FB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