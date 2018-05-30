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
        it('should produce Vega grid when axis config is specified.', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: {
                        field: "a",
                        type: "quantitative"
                    }
                },
                "config": { "axisX": { "grid": true } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].implicit.grid, true);
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
        it('should store the fieldDef title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: "point",
                    encoding: {
                        x: {
                            field: "a",
                            type: "quantitative",
                            title: val // Need to cast as false is not valid, but we want to fall back gracefully
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
        it('should merge title of fieldDef and fieldDef2', function () {
            var model = parseUnitModelWithScale({
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
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'foo, bar');
        });
        it('should use title of fieldDef2', function () {
            var model = parseUnitModelWithScale({
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
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'bar');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLENBQUMsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxjQUFjLEVBQUUsYUFBYSxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDOUUsT0FBTyxFQUFDLGVBQWUsRUFBRSx1QkFBdUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVwRSxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsbUNBQW1DO0lBQ25DLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDO2dCQUNyQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7aUJBQ3ZFO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQzthQUNwQyxDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQztnQkFDckMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFDO2lCQUN2RTtnQkFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7YUFDcEMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFB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LGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUU1QyxNQUFNLENBQUMsU0FBUyxDQUNkLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUNoQyxDQUFDLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUNuRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7WX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtwYXJzZUxheWVyQXhpcywgcGFyc2VVbml0QXhpc30gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9wYXJzZSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnQXhpcycsIGZ1bmN0aW9uKCkge1xuICAvLyBUT0RPOiBtb3ZlIHRoaXMgdG8gbW9kZWwudGVzdC50c1xuICBkZXNjcmliZSgnPSB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGRlZmF1bHQgcHJvcGVydGllcyBmb3IgYXhpcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwxID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiAnVVNfR3Jvc3MnLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsMiA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogJ1VTX0dyb3NzJywgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbDEuYXhpcyhZKSwgbW9kZWwyLmF4aXMoWSkpO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdEF4aXMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgVmVnYSBncmlkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBheGlzOiB7Z3JpZDogdHJ1ZSwgZ3JpZENvbG9yOiBcImJsdWVcIiwgZ3JpZFdpZHRoOiAyMH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGF4aXNDb21wb25lbnRbJ3gnXVswXS5leHBsaWNpdC5ncmlkLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgd2hlbiBheGlzIGNvbmZpZyBpcyBzcGVjaWZpZWQuJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImF4aXNYXCI6IHtcImdyaWRcIjogdHJ1ZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uaW1wbGljaXQuZ3JpZCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgYXhpcyBjb21wb25lbnQgd2l0aCBncmlkPWZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBheGlzOiB7Z3JpZDogZmFsc2UsIGdyaWRDb2xvcjogXCJibHVlXCIsIGdyaWRXaWR0aDogMjB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgbnVsbCBzY2FsZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgbG9uZ2l0dWRlOiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsYXRpdHVkZToge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpc0NvbXBvbmVudFsneCddKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChheGlzQ29tcG9uZW50Wyd5J10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIFZlZ2EgZ3JpZCBheGlzID0gdW5kZWZpbmVkIGF4aXMgaWYgZ3JpZCBpcyBkaXNhYmxlZCB2aWEgY29uZmlnLmF4aXNYJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXNYOiB7Z3JpZDogZmFsc2V9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LmdyaWQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBWZWdhIGdyaWQgYXhpcyA9IHVuZGVmaW5lZCBheGlzIGlmIGdyaWQgaXMgZGlzYWJsZWQgdmlhIGNvbmZpZy5heGlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge2F4aXM6IHtncmlkOiBmYWxzZX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQuZ3JpZCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgdGhlIHRpdGxlIHZhbHVlIGlmIHRpdGxlID0gbnVsbCwgXCJcIiwgb3IgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IHZhbCBvZiBbbnVsbCwgJycsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBheGlzOiB7dGl0bGU6IHZhbCBhcyBhbnl9IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQudGl0bGUsIHZhbCBhcyBhbnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdG9yZSB0aGUgZmllbGREZWYgdGl0bGUgdmFsdWUgaWYgdGl0bGUgPSBudWxsLCBcIlwiLCBvciBmYWxzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAoY29uc3QgdmFsIG9mIFtudWxsLCAnJywgZmFsc2VdKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgIHRpdGxlOiB2YWwgYXMgYW55IC8vIE5lZWQgdG8gY2FzdCBhcyBmYWxzZSBpcyBub3QgdmFsaWQsIGJ1dCB3ZSB3YW50IHRvIGZhbGwgYmFjayBncmFjZWZ1bGx5XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYXhpc0NvbXBvbmVudCA9IHBhcnNlVW5pdEF4aXMobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQudGl0bGUsIHZhbCBhcyBhbnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdG9yZSBmaWVsZERlZi50aXRsZSBhcyBleHBsaWNpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYVwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIHRpdGxlOiAnZm9vJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCAnZm9vJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIHRpdGxlIG9mIGZpZWxkRGVmIGFuZCBmaWVsZERlZjInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7XG4gICAgICAgICAgICBmaWVsZDogXCJhXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgdGl0bGU6ICdmb28nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4Mjoge1xuICAgICAgICAgICAgZmllbGQ6IFwiYlwiLFxuICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIHRpdGxlOiAnYmFyJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50ID0gcGFyc2VVbml0QXhpcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmV4cGxpY2l0LnRpdGxlLCAnZm9vLCBiYXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHRpdGxlIG9mIGZpZWxkRGVmMicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgIGZpZWxkOiBcImFcIixcbiAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHgyOiB7XG4gICAgICAgICAgICBmaWVsZDogXCJiXCIsXG4gICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgdGl0bGU6ICdiYXInXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J11bMF0uZXhwbGljaXQudGl0bGUsICdiYXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgYm90aCB4IGFuZCB4MiBmb3IgcmFuZ2VkIG1hcmsnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJydWxlXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgeDI6IHtmaWVsZDogXCJhMlwiLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnQgPSBwYXJzZVVuaXRBeGlzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50Wyd4J10ubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYXhpc0NvbXBvbmVudFsneCddWzBdLmdldCgndGl0bGUnKSwgW3tmaWVsZDogXCJhXCJ9LCB7ZmllbGQ6IFwiYTJcIn1dKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTGF5ZXJBeGlzJywgKCkgPT4ge1xuICAgIGNvbnN0IGdsb2JhbFJ1bGVPdmVybGF5ID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJhXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJhXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJ0aW1lVW5pdFwiOiBcIm1vbnRoXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJkYXRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgICBnbG9iYWxSdWxlT3ZlcmxheS5wYXJzZVNjYWxlKCk7XG4gICAgZ2xvYmFsUnVsZU92ZXJsYXkucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgcGFyc2VMYXllckF4aXMoZ2xvYmFsUnVsZU92ZXJsYXkpO1xuXG5cbiAgICBpdCgnY29ycmVjdGx5IG1lcmdlcyBncmlkU2NhbGUgaWYgb25lIGxheWVyIGRvZXMgbm90IGhhdmUgb25lIG9mIHRoZSBheGlzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXhpc0NvbXBvbmVudHMgPSBnbG9iYWxSdWxlT3ZlcmxheS5jb21wb25lbnQuYXhlcztcbiAgICAgIGFzc2VydC5lcXVhbChheGlzQ29tcG9uZW50cy55Lmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpc0NvbXBvbmVudHMueVswXS5nZXQoJ2dyaWRTY2FsZScpLCAneCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBtZXJnZXMgc2ltaWxhciB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDb21wb25lbnRzID0gZ2xvYmFsUnVsZU92ZXJsYXkuY29tcG9uZW50LmF4ZXM7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGF4aXNDb21wb25lbnRzLnlbMF0uZ2V0KCd0aXRsZScpLCBbe2FnZ3JlZ2F0ZTogJ21lYW4nLCBmaWVsZDogJ2EnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBjb21iaW5lcyBkaWZmZXJlbnQgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2NhcnMuanNvblwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJkYXJrcmVkXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiQ3lsaW5kZXJzXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBwYXJzZUxheWVyQXhpcyhtb2RlbCk7XG4gICAgICBjb25zdCBheGlzQ29tcG9uZW50cyA9IG1vZGVsLmNvbXBvbmVudC5heGVzO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBheGlzQ29tcG9uZW50cy55WzBdLmdldCgndGl0bGUnKSxcbiAgICAgICAgW3thZ2dyZWdhdGU6ICdtYXgnLCBmaWVsZDogJ0hvcnNlcG93ZXInfSwge2FnZ3JlZ2F0ZTogJ21pbicsIGZpZWxkOiAnSG9yc2Vwb3dlcid9XVxuICAgICAgKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==