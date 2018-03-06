"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var domain_1 = require("../../../src/compile/scale/domain");
var parse_1 = require("../../../src/compile/scale/parse");
var data_1 = require("../../../src/data");
var log = require("../../../src/log");
var scale_1 = require("../../../src/scale");
var util_1 = require("../../util");
describe('compile/scale', function () {
    describe('parseDomainForChannel()', function () {
        function testParseDomainForChannel(model, channel) {
            // Cannot parseDomain before parseScaleCore
            parse_1.parseScaleCore(model);
            return domain_1.parseDomainForChannel(model, channel);
        }
        it('should have correct domain with x and x2 channel', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    x2: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' },
                    y2: { field: 'd', type: 'quantitative' }
                }
            });
            var xDomain = testParseDomainForChannel(model, 'x');
            chai_1.assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }, { data: 'main', field: 'b' }]);
            var yDomain = testParseDomainForChannel(model, 'y');
            chai_1.assert.deepEqual(yDomain, [{ data: 'main', field: 'c' }, { data: 'main', field: 'd' }]);
        });
        it('should have correct domain for color', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: { field: 'a', type: 'quantitative' },
                }
            });
            var xDomain = testParseDomainForChannel(model, 'color');
            chai_1.assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }]);
        });
        it('should have correct domain for color ConditionField', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: {
                        condition: { selection: 'sel', field: 'a', type: 'quantitative' }
                    }
                }
            });
            var xDomain = testParseDomainForChannel(model, 'color');
            chai_1.assert.deepEqual(xDomain, [{ data: 'main', field: 'a' }]);
        });
        it('should return domain for stack', function () {
            var model = util_1.parseUnitModel({
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
            chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                    data: 'main',
                    field: 'sum_origin_start'
                }, {
                    data: 'main',
                    field: 'sum_origin_end'
                }]);
        });
        it('should return normalize domain for stack if specified', function () {
            var model = util_1.parseUnitModel({
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
            chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [[0, 1]]);
        });
        describe('for quantitative', function () {
            it('should return the right domain for binned Q', log.wrap(function (localLogger) {
                var fieldDef = {
                    bin: { maxbins: 15 },
                    field: 'origin',
                    scale: { domain: 'unaggregated' },
                    type: 'quantitative'
                };
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: fieldDef
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: 'main',
                        field: 'bin_maxbins_15_origin'
                    }, {
                        data: 'main',
                        field: 'bin_maxbins_15_origin_end'
                    }]);
                chai_1.assert.equal(localLogger.warns[0], log.message.unaggregateDomainHasNoEffectForRawField(fieldDef));
            }));
            it('should return the unaggregated domain if requested for non-bin, non-sum Q', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: data_1.MAIN,
                        field: 'min_acceleration'
                    }, {
                        data: data_1.MAIN,
                        field: 'max_acceleration'
                    }]);
            });
            it('should return the aggregated domain for sum Q', log.wrap(function (localLogger) {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.equal(localLogger.warns[0], log.message.unaggregateDomainWithNonSharedDomainOp('sum'));
            }));
            it('should return the right custom domain', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [[0, 200]]);
            });
            it('should ignore the custom domain when binned', log.wrap(function (localLogger) {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [{
                        data: 'main',
                        field: 'bin_maxbins_15_origin'
                    }, {
                        data: 'main',
                        field: 'bin_maxbins_15_origin_end'
                    }]);
                chai_1.assert.equal(localLogger.warns[0], log.message.conflictedDomain("y"));
            }));
            it('should return the aggregated domain if we do not override it', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'origin',
                            type: "quantitative"
                        }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'main',
                        field: 'min_origin'
                    }
                ]);
            });
            it('should use the aggregated data for domain if specified in config', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: data_1.MAIN,
                        field: 'min_acceleration'
                    }, {
                        data: data_1.MAIN,
                        field: 'max_acceleration'
                    }]);
            });
        });
        describe('for time', function () {
            it('should return the correct domain for month T', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin' }]);
            });
            it('should return the correct domain for month O', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin', sort: true }]);
            });
            it('should return the correct domain for yearmonth T', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [{ data: 'main', field: 'yearmonth_origin' }]);
            });
            it('should return the correct domain for month O when specify sort', function () {
                var sortDef = { op: 'mean', field: 'precipitation', order: 'descending' };
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [{
                        data: 'raw',
                        field: 'month_date',
                        sort: sortDef
                    }]);
            });
            it('should return the right custom domain with DateTime objects', function () {
                var model = util_1.parseUnitModel({
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
                chai_1.assert.deepEqual(_domain, [
                    { "signal": "{data: datetime(1970, 0, 1, 0, 0, 0, 0)}" },
                    { "signal": "{data: datetime(1980, 0, 1, 0, 0, 0, 0)}" }
                ]);
            });
        });
        describe('for ordinal', function () {
            it('should have correct domain for binned ordinal color', function () {
                var model = util_1.parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        color: { field: 'a', bin: true, type: 'ordinal' },
                    }
                });
                var xDomain = testParseDomainForChannel(model, 'color');
                chai_1.assert.deepEqual(xDomain, [{ data: 'main', field: 'bin_maxbins_6_a_range', sort: { field: 'bin_maxbins_6_a', op: 'min' } }]);
            });
        });
        describe('for nominal', function () {
            it('should return correct domain with the provided sort property', function () {
                var sortDef = { op: 'min', field: 'Acceleration' };
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal", sort: sortDef }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "raw",
                        field: 'origin',
                        sort: sortDef
                    }]);
            });
            it('should return correct domain with the provided sort property with order property', function () {
                var sortDef = { op: 'min', field: 'Acceleration', order: "descending" };
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal", sort: sortDef }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "raw",
                        field: 'origin',
                        sort: sortDef
                    }]);
            });
            it('should return correct domain without sort if sort is not provided', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "nominal" }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [{
                        data: "main",
                        field: 'origin',
                        sort: true
                    }]);
            });
        });
    });
    describe('mergeDomains()', function () {
        it('should merge the same domains', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should drop field if op is count', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { op: 'count', field: 'b' }
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { op: 'count' }
            });
        });
        it('should sort the output domain if one domain is sorted', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'descending' }
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean', order: 'descending' }
            });
        });
        it('should sort the output domain if one domain is sorted with true', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: true
                }, {
                    data: 'foo',
                    field: 'b',
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
        });
        it('should not sort if no domain is sorted', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b',
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should ignore order ascending as it is the default', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'ascending' }
                }, {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should merge domains with the same data', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a'
            });
        });
        it('should merge domains with the same data source', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b'
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should merge domains with different data source', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: true
                }, {
                    data: 'bar',
                    field: 'a',
                    sort: true
                }]);
            chai_1.assert.deepEqual(domain, {
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
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(domain, {
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
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
                }, {
                    data: 'foo',
                    field: 'b'
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(domain, {
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
            var domain = domain_1.mergeDomains([{
                    signal: 'foo'
                }, {
                    data: 'bar',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(domain, {
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
            var domain = domain_1.mergeDomains([{
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
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if sorts conflict even if we do not union', log.wrap(function (localLogger) {
            var domain = domain_1.mergeDomains([{
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
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: true
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if we had to drop complex sort', log.wrap(function (localLogger) {
            var domain = domain_1.mergeDomains([{
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
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.domainSortDropped({
                op: 'mean',
                field: 'c'
            }));
        }));
        it('should not sort explicit domains', function () {
            var domain = domain_1.mergeDomains([[1, 2, 3, 4], [3, 4, 5, 6]]);
            chai_1.assert.deepEqual(domain, {
                fields: [[1, 2, 3, 4], [3, 4, 5, 6]]
            });
        });
    });
    describe('domainSort()', function () {
        it('should return undefined for continuous domain', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.LINEAR);
            chai_1.assert.deepEqual(sort, undefined);
        });
        it('should return true by default for discrete domain', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, true);
        });
        it('should return true for ascending', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: 'ascending' },
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, true);
        });
        it('should return undefined if sort = null', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: null },
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, undefined);
        });
        it('should return normal sort spec if specified and aggregration is not count', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: { op: 'sum', field: 'y' } },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, { op: 'sum', field: 'y' });
        });
        it('should return normal sort spec if aggregration is count and field not specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: { op: 'count' } },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, { op: 'count' });
        });
        it('should return true if sort is not specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal' },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, true);
        });
        it('should return undefined if sort is specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'nominal', sort: "descending" },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            chai_1.assert.deepEqual(domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL), { op: 'min', field: 'a', order: 'descending' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLDREQUFrRztBQUNsRywwREFBZ0U7QUFFaEUsMENBQXVDO0FBRXZDLHNDQUF3QztBQUN4Qyw0Q0FBNkM7QUFHN0MsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1FBQ2xDLG1DQUFtQyxLQUFnQixFQUFFLE9BQXFCO1lBQ3hFLDJDQUEyQztZQUMzQyxzQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyw4QkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUN6QixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQ3RDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN2QzthQUNGLENBQUMsQ0FBQztZQUVMLElBQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0RCxhQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVB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bUJBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGlCQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7UUFDekgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7U2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2RvbWFpblNvcnQsIG1lcmdlRG9tYWlucywgcGFyc2VEb21haW5Gb3JDaGFubmVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9kb21haW4nO1xuaW1wb3J0IHtwYXJzZVNjYWxlQ29yZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvcGFyc2UnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtNQUlOfSBmcm9tICcuLi8uLi8uLi9zcmMvZGF0YSc7XG5pbXBvcnQge1Bvc2l0aW9uRmllbGREZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7U29ydEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvc29ydCc7XG5pbXBvcnQge1ZnRG9tYWluLCBWZ1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9zY2FsZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlRG9tYWluRm9yQ2hhbm5lbCgpJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSB7XG4gICAgICAvLyBDYW5ub3QgcGFyc2VEb21haW4gYmVmb3JlIHBhcnNlU2NhbGVDb3JlXG4gICAgICBwYXJzZVNjYWxlQ29yZShtb2RlbCk7XG4gICAgICByZXR1cm4gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkb21haW4gd2l0aCB4IGFuZCB4MiBjaGFubmVsJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHgyOiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHkyOiB7ZmllbGQ6ICdkJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgeERvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICd4Jyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHhEb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2EnfSwge2RhdGE6ICdtYWluJywgZmllbGQ6ICdiJ31dKTtcblxuICAgICAgY29uc3QgeURvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICd5Jyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHlEb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2MnfSwge2RhdGE6ICdtYWluJywgZmllbGQ6ICdkJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRvbWFpbiBmb3IgY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ2NvbG9yJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHhEb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2EnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIGZvciBjb2xvciBDb25kaXRpb25GaWVsZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogJ3NlbCcsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAnY29sb3InKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYSd9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBkb21haW4gZm9yIHN0YWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7XG4gICAgICAgICAgICBhZ2dyZWdhdGU6ICdzdW0nLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2NvbG9yJywgdHlwZTogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICBmaWVsZDogJ3N1bV9vcmlnaW5fc3RhcnQnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgZmllbGQ6ICdzdW1fb3JpZ2luX2VuZCdcbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vcm1hbGl6ZSBkb21haW4gZm9yIHN0YWNrIGlmIHNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwiYmFyXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeToge1xuICAgICAgICAgICAgYWdncmVnYXRlOiAnc3VtJyxcbiAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB4OiB7ZmllbGQ6ICd4JywgdHlwZTogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdjb2xvcicsIHR5cGU6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBzdGFjazogXCJub3JtYWxpemVcIlxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFtbMCwgMV1dKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3IgcXVhbnRpdGF0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcmlnaHQgZG9tYWluIGZvciBiaW5uZWQgUScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZERlZjogUG9zaXRpb25GaWVsZERlZjxzdHJpbmc+ID0ge1xuICAgICAgICAgIGJpbjoge21heGJpbnM6IDE1fSxcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfSxcbiAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IGZpZWxkRGVmXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGZpZWxkOiAnYmluX21heGJpbnNfMTVfb3JpZ2luJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGZpZWxkOiAnYmluX21heGJpbnNfMTVfb3JpZ2luX2VuZCdcbiAgICAgICAgICB9XSk7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbkhhc05vRWZmZWN0Rm9yUmF3RmllbGQoZmllbGREZWYpKTtcbiAgICAgIH0pKTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHVuYWdncmVnYXRlZCBkb21haW4gaWYgcmVxdWVzdGVkIGZvciBub24tYmluLCBub24tc3VtIFEnLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtZWFuJyxcbiAgICAgICAgICAgICAgICBmaWVsZDogJ2FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogTUFJTixcbiAgICAgICAgICAgIGZpZWxkOiAnbWluX2FjY2VsZXJhdGlvbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtYXhfYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH1dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBhZ2dyZWdhdGVkIGRvbWFpbiBmb3Igc3VtIFEnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ3N1bScsXG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfSxcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKFxuICAgICAgICAgIGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcCgnc3VtJylcbiAgICAgICAgKTtcbiAgICAgIH0pKTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJpZ2h0IGN1c3RvbSBkb21haW4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBmaWVsZDogJ2hvcnNlcG93ZXInLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogWzAsMjAwXX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW1swLCAyMDBdXSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBpZ25vcmUgdGhlIGN1c3RvbSBkb21haW4gd2hlbiBiaW5uZWQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZScsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiBbMCwyMDBdfSxcbiAgICAgICAgICAgICAgYmluOiB7bWF4YmluczogMTV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFt7XG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBmaWVsZDogJ2Jpbl9tYXhiaW5zXzE1X29yaWdpbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBmaWVsZDogJ2Jpbl9tYXhiaW5zXzE1X29yaWdpbl9lbmQnXG4gICAgICAgICAgfV0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmNvbmZsaWN0ZWREb21haW4oXCJ5XCIpKTtcbiAgICAgIH0pKTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGFnZ3JlZ2F0ZWQgZG9tYWluIGlmIHdlIGRvIG5vdCBvdmVycmlkZSBpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgYWdncmVnYXRlOiAnbWluJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGZpZWxkOiAnbWluX29yaWdpbidcbiAgICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIHRoZSBhZ2dyZWdhdGVkIGRhdGEgZm9yIGRvbWFpbiBpZiBzcGVjaWZpZWQgaW4gY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtaW4nLFxuICAgICAgICAgICAgICBmaWVsZDogJ2FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgICAgdXNlVW5hZ2dyZWdhdGVkRG9tYWluOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICAgIGRhdGE6IE1BSU4sXG4gICAgICAgICAgICBmaWVsZDogJ21pbl9hY2NlbGVyYXRpb24nXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0YTogTUFJTixcbiAgICAgICAgICAgIGZpZWxkOiAnbWF4X2FjY2VsZXJhdGlvbidcbiAgICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3IgdGltZScsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgZG9tYWluIGZvciBtb250aCBUJyxcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwidGVtcG9yYWxcIixcbiAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ21vbnRoJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ21vbnRoX29yaWdpbid9XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgbW9udGggTycsXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwib3JkaW5hbFwiLFxuICAgICAgICAgICAgICAgICAgdGltZVVuaXQ6ICdtb250aCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnbW9udGhfb3JpZ2luJywgc29ydDogdHJ1ZX1dKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBkb21haW4gZm9yIHllYXJtb250aCBUJyxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICAgICAgdGltZVVuaXQ6ICd5ZWFybW9udGgnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG5cbiAgICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAneWVhcm1vbnRoX29yaWdpbid9XSk7XG4gICAgICAgICAgfSk7XG5cblxuICAgICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBkb21haW4gZm9yIG1vbnRoIE8gd2hlbiBzcGVjaWZ5IHNvcnQnLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3Qgc29ydERlZjogU29ydEZpZWxkPHN0cmluZz4gPSB7b3A6ICdtZWFuJywgZmllbGQ6ICdwcmVjaXBpdGF0aW9uJywgb3JkZXI6ICdkZXNjZW5kaW5nJ30gO1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICAgIG1hcms6IFwiYmFyXCIsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgdGltZVVuaXQ6ICdtb250aCcsXG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ2RhdGUnLFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgICAgICAgICAgICAgc29ydDogc29ydERlZlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgYWdncmVnYXRlOiAnbWVhbicsXG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ3ByZWNpcGl0YXRpb24nLFxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3gnKTtcblxuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe1xuICAgICAgICAgICAgICBkYXRhOiAncmF3JyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdtb250aF9kYXRlJyxcbiAgICAgICAgICAgICAgc29ydDogc29ydERlZlxuICAgICAgICAgICAgfV0pO1xuICAgICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHJpZ2h0IGN1c3RvbSBkb21haW4gd2l0aCBEYXRlVGltZSBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICd5ZWFyJyxcbiAgICAgICAgICAgICAgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogW3t5ZWFyOiAxOTcwfSwge3llYXI6IDE5ODB9XX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW1xuICAgICAgICAgIHtcInNpZ25hbFwiOiBcIntkYXRhOiBkYXRldGltZSgxOTcwLCAwLCAxLCAwLCAwLCAwLCAwKX1cIn0sXG4gICAgICAgICAge1wic2lnbmFsXCI6IFwie2RhdGE6IGRhdGV0aW1lKDE5ODAsIDAsIDEsIDAsIDAsIDAsIDApfVwifVxuICAgICAgICBdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkb21haW4gZm9yIGJpbm5lZCBvcmRpbmFsIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnYScsIGJpbjogdHJ1ZSwgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHhEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAnY29sb3InKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh4RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdiaW5fbWF4Ymluc182X2FfcmFuZ2UnLCBzb3J0OiB7ZmllbGQ6ICdiaW5fbWF4Ymluc182X2EnLCBvcDogJ21pbid9fV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIG5vbWluYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZG9tYWluIHdpdGggdGhlIHByb3ZpZGVkIHNvcnQgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc29ydERlZjogU29ydEZpZWxkPHN0cmluZz4gPSB7b3A6ICdtaW4nIGFzICdtaW4nLCBmaWVsZDonQWNjZWxlcmF0aW9uJ307XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNvcnQ6IHNvcnREZWZ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogXCJyYXdcIixcbiAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkb21haW4gd2l0aCB0aGUgcHJvdmlkZWQgc29ydCBwcm9wZXJ0eSB3aXRoIG9yZGVyIHByb3BlcnR5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHNvcnREZWY6IFNvcnRGaWVsZDxzdHJpbmc+ID0ge29wOiAnbWluJywgZmllbGQ6J0FjY2VsZXJhdGlvbicsIG9yZGVyOiBcImRlc2NlbmRpbmdcIn0gO1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwiLCBzb3J0OiBzb3J0RGVmfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogXCJyYXdcIixcbiAgICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICAgIHNvcnQ6IHNvcnREZWZcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZG9tYWluIHdpdGhvdXQgc29ydCBpZiBzb3J0IGlzIG5vdCBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ29yaWdpbicsIHR5cGU6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgZGF0YTogXCJtYWluXCIsXG4gICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdtZXJnZURvbWFpbnMoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1lcmdlIHRoZSBzYW1lIGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBmaWVsZCBpZiBvcCBpcyBjb3VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge29wOiAnY291bnQnLCBmaWVsZDogJ2InfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtvcDogJ2NvdW50J31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzb3J0IHRoZSBvdXRwdXQgZG9tYWluIGlmIG9uZSBkb21haW4gaXMgc29ydGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJywgb3JkZXI6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJywgb3JkZXI6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzb3J0IHRoZSBvdXRwdXQgZG9tYWluIGlmIG9uZSBkb21haW4gaXMgc29ydGVkIHdpdGggdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzb3J0IGlmIG5vIGRvbWFpbiBpcyBzb3J0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYicsXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZHM6IFsnYScsICdiJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgb3JkZXIgYXNjZW5kaW5nIGFzIGl0IGlzIHRoZSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJywgb3JkZXI6ICdhc2NlbmRpbmcnfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWlucyB3aXRoIHRoZSBzYW1lIGRhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWlucyB3aXRoIHRoZSBzYW1lIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgZG9tYWlucyB3aXRoIGRpZmZlcmVudCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCBkaWZmZXJlbnQgZGF0YSBhbmQgc29ydCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCB0aGUgc2FtZSBhbmQgZGlmZmVyZW50IGRhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYidcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbe1xuICAgICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICAgIGZpZWxkOiAnYidcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBzaWduYWwgZG9tYWlucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBzaWduYWw6ICdmb28nXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICAgIHNpZ25hbDogJ2ZvbydcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB3YXJuIGlmIHNvcnRzIGNvbmZsaWN0JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ2NvdW50J1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZHM6IFsnYScsICdiJ10sXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCB3YXJuIGlmIHNvcnRzIGNvbmZsaWN0IGV2ZW4gaWYgd2UgZG8gbm90IHVuaW9uJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ2NvdW50J1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgd2FybiBpZiB3ZSBoYWQgdG8gZHJvcCBjb21wbGV4IHNvcnQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnbWVhbicsXG4gICAgICAgICAgZmllbGQ6ICdjJ1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZHM6IFsnYScsICdiJ10sXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmRvbWFpblNvcnREcm9wcGVkKHtcbiAgICAgICAgb3A6ICdtZWFuJyxcbiAgICAgICAgZmllbGQ6ICdjJ1xuICAgICAgfSkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgbm90IHNvcnQgZXhwbGljaXQgZG9tYWlucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbWzEsMiwzLDRdLCBbMyw0LDUsNl1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbWzEsMiwzLDRdLCBbMyw0LDUsNl1dXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RvbWFpblNvcnQoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIGNvbnRpbnVvdXMgZG9tYWluJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLkxJTkVBUik7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGJ5IGRlZmF1bHQgZm9yIGRpc2NyZXRlIGRvbWFpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgYXNjZW5kaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBzb3J0OiAnYXNjZW5kaW5nJ30sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc29ydCwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgaWYgc29ydCA9IG51bGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBzb3J0OiBudWxsfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLk9SRElOQUwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3J0LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9ybWFsIHNvcnQgc3BlYyBpZiBzcGVjaWZpZWQgYW5kIGFnZ3JlZ3JhdGlvbiBpcyBub3QgY291bnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJywgc29ydDoge29wOiAnc3VtJywgZmllbGQ6J3knfX0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIGFnZ3JlZ2F0ZTogJ3N1bScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvcnQgPSBkb21haW5Tb3J0KG1vZGVsLCAneCcsIFNjYWxlVHlwZS5PUkRJTkFMKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdTb3J0RmllbGQ+KHNvcnQsIHtvcDogJ3N1bScsIGZpZWxkOiAneSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG5vcm1hbCBzb3J0IHNwZWMgaWYgYWdncmVncmF0aW9uIGlzIGNvdW50IGFuZCBmaWVsZCBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCcsIHNvcnQ6IHtvcDogJ2NvdW50J319LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihzb3J0LCB7b3A6ICdjb3VudCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgc29ydCBpcyBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIHNvcnQgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCcsIHNvcnQ6IFwiZGVzY2VuZGluZ1wifSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgYWdncmVnYXRlOiAnc3VtJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1NvcnRGaWVsZD4oZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCksIHtvcDogJ21pbicsIGZpZWxkOiAnYScsIG9yZGVyOiAnZGVzY2VuZGluZyd9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==