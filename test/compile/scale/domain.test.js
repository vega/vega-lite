/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var domain_1 = require("../../../src/compile/scale/domain");
var data_1 = require("../../../src/data");
var util_1 = require("../../util");
describe('compile/scale', function () {
    describe('domain()', function () {
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
            var _domain = domain_1.default(model.scale('y'), model, 'y');
            chai_1.assert.deepEqual(_domain, {
                data: 'stacked',
                fields: ['sum_origin_start', 'sum_origin_end']
            });
        });
        describe('for quantitative', function () {
            it('should return the right domain for binned Q', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            bin: { maxbins: 15 },
                            field: 'origin',
                            scale: { useRawDomain: true },
                            type: "quantitative"
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain, {
                    data: data_1.SOURCE,
                    fields: [
                        'bin_origin_start',
                        'bin_origin_end'
                    ]
                });
            });
            it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'mean',
                            field: 'origin',
                            scale: { useRawDomain: true },
                            type: "quantitative"
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.SOURCE);
            });
            it('should return the aggregate domain for sum Q', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'sum',
                            field: 'origin',
                            scale: { useRawDomain: true },
                            type: "quantitative"
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
            });
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
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain, [0, 200]);
            });
            it('should return the aggregated domain if useRawDomain is false', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            aggregate: 'min',
                            field: 'origin',
                            scale: { useRawDomain: false },
                            type: "quantitative"
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.SUMMARY);
            });
        });
        describe('for time', function () {
            it('should return the raw domain if useRawDomain is true for raw T', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            scale: { useRawDomain: true },
                            type: "temporal"
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.SOURCE);
            });
            it('should return the raw domain if useRawDomain is true for year T', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        y: {
                            field: 'origin',
                            scale: { useRawDomain: true },
                            type: "temporal",
                            timeUnit: 'year'
                        }
                    }
                });
                var _domain = domain_1.default(model.scale('y'), model, 'y');
                chai_1.assert.deepEqual(_domain.data, data_1.SOURCE);
                chai_1.assert.operator(_domain.field.indexOf('year'), '>', -1);
            });
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
                var _domain = domain_1.default(model.scale('y'), model, 'y');
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
                var _domain = domain_1.default(model.scale('y'), model, 'y');
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
                var _domain = domain_1.default(model.scale('y'), model, 'y');
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
                chai_1.assert.deepEqual(domain_1.default(model.scale('y'), model, 'y'), {
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
                chai_1.assert.deepEqual(domain_1.default(model.scale('y'), model, 'y'), {
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
    });
});
//# sourceMappingURL=domain.test.js.map