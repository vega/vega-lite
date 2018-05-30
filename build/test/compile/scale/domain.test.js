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
        it('should return sort with flattened field access', function () {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: { field: 'foo.bar', op: 'mean' } },
                }
            });
            assert.deepEqual(domainSort(model, 'x', ScaleType.ORDINAL), { op: 'mean', field: 'foo\\.bar' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFFaEUsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXZDLE9BQU8sS0FBSyxHQUFHLE1BQU0sa0JBQWtCLENBQUM7QUFDeEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRzdDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUMsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUN4QixRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsbUNBQW1DLEtBQWdCLEVBQUUsT0FBcUI7WUFDeEUsMkNBQTJDO1lBQzNDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDekIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUN0QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUs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QUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQ3JJLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUMsRUFBQztpQkFDdkU7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFjLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7UUFDN0csQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7U2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2RvbWFpblNvcnQsIG1lcmdlRG9tYWlucywgcGFyc2VEb21haW5Gb3JDaGFubmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlQ29yZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvcGFyc2UnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi8uLi9zcmMvZGF0YSc7XG5pbXBvcnQge1Bvc2l0aW9uRmllbGREZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7RW5jb2RpbmdTb3J0RmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy9zb3J0JztcbmltcG9ydCB7VmdEb21haW4sIFZnU29ydEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL3NjYWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VEb21haW5Gb3JDaGFubmVsKCknLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgICAgIC8vIENhbm5vdCBwYXJzZURvbWFpbiBiZWZvcmUgcGFyc2VTY2FsZUNvcmVcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIHJldHVybiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsIGNoYW5uZWwpO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRvbWFpbiB3aXRoIHggYW5kIHgyIGNoYW5uZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeDI6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeTI6IHtmaWVsZDogJ2QnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ3gnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYSd9LCB7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2InfV0pO1xuXG4gICAgICBjb25zdCB5RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ3knKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeURvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYyd9LCB7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2QnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIGZvciBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAnY29sb3InKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYSd9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkb21haW4gZm9yIGNvbG9yIENvbmRpdGlvbkZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAnc2VsJywgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgeERvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICdjb2xvcicpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh4RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdhJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGRvbWFpbiBmb3Igc3RhY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ3N1bScsXG4gICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnY29sb3InLCB0eXBlOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgIGZpZWxkOiAnc3VtX29yaWdpbl9zdGFydCdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICBmaWVsZDogJ3N1bV9vcmlnaW5fZW5kJ1xuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9ybWFsaXplIGRvbWFpbiBmb3Igc3RhY2sgaWYgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7XG4gICAgICAgICAgICBhZ2dyZWdhdGU6ICdzdW0nLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2NvbG9yJywgdHlwZTogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHN0YWNrOiBcIm5vcm1hbGl6ZVwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW1swLCAxXV0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBxdWFudGl0YXRpdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByaWdodCBkb21haW4gZm9yIGJpbm5lZCBRJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz4gPSB7XG4gICAgICAgICAgYmluOiB7bWF4YmluczogMTV9LFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeTogZmllbGREZWZcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdiaW5fbWF4Ymluc18xNV9vcmlnaW4nXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdiaW5fbWF4Ymluc18xNV9vcmlnaW5fZW5kJ1xuICAgICAgICAgIH1dKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZikpO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIGZvbGxvdyB0aGUgY3VzdG9tIGJpbi5leHRlbnQgZm9yIGJpbm5lZCBRJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnLFxuICAgICAgICAgICAgICBiaW46IHttYXhiaW5zOiAxNSwgZXh0ZW50OlswLCAxMDBdfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbWzAsIDEwMF1dKTtcbiAgICAgIH0pKTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHVuYWdncmVnYXRlZCBkb21haW4gaWYgcmVxdWVzdGVkIGZvciBub24tYmluLCBub24tc3VtIFEnLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtZWFuJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogTUFJTixcbiAgICAgICAgICAgIGZpZWxkOiAnbWluX2FjY2VsZXJhdGlvbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtYXhfYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH1dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBhZ2dyZWdhdGVkIGRvbWFpbiBmb3Igc3VtIFEnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ3N1bScsXG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfSxcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgIGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcCgnc3VtJylcbiAgICAgICAgKTtcbiAgICAgIH0pKTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJpZ2h0IGN1c3RvbSBkb21haW4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBmaWVsZDogJ2hvcnNlcG93ZXInLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogWzAsMjAwXX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW1swLCAyMDBdXSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBmb2xsb3cgdGhlIGN1c3RvbSBkb21haW4gZGVzcGl0ZSBiaW4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZScsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiBbMCwyMDBdfSxcbiAgICAgICAgICAgICAgYmluOiB7bWF4YmluczogMTV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFtbMCwgMjAwXV0pO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgYWdncmVnYXRlZCBkb21haW4gaWYgd2UgZG8gbm90IG92ZXJyaWRlIGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtaW4nLFxuICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdtaW5fb3JpZ2luJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgdGhlIGFnZ3JlZ2F0ZWQgZGF0YSBmb3IgZG9tYWluIGlmIHNwZWNpZmllZCBpbiBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21pbicsXG4gICAgICAgICAgICAgIGZpZWxkOiAnYWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgICB1c2VVbmFnZ3JlZ2F0ZWREb21haW46IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogTUFJTixcbiAgICAgICAgICAgIGZpZWxkOiAnbWluX2FjY2VsZXJhdGlvbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtYXhfYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciB0aW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBkb21haW4gZm9yIG1vbnRoIFQnLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICAgIHRpbWVVbml0OiAnbW9udGgnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnbW9udGhfb3JpZ2luJ31dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgZG9tYWluIGZvciBtb250aCBPJyxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJvcmRpbmFsXCIsXG4gICAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ21vbnRoJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdtb250aF9vcmlnaW4nLCBzb3J0OiB0cnVlfV0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgeWVhcm1vbnRoIFQnLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ3llYXJtb250aCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICd5ZWFybW9udGhfb3JpZ2luJ31dKTtcbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgbW9udGggTyB3aGVuIHNwZWNpZnkgc29ydCcsXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0RGVmOiBFbmNvZGluZ1NvcnRGaWVsZDxzdHJpbmc+ID0ge29wOiAnbWVhbicsIGZpZWxkOiAncHJlY2lwaXRhdGlvbicsIG9yZGVyOiAnZGVzY2VuZGluZyd9IDtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgIHRpbWVVbml0OiAnbW9udGgnLFxuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkYXRlJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21lYW4nLFxuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdwcmVjaXBpdGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd4Jyk7XG5cbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tcbiAgICAgICAgICAgICAgZGF0YTogJ3JhdycsXG4gICAgICAgICAgICAgIGZpZWxkOiAnbW9udGhfZGF0ZScsXG4gICAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICAgIH1dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByaWdodCBjdXN0b20gZG9tYWluIHdpdGggRGF0ZVRpbWUgb2JqZWN0cycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAneWVhcicsXG4gICAgICAgICAgICAgIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IFt7eWVhcjogMTk3MH0sIHt5ZWFyOiAxOTgwfV19XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFtcbiAgICAgICAgICB7XCJzaWduYWxcIjogXCJ7ZGF0YTogZGF0ZXRpbWUoMTk3MCwgMCwgMSwgMCwgMCwgMCwgMCl9XCJ9LFxuICAgICAgICAgIHtcInNpZ25hbFwiOiBcIntkYXRhOiBkYXRldGltZSgxOTgwLCAwLCAxLCAwLCAwLCAwLCAwKX1cIn1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3Igb3JkaW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIGZvciBiaW5uZWQgb3JkaW5hbCBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2EnLCBiaW46IHRydWUsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ2NvbG9yJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYmluX21heGJpbnNfNl9hX3JhbmdlJywgc29ydDoge2ZpZWxkOiAnYmluX21heGJpbnNfNl9hJywgb3A6ICdtaW4nfX1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBub21pbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGRvbWFpbiB3aXRoIHRoZSBwcm92aWRlZCBzb3J0IHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNvcnREZWY6IEVuY29kaW5nU29ydEZpZWxkPHN0cmluZz4gPSB7b3A6ICdtaW4nIGFzICdtaW4nLCBmaWVsZDonQWNjZWxlcmF0aW9uJ307XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNvcnQ6IHNvcnREZWZ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogXCJyYXdcIixcbiAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkb21haW4gd2l0aCB0aGUgcHJvdmlkZWQgc29ydCBwcm9wZXJ0eSB3aXRoIG9yZGVyIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNvcnREZWY6IEVuY29kaW5nU29ydEZpZWxkPHN0cmluZz4gPSB7b3A6ICdtaW4nLCBmaWVsZDonQWNjZWxlcmF0aW9uJywgb3JkZXI6IFwiZGVzY2VuZGluZ1wifSA7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNvcnQ6IHNvcnREZWZ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBcInJhd1wiLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgc29ydDogc29ydERlZlxuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkb21haW4gd2l0aG91dCBzb3J0IGlmIHNvcnQgaXMgbm90IHByb3ZpZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICBkYXRhOiBcIm1haW5cIixcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21lcmdlRG9tYWlucygpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVyZ2UgdGhlIHNhbWUgZG9tYWlucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGZpZWxkIGlmIG9wIGlzIGNvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7b3A6ICdjb3VudCcsIGZpZWxkOiAnYid9XG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge29wOiAnY291bnQnfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNvcnQgdGhlIG91dHB1dCBkb21haW4gaWYgb25lIGRvbWFpbiBpcyBzb3J0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nLCBvcmRlcjogJ2Rlc2NlbmRpbmcnfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nLCBvcmRlcjogJ2Rlc2NlbmRpbmcnfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNvcnQgdGhlIG91dHB1dCBkb21haW4gaWYgb25lIGRvbWFpbiBpcyBzb3J0ZWQgd2l0aCB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHNvcnQgaWYgbm8gZG9tYWluIGlzIHNvcnRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGlnbm9yZSBvcmRlciBhc2NlbmRpbmcgYXMgaXQgaXMgdGhlIGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nLCBvcmRlcjogJ2FzY2VuZGluZyd9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggdGhlIHNhbWUgZGF0YScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggdGhlIHNhbWUgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYidcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZHM6IFsnYScsICdiJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggZGlmZmVyZW50IGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWlucyB3aXRoIGRpZmZlcmVudCBkYXRhIGFuZCBzb3J0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbe1xuICAgICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV0sXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ2NvdW50J1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWlucyB3aXRoIHRoZSBzYW1lIGFuZCBkaWZmZXJlbnQgZGF0YScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgICAgZmllbGQ6ICdiJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIHNpZ25hbCBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIHNpZ25hbDogJ2ZvbydcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbe1xuICAgICAgICAgICAgc2lnbmFsOiAnZm9vJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHdhcm4gaWYgc29ydHMgY29uZmxpY3QnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYicsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHdhcm4gaWYgc29ydHMgY29uZmxpY3QgZXZlbiBpZiB3ZSBkbyBub3QgdW5pb24nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCB3YXJuIGlmIHdlIGhhZCB0byBkcm9wIGNvbXBsZXggc29ydCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdtZWFuJyxcbiAgICAgICAgICBmaWVsZDogJ2MnXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYidcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZG9tYWluU29ydERyb3BwZWQoe1xuICAgICAgICBvcDogJ21lYW4nLFxuICAgICAgICBmaWVsZDogJ2MnXG4gICAgICB9KSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc29ydCBleHBsaWNpdCBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFtbMSwyLDMsNF0sIFszLDQsNSw2XV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFtbMSwyLDMsNF0sIFszLDQsNSw2XV1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZG9tYWluU29ydCgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgY29udGludW91cyBkb21haW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuTElORUFSKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc29ydCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgYnkgZGVmYXVsdCBmb3IgZGlzY3JldGUgZG9tYWluJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc29ydCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBhc2NlbmRpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIHNvcnQ6ICdhc2NlbmRpbmcnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3J0LCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBpZiBzb3J0ID0gbnVsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIHNvcnQ6IG51bGx9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3JtYWwgc29ydCBzcGVjIGlmIHNwZWNpZmllZCBhbmQgYWdncmVncmF0aW9uIGlzIG5vdCBjb3VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnLCBzb3J0OiB7b3A6ICdzdW0nLCBmaWVsZDoneSd9fSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgYWdncmVnYXRlOiAnc3VtJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1NvcnRGaWVsZD4oc29ydCwge29wOiAnc3VtJywgZmllbGQ6ICd5J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9ybWFsIHNvcnQgc3BlYyBpZiBhZ2dyZWdyYXRpb24gaXMgY291bnQgYW5kIGZpZWxkIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJywgc29ydDoge29wOiAnY291bnQnfX0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIGFnZ3JlZ2F0ZTogJ3N1bScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdTb3J0RmllbGQ+KHNvcnQsIHtvcDogJ2NvdW50J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBzb3J0IGlzIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIGFnZ3JlZ2F0ZTogJ3N1bScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc29ydCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgaWYgc29ydCBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJywgc29ydDogXCJkZXNjZW5kaW5nXCJ9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKSwge29wOiAnbWluJywgZmllbGQ6ICdhJywgb3JkZXI6ICdkZXNjZW5kaW5nJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc29ydCBzcGVjIHVzaW5nIGRlcml2ZWQgc29ydCBpbmRleCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBzb3J0OiBbJ0InLCAnQScsICdDJ119LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKSwge29wOiAnbWluJywgZmllbGQ6ICd4X2Ffc29ydF9pbmRleCcsIG9yZGVyOiAnYXNjZW5kaW5nJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc29ydCB3aXRoIGZsYXR0ZW5lZCBmaWVsZCBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDoge2ZpZWxkOiAnZm9vLmJhcicsIG9wOiAnbWVhbid9fSxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKSwge29wOiAnbWVhbicsIGZpZWxkOiAnZm9vXFxcXC5iYXInfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=