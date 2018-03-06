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
        it('should not set title if title  = null, "", or false', function () {
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
                chai_1.assert.doesNotHaveAnyKeys(axisComponent['x'][0].main.explicit, ['title']);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUEwQztBQUMxQyx5REFBNEc7QUFDNUcsbUNBQW9FO0FBRXBFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixtQ0FBbUM7SUFDbkMsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxNQUFNLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3JDLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztpQkFDdkU7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDhCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVB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IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge3BhcnNlR3JpZEF4aXMsIHBhcnNlTGF5ZXJBeGlzLCBwYXJzZU1haW5BeGlzLCBwYXJzZVVuaXRBeGlzfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL3BhcnNlJztcbmltcG9ydCB7cGFyc2VMYXllck1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdBeGlzJywgZnVuY3Rpb24oKSB7XG4gIC8vIFRPRE86IG1vdmUgdGhpcyB0byBtb2RlbC50ZXN0LnRzXG4gIGRlc2NyaWJlKCc9IHRydWUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgZGVmYXVsdCBwcm9wZXJ0aWVzIGZvciBheGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbDEgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbW9kZWwyID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsMS5heGlzKFkpLCBtb2RlbDIuYXhpcyhZKSk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgncGFyc2VVbml0QXhpcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyBvYmplY3RzIGZvciBib3RoIG1haW4gYXhpcyBhbmQgZm9yIGdyaWQgYXhpcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IHRydWUsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0ubWFpbi5pbXBsaWNpdC5ncmlkLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5ncmlkLmV4cGxpY2l0LmdyaWQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCBheGlzIG9iamVjdHMgZm9yIG9ubHkgbWFpbiBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIGF4aXM6IHtncmlkOiBmYWxzZSwgZ3JpZENvbG9yOiBcImJsdWVcIiwgZ3JpZFdpZHRoOiAyMH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5tYWluLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBudWxsIHNjYWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcImxvbmdpdHVkZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB5OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJiXCIsXG4gICAgICAgICAgICB0eXBlOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF4aXNDb21wb25lbnRbJ3gnXSk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpc0NvbXBvbmVudFsneSddKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyBvYmplY3RzIGZvciBvbmx5IG1haW4gYXhpcyBpZiBncmlkIGlzIGRpc2FibGVkIHZpYSBjb25maWcuYXhpc1gnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7YXhpc1g6IHtncmlkOiBmYWxzZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0ubWFpbi5leHBsaWNpdC5ncmlkLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkIGF4aXMgb2JqZWN0cyBmb3Igb25seSBtYWluIGF4aXMgaWYgZ3JpZCBpcyBkaXNhYmxlZCB2aWEgY29uZmlnLmF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7YXhpczoge2dyaWQ6IGZhbHNlfX1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5tYWluLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzZXQgdGl0bGUgaWYgdGl0bGUgID0gbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBheGlzOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5kb2VzTm90SGF2ZUFueUtleXMoYXhpc0NvbXBvbmVudFsneCddWzBdLm1haW4uZXhwbGljaXQsIFsndGl0bGUnXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUxheWVyQXhpcycsICgpID0+IHtcbiAgICBjb25zdCBnbG9iYWxSdWxlT3ZlcmxheSA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICBcImxheWVyXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwidGltZVVuaXRcIjogXCJtb250aFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gICAgZ2xvYmFsUnVsZU92ZXJsYXkucGFyc2VTY2FsZSgpO1xuICAgIGdsb2JhbFJ1bGVPdmVybGF5LnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgIHBhcnNlTGF5ZXJBeGlzKGdsb2JhbFJ1bGVPdmVybGF5KTtcblxuXG4gICAgaXQoJ2NvcnJlY3RseSBtZXJnZXMgZ3JpZFNjYWxlIGlmIG9uZSBsYXllciBkb2VzIG5vdCBoYXZlIG9uZSBvZiB0aGUgYXhpcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gZ2xvYmFsUnVsZU92ZXJsYXkuY29tcG9uZW50LmF4ZXM7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0uZ3JpZC5nZXQoJ2dyaWRTY2FsZScpLCAneCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBtZXJnZXMgc2ltaWxhciB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gZ2xvYmFsUnVsZU92ZXJsYXkuY29tcG9uZW50LmF4ZXM7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueVswXS5tYWluLmdldCgndGl0bGUnKSwgJ01lYW4gb2YgYScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBjb21iaW5lcyBkaWZmZXJlbnQgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2NhcnMuanNvblwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJkYXJrcmVkXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiQ3lsaW5kZXJzXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBwYXJzZUxheWVyQXhpcyhtb2RlbCk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IG1vZGVsLmNvbXBvbmVudC5heGVzO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueVswXS5tYWluLmdldCgndGl0bGUnKSwgJ01heCBvZiBIb3JzZXBvd2VyLCBNaW4gb2YgSG9yc2Vwb3dlcicpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VHcmlkQXhpcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBhIFZlZ2EgZ3JpZCBheGlzIG9iamVjdCB3aXRoIGNvcnJlY3QgdHlwZSwgc2NhbGUgYW5kIGdyaWQgcHJvcGVydGllcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IHRydWV9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRlZiA9IHBhcnNlR3JpZEF4aXMoWCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzT2JqZWN0KGRlZik7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLmltcGxpY2l0Lm9yaWVudCwgJ2JvdHRvbScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5pbXBsaWNpdC5zY2FsZSwgJ3gnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTWFpbkF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYSBWZWdhIGF4aXMgb2JqZWN0IHdpdGggY29ycmVjdCB0eXBlIGFuZCBzY2FsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRlZiA9IHBhcnNlTWFpbkF4aXMoWCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzT2JqZWN0KGRlZik7XG4gICAgICBhc3NlcnQuZXF1YWwoZGVmLmltcGxpY2l0Lm9yaWVudCwgJ2JvdHRvbScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRlZi5pbXBsaWNpdC5zY2FsZSwgJ3gnKTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuIl19