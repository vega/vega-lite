"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var filterinvalid_1 = require("../../../src/compile/data/filterinvalid");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function parse(model) {
    return filterinvalid_1.FilterInvalidNode.make(null, model);
}
describe('compile/data/nullfilter', function () {
    describe('compileUnit', function () {
        var spec = {
            mark: "point",
            encoding: {
                y: { field: 'qq', type: "quantitative" },
                x: { field: 'tt', type: "temporal" },
                color: { field: 'oo', type: "ordinal" },
                shape: { field: 'nn', type: "nominal" }
            }
        };
        it('should add filterNull for Q and T by default', function () {
            var model = util_2.parseUnitModelWithScale(spec);
            chai_1.assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add filterNull for Q and T when invalidValues is "filter".', function () {
            var model = util_2.parseUnitModelWithScale(util_1.mergeDeep(spec, {
                config: {
                    invalidValues: 'filter'
                }
            }));
            chai_1.assert.deepEqual(parse(model).filter, {
                qq: { field: 'qq', type: "quantitative" },
                tt: { field: 'tt', type: "temporal" }
            });
        });
        it('should add no null filter if when invalidValues is null', function () {
            var model = util_2.parseUnitModelWithScale(util_1.mergeDeep(spec, {
                config: {
                    invalidValues: null
                }
            }));
            chai_1.assert.deepEqual(parse(model), null);
        });
        it('should add no null filter for count field', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { aggregate: 'count', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), null);
        });
    });
    describe('assemble', function () {
        it('should assemble simple filter', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo"] !== null && !isNaN(datum["foo"])'
            });
        });
        it('should assemble filter for nested data', function () {
            var model = util_2.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    y: { field: 'foo.bar', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model).assemble(), {
                type: 'filter',
                expr: 'datum["foo.bar"] !== null && !isNaN(datum["foo.bar"])'
            });
        });
    });
});
//# sourceMappingURL=filterinvalid.test.js.map