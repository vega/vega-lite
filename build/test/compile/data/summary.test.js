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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvc3VtbWFyeS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUc1Qiw2REFBMEQ7QUFDMUQsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUMvQixRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxpRkFBaUYsRUFBRztZQUNyRixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxLQUFLO3dCQUNsQixPQUFPLEVBQUUsY0FBYzt3QkFDdkIsTUFBTSxFQUFFLGNBQWM7cUJBQ3ZCO29CQUNELEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsUUFBUTt3QkFDakIsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCO29CQUNELEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDO2lCQUM5RDthQUNGLENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQW1CLENBQUM7WUFDM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLGlCQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQzlDLElBQUksRUFBRSxTQUFTO29CQUNmLHdDQUF3QztvQkFDeEMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztvQkFDMUIsUUFBUSxFQUFFLEVBQUMsR0FB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