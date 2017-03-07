/* tslint:disable:quotemark */
"use strict";
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
            chai_1.assert.deepEqual(xDomain, { data: 'source', fields: ['a', 'b'] });
            var yDomain = domain_1.parseDomain(model, 'y');
            chai_1.assert.deepEqual(yDomain, { data: 'source', fields: ['c', 'd'] });
        });
        it('should have correct domain for color', function () {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    color: { field: 'a', type: 'quantitative' },
                }
            });
            var xDomain = domain_1.parseDomain(model, 'color');
            chai_1.assert.deepEqual(xDomain, { data: 'source', field: 'a' });
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
                data: 'stacked',
                fields: ['sum_origin_start', 'sum_origin_end']
            });
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
                    signal: 'sequence(origin_bins.start, origin_bins.stop + origin_bins.step, origin_bins.step)'
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
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
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
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
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
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
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
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
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
                chai_1.assert.deepEqual(_domain, { data: 'source', field: 'month_origin', sort: { field: 'month_origin', op: 'min', } });
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
                chai_1.assert.deepEqual(_domain, {
                    data: 'source', field: 'yearmonth_origin',
                    sort: { field: 'yearmonth_origin', op: 'min' }
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
                    data: "source",
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
                    data: "source",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2NhbGUvZG9tYWluLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFHOUIsNkJBQTRCO0FBQzVCLDREQUE0RTtBQUM1RSwwQ0FBMEM7QUFDMUMsc0NBQXdDO0FBQ3hDLG1DQUEwQztBQUkxQyxRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQ3pCLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQ3JDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDdEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUNyQyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFDO1lBRUwsSUFBTSxPQUFPLEdBQUcsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7WUFFaEUsSUFBTSxPQUFPLEdBQUcsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBQyxJ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