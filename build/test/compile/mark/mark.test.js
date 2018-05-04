"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var mark_1 = require("../../../src/compile/mark/mark");
var mark_2 = require("../../../src/mark");
var util_1 = require("../../util");
describe('Mark', function () {
    describe('parseMarkGroup', function () {
        // PATH
        describe('Multi-series Line', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "line", "style": "trend" },
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" },
                    "color": { "field": "symbol", "type": "nominal" }
                }
            });
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'pathgroup');
                chai_1.assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                chai_1.assert.equal(submarkGroup.name, 'marks');
                chai_1.assert.equal(submarkGroup.type, 'line');
                chai_1.assert.deepEqual(submarkGroup.style, ['line', 'trend']);
                chai_1.assert.equal(submarkGroup.from.data, 'faceted_path_main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'pathgroup');
                chai_1.assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                chai_1.assert.isUndefined(submarkGroup.transform);
            });
        });
        describe('Single Line', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "line",
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" }
                }
            });
            it('should have mark group with proper data and key', function () {
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'marks');
                chai_1.assert.equal(markGroup.type, 'line');
                chai_1.assert.equal(markGroup.from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
            // NON-PATH
        });
        describe('Points with key', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" },
                    "key": { "field": "k", "type": "quantitative" }
                }
            });
            it('should have mark group with proper data and key', function () {
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.type, 'symbol');
                chai_1.assert.equal(markGroup.key.field, 'k');
                chai_1.assert.equal(markGroup.from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
        });
        it('Geoshape should have post encoding transform', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {}
            });
            var markGroup = mark_1.parseMarkGroup(model);
            chai_1.assert.isDefined(markGroup[0].transform);
            chai_1.assert.equal(markGroup[0].transform[0].type, mark_2.GEOSHAPE);
        });
        describe('Aggregated Bar with a color with binned x', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                    "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                    "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                }
            });
            it('should use main stacked data source', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
                chai_1.assert.equal(markGroup[0].style, 'bar');
            });
            it('should not have post encoding transform', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
        });
        describe('Faceted aggregated Bar with a color with binned x', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'nominal' }
                },
                spec: {
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                }
            });
            it('should use faceted data source', function () {
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = mark_1.parseMarkGroup(model.child);
                chai_1.assert.equal(markGroup[0].from.data, 'child_main');
            });
            it('should not have post encoding transform', function () {
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = mark_1.parseMarkGroup(model.child);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
        });
        describe('Aggregated bar', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                    "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                }
            });
            it('should use main aggregated data source', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
        });
    });
    describe('getSort', function () {
        it('should order by order field', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "field": "year", "type": "temporal" }
                }
            });
            chai_1.assert.deepEqual(mark_1.getSort(model), {
                field: ['datum[\"year\"]'],
                order: ['ascending']
            });
        });
        it('should order by x by default if x is the dimension', function () {
            var model = util_1.parseUnitModelWithScale({
                "data": { "url": "data/movies.json" },
                "mark": "line",
                "encoding": {
                    "x": {
                        "bin": { "maxbins": 10 },
                        "field": "IMDB_Rating",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "y": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            });
            chai_1.assert.deepEqual(mark_1.getSort(model), {
                field: 'datum[\"bin_maxbins_10_IMDB_Rating\"]',
                order: 'descending'
            });
        });
        it('should not order by a missing dimension', function () {
            var model = util_1.parseUnitModelWithScale({
                "data": { "url": "data/movies.json" },
                "mark": "line",
                "encoding": {
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "y": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            });
            chai_1.assert.deepEqual(mark_1.getSort(model), undefined);
        });
    });
    describe('pathGroupingFields()', function () {
        it('should return fields for unaggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_b = {}, _b[channel] = { field: 'a', type: 'nominal' }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return a field for size of a trail mark.', function () {
            chai_1.assert.deepEqual(mark_1.pathGroupingFields('trail', { size: { field: 'a', type: 'nominal' } }), []);
        });
        it('should not return fields for aggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_b = {}, _b[channel] = { aggregate: 'mean', field: 'a', type: 'nominal' }, _b)), [], channel);
            }
            var _b;
        });
        it('should return condition detail fields for color, size, shape', function () {
            for (var _i = 0, _a = [channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_b = {}, _b[channel] = {
                    condition: { selection: 'sel', field: 'a', type: 'nominal' }
                }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return errors for all channels', function () {
            var _loop_1 = function (channel) {
                chai_1.assert.doesNotThrow(function () {
                    mark_1.pathGroupingFields('line', (_a = {},
                        _a[channel] = { field: 'a', type: 'nominal' },
                        _a));
                    var _a;
                });
            };
            for (var _i = 0, UNIT_CHANNELS_1 = channel_1.UNIT_CHANNELS; _i < UNIT_CHANNELS_1.length; _i++) {
                var channel = UNIT_CHANNELS_1[_i];
                _loop_1(channel);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBaUY7QUFDakYsdURBQTJGO0FBRTNGLDBDQUEyQztBQUMzQyxtQ0FBMEg7QUFFMUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNmLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixPQUFPO1FBQ1AsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7Z0JBQzFDLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO29CQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDaEQ7YUFDRixDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUMvQixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjt3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QUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUMzRCxNQUFFLEVBQ0gsQ0FBQyxHQUFHLENBQUMsQ0FDTixDQUFDO2FBQ0g7O1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7b0NBQ25DLE9BQU87Z0JBQ2hCLGFBQU0sQ0FBQyxZQUFZLENBQ2pCO29CQUNFLHlCQUFrQixDQUFDLE1BQU07d0JBQ3ZCLEdBQUMsT0FBTyxJQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDOzRCQUN4QyxDQUFDOztnQkFDTCxDQUFDLENBQ0YsQ0FBQztZQUNKLENBQUM7WUFSRCxLQUFzQixVQUFhLEVBQWIsa0JBQUEsdUJBQWEsRUFBYiwyQkFBYSxFQUFiLElBQWE7Z0JBQTlCLElBQU0sT0FBTyxzQkFBQTt3QkFBUCxPQUFPO2FBUWpCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q09MT1IsIERFVEFJTCwgT1BBQ0lUWSwgU0laRSwgVU5JVF9DSEFOTkVMU30gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtnZXRTb3J0LCBwYXJzZU1hcmtHcm91cCwgcGF0aEdyb3VwaW5nRmllbGRzfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL21hcmsnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlVW5pdE1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcmsnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3BhcnNlTWFya0dyb3VwJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gUEFUSFxuICAgIGRlc2NyaWJlKCdNdWx0aS1zZXJpZXMgTGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJsaW5lXCIsIFwic3R5bGVcIjogXCJ0cmVuZFwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImF4aXNcIjoge1wiZm9ybWF0XCI6IFwiJVlcIn19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgYSBmYWNldCBkaXJlY3RpdmUgYW5kIGEgbmVzdGVkIG1hcmsgZ3JvdXAgdGhhdCB1c2VzIHRoZSBmYWNldGVkIGRhdGEuJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ3BhdGhncm91cCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtHcm91cC5mcm9tLCB7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIG5hbWU6ICdmYWNldGVkX3BhdGhfbWFpbicsXG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBncm91cGJ5OiBbJ3N5bWJvbCddXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3VibWFya0dyb3VwID0gbWFya0dyb3VwLm1hcmtzWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLm5hbWUsICdtYXJrcycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLnR5cGUsICdsaW5lJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3VibWFya0dyb3VwLnN0eWxlLCBbJ2xpbmUnLCAndHJlbmQnXSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAuZnJvbS5kYXRhLCAnZmFjZXRlZF9wYXRoX21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ3BhdGhncm91cCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtHcm91cC5mcm9tLCB7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIG5hbWU6ICdmYWNldGVkX3BhdGhfbWFpbicsXG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBncm91cGJ5OiBbJ3N5bWJvbCddXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3VibWFya0dyb3VwID0gbWFya0dyb3VwLm1hcmtzWzBdO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc3VibWFya0dyb3VwLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTaW5nbGUgTGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIG1hcmsgZ3JvdXAgd2l0aCBwcm9wZXIgZGF0YSBhbmQga2V5JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ21hcmtzJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAudHlwZSwgJ2xpbmUnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gTk9OLVBBVEhcbiAgICB9KTtcbiAgICBkZXNjcmliZSgnUG9pbnRzIHdpdGgga2V5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwia2V5XCI6IHtcImZpZWxkXCI6IFwia1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgbWFyayBncm91cCB3aXRoIHByb3BlciBkYXRhIGFuZCBrZXknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC50eXBlLCAnc3ltYm9sJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAua2V5LmZpZWxkLCAnaycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ0dlb3NoYXBlIHNob3VsZCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc0RlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLnRyYW5zZm9ybVswXS50eXBlLCBHRU9TSEFQRSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnQWdncmVnYXRlZCBCYXIgd2l0aCBhIGNvbG9yIHdpdGggYmlubmVkIHgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fT3RoZXJcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX1RvdGFsXyRcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgbWFpbiBzdGFja2VkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0uZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLnN0eWxlLCAnYmFyJyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRmFjZXRlZCBhZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGZhY2V0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG5cbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwuY2hpbGQgYXMgVW5pdE1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdjaGlsZF9tYWluJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdBZ2dyZWdhdGVkIGJhcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgbWFpbiBhZ2dyZWdhdGVkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0uZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRTb3J0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgb3JkZXIgZmllbGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvZHJpdmluZy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIm1pbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImdhc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9fSxcbiAgICAgICAgICBcIm9yZGVyXCI6IHtcImZpZWxkXCI6IFwieWVhclwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRTb3J0KG1vZGVsKSwge1xuICAgICAgICBmaWVsZDogWydkYXR1bVtcXFwieWVhclxcXCJdJ10sXG4gICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgeCBieSBkZWZhdWx0IGlmIHggaXMgdGhlIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJiaW5cIjoge1wibWF4Ymluc1wiOiAxMH0sXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiSU1EQl9SYXRpbmdcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJTb3VyY2VcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiY291bnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0U29ydChtb2RlbCksIHtcbiAgICAgICAgZmllbGQ6ICdkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfSU1EQl9SYXRpbmdcXFwiXScsXG4gICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3Qgb3JkZXIgYnkgYSBtaXNzaW5nIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJTb3VyY2VcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiY291bnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0U29ydChtb2RlbCksIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXRoR3JvdXBpbmdGaWVsZHMoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBmaWVsZHMgZm9yIHVuYWdncmVnYXRlIGRldGFpbCwgY29sb3IsIHNpemUsIG9wYWNpdHkgZmllbGREZWZzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbREVUQUlMLCBDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7W2NoYW5uZWxdOiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfX0pLFxuICAgICAgICAgIFsnYSddXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gYSBmaWVsZCBmb3Igc2l6ZSBvZiBhIHRyYWlsIG1hcmsuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgcGF0aEdyb3VwaW5nRmllbGRzKCd0cmFpbCcsIHtzaXplOiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfX0pLFxuICAgICAgICBbXVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBmaWVsZHMgZm9yIGFnZ3JlZ2F0ZSBkZXRhaWwsIGNvbG9yLCBzaXplLCBvcGFjaXR5IGZpZWxkRGVmcy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW0RFVEFJTCwgQ09MT1IsIFNJWkUsIE9QQUNJVFldKSB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgICAgcGF0aEdyb3VwaW5nRmllbGRzKCdsaW5lJywge1tjaGFubmVsXToge2FnZ3JlZ2F0ZTogJ21lYW4nLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgW10sXG4gICAgICAgICAgY2hhbm5lbFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29uZGl0aW9uIGRldGFpbCBmaWVsZHMgZm9yIGNvbG9yLCBzaXplLCBzaGFwZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbQ09MT1IsIFNJWkUsIE9QQUNJVFldKSB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgICAgcGF0aEdyb3VwaW5nRmllbGRzKCdsaW5lJywge1tjaGFubmVsXToge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAnc2VsJywgZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH19KSxcbiAgICAgICAgICBbJ2EnXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIGVycm9ycyBmb3IgYWxsIGNoYW5uZWxzJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFVOSVRfQ0hBTk5FTFMpIHtcbiAgICAgICAgYXNzZXJ0LmRvZXNOb3RUaHJvdyhcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7XG4gICAgICAgICAgICAgIFtjaGFubmVsXToge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==