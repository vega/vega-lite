/* tslint:disable:quotemark */
import { assert } from 'chai';
import { COLOR, DETAIL, OPACITY, SIZE, UNIT_CHANNELS } from '../../../src/channel';
import { getSort, parseMarkGroup, pathGroupingFields } from '../../../src/compile/mark/mark';
import { GEOSHAPE } from '../../../src/mark';
import { parseFacetModel, parseUnitModel, parseUnitModelWithScale, parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark', function () {
    describe('parseMarkGroup', function () {
        // PATH
        describe('Multi-series Line', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": { "type": "line", "style": "trend" },
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" },
                    "color": { "field": "symbol", "type": "nominal" }
                }
            });
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var markGroup = parseMarkGroup(model)[0];
                assert.equal(markGroup.name, 'pathgroup');
                assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                assert.equal(submarkGroup.name, 'marks');
                assert.equal(submarkGroup.type, 'line');
                assert.deepEqual(submarkGroup.style, ['line', 'trend']);
                assert.equal(submarkGroup.from.data, 'faceted_path_main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = parseMarkGroup(model)[0];
                assert.equal(markGroup.name, 'pathgroup');
                assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                assert.isUndefined(submarkGroup.transform);
            });
        });
        describe('Single Line', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "line",
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" }
                }
            });
            it('should have mark group with proper data and key', function () {
                var markGroup = parseMarkGroup(model)[0];
                assert.equal(markGroup.name, 'marks');
                assert.equal(markGroup.type, 'line');
                assert.equal(markGroup.from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = parseMarkGroup(model);
                assert.isUndefined(markGroup[0].transform);
            });
            // NON-PATH
        });
        describe('Points with key', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "point",
                "encoding": {
                    "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                    "y": { "field": "price", "type": "quantitative" },
                    "key": { "field": "k", "type": "quantitative" }
                }
            });
            it('should have mark group with proper data and key', function () {
                var markGroup = parseMarkGroup(model)[0];
                assert.equal(markGroup.type, 'symbol');
                assert.equal(markGroup.key.field, 'k');
                assert.equal(markGroup.from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = parseMarkGroup(model);
                assert.isUndefined(markGroup[0].transform);
            });
        });
        it('Geoshape should have post encoding transform', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            var markGroup = parseMarkGroup(model);
            assert.isDefined(markGroup[0].transform);
            assert.equal(markGroup[0].transform[0].type, GEOSHAPE);
        });
        describe('Aggregated Bar with a color with binned x', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                    "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                    "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                }
            });
            it('should use main stacked data source', function () {
                var markGroup = parseMarkGroup(model);
                assert.equal(markGroup[0].from.data, 'main');
                assert.equal(markGroup[0].style, 'bar');
            });
            it('should not have post encoding transform', function () {
                var markGroup = parseMarkGroup(model);
                assert.isUndefined(markGroup[0].transform);
            });
        });
        describe('Faceted aggregated Bar with a color with binned x', function () {
            var model = parseFacetModel({
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
                var markGroup = parseMarkGroup(model.child);
                assert.equal(markGroup[0].from.data, 'child_main');
            });
            it('should not have post encoding transform', function () {
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = parseMarkGroup(model.child);
                assert.isUndefined(markGroup[0].transform);
            });
        });
        describe('Aggregated bar', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                    "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                }
            });
            it('should use main aggregated data source', function () {
                var markGroup = parseMarkGroup(model);
                assert.equal(markGroup[0].from.data, 'main');
            });
            it('should not have post encoding transform', function () {
                var markGroup = parseMarkGroup(model);
                assert.isUndefined(markGroup[0].transform);
            });
        });
    });
    describe('getSort', function () {
        it('should order by order field', function () {
            var model = parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "field": "year", "type": "temporal" }
                }
            });
            assert.deepEqual(getSort(model), {
                field: ['datum[\"year\"]'],
                order: ['ascending']
            });
        });
        it('should have no sort if order = {value: null}', function () {
            var model = parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "value": null }
                }
            });
            assert.equal(getSort(model), undefined);
        });
        it('should order by x by default if x is the dimension', function () {
            var model = parseUnitModelWithScale({
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
            assert.deepEqual(getSort(model), {
                field: 'datum[\"bin_maxbins_10_IMDB_Rating\"]',
                order: 'descending'
            });
        });
        it('should not order by a missing dimension', function () {
            var model = parseUnitModelWithScale({
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
            assert.deepEqual(getSort(model), undefined);
        });
    });
    describe('pathGroupingFields()', function () {
        it('should return fields for unaggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [DETAIL, COLOR, SIZE, OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                assert.deepEqual(pathGroupingFields('line', (_b = {}, _b[channel] = { field: 'a', type: 'nominal' }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return a field for size of a trail mark.', function () {
            assert.deepEqual(pathGroupingFields('trail', { size: { field: 'a', type: 'nominal' } }), []);
        });
        it('should not return fields for aggregate detail, color, size, opacity fieldDefs.', function () {
            for (var _i = 0, _a = [DETAIL, COLOR, SIZE, OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                assert.deepEqual(pathGroupingFields('line', (_b = {}, _b[channel] = { aggregate: 'mean', field: 'a', type: 'nominal' }, _b)), [], channel);
            }
            var _b;
        });
        it('should return condition detail fields for color, size, shape', function () {
            for (var _i = 0, _a = [COLOR, SIZE, OPACITY]; _i < _a.length; _i++) {
                var channel = _a[_i];
                assert.deepEqual(pathGroupingFields('line', (_b = {}, _b[channel] = {
                    condition: { selection: 'sel', field: 'a', type: 'nominal' }
                }, _b)), ['a']);
            }
            var _b;
        });
        it('should not return errors for all channels', function () {
            var _loop_1 = function (channel) {
                assert.doesNotThrow(function () {
                    pathGroupingFields('line', (_a = {},
                        _a[channel] = { field: 'a', type: 'nominal' },
                        _a));
                    var _a;
                });
            };
            for (var _i = 0, UNIT_CHANNELS_1 = UNIT_CHANNELS; _i < UNIT_CHANNELS_1.length; _i++) {
                var channel = UNIT_CHANNELS_1[_i];
                _loop_1(channel);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDakYsT0FBTyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUUzRixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDM0MsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsdUJBQXVCLEVBQUUsb0NBQW9DLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtJQUNmLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixPQUFPO1FBQ1AsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQU0sS0FBSyxHQUFHLG9DQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7Z0JBQzFDLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO29CQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDaEQ7YUFDRixDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7b0JBQy9CLEtBQUssRUFBRTt3QkFDTCxJQUFJLEVBQUUsbUJBQW1CO3dCQUN6QixJQUFJLEVBQUUsTUFBTTt3QkFDWixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7cUJBQ3BCO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxJQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDNUMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRTtvQkFDL0IsS0FBSyxFQUFFO3dCQUNMLElBQUksRUFBRSxtQkFBbUI7d0JBQ3pCLElBQUksRUFBRSxNQUFNO3dCQUNaLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztxQkFDcEI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQU0sS0FBSyxHQUFHLG9DQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsRUFBQztvQkFDcEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUNoRDthQUNGLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtnQkFDcEQsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDNUMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztZQUVILFdBQVc7UUFDYixDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLEVBQUM7b0JBQ3BFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDL0MsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtnQkFDcEQsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7Z0JBQzVDLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLFlBQVksRUFBRTtvQkFDWixNQUFNLEVBQUUsV0FBVztpQkFDcEI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUUsVUFBVTt3QkFDbEIsU0FBUyxFQUFFLFFBQVE7cUJBQ3BCO2lCQUNGO2dCQUNELFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsMkNBQTJDLEVBQUU7WUFDcEQsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBQztvQkFDekUsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUM7b0JBQ3BFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFDO2lCQUNsRTthQUNGLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7Z0JBQzVDLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxtREFBbUQsRUFBRTtZQUM1RCxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsS0FBSztvQkFDYixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7d0JBQ3pFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFDO3dCQUNwRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBQztxQkFDbEU7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUV4QixJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQWtCLENBQUMsQ0FBQztnQkFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDNUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNuQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXhCLElBQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBa0IsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQU0sS0FBSyxHQUFHLG9DQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUM7b0JBQ3pFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFDO2lCQUNyRTthQUNGLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDM0MsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1QyxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDbEIsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFDO2dCQUNwQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDekUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDdkUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDO2lCQUMvQzthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMvQixLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDMUIsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDO2FBQ3JCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1lBQ2pELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFDO2dCQUNwQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDekUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDdkUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQztpQkFDekI7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztnQkFDcEMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFO3dCQUNILEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUM7d0JBQ3RCLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixNQUFNLEVBQUUsY0FBYztxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixNQUFNLEVBQUUsU0FBUztxQkFDbEI7b0JBQ0QsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxPQUFPO3dCQUNwQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDL0IsS0FBSyxFQUFFLHVDQUF1QztnQkFDOUMsS0FBSyxFQUFFLFlBQVk7YUFDcEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsSUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUM7Z0JBQ3BDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLE9BQU8sRUFBRTt3QkFDUCxPQUFPLEVBQUUsUUFBUTt3QkFDakIsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNELEdBQUcsRUFBRTt3QkFDSCxXQUFXLEVBQUUsT0FBTzt3QkFDcEIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsOEVBQThFLEVBQUU7WUFDakYsS0FBc0IsVUFBOEIsRUFBOUIsTUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFBOUIsY0FBOEIsRUFBOUIsSUFBOEI7Z0JBQS9DLElBQU0sT0FBTyxTQUFBO2dCQUNoQixNQUFNLENBQUMsU0FBUyxDQUNkLGtCQUFrQixDQUFDLE1BQU0sWUFBRyxHQUFDLE9BQU8sSUFBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFFLEVBQ3RFLENBQUMsR0FBRyxDQUFDLENBQ04sQ0FBQzthQUNIOztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxTQUFTLENBQ2Qsa0JBQWtCLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLEVBQUMsQ0FBQyxFQUNsRSxFQUFFLENBQ0gsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdGQUFnRixFQUFFO1lBQ25GLEtBQXNCLFVBQThCLEVBQTlCLE1BQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQTlCLGNBQThCLEVBQTlCLElBQThCO2dCQUEvQyxJQUFNLE9BQU8sU0FBQTtnQkFDaEIsTUFBTSxDQUFDLFNBQVMsQ0FDZCxrQkFBa0IsQ0FBQyxNQUFNLFlBQUcsR0FBQyxPQUFPLElBQUcsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFFLEVBQ3pGLEVBQUUsRUFDRixPQUFPLENBQ1IsQ0FBQzthQUNIOztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO1lBQ2pFLEtBQXNCLFVBQXNCLEVBQXRCLE1BQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7Z0JBQXZDLElBQU0sT0FBTyxTQUFBO2dCQUNoQixNQUFNLENBQUMsU0FBUyxDQUNkLGtCQUFrQixDQUFDLE1BQU0sWUFBRyxHQUFDLE9BQU8sSUFBRztvQkFDckMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQzNELE1BQUUsRUFDSCxDQUFDLEdBQUcsQ0FBQyxDQUNOLENBQUM7YUFDSDs7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtvQ0FDbkMsT0FBTztnQkFDaEIsTUFBTSxDQUFDLFlBQVksQ0FDakI7b0JBQ0Usa0JBQWtCLENBQUMsTUFBTTt3QkFDdkIsR0FBQyxPQUFPLElBQUcsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7NEJBQ3hDLENBQUM7O2dCQUNMLENBQUMsQ0FDRixDQUFDO1lBQ0osQ0FBQztZQVJELEtBQXNCLFVBQWEsRUFBYiwrQkFBYSxFQUFiLDJCQUFhLEVBQWIsSUFBYTtnQkFBOUIsSUFBTSxPQUFPLHNCQUFBO3dCQUFQLE9BQU87YUFRakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDT0xPUiwgREVUQUlMLCBPUEFDSVRZLCBTSVpFLCBVTklUX0NIQU5ORUxTfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2dldFNvcnQsIHBhcnNlTWFya0dyb3VwLCBwYXRoR3JvdXBpbmdGaWVsZHN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyayc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge0dFT1NIQVBFfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyaycsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VNYXJrR3JvdXAnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBQQVRIXG4gICAgZGVzY3JpYmUoJ011bHRpLXNlcmllcyBMaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJzdHlsZVwiOiBcInRyZW5kXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBhIGZhY2V0IGRpcmVjdGl2ZSBhbmQgYSBuZXN0ZWQgbWFyayBncm91cCB0aGF0IHVzZXMgdGhlIGZhY2V0ZWQgZGF0YS4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAncGF0aGdyb3VwJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya0dyb3VwLmZyb20sIHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgbmFtZTogJ2ZhY2V0ZWRfcGF0aF9tYWluJyxcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGdyb3VwYnk6IFsnc3ltYm9sJ11cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzdWJtYXJrR3JvdXAgPSBtYXJrR3JvdXAubWFya3NbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAubmFtZSwgJ21hcmtzJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAudHlwZSwgJ2xpbmUnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzdWJtYXJrR3JvdXAuc3R5bGUsIFsnbGluZScsICd0cmVuZCddKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN1Ym1hcmtHcm91cC5mcm9tLmRhdGEsICdmYWNldGVkX3BhdGhfbWFpbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAncGF0aGdyb3VwJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya0dyb3VwLmZyb20sIHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgbmFtZTogJ2ZhY2V0ZWRfcGF0aF9tYWluJyxcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGdyb3VwYnk6IFsnc3ltYm9sJ11cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBzdWJtYXJrR3JvdXAgPSBtYXJrR3JvdXAubWFya3NbMF07XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChzdWJtYXJrR3JvdXAudHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1NpbmdsZSBMaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJheGlzXCI6IHtcImZvcm1hdFwiOiBcIiVZXCJ9fSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgbWFyayBncm91cCB3aXRoIHByb3BlciBkYXRhIGFuZCBrZXknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5uYW1lLCAnbWFya3MnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC50eXBlLCAnbGluZScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBOT04tUEFUSFxuICAgIH0pO1xuICAgIGRlc2NyaWJlKCdQb2ludHMgd2l0aCBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJheGlzXCI6IHtcImZvcm1hdFwiOiBcIiVZXCJ9fSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJrZXlcIjoge1wiZmllbGRcIjogXCJrXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBtYXJrIGdyb3VwIHdpdGggcHJvcGVyIGRhdGEgYW5kIGtleScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLnR5cGUsICdzeW1ib2wnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cC5rZXkuZmllbGQsICdrJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAuZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1hcmtHcm91cFswXS50cmFuc2Zvcm0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnR2Vvc2hhcGUgc2hvdWxkIGhhdmUgcG9zdCBlbmNvZGluZyB0cmFuc2Zvcm0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzRGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0udHJhbnNmb3JtWzBdLnR5cGUsIEdFT1NIQVBFKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdBZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJFZmZlY3RfX0Ftb3VudF9vZl9kYW1hZ2VcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIHN0YWNrZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXBbMF0uc3R5bGUsICdiYXInKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdGYWNldGVkIGFnZ3JlZ2F0ZWQgQmFyIHdpdGggYSBjb2xvciB3aXRoIGJpbm5lZCB4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX1RvdGFsXyRcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJFZmZlY3RfX0Ftb3VudF9vZl9kYW1hZ2VcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgZmFjZXRlZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ2NoaWxkX21haW4nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHBvc3QgZW5jb2RpbmcgdHJhbnNmb3JtJywgKCkgPT4ge1xuICAgICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuXG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsLmNoaWxkIGFzIFVuaXRNb2RlbCk7XG4gICAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtYXJrR3JvdXBbMF0udHJhbnNmb3JtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0FnZ3JlZ2F0ZWQgYmFyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBtYWluIGFnZ3JlZ2F0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgaGF2ZSBwb3N0IGVuY29kaW5nIHRyYW5zZm9ybScsICgpID0+IHtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuaXNVbmRlZmluZWQobWFya0dyb3VwWzBdLnRyYW5zZm9ybSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFNvcnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcmRlciBieSBvcmRlciBmaWVsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9kcml2aW5nLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwibWlsZXNcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImdhc1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfX0sXG4gICAgICAgICAgXCJvcmRlclwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdldFNvcnQobW9kZWwpLCB7XG4gICAgICAgIGZpZWxkOiBbJ2RhdHVtW1xcXCJ5ZWFyXFxcIl0nXSxcbiAgICAgICAgb3JkZXI6IFsnYXNjZW5kaW5nJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG5vIHNvcnQgaWYgb3JkZXIgPSB7dmFsdWU6IG51bGx9JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2RyaXZpbmcuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJtaWxlc1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ6ZXJvXCI6IGZhbHNlfX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiZ2FzXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9fSxcbiAgICAgICAgICBcIm9yZGVyXCI6IHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGdldFNvcnQobW9kZWwpLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBvcmRlciBieSB4IGJ5IGRlZmF1bHQgaWYgeCBpcyB0aGUgZGltZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImJpblwiOiB7XCJtYXhiaW5zXCI6IDEwfSxcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJJTURCX1JhdGluZ1wiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIlNvdXJjZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRTb3J0KG1vZGVsKSwge1xuICAgICAgICBmaWVsZDogJ2RhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9JTURCX1JhdGluZ1xcXCJdJyxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBvcmRlciBieSBhIG1pc3NpbmcgZGltZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIlNvdXJjZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRTb3J0KG1vZGVsKSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhdGhHcm91cGluZ0ZpZWxkcygpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpZWxkcyBmb3IgdW5hZ2dyZWdhdGUgZGV0YWlsLCBjb2xvciwgc2l6ZSwgb3BhY2l0eSBmaWVsZERlZnMuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtERVRBSUwsIENPTE9SLCBTSVpFLCBPUEFDSVRZXSkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcygnbGluZScsIHtbY2hhbm5lbF06IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgICAgWydhJ11cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJldHVybiBhIGZpZWxkIGZvciBzaXplIG9mIGEgdHJhaWwgbWFyay4nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ3RyYWlsJywge3NpemU6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSksXG4gICAgICAgIFtdXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmV0dXJuIGZpZWxkcyBmb3IgYWdncmVnYXRlIGRldGFpbCwgY29sb3IsIHNpemUsIG9wYWNpdHkgZmllbGREZWZzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbREVUQUlMLCBDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7W2NoYW5uZWxdOiB7YWdncmVnYXRlOiAnbWVhbicsIGZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ319KSxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICBjaGFubmVsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb25kaXRpb24gZGV0YWlsIGZpZWxkcyBmb3IgY29sb3IsIHNpemUsIHNoYXBlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFtDT0xPUiwgU0laRSwgT1BBQ0lUWV0pIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgICBwYXRoR3JvdXBpbmdGaWVsZHMoJ2xpbmUnLCB7W2NoYW5uZWxdOiB7XG4gICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICdzZWwnLCBmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfX0pLFxuICAgICAgICAgIFsnYSddXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXR1cm4gZXJyb3JzIGZvciBhbGwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgVU5JVF9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHBhdGhHcm91cGluZ0ZpZWxkcygnbGluZScsIHtcbiAgICAgICAgICAgICAgW2NoYW5uZWxdOiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19