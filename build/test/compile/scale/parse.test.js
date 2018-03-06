"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_util_1 = require("vega-util");
var parse_1 = require("../../../src/compile/scale/parse");
var selection_1 = require("../../../src/compile/selection/selection");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('src/compile', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', function () {
        chai_1.assert.deepEqual(vega_util_1.toSet(scale_1.NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES), vega_util_1.toSet(util_1.without(scale_1.SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme'])));
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
        it('correctly ignores x/y when lon/lat', function () {
            var model = util_2.parseModel({
                "data": {
                    "url": "data/zipcodes.csv",
                    "format": {
                        "type": "csv"
                    }
                },
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "longitude",
                        "type": "longitude"
                    },
                    "y": {
                        "field": "latitude",
                        "type": "latitude"
                    }
                }
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.isUndefined(model.getScaleComponent('x'));
            chai_1.assert.isUndefined(model.getScaleComponent('y'));
        });
        it('correctly ignores shape when geojson', function () {
            var model = util_2.parseModel({
                "mark": "geoshape",
                "data": { "url": "data/income.json" },
                "transform": [
                    {
                        "lookup": "id",
                        "from": {
                            "data": {
                                "url": "data/us-10m.json",
                                "format": { "type": "topojson", "feature": "states" }
                            },
                            "key": "id"
                        },
                        "as": "geo"
                    }
                ],
                "encoding": {
                    "shape": { "field": "geo", "type": "geojson" },
                }
            });
            parse_1.parseScaleCore(model);
            chai_1.assert.isUndefined(model.getScaleComponent('shape'));
        });
    });
    describe('parseScale', function () {
        it('does not throw warning when two equivalent objects are specified', log.wrap(function (logger) {
            var model = util_2.parseModel({
                "data": { "url": "data/seattle-weather.csv" },
                "layer": [
                    {
                        "mark": "circle",
                        "encoding": {
                            "y": {
                                "field": "a",
                                "type": "nominal",
                                "scale": { "rangeStep": 17 }
                            }
                        }
                    },
                    {
                        "mark": "point",
                        "encoding": {
                            "y": {
                                "field": "a",
                                "type": "nominal",
                                "scale": { "rangeStep": 17 }
                            }
                        }
                    }
                ]
            });
            parse_1.parseScale(model);
            chai_1.assert.deepEqual(model.getScaleComponent('y').explicit.range, { step: 17 });
            chai_1.assert.equal(logger.warns.length, 0);
        }));
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
                chai_1.assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin',
                        sort: true
                    }]);
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
                chai_1.assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin',
                        sort: true
                    }]);
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
                chai_1.assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin'
                    }]);
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
                chai_1.assert.propertyVal(xScale.explicit.domainRaw, 'signal', selection_1.SELECTION_DOMAIN + '{"encoding":"x","selection":"brush"}');
                chai_1.assert.property(yscale.explicit, 'domainRaw');
                chai_1.assert.propertyVal(yscale.explicit.domainRaw, 'signal', selection_1.SELECTION_DOMAIN + '{"field":"Miles_per_Gallon","selection":"foobar"}');
            });
        });
    });
    describe('parseScaleDomain', function () {
        describe('faceted domains', function () {
            it('should use cloned subtree', function () {
                var model = util_2.parseModelWithScale({
                    facet: {
                        row: { field: "symbol", type: "nominal" }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                        }
                    }
                });
                chai_1.assert.deepEqual(model.component.scales.x.domains, [{
                        data: 'scale_child_main',
                        field: 'a'
                    }]);
            });
            it('should not use cloned subtree if the data is not faceted', function () {
                var model = util_2.parseModelWithScale({
                    facet: {
                        row: { field: "symbol", type: "nominal" }
                    },
                    spec: {
                        data: { url: 'foo' },
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                        }
                    }
                });
                chai_1.assert.deepEqual(model.component.scales.x.domains, [{
                        data: 'child_main',
                        field: 'a'
                    }]);
            });
            it('should not use cloned subtree if the scale is independent', function () {
                var model = util_2.parseModelWithScale({
                    facet: {
                        row: { field: "symbol", type: "nominal" }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                        }
                    },
                    resolve: {
                        scale: {
                            x: 'independent'
                        }
                    }
                });
                chai_1.assert.deepEqual(model.children[0].component.scales.x.domains, [{
                        data: 'child_main',
                        field: 'a'
                    }]);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1Qix1Q0FBZ0M7QUFDaEMsMERBQTRFO0FBQzVFLHNFQUEwRTtBQUMxRSxzQ0FBd0M7QUFDeEMsNENBQWlHO0FBQ2pHLDBDQUEwQztBQUMxQyxtQ0FBb0Y7QUFFcEYsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixFQUFFLENBQUMsdUdBQXVHLEVBQUU7UUFDMUcsYUFBTSxDQUFDLFNBQVMsQ0FDZCxpQkFBSyxDQUFDLG1EQUEyQyxDQUFDLEVBQ2xELGlCQUFLLENBQUMsY0FBTyxDQUFDLHdCQUFnQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDckYsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUM7Z0JBQzNDLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsS0FBSzt3QkFDYixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYztnQ0FDdEIsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs2QkFDekI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxzQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsSUFBTSxLQUFLLEdBQUcsaUJBQVUsQ0FBQztnQkFDdkIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFDO2dCQUMzQyxPQUFPLEVBQUU7b0JBQ1A7d0JBQ0UsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsVUFBVSxFQUFFOzRCQUNWLEdBQUcsRUFBRTtnQ0FDSCxXQUFXLEVBQUUsTUFBTTtnQ0FDbkIsT0FBTyxFQUFFLGVBQWU7Z0NBQ3hCLE1BQU0sRUFBRSxjQUFjO2dDQUN0QixPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOzZCQUN6Qjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxNQUFNLEVBQUUsTUFBTTt3QkFDZCxVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsc0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBRUgsMkNBQTJDO1FBQzNDLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUM5RCxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUM7Z0JBQzNDLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsS0FBSzt3QkFDYixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFFLGNBQWM7Z0NBQ3RCLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7NkJBQ3pCO3lCQUNGO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYztnQ0FDdEIsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs2QkFDekI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxzQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLElBQU0sS0FBSyxHQUFHLGlCQUFVLENBQUM7Z0JBQ3ZCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBQztnQkFDM0MsT0FBTyxFQUFFO29CQUNQO3dCQUNFLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYzs2QkFDdkI7NEJBQ0QsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUM3QztxQkFDRixFQUFDO3dCQUNBLE1BQU0sRUFBRSxLQUFLO3dCQUNiLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYzs2QkFDdkI7NEJBQ0QsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUM3QztxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILHNCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtvQkFDMUIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxLQUFLO3FCQUNkO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLE1BQU0sRUFBRSxXQUFXO3FCQUNwQjtvQkFDRCxHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFVBQVU7d0JBQ25CLE1BQU0sRUFBRSxVQUFVO3FCQUNuQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILHNCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsYUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqRCxhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLElBQU0sS0FBSyxHQUFHLGlCQUFVLENBQUM7Z0JBQ3ZCLE1BQU0sRUFBRSxVQUFVO2dCQUNsQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7Z0JBQ25DLFdBQVcsRUFBRTtvQkFDWDt3QkFDRSxRQUFRLEVBQUUsSUFBSTt3QkFDZCxNQUFNLEVBQUU7NEJBQ04sTUFBTSxFQUFFO2dDQUNOLEtBQUssRUFBRSxrQkFBa0I7Z0NBQ3pCLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQzs2QkFDbkQ7NEJBQ0QsS0FBSyxFQUFFLElBQUk7eUJBQ1o7d0JBQ0QsSUFBSSxFQUFFLEtBQUs7cUJBQ1o7aUJBQ0Y7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDNUM7YUFDRixDQUFDLENBQUM7WUFDSCxzQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLGFBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFNO1lBQ3JGLElBQU0sS0FBSyxHQUFHLGlCQUFVLENBQUM7Z0JBQ3ZCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBQztnQkFDM0MsT0FBTyxFQUFFO29CQUNQO3dCQUNFLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILE9BQU8sRUFBRSxHQUFHO2dDQUNaLE1BQU0sRUFBRSxTQUFTO2dDQUNqQixPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsRUFBRSxFQUFDOzZCQUMzQjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILE9BQU8sRUFBRSxHQUFHO2dDQUNaLE1BQU0sRUFBRSxTQUFTO2dDQUNqQixPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsRUFBRSxFQUFDOzZCQUMzQjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILGtCQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQzFFLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixFQUFFLENBQUMsNERBQTRELEVBQUU7Z0JBQy9ELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO29CQUNwQyxJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3FCQUN0QztpQkFDRixDQUFDLENBQUM7Z0JBQ0gsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtSEFBbUgsRUFBRTtZQUN0SCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUMsRUFBQztpQkFDM0U7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUM5QyxhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrSUFBa0ksRUFBRTtZQUNySSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLEVBQUM7aUJBQzdEO2dCQUNELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUM7aUJBQy9CO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxhQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDMUM7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM3QyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDL0IsSUFBSSxFQUFFLE1BQU07d0JBQ1osS0FBSyxFQUFFLFFBQVE7d0JBQ2YsSUFBSSxFQUFFLElBQUk7cUJBQ1gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0osYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUMxQzthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUvQyxFQUFFLENBQUMsc0NBQXNDLEVBQUU7Z0JBQ3pDLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRTdDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUMvQixJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsUUFBUTt3QkFDZixJQUFJLEVBQUUsSUFBSTtxQkFDWCxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUU7WUFDbEMsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQy9DO2FBQ0YsQ0FBQyxDQUFDO1lBRUwsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRS9DLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFFM0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQy9CLElBQUksRUFBRSxNQUFNO3dCQUNaLEtBQUssRUFBRSxRQUFRO3FCQUNoQixDQUFDLENBQUMsQ0FBQztZQUNOLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztpQkFDMUQ7YUFDRixDQUFDLENBQUM7WUFFTCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLDJCQUEyQixFQUFFO2dCQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7WUFDakMsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFTCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0MsRUFBRSxDQUFDLDJCQUEyQixFQUFFO2dCQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztpQkFDNUQ7YUFDRixDQUFDLENBQUM7WUFFTCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFakQsRUFBRSxDQUFDLDJCQUEyQixFQUFFO2dCQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM3QyxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUM7aUJBQ3pEO2FBQ0YsQ0FBQyxDQUFDO1lBRUwsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTlDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtnQkFDOUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDMUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7aUJBQzdEO2FBQ0YsQ0FBQyxDQUFDO1lBRUwsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRS9DLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtnQkFDOUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFO3dCQUNELEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVU7d0JBQy9CLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxFQUFDO3FCQUNyRDtvQkFDRCxDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVTt3QkFDL0IsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUMsRUFBQztxQkFDbEU7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTVDLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFDcEQsNEJBQWdCLEdBQUcsc0NBQXNDLENBQUMsQ0FBQztnQkFFN0QsYUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM5QyxhQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFDcEQsNEJBQWdCLEdBQUcsbURBQW1ELENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtnQkFDOUIsSUFBTSxLQUFLLEdBQUcsMEJBQW1CLENBQUM7b0JBQ2hDLEtBQUssRUFBRTt3QkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7cUJBQ3hDO29CQUNELElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRjtpQkFDRixDQUFDLENBQUM7Z0JBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ2xELElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLEtBQUssRUFBRSxHQUFHO3FCQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7Z0JBQzdELElBQU0sS0FBSyxHQUFHLDBCQUFtQixDQUFDO29CQUNoQyxLQUFLLEVBQUU7d0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3FCQUN4QztvQkFDRCxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBQzt3QkFDbEIsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzt5QkFDdEM7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2dCQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNsRCxJQUFJLEVBQUUsWUFBWTt3QkFDbEIsS0FBSyxFQUFFLEdBQUc7cUJBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtnQkFDOUQsSUFBTSxLQUFLLEdBQUcsMEJBQW1CLENBQUM7b0JBQ2hDLEtBQUssRUFBRTt3QkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7cUJBQ3hDO29CQUNELElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFOzRCQUNMLENBQUMsRUFBRSxhQUFhO3lCQUNqQjtxQkFDRjtpQkFDRixDQUFDLENBQUM7Z0JBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM5RCxJQUFJLEVBQUUsWUFBWTt3QkFDbEIsS0FBSyxFQUFFLEdBQUc7cUJBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3RvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtwYXJzZVNjYWxlLCBwYXJzZVNjYWxlQ29yZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvcGFyc2UnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7Tk9OX1RZUEVfRE9NQUlOX1JBTkdFX1ZFR0FfU0NBTEVfUFJPUEVSVElFUywgU0NBTEVfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7d2l0aG91dH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZU1vZGVsLCBwYXJzZU1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdzcmMvY29tcGlsZScsIGZ1bmN0aW9uKCkge1xuICBpdCgnTk9OX1RZUEVfUkFOR0VfU0NBTEVfUFJPUEVSVElFUyBzaG91bGQgYmUgU0NBTEVfUFJPUEVSVElFUyB3aWh0b3V0IHR5cGUsIGRvbWFpbiwgYW5kIHJhbmdlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgIHRvU2V0KE5PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMpLFxuICAgICAgdG9TZXQod2l0aG91dChTQ0FMRV9QUk9QRVJUSUVTLCBbJ3R5cGUnLCAnZG9tYWluJywgJ3JhbmdlJywgJ3JhbmdlU3RlcCcsICdzY2hlbWUnXSkpXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGVDb3JlJywgKCkgPT4ge1xuICAgIGl0KCdyZXNwZWN0cyBleHBsaWNpdCBzY2FsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykuZXhwbGljaXQudHlwZSwgJ2xvZycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Jlc3BlY3RzIGV4cGxpY2l0IHNjYWxlIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC50eXBlLCAnbG9nJyk7XG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiB0aGlzIGFjdHVhbGx5IHNob3VsZG4ndCBnZXQgbWVyZ2VkXG4gICAgaXQoJ2Zhdm9ycyB0aGUgZmlyc3QgZXhwbGljaXQgc2NhbGUgdHlwZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcImxvZ1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcInBvd1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpLmV4cGxpY2l0LnR5cGUsICdsb2cnKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UubWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5KCd0eXBlJywgJ3NjYWxlJywgJ2xvZycsICdwb3cnKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ2Zhdm9ycyB0aGUgYmFuZCBvdmVyIHBvaW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwid2VhdGhlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwid2VhdGhlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKS5pbXBsaWNpdC50eXBlLCAnYmFuZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBpZ25vcmVzIHgveSB3aGVuIGxvbi9sYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJjc3ZcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImxvbmdpdHVkZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJsYXRpdHVkZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgaWdub3JlcyBzaGFwZSB3aGVuIGdlb2pzb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9pbmNvbWUuanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibG9va3VwXCI6IFwiaWRcIixcbiAgICAgICAgICAgIFwiZnJvbVwiOiB7XG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcInRvcG9qc29uXCIsXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwia2V5XCI6IFwiaWRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYXNcIjogXCJnZW9cIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImdlb1wiLFwidHlwZVwiOiBcImdlb2pzb25cIn0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdzaGFwZScpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGUnLCAoKSA9PiB7XG4gICAgaXQoJ2RvZXMgbm90IHRocm93IHdhcm5pbmcgd2hlbiB0d28gZXF1aXZhbGVudCBvYmplY3RzIGFyZSBzcGVjaWZpZWQnLCBsb2cud3JhcCgobG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDE3fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogMTd9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykuZXhwbGljaXQucmFuZ2UsIHtzdGVwOiAxN30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvZ2dlci53YXJucy5sZW5ndGgsIDApO1xuICAgIH0pKTtcblxuICAgIGRlc2NyaWJlKCd4IG9yZGluYWwgcG9pbnQnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhbiB4IHBvaW50IHNjYWxlIHdpdGggcmFuZ2VTdGVwIGFuZCBubyByYW5nZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAncG9pbnQnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZS5pbXBsaWNpdC5yYW5nZSwge3N0ZXA6IDIxfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgb3V0cHV0IG9ubHkgcGFkZGluZyB3aXRob3V0IGRlZmF1bHQgcGFkZGluZ0lubmVyIGFuZCBwYWRkaW5nT3V0ZXIgaWYgcGFkZGluZyBpcyBzcGVjaWZpZWQgZm9yIGEgYmFuZCBzY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIiwgc2NhbGU6IHt0eXBlOiAnYmFuZCcsIHBhZGRpbmc6IDAuNn19XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmV4cGxpY2l0LnBhZGRpbmcsIDAuNik7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc2NhbGUuZ2V0KCdwYWRkaW5nSW5uZXInKSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc2NhbGUuZ2V0KCdwYWRkaW5nT3V0ZXInKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG91dHB1dCBkZWZhdWx0IHBhZGRpbmdJbm5lciBhbmQgcGFkZGluZ091dGVyID0gcGFkZGluZ0lubmVyLzIgaWYgbm9uZSBvZiBwYWRkaW5nIHByb3BlcnRpZXMgaXMgc3BlY2lmaWVkIGZvciBhIGJhbmQgc2NhbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNjYWxlOiB7dHlwZTogJ2JhbmQnfX1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgc2NhbGU6IHtiYW5kUGFkZGluZ0lubmVyOiAwLjN9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnBhZGRpbmdJbm5lciwgMC4zKTtcbiAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5wYWRkaW5nT3V0ZXIsIDAuMTUpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHNjYWxlLmdldCgncGFkZGluZycpKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdub21pbmFsIHdpdGggY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgY29ycmVjdCBjb2xvciBzY2FsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnb3JkaW5hbCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH1dKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnJhbmdlLCAnY2F0ZWdvcnknKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29yZGluYWwgd2l0aCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzZXF1ZW50aWFsIGNvbG9yIHNjYWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdvcmRpbmFsJyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZS5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdxdWFudGl0YXRpdmUgd2l0aCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGxpbmVhciBjb2xvciBzY2FsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnc2VxdWVudGlhbCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucmFuZ2UsICdyYW1wJyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZS5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbidcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29sb3Igd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYmluOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdiaW4tb3JkaW5hbCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3JkaW5hbCBjb2xvciB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcIm9yZGluYWxcIiwgYmluOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdvcmRpbmFsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcGFjaXR5IHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYmluOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ29wYWNpdHknKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdvcGFjaXR5Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnYmluLWxpbmVhcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2l6ZSB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBzaXplOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsIGJpbjogdHJ1ZX1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdzaXplJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnc2l6ZScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ2Jpbi1saW5lYXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbG9yIHdpdGggdGltZSB1bml0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcInllYXJcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnc2VxdWVudGlhbCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnc2VsZWN0aW9uIGRvbWFpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwiYXJlYVwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiYnJ1c2hcIiwgZW5jb2Rpbmc6IFwieFwifX0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB5OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJkYXRlXCIsIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiB7c2VsZWN0aW9uOiBcImZvb2JhclwiLCBmaWVsZDogXCJNaWxlc19wZXJfR2FsbG9uXCJ9fSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB4U2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpO1xuICAgICAgY29uc3QgeXNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgYSByYXcgc2VsZWN0aW9uIGRvbWFpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQucHJvcGVydHkoeFNjYWxlLmV4cGxpY2l0LCAnZG9tYWluUmF3Jyk7XG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eVZhbCh4U2NhbGUuZXhwbGljaXQuZG9tYWluUmF3LCAnc2lnbmFsJyxcbiAgICAgICAgICBTRUxFQ1RJT05fRE9NQUlOICsgJ3tcImVuY29kaW5nXCI6XCJ4XCIsXCJzZWxlY3Rpb25cIjpcImJydXNoXCJ9Jyk7XG5cbiAgICAgICAgYXNzZXJ0LnByb3BlcnR5KHlzY2FsZS5leHBsaWNpdCwgJ2RvbWFpblJhdycpO1xuICAgICAgICBhc3NlcnQucHJvcGVydHlWYWwoeXNjYWxlLmV4cGxpY2l0LmRvbWFpblJhdywgJ3NpZ25hbCcsXG4gICAgICAgICAgU0VMRUNUSU9OX0RPTUFJTiArICd7XCJmaWVsZFwiOlwiTWlsZXNfcGVyX0dhbGxvblwiLFwic2VsZWN0aW9uXCI6XCJmb29iYXJcIn0nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VTY2FsZURvbWFpbicsIGZ1bmN0aW9uKCkge1xuICAgIGRlc2NyaWJlKCdmYWNldGVkIGRvbWFpbnMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGNsb25lZCBzdWJ0cmVlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIHJvdzoge2ZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnc2NhbGVfY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdXNlIGNsb25lZCBzdWJ0cmVlIGlmIHRoZSBkYXRhIGlzIG5vdCBmYWNldGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIHJvdzoge2ZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIGRhdGE6IHt1cmw6ICdmb28nfSxcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdXNlIGNsb25lZCBzdWJ0cmVlIGlmIHRoZSBzY2FsZSBpcyBpbmRlcGVuZGVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICByb3c6IHtmaWVsZDogXCJzeW1ib2xcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgICAgIHg6ICdpbmRlcGVuZGVudCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGRyZW5bMF0uY29tcG9uZW50LnNjYWxlcy54LmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ2NoaWxkX21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=