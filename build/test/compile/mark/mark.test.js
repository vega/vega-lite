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
            it('should not have post encoding transform', function () {
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
                chai_1.assert.isUndefined(submarkGroup.transform);
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
            it('should not have post encoding transform', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
            });
        });
        // NON-PATH
        describe('Geoshape', function () {
            it('should have post encoding transform', function () {
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
        });
        describe('Aggregated Bar with a color with binned x', function () {
            it('should use main stacked data source', function () {
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
            it('should not have post encoding transform', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
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
            it('should not have post encoding transform', function () {
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
                chai_1.assert.isUndefined(markGroup[0].transform);
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
            it('should not have post encoding transform', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.isUndefined(markGroup[0].transform);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBaUY7QUFDakYsdURBQStGO0FBRS9GLDBDQUEyQztBQUMzQyxtQ0FBMEg7QUFFMUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNmLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixPQUFPO1FBQ1AsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLEVBQUUsQ0FBQyxtRkFBbUYsRUFBRTtnQkFDdEYsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7b0JBQ2pELE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQztvQkFDMUMsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLEVBQUM7d0JBQ3BFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQzt3QkFDL0MsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3FCQUNoRDtpQkFDRixDQUFDLENBQUM7Z0JBQ0gsSUFBTSxTQUFTLEdBQUcscUJBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMxQyxhQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7b0JBQy9CLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsbUJBQW1C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QUFDLE9BQU8sSUFBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzs0QkFDeEMsQ0FBQzs7Z0JBQ0wsQ0FBQyxDQUNGLENBQUM7WUFDSixDQUFDO1lBUkQsR0FBRyxDQUFDLENBQWtCLFVBQWEsRUFBYixrQkFBQSx1QkFBYSxFQUFiLDJCQUFhLEVBQWIsSUFBYTtnQkFBOUIsSUFBTSxPQUFPLHNCQUFBO3dCQUFQLE9BQU87YUFRakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgREVUQUlMLCBPUEFDSVRZLCBTSVpFLCBVTklUX0NIQU5ORUxTfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2dldFBhdGhTb3J0LCBwYXJzZU1hcmtHcm91cCwgcGF0aEdyb3VwaW5nRmllbGRzfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL21hcmsnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtHRU9TSEFQRX0gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlVW5pdE1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcmsnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3BhcnNlTWFya0dyb3VwJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gUEFUSFxuICAgIGRlc2NyaWJlKCdNdWx0aS1zZXJpZXMgTGluZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBhIGZhY2V0IGRpcmVjdGl2ZSBhbmQgYSBuZXN0ZWQgbWFyayBncm91cCB0aGF0IHVzZXMgdGhlIGZhY2V0ZWQgZGF0YS4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJzdHlsZVwiOiBcInRyZW5kXCJ9LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImF4aXNcIjoge1wiZm9ybWF0XCI6IFwiJVlcIn19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLm5hbWUsICdwYXRoZ3JvdXAnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXJrR3JvdXAuZnJvbSwge1xuICAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICBuYW1lOiAnZmFjZXRlZF9wYXRoX21haW4nLFxuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZ3JvdXBieTogWydzeW1ib2wnXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHN1Ym1hcmtHcm91cCA9IG1hcmtHcm91cC5tYXJrc1swXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN1Ym1hcmtHcm91cC5uYW1lLCAnbWFya3MnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN1Ym1hcmtHcm91cC50eXBlLCAnbGluZScpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHN1Ym1hcmtHcm91cC5zdHlsZSwgWydsaW5lJywgJ3RyZW5kJ10pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLmZyb20uZGF0YSwgJ2ZhY2V0ZWRfcGF0aF9tYWluJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInN0eWxlXCI6IFwidHJlbmRcIn0sXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ3BhdGhncm91cCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtHcm91cC5mcm9tLCB7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIG5hbWU6ICdmYWNldGVkX3BhdGhfbWFpbicsXG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBncm91cGJ5OiBbJ3N5bWJvbCddXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3VibWFya0dyb3VwID0gbWFya0dyb3VwLm1hcmtzWzBdO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc3VibWFya0dyb3VwLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTaW5nbGUgTGluZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBhIGZhY2V0IGRpcmVjdGl2ZSBhbmQgYSBuZXN0ZWQgbWFyayBncm91cCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJheGlzXCI6IHtcImZvcm1hdFwiOiBcIiVZXCJ9fSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAnbWFya3MnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC50eXBlLCAnbGluZScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImF4aXNcIjoge1wiZm9ybWF0XCI6IFwiJVlcIn19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIE5PTi1QQVRIXG4gICAgZGVzY3JpYmUoJ0dlb3NoYXBlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzRGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS50cmFuc2Zvcm1bMF0udHlwZSwgR0VPU0hBUEUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnQWdncmVnYXRlZCBCYXIgd2l0aCBhIGNvbG9yIHdpdGggYmlubmVkIHgnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIHN0YWNrZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5zdHlsZSwgJ2JhcicpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fT3RoZXJcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcIkVmZmVjdF9fQW1vdW50X29mX2RhbWFnZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRmFjZXRlZCBhZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGZhY2V0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ2NoaWxkX21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX1RvdGFsXyRcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcIkVmZmVjdF9fQW1vdW50X29mX2RhbWFnZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG5cbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwuY2hpbGQgYXMgVW5pdE1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnQWdncmVnYXRlZCBiYXInLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIGFnZ3JlZ2F0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fT3RoZXJcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRQYXRoU29ydCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgb3JkZXIgZmllbGQgZm9yIGxpbmUgd2l0aCBvcmRlciAoY29ubmVjdGVkIHNjYXR0ZXJwbG90KScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvZHJpdmluZy5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIm1pbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiZ2FzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgICAgXCJvcmRlclwiOiB7XCJmaWVsZFwiOiBcInllYXJcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0UGF0aFNvcnQobW9kZWwpLCB7XG4gICAgICAgICAgZmllbGQ6IFsnZGF0dW1bXFxcInllYXJcXFwiXSddLFxuICAgICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgb3JkZXIgYnkgeCBieSBkZWZhdWx0IGlmIHggaXMgdGhlIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJiaW5cIjoge1wibWF4Ymluc1wiOiAxMH0sXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiU291cmNlXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcIm5vbWluYWxcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiY291bnRcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGdldFBhdGhTb3J0KG1vZGVsKSwge1xuICAgICAgICAgIGZpZWxkOiAnZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX0lNREJfUmF0aW5nXFxcIl0nLFxuICAgICAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgb3JkZXIgYnkgYSBtaXNzaW5nIGRpbWVuc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJTb3VyY2VcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ2V0UGF0aFNvcnQobW9kZWwpLCB1bmRlZmluZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXRoR3JvdXBpbmdGaWVsZHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmllbGRzIGZvciB1bmFnZ3JlZ2F0ZSBkZXRhaWwsIGNvbG9yLCBzaXplLCBvcGFjaXR5IGZpZWxkRGVmcy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW0RFVEFJTCwgQ09MT1IsIFNJWkUsIE9QQUNJVFldKSB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgICAgcGF0aEdyb3VwaW5nRmllbGRzKHtbY2hhbm5lbF06IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgWydhJ11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBmaWVsZHMgZm9yIHVuYWdncmVnYXRlIGRldGFpbCwgY29sb3IsIHNpemUsIG9wYWNpdHkgZmllbGREZWZzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbREVUQUlMLCBDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoe1tjaGFubmVsXToge2FnZ3JlZ2F0ZTogJ21lYW4nLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgW11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvbmRpdGlvbiBkZXRhaWwgZmllbGRzIGZvciBjb2xvciwgc2l6ZSwgc2hhcGUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgW0NPTE9SLCBTSVpFLCBPUEFDSVRZXSkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcyh7W2NoYW5uZWxdOiB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICdzZWwnLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfX0pLFxuICAgICAgICAgIFsnYSddXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gZXJyb3JzIGZvciBhbGwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgVU5JVF9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcyh7XG4gICAgICAgICAgICAgIFtjaGFubmVsXToge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==