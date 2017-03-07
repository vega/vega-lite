/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUU1QixtRUFBZ0U7QUFDaEUsc0NBQXdDO0FBRXhDLDBDQUE0QztBQUU1QyxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFO0lBQ2xDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsSUFBTSxJQUFJLEdBQWE7WUFDckIsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN0QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ2xDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzthQUN0QztTQUNGLENBQUM7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLHVCQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM1QyxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7Z0JBQ3ZDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztnQkFDbkMsRUFBRSxFQUFFLElBQUk7YUFDVCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxHQUFHLENBQUMsY0FBYyxD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