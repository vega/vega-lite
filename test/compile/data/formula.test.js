"use strict";
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var formula_1 = require("../../../src/compile/data/formula");
var unit_1 = require("../../../src/compile/unit");
var util_1 = require("../../../src/util");
describe('compile/data/formula', function () {
    describe('parseUnit', function () {
        it('should return a dictionary of formula', function () {
            var f = {
                "as": "a",
                "expr": "5"
            };
            var model = new unit_1.UnitModel({
                "data": { "url": "a.json" },
                "transform": {
                    "calculate": [f]
                },
                "mark": "point",
                "encoding": {}
            }, null, '');
            var formulaComponent = formula_1.formula.parseUnit(model);
            var hashed = util_1.hash(f);
            var expected = {};
            expected[hashed] = f;
            chai_1.assert.deepEqual(formulaComponent, expected);
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        it('should return correct vega formula transform', function () {
            chai_1.assert.deepEqual(formula_1.formula.assemble({
                aaa: { as: 'a', expr: '5' }
            }), [{
                    type: 'formula',
                    as: 'a',
                    expr: '5'
                }]);
        });
    });
});
//# sourceMappingURL=formula.test.js.map