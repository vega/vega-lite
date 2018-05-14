/* tslint:disable:quotemark */
import { assert } from 'chai';
import { domainSort, mergeDomains, parseDomainForChannel } from '../../../src/compile/scale/domain';
import { parseScaleCore } from '../../../src/compile/scale/parse';
import { MAIN } from '../../../src/data';
import * as log from '../../../src/log';
import { ScaleType } from '../../../src/scale';
import { parseUnitModel } from '../../util';
describe('compile/scale', function () {
    describe('parseDomainForChannel()', function () {
        function testParseDomainForChannel(model, channel) {
            // Cannot parseDomain before parseScaleCore
            parseScaleCore(model);
            return parseDomainForChannel(model, channel);
        }
        it('should have correct domain with x and x2 channel', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    x2: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' },
                    y2: { field: 'd', type: 'quantitative' }
                }
            });
            var xDomain = testParseDomainForChannel(model, 'x');
            assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }, { data: 'main', field: 'b' }]);
            var yDomain = testParseDomainForChannel(model, 'y');
            assert.deepEqual(yDomain, [{ data: 'main', field: 'c' }, { data: 'main', field: 'd' }]);
        });
        it('should have correct domain for color', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: { field: 'a', type: 'quantitative' },
                }
            });
            var xDomain = testParseDomainForChannel(model, 'color');
            assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }]);
        });
        it('should have correct domain for color ConditionField', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: {
                        condition: { selection: 'sel', field: 'a', type: 'quantitative' }
                    }
                }
            });
            var xDomain = testParseDomainForChannel(model, 'color');
            assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }]);
        });
        it('should return domain for stack', function () {
            var model = parseUnitModel({
                mark: "bar",
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'origin',
                        type: 'quantitative'
                    },
                    x: { field: 'x', type: "ordinal" },
                    color: { field: 'color', type: "ordinal" }
                }
            });
            assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                    data: 'main',
                    field: 'sum_origin_start'
                }, {
                    data: 'main',
                    field: 'sum_origin_end'
                }]);
        });
        it('should return normalize domain for stack if specified', function () {
            var model = parseUnitModel({
                mark: "bar",
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'origin',
                        type: 'quantitative'
                    },
                    x: { field: 'x', type: "ordinal" },
                    color: { field: 'color', type: "ordinal" }
                },
                config: {
                    stack: "normalize"
                }
            });
            assert.deepEqual(testParseDomainForChannel(model, 'y'), [[0, 1]]);
        });
        describe('for quantitative', function () {
            it('should return the right domain for binned Q', log.wrap(function (localLogger) {
                var fieldDef = {
                    bin: { maxbins: 15 },
                    field: 'origin',
                    scale: { domain: 'unaggregated' },
                    type: 'quantitative'
                };
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: fieldDef
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: 'main',
                        field: 'bin_maxbins_15_origin'
                    }, {
                        data: 'main',
                        field: 'bin_maxbins_15_origin_end'
                    }]);
                assert.equal(localLogger.warns[0], log.message.unaggregateDomainHasNoEffectForRawField(fieldDef));
            }));
            it('should follow the custom bin.extent for binned Q', log.wrap(function (localLogger) {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'quantitative',
                            bin: { maxbins: 15, extent: [0, 100] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [[0, 100]]);
            }));
            it('should return the unaggregated domain if requested for non-bin, non-sum Q', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'mean',
                            field: 'acceleration',
                            scale: { domain: 'unaggregated' },
                            type: "quantitative"
                        }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: MAIN,
                        field: 'min_acceleration'
                    }, {
                        data: MAIN,
                        field: 'max_acceleration'
                    }]);
            });
            it('should return the aggregated domain for sum Q', log.wrap(function (localLogger) {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'sum',
                            field: 'origin',
                            scale: { domain: 'unaggregated' },
                            type: "quantitative"
                        }
                    }
                });
                testParseDomainForChannel(model, 'y');
                assert.equal(localLogger.warns[0], log.message.unaggregateDomainWithNonSharedDomainOp('sum'));
            }));
            it('should return the right custom domain', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'horsepower',
                            type: "quantitative",
                            scale: { domain: [0, 200] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [[0, 200]]);
            });
            it('should follow the custom domain despite bin', log.wrap(function (localLogger) {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'quantitative',
                            scale: { domain: [0, 200] },
                            bin: { maxbins: 15 }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [[0, 200]]);
            }));
            it('should return the aggregated domain if we do not override it', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'origin',
                            type: "quantitative"
                        }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'main',
                        field: 'min_origin'
                    }
                ]);
            });
            it('should use the aggregated data for domain if specified in config', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'acceleration',
                            type: "quantitative"
                        }
                    },
                    config: {
                        scale: {
                            useUnaggregatedDomain: true
                        }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: MAIN,
                        field: 'min_acceleration'
                    }, {
                        data: MAIN,
                        field: 'max_acceleration'
                    }]);
            });
        });
        describe('for time', function () {
            it('should return the correct domain for month T', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            type: "temporal",
                            timeUnit: 'month'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin' }]);
            });
            it('should return the correct domain for month O', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            type: "ordinal",
                            timeUnit: 'month'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin', sort: true }]);
            });
            it('should return the correct domain for yearmonth T', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            type: "temporal",
                            timeUnit: 'yearmonth'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [{ data: 'main', field: 'yearmonth_origin' }]);
            });
            it('should return the correct domain for month O when specify sort', function () {
                var sortDef = { op: 'mean', field: 'precipitation', order: 'descending' };
                var model = parseUnitModel({
                    mark: "bar",
                    encoding: {
                        x: {
                            timeUnit: 'month',
                            field: 'date',
                            type: 'ordinal',
                            sort: sortDef
                        },
                        y: {
                            aggregate: 'mean',
                            field: 'precipitation',
                            type: 'quantitative'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'x');
                assert.deepEqual(_domain, [{
                        data: 'raw',
                        field: 'month_date',
                        sort: sortDef
                    }]);
            });
            it('should return the right custom domain with DateTime objects', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'year',
                            type: "temporal",
                            scale: { domain: [{ year: 1970 }, { year: 1980 }] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                assert.deepEqual(_domain, [
                    { "signal": "{data: datetime(1970, 0, 1, 0, 0, 0, 0)}" },
                    { "signal": "{data: datetime(1980, 0, 1, 0, 0, 0, 0)}" }
                ]);
            });
        });
        describe('for ordinal', function () {
            it('should have correct domain for binned ordinal color', function () {
                var model = parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        color: { field: 'a', bin: true, type: 'ordinal' },
                    }
                });
                var xDomain = testParseDomainForChannel(model, 'color');
                assert.deepEqual(xDomain, [{ data: 'main', field: 'bin_maxbins_6_a_range', sort: { field: 'bin_maxbins_6_a', op: 'min' } }]);
            });
        });
        describe('for nominal', function () {
            it('should return correct domain with the provided sort property', function () {
                var sortDef = { op: 'min', field: 'Acceleration' };
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal", sort: sortDef }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "raw",
                        field: 'origin',
                        sort: sortDef
                    }]);
            });
            it('should return correct domain with the provided sort property with order property', function () {
                var sortDef = { op: 'min', field: 'Acceleration', order: "descending" };
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal", sort: sortDef }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "raw",
                        field: 'origin',
                        sort: sortDef
                    }]);
            });
            it('should return correct domain without sort if sort is not provided', function () {
                var model = parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal" }
                    }
                });
                assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "main",
                        field: 'origin',
                        sort: true
                    }]);
            });
        });
    });
    describe('mergeDomains()', function () {
        it('should merge the same domains', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should drop field if op is count', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { op: 'count', field: 'b' }
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { op: 'count' }
            });
        });
        it('should sort the output domain if one domain is sorted', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'descending' }
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean', order: 'descending' }
            });
        });
        it('should sort the output domain if one domain is sorted with true', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: true
                }, {
                    data: 'foo',
                    field: 'b',
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
        });
        it('should not sort if no domain is sorted', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b',
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should ignore order ascending as it is the default', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'ascending' }
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should merge domains with the same data', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'a'
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a'
            });
        });
        it('should merge domains with the same data source', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b'
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should merge domains with different data source', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: true
                }, {
                    data: 'bar',
                    field: 'a',
                    sort: true
                }]);
            assert.deepEqual(domain, {
                fields: [{
                        data: 'foo',
                        field: 'a'
                    }, {
                        data: 'bar',
                        field: 'a'
                    }],
                sort: true
            });
        });
        it('should merge domains with different data and sort', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            assert.deepEqual(domain, {
                fields: [{
                        data: 'foo',
                        field: 'a'
                    }, {
                        data: 'bar',
                        field: 'a'
                    }],
                sort: {
                    op: 'count'
                }
            });
        });
        it('should merge domains with the same and different data', function () {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b'
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            assert.deepEqual(domain, {
                fields: [{
                        data: 'foo',
                        field: 'a'
                    }, {
                        data: 'foo',
                        field: 'b'
                    }, {
                        data: 'bar',
                        field: 'a'
                    }]
            });
        });
        it('should merge signal domains', function () {
            var domain = mergeDomains([{
                    signal: 'foo'
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            assert.deepEqual(domain, {
                fields: [{
                        signal: 'foo'
                    }, {
                        data: 'bar',
                        field: 'a'
                    }
                ]
            });
        });
        it('should warn if sorts conflict', log.wrap(function (localLogger) {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                }, {
                    data: 'foo',
                    field: 'b',
                    sort: true
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
            assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if sorts conflict even if we do not union', log.wrap(function (localLogger) {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: true
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: true
            });
            assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if we had to drop complex sort', log.wrap(function (localLogger) {
            var domain = mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'mean',
                        field: 'c'
                    }
                }, {
                    data: 'foo',
                    field: 'b'
                }]);
            assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
            assert.equal(localLogger.warns[0], log.message.domainSortDropped({
                op: 'mean',
                field: 'c'
            }));
        }));
        it('should not sort explicit domains', function () {
            var domain = mergeDomains([[1, 2, 3, 4], [3, 4, 5, 6]]);
            assert.deepEqual(domain, {
                fields: [[1, 2, 3, 4], [3, 4, 5, 6]]
            });
        });
    });
    describe('domainSort()', function () {
        it('should return undefined for continuous domain', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                }
            });
            var sort = domainSort(model, 'x', ScaleType.LINEAR);
            assert.deepEqual(sort, undefined);
        });
        it('should return true by default for discrete domain', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, true);
        });
        it('should return true for ascending', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: 'ascending' },
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, true);
        });
        it('should return undefined if sort = null', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: null },
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, undefined);
        });
        it('should return normal sort spec if specified and aggregration is not count', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: { op: 'sum', field: 'y' } },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, { op: 'sum', field: 'y' });
        });
        it('should return normal sort spec if aggregration is count and field not specified', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: { op: 'count' } },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, { op: 'count' });
        });
        it('should return true if sort is not specified', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal' },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domainSort(model, 'x', ScaleType.ORDINAL);
            assert.deepEqual(sort, true);
        });
        it('should return undefined if sort is specified', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: "descending" },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            assert.deepEqual(domainSort(model, 'x', ScaleType.ORDINAL), { op: 'min', field: 'a', order: 'descending' });
        });
        it('should return sort spec using derived sort index', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: ['B', 'A', 'C'] },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            assert.deepEqual(domainSort(model, 'x', ScaleType.ORDINAL), { op: 'min', field: 'x_a_sort_index', order: 'ascending' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFFaEUsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXZDLE9BQU8sS0FBSyxHQUFHLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRzdDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsbUNBQW1DLEtBQWdCLEVBQUUsT0FBcUI7WUFDeEUsMkNBQTJDO1lBQzNDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDekIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUN0QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUs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QUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQ3JJLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtkb21haW5Tb3J0LCBtZXJnZURvbWFpbnMsIHBhcnNlRG9tYWluRm9yQ2hhbm5lbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluJztcbmltcG9ydCB7cGFyc2VTY2FsZUNvcmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL3BhcnNlJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS91bml0JztcbmltcG9ydCB7TUFJTn0gZnJvbSAnLi4vLi4vLi4vc3JjL2RhdGEnO1xuaW1wb3J0IHtQb3NpdGlvbkZpZWxkRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL3NvcnQnO1xuaW1wb3J0IHtWZ0RvbWFpbiwgVmdTb3J0RmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvc2NhbGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdwYXJzZURvbWFpbkZvckNoYW5uZWwoKScsICgpID0+IHtcbiAgICBmdW5jdGlvbiB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkge1xuICAgICAgLy8gQ2Fubm90IHBhcnNlRG9tYWluIGJlZm9yZSBwYXJzZVNjYWxlQ29yZVxuICAgICAgcGFyc2VTY2FsZUNvcmUobW9kZWwpO1xuICAgICAgcmV0dXJuIHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCk7XG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIHdpdGggeCBhbmQgeDIgY2hhbm5lbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB4Mjoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5Mjoge2ZpZWxkOiAnZCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAneCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh4RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdhJ30sIHtkYXRhOiAnbWFpbicsIGZpZWxkOiAnYid9XSk7XG5cbiAgICAgIGNvbnN0IHlEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAneScpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh5RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdjJ30sIHtkYXRhOiAnbWFpbicsIGZpZWxkOiAnZCd9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkb21haW4gZm9yIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgeERvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICdjb2xvcicpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh4RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdhJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRvbWFpbiBmb3IgY29sb3IgQ29uZGl0aW9uRmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICdzZWwnLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ2NvbG9yJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHhEb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2EnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZG9tYWluIGZvciBzdGFjaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwiYmFyXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge1xuICAgICAgICAgICAgYWdncmVnYXRlOiAnc3VtJyxcbiAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4OiB7ZmllbGQ6ICd4JywgdHlwZTogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdjb2xvcicsIHR5cGU6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgZmllbGQ6ICdzdW1fb3JpZ2luX3N0YXJ0J1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgIGZpZWxkOiAnc3VtX29yaWdpbl9lbmQnXG4gICAgICB9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3JtYWxpemUgZG9tYWluIGZvciBzdGFjayBpZiBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ3N1bScsXG4gICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnY29sb3InLCB0eXBlOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgc3RhY2s6IFwibm9ybWFsaXplXCJcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbWzAsIDFdXSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIHF1YW50aXRhdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJpZ2h0IGRvbWFpbiBmb3IgYmlubmVkIFEnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgZmllbGREZWY6IFBvc2l0aW9uRmllbGREZWY8c3RyaW5nPiA9IHtcbiAgICAgICAgICBiaW46IHttYXhiaW5zOiAxNX0sXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiAndW5hZ2dyZWdhdGVkJ30sXG4gICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiBmaWVsZERlZlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBmaWVsZDogJ2Jpbl9tYXhiaW5zXzE1X29yaWdpbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBmaWVsZDogJ2Jpbl9tYXhiaW5zXzE1X29yaWdpbl9lbmQnXG4gICAgICAgICAgfV0pO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5IYXNOb0VmZmVjdEZvclJhd0ZpZWxkKGZpZWxkRGVmKSk7XG4gICAgICB9KSk7XG5cbiAgICAgIGl0KCdzaG91bGQgZm9sbG93IHRoZSBjdXN0b20gYmluLmV4dGVudCBmb3IgYmlubmVkIFEnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZScsXG4gICAgICAgICAgICAgIGJpbjoge21heGJpbnM6IDE1LCBleHRlbnQ6WzAsIDEwMF19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFtbMCwgMTAwXV0pO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiByZXF1ZXN0ZWQgZm9yIG5vbi1iaW4sIG5vbi1zdW0gUScsXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21lYW4nLFxuICAgICAgICAgICAgICAgIGZpZWxkOiAnYWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtaW5fYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6IE1BSU4sXG4gICAgICAgICAgICBmaWVsZDogJ21heF9hY2NlbGVyYXRpb24nXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGFnZ3JlZ2F0ZWQgZG9tYWluIGZvciBzdW0gUScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgYWdncmVnYXRlOiAnc3VtJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgbG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKCdzdW0nKVxuICAgICAgICApO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcmlnaHQgY3VzdG9tIGRvbWFpbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnaG9yc2Vwb3dlcicsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiBbMCwyMDBdfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbWzAsIDIwMF1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGZvbGxvdyB0aGUgY3VzdG9tIGRvbWFpbiBkZXNwaXRlIGJpbicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IFswLDIwMF19LFxuICAgICAgICAgICAgICBiaW46IHttYXhiaW5zOiAxNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW1swLCAyMDBdXSk7XG4gICAgICB9KSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBhZ2dyZWdhdGVkIGRvbWFpbiBpZiB3ZSBkbyBub3Qgb3ZlcnJpZGUgaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21pbicsXG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBmaWVsZDogJ21pbl9vcmlnaW4nXG4gICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHVzZSB0aGUgYWdncmVnYXRlZCBkYXRhIGZvciBkb21haW4gaWYgc3BlY2lmaWVkIGluIGNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgYWdncmVnYXRlOiAnbWluJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdhY2NlbGVyYXRpb24nLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgICAgIHVzZVVuYWdncmVnYXRlZERvbWFpbjogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtaW5fYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6IE1BSU4sXG4gICAgICAgICAgICBmaWVsZDogJ21heF9hY2NlbGVyYXRpb24nXG4gICAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIHRpbWUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgbW9udGggVCcsXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgICAgdGltZVVuaXQ6ICdtb250aCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdtb250aF9vcmlnaW4nfV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBkb21haW4gZm9yIG1vbnRoIE8nLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcIm9yZGluYWxcIixcbiAgICAgICAgICAgICAgICAgIHRpbWVVbml0OiAnbW9udGgnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ21vbnRoX29yaWdpbicsIHNvcnQ6IHRydWV9XSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgZG9tYWluIGZvciB5ZWFybW9udGggVCcsXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgICAgIHRpbWVVbml0OiAneWVhcm1vbnRoJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ3llYXJtb250aF9vcmlnaW4nfV0pO1xuICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgZG9tYWluIGZvciBtb250aCBPIHdoZW4gc3BlY2lmeSBzb3J0JyxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnREZWY6IFNvcnRGaWVsZDxzdHJpbmc+ID0ge29wOiAnbWVhbicsIGZpZWxkOiAncHJlY2lwaXRhdGlvbicsIG9yZGVyOiAnZGVzY2VuZGluZyd9IDtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgIHRpbWVVbml0OiAnbW9udGgnLFxuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21lYW4nLFxuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdwcmVjaXBpdGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd4Jyk7XG5cbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tcbiAgICAgICAgICAgICAgZGF0YTogJ3JhdycsXG4gICAgICAgICAgICAgIGZpZWxkOiAnbW9udGhfZGF0ZScsXG4gICAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByaWdodCBjdXN0b20gZG9tYWluIHdpdGggRGF0ZVRpbWUgb2JqZWN0cycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAneWVhcicsXG4gICAgICAgICAgICAgIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IFt7eWVhcjogMTk3MH0sIHt5ZWFyOiAxOTgwfV19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFtcbiAgICAgICAgICB7XCJzaWduYWxcIjogXCJ7ZGF0YTogZGF0ZXRpbWUoMTk3MCwgMCwgMSwgMCwgMCwgMCwgMCl9XCJ9LFxuICAgICAgICAgIHtcInNpZ25hbFwiOiBcIntkYXRhOiBkYXRldGltZSgxOTgwLCAwLCAxLCAwLCAwLCAwLCAwKX1cIn1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3Igb3JkaW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIGZvciBiaW5uZWQgb3JkaW5hbCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2EnLCBiaW46IHRydWUsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYmluX21heGJpbnNfNl9hX3JhbmdlJywgc29ydDoge2ZpZWxkOiAnYmluX21heGJpbnNfNl9hJywgb3A6ICdtaW4nfX1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBub21pbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGRvbWFpbiB3aXRoIHRoZSBwcm92aWRlZCBzb3J0IHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNvcnREZWY6IFNvcnRGaWVsZDxzdHJpbmc+ID0ge29wOiAnbWluJyBhcyAnbWluJywgZmllbGQ6J0FjY2VsZXJhdGlvbid9O1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwiLCBzb3J0OiBzb3J0RGVmfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICAgIGRhdGE6IFwicmF3XCIsXG4gICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICBzb3J0OiBzb3J0RGVmXG4gICAgICAgICAgfV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZG9tYWluIHdpdGggdGhlIHByb3ZpZGVkIHNvcnQgcHJvcGVydHkgd2l0aCBvcmRlciBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBzb3J0RGVmOiBTb3J0RmllbGQ8c3RyaW5nPiA9IHtvcDogJ21pbicsIGZpZWxkOidBY2NlbGVyYXRpb24nLCBvcmRlcjogXCJkZXNjZW5kaW5nXCJ9IDtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB5OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIiwgc29ydDogc29ydERlZn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICAgIGRhdGE6IFwicmF3XCIsXG4gICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICBzb3J0OiBzb3J0RGVmXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGRvbWFpbiB3aXRob3V0IHNvcnQgaWYgc29ydCBpcyBub3QgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgIGRhdGE6IFwibWFpblwiLFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbWVyZ2VEb21haW5zKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZXJnZSB0aGUgc2FtZSBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgZmllbGQgaWYgb3AgaXMgY291bnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtvcDogJ2NvdW50JywgZmllbGQ6ICdiJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7b3A6ICdjb3VudCd9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc29ydCB0aGUgb3V0cHV0IGRvbWFpbiBpZiBvbmUgZG9tYWluIGlzIHNvcnRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbicsIG9yZGVyOiAnZGVzY2VuZGluZyd9XG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbicsIG9yZGVyOiAnZGVzY2VuZGluZyd9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc29ydCB0aGUgb3V0cHV0IGRvbWFpbiBpZiBvbmUgZG9tYWluIGlzIHNvcnRlZCB3aXRoIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYicsXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZHM6IFsnYScsICdiJ10sXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc29ydCBpZiBubyBkb21haW4gaXMgc29ydGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaWdub3JlIG9yZGVyIGFzY2VuZGluZyBhcyBpdCBpcyB0aGUgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbicsIG9yZGVyOiAnYXNjZW5kaW5nJ31cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCB0aGUgc2FtZSBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCB0aGUgc2FtZSBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCBkaWZmZXJlbnQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbe1xuICAgICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV0sXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggZGlmZmVyZW50IGRhdGEgYW5kIHNvcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ2NvdW50J1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggdGhlIHNhbWUgYW5kIGRpZmZlcmVudCBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2InXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2Ugc2lnbmFsIGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgc2lnbmFsOiAnZm9vJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgICBzaWduYWw6ICdmb28nXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgd2FybiBpZiBzb3J0cyBjb25mbGljdCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgd2FybiBpZiBzb3J0cyBjb25mbGljdCBldmVuIGlmIHdlIGRvIG5vdCB1bmlvbicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHdhcm4gaWYgd2UgaGFkIHRvIGRyb3AgY29tcGxleCBzb3J0JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ21lYW4nLFxuICAgICAgICAgIGZpZWxkOiAnYydcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kb21haW5Tb3J0RHJvcHBlZCh7XG4gICAgICAgIG9wOiAnbWVhbicsXG4gICAgICAgIGZpZWxkOiAnYydcbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzb3J0IGV4cGxpY2l0IGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW1sxLDIsMyw0XSwgWzMsNCw1LDZdXSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW1sxLDIsMyw0XSwgWzMsNCw1LDZdXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkb21haW5Tb3J0KCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciBjb250aW51b3VzIGRvbWFpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5MSU5FQVIpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3J0LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0IGZvciBkaXNjcmV0ZSBkb21haW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3J0LCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGFzY2VuZGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgc29ydDogJ2FzY2VuZGluZyd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIHNvcnQgPSBudWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgc29ydDogbnVsbH0sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc29ydCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vcm1hbCBzb3J0IHNwZWMgaWYgc3BlY2lmaWVkIGFuZCBhZ2dyZWdyYXRpb24gaXMgbm90IGNvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCcsIHNvcnQ6IHtvcDogJ3N1bScsIGZpZWxkOid5J319LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihzb3J0LCB7b3A6ICdzdW0nLCBmaWVsZDogJ3knfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3JtYWwgc29ydCBzcGVjIGlmIGFnZ3JlZ3JhdGlvbiBpcyBjb3VudCBhbmQgZmllbGQgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnLCBzb3J0OiB7b3A6ICdjb3VudCd9fSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgYWdncmVnYXRlOiAnc3VtJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1NvcnRGaWVsZD4oc29ydCwge29wOiAnY291bnQnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGlmIHNvcnQgaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgYWdncmVnYXRlOiAnc3VtJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3J0LCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBpZiBzb3J0IGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnLCBzb3J0OiBcImRlc2NlbmRpbmdcIn0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIGFnZ3JlZ2F0ZTogJ3N1bScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdTb3J0RmllbGQ+KGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpLCB7b3A6ICdtaW4nLCBmaWVsZDogJ2EnLCBvcmRlcjogJ2Rlc2NlbmRpbmcnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBzb3J0IHNwZWMgdXNpbmcgZGVyaXZlZCBzb3J0IGluZGV4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNvcnQ6IFsnQicsICdBJywgJ0MnXX0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdTb3J0RmllbGQ+KGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpLCB7b3A6ICdtaW4nLCBmaWVsZDogJ3hfYV9zb3J0X2luZGV4Jywgb3JkZXI6ICdhc2NlbmRpbmcnfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=