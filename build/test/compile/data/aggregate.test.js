/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
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
            model.component.data.summary = aggregate_1.summary.parseUnit(model);
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
            model.component.data.summary = aggregate_1.summary.parseUnit(model);
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
            model.component.data.summary = aggregate_1.summary.parseUnit(model);
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
            var aggregates = aggregate_1.summary.assemble(summaryComponent);
            chai_1.assert.deepEqual(aggregates, [{
                    'type': 'aggregate',
                    'groupby': ['Origin'],
                    'fields': ['*', 'Acceleration'],
                    'ops': ['count', 'sum']
                }]);
        });
        it('should assemble the correct summary data', function () {
            var summaryComponent = [{
                    name: 'summary',
                    // source will be added in assemble step
                    dimensions: { Origin: true, Cylinders: true },
                    measures: { Displacement: { mean: true } }
                }];
            var aggregates = aggregate_1.summary.assemble(summaryComponent);
            chai_1.assert.deepEqual(aggregates, [{
                    'type': 'aggregate',
                    'groupby': ['Origin', 'Cylinders'],
                    'fields': ['Displacement'],
                    'ops': ['mean']
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQTREO0FBRTVELG1DQUEwQztBQUUxQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsaUZBQWlGLEVBQUc7WUFDckYsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLEdBQUcsRUFBRTt3QkFDSCxXQUFXLEVBQUUsS0FBSzt3QkFDbEIsT0FBTyxFQUFFLGNBQWM7d0JBQ3ZCLE1BQU0sRUFBRSxjQUFjO3FCQUN2QjtvQkFDRCxHQUFHLEVBQUU7d0JBQ0gsT0FBTyxFQUFFLFFBQVE7d0JBQ2pCLE1BQU0sRUFBRSxTQUFTO3FCQUNsQjtvQkFDRCxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQztpQkFDOUQ7YUFDRixDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxFQUFtQixDQUFDO1lBQzNDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUM5QyxJQUFJLEVBQUUsU0FBUztvQkFDZix3Q0FBd0M7b0JBQ3hDLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0JBQzFCLFFBQVEsRUFBRSxFQUFD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