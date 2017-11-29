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
        it('should sort the output domain, if one domain is sorted', function () {
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
        it('should ignore order: ascending', function () {
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
                    field: 'b'
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: true
            });
        });
        it('should maintain sort even if false', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: false
                }, {
                    data: 'foo',
                    field: 'b',
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: false
            });
        });
        it('should ignore sort false if there is another sort', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a',
                    sort: false
                }, {
                    data: 'foo',
                    field: 'b',
                    sort: {
                        op: 'count'
                    }
                }]);
            chai_1.assert.deepEqual(domain, {
                data: 'foo',
                fields: ['a', 'b'],
                sort: {
                    op: 'count'
                }
            });
        });
        it('should merge domains with different data', function () {
            var domain = domain_1.mergeDomains([{
                    data: 'foo',
                    field: 'a'
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
                    }],
                sort: true
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
                ],
                sort: true
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
    });
    describe('domainSort()', function () {
        it('should return undefined for discrete domain', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                }
            });
            var sort = domain_1.domainSort(model, 'x', scale_1.ScaleType.LINEAR);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLDREQUFrRztBQUNsRywwREFBZ0U7QUFFaEUsMENBQXVDO0FBRXZDLHNDQUF3QztBQUN4Qyw0Q0FBNkM7QUFHN0MsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDeEIsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1FBQ2xDLG1DQUFtQyxLQUFnQixFQUFFLE9BQXFCO1lBQ3hFLDJDQUEyQztZQUMzQyxzQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyw4QkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUN6QixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQ3RDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN2QzthQUNGLENBQUMsQ0FBQztZQUVMLElBQU0sT0FBTyxHQUFHLHlCQUF5QixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0RCxhQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVB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QUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBQztvQkFDcEQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3hEO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLFNBQVMsQ0FBYyxtQkFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsaUJBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztRQUN6SCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7ZG9tYWluU29ydCwgbWVyZ2VEb21haW5zLCBwYXJzZURvbWFpbkZvckNoYW5uZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL2RvbWFpbic7XG5pbXBvcnQge3BhcnNlU2NhbGVDb3JlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9wYXJzZSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge01BSU59IGZyb20gJy4uLy4uLy4uL3NyYy9kYXRhJztcbmltcG9ydCB7UG9zaXRpb25GaWVsZERlZn0gZnJvbSAnLi4vLi4vLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtTb3J0RmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy9zb3J0JztcbmltcG9ydCB7VmdEb21haW4sIFZnU29ydEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL3NjYWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VEb21haW5Gb3JDaGFubmVsKCknLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgICAgIC8vIENhbm5vdCBwYXJzZURvbWFpbiBiZWZvcmUgcGFyc2VTY2FsZUNvcmVcbiAgICAgIHBhcnNlU2NhbGVDb3JlKG1vZGVsKTtcbiAgICAgIHJldHVybiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsIGNoYW5uZWwpO1xuICAgIH1cblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRvbWFpbiB3aXRoIHggYW5kIHgyIGNoYW5uZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeDI6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeTI6IHtmaWVsZDogJ2QnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zdCB4RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ3gnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYSd9LCB7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2InfV0pO1xuXG4gICAgICBjb25zdCB5RG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgJ3knKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeURvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYyd9LCB7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2QnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZG9tYWluIGZvciBjb2xvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHhEb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCAnY29sb3InKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeERvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnYSd9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBkb21haW4gZm9yIGNvbG9yIENvbmRpdGlvbkZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAnc2VsJywgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgeERvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICdjb2xvcicpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh4RG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdhJ31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGRvbWFpbiBmb3Igc3RhY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcImJhclwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ3N1bScsXG4gICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnY29sb3InLCB0eXBlOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgIGZpZWxkOiAnc3VtX29yaWdpbl9zdGFydCdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICBmaWVsZDogJ3N1bV9vcmlnaW5fZW5kJ1xuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbm9ybWFsaXplIGRvbWFpbiBmb3Igc3RhY2sgaWYgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7XG4gICAgICAgICAgICBhZ2dyZWdhdGU6ICdzdW0nLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2NvbG9yJywgdHlwZTogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIHN0YWNrOiBcIm5vcm1hbGl6ZVwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW1swLCAxXV0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBxdWFudGl0YXRpdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSByaWdodCBkb21haW4gZm9yIGJpbm5lZCBRJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkRGVmOiBQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz4gPSB7XG4gICAgICAgICAgYmluOiB7bWF4YmluczogMTV9LFxuICAgICAgICAgIGZpZWxkOiAnb3JpZ2luJyxcbiAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeTogZmllbGREZWZcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdiaW5fbWF4Ymluc18xNV9vcmlnaW4nXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdiaW5fbWF4Ymluc18xNV9vcmlnaW5fZW5kJ1xuICAgICAgICAgIH1dKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZikpO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiByZXF1ZXN0ZWQgZm9yIG5vbi1iaW4sIG5vbi1zdW0gUScsXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21lYW4nLFxuICAgICAgICAgICAgICAgIGZpZWxkOiAnYWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtaW5fYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6IE1BSU4sXG4gICAgICAgICAgICBmaWVsZDogJ21heF9hY2NlbGVyYXRpb24nXG4gICAgICAgICAgfV0pO1xuICAgICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGFnZ3JlZ2F0ZWQgZG9tYWluIGZvciBzdW0gUScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgYWdncmVnYXRlOiAnc3VtJyxcbiAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjogJ3VuYWdncmVnYXRlZCd9LFxuICAgICAgICAgICAgICB0eXBlOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoXG4gICAgICAgICAgbG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKCdzdW0nKVxuICAgICAgICApO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcmlnaHQgY3VzdG9tIGRvbWFpbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnaG9yc2Vwb3dlcicsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiBbMCwyMDBdfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbWzAsIDIwMF1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGlnbm9yZSB0aGUgY3VzdG9tIGRvbWFpbiB3aGVuIGJpbm5lZCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJyxcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IFswLDIwMF19LFxuICAgICAgICAgICAgICBiaW46IHttYXhiaW5zOiAxNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGZpZWxkOiAnYmluX21heGJpbnNfMTVfb3JpZ2luJ1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGE6ICdtYWluJyxcbiAgICAgICAgICAgIGZpZWxkOiAnYmluX21heGJpbnNfMTVfb3JpZ2luX2VuZCdcbiAgICAgICAgICB9XSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuY29uZmxpY3RlZERvbWFpbihcInlcIikpO1xuICAgICAgfSkpO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgYWdncmVnYXRlZCBkb21haW4gaWYgd2UgZG8gbm90IG92ZXJyaWRlIGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtaW4nLFxuICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGF0YTogJ21haW4nLFxuICAgICAgICAgICAgZmllbGQ6ICdtaW5fb3JpZ2luJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgdGhlIGFnZ3JlZ2F0ZWQgZGF0YSBmb3IgZG9tYWluIGlmIHNwZWNpZmllZCBpbiBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgIGFnZ3JlZ2F0ZTogJ21pbicsXG4gICAgICAgICAgICAgIGZpZWxkOiAnYWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAgICAgdHlwZTogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgICB1c2VVbmFnZ3JlZ2F0ZWREb21haW46IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwodGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpLCBbe1xuICAgICAgICAgICAgZGF0YTogTUFJTixcbiAgICAgICAgICAgIGZpZWxkOiAnbWluX2FjY2VsZXJhdGlvbidcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRhOiBNQUlOLFxuICAgICAgICAgICAgZmllbGQ6ICdtYXhfYWNjZWxlcmF0aW9uJ1xuICAgICAgICAgIH1dKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciB0aW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgY29ycmVjdCBkb21haW4gZm9yIG1vbnRoIFQnLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICAgIHRpbWVVbml0OiAnbW9udGgnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoX2RvbWFpbiwgW3tkYXRhOiAnbWFpbicsIGZpZWxkOiAnbW9udGhfb3JpZ2luJ31dKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGNvcnJlY3QgZG9tYWluIGZvciBtb250aCBPJyxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJvcmRpbmFsXCIsXG4gICAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ21vbnRoJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneScpO1xuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICdtb250aF9vcmlnaW4nLCBzb3J0OiB0cnVlfV0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgeWVhcm1vbnRoIFQnLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ3llYXJtb250aCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgX2RvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKTtcblxuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbe2RhdGE6ICdtYWluJywgZmllbGQ6ICd5ZWFybW9udGhfb3JpZ2luJ31dKTtcbiAgICAgICAgICB9KTtcblxuXG4gICAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSBjb3JyZWN0IGRvbWFpbiBmb3IgbW9udGggTyB3aGVuIHNwZWNpZnkgc29ydCcsXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBzb3J0RGVmOiBTb3J0RmllbGQ8c3RyaW5nPiA9IHtvcDogJ21lYW4nLCBmaWVsZDogJ3ByZWNpcGl0YXRpb24nLCBvcmRlcjogJ2Rlc2NlbmRpbmcnfSA7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICAgICAgbWFyazogXCJiYXJcIixcbiAgICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgICAgICB0aW1lVW5pdDogJ21vbnRoJyxcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZGF0ZScsXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnb3JkaW5hbCcsXG4gICAgICAgICAgICAgICAgICBzb3J0OiBzb3J0RGVmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICBhZ2dyZWdhdGU6ICdtZWFuJyxcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiAncHJlY2lwaXRhdGlvbicsXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBfZG9tYWluID0gdGVzdFBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwneCcpO1xuXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKF9kb21haW4sIFt7XG4gICAgICAgICAgICAgIGRhdGE6ICdyYXcnLFxuICAgICAgICAgICAgICBmaWVsZDogJ21vbnRoX2RhdGUnLFxuICAgICAgICAgICAgICBzb3J0OiBzb3J0RGVmXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiB0aGUgcmlnaHQgY3VzdG9tIGRvbWFpbiB3aXRoIERhdGVUaW1lIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICBmaWVsZDogJ3llYXInLFxuICAgICAgICAgICAgICB0eXBlOiBcInRlbXBvcmFsXCIsXG4gICAgICAgICAgICAgIHNjYWxlOiB7ZG9tYWluOiBbe3llYXI6IDE5NzB9LCB7eWVhcjogMTk4MH1dfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IF9kb21haW4gPSB0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5Jyk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChfZG9tYWluLCBbXG4gICAgICAgICAge1wic2lnbmFsXCI6IFwie2RhdGE6IGRhdGV0aW1lKDE5NzAsIDAsIDEsIDAsIDAsIDAsIDApfVwifSxcbiAgICAgICAgICB7XCJzaWduYWxcIjogXCJ7ZGF0YTogZGF0ZXRpbWUoMTk4MCwgMCwgMSwgMCwgMCwgMCwgMCl9XCJ9XG4gICAgICAgIF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIG9yZGluYWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRvbWFpbiBmb3IgYmlubmVkIG9yZGluYWwgY29sb3InLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICdhJywgYmluOiB0cnVlLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgeERvbWFpbiA9IHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsICdjb2xvcicpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHhEb21haW4sIFt7ZGF0YTogJ21haW4nLCBmaWVsZDogJ2Jpbl9tYXhiaW5zXzZfYV9yYW5nZScsIHNvcnQ6IHtmaWVsZDogJ2Jpbl9tYXhiaW5zXzZfYScsIG9wOiAnbWluJ319XSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3Igbm9taW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkb21haW4gd2l0aCB0aGUgcHJvdmlkZWQgc29ydCBwcm9wZXJ0eScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBzb3J0RGVmOiBTb3J0RmllbGQ8c3RyaW5nPiA9IHtvcDogJ21pbicgYXMgJ21pbicsIGZpZWxkOidBY2NlbGVyYXRpb24nfTtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB5OiB7ZmllbGQ6ICdvcmlnaW4nLCB0eXBlOiBcIm5vbWluYWxcIiwgc29ydDogc29ydERlZn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBcInJhd1wiLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgc29ydDogc29ydERlZlxuICAgICAgICAgIH1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGRvbWFpbiB3aXRoIHRoZSBwcm92aWRlZCBzb3J0IHByb3BlcnR5IHdpdGggb3JkZXIgcHJvcGVydHknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc29ydERlZjogU29ydEZpZWxkPHN0cmluZz4gPSB7b3A6ICdtaW4nLCBmaWVsZDonQWNjZWxlcmF0aW9uJywgb3JkZXI6IFwiZGVzY2VuZGluZ1wifSA7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCIsIHNvcnQ6IHNvcnREZWZ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0ZXN0UGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCd5JyksIFt7XG4gICAgICAgICAgICBkYXRhOiBcInJhd1wiLFxuICAgICAgICAgICAgZmllbGQ6ICdvcmlnaW4nLFxuICAgICAgICAgICAgc29ydDogc29ydERlZlxuICAgICAgICB9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkb21haW4gd2l0aG91dCBzb3J0IGlmIHNvcnQgaXMgbm90IHByb3ZpZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeToge2ZpZWxkOiAnb3JpZ2luJywgdHlwZTogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHRlc3RQYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsJ3knKSwgW3tcbiAgICAgICAgICBkYXRhOiBcIm1haW5cIixcbiAgICAgICAgICBmaWVsZDogJ29yaWdpbicsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9XSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21lcmdlRG9tYWlucygpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVyZ2UgdGhlIHNhbWUgZG9tYWlucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbid9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGZpZWxkIGlmIG9wIGlzIGNvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7b3A6ICdjb3VudCcsIGZpZWxkOiAnYid9XG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge29wOiAnY291bnQnfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNvcnQgdGhlIG91dHB1dCBkb21haW4sIGlmIG9uZSBkb21haW4gaXMgc29ydGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJywgb3JkZXI6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RvbWFpbj4oZG9tYWluLCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6ICdiJywgb3A6ICdtZWFuJywgb3JkZXI6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgb3JkZXI6IGFzY2VuZGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IG1lcmdlRG9tYWlucyhbe1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiAnYicsIG9wOiAnbWVhbicsIG9yZGVyOiAnYXNjZW5kaW5nJ31cbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogJ2InLCBvcDogJ21lYW4nfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMgd2l0aCB0aGUgc2FtZSBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc29ydCBldmVuIGlmIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgc29ydDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpZ25vcmUgc29ydCBmYWxzZSBpZiB0aGVyZSBpcyBhbm90aGVyIHNvcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRG9tYWluPihkb21haW4sIHtcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggZGlmZmVyZW50IGRhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH0sIHtcbiAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkb21haW4sIHtcbiAgICAgICAgZmllbGRzOiBbe1xuICAgICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICAgIGZpZWxkOiAnYSdcbiAgICAgICAgfV0sXG4gICAgICAgIHNvcnQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggZGlmZmVyZW50IGRhdGEgYW5kIHNvcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ2NvdW50J1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEb21haW4+KGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgICB9XSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9wOiAnY291bnQnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zIHdpdGggdGhlIHNhbWUgYW5kIGRpZmZlcmVudCBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9LCB7XG4gICAgICAgIGRhdGE6ICdiYXInLFxuICAgICAgICBmaWVsZDogJ2EnXG4gICAgICB9XSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZG9tYWluLCB7XG4gICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgICBmaWVsZDogJ2InXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgIH1dLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2Ugc2lnbmFsIGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgc2lnbmFsOiAnZm9vJ1xuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnYmFyJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBmaWVsZHM6IFt7XG4gICAgICAgICAgICBzaWduYWw6ICdmb28nXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0YTogJ2JhcicsXG4gICAgICAgICAgICBmaWVsZDogJ2EnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgd2FybiBpZiBzb3J0cyBjb25mbGljdCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgd2FybiBpZiBzb3J0cyBjb25mbGljdCBldmVuIGlmIHdlIGRvIG5vdCB1bmlvbicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgZG9tYWluID0gbWVyZ2VEb21haW5zKFt7XG4gICAgICAgIGRhdGE6ICdmb28nLFxuICAgICAgICBmaWVsZDogJ2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3A6ICdjb3VudCdcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHdhcm4gaWYgd2UgaGFkIHRvIGRyb3AgY29tcGxleCBzb3J0JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBkb21haW4gPSBtZXJnZURvbWFpbnMoW3tcbiAgICAgICAgZGF0YTogJ2ZvbycsXG4gICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcDogJ21lYW4nLFxuICAgICAgICAgIGZpZWxkOiAnYydcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGQ6ICdiJ1xuICAgICAgfV0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRvbWFpbiwge1xuICAgICAgICBkYXRhOiAnZm9vJyxcbiAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICBzb3J0OiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5kb21haW5Tb3J0RHJvcHBlZCh7XG4gICAgICAgIG9wOiAnbWVhbicsXG4gICAgICAgIGZpZWxkOiAnYydcbiAgICAgIH0pKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkb21haW5Tb3J0KCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciBkaXNjcmV0ZSBkb21haW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgY29uc3Qgc29ydCA9IGRvbWFpblNvcnQobW9kZWwsICd4JywgU2NhbGVUeXBlLkxJTkVBUik7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3JtYWwgc29ydCBzcGVjIGlmIHNwZWNpZmllZCBhbmQgYWdncmVncmF0aW9uIGlzIG5vdCBjb3VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnLCBzb3J0OntvcDogJ3N1bScsIGZpZWxkOid5J319LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihzb3J0LCB7b3A6ICdzdW0nLCBmaWVsZDogJ3knfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3JtYWwgc29ydCBzcGVjIGlmIGFnZ3JlZ3JhdGlvbiBpcyBjb3VudCBhbmQgZmllbGQgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnLCBzb3J0OntvcDogJ2NvdW50J319LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnU29ydEZpZWxkPihzb3J0LCB7b3A6ICdjb3VudCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgc29ydCBpcyBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCBhZ2dyZWdhdGU6ICdzdW0nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3J0ID0gZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvcnQsIHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIHNvcnQgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCcsIHNvcnQ6IFwiZGVzY2VuZGluZ1wifSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgYWdncmVnYXRlOiAnc3VtJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1NvcnRGaWVsZD4oZG9tYWluU29ydChtb2RlbCwgJ3gnLCBTY2FsZVR5cGUuT1JESU5BTCksIHtvcDogJ21pbicsIGZpZWxkOiAnYScsIG9yZGVyOiAnZGVzY2VuZGluZyd9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==