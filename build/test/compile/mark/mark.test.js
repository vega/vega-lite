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
        it('should have no sort if order = {value: null}', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "value": null }
                }
            });
            chai_1.assert.equal(mark_1.getSort(model), undefined);
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
            var _a;
            for (var _i = 0, _b = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_a = {}, _a[channel] = { field: 'a', type: 'nominal' }, _a)), ['a']);
            }
        });
        it('should not return a field for size of a trail mark.', function () {
            chai_1.assert.deepEqual(mark_1.pathGroupingFields('trail', { size: { field: 'a', type: 'nominal' } }), []);
        });
        it('should not return fields for aggregate detail, color, size, opacity fieldDefs.', function () {
            var _a;
            for (var _i = 0, _b = [channel_1.DETAIL, channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_a = {}, _a[channel] = { aggregate: 'mean', field: 'a', type: 'nominal' }, _a)), [], channel);
            }
        });
        it('should return condition detail fields for color, size, shape', function () {
            var _a;
            for (var _i = 0, _b = [channel_1.COLOR, channel_1.SIZE, channel_1.OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                chai_1.assert.deepEqual(mark_1.pathGroupingFields('line', (_a = {}, _a[channel] = {
                    condition: { selection: 'sel', field: 'a', type: 'nominal' }
                }, _a)), ['a']);
            }
        });
        it('should not return errors for all channels', function () {
            var _loop_1 = function (channel) {
                chai_1.assert.doesNotThrow(function () {
                    var _a;
                    mark_1.pathGroupingFields('line', (_a = {},
                        _a[channel] = { field: 'a', type: 'nominal' },
                        _a));
                });
            };
            for (var _i = 0, UNIT_CHANNELS_1 = channel_1.UNIT_CHANNELS; _i < UNIT_CHANNELS_1.length; _i++) {
                var channel = UNIT_CHANNELS_1[_i];
                _loop_1(channel);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBaUY7QUFDakYsdURBQTJGO0FBRTNGLDBDQUEyQztBQUMzQyxtQ0FBMEg7QUFFMUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNmLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixPQUFPO1FBQ1AsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7Z0JBQzFDLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO29CQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDaEQ7YUFDRixDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUMvQixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjt3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QUFQLE9BQU87YUFRakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgREVUQUlMLCBPUEFDSVRZLCBTSVpFLCBVTklUX0NIQU5ORUxTfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2dldFNvcnQsIHBhcnNlTWFya0dyb3VwLCBwYXRoR3JvdXBpbmdGaWVsZHN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyayc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge0dFT1NIQVBFfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyaycsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VNYXJrR3JvdXAnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBQQVRIXG4gICAgZGVzY3JpYmUoJ011bHRpLXNlcmllcyBMaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJzdHlsZVwiOiBcInRyZW5kXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBhIGZhY2V0IGRpcmVjdGl2ZSBhbmQgYSBuZXN0ZWQgbWFyayBncm91cCB0aGF0IHVzZXMgdGhlIGZhY2V0ZWQgZGF0YS4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAncGF0aGdyb3VwJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya0dyb3VwLmZyb20sIHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgbmFtZTogJ2ZhY2V0ZWRfcGF0aF9tYWluJyxcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGdyb3VwYnk6IFsnc3ltYm9sJ11cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzdWJtYXJrR3JvdXAgPSBtYXJrR3JvdXAubWFya3NbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAubmFtZSwgJ21hcmtzJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAudHlwZSwgJ2xpbmUnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzdWJtYXJrR3JvdXAuc3R5bGUsIFsnbGluZScsICd0cmVuZCddKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN1Ym1hcmtHcm91cC5mcm9tLmRhdGEsICdmYWNldGVkX3BhdGhfbWFpbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAncGF0aGdyb3VwJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya0dyb3VwLmZyb20sIHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgbmFtZTogJ2ZhY2V0ZWRfcGF0aF9tYWluJyxcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGdyb3VwYnk6IFsnc3ltYm9sJ11cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzdWJtYXJrR3JvdXAgPSBtYXJrR3JvdXAubWFya3NbMF07XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzdWJtYXJrR3JvdXAudHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1NpbmdsZSBMaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJheGlzXCI6IHtcImZvcm1hdFwiOiBcIiVZXCJ9fSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgbWFyayBncm91cCB3aXRoIHByb3BlciBkYXRhIGFuZCBrZXknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAnbWFya3MnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC50eXBlLCAnbGluZScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOT04tUEFUSFxuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdQb2ludHMgd2l0aCBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJheGlzXCI6IHtcImZvcm1hdFwiOiBcIiVZXCJ9fSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJrZXlcIjoge1wiZmllbGRcIjogXCJrXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBtYXJrIGdyb3VwIHdpdGggcHJvcGVyIGRhdGEgYW5kIGtleScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLnR5cGUsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5rZXkuZmllbGQsICdrJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAuZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnR2Vvc2hhcGUgc2hvdWxkIGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzRGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0udHJhbnNmb3JtWzBdLnR5cGUsIEdFT1NIQVBFKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdBZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJFZmZlY3RfX0Ftb3VudF9vZl9kYW1hZ2VcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIHN0YWNrZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0uc3R5bGUsICdiYXInKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdGYWNldGVkIGFnZ3JlZ2F0ZWQgQmFyIHdpdGggYSBjb2xvciB3aXRoIGJpbm5lZCB4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX1RvdGFsXyRcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJFZmZlY3RfX0Ftb3VudF9vZl9kYW1hZ2VcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgZmFjZXRlZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ2NoaWxkX21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuXG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsLmNoaWxkIGFzIFVuaXRNb2RlbCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0FnZ3JlZ2F0ZWQgYmFyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIGFnZ3JlZ2F0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFNvcnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcmRlciBieSBvcmRlciBmaWVsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9kcml2aW5nLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwibWlsZXNcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImdhc1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfX0sXG4gICAgICAgICAgXCJvcmRlclwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdldFNvcnQobW9kZWwpLCB7XG4gICAgICAgIGZpZWxkOiBbJ2RhdHVtW1xcXCJ5ZWFyXFxcIl0nXSxcbiAgICAgICAgb3JkZXI6IFsnYXNjZW5kaW5nJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG5vIHNvcnQgaWYgb3JkZXIgPSB7dmFsdWU6IG51bGx9JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2RyaXZpbmcuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJtaWxlc1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiZ2FzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9fSxcbiAgICAgICAgICBcIm9yZGVyXCI6IHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGdldFNvcnQobW9kZWwpLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvcmRlciBieSB4IGJ5IGRlZmF1bHQgaWYgeCBpcyB0aGUgZGltZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImJpblwiOiB7XCJtYXhiaW5zXCI6IDEwfSxcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIlNvdXJjZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRTb3J0KG1vZGVsKSwge1xuICAgICAgICBmaWVsZDogJ2RhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9JTURCX1JhdGluZ1xcXCJdJyxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBvcmRlciBieSBhIG1pc3NpbmcgZGltZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIlNvdXJjZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRTb3J0KG1vZGVsKSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhdGhHcm91cGluZ0ZpZWxkcygpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpZWxkcyBmb3IgdW5hZ2dyZWdhdGUgZGV0YWlsLCBjb2xvciwgc2l6ZSwgb3BhY2l0eSBmaWVsZERlZnMuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtERVRBSUwsIENPTE9SLCBTSVpFLCBPUEFDSVRZXSkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcygnbGluZScsIHtbY2hhbm5lbF06IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgWydhJ11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBhIGZpZWxkIGZvciBzaXplIG9mIGEgdHJhaWwgbWFyay4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ3RyYWlsJywge3NpemU6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgIFtdXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIGZpZWxkcyBmb3IgYWdncmVnYXRlIGRldGFpbCwgY29sb3IsIHNpemUsIG9wYWNpdHkgZmllbGREZWZzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbREVUQUlMLCBDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7W2NoYW5uZWxdOiB7YWdncmVnYXRlOiAnbWVhbicsIGZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ319KSxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICBjaGFubmVsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb25kaXRpb24gZGV0YWlsIGZpZWxkcyBmb3IgY29sb3IsIHNpemUsIHNoYXBlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7W2NoYW5uZWxdOiB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICdzZWwnLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfX0pLFxuICAgICAgICAgIFsnYSddXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gZXJyb3JzIGZvciBhbGwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgVU5JVF9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcygnbGluZScsIHtcbiAgICAgICAgICAgICAgW2NoYW5uZWxdOiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19