"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var vega_util_1 = require("vega-util");
var parse_1 = require("../../../src/compile/scale/parse");
var selection_1 = require("../../../src/compile/selection/selection");
var log = tslib_1.__importStar(require("../../../src/log"));
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
                    data: { url: "foo.csv" },
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
                    data: { url: "foo.csv" },
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
                    data: { url: "foo.csv" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsdUNBQWdDO0FBQ2hDLDBEQUE0RTtBQUM1RSxzRUFBMEU7QUFDMUUsNERBQXdDO0FBQ3hDLDRDQUFpRztBQUNqRywwQ0FBMEM7QUFDMUMsbUNBQW9GO0FBRXBGLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsRUFBRSxDQUFDLHVHQUF1RyxFQUFFO1FBQzFHLGFBQU0sQ0FBQyxTQUFTLENBQ2QsaUJBQUssQ0FBQyxtREFBMkMsQ0FBQyxFQUNsRCxpQkFBSyxDQUFDLGNBQU8sQ0FBQyx3QkFBZ0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQ3JGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsSUFBTSxLQUFLLEdBQUcsaUJBQVUsQ0FBQztnQkFDdkIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFDO2dCQUMzQyxPQUFPLEVBQUU7b0JBQ1A7d0JBQ0UsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsVUFBVSxFQUFFOzRCQUNWLEdBQUcsRUFBRTtnQ0FDSCxXQUFXLEVBQUUsTUFBTTtnQ0FDbkIsT0FBTyxFQUFFLGVBQWU7Z0NBQ3hCLE1BQU0sRUFBRSxjQUFjOzZCQUN2Qjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxNQUFNLEVBQUUsTUFBTTt3QkFDZCxVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFF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TUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDOUQsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLEtBQUssRUFBRSxHQUFHO3FCQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHt0b1NldH0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7cGFyc2VTY2FsZSwgcGFyc2VTY2FsZUNvcmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7U0VMRUNUSU9OX0RPTUFJTn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge05PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMsIFNDQUxFX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3dpdGhvdXR9IGZyb20gJy4uLy4uLy4uL3NyYy91dGlsJztcbmltcG9ydCB7cGFyc2VNb2RlbCwgcGFyc2VNb2RlbFdpdGhTY2FsZSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnc3JjL2NvbXBpbGUnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ05PTl9UWVBFX1JBTkdFX1NDQUxFX1BST1BFUlRJRVMgc2hvdWxkIGJlIFNDQUxFX1BST1BFUlRJRVMgd2lodG91dCB0eXBlLCBkb21haW4sIGFuZCByYW5nZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICB0b1NldChOT05fVFlQRV9ET01BSU5fUkFOR0VfVkVHQV9TQ0FMRV9QUk9QRVJUSUVTKSxcbiAgICAgIHRvU2V0KHdpdGhvdXQoU0NBTEVfUFJPUEVSVElFUywgWyd0eXBlJywgJ2RvbWFpbicsICdyYW5nZScsICdyYW5nZVN0ZXAnLCAnc2NoZW1lJ10pKVxuICAgICk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZVNjYWxlQ29yZScsICgpID0+IHtcbiAgICBpdCgncmVzcGVjdHMgZXhwbGljaXQgc2NhbGUgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcImxvZ1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpLmV4cGxpY2l0LnR5cGUsICdsb2cnKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXNwZWN0cyBleHBsaWNpdCBzY2FsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcImxvZ1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykuZXhwbGljaXQudHlwZSwgJ2xvZycpO1xuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogdGhpcyBhY3R1YWxseSBzaG91bGRuJ3QgZ2V0IG1lcmdlZFxuICAgIGl0KCdmYXZvcnMgdGhlIGZpcnN0IGV4cGxpY2l0IHNjYWxlIHR5cGUnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJsb2dcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJwb3dcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC50eXBlLCAnbG9nJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm1lcmdlQ29uZmxpY3RpbmdQcm9wZXJ0eSgndHlwZScsICdzY2FsZScsICdsb2cnLCAncG93JykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdmYXZvcnMgdGhlIGJhbmQgb3ZlciBwb2ludCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIndlYXRoZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIndlYXRoZXJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4JykuaW1wbGljaXQudHlwZSwgJ2JhbmQnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgaWdub3JlcyB4L3kgd2hlbiBsb24vbGF0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvemlwY29kZXMuY3N2XCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiY3N2XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImxhdGl0dWRlXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4JykpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBpZ25vcmVzIHNoYXBlIHdoZW4gZ2VvanNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2luY29tZS5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsb29rdXBcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwidG9wb2pzb25cIixcImZlYXR1cmVcIjogXCJzdGF0ZXNcIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJrZXlcIjogXCJpZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJhc1wiOiBcImdlb1wiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiZ2VvXCIsXCJ0eXBlXCI6IFwiZ2VvanNvblwifSxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3NoYXBlJykpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VTY2FsZScsICgpID0+IHtcbiAgICBpdCgnZG9lcyBub3QgdGhyb3cgd2FybmluZyB3aGVuIHR3byBlcXVpdmFsZW50IG9iamVjdHMgYXJlIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogMTd9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiAxN31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC5yYW5nZSwge3N0ZXA6IDE3fSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zLmxlbmd0aCwgMCk7XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ3ggb3JkaW5hbCBwb2ludCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGFuIHggcG9pbnQgc2NhbGUgd2l0aCByYW5nZVN0ZXAgYW5kIG5vIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdwb2ludCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmltcGxpY2l0LnJhbmdlLCB7c3RlcDogMjF9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvdXRwdXQgb25seSBwYWRkaW5nIHdpdGhvdXQgZGVmYXVsdCBwYWRkaW5nSW5uZXIgYW5kIHBhZGRpbmdPdXRlciBpZiBwYWRkaW5nIGlzIHNwZWNpZmllZCBmb3IgYSBiYW5kIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwiLCBzY2FsZToge3R5cGU6ICdiYW5kJywgcGFkZGluZzogMC42fX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuZXhwbGljaXQucGFkZGluZywgMC42KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzY2FsZS5nZXQoJ3BhZGRpbmdJbm5lcicpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzY2FsZS5nZXQoJ3BhZGRpbmdPdXRlcicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgb3V0cHV0IGRlZmF1bHQgcGFkZGluZ0lubmVyIGFuZCBwYWRkaW5nT3V0ZXIgPSBwYWRkaW5nSW5uZXIvMiBpZiBub25lIG9mIHBhZGRpbmcgcHJvcGVydGllcyBpcyBzcGVjaWZpZWQgZm9yIGEgYmFuZCBzY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIiwgc2NhbGU6IHt0eXBlOiAnYmFuZCd9fVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBzY2FsZToge2JhbmRQYWRkaW5nSW5uZXI6IDAuM31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucGFkZGluZ0lubmVyLCAwLjMpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnBhZGRpbmdPdXRlciwgMC4xNSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc2NhbGUuZ2V0KCdwYWRkaW5nJykpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ25vbWluYWwgd2l0aCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBjb3JyZWN0IGNvbG9yIHNjYWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdvcmRpbmFsJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGUuZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucmFuZ2UsICdjYXRlZ29yeScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3JkaW5hbCB3aXRoIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHNlcXVlbnRpYWwgY29sb3Igc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ29yZGluYWwnKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3F1YW50aXRhdGl2ZSB3aXRoIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgbGluZWFyIGNvbG9yIHNjYWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdzZXF1ZW50aWFsJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5yYW5nZSwgJ3JhbXAnKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb2xvciB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ2Jpbi1vcmRpbmFsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcmRpbmFsIGNvbG9yIHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwib3JkaW5hbFwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ29yZGluYWwnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29wYWNpdHkgd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgb3BhY2l0eToge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnb3BhY2l0eScpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ29wYWNpdHknKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdiaW4tbGluZWFyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzaXplIHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHNpemU6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYmluOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3NpemUnKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdzaXplJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnYmluLWxpbmVhcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29sb3Igd2l0aCB0aW1lIHVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwidGVtcG9yYWxcIiwgdGltZVVuaXQ6IFwieWVhclwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdzZXF1ZW50aWFsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZWxlY3Rpb24gZG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJhcmVhXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaFwiLCBlbmNvZGluZzogXCJ4XCJ9fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiZm9vYmFyXCIsIGZpZWxkOiBcIk1pbGVzX3Blcl9HYWxsb25cIn19LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBjb25zdCB5c2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBhIHJhdyBzZWxlY3Rpb24gZG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eSh4U2NhbGUuZXhwbGljaXQsICdkb21haW5SYXcnKTtcbiAgICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKHhTY2FsZS5leHBsaWNpdC5kb21haW5SYXcsICdzaWduYWwnLFxuICAgICAgICAgIFNFTEVDVElPTl9ET01BSU4gKyAne1wiZW5jb2RpbmdcIjpcInhcIixcInNlbGVjdGlvblwiOlwiYnJ1c2hcIn0nKTtcblxuICAgICAgICBhc3NlcnQucHJvcGVydHkoeXNjYWxlLmV4cGxpY2l0LCAnZG9tYWluUmF3Jyk7XG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eVZhbCh5c2NhbGUuZXhwbGljaXQuZG9tYWluUmF3LCAnc2lnbmFsJyxcbiAgICAgICAgICBTRUxFQ1RJT05fRE9NQUlOICsgJ3tcImZpZWxkXCI6XCJNaWxlc19wZXJfR2FsbG9uXCIsXCJzZWxlY3Rpb25cIjpcImZvb2JhclwifScpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZVNjYWxlRG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgZGVzY3JpYmUoJ2ZhY2V0ZWQgZG9tYWlucycsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgY2xvbmVkIHN1YnRyZWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge3VybDogXCJmb28uY3N2XCJ9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnc2NhbGVfY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdXNlIGNsb25lZCBzdWJ0cmVlIGlmIHRoZSBkYXRhIGlzIG5vdCBmYWNldGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIHJvdzoge2ZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHt1cmw6IFwiZm9vLmNzdlwifSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBkYXRhOiB7dXJsOiAnZm9vJ30sXG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LnNjYWxlcy54LmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ2NoaWxkX21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHVzZSBjbG9uZWQgc3VidHJlZSBpZiB0aGUgc2NhbGUgaXMgaW5kZXBlbmRlbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge3VybDogXCJmb28uY3N2XCJ9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgICAgeDogJ2luZGVwZW5kZW50J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jaGlsZHJlblswXS5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==