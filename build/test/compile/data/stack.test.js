"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var stack_1 = require("../../../src/compile/data/stack");
var util_1 = require("../../util");
function parse(model) {
    return stack_1.StackNode.makeFromEncoding(null, model).stack;
}
function assemble(model) {
    return stack_1.StackNode.makeFromEncoding(null, model).assemble();
}
describe('compile/data/stack', function () {
    describe('StackNode.makeFromEncoding', function () {
        it('should produce correct stack component for bar with color', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                dimensionFieldDef: { field: 'b', type: 'nominal' },
                facetby: [],
                stackField: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: false,
                as: ['sum_a_start', 'sum_a_end']
            });
        });
        it('should produce correct stack component with both start and end of the binned field for bar with color and binned y', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "bin": true, "field": "b", "type": "quantitative" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                dimensionFieldDef: { "bin": { maxbins: 10 }, "field": "b", "type": "quantitative" },
                facetby: [],
                stackField: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: false,
                as: ['sum_a_start', 'sum_a_end']
            });
        });
        it('should produce correct stack component for 1D bar with color', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                dimensionFieldDef: undefined,
                facetby: [],
                stackField: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: false,
                as: ['sum_a_start', 'sum_a_end']
            });
            chai_1.assert.deepEqual(assemble(model), [{
                    type: 'stack',
                    groupby: [],
                    field: 'sum_a',
                    sort: {
                        field: ['c'],
                        order: ['descending']
                    },
                    as: ['sum_a_start', 'sum_a_end'],
                    offset: 'zero'
                }
            ]);
        });
        it('should produce correct stack component for area with color and order', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "area",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "nominal" },
                    "order": { "aggregate": "mean", "field": "d", "type": "quantitative" }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                dimensionFieldDef: { field: 'b', type: 'nominal' },
                facetby: [],
                stackField: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['mean_d'],
                    order: ['ascending']
                },
                offset: 'zero',
                impute: true,
                as: ['sum_a_start', 'sum_a_end']
            });
            chai_1.assert.deepEqual(assemble(model), [
                {
                    type: 'impute',
                    field: 'sum_a',
                    groupby: ['c'],
                    key: 'b',
                    method: "value",
                    value: 0
                },
                {
                    type: 'stack',
                    groupby: ['b'],
                    field: 'sum_a',
                    sort: {
                        field: ['mean_d'],
                        order: ['ascending']
                    },
                    as: ['sum_a_start', 'sum_a_end'],
                    offset: 'zero'
                }
            ]);
        });
        it('should produce correct stack component for area with color and binned dimension', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "area",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "bin": true, "field": "b", "type": "quantitative" },
                    "color": { "field": "c", "type": "nominal" }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                dimensionFieldDef: { "bin": { maxbins: 10 }, "field": "b", "type": "quantitative" },
                facetby: [],
                stackField: 'sum_a',
                stackby: ['c'],
                sort: {
                    field: ['c'],
                    order: ['descending']
                },
                offset: 'zero',
                impute: true,
                as: ['sum_a_start', 'sum_a_end']
            });
            chai_1.assert.deepEqual(assemble(model), [
                {
                    type: 'formula',
                    expr: '(datum[\"bin_maxbins_10_b\"]+datum[\"bin_maxbins_10_b_end\"])/2',
                    as: 'bin_maxbins_10_b_mid'
                },
                {
                    type: 'impute',
                    field: 'sum_a',
                    groupby: ['c'],
                    key: 'bin_maxbins_10_b_mid',
                    method: "value",
                    value: 0
                },
                {
                    type: 'stack',
                    groupby: ['bin_maxbins_10_b_mid'],
                    field: 'sum_a',
                    sort: {
                        field: ['c'],
                        order: ['descending']
                    },
                    as: ['sum_a_start', 'sum_a_end'],
                    offset: 'zero'
                }
            ]);
        });
    });
    describe('StackNode.makeFromTransform', function () {
        it('should fill in offset and sort properly', function () {
            var transform = {
                stack: 'people',
                groupby: ['age'],
                as: ['v1', 'v2']
            };
            var stack = stack_1.StackNode.makeFromTransform(null, transform);
            chai_1.assert.deepEqual(stack.assemble(), [{
                    type: 'stack',
                    groupby: ['age'],
                    field: 'people',
                    offset: 'zero',
                    sort: { field: [], order: [] },
                    as: ['v1', 'v2']
                }]);
        });
        it('should fill in partial "as" field properly', function () {
            var transform = {
                stack: 'people',
                groupby: ['age', 'gender'],
                offset: 'normalize',
                as: "val"
            };
            var stack = stack_1.StackNode.makeFromTransform(null, transform);
            chai_1.assert.deepEqual(stack.assemble(), [{
                    type: 'stack',
                    groupby: ['age', 'gender'],
                    field: 'people',
                    offset: 'normalize',
                    sort: { field: [], order: [] },
                    as: ["val", "val_end"]
                }]);
        });
        it('should handle complete "sort"', function () {
            var transform = {
                stack: 'people',
                groupby: ['age', 'gender'],
                offset: 'normalize',
                sort: [{ 'field': 'height', 'order': 'ascending' },
                    { 'field': 'weight', 'order': 'descending' }],
                as: 'val'
            };
            var stack = stack_1.StackNode.makeFromTransform(null, transform);
            chai_1.assert.deepEqual(stack.assemble(), [{
                    type: 'stack',
                    groupby: ['age', 'gender'],
                    field: 'people',
                    offset: 'normalize',
                    sort: { field: ['height', 'weight'], order: ['ascending', 'descending'] },
                    as: ["val", "val_end"]
                }]);
        });
        it('should handle incomplete "sort" field', function () {
            var transform = {
                stack: 'people',
                groupby: ['age', 'gender'],
                offset: 'normalize',
                sort: [{ 'field': 'height' }],
                as: 'val'
            };
            var stack = stack_1.StackNode.makeFromTransform(null, transform);
            chai_1.assert.deepEqual(stack.assemble(), [{
                    type: 'stack',
                    groupby: ['age', 'gender'],
                    field: 'people',
                    offset: 'normalize',
                    sort: { field: ['height'], order: ['ascending'] },
                    as: ["val", "val_end"]
                }]);
        });
    });
    describe('StackNode.producedFields', function () {
        it('should give producedfields correctly', function () {
            var transform = {
                stack: 'people',
                groupby: ['age'],
                as: 'people'
            };
            var stack = stack_1.StackNode.makeFromTransform(null, transform);
            chai_1.assert.deepEqual(stack.producedFields(), {
                people: true,
                people_end: true
            });
        });
        it('should give producedFields correctly when in encoding channel', function () {
            var model = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            var stack = stack_1.StackNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(stack.producedFields(), {
                sum_a_start: true,
                sum_a_end: true
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUEwRTtBQUkxRSxtQ0FBbUQ7QUFFbkQsZUFBZSxLQUFnQjtJQUM3QixPQUFPLGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN2RCxDQUFDO0FBRUQsa0JBQWtCLEtBQWdCO0lBQ2hDLE9BQU8saUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDNUQsQ0FBQztBQUNELFFBQVEsQ0FBRSxvQkFBb0IsRUFBRTtJQUU5QixRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1lBQzlELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQy9ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDdEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFFO2lCQUM1QzthQUNGLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQWlCLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDN0MsaUJBQWlCLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7Z0JBQ2hELE9BQU8sRUFBRSxF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QzNELGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUN2QyxNQUFNLEVBQUUsSUFBSTtnQkFDWixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRTtZQUNsRSxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUMvRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3RDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRTtpQkFDNUM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLEtBQUssR0FBRyxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN0RCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDdkMsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7U3RhY2tDb21wb25lbnQsIFN0YWNrTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zdGFjayc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge1ZnQ29tcGFyYXRvck9yZGVyLCBWZ1NvcnQsIFZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIHBhcnNlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIFN0YWNrTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKS5zdGFjaztcbn1cblxuZnVuY3Rpb24gYXNzZW1ibGUobW9kZWw6IFVuaXRNb2RlbCkge1xuICByZXR1cm4gU3RhY2tOb2RlLm1ha2VGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwpLmFzc2VtYmxlKCk7XG59XG5kZXNjcmliZSAoJ2NvbXBpbGUvZGF0YS9zdGFjaycsICgpID0+IHtcblxuICBkZXNjcmliZSgnU3RhY2tOb2RlLm1ha2VGcm9tRW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBiYXIgd2l0aCBjb2xvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIix9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgICBmYWNldGJ5OiBbXSxcbiAgICAgICAgc3RhY2tGaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgICBpbXB1dGU6IGZhbHNlLFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgd2l0aCBib3RoIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJpbm5lZCBmaWVsZCBmb3IgYmFyIHdpdGggY29sb3IgYW5kIGJpbm5lZCB5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7XCJiaW5cIjoge21heGJpbnM6IDEwfSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBmYWNldGJ5OiBbXSxcbiAgICAgICAgc3RhY2tGaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgICBpbXB1dGU6IGZhbHNlLFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIDFEIGJhciB3aXRoIGNvbG9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB1bmRlZmluZWQsXG4gICAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgICBzdGFja0ZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICAgIGltcHV0ZTogZmFsc2UsXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihhc3NlbWJsZShtb2RlbCksIFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFtdLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ10sXG4gICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIGFyZWEgd2l0aCBjb2xvciBhbmQgb3JkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIFwib3JkZXJcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgICBkaW1lbnNpb25GaWVsZERlZjoge2ZpZWxkOiAnYicsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgICBzdGFja0ZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ21lYW5fZCddLFxuICAgICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgICBpbXB1dGU6IHRydWUsXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihhc3NlbWJsZShtb2RlbCksIFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYyddLFxuICAgICAgICAgIGtleTogJ2InLFxuICAgICAgICAgIG1ldGhvZDogXCJ2YWx1ZVwiLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYiddLFxuICAgICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIGZpZWxkOiBbJ21lYW5fZCddLFxuICAgICAgICAgICAgb3JkZXI6IFsnYXNjZW5kaW5nJ11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBhcmVhIHdpdGggY29sb3IgYW5kIGJpbm5lZCBkaW1lbnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgICBkaW1lbnNpb25GaWVsZERlZjoge1wiYmluXCI6IHttYXhiaW5zOiAxMH0sIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgZmFjZXRieTogW10sXG4gICAgICAgIHN0YWNrRmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgICAgaW1wdXRlOiB0cnVlLFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZXhwcjogJyhkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfYlxcXCJdK2RhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9iX2VuZFxcXCJdKS8yJyxcbiAgICAgICAgICBhczogJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgICAgZ3JvdXBieTogWydjJ10sXG4gICAgICAgICAga2V5OiAnYmluX21heGJpbnNfMTBfYl9taWQnLFxuICAgICAgICAgIG1ldGhvZDogXCJ2YWx1ZVwiLFxuICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYmluX21heGJpbnNfMTBfYl9taWQnXSxcbiAgICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnU3RhY2tOb2RlLm1ha2VGcm9tVHJhbnNmb3JtJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZmlsbCBpbiBvZmZzZXQgYW5kIHNvcnQgcHJvcGVybHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgc3RhY2sgOiAncGVvcGxlJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnXSxcbiAgICAgICAgYXM6IFsndjEnLCAndjInXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KHN0YWNrLmFzc2VtYmxlKCksIFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFsnYWdlJ10sXG4gICAgICAgIGZpZWxkOiAncGVvcGxlJyxcbiAgICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogW10gYXMgc3RyaW5nW10sIG9yZGVyOiBbXSBhcyBWZ0NvbXBhcmF0b3JPcmRlcltdfSBhcyBWZ1NvcnQsXG4gICAgICAgIGFzOiBbJ3YxJywgJ3YyJ11cbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmlsbCBpbiBwYXJ0aWFsIFwiYXNcIiBmaWVsZCBwcm9wZXJseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICBzdGFjayA6ICdwZW9wbGUnLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZScsICdnZW5kZXInXSxcbiAgICAgICAgb2Zmc2V0OiAnbm9ybWFsaXplJyxcbiAgICAgICAgYXM6IFwidmFsXCJcbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihzdGFjay5hc3NlbWJsZSgpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZScsICdnZW5kZXInXSxcbiAgICAgICAgZmllbGQ6ICdwZW9wbGUnLFxuICAgICAgICBvZmZzZXQ6ICdub3JtYWxpemUnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6IFtdIGFzIHN0cmluZ1tdLCBvcmRlcjogW10gYXMgVmdDb21wYXJhdG9yT3JkZXJbXX0gYXMgVmdTb3J0LFxuICAgICAgICBhczogW1widmFsXCIsIFwidmFsX2VuZFwiXVxuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxldGUgXCJzb3J0XCInLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgc3RhY2sgOiAncGVvcGxlJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnLCAnZ2VuZGVyJ10sXG4gICAgICAgIG9mZnNldDogJ25vcm1hbGl6ZScsXG4gICAgICAgIHNvcnQ6IFt7J2ZpZWxkJzogJ2hlaWdodCcsICdvcmRlcic6ICdhc2NlbmRpbmcnfSxcbiAgICAgICAgICAgICAgIHsnZmllbGQnOiAnd2VpZ2h0JywgJ29yZGVyJzogJ2Rlc2NlbmRpbmcnfV0sXG4gICAgICAgIGFzOiAndmFsJ1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KHN0YWNrLmFzc2VtYmxlKCksIFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFsnYWdlJywgJ2dlbmRlciddLFxuICAgICAgICBmaWVsZDogJ3Blb3BsZScsXG4gICAgICAgIG9mZnNldDogJ25vcm1hbGl6ZScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogWydoZWlnaHQnLCAnd2VpZ2h0J10sIG9yZGVyOiBbJ2FzY2VuZGluZycsICdkZXNjZW5kaW5nJ119LFxuICAgICAgICBhczogW1widmFsXCIsIFwidmFsX2VuZFwiXVxuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5jb21wbGV0ZSBcInNvcnRcIiBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICBzdGFjayA6ICdwZW9wbGUnLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZScsICdnZW5kZXInXSxcbiAgICAgICAgb2Zmc2V0OiAnbm9ybWFsaXplJyxcbiAgICAgICAgc29ydDogW3snZmllbGQnOiAnaGVpZ2h0J31dLFxuICAgICAgICBhczogJ3ZhbCdcbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0cmFuc2Zvcm0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KHN0YWNrLmFzc2VtYmxlKCksIFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFsnYWdlJywgJ2dlbmRlciddLFxuICAgICAgICBmaWVsZDogJ3Blb3BsZScsXG4gICAgICAgIG9mZnNldDogJ25vcm1hbGl6ZScsXG4gICAgICAgIHNvcnQ6IHtmaWVsZDogWydoZWlnaHQnXSwgb3JkZXI6IFsnYXNjZW5kaW5nJ119LFxuICAgICAgICBhczogW1widmFsXCIsIFwidmFsX2VuZFwiXVxuICAgICAgfV0pO1xuICAgIH0pO1xuXG4gIH0pO1xuICBkZXNjcmliZSgnU3RhY2tOb2RlLnByb2R1Y2VkRmllbGRzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZ2l2ZSBwcm9kdWNlZGZpZWxkcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgc3RhY2s6ICdwZW9wbGUnLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZSddLFxuICAgICAgICBhczogJ3Blb3BsZSdcblxuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKG51bGwsIHRyYW5zZm9ybSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHN0YWNrLnByb2R1Y2VkRmllbGRzKCksIHtcbiAgICAgICAgcGVvcGxlOiB0cnVlLFxuICAgICAgICBwZW9wbGVfZW5kOiB0cnVlXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBnaXZlIHByb2R1Y2VkRmllbGRzIGNvcnJlY3RseSB3aGVuIGluIGVuY29kaW5nIGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2tOb2RlLm1ha2VGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzdGFjay5wcm9kdWNlZEZpZWxkcygpLCB7XG4gICAgICAgIHN1bV9hX3N0YXJ0OiB0cnVlLFxuICAgICAgICBzdW1fYV9lbmQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19