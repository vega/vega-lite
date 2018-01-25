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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QiwwREFBNEU7QUFDNUUsc0VBQTBFO0FBQzFFLHNDQUF3QztBQUN4Qyw0Q0FBaUc7QUFDakcsMENBQWlEO0FBQ2pELG1DQUFvRjtBQUVwRixRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLEVBQUUsQ0FBQyx1R0FBdUcsRUFBRTtRQUMxRyxhQUFNLENBQUMsU0FBUyxDQUNkLFlBQUssQ0FBQyxtREFBMkMsQ0FBQyxFQUNsRCxZQUFLLENBQUMsY0FBTyxDQUFDLHdCQUFnQixFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDckYsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO2dCQUN2QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUM7Z0JBQzNDLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsS0FBSzt3QkFDYixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxNQUFNO2dDQUNuQixPQUFPLEVBQUUsZUFBZTtnQ0FDeEIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxNQUFNO3dCQUNkLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLE1BQU07Z0NBQ25CLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixNQUFNLEVBQUUsY0FBYztnQ0FDdEIsT0FB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Q0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7cGFyc2VTY2FsZSwgcGFyc2VTY2FsZUNvcmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7U0VMRUNUSU9OX0RPTUFJTn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge05PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMsIFNDQUxFX1BST1BFUlRJRVN9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3RvU2V0LCB3aXRob3V0fSBmcm9tICcuLi8uLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge3BhcnNlTW9kZWwsIHBhcnNlTW9kZWxXaXRoU2NhbGUsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ3NyYy9jb21waWxlJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdOT05fVFlQRV9SQU5HRV9TQ0FMRV9QUk9QRVJUSUVTIHNob3VsZCBiZSBTQ0FMRV9QUk9QRVJUSUVTIHdpaHRvdXQgdHlwZSwgZG9tYWluLCBhbmQgcmFuZ2UgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgdG9TZXQoTk9OX1RZUEVfRE9NQUlOX1JBTkdFX1ZFR0FfU0NBTEVfUFJPUEVSVElFUyksXG4gICAgICB0b1NldCh3aXRob3V0KFNDQUxFX1BST1BFUlRJRVMsIFsndHlwZScsICdkb21haW4nLCAncmFuZ2UnLCAncmFuZ2VTdGVwJywgJ3NjaGVtZSddKSlcbiAgICApO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VTY2FsZUNvcmUnLCAoKSA9PiB7XG4gICAgaXQoJ3Jlc3BlY3RzIGV4cGxpY2l0IHNjYWxlIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJsb2dcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC50eXBlLCAnbG9nJyk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVzcGVjdHMgZXhwbGljaXQgc2NhbGUgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJsb2dcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpLmV4cGxpY2l0LnR5cGUsICdsb2cnKTtcbiAgICB9KTtcblxuICAgIC8vIFRPRE86IHRoaXMgYWN0dWFsbHkgc2hvdWxkbid0IGdldCBtZXJnZWRcbiAgICBpdCgnZmF2b3JzIHRoZSBmaXJzdCBleHBsaWNpdCBzY2FsZSB0eXBlJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwicG93XCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykuZXhwbGljaXQudHlwZSwgJ2xvZycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5tZXJnZUNvbmZsaWN0aW5nUHJvcGVydHkoJ3R5cGUnLCAnc2NhbGUnLCAnbG9nJywgJ3BvdycpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnZmF2b3JzIHRoZSBiYW5kIG92ZXIgcG9pbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ3ZWF0aGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInByZWNpcGl0YXRpb25cIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ3ZWF0aGVyXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpLmltcGxpY2l0LnR5cGUsICdiYW5kJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IGlnbm9yZXMgeC95IHdoZW4gbG9uL2xhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3ppcGNvZGVzLmNzdlwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibG9uZ2l0dWRlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwibGF0aXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4JykpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBpZ25vcmVzIHNoYXBlIHdoZW4gZ2VvanNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2luY29tZS5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsb29rdXBcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwidG9wb2pzb25cIixcImZlYXR1cmVcIjogXCJzdGF0ZXNcIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJrZXlcIjogXCJpZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJhc1wiOiBcImdlb1wiXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiZ2VvXCIsXCJ0eXBlXCI6IFwiZ2VvanNvblwifSxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3NoYXBlJykpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VTY2FsZScsICgpID0+IHtcbiAgICBpdCgnZG9lcyBub3QgdGhyb3cgd2FybmluZyB3aGVuIHR3byBlcXVpdmFsZW50IG9iamVjdHMgYXJlIHNwZWNpZmllZCcsIGxvZy53cmFwKChsb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3NlYXR0bGUtd2VhdGhlci5jc3ZcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJyYW5nZVN0ZXBcIjogMTd9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiAxN31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC5yYW5nZSwge3N0ZXA6IDE3fSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9nZ2VyLndhcm5zLmxlbmd0aCwgMCk7XG4gICAgfSkpO1xuXG4gICAgZGVzY3JpYmUoJ3ggb3JkaW5hbCBwb2ludCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGFuIHggcG9pbnQgc2NhbGUgd2l0aCByYW5nZVN0ZXAgYW5kIG5vIHJhbmdlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdwb2ludCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmltcGxpY2l0LnJhbmdlLCB7c3RlcDogMjF9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvdXRwdXQgb25seSBwYWRkaW5nIHdpdGhvdXQgZGVmYXVsdCBwYWRkaW5nSW5uZXIgYW5kIHBhZGRpbmdPdXRlciBpZiBwYWRkaW5nIGlzIHNwZWNpZmllZCBmb3IgYSBiYW5kIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwiLCBzY2FsZToge3R5cGU6ICdiYW5kJywgcGFkZGluZzogMC42fX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuZXhwbGljaXQucGFkZGluZywgMC42KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzY2FsZS5nZXQoJ3BhZGRpbmdJbm5lcicpKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzY2FsZS5nZXQoJ3BhZGRpbmdPdXRlcicpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgb3V0cHV0IGRlZmF1bHQgcGFkZGluZ0lubmVyIGFuZCBwYWRkaW5nT3V0ZXIgPSBwYWRkaW5nSW5uZXIvMiBpZiBub25lIG9mIHBhZGRpbmcgcHJvcGVydGllcyBpcyBzcGVjaWZpZWQgZm9yIGEgYmFuZCBzY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIiwgc2NhbGU6IHt0eXBlOiAnYmFuZCd9fVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBzY2FsZToge2JhbmRQYWRkaW5nSW5uZXI6IDAuM31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucGFkZGluZ0lubmVyLCAwLjMpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnBhZGRpbmdPdXRlciwgMC4xNSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc2NhbGUuZ2V0KCdwYWRkaW5nJykpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ25vbWluYWwgd2l0aCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBjb3JyZWN0IGNvbG9yIHNjYWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdvcmRpbmFsJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGUuZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucmFuZ2UsICdjYXRlZ29yeScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3JkaW5hbCB3aXRoIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHNlcXVlbnRpYWwgY29sb3Igc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ29yZGluYWwnKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3F1YW50aXRhdGl2ZSB3aXRoIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgbGluZWFyIGNvbG9yIHNjYWxlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdzZXF1ZW50aWFsJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5yYW5nZSwgJ3JhbXAnKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb2xvciB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ2Jpbi1vcmRpbmFsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcmRpbmFsIGNvbG9yIHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwib3JkaW5hbFwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ29yZGluYWwnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29wYWNpdHkgd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgb3BhY2l0eToge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnb3BhY2l0eScpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ29wYWNpdHknKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdiaW4tbGluZWFyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzaXplIHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHNpemU6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYmluOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3NpemUnKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdzaXplJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnYmluLWxpbmVhcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnY29sb3Igd2l0aCB0aW1lIHVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwidGVtcG9yYWxcIiwgdGltZVVuaXQ6IFwieWVhclwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdzZXF1ZW50aWFsJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzZWxlY3Rpb24gZG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJhcmVhXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaFwiLCBlbmNvZGluZzogXCJ4XCJ9fSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiZm9vYmFyXCIsIGZpZWxkOiBcIk1pbGVzX3Blcl9HYWxsb25cIn19LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhTY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd4Jyk7XG4gICAgICBjb25zdCB5c2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBhIHJhdyBzZWxlY3Rpb24gZG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eSh4U2NhbGUuZXhwbGljaXQsICdkb21haW5SYXcnKTtcbiAgICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKHhTY2FsZS5leHBsaWNpdC5kb21haW5SYXcsICdzaWduYWwnLFxuICAgICAgICAgIFNFTEVDVElPTl9ET01BSU4gKyAne1wiZW5jb2RpbmdcIjpcInhcIixcInNlbGVjdGlvblwiOlwiYnJ1c2hcIn0nKTtcblxuICAgICAgICBhc3NlcnQucHJvcGVydHkoeXNjYWxlLmV4cGxpY2l0LCAnZG9tYWluUmF3Jyk7XG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eVZhbCh5c2NhbGUuZXhwbGljaXQuZG9tYWluUmF3LCAnc2lnbmFsJyxcbiAgICAgICAgICBTRUxFQ1RJT05fRE9NQUlOICsgJ3tcImZpZWxkXCI6XCJNaWxlc19wZXJfR2FsbG9uXCIsXCJzZWxlY3Rpb25cIjpcImZvb2JhclwifScpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZVNjYWxlRG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgZGVzY3JpYmUoJ2ZhY2V0ZWQgZG9tYWlucycsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgY2xvbmVkIHN1YnRyZWUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5zY2FsZXMueC5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdzY2FsZV9jaGlsZF9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB1c2UgY2xvbmVkIHN1YnRyZWUgaWYgdGhlIGRhdGEgaXMgbm90IGZhY2V0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgZGF0YToge3VybDogJ2Zvbyd9LFxuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5zY2FsZXMueC5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdjaGlsZF9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB1c2UgY2xvbmVkIHN1YnRyZWUgaWYgdGhlIHNjYWxlIGlzIGluZGVwZW5kZW50JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIHJvdzoge2ZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgICAgeDogJ2luZGVwZW5kZW50J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jaGlsZHJlblswXS5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==