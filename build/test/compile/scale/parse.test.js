/* tslint:disable:quotemark */
import { assert } from 'chai';
import { toSet } from 'vega-util';
import { parseScale, parseScaleCore } from '../../../src/compile/scale/parse';
import { SELECTION_DOMAIN } from '../../../src/compile/selection/selection';
import * as log from '../../../src/log';
import { NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES, SCALE_PROPERTIES } from '../../../src/scale';
import { without } from '../../../src/util';
import { parseModel, parseModelWithScale, parseUnitModelWithScale } from '../../util';
describe('src/compile', function () {
    it('NON_TYPE_RANGE_SCALE_PROPERTIES should be SCALE_PROPERTIES wihtout type, domain, and range properties', function () {
        assert.deepEqual(toSet(NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES), toSet(without(SCALE_PROPERTIES, ['type', 'domain', 'range', 'rangeStep', 'scheme'])));
    });
    describe('parseScaleCore', function () {
        it('respects explicit scale type', function () {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.equal(model.getScaleComponent('y').explicit.type, 'log');
        });
        it('respects explicit scale type', function () {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.equal(model.getScaleComponent('y').explicit.type, 'log');
        });
        // TODO: this actually shouldn't get merged
        it('favors the first explicit scale type', log.wrap(function (localLogger) {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.equal(model.getScaleComponent('y').explicit.type, 'log');
            assert.equal(localLogger.warns[0], log.message.mergeConflictingProperty('type', 'scale', 'log', 'pow'));
        }));
        it('favors the band over point', function () {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.equal(model.getScaleComponent('x').implicit.type, 'band');
        });
        it('correctly ignores x/y when lon/lat', function () {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.isUndefined(model.getScaleComponent('x'));
            assert.isUndefined(model.getScaleComponent('y'));
        });
        it('correctly ignores shape when geojson', function () {
            var model = parseModel({
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
            parseScaleCore(model);
            assert.isUndefined(model.getScaleComponent('shape'));
        });
    });
    describe('parseScale', function () {
        it('does not throw warning when two equivalent objects are specified', log.wrap(function (logger) {
            var model = parseModel({
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
            parseScale(model);
            assert.deepEqual(model.getScaleComponent('y').explicit.range, { step: 17 });
            assert.equal(logger.warns.length, 0);
        }));
        describe('x ordinal point', function () {
            it('should create an x point scale with rangeStep and no range', function () {
                var model = parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: { field: 'origin', type: "nominal" }
                    }
                });
                var scale = model.getScaleComponent('x');
                assert.equal(scale.implicit.type, 'point');
                assert.deepEqual(scale.implicit.range, { step: 21 });
            });
        });
        it('should output only padding without default paddingInner and paddingOuter if padding is specified for a band scale', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { field: 'origin', type: "nominal", scale: { type: 'band', padding: 0.6 } }
                }
            });
            var scale = model.getScaleComponent('x');
            assert.equal(scale.explicit.padding, 0.6);
            assert.isUndefined(scale.get('paddingInner'));
            assert.isUndefined(scale.get('paddingOuter'));
        });
        it('should output default paddingInner and paddingOuter = paddingInner/2 if none of padding properties is specified for a band scale', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: { field: 'origin', type: "nominal", scale: { type: 'band' } }
                },
                config: {
                    scale: { bandPaddingInner: 0.3 }
                }
            });
            var scale = model.getScaleComponent('x');
            assert.equal(scale.implicit.paddingInner, 0.3);
            assert.equal(scale.implicit.paddingOuter, 0.15);
            assert.isUndefined(scale.get('padding'));
        });
        describe('nominal with color', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "nominal" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create correct color scale', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'ordinal');
                assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin',
                        sort: true
                    }]);
                assert.equal(scale.implicit.range, 'category');
            });
        });
        describe('ordinal with color', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "ordinal" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create sequential color scale', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'ordinal');
                assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin',
                        sort: true
                    }]);
            });
        });
        describe('quantitative with color', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should create linear color scale', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'sequential');
                assert.equal(scale.implicit.range, 'ramp');
                assert.deepEqual(scale.domains, [{
                        data: 'main',
                        field: 'origin'
                    }]);
            });
        });
        describe('color with bin', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'bin-ordinal');
            });
        });
        describe('ordinal color with bin', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: "origin", type: "ordinal", bin: true }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'ordinal');
            });
        });
        describe('opacity with bin', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    opacity: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('opacity');
            it('should add correct scales', function () {
                assert.equal(scale.implicit.name, 'opacity');
                assert.equal(scale.implicit.type, 'bin-linear');
            });
        });
        describe('size with bin', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    size: { field: "origin", type: "quantitative", bin: true }
                }
            });
            var scale = model.getScaleComponent('size');
            it('should add correct scales', function () {
                assert.equal(scale.implicit.name, 'size');
                assert.equal(scale.implicit.type, 'bin-linear');
            });
        });
        describe('color with time unit', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    color: { field: 'origin', type: "temporal", timeUnit: "year" }
                }
            });
            var scale = model.getScaleComponent('color');
            it('should add correct scales', function () {
                assert.equal(scale.implicit.name, 'color');
                assert.equal(scale.implicit.type, 'sequential');
            });
        });
        describe('selection domain', function () {
            var model = parseUnitModelWithScale({
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
                assert.property(xScale.explicit, 'domainRaw');
                assert.propertyVal(xScale.explicit.domainRaw, 'signal', SELECTION_DOMAIN + '{"encoding":"x","selection":"brush"}');
                assert.property(yscale.explicit, 'domainRaw');
                assert.propertyVal(yscale.explicit.domainRaw, 'signal', SELECTION_DOMAIN + '{"field":"Miles_per_Gallon","selection":"foobar"}');
            });
        });
    });
    describe('parseScaleDomain', function () {
        describe('faceted domains', function () {
            it('should use cloned subtree', function () {
                var model = parseModelWithScale({
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
                assert.deepEqual(model.component.scales.x.domains, [{
                        data: 'scale_child_main',
                        field: 'a'
                    }]);
            });
            it('should not use cloned subtree if the data is not faceted', function () {
                var model = parseModelWithScale({
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
                assert.deepEqual(model.component.scales.x.domains, [{
                        data: 'child_main',
                        field: 'a'
                    }]);
            });
            it('should not use cloned subtree if the scale is independent', function () {
                var model = parseModelWithScale({
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
                assert.deepEqual(model.children[0].component.scales.x.domains, [{
                        data: 'child_main',
                        field: 'a'
                    }]);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9wYXJzZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDaEMsT0FBTyxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQUMxRSxPQUFPLEtBQUssR0FBRyxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBQywyQ0FBMkMsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2pHLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMxQyxPQUFPLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFFLHVCQUF1QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXBGLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsRUFBRSxDQUFDLHVHQUF1RyxFQUFFO1FBQzFHLE1BQU0sQ0FBQyxTQUFTLENBQ2QsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLEVBQ2xELEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNyRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQztnQkFDdkIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFDO2dCQUMz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SixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFOzRCQUNMLENBQUMsRUFBRSxhQUFhO3lCQUNqQjtxQkFDRjtpQkFDRixDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM5RCxJQUFJLEVBQUUsWUFBWTt3QkFDbEIsS0FBSyxFQUFFLEdBQUc7cUJBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3RvU2V0fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtwYXJzZVNjYWxlLCBwYXJzZVNjYWxlQ29yZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvcGFyc2UnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7Tk9OX1RZUEVfRE9NQUlOX1JBTkdFX1ZFR0FfU0NBTEVfUFJPUEVSVElFUywgU0NBTEVfUFJPUEVSVElFU30gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7d2l0aG91dH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZU1vZGVsLCBwYXJzZU1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdzcmMvY29tcGlsZScsIGZ1bmN0aW9uKCkge1xuICBpdCgnTk9OX1RZUEVfUkFOR0VfU0NBTEVfUFJPUEVSVElFUyBzaG91bGQgYmUgU0NBTEVfUFJPUEVSVElFUyB3aWh0b3V0IHR5cGUsIGRvbWFpbiwgYW5kIHJhbmdlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgIHRvU2V0KE5PTl9UWVBFX0RPTUFJTl9SQU5HRV9WRUdBX1NDQUxFX1BST1BFUlRJRVMpLFxuICAgICAgdG9TZXQod2l0aG91dChTQ0FMRV9QUk9QRVJUSUVTLCBbJ3R5cGUnLCAnZG9tYWluJywgJ3JhbmdlJywgJ3JhbmdlU3RlcCcsICdzY2hlbWUnXSkpXG4gICAgKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGVDb3JlJywgKCkgPT4ge1xuICAgIGl0KCdyZXNwZWN0cyBleHBsaWNpdCBzY2FsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5JykuZXhwbGljaXQudHlwZSwgJ2xvZycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Jlc3BlY3RzIGV4cGxpY2l0IHNjYWxlIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zZWF0dGxlLXdlYXRoZXIuY3N2XCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwibG9nXCJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKS5leHBsaWNpdC50eXBlLCAnbG9nJyk7XG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiB0aGlzIGFjdHVhbGx5IHNob3VsZG4ndCBnZXQgbWVyZ2VkXG4gICAgaXQoJ2Zhdm9ycyB0aGUgZmlyc3QgZXhwbGljaXQgc2NhbGUgdHlwZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcImxvZ1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicHJlY2lwaXRhdGlvblwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1widHlwZVwiOiBcInBvd1wifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpLmV4cGxpY2l0LnR5cGUsICdsb2cnKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UubWVyZ2VDb25mbGljdGluZ1Byb3BlcnR5KCd0eXBlJywgJ3NjYWxlJywgJ2xvZycsICdwb3cnKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ2Zhdm9ycyB0aGUgYmFuZCBvdmVyIHBvaW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwid2VhdGhlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwcmVjaXBpdGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwid2VhdGhlclwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKS5pbXBsaWNpdC50eXBlLCAnYmFuZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBpZ25vcmVzIHgveSB3aGVuIGxvbi9sYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS96aXBjb2Rlcy5jc3ZcIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJjc3ZcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJsb25naXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQobW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3knKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IGlnbm9yZXMgc2hhcGUgd2hlbiBnZW9qc29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvaW5jb21lLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxvb2t1cFwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImZyb21cIjoge1xuICAgICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJ0b3BvanNvblwiLFwiZmVhdHVyZVwiOiBcInN0YXRlc1wifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImtleVwiOiBcImlkXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImFzXCI6IFwiZ2VvXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwic2hhcGVcIjoge1wiZmllbGRcIjogXCJnZW9cIixcInR5cGVcIjogXCJnZW9qc29uXCJ9LFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnc2hhcGUnKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZVNjYWxlJywgKCkgPT4ge1xuICAgIGl0KCdkb2VzIG5vdCB0aHJvdyB3YXJuaW5nIHdoZW4gdHdvIGVxdWl2YWxlbnQgb2JqZWN0cyBhcmUgc3BlY2lmaWVkJywgbG9nLndyYXAoKGxvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc2VhdHRsZS13ZWF0aGVyLmNzdlwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgICAgICBcInNjYWxlXCI6IHtcInJhbmdlU3RlcFwiOiAxN31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICAgICAgICAgIFwic2NhbGVcIjoge1wicmFuZ2VTdGVwXCI6IDE3fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIHBhcnNlU2NhbGUobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneScpLmV4cGxpY2l0LnJhbmdlLCB7c3RlcDogMTd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2dnZXIud2FybnMubGVuZ3RoLCAwKTtcbiAgICB9KSk7XG5cbiAgICBkZXNjcmliZSgneCBvcmRpbmFsIHBvaW50JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYW4geCBwb2ludCBzY2FsZSB3aXRoIHJhbmdlU3RlcCBhbmQgbm8gcmFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgneCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ3BvaW50Jyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGUuaW1wbGljaXQucmFuZ2UsIHtzdGVwOiAyMX0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG91dHB1dCBvbmx5IHBhZGRpbmcgd2l0aG91dCBkZWZhdWx0IHBhZGRpbmdJbm5lciBhbmQgcGFkZGluZ091dGVyIGlmIHBhZGRpbmcgaXMgc3BlY2lmaWVkIGZvciBhIGJhbmQgc2NhbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNjYWxlOiB7dHlwZTogJ2JhbmQnLCBwYWRkaW5nOiAwLjZ9fVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5leHBsaWNpdC5wYWRkaW5nLCAwLjYpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHNjYWxlLmdldCgncGFkZGluZ0lubmVyJykpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHNjYWxlLmdldCgncGFkZGluZ091dGVyJykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvdXRwdXQgZGVmYXVsdCBwYWRkaW5nSW5uZXIgYW5kIHBhZGRpbmdPdXRlciA9IHBhZGRpbmdJbm5lci8yIGlmIG5vbmUgb2YgcGFkZGluZyBwcm9wZXJ0aWVzIGlzIHNwZWNpZmllZCBmb3IgYSBiYW5kIHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwiLCBzY2FsZToge3R5cGU6ICdiYW5kJ319XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHNjYWxlOiB7YmFuZFBhZGRpbmdJbm5lcjogMC4zfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5wYWRkaW5nSW5uZXIsIDAuMyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQucGFkZGluZ091dGVyLCAwLjE1KTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzY2FsZS5nZXQoJ3BhZGRpbmcnKSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbm9taW5hbCB3aXRoIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ2NvbG9yJyk7XG5cbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGNvcnJlY3QgY29sb3Igc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ29yZGluYWwnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZS5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9XSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5yYW5nZSwgJ2NhdGVnb3J5Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdvcmRpbmFsIHdpdGggY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgc2VxdWVudGlhbCBjb2xvciBzY2FsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnb3JkaW5hbCcpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGUuZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgncXVhbnRpdGF0aXZlIHdpdGggY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBsaW5lYXIgY29sb3Igc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ3NlcXVlbnRpYWwnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnJhbmdlLCAncmFtcCcpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGUuZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2NvbG9yIHdpdGggYmluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsIGJpbjogdHJ1ZX1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnYmluLW9yZGluYWwnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ29yZGluYWwgY29sb3Igd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogXCJvcmlnaW5cIiwgdHlwZTogXCJvcmRpbmFsXCIsIGJpbjogdHJ1ZX1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdjb2xvcicpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC50eXBlLCAnb3JkaW5hbCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnb3BhY2l0eSB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7ZmllbGQ6IFwib3JpZ2luXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsIGJpbjogdHJ1ZX1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCdvcGFjaXR5Jyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3Qgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzY2FsZS5pbXBsaWNpdC5uYW1lLCAnb3BhY2l0eScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ2Jpbi1saW5lYXInKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NpemUgd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgc2l6ZToge2ZpZWxkOiBcIm9yaWdpblwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBiaW46IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnc2l6ZScpO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQubmFtZSwgJ3NpemUnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0LnR5cGUsICdiaW4tbGluZWFyJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdjb2xvciB3aXRoIHRpbWUgdW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJ0ZW1wb3JhbFwiLCB0aW1lVW5pdDogXCJ5ZWFyXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudCgnY29sb3InKTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgY29ycmVjdCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlLmltcGxpY2l0Lm5hbWUsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc2NhbGUuaW1wbGljaXQudHlwZSwgJ3NlcXVlbnRpYWwnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3NlbGVjdGlvbiBkb21haW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcImFyZWFcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJkYXRlXCIsIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiB7c2VsZWN0aW9uOiBcImJydXNoXCIsIGVuY29kaW5nOiBcInhcIn19LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgeToge1xuICAgICAgICAgICAgZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJmb29iYXJcIiwgZmllbGQ6IFwiTWlsZXNfcGVyX0dhbGxvblwifX0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgeFNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoJ3gnKTtcbiAgICAgIGNvbnN0IHlzY2FsZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KCd5Jyk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIGEgcmF3IHNlbGVjdGlvbiBkb21haW4nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LnByb3BlcnR5KHhTY2FsZS5leHBsaWNpdCwgJ2RvbWFpblJhdycpO1xuICAgICAgICBhc3NlcnQucHJvcGVydHlWYWwoeFNjYWxlLmV4cGxpY2l0LmRvbWFpblJhdywgJ3NpZ25hbCcsXG4gICAgICAgICAgU0VMRUNUSU9OX0RPTUFJTiArICd7XCJlbmNvZGluZ1wiOlwieFwiLFwic2VsZWN0aW9uXCI6XCJicnVzaFwifScpO1xuXG4gICAgICAgIGFzc2VydC5wcm9wZXJ0eSh5c2NhbGUuZXhwbGljaXQsICdkb21haW5SYXcnKTtcbiAgICAgICAgYXNzZXJ0LnByb3BlcnR5VmFsKHlzY2FsZS5leHBsaWNpdC5kb21haW5SYXcsICdzaWduYWwnLFxuICAgICAgICAgIFNFTEVDVElPTl9ET01BSU4gKyAne1wiZmllbGRcIjpcIk1pbGVzX3Blcl9HYWxsb25cIixcInNlbGVjdGlvblwiOlwiZm9vYmFyXCJ9Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGVEb21haW4nLCBmdW5jdGlvbigpIHtcbiAgICBkZXNjcmliZSgnZmFjZXRlZCBkb21haW5zJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBjbG9uZWQgc3VidHJlZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICByb3c6IHtmaWVsZDogXCJzeW1ib2xcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7dXJsOiBcImZvby5jc3ZcIn0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5zY2FsZXMueC5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdzY2FsZV9jaGlsZF9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB1c2UgY2xvbmVkIHN1YnRyZWUgaWYgdGhlIGRhdGEgaXMgbm90IGZhY2V0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6IFwic3ltYm9sXCIsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge3VybDogXCJmb28uY3N2XCJ9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIGRhdGE6IHt1cmw6ICdmb28nfSxcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzLnguZG9tYWlucywgW3tcbiAgICAgICAgICBkYXRhOiAnY2hpbGRfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdXNlIGNsb25lZCBzdWJ0cmVlIGlmIHRoZSBzY2FsZSBpcyBpbmRlcGVuZGVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICByb3c6IHtmaWVsZDogXCJzeW1ib2xcIiwgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7dXJsOiBcImZvby5jc3ZcIn0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgICB4OiAnaW5kZXBlbmRlbnQnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNoaWxkcmVuWzBdLmNvbXBvbmVudC5zY2FsZXMueC5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdjaGlsZF9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19