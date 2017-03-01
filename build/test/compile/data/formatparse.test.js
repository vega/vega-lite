"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var util_1 = require("../../util");
var formatparse_1 = require("../../../src/compile/data/formatparse");
describe('compile/data/formatparse', function () {
    describe('parseUnit', function () {
        it('should return a correct parse for encoding mapping', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json" },
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "d", "type": "nominal" }
                }
            });
            var parseComponent = formatparse_1.formatParse.parseUnit(model);
            chai_1.assert.deepEqual(parseComponent, {
                a: 'number',
                b: 'date'
            });
        });
        it('should return a correct parse for filtered fields', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json" },
                "transform": {
                    "filter": [
                        { "field": "a", "equal": { year: 2000 } },
                        { "field": "b", "oneOf": ["a", "b"] },
                        { "field": "c", "range": [{ year: 2000 }, { year: 2001 }] },
                        { "field": "d", "range": [1, 2] }
                    ]
                },
                "mark": "point",
                encoding: {}
            });
            var parseComponent = formatparse_1.formatParse.parseUnit(model);
            chai_1.assert.deepEqual(parseComponent, {
                a: 'date',
                b: 'string',
                c: 'date',
                d: 'number'
            });
        });
        it('should return a correct customized parse.', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json", "format": { "parse": { "c": "number", "d": "date" } } },
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "c", "type": "nominal" }
                }
            });
            var parseComponent = formatparse_1.formatParse.parseUnit(model);
            chai_1.assert.deepEqual(parseComponent, {
                a: 'number',
                b: 'date',
                c: 'number',
                d: 'date'
            });
        });
        it('should include parse for all applicable fields, and exclude calculated fields', function () {
            var model = util_1.parseUnitModel({
                transform: {
                    calculate: [
                        { as: 'b2', expr: 'datum["b"] * 2' }
                    ]
                },
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "temporal" },
                    y: { field: 'b', type: "quantitative" },
                    color: { field: '*', type: "quantitative", aggregate: 'count' },
                    size: { field: 'b2', type: "quantitative" },
                }
            });
            var formatParseComponent = formatparse_1.formatParse.parseUnit(model);
            chai_1.assert.deepEqual(formatParseComponent, {
                'a': 'date',
                'b': 'number'
            });
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
//# sourceMappingURL=formatparse.test.js.map