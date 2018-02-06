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
        it('should produce Vega grid axis objects for both main axis and for grid axis', function () {
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
            chai_1.assert.equal(axisComponent['x'][0].main.implicit.grid, undefined);
            chai_1.assert.equal(axisComponent['x'][0].grid.explicit.grid, true);
        });
        it('should produce Vega grid axis objects for only main axis if grid is disabled', function () {
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
            chai_1.assert.equal(axisComponent['x'][0].main.explicit.grid, undefined);
        });
        it('should ignore null scales', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "longitude"
                    },
                    y: {
                        field: "b",
                        type: "latitude"
                    }
                }
            });
            var axisComponent = parse_1.parseUnitAxis(model);
            chai_1.assert.isUndefined(axisComponent['x']);
            chai_1.assert.isUndefined(axisComponent['y']);
        });
        it('should produce Vega grid axis objects for only main axis if grid is disabled via config.axisX', function () {
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
            chai_1.assert.equal(axisComponent['x'][0].main.explicit.grid, undefined);
        });
        it('should produce Vega grid axis objects for only main axis if grid is disabled via config.axis', function () {
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
            chai_1.assert.equal(axisComponent['x'][0].main.explicit.grid, undefined);
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
            chai_1.assert.equal(axisComponents.y[0].grid.get('gridScale'), 'x');
        });
        it('correctly merges similar title', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            chai_1.assert.equal(axisComponents.y[0].main.get('title'), 'Mean of a');
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
            chai_1.assert.equal(axisComponents.y[0].main.get('title'), 'Max of Horsepower, Min of Horsepower');
        });
    });
    describe('parseGridAxis', function () {
        it('should produce a Vega grid axis object with correct type, scale and grid properties', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: true }
                    }
                }
            });
            var def = parse_1.parseGridAxis(channel_1.X, model);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.implicit.orient, 'bottom');
            chai_1.assert.equal(def.implicit.scale, 'x');
        });
    });
    describe('parseMainAxis', function () {
        it('should produce a Vega axis object with correct type and scale', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative" }
                }
            });
            var def = parse_1.parseMainAxis(channel_1.X, model);
            chai_1.assert.isObject(def);
            chai_1.assert.equal(def.implicit.orient, 'bottom');
            chai_1.assert.equal(def.implicit.scale, 'x');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUEwQztBQUMxQyx5REFBNEc7QUFDNUcsbUNBQW9FO0FBRXBFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixtQ0FBbUM7SUFDbkMsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxNQUFNLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3JDLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztpQkFDdkU7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDhCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUMvRSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYzt3QkFDcEIsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUM7cUJBQ3JEO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxhQUFhLEdBQUcscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEVBQThFLEVBQUU7WUFDakYsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7d0JBQ3BCLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFDO3FCQUN0RDtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFO3dCQUNELEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxXQUFXO3FCQUNsQjtvQkFDRCxDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLFVBQVU7cUJBQ2pCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxhQUFhLEdBQUcscUJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLGFBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0ZBQStGLEVBQUU7WUFDbEcsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLGNBQWM7cUJBQ3JCO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBQzthQUMvQixDQUFDLENBQUM7WUFDSCxJQUFNLGFBQWEsR0FBRyxxQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQztRQUdILEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtZQUNqRyxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYztxQkFDckI7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxFQUFDO2FBQzlCLENBQUMsQ0FBQztZQUNILElBQU0sYUFBYSxHQUFHLHFCQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBTSxpQkFBaUIsR0FBRyxzQkFBZSxDQUFDO1lBQ3hDLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxNQUFNOzRCQUNuQixPQUFPLEVBQUUsR0FBRzs0QkFDWixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsTUFBTTs0QkFDbkIsT0FBTyxFQUFFLEdBQUc7NEJBQ1osTUFBTSxFQUFFLGNBQWM7eUJBQ3ZCO3dCQUNELEdBQUcsRUFBRTs0QkFDSCxVQUFVLEVBQUUsT0FBTzs0QkFDbkIsTUFBTSxFQUFFLFVBQVU7NEJBQ2xCLE9BQU8sRUFBRSxNQUFNO3lCQUNoQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDL0IsaUJBQWlCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEMsc0JBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBR2xDLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxJQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekMsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUN4RCxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixTQUFTLEVBQUUsaURBQWlEO2dCQUM1RCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBQ2pDLE9BQU8sRUFBRTtvQkFDUDt3QkFDRSxNQUFNLEVBQUUsTUFBTTt3QkFDZCxVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDOzRCQUM3QyxHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLEtBQUs7Z0NBQ2xCLE9BQU8sRUFBRSxZQUFZO2dDQUNyQixNQUFNLEVBQUUsY0FBYzs2QkFDdkI7NEJBQ0QsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQzt5QkFDOUI7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFDO3dCQUNqQyxNQUFNLEVBQUUsTUFBTTt3QkFDZCxVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDOzRCQUM3QyxHQUFHLEVBQUU7Z0NBQ0gsV0FBVyxFQUFFLEtBQUs7Z0NBQ2xCLE9BQU8sRUFBRSxZQUFZO2dDQUNyQixNQUFNLEVBQUUsY0FBYzs2QkFDdkI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkIsc0JBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUU1QyxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzlGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyxxRkFBcUYsRUFBRTtZQUN4RixJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRTt3QkFDRCxLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsY0FBYzt3QkFDcEIsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQztxQkFDbkI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLEdBQUcsR0FBRyxxQkFBYSxDQUFDLFdBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQyxhQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsK0RBQStELEVBQUU7WUFDbEUsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3RDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxHQUFHLEdBQUcscUJBQWEsQ0FBQyxXQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEMsYUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtwYXJzZUdyaWRBeGlzLCBwYXJzZUxheWVyQXhpcywgcGFyc2VNYWluQXhpcywgcGFyc2VVbml0QXhpc30gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9wYXJzZSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnQXhpcycsIGZ1bmN0aW9uKCkge1xuICAvLyBUT0RPOiBtb3ZlIHRoaXMgdG8gbW9kZWwudGVzdC50c1xuICBkZXNjcmliZSgnPSB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGRlZmF1bHQgcHJvcGVydGllcyBmb3IgYXhpcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwxID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsMiA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbDEuYXhpcyhZKSwgbW9kZWwyLmF4aXMoWSkpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdEF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkIGF4aXMgb2JqZWN0cyBmb3IgYm90aCBtYWluIGF4aXMgYW5kIGZvciBncmlkIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIGF4aXM6IHtncmlkOiB0cnVlLCBncmlkQ29sb3I6IFwiYmx1ZVwiLCBncmlkV2lkdGg6IDIwfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLm1haW4uaW1wbGljaXQuZ3JpZCwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZ3JpZC5leHBsaWNpdC5ncmlkLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyBvYmplY3RzIGZvciBvbmx5IG1haW4gYXhpcyBpZiBncmlkIGlzIGRpc2FibGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBheGlzOiB7Z3JpZDogZmFsc2UsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0ubWFpbi5leHBsaWNpdC5ncmlkLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgbnVsbCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJsb25naXR1ZGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgeToge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJsYXRpdHVkZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChheGlzQ29tcG9uZW50Wyd4J10pO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF4aXNDb21wb25lbnRbJ3knXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkIGF4aXMgb2JqZWN0cyBmb3Igb25seSBtYWluIGF4aXMgaWYgZ3JpZCBpcyBkaXNhYmxlZCB2aWEgY29uZmlnLmF4aXNYJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXNYOiB7Z3JpZDogZmFsc2V9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLm1haW4uZXhwbGljaXQuZ3JpZCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCBheGlzIG9iamVjdHMgZm9yIG9ubHkgbWFpbiBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQgdmlhIGNvbmZpZy5heGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXM6IHtncmlkOiBmYWxzZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0ubWFpbi5leHBsaWNpdC5ncmlkLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VMYXllckF4aXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZ2xvYmFsUnVsZU92ZXJsYXkgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICBcInRpbWVVbml0XCI6IFwibW9udGhcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImRhdGVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICAgIGdsb2JhbFJ1bGVPdmVybGF5LnBhcnNlU2NhbGUoKTtcbiAgICBnbG9iYWxSdWxlT3ZlcmxheS5wYXJzZUxheW91dFNpemUoKTtcbiAgICBwYXJzZUxheWVyQXhpcyhnbG9iYWxSdWxlT3ZlcmxheSk7XG5cblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIGdyaWRTY2FsZSBpZiBvbmUgbGF5ZXIgZG9lcyBub3QgaGF2ZSBvbmUgb2YgdGhlIGF4aXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IGdsb2JhbFJ1bGVPdmVybGF5LmNvbXBvbmVudC5heGVzO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnkubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50cy55WzBdLmdyaWQuZ2V0KCdncmlkU2NhbGUnKSwgJ3gnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIHNpbWlsYXIgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IGdsb2JhbFJ1bGVPdmVybGF5LmNvbXBvbmVudC5heGVzO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0ubWFpbi5nZXQoJ3RpdGxlJyksICdNZWFuIG9mIGEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgY29tYmluZXMgZGlmZmVyZW50IHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwiZGFya3JlZFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgcGFyc2VMYXllckF4aXMobW9kZWwpO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudHMgPSBtb2RlbC5jb21wb25lbnQuYXhlcztcblxuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0ubWFpbi5nZXQoJ3RpdGxlJyksICdNYXggb2YgSG9yc2Vwb3dlciwgTWluIG9mIEhvcnNlcG93ZXInKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlR3JpZEF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGdyaWQgYXhpcyBvYmplY3Qgd2l0aCBjb3JyZWN0IHR5cGUsIHNjYWxlIGFuZCBncmlkIHByb3BlcnRpZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIGF4aXM6IHtncmlkOiB0cnVlfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBkZWYgPSBwYXJzZUdyaWRBeGlzKFgsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5pbXBsaWNpdC5vcmllbnQsICdib3R0b20nKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYuaW1wbGljaXQuc2NhbGUsICd4Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZU1haW5BeGlzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGEgVmVnYSBheGlzIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSBhbmQgc2NhbGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBkZWYgPSBwYXJzZU1haW5BeGlzKFgsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc09iamVjdChkZWYpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5pbXBsaWNpdC5vcmllbnQsICdib3R0b20nKTtcbiAgICAgIGFzc2VydC5lcXVhbChkZWYuaW1wbGljaXQuc2NhbGUsICd4Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==