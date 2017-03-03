/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var nonpositivefilter_1 = require("../../../src/compile/data/nonpositivefilter");
var util_1 = require("../../util");
describe('compile/data/nonpositivefilter', function () {
    var model = util_1.parseUnitModel({
        mark: "point",
        encoding: {
            x: { field: 'a', type: "temporal" },
            y: { field: 'b', type: "quantitative", scale: { type: 'log' } }
        }
    });
    describe('parseUnit & assemble', function () {
        it('should produce the correct nonPositiveFilter component', function () {
            model.component.data = {};
            model.component.data.nonPositiveFilter = nonpositivefilter_1.nonPositiveFilter.parseUnit(model);
            chai_1.assert.deepEqual(model.component.data.nonPositiveFilter, {
                b: true,
                a: false
            });
        });
        it('should assemble the correct filter transform', function () {
            var filterTransform = nonpositivefilter_1.nonPositiveFilter.assemble(model.component.data.nonPositiveFilter)[0];
            chai_1.assert.deepEqual(filterTransform, {
                type: 'filter',
                expr: 'datum["b"] > 0'
            });
        });
        // it('unit (with aggregated log scale)', function() {
        //   // TODO: write
        // });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=nonpositivefilter.test.js.map