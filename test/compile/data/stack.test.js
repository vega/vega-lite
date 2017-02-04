/* tslint:disable:quotemark */
"use strict";
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
            var child = model.child();
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
            var child = model.child();
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
            var child = model.child();
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
//# sourceMappingURL=stack.test.js.map