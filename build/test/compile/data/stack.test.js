/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var stack_1 = require("../../../src/compile/data/stack");
var datatestutil_1 = require("./datatestutil");
var util_1 = require("../../util");
describe('compile/data/stack', function () {
    describe('parseUnit', function () {
        it('should not produce stack component for unit without stack', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {}
            });
            var stackComponent = stack_1.stack.parseUnit(model);
            chai_1.assert.equal(stackComponent, undefined);
        });
    });
    it('should produce correct stack component for bar with color', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "y": { "field": "b", "type": "nominal" },
                "color": { "field": "c", "type": "ordinal", }
            }
        });
        var stackComponent = stack_1.stack.parseUnit(model);
        chai_1.assert.deepEqual(stackComponent, {
            name: 'stacked',
            source: 'summary',
            groupby: ['b'],
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['c'],
                order: ['descending']
            },
            offset: 'zero',
            impute: false
        });
    });
    it('should produce correct stack component with both start and end of the binned field for bar with color and binned y', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "y": { "bin": true, "field": "b", "type": "quantitative" },
                "color": { "field": "c", "type": "ordinal", }
            }
        });
        var stackComponent = stack_1.stack.parseUnit(model);
        chai_1.assert.deepEqual(stackComponent, {
            name: 'stacked',
            source: 'summary',
            groupby: ['bin_b_start', 'bin_b_end'],
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['c'],
                order: ['descending']
            },
            offset: 'zero',
            impute: false
        });
    });
    it('should produce correct stack component for 1D bar with color', function () {
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "c", "type": "ordinal", }
            }
        });
        model.component.data = {};
        model.component.data.stack = stack_1.stack.parseUnit(model);
        var stackComponent = model.component.data.stack;
        chai_1.assert.deepEqual(stackComponent, {
            name: 'stacked',
            source: 'summary',
            groupby: [],
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['c'],
                order: ['descending']
            },
            offset: 'zero',
            impute: false
        });
    });
    it('should produce correct stack component for area with color and order', function () {
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "y": { "field": "b", "type": "nominal" },
                "color": { "field": "c", "type": "nominal" },
                "order": { "aggregate": "mean", "field": "d", "type": "quantitative" }
            }
        });
        var stackComponent = stack_1.stack.parseUnit(model);
        chai_1.assert.deepEqual(stackComponent, {
            name: 'stacked',
            source: 'summary',
            groupby: ['b'],
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['mean_d'],
                order: ['ascending']
            },
            offset: 'zero',
            impute: true
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        it('should produce correct stack component for trellis colored bar', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { "field": "d", "type": "nominal" }
                },
                spec: {
                    "mark": "bar",
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                        "y": { "field": "b", "type": "nominal" },
                        "color": { "field": "c", "type": "nominal" }
                    }
                }
            });
            var child = model.child;
            child.component.data = datatestutil_1.mockDataComponent();
            child.component.data.stack = {
                name: 'stacked',
                source: 'summary',
                groupby: ['b'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: true
            };
            var stackComponent = stack_1.stack.parseFacet(model);
            chai_1.assert.deepEqual(stackComponent, {
                name: 'stacked',
                source: 'summary',
                groupby: ['b', 'd'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: true
            });
        });
        it('should produce correct stack component for trellis colored bar with faceted y', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { "field": "b", "type": "nominal" }
                },
                spec: {
                    "mark": "bar",
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                        "y": { "field": "b", "type": "nominal" },
                        "color": { "field": "c", "type": "nominal" }
                    }
                }
            });
            var child = model.child;
            child.component.data = datatestutil_1.mockDataComponent();
            child.component.data.stack = {
                name: 'stacked',
                source: 'summary',
                groupby: ['b'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: true
            };
            var stackComponent = stack_1.stack.parseFacet(model);
            chai_1.assert.deepEqual(stackComponent, {
                name: 'stacked',
                source: 'summary',
                groupby: ['b'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: true
            });
        });
        it('should produce correct stack component for trellis non-stacked bar', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { "field": "d", "type": "nominal" }
                },
                spec: {
                    "mark": "bar",
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                        "y": { "field": "b", "type": "nominal" }
                    }
                }
            });
            var child = model.child;
            child.component.data = datatestutil_1.mockDataComponent();
            child.component.data.stack = undefined;
            var stackComponent = stack_1.stack.parseFacet(model);
            chai_1.assert.equal(stackComponent, undefined);
        });
    });
    describe('assemble', function () {
        it('should assemble correct imputed stack data source', function () {
            var stackData = stack_1.stack.assemble({
                name: 'stacked',
                source: 'summary',
                groupby: ['bin_b_start'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['mean_d'],
                    order: ['ascending']
                },
                offset: 'zero',
                impute: true
            });
            chai_1.assert.deepEqual(stackData, {
                name: 'stacked',
                source: 'summary',
                transform: [
                    {
                        type: 'impute',
                        field: 'sum_a',
                        groupby: ['c'],
                        orderby: ['bin_b_start'],
                        method: "value",
                        value: 0
                    },
                    {
                        type: 'stack',
                        groupby: ['bin_b_start'],
                        field: 'sum_a',
                        sort: {
                            field: ['mean_d'],
                            order: ['ascending']
                        },
                        as: ['sum_a_start', 'sum_a_end'],
                        offset: 'zero'
                    }
                ]
            });
        });
        it('should assemble correct unimputed stack data source', function () {
            var stackData = stack_1.stack.assemble({
                name: 'stacked',
                source: 'summary',
                groupby: ['bin_b_start'],
                field: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['mean_d'],
                    order: ['ascending']
                },
                offset: 'zero',
                impute: false
            });
            chai_1.assert.deepEqual(stackData, {
                name: 'stacked',
                source: 'summary',
                transform: [
                    {
                        type: 'stack',
                        groupby: ['bin_b_start'],
                        field: 'sum_a',
                        sort: {
                            field: ['mean_d'],
                            order: ['ascending']
                        },
                        as: ['sum_a_start', 'sum_a_end'],
                        offset: 'zero'
                    }
                ]
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUFzRDtBQUd0RCwrQ0FBaUQ7QUFDakQsbUNBQTJEO0FBRTNELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM5RCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQztZQUNILElBQU0sY0FBYyxHQUFHLGFBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtRQUM5RCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQ3RDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRTthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sY0FBYyxHQUFHLGFBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMs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