"use strict";
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var util_1 = require("../../util");
var filter_1 = require("../../../src/compile/data/filter");
describe('compile/data/filter', function () {
    describe('parseUnit', function () {
        it('should return a correct expression for an array of filter', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "transform": {
                    "filter": [
                        { field: 'color', equal: 'red' },
                        { field: 'color', oneOf: ['red', 'yellow'] },
                        { field: 'x', range: [0, 5] },
                        'datum["x"]===5',
                        { field: 'x', range: [null, null] },
                    ]
                },
                mark: 'point',
                encoding: {}
            });
            var expr = filter_1.filter.parseUnit(model);
            chai_1.assert.equal(expr, '(datum["color"]==="red") && ' +
                '(indexof(["red","yellow"], datum["color"]) !== -1) && ' +
                '(inrange(datum["x"], 0, 5)) && ' +
                '(datum["x"]===5)');
        });
        it('should return a correct expression for a single filter', function () {
            var model = util_1.parseUnitModel({
                "data": { "values": [] },
                "transform": {
                    "filter": 'datum["x"]===5'
                },
                mark: 'point',
                encoding: {}
            });
            var expr = filter_1.filter.parseUnit(model);
            chai_1.assert.equal(expr, 'datum["x"]===5');
        });
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
//# sourceMappingURL=filter.test.js.map