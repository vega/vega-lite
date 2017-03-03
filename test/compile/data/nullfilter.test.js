/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var nullfilter_1 = require("../../../src/compile/data/nullfilter");
var log = require("../../../src/log");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: "point",
            encoding: {
                y: { field: 'qq', type: "quantitative" },
                x: { field: 'tt', type: "temporal" },
                color: { field: 'oo', type: "ordinal" }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = util_2.parseUnitModel(spec);
            chai_1.assert.deepEqual(nullfilter_1.nullFilter.parseUnit(model), {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" },
                oo: null
            });
        });
        it('should add filterNull for O when specified', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                    transform: {
                        filterNull: true
                    }
                }));
                chai_1.assert.deepEqual(nullfilter_1.nullFilter.parseUnit(model), {
                    qq: { field: 'qq', type: "quantitative" },
                    tt: { field: 'tt', type: "temporal" },
                    oo: { field: 'oo', type: "ordinal" }
                });
                chai_1.assert.equal(localLogger.warns[0], log.message.DEPRECATED_FILTER_NULL);
            });
        });
        it('should add no null filter if filterInvalid is false', function () {
            var model = util_2.parseUnitModel(util_1.mergeDeep(spec, {
                transform: {
                    filterInvalid: false
                }
            }));
            chai_1.assert.deepEqual(nullfilter_1.nullFilter.parseUnit(model), {
                qq: null,
                tt: null,
                oo: null
            });
        });
        it('should add no null filter for count field', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_2.parseUnitModel({
                    transform: {
                        filterNull: true
                    },
                    mark: "point",
                    encoding: {
                        y: { aggregate: 'count', field: '*', type: "quantitative" }
                    }
                }); // as any so we can set deprecated property transform.filterNull
                chai_1.assert.deepEqual(nullfilter_1.nullFilter.parseUnit(model), {});
                chai_1.assert.equal(localLogger.warns[0], log.message.DEPRECATED_FILTER_NULL);
            });
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        it('should produce child\'s filter if child has no source and the facet has no filter', function () {
            // TODO: write
        });
        it('should produce child\'s filter and its own filter if child has no source and the facet has filter', function () {
            // TODO: write
        });
    });
    describe('assemble', function () {
        // TODO: write
    });
});
//# sourceMappingURL=nullfilter.test.js.map