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
                mark: { type: 'line', style: 'trend' },
                encoding: {
                    x: { field: 'date', type: 'temporal', axis: { format: '%Y' } },
                    y: { field: 'price', type: 'quantitative' },
                    color: { field: 'symbol', type: 'nominal' }
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
                mark: 'line',
                encoding: {
                    x: { field: 'date', type: 'temporal', axis: { format: '%Y' } },
                    y: { field: 'price', type: 'quantitative' }
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
                mark: 'point',
                encoding: {
                    x: { field: 'date', type: 'temporal', axis: { format: '%Y' } },
                    y: { field: 'price', type: 'quantitative' },
                    key: { field: 'k', type: 'quantitative' }
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
                mark: 'geoshape',
                projection: {
                    type: 'albersUsa'
                },
                data: {
                    url: 'data/us-10m.json',
                    format: {
                        type: 'topojson',
                        feature: 'states'
                    }
                },
                encoding: {}
            });
            var markGroup = parseMarkGroup(model);
            assert.isDefined(markGroup[0].transform);
            assert.equal(markGroup[0].transform[0].type, GEOSHAPE);
        });
        describe('Aggregated Bar with a color with binned x', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                mark: 'bar',
                encoding: {
                    x: { type: 'quantitative', field: 'Cost__Other', aggregate: 'sum' },
                    y: { bin: true, type: 'quantitative', field: 'Cost__Total_$' },
                    color: { type: 'ordinal', field: 'Effect__Amount_of_damage' }
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
                    mark: 'bar',
                    encoding: {
                        x: { type: 'quantitative', field: 'Cost__Other', aggregate: 'sum' },
                        y: { bin: true, type: 'quantitative', field: 'Cost__Total_$' },
                        color: { type: 'ordinal', field: 'Effect__Amount_of_damage' }
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
                mark: 'bar',
                encoding: {
                    x: { type: 'quantitative', field: 'Cost__Other', aggregate: 'sum' },
                    y: { bin: true, type: 'quantitative', field: 'Cost__Total_$' }
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
                data: { url: 'data/driving.json' },
                mark: 'line',
                encoding: {
                    x: { field: 'miles', type: 'quantitative', scale: { zero: false } },
                    y: { field: 'gas', type: 'quantitative', scale: { zero: false } },
                    order: { field: 'year', type: 'temporal' }
                }
            });
            assert.deepEqual(getSort(model), {
                field: ['datum["year"]'],
                order: ['ascending']
            });
        });
        it('should have no sort if order = {value: null}', function () {
            var model = parseUnitModel({
                data: { url: 'data/driving.json' },
                mark: 'line',
                encoding: {
                    x: { field: 'miles', type: 'quantitative', scale: { zero: false } },
                    y: { field: 'gas', type: 'quantitative', scale: { zero: false } },
                    order: { value: null }
                }
            });
            assert.equal(getSort(model), undefined);
        });
        it('should order by x by default if x is the dimension', function () {
            var model = parseUnitModelWithScale({
                data: { url: 'data/movies.json' },
                mark: 'line',
                encoding: {
                    x: {
                        bin: { maxbins: 10 },
                        field: 'IMDB_Rating',
                        type: 'quantitative'
                    },
                    color: {
                        field: 'Source',
                        type: 'nominal'
                    },
                    y: {
                        aggregate: 'count',
                        type: 'quantitative'
                    }
                }
            });
            assert.deepEqual(getSort(model), {
                field: 'datum["bin_maxbins_10_IMDB_Rating"]',
                order: 'descending'
            });
        });
        it('should not order by a missing dimension', function () {
            var model = parseUnitModelWithScale({
                data: { url: 'data/movies.json' },
                mark: 'line',
                encoding: {
                    color: {
                        field: 'Source',
                        type: 'nominal'
                    },
                    y: {
                        aggregate: 'count',
                        type: 'quantitative'
                    }
                }
            });
            assert.deepEqual(getSort(model), undefined);
        });
    });
    describe('pathGroupingFields()', function () {
        it('should return fields for unaggregate detail, color, size, opacity fieldDefs.', function () {
            var _a;
            for (var _i = 0, _b = [DETAIL, COLOR, SIZE, OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                assert.deepEqual(pathGroupingFields('line', (_a = {}, _a[channel] = { field: 'a', type: 'nominal' }, _a)), ['a']);
            }
        });
        it('should not return a field for size of a trail mark.', function () {
            assert.deepEqual(pathGroupingFields('trail', { size: { field: 'a', type: 'nominal' } }), []);
        });
        it('should not return fields for aggregate detail, color, size, opacity fieldDefs.', function () {
            var _a;
            for (var _i = 0, _b = [DETAIL, COLOR, SIZE, OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                assert.deepEqual(pathGroupingFields('line', (_a = {}, _a[channel] = { aggregate: 'mean', field: 'a', type: 'nominal' }, _a)), [], channel);
            }
        });
        it('should return condition detail fields for color, size, shape', function () {
            var _a;
            for (var _i = 0, _b = [COLOR, SIZE, OPACITY]; _i < _b.length; _i++) {
                var channel = _b[_i];
                assert.deepEqual(pathGroupingFields('line', (_a = {},
                    _a[channel] = {
                        condition: { selection: 'sel', field: 'a', type: 'nominal' }
                    },
                    _a)), ['a']);
            }
        });
        it('should not return errors for all channels', function () {
            var _loop_1 = function (channel) {
                assert.doesNotThrow(function () {
                    var _a;
                    pathGroupingFields('line', (_a = {},
                        _a[channel] = { field: 'a', type: 'nominal' },
                        _a));
                });
            };
            for (var _i = 0, UNIT_CHANNELS_1 = UNIT_CHANNELS; _i < UNIT_CHANNELS_1.length; _i++) {
                var channel = UNIT_CHANNELS_1[_i];
                _loop_1(channel);
            }
        });
    });
});
//# sourceMappingURL=mark.test.js.map