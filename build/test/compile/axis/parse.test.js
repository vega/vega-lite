"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var parse_1 = require("../../../src/compile/axis/parse");
var util_1 = require("../../util");
describe('Axis', function () {
    // TODO: move this to model.test.ts
    describe('= true', function () {
        it('should produce default properties for axis', function () {
            var model1 = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
                },
                "data": { "url": "data/movies.json" }
            });
            var model2 = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
                },
                "data": { "url": "data/movies.json" }
            });
            chai_1.assert.deepEqual(model1.axis(channel_1.Y), model2.axis(channel_1.Y));
        });
    });
    describe('parseUnitAxis', function () {
        it('should produce Vega grid', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: true, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.grid, true);
        });
        it('should produce Vega grid when axis config is specified.', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                "config": { "axisX": { "grid": true } }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].implicit.grid, true);
        });
        it('should produce axis component with grid=false', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: false, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.grid, false);
        });
        it('should ignore null scales', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    longitude: {
                        field: "a",
                        type: "quantitative"
                    },
                    latitude: {
                        field: "b",
                        type: "quantitative"
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.isUndefined(axisComponent['x']);
            chai_1.assert.isUndefined(axisComponent['y']);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axisX', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                config: { axisX: { grid: false } }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axis', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                config: { axis: { grid: false } }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should store the title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = util_1.parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: {
                            field: "a",
                            type: "quantitative",
                            axis: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var axisComponent = parse_1.parseUnitAxis(model);
                chai_1.assert.equal(axisComponent['x'].length, 1);
                chai_1.assert.equal(axisComponent['x'][0].explicit.title, val);
            }
        });
        it('should store the fieldDef title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = util_1.parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: {
                            field: "a",
                            type: "quantitative",
                            title: val // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var axisComponent = parse_1.parseUnitAxis(model);
                chai_1.assert.equal(axisComponent['x'].length, 1);
                chai_1.assert.equal(axisComponent['x'][0].explicit.title, val);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        title: 'foo'
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.title, 'foo');
        });
        it('should merge title of fieldDef and fieldDef2', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "bar",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        title: 'foo'
                    },
                    x2: {
                        field: "b",
                        type: "quantitative",
                        title: 'bar'
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.title, 'foo, bar');
        });
        it('should use title of fieldDef2', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "bar",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    },
                    x2: {
                        field: "b",
                        type: "quantitative",
                        title: 'bar'
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.equal(axisComponent['x'][0].explicit.title, 'bar');
        });
        it('should store both x and x2 for ranged mark', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "rule",
                encoding: {
                    x: { field: "a", type: "quantitative" },
                    x2: { field: "a2", type: "quantitative" }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.equal(axisComponent['x'].length, 1);
            chai_1.assert.deepEqual(axisComponent['x'][0].get('title'), [{ field: "a" }, { field: "a2" }]);
        });
    });
    describe('parseLayerAxis', function () {
        var globalRuleOverlay = util_1.parseLayerModel({
            "layer": [
                {
                    "mark": "rule",
                    "encoding": {
                        "y": {
                            "aggregate": "mean",
                            "field": "a",
                            "type": "quantitative"
                        }
                    }
                },
                {
                    "mark": "line",
                    "encoding": {
                        "y": {
                            "aggregate": "mean",
                            "field": "a",
                            "type": "quantitative"
                        },
                        "x": {
                            "timeUnit": "month",
                            "type": "temporal",
                            "field": "date"
                        }
                    }
                }
            ]
        });
        globalRuleOverlay.parseScale();
        globalRuleOverlay.parseLayoutSize();
        parse_1.parseLayerAxis(globalRuleOverlay);
        it('correctly merges gridScale if one layer does not have one of the axis', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            chai_1.assert.equal(axisComponents.y.length, 1);
            chai_1.assert.equal(axisComponents.y[0].get('gridScale'), 'x');
        });
        it('correctly merges similar title', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            chai_1.assert.deepEqual(axisComponents.y[0].get('title'), [{ aggregate: 'mean', field: 'a' }]);
        });
        it('correctly combines different title', function () {
            var model = util_1.parseLayerModel({
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": { "url": "data/cars.json" },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "Cylinders", "type": "ordinal" },
                            "y": {
                                "aggregate": "max",
                                "field": "Horsepower",
                                "type": "quantitative"
                            },
                            "color": { "value": "darkred" }
                        }
                    },
                    {
                        "data": { "url": "data/cars.json" },
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "Cylinders", "type": "ordinal" },
                            "y": {
                                "aggregate": "min",
                                "field": "Horsepower",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            model.parseScale();
            parse_1.parseLayerAxis(model);
            var axisComponents = model.component.axes;
            chai_1.assert.deepEqual(axisComponents.y[0].get('title'), [{ aggregate: 'max', field: 'Horsepower' }, { aggregate: 'min', field: 'Horsepower' }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUF1QztBQUN2Qyx5REFBOEU7QUFDOUUsbUNBQW9FO0FBRXBFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixtQ0FBbUM7SUFDbkMsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxNQUFNLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3JDLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztpQkFDdkU7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDhCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtZQUM3QixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYzt3QkFDcEIsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUM7cUJBQ3JEO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxhQUFhLEdBQUcscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5REFBeUQsRUFBRTtZQUM1RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYztxQkFDckI7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxFQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7WUFDbEQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7d0JBQ3BCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFDO3FCQUN0RDtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixTQUFTLEVBQUU7d0JBQ1QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7cUJBQ3JCO29CQUNELFFBQVEsRUFBRTt3QkFDUixLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYztxQkFDckI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLGFBQWEsR0FBRyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkMsYUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxRkFBcUYsRUFBRTtZQUN4RixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYztxQkFDckI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxFQUFDO2FBQy9CLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFHSCxFQUFFLENBQUMsb0ZBQW9GLEVBQUU7WUFDdkYsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7cUJBQ3JCO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBQzthQUM5QixDQUFDLENBQUM7WUFDSCxJQUFNLGFBQWEsR0FBRyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQy9ELEtBQWtCLFVBQWlCLEVBQWpCLE1BQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBakIsY0FBaUIsRUFBakIsSUFBaUIsRUFBRTtnQkFBaEMsSUFBTSxHQUFHLFNBQUE7Z0JBQ1osSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7b0JBQ3BDLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRTt3QkFDUixDQUFDLEVBQUU7NEJBQ0QsS0FBSyxFQUFFLEdBQUc7NEJBQ1YsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFVLEVBQUMsQ0FBQywwRUFBMEU7eUJBQ3JHO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLGFBQWEsR0FBRyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBVSxDQUFDLENBQUM7YUFDaEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxRUFBcUUsRUFBRTtZQUN4RSxLQUFrQixVQUFpQixFQUFqQixNQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCLEVBQUU7Z0JBQWhDLElBQU0sR0FBRyxTQUFBO2dCQUNaLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO29CQUNwQyxJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFOzRCQUNELEtBQUssRUFBRSxHQUFHOzRCQUNWLElBQUksRUFBRSxjQUFjOzRCQUNwQixLQUFLLEVBQUUsR0FBVSxDQUFDLDBFQUEwRTt5QkFDN0Y7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFVLENBQUMsQ0FBQzthQUNoRTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFO3dCQUNELEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxjQUFjO3dCQUNwQixLQUFLLEVBQUUsS0FBSztxQkFDYjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7d0JBQ3BCLEtBQUssRUFBRSxLQUFLO3FCQUNiO29CQUNELEVBQUUsRUFBRTt3QkFDRixLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYzt3QkFDcEIsS0FBSyxFQUFFLEtBQUs7cUJBQ2I7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLGFBQWEsR0FBRyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQ2xDLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFO3dCQUNELEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxjQUFjO3FCQUNyQjtvQkFDRCxFQUFFLEVBQUU7d0JBQ0YsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7d0JBQ3BCLEtBQUssRUFBRSxLQUFLO3FCQUNiO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxhQUFhLEdBQUcscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN4QzthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLElBQU0saUJBQWlCLEdBQUcsc0JBQWUsQ0FBQztZQUN4QyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsTUFBTTs0QkFDbkIsT0FBTyxFQUFFLEdBQUc7NEJBQ1osTUFBTSxFQUFFLGNBQWM7eUJBQ3ZCO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLE1BQU07NEJBQ25CLE9BQU8sRUFBRSxHQUFHOzRCQUNaLE1BQU0sRUFBRSxjQUFjO3lCQUN2Qjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsVUFBVSxFQUFFLE9BQU87NEJBQ25CLE1BQU0sRUFBRSxVQUFVOzRCQUNsQixPQUFPLEVBQUUsTUFBTTt5QkFDaEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUNILGlCQUFpQixDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQy9CLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3BDLHNCQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUdsQyxFQUFFLENBQUMsdUVBQXVFLEVBQUU7WUFDMUUsSUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUN4RCxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLGFBQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsU0FBUyxFQUFFLGlEQUFpRDtnQkFDNUQsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFDO2dCQUNqQyxPQUFPLEVBQUU7b0JBQ1A7d0JBQ0UsTUFBTSxFQUFFLE1BQU07d0JBQ2QsVUFBVSxFQUFFOzRCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzs0QkFDN0MsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxLQUFLO2dDQUNsQixPQUFPLEVBQUUsWUFBWTtnQ0FDckIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCOzRCQUNELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUM7eUJBQzlCO3FCQUNGO29CQUNEO3dCQUNFLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBQzt3QkFDakMsTUFBTSxFQUFFLE1BQU07d0JBQ2QsVUFBVSxFQUFFOzRCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzs0QkFDN0MsR0FBRyxFQUFFO2dDQUNILFdBQVcsRUFBRSxLQUFLO2dDQUNsQixPQUFPLEVBQUUsWUFBWTtnQ0FDckIsTUFBTSxFQUFFLGNBQWM7NkJBQ3ZCO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ25CLHNCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFFNUMsYUFBTSxDQUFDLFNBQVMsQ0FDZCxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFDaEMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FDbkYsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1l9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7cGFyc2VMYXllckF4aXMsIHBhcnNlVW5pdEF4aXN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ0F4aXMnLCBmdW5jdGlvbigpIHtcbiAgLy8gVE9ETzogbW92ZSB0aGlzIHRvIG1vZGVsLnRlc3QudHNcbiAgZGVzY3JpYmUoJz0gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBkZWZhdWx0IHByb3BlcnRpZXMgZm9yIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsMSA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtb2RlbDIgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwxLmF4aXMoWSksIG1vZGVsMi5heGlzKFkpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRBeGlzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IHRydWUsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkIHdoZW4gYXhpcyBjb25maWcgaXMgc3BlY2lmaWVkLicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJheGlzWFwiOiB7XCJncmlkXCI6IHRydWV9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmltcGxpY2l0LmdyaWQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGF4aXMgY29tcG9uZW50IHdpdGggZ3JpZD1mYWxzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IGZhbHNlLCBncmlkQ29sb3I6IFwiYmx1ZVwiLCBncmlkV2lkdGg6IDIwfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LmdyaWQsIGZhbHNlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaWdub3JlIG51bGwgc2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIGxvbmdpdHVkZToge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgbGF0aXR1ZGU6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImJcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF4aXNDb21wb25lbnRbJ3gnXSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpc0NvbXBvbmVudFsneSddKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyA9IHVuZGVmaW5lZCBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQgdmlhIGNvbmZpZy5heGlzWCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtheGlzWDoge2dyaWQ6IGZhbHNlfX1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5leHBsaWNpdC5ncmlkLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkIGF4aXMgPSB1bmRlZmluZWQgYXhpcyBpZiBncmlkIGlzIGRpc2FibGVkIHZpYSBjb25maWcuYXhpcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtheGlzOiB7Z3JpZDogZmFsc2V9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIHRoZSB0aXRsZSB2YWx1ZSBpZiB0aXRsZSA9IG51bGwsIFwiXCIsIG9yIGZhbHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgZm9yIChjb25zdCB2YWwgb2YgW251bGwsICcnLCBmYWxzZV0pIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgYXhpczoge3RpdGxlOiB2YWwgYXMgYW55fSAvLyBOZWVkIHRvIGNhc3QgYXMgZmFsc2UgaXMgbm90IHZhbGlkLCBidXQgd2Ugd2FudCB0byBmYWxsIGJhY2sgZ3JhY2VmdWxseVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCB2YWwgYXMgYW55KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgdGhlIGZpZWxkRGVmIHRpdGxlIHZhbHVlIGlmIHRpdGxlID0gbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICB0aXRsZTogdmFsIGFzIGFueSAvLyBOZWVkIHRvIGNhc3QgYXMgZmFsc2UgaXMgbm90IHZhbGlkLCBidXQgd2Ugd2FudCB0byBmYWxsIGJhY2sgZ3JhY2VmdWxseVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCB2YWwgYXMgYW55KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgZmllbGREZWYudGl0bGUgYXMgZXhwbGljaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICB0aXRsZTogJ2ZvbydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5leHBsaWNpdC50aXRsZSwgJ2ZvbycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSB0aXRsZSBvZiBmaWVsZERlZiBhbmQgZmllbGREZWYyJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwiYmFyXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIHRpdGxlOiAnZm9vJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeDI6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImJcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICB0aXRsZTogJ2JhcidcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5leHBsaWNpdC50aXRsZSwgJ2ZvbywgYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB0aXRsZSBvZiBmaWVsZERlZjInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4Mjoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIHRpdGxlOiAnYmFyJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCAnYmFyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIGJvdGggeCBhbmQgeDIgZm9yIHJhbmdlZCBtYXJrJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicnVsZVwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIHgyOiB7ZmllbGQ6IFwiYTJcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5nZXQoJ3RpdGxlJyksIFt7ZmllbGQ6IFwiYVwifSwge2ZpZWxkOiBcImEyXCJ9XSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUxheWVyQXhpcycsICgpID0+IHtcbiAgICBjb25zdCBnbG9iYWxSdWxlT3ZlcmxheSA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICBcImxheWVyXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwidGltZVVuaXRcIjogXCJtb250aFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gICAgZ2xvYmFsUnVsZU92ZXJsYXkucGFyc2VTY2FsZSgpO1xuICAgIGdsb2JhbFJ1bGVPdmVybGF5LnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgIHBhcnNlTGF5ZXJBeGlzKGdsb2JhbFJ1bGVPdmVybGF5KTtcblxuXG4gICAgaXQoJ2NvcnJlY3RseSBtZXJnZXMgZ3JpZFNjYWxlIGlmIG9uZSBsYXllciBkb2VzIG5vdCBoYXZlIG9uZSBvZiB0aGUgYXhpcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gZ2xvYmFsUnVsZU92ZXJsYXkuY29tcG9uZW50LmF4ZXM7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0uZ2V0KCdncmlkU2NhbGUnKSwgJ3gnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIHNpbWlsYXIgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IGdsb2JhbFJ1bGVPdmVybGF5LmNvbXBvbmVudC5heGVzO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChheGlzQ29tcG9uZW50cy55WzBdLmdldCgndGl0bGUnKSwgW3thZ2dyZWdhdGU6ICdtZWFuJywgZmllbGQ6ICdhJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgY29tYmluZXMgZGlmZmVyZW50IHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwiZGFya3JlZFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgcGFyc2VMYXllckF4aXMobW9kZWwpO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudHMgPSBtb2RlbC5jb21wb25lbnQuYXhlcztcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgYXhpc0NvbXBvbmVudHMueVswXS5nZXQoJ3RpdGxlJyksXG4gICAgICAgIFt7YWdncmVnYXRlOiAnbWF4JywgZmllbGQ6ICdIb3JzZXBvd2VyJ30sIHthZ2dyZWdhdGU6ICdtaW4nLCBmaWVsZDogJ0hvcnNlcG93ZXInfV1cbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=