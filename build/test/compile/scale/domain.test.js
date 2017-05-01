"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var domain_1 = require("../../../src/compile/scale/domain");
var data_1 = require("../../../src/data");
var log = require("../../../src/log");
var util_1 = require("../../util");
describe('compile/scale', function () {
    describe('parseDomain()', function () {
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
            var xDomain = domain_1.parseDomain(model, 'x');
            chai_1.assert.deepEqual(xDomain, { data: 'main', fields: ['a', 'b'] });
            var yDomain = domain_1.parseDomain(model, 'y');
            chai_1.assert.deepEqual(yDomain, { data: 'main', fields: ['c', 'd'] });
        });
        it('should have correct domain for color', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: { field: 'a', type: 'quantitative' },
                }
            });
            var xDomain = domain_1.parseDomain(model, 'color');
            chai_1.assert.deepEqual(xDomain, { data: 'main', field: 'a' });
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
            chai_1.assert.deepEqual(domain_1.parseDomain(model, 'y'), {
                data: 'main',
                fields: ['sum_origin_start', 'sum_origin_end']
            });
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
            chai_1.assert.deepEqual(domain_1.parseDomain(model, 'y'), [0, 1]);
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
                chai_1.assert.deepEqual(domain_1.parseDomain(model, 'y'), {
                    signal: 'sequence(bin_maxbins_15_origin_bins.start, bin_maxbins_15_origin_bins.stop + bin_maxbins_15_origin_bins.step, bin_maxbins_15_origin_bins.step)'
                });
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.MAIN);
                chai_1.assert.deepEqual(_domain.fields, ['min_acceleration', 'max_acceleration']);
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.MAIN);
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain, [0, 200]);
            });
            it('should return the aggregated domain if we do not overrride it', function () {
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.MAIN);
            });
            it('should return the aggregated domain if specified in config', function () {
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.MAIN);
                chai_1.assert.deepEqual(_domain.fields, ['min_acceleration', 'max_acceleration']);
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain, { data: 'main', field: 'month_origin', sort: true });
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain, { data: 'main', field: 'yearmonth_origin' });
            });
            it('should return the correct domain for yearmonth T when specify sort', function () {
                var model = util_1.parseUnitModel({
                    mark: "line",
                    encoding: {
                        x: {
                            timeUnit: 'month',
                            field: 'date',
                            type: 'temporal',
                            sort: {
                                op: 'mean',
                                field: 'precipitation',
                                order: 'descending'
                            }
                        },
                        y: {
                            aggregate: 'mean',
                            field: 'precipitation',
                            type: 'quantitative'
                        }
                    }
                });
                var _domain = domain_1.parseDomain(model, 'x');
                chai_1.assert.deepEqual(_domain, {
                    data: 'raw',
                    field: 'month_date',
                    sort: {
                        op: 'mean',
                        field: 'precipitation'
                    }
                });
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
                var _domain = domain_1.parseDomain(model, 'y');
                chai_1.assert.deepEqual(_domain, [
                    new Date(1970, 0, 1).getTime(),
                    new Date(1980, 0, 1).getTime()
                ]);
            });
        });
        describe('for ordinal', function () {
            it('should return correct domain with the provided sort property', function () {
                var sortDef = { op: 'min', field: 'Acceleration' };
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "ordinal", sort: sortDef }
                    }
                });
                chai_1.assert.deepEqual(domain_1.parseDomain(model, 'y'), {
                    data: "raw",
                    field: 'origin',
                    sort: sortDef
                });
            });
            it('should return correct domain without sort if sort is not provided', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: { field: 'origin', type: "ordinal" }
                    }
                });
                chai_1.assert.deepEqual(domain_1.parseDomain(model, 'y'), {
                    data: "main",
                    field: 'origin',
                    sort: true
                });
            });
        });
    });
    describe('unionDomains()', function () {
        it('should union field and data ref union domains', function () {
            var domain1 = {
                data: 'foo',
                fields: ['a', 'b']
            };
            var domain2 = {
                fields: [{
                        data: 'foo',
                        field: 'b'
                    }, {
                        data: 'foo',
                        field: 'c'
                    }]
            };
            var unioned = domain_1.unionDomains(domain1, domain2);
            chai_1.assert.deepEqual(unioned, {
                data: 'foo',
                fields: ['a', 'b', 'c']
            });
        });
        it('should union data ref union domains', function () {
            var domain1 = {
                data: 'foo',
                fields: ['a', 'b']
            };
            var domain2 = {
                data: 'foo',
                fields: ['b', 'c']
            };
            var unioned = domain_1.unionDomains(domain1, domain2);
            chai_1.assert.deepEqual(unioned, {
                data: 'foo',
                fields: ['a', 'b', 'c']
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFHOUIsNkJBQTRCO0FBQzVCLDREQUE0RTtBQUM1RSwwQ0FBdUM7QUFFdkMsc0NBQXdDO0FBRXhDLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQ3pCLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQ3JDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFDO1lBRUwsSUFBTSxPQUFPLEdBQUcsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFOUQsSUFBTSxPQUFPLEdBQUcsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxJ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