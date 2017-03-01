/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var timeunit_1 = require("../../../src/compile/data/timeunit");
describe('compile/data/timeunit', function () {
    describe('parseUnit', function () {
        it('should return a dictionary of formula transform', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "mark": "point",
                "encoding": {
                    "x": { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var timeUnitComponent = timeunit_1.timeUnit.parseUnit(model);
            chai_1.assert.deepEqual(timeUnitComponent, {
                month_a: {
                    type: 'formula',
                    as: 'month_a',
                    expr: 'datetime(0, month(datum["a"]), 1, 0, 0, 0, 0)'
                }
            });
        });
    });
    describe('parseFacet', function () {
        // TODO:
    });
    describe('parseLayer', function () {
        // TODO:
    });
    describe('assemble', function () {
        // TODO:
    });
});
//# sourceMappingURL=timeunit.test.js.map