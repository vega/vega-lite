"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var domain_1 = require("../../../src/compile/scale/domain");
var parse_1 = require("../../../src/compile/scale/parse");
var data_1 = require("../../../src/data");
var log = tslib_1.__importStar(require("../../../src/log"));
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
                    color: { field: 'a', type: 'quantitative' }
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
                mark: 'bar',
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'origin',
                        type: 'quantitative'
                    },
                    x: { field: 'x', type: 'ordinal' },
                    color: { field: 'color', type: 'ordinal' }
                }
            });
            chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                {
                    data: 'main',
                    field: 'sum_origin_start'
                },
                {
                    data: 'main',
                    field: 'sum_origin_end'
                }
            ]);
        });
        it('should return normalize domain for stack if specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'origin',
                        type: 'quantitative'
                    },
                    x: { field: 'x', type: 'ordinal' },
                    color: { field: 'color', type: 'ordinal' }
                },
                config: {
                    stack: 'normalize'
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
                    mark: 'point',
                    encoding: {
                        y: fieldDef
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'main',
                        field: 'bin_maxbins_15_origin'
                    },
                    {
                        data: 'main',
                        field: 'bin_maxbins_15_origin_end'
                    }
                ]);
                chai_1.assert.equal(localLogger.warns[0], log.message.unaggregateDomainHasNoEffectForRawField(fieldDef));
            }));
            it('should follow the custom bin.extent for binned Q', log.wrap(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'quantitative',
                            bin: { maxbins: 15, extent: [0, 100] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                chai_1.assert.deepEqual(_domain, [[0, 100]]);
            }));
            it('should return the unaggregated domain if requested for non-bin, non-sum Q', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            aggregate: 'mean',
                            field: 'acceleration',
                            scale: { domain: 'unaggregated' },
                            type: 'quantitative'
                        }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: data_1.MAIN,
                        field: 'min_acceleration'
                    },
                    {
                        data: data_1.MAIN,
                        field: 'max_acceleration'
                    }
                ]);
            });
            it('should return the aggregated domain for sum Q', log.wrap(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            aggregate: 'sum',
                            field: 'origin',
                            scale: { domain: 'unaggregated' },
                            type: 'quantitative'
                        }
                    }
                });
                testParseDomainForChannel(model, 'y');
                chai_1.assert.equal(localLogger.warns[0], log.message.unaggregateDomainWithNonSharedDomainOp('sum'));
            }));
            it('should return the right custom domain', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'horsepower',
                            type: 'quantitative',
                            scale: { domain: [0, 200] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                chai_1.assert.deepEqual(_domain, [[0, 200]]);
            });
            it('should follow the custom domain despite bin', log.wrap(function (localLogger) {
                var model = util_1.parseUnitModel({
                    mark: 'point',
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
                chai_1.assert.deepEqual(_domain, [[0, 200]]);
            }));
            it('should return the aggregated domain if we do not override it', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'origin',
                            type: 'quantitative'
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
                    mark: 'point',
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'acceleration',
                            type: 'quantitative'
                        }
                    },
                    config: {
                        scale: {
                            useUnaggregatedDomain: true
                        }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: data_1.MAIN,
                        field: 'min_acceleration'
                    },
                    {
                        data: data_1.MAIN,
                        field: 'max_acceleration'
                    }
                ]);
            });
        });
        describe('for time', function () {
            it('should return the correct domain for month T', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'temporal',
                            timeUnit: 'month'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                chai_1.assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin' }]);
            });
            it('should return the correct domain for month O', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'ordinal',
                            timeUnit: 'month'
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                chai_1.assert.deepEqual(_domain, [{ data: 'main', field: 'month_origin', sort: true }]);
            });
            it('should return the correct domain for yearmonth T', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'origin',
                            type: 'temporal',
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
                    mark: 'bar',
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
                chai_1.assert.deepEqual(_domain, [
                    {
                        data: 'raw',
                        field: 'month_date',
                        sort: sortDef
                    }
                ]);
            });
            it('should return the right custom domain with DateTime objects', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'year',
                            type: 'temporal',
                            scale: { domain: [{ year: 1970 }, { year: 1980 }] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                expect(_domain).toEqual([
                    { signal: '{data: datetime(1970, 0, 1, 0, 0, 0, 0)}' },
                    { signal: '{data: datetime(1980, 0, 1, 0, 0, 0, 0)}' }
                ]);
            });
            it('should return the right custom domain with date strings', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: {
                            field: 'year',
                            type: 'temporal',
                            scale: { domain: ['Jan 1, 2007', 'Jan 1, 2009'] }
                        }
                    }
                });
                var _domain = testParseDomainForChannel(model, 'y');
                expect(_domain).toEqual([
                    { signal: "{data: datetime(\"Jan 1, 2007\")}" },
                    { signal: "{data: datetime(\"Jan 1, 2009\")}" }
                ]);
            });
        });
        describe('for ordinal', function () {
            it('should have correct domain for binned ordinal color', function () {
                var model = util_1.parseUnitModel({
                    mark: 'bar',
                    encoding: {
                        color: { field: 'a', bin: true, type: 'ordinal' }
                    }
                });
                var xDomain = testParseDomainForChannel(model, 'color');
                chai_1.assert.deepEqual(xDomain, [
                    { data: 'main', field: 'bin_maxbins_6_a_range', sort: { field: 'bin_maxbins_6_a', op: 'min' } }
                ]);
            });
        });
        describe('for nominal', function () {
            it('should return correct domain with the provided sort property', function () {
                var sortDef = { op: 'min', field: 'Acceleration' };
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: { field: 'origin', type: 'nominal', sort: sortDef }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'raw',
                        field: 'origin',
                        sort: sortDef
                    }
                ]);
            });
            it('should return correct domain with the provided sort property with order property', function () {
                var sortDef = { op: 'min', field: 'Acceleration', order: 'descending' };
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: { field: 'origin', type: 'nominal', sort: sortDef }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'raw',
                        field: 'origin',
                        sort: sortDef
                    }
                ]);
            });
            it('should return correct domain without sort if sort is not provided', function () {
                var model = util_1.parseUnitModel({
                    mark: 'point',
                    encoding: {
                        y: { field: 'origin', type: 'nominal' }
                    }
                });
                chai_1.assert.deepEqual(testParseDomainForChannel(model, 'y'), [
                    {
                        data: 'main',
                        field: 'origin',
                        sort: true
                    }
                ]);
            });
        });
    });
    describe('mergeDomains()', function () {
        it('should merge the same domains', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                },
                {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should drop field if op is count', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: { op: 'count', field: 'b' }
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { op: 'count' }
            });
        });
        it('should sort the output domain if one domain is sorted', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a'
                },
                {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'descending' }
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean', order: 'descending' }
            });
        });
        it('should sort the output domain if one domain is sorted with true', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: true
                },
                {
                    data: 'foo',
                    field: 'b'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
        });
        it('should not sort if no domain is sorted', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a'
                },
                {
                    data: 'foo',
                    field: 'b'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should ignore order ascending as it is the default', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean', order: 'ascending' }
                },
                {
                    data: 'foo',
                    field: 'a',
                    sort: { field: 'b', op: 'mean' }
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: { field: 'b', op: 'mean' }
            });
        });
        it('should merge domains with the same data', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a'
                },
                {
                    data: 'foo',
                    field: 'a'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a'
            });
        });
        it('should merge domains with the same data source', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a'
                },
                {
                    data: 'foo',
                    field: 'b'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b']
            });
        });
        it('should merge domains with different data source', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: true
                },
                {
                    data: 'bar',
                    field: 'a',
                    sort: true
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                fields: [
                    {
                        data: 'foo',
                        field: 'a'
                    },
                    {
                        data: 'bar',
                        field: 'a'
                    }
                ],
                sort: true
            });
        });
        it('should merge domains with different data and sort', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                },
                {
                    data: 'bar',
                    field: 'a'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                fields: [
                    {
                        data: 'foo',
                        field: 'a'
                    },
                    {
                        data: 'bar',
                        field: 'a'
                    }
                ],
                sort: {
                    op: 'count'
                }
            });
        });
        it('should merge domains with the same and different data', function () {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a'
                },
                {
                    data: 'foo',
                    field: 'b'
                },
                {
                    data: 'bar',
                    field: 'a'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                fields: [
                    {
                        data: 'foo',
                        field: 'a'
                    },
                    {
                        data: 'foo',
                        field: 'b'
                    },
                    {
                        data: 'bar',
                        field: 'a'
                    }
                ]
            });
        });
        it('should merge signal domains', function () {
            var domain = domain_1.mergeDomains([
                {
                    signal: 'foo'
                },
                {
                    data: 'bar',
                    field: 'a'
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                fields: [
                    {
                        signal: 'foo'
                    },
                    {
                        data: 'bar',
                        field: 'a'
                    }
                ]
            });
        });
        it('should warn if sorts conflict', log.wrap(function (localLogger) {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                },
                {
                    data: 'foo',
                    field: 'b',
                    sort: true
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if sorts conflict even if we do not union', log.wrap(function (localLogger) {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'count'
                    }
                },
                {
                    data: 'foo',
                    field: 'a',
                    sort: true
                }
            ]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                field: 'a',
                sort: true
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.MORE_THAN_ONE_SORT);
        }));
        it('should warn if we had to drop complex sort', log.wrap(function (localLogger) {
            var domain = domain_1.mergeDomains([
                {
                    data: 'foo',
                    field: 'a',
                    sort: {
                        op: 'mean',
                        field: 'c'
                    }
                },
                {
                    data: 'foo',
                    field: 'b'
                }
            ]);
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
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.LINEAR);
            chai_1.assert.deepEqual(sort, undefined);
        });
        it('should return true by default for discrete domain', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, true);
        });
        it('should return true for ascending', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: 'ascending' }
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL);
            chai_1.assert.deepEqual(sort, true);
        });
        it('should return undefined if sort = null', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative', sort: null }
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
                    x: { field: 'a', type: 'nominal', sort: 'descending' },
                    y: { field: 'b', aggregate: 'sum', type: 'quantitative' }
                }
            });
            chai_1.assert.deepEqual(domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL), {
                op: 'min',
                field: 'a',
                order: 'descending'
            });
        });
        it('should return sort spec using derived sort index', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: ['B', 'A', 'C'] },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            chai_1.assert.deepEqual(domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL), {
                op: 'min',
                field: 'x_a_sort_index',
                order: 'ascending'
            });
        });
        it('should return sort with flattened field access', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: { field: 'foo.bar', op: 'mean' } }
                }
            });
            chai_1.assert.deepEqual(domain_1.domainSort(model, 'x', scale_1.ScaleType.ORDINAL), { op: 'mean', field: 'foo\\.bar' });
        });
    });
});
//# sourceMappingURL=domain.test.js.map