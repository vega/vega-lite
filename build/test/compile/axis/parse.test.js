/* tslint:disable:quotemark */
import { assert } from 'chai';
import { Y } from '../../../src/channel';
import { parseLayerAxis, parseUnitAxis } from '../../../src/compile/axis/parse';
import { parseLayerModel, parseUnitModelWithScale } from '../../util';
describe('Axis', function () {
    // TODO: move this to model.test.ts
    describe('= true', function () {
        it('should produce default properties for axis', function () {
            var model1 = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
                },
                "data": { "url": "data/movies.json" }
            });
            var model2 = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": 'US_Gross', "aggregate": "sum" }
                },
                "data": { "url": "data/movies.json" }
            });
            assert.deepEqual(model1.axis(Y), model2.axis(Y));
        });
    });
    describe('parseUnitAxis', function () {
        it('should produce Vega grid', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: true, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, true);
        });
        it('should produce axis component with grid=false', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        axis: { grid: false, gridColor: "blue", gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, false);
        });
        it('should ignore null scales', function () {
            var model = parseUnitModelWithScale({
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
            var axisComponent = parseUnitAxis(model);
            assert.isUndefined(axisComponent['x']);
            assert.isUndefined(axisComponent['y']);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axisX', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                config: { axisX: { grid: false } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axis', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                config: { axis: { grid: false } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should store the title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: {
                            field: "a",
                            type: "quantitative",
                            axis: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var axisComponent = parseUnitAxis(model);
                assert.equal(axisComponent['x'].length, 1);
                assert.equal(axisComponent['x'][0].explicit.title, val);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative",
                        title: 'foo'
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'foo');
        });
        it('should store both x and x2 for ranged mark', function () {
            var model = parseUnitModelWithScale({
                mark: "rule",
                encoding: {
                    x: { field: "a", type: "quantitative" },
                    x2: { field: "a2", type: "quantitative" }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.deepEqual(axisComponent['x'][0].get('title'), [{ field: "a" }, { field: "a2" }]);
        });
    });
    describe('parseLayerAxis', function () {
        var globalRuleOverlay = parseLayerModel({
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
        parseLayerAxis(globalRuleOverlay);
        it('correctly merges gridScale if one layer does not have one of the axis', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            assert.equal(axisComponents.y.length, 1);
            assert.equal(axisComponents.y[0].get('gridScale'), 'x');
        });
        it('correctly merges similar title', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            assert.deepEqual(axisComponents.y[0].get('title'), [{ aggregate: 'mean', field: 'a' }]);
        });
        it('correctly combines different title', function () {
            var model = parseLayerModel({
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
            parseLayerAxis(model);
            var axisComponents = model.component.axes;
            assert.deepEqual(axisComponents.y[0].get('title'), [{ aggregate: 'max', field: 'Horsepower' }, { aggregate: 'min', field: 'Horsepower' }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxjQUFjLEVBQUUsYUFBYSxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDOUUsT0FBTyxFQUFDLGVBQWUsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVwRSxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsbUNBQW1DO0lBQ25DLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQztnQkFDckMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFDO2lCQUN2RTtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFB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ZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1l9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7cGFyc2VMYXllckF4aXMsIHBhcnNlVW5pdEF4aXN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvcGFyc2UnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ0F4aXMnLCBmdW5jdGlvbigpIHtcbiAgLy8gVE9ETzogbW92ZSB0aGlzIHRvIG1vZGVsLnRlc3QudHNcbiAgZGVzY3JpYmUoJz0gdHJ1ZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBkZWZhdWx0IHByb3BlcnRpZXMgZm9yIGF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsMSA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtb2RlbDIgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6ICdVU19Hcm9zcycsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwxLmF4aXMoWSksIG1vZGVsMi5heGlzKFkpKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRBeGlzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgYXhpczoge2dyaWQ6IHRydWUsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYXhpcyBjb21wb25lbnQgd2l0aCBncmlkPWZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBheGlzOiB7Z3JpZDogZmFsc2UsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgbnVsbCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgbG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsYXRpdHVkZToge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpc0NvbXBvbmVudFsneCddKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChheGlzQ29tcG9uZW50Wyd5J10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCBheGlzID0gdW5kZWZpbmVkIGF4aXMgaWYgZ3JpZCBpcyBkaXNhYmxlZCB2aWEgY29uZmlnLmF4aXNYJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXNYOiB7Z3JpZDogZmFsc2V9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyA9IHVuZGVmaW5lZCBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQgdmlhIGNvbmZpZy5heGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXM6IHtncmlkOiBmYWxzZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgdGhlIHRpdGxlIHZhbHVlIGlmIHRpdGxlID0gbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBheGlzOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQudGl0bGUsIHZhbCBhcyBhbnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdG9yZSBmaWVsZERlZi50aXRsZSBhcyBleHBsaWNpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIHRpdGxlOiAnZm9vJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCAnZm9vJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIGJvdGggeCBhbmQgeDIgZm9yIHJhbmdlZCBtYXJrJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicnVsZVwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIHgyOiB7ZmllbGQ6IFwiYTJcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5nZXQoJ3RpdGxlJyksIFt7ZmllbGQ6IFwiYVwifSwge2ZpZWxkOiBcImEyXCJ9XSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUxheWVyQXhpcycsICgpID0+IHtcbiAgICBjb25zdCBnbG9iYWxSdWxlT3ZlcmxheSA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICBcImxheWVyXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwidGltZVVuaXRcIjogXCJtb250aFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiZGF0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gICAgZ2xvYmFsUnVsZU92ZXJsYXkucGFyc2VTY2FsZSgpO1xuICAgIGdsb2JhbFJ1bGVPdmVybGF5LnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgIHBhcnNlTGF5ZXJBeGlzKGdsb2JhbFJ1bGVPdmVybGF5KTtcblxuXG4gICAgaXQoJ2NvcnJlY3RseSBtZXJnZXMgZ3JpZFNjYWxlIGlmIG9uZSBsYXllciBkb2VzIG5vdCBoYXZlIG9uZSBvZiB0aGUgYXhpcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gZ2xvYmFsUnVsZU92ZXJsYXkuY29tcG9uZW50LmF4ZXM7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0uZ2V0KCdncmlkU2NhbGUnKSwgJ3gnKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbWVyZ2VzIHNpbWlsYXIgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IGdsb2JhbFJ1bGVPdmVybGF5LmNvbXBvbmVudC5heGVzO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChheGlzQ29tcG9uZW50cy55WzBdLmdldCgndGl0bGUnKSwgW3thZ2dyZWdhdGU6ICdtZWFuJywgZmllbGQ6ICdhJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgY29tYmluZXMgZGlmZmVyZW50IHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwiZGFya3JlZFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgcGFyc2VMYXllckF4aXMobW9kZWwpO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudHMgPSBtb2RlbC5jb21wb25lbnQuYXhlcztcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgYXhpc0NvbXBvbmVudHMueVswXS5nZXQoJ3RpdGxlJyksXG4gICAgICAgIFt7YWdncmVnYXRlOiAnbWF4JywgZmllbGQ6ICdIb3JzZXBvd2VyJ30sIHthZ2dyZWdhdGU6ICdtaW4nLCBmaWVsZDogJ0hvcnNlcG93ZXInfV1cbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=