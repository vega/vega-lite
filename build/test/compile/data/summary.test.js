/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var summary_1 = require("../../../src/compile/data/summary");
var util_1 = require("../../util");
describe('compile/data/summary', function () {
    describe('parseUnit', function () {
        it('should produce the correct summary component for sum(Acceleration) and count(*)', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'y': {
                        'aggregate': 'sum',
                        'field': 'Acceleration',
                        'type': "quantitative"
                    },
                    'x': {
                        'field': 'Origin',
                        'type': "ordinal"
                    },
                    color: { field: '*', type: "quantitative", aggregate: 'count' }
                }
            });
            model.component.data = {};
            model.component.data.summary = summary_1.summary.parseUnit(model);
            chai_1.assert.deepEqual(model.component.data.summary, [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: { Origin: true },
                    measures: { '*': { count: true }, Acceleration: { sum: true } }
                }]);
        });
        it('should produce the correct summary component for aggregated plot with detail arrays', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative" },
                    'detail': [
                        { 'field': 'Origin', 'type': "ordinal" },
                        { 'field': 'Cylinders', 'type': "quantitative" }
                    ]
                }
            });
            model.component.data = {};
            model.component.data.summary = summary_1.summary.parseUnit(model);
            chai_1.assert.deepEqual(model.component.data.summary, [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: { Origin: true, Cylinders: true },
                    measures: { Displacement: { mean: true } }
                }]);
        });
        it('should add min and max if needed for unaggregated scale domain', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative", scale: { domain: 'unaggregated' } },
                }
            });
            model.component.data = {};
            model.component.data.summary = summary_1.summary.parseUnit(model);
            chai_1.assert.deepEqual(model.component.data.summary, [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: {},
                    measures: { Displacement: { mean: true, min: true, max: true } }
                }]);
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
        it('should assemble the correct summary data', function () {
            var summaryComponent = [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: { Origin: true },
                    measures: { '*': { count: true }, Acceleration: { sum: true } }
                }];
            var summaryData = summary_1.summary.assemble(summaryComponent, 'source')[0];
            chai_1.assert.deepEqual(summaryData, {
                'name': "summary",
                'source': 'source',
                'transform': [{
                        'type': 'aggregate',
                        'groupby': ['Origin'],
                        'fields': ['*', 'Acceleration',],
                        'ops': ['count', 'sum',]
                    }]
            });
        });
        it('should assemble the correct summary data', function () {
            var summaryComponent = [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: { Origin: true, Cylinders: true },
                    measures: { Displacement: { mean: true } }
                }];
            var summaryData = summary_1.summary.assemble(summaryComponent, 'source')[0];
            chai_1.assert.deepEqual(summaryData, {
                'name': "summary",
                'source': 'source',
                'transform': [{
                        'type': 'aggregate',
                        'groupby': ['Origin', 'Cylinders'],
                        'fields': ['Displacement'],
                        'ops': ['mean']
                    }]
            });
        });
    });
});
//# sourceMappingURL=summary.test.js.map