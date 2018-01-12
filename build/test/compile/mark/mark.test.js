"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var mark_1 = require("../../../src/compile/mark/mark");
var util_1 = require("../../util");
describe('Mark', function () {
    describe('parseMarkGroup', function () {
        // PATH
        describe('Multi-series Line', function () {
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": { "type": "line", "style": "trend" },
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "symbol", "type": "nominal" }
                    }
                });
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
        });
        describe('Single Line', function () {
            it('should have a facet directive and a nested mark group', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'marks');
                chai_1.assert.equal(markGroup.type, 'line');
                chai_1.assert.equal(markGroup.from.data, 'main');
            });
        });
        // NON-PATH
        describe('Aggregated Bar with a color with binned x', function () {
            it(' should use main stacked data source', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
                chai_1.assert.equal(markGroup[0].style, 'bar');
            });
        });
        describe('Faceted aggregated Bar with a color with binned x', function () {
            it('should use faceted data source', function () {
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
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = mark_1.parseMarkGroup(model.child);
                chai_1.assert.equal(markGroup[0].from.data, 'child_main');
            });
        });
        describe('Aggregated bar', function () {
            it('should use main aggregated data source', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
            });
        });
        describe('Bar with tooltip', function () {
            it('should pass tooltip value to encoding', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "tooltip": { "value": "foo" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].encode.update.tooltip.value, 'foo');
            });
        });
    });
    describe('getPathSort', function () {
        describe('compileUnit', function () {
            it('should order by order field for line with order (connected scatterplot)', function () {
                var model = util_1.parseUnitModel({
                    "data": { "url": "data/driving.json" },
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                        "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                        "order": { "field": "year", "type": "temporal" }
                    }
                });
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
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
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
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
                chai_1.assert.deepEqual(mark_1.getPathSort(model), undefined);
            });
        });
    });
    describe('pathGroupingFields', function () {
        it('should return fields for unaggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields((_b = {}, _b[channel] = { field: 'a', type: 'nominal' }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return fields for unaggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields((_b = {}, _b[channel] = { aggregate: 'mean', field: 'a', type: 'nominal' }, _b)), []);
            }
            var _b;
        });
        it('should return condition detail fields for color, size, shape', function () {
            for (var _i = 0, _a = [channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields((_b = {}, _b[channel] = {
                    condition: { selection: 'sel', field: 'a', type: 'nominal' }
                }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return errors for all channels', function () {
            var _loop_1 = function (channel) {
                chai_1.assert.doesNotThrow(function () {
                    mark_1.pathGroupingFields((_a = {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBaUY7QUFDakYsdURBQStGO0FBRS9GLG1DQUEwSDtBQUUxSCxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLE9BQU87UUFDUCxRQUFRLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsRUFBRSxDQUFDLG1GQUFtRixFQUFFO2dCQUN0RixJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztvQkFDakQsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDO29CQUMxQyxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsRUFBQzt3QkFDcEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUMvQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7cUJBQ2hEO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLFNBQVMsR0FBRyxxQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzFDLGFBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtvQkFDL0IsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxtQkFBbUI7d0JBQ3pCLElBQUksRUFBRSxNQUFNO3dCQUNaLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztxQkFDcEI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekMsYUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxhQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtnQkFDMUQsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7b0JBQ2pELE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO3dCQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7cUJBQ2hEO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLFNBQVMsR0FBRyxxQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckMsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsV0FBVztRQUNYLFFBQVEsQ0FBQywyQ0FBMkMsRUFBRTtZQUNwRCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7Z0JBQ3pDLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO29CQUNqRCxNQUFNLEVBQUUsS0FBSztvQkFDYixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7d0JBQ3pFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFDO3dCQUNwRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBQztxQkFDbEU7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzdDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG1EQUFtRCxFQUFFO1lBQzVELEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtnQkFDbkMsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztvQkFDNUIsS0FBSyxFQUFFO3dCQUNMLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztxQkFDbkM7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLE1BQU0sRUFBRSxLQUFLO3dCQUNiLFVBQVUsRUFBRTs0QkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQzs0QkFDekUsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUM7NEJBQ3BFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFDO3lCQUNsRTtxQkFDRjtpQkFDRixDQUFDLENBQUM7Z0JBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNuQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXhCLElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLEtBQWtCLENBQUMsQ0FBQztnQkFDM0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7b0JBQ2pELE1BQU0sRUFBRSxLQUFLO29CQUNiLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQzt3QkFDekUsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUM7cUJBQ3JFO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLFNBQVMsR0FBRyxxQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO2dCQUMxQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztvQkFDakQsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFDO3dCQUN6RSxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBQzt3QkFDcEUsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQztxQkFDNUI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7WUFDdEIsRUFBRSxDQUFDLHlFQUF5RSxFQUFFO2dCQUM1RSxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO29CQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUM7b0JBQ3BDLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFDO3dCQUN4RSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFDO3dCQUN0RSxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7cUJBQzlDO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxhQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ25DLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUMxQixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3JCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO2dCQUN2RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztvQkFDcEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO29CQUNuQyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFOzRCQUNILEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUM7NEJBQ3RCLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsU0FBUzt5QkFDbEI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxPQUFPOzRCQUNwQixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILGFBQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbkMsS0FBSyxFQUFFLHVDQUF1QztvQkFDOUMsS0FBSyxFQUFFLFlBQVk7aUJBQ3BCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1QyxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztvQkFDcEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO29CQUNuQyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsT0FBTyxFQUFFOzRCQUNQLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsU0FBUzt5QkFDbEI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxPQUFPOzRCQUNwQixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILGFBQU0sQ0FBQyxTQUFTLENBQUMsa0JBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNsRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsRUFBRSxDQUFDLDhFQUE4RSxFQUFFO1lBQ2pGLEdBQUcsQ0FBQyxDQUFrQixVQUE4QixFQUE5QixNQUFDLGdCQUFNLEVBQUUsZUFBSyxFQUFFLGNBQUksRUFBRSxpQkFBTyxDQUFDLEVBQTlCLGNBQThCLEVBQTlCLElBQThCO2dCQUEvQyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsYUFBTSxDQUFDLFNBQVMsQ0FDZCx5QkFBa0IsV0FBRSxHQUFDLE9BQU8sSUFBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFFLEVBQzlELENBQUMsR0FBRyxDQUFDLENBQ04sQ0FBQzthQUNIOztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtGQUFrRixFQUFFO1lBQ3JGLEdBQUcsQ0FBQyxDQUFrQixVQUE4QixFQUE5QixNQUFDLGdCQUFNLEVBQUUsZUFBSyxFQUFFLGNBQUksRUFBRSxpQkFBTyxDQUFDLEVBQTlCLGNBQThCLEVBQTlCLElBQThCO2dCQUEvQyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsYUFBTSxDQUFDLFNBQVMsQ0FDZCx5QkFBa0IsV0FBRSxHQUFDLE9BQU8sSUFBRyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQUUsRUFDakYsRUFBRSxDQUNILENBQUM7YUFDSDs7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtZQUNqRSxHQUFHLENBQUMsQ0FBa0IsVUFBc0IsRUFBdEIsTUFBQyxlQUFLLEVBQUUsY0FBSSxFQUFFLGlCQUFPLENBQUMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7Z0JBQXZDLElBQU0sT0FBTyxTQUFBO2dCQUNoQixhQUFNLENBQUMsU0FBUyxDQUNkLHlCQUFrQixXQUFFLEdBQUMsT0FBTyxJQUFHO29CQUM3QixTQUFTLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDM0QsTUFBRSxFQUNILENBQUMsR0FBRyxDQUFDLENBQ04sQ0FBQzthQUNIOztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO29DQUNuQyxPQUFPO2dCQUNoQixhQUFNLENBQUMsWUFBWSxDQUNqQjtvQkFDRSx5QkFBa0I7d0JBQ2hCLEdBQUMsT0FBTyxJQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDOzRCQUN4QyxDQUFDOztnQkFDTCxDQUFDLENBQ0YsQ0FBQztZQUNKLENBQUM7WUFSRCxHQUFHLENBQUMsQ0FBa0IsVUFBYSxFQUFiLGtCQUFBLHVCQUFhLEVBQWIsMkJBQWEsRUFBYixJQUFhO2dCQUE5QixJQUFNLE9BQU8sc0JBQUE7d0JBQVAsT0FBTzthQVFqQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NPTE9SLCBERVRBSUwsIE9QQUNJVFksIFNJWkUsIFVOSVRfQ0hBTk5FTFN9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7Z2V0UGF0aFNvcnQsIHBhcnNlTWFya0dyb3VwLCBwYXRoR3JvdXBpbmdGaWVsZHN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyayc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyaycsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VNYXJrR3JvdXAnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBQQVRIXG4gICAgZGVzY3JpYmUoJ011bHRpLXNlcmllcyBMaW5lJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGEgZmFjZXQgZGlyZWN0aXZlIGFuZCBhIG5lc3RlZCBtYXJrIGdyb3VwIHRoYXQgdXNlcyB0aGUgZmFjZXRlZCBkYXRhLicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInN0eWxlXCI6IFwidHJlbmRcIn0sXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ3BhdGhncm91cCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtHcm91cC5mcm9tLCB7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIG5hbWU6ICdmYWNldGVkX3BhdGhfbWFpbicsXG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBncm91cGJ5OiBbJ3N5bWJvbCddXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3VibWFya0dyb3VwID0gbWFya0dyb3VwLm1hcmtzWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLm5hbWUsICdtYXJrcycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLnR5cGUsICdsaW5lJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3VibWFya0dyb3VwLnN0eWxlLCBbJ2xpbmUnLCAndHJlbmQnXSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAuZnJvbS5kYXRhLCAnZmFjZXRlZF9wYXRoX21haW4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1NpbmdsZSBMaW5lJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGEgZmFjZXQgZGlyZWN0aXZlIGFuZCBhIG5lc3RlZCBtYXJrIGdyb3VwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImF4aXNcIjoge1wiZm9ybWF0XCI6IFwiJVlcIn19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLm5hbWUsICdtYXJrcycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLnR5cGUsICdsaW5lJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAuZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBOT04tUEFUSFxuICAgIGRlc2NyaWJlKCdBZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGl0KCcgc2hvdWxkIHVzZSBtYWluIHN0YWNrZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5zdHlsZSwgJ2JhcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRmFjZXRlZCBhZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGZhY2V0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ2NoaWxkX21haW4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0FnZ3JlZ2F0ZWQgYmFyJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgbWFpbiBhZ2dyZWdhdGVkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fT3RoZXJcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdCYXIgd2l0aCB0b29sdGlwJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHRvb2x0aXAgdmFsdWUgdG8gZW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJ0b29sdGlwXCI6IHtcInZhbHVlXCI6IFwiZm9vXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmVuY29kZS51cGRhdGUudG9vbHRpcC52YWx1ZSwgJ2ZvbycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRQYXRoU29ydCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgb3JkZXIgZmllbGQgZm9yIGxpbmUgd2l0aCBvcmRlciAoY29ubmVjdGVkIHNjYXR0ZXJwbG90KScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvZHJpdmluZy5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIm1pbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiZ2FzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgICAgXCJvcmRlclwiOiB7XCJmaWVsZFwiOiBcInllYXJcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0UGF0aFNvcnQobW9kZWwpLCB7XG4gICAgICAgICAgZmllbGQ6IFsnZGF0dW1bXFxcInllYXJcXFwiXSddLFxuICAgICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgeCBieSBkZWZhdWx0IGlmIHggaXMgdGhlIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJiaW5cIjoge1wibWF4Ymluc1wiOiAxMH0sXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiU291cmNlXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiY291bnRcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGdldFBhdGhTb3J0KG1vZGVsKSwge1xuICAgICAgICAgIGZpZWxkOiAnZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX0lNREJfUmF0aW5nXFxcIl0nLFxuICAgICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgb3JkZXIgYnkgYSBtaXNzaW5nIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJTb3VyY2VcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0UGF0aFNvcnQobW9kZWwpLCB1bmRlZmluZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXRoR3JvdXBpbmdGaWVsZHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmllbGRzIGZvciB1bmFnZ3JlZ2F0ZSBkZXRhaWwsIGNvbG9yLCBzaXplLCBvcGFjaXR5IGZpZWxkRGVmcy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW0RFVEFJTCwgQ09MT1IsIFNJWkUsIE9QQUNJVFldKSB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgICAgcGF0aEdyb3VwaW5nRmllbGRzKHtbY2hhbm5lbF06IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgWydhJ11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBmaWVsZHMgZm9yIHVuYWdncmVnYXRlIGRldGFpbCwgY29sb3IsIHNpemUsIG9wYWNpdHkgZmllbGREZWZzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbREVUQUlMLCBDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoe1tjaGFubmVsXToge2FnZ3JlZ2F0ZTogJ21lYW4nLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgW11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvbmRpdGlvbiBkZXRhaWwgZmllbGRzIGZvciBjb2xvciwgc2l6ZSwgc2hhcGUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW0NPTE9SLCBTSVpFLCBPUEFDSVRZXSkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcyh7W2NoYW5uZWxdOiB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICdzZWwnLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfX0pLFxuICAgICAgICAgIFsnYSddXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gZXJyb3JzIGZvciBhbGwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgVU5JVF9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcyh7XG4gICAgICAgICAgICAgIFtjaGFubmVsXToge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==