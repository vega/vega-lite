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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUF1QztBQUN2Qyx5REFBOEU7QUFDOUUsbUNBQW9FO0FBRXBFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixtQ0FBbUM7SUFDbkMsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxNQUFNLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3JDLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztpQkFDdkU7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2FBQ3BDLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDhCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVB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LENBQUM7WUFDdEIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFFNUMsYUFBTSxDQUFDLFNBQVMsQ0FDZCxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFDaEMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FDbkYsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1l9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7cGFyc2VMYXllckF4aXMsIHBhcnNlVW5pdEF4aXN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ0F4aXMnLCBmdW5jdGlvbigpIHtcbiAgLy8gVE9ETzogbW92ZSB0aGlzIHRvIG1vZGVsLnRlc3QudHNcbiAgZGVzY3JpYmUoJz0gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBkZWZhdWx0IHByb3BlcnRpZXMgZm9yIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsMSA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtb2RlbDIgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwxLmF4aXMoWSksIG1vZGVsMi5heGlzKFkpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRBeGlzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IHRydWUsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYXhpcyBjb21wb25lbnQgd2l0aCBncmlkPWZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBheGlzOiB7Z3JpZDogZmFsc2UsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgbnVsbCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgbG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsYXRpdHVkZToge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpc0NvbXBvbmVudFsneCddKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChheGlzQ29tcG9uZW50Wyd5J10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCBheGlzID0gdW5kZWZpbmVkIGF4aXMgaWYgZ3JpZCBpcyBkaXNhYmxlZCB2aWEgY29uZmlnLmF4aXNYJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXNYOiB7Z3JpZDogZmFsc2V9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyA9IHVuZGVmaW5lZCBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQgdmlhIGNvbmZpZy5heGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXM6IHtncmlkOiBmYWxzZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgdGhlIHRpdGxlIHZhbHVlIGlmIHRpdGxlID0gbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBheGlzOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQudGl0bGUsIHZhbCBhcyBhbnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdG9yZSBib3RoIHggYW5kIHgyIGZvciByYW5nZWQgbWFyaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInJ1bGVcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICB4Mjoge2ZpZWxkOiBcImEyXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZ2V0KCd0aXRsZScpLCBbe2ZpZWxkOiBcImFcIn0sIHtmaWVsZDogXCJhMlwifV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VMYXllckF4aXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZ2xvYmFsUnVsZU92ZXJsYXkgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICBcInRpbWVVbml0XCI6IFwibW9udGhcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImRhdGVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICAgIGdsb2JhbFJ1bGVPdmVybGF5LnBhcnNlU2NhbGUoKTtcbiAgICBnbG9iYWxSdWxlT3ZlcmxheS5wYXJzZUxheW91dFNpemUoKTtcbiAgICBwYXJzZUxheWVyQXhpcyhnbG9iYWxSdWxlT3ZlcmxheSk7XG5cblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIGdyaWRTY2FsZSBpZiBvbmUgbGF5ZXIgZG9lcyBub3QgaGF2ZSBvbmUgb2YgdGhlIGF4aXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IGdsb2JhbFJ1bGVPdmVybGF5LmNvbXBvbmVudC5heGVzO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnkubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50cy55WzBdLmdldCgnZ3JpZFNjYWxlJyksICd4Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG1lcmdlcyBzaW1pbGFyIHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudHMgPSBnbG9iYWxSdWxlT3ZlcmxheS5jb21wb25lbnQuYXhlcztcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYXhpc0NvbXBvbmVudHMueVswXS5nZXQoJ3RpdGxlJyksIFt7YWdncmVnYXRlOiAnbWVhbicsIGZpZWxkOiAnYSd9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IGNvbWJpbmVzIGRpZmZlcmVudCB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCIkc2NoZW1hXCI6IFwiaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb25cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiQ3lsaW5kZXJzXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcImRhcmtyZWRcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2NhcnMuanNvblwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIHBhcnNlTGF5ZXJBeGlzKG1vZGVsKTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gbW9kZWwuY29tcG9uZW50LmF4ZXM7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGF4aXNDb21wb25lbnRzLnlbMF0uZ2V0KCd0aXRsZScpLFxuICAgICAgICBbe2FnZ3JlZ2F0ZTogJ21heCcsIGZpZWxkOiAnSG9yc2Vwb3dlcid9LCB7YWdncmVnYXRlOiAnbWluJywgZmllbGQ6ICdIb3JzZXBvd2VyJ31dXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19