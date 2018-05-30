/* tslint:disable:quotemark */
import { assert } from 'chai';
import { StackNode } from '../../../src/compile/data/stack';
import { parseUnitModelWithScale } from '../../util';
function parse(model) {
    return StackNode.makeFromEncoding(null, model).stack;
}
function assemble(model) {
    return StackNode.makeFromEncoding(null, model).assemble();
}
describe('compile/data/stack', function () {
    describe('StackNode.makeFromEncoding', function () {
        it('should produce correct stack component for bar with color', function () {
            var model = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            assert.deepEqual(parse(model), {
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
            var model = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "bin": true, "field": "b", "type": "quantitative" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            assert.deepEqual(parse(model), {
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
            var model = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            assert.deepEqual(parse(model), {
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
            assert.deepEqual(assemble(model), [{
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
            var model = parseUnitModelWithScale({
                "mark": "area",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "nominal" },
                    "order": { "aggregate": "mean", "field": "d", "type": "quantitative" }
                }
            });
            assert.deepEqual(parse(model), {
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
            assert.deepEqual(assemble(model), [
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
            var model = parseUnitModelWithScale({
                "mark": "area",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "bin": true, "field": "b", "type": "quantitative" },
                    "color": { "field": "c", "type": "nominal" }
                }
            });
            assert.deepEqual(parse(model), {
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
            assert.deepEqual(assemble(model), [
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
            var stack = StackNode.makeFromTransform(null, transform);
            assert.deepEqual(stack.assemble(), [{
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
            var stack = StackNode.makeFromTransform(null, transform);
            assert.deepEqual(stack.assemble(), [{
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
            var stack = StackNode.makeFromTransform(null, transform);
            assert.deepEqual(stack.assemble(), [{
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
            var stack = StackNode.makeFromTransform(null, transform);
            assert.deepEqual(stack.assemble(), [{
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
            var stack = StackNode.makeFromTransform(null, transform);
            assert.deepEqual(stack.producedFields(), {
                people: true,
                people_end: true
            });
        });
        it('should give producedFields correctly when in encoding channel', function () {
            var model = parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "nominal" },
                    "color": { "field": "c", "type": "ordinal", }
                }
            });
            var stack = StackNode.makeFromEncoding(null, model);
            assert.deepEqual(stack.producedFields(), {
                sum_a_start: true,
                sum_a_end: true
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFpQixTQUFTLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUkxRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbkQsZUFBZSxLQUFnQjtJQUM3QixPQUFPLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxrQkFBa0IsS0FBZ0I7SUFDaEMsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVELENBQUM7QUFDRCxRQUFRLENBQUUsb0JBQW9CLEVBQUU7SUFFOUIsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM5RCxJQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztnQkFDcEMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUMvRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3RDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRTtpQkFDNUM7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFpQixLQUFLLENBQUMsS0FBSyxDQUFDLEVB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O2FBRWIsQ0FBQztZQUNGLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ3ZDLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQztRQUVMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2xFLElBQU0sS0FBSyxHQUFHLHVCQUF1QixDQUFDO2dCQUNwQyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQy9ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDdEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFFO2lCQUM1QzthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ3ZDLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge1N0YWNrQ29tcG9uZW50LCBTdGFja05vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc3RhY2snO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtWZ0NvbXBhcmF0b3JPcmRlciwgVmdTb3J0LCBWZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBwYXJzZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIHJldHVybiBTdGFja05vZGUubWFrZUZyb21FbmNvZGluZyhudWxsLCBtb2RlbCkuc3RhY2s7XG59XG5cbmZ1bmN0aW9uIGFzc2VtYmxlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIFN0YWNrTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuZGVzY3JpYmUgKCdjb21waWxlL2RhdGEvc3RhY2snLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJ1N0YWNrTm9kZS5tYWtlRnJvbUVuY29kaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgYmFyIHdpdGggY29sb3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7ZmllbGQ6ICdiJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgICAgZmFjZXRieTogW10sXG4gICAgICAgIHN0YWNrRmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgICAgaW1wdXRlOiBmYWxzZSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IHdpdGggYm90aCBzdGFydCBhbmQgZW5kIG9mIHRoZSBiaW5uZWQgZmllbGQgZm9yIGJhciB3aXRoIGNvbG9yIGFuZCBiaW5uZWQgeScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgICBkaW1lbnNpb25GaWVsZERlZjoge1wiYmluXCI6IHttYXhiaW5zOiAxMH0sIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgZmFjZXRieTogW10sXG4gICAgICAgIHN0YWNrRmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgICAgaW1wdXRlOiBmYWxzZSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciAxRCBiYXIgd2l0aCBjb2xvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgICBkaW1lbnNpb25GaWVsZERlZjogdW5kZWZpbmVkLFxuICAgICAgICBmYWNldGJ5OiBbXSxcbiAgICAgICAgc3RhY2tGaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgICBpbXB1dGU6IGZhbHNlLFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbXSxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBhcmVhIHdpdGggY29sb3IgYW5kIG9yZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcIm9yZGVyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiBcImRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgICBmYWNldGJ5OiBbXSxcbiAgICAgICAgc3RhY2tGaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydtZWFuX2QnXSxcbiAgICAgICAgICBvcmRlcjogWydhc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgICAgaW1wdXRlOiB0cnVlLFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2MnXSxcbiAgICAgICAgICBrZXk6ICdiJyxcbiAgICAgICAgICBtZXRob2Q6IFwidmFsdWVcIixcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2InXSxcbiAgICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBmaWVsZDogWydtZWFuX2QnXSxcbiAgICAgICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXSxcbiAgICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgYXJlYSB3aXRoIGNvbG9yIGFuZCBiaW5uZWQgZGltZW5zaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtcImJpblwiOiB7bWF4YmluczogMTB9LCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgICBzdGFja0ZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICAgIGltcHV0ZTogdHJ1ZSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ11cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KGFzc2VtYmxlKG1vZGVsKSwgW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgIGV4cHI6ICcoZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX2JcXFwiXStkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfYl9lbmRcXFwiXSkvMicsXG4gICAgICAgICAgYXM6ICdiaW5fbWF4Ymluc18xMF9iX21pZCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYyddLFxuICAgICAgICAgIGtleTogJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJyxcbiAgICAgICAgICBtZXRob2Q6IFwidmFsdWVcIixcbiAgICAgICAgICB2YWx1ZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJ10sXG4gICAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXSxcbiAgICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1N0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZpbGwgaW4gb2Zmc2V0IGFuZCBzb3J0IHByb3Blcmx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHN0YWNrIDogJ3Blb3BsZScsXG4gICAgICAgIGdyb3VwYnk6IFsnYWdlJ10sXG4gICAgICAgIGFzOiBbJ3YxJywgJ3YyJ11cbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihzdGFjay5hc3NlbWJsZSgpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZSddLFxuICAgICAgICBmaWVsZDogJ3Blb3BsZScsXG4gICAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6IFtdIGFzIHN0cmluZ1tdLCBvcmRlcjogW10gYXMgVmdDb21wYXJhdG9yT3JkZXJbXX0gYXMgVmdTb3J0LFxuICAgICAgICBhczogWyd2MScsICd2MiddXG4gICAgICB9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGZpbGwgaW4gcGFydGlhbCBcImFzXCIgZmllbGQgcHJvcGVybHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgc3RhY2sgOiAncGVvcGxlJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnLCAnZ2VuZGVyJ10sXG4gICAgICAgIG9mZnNldDogJ25vcm1hbGl6ZScsXG4gICAgICAgIGFzOiBcInZhbFwiXG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RhY2sgPSBTdGFja05vZGUubWFrZUZyb21UcmFuc2Zvcm0obnVsbCwgdHJhbnNmb3JtKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oc3RhY2suYXNzZW1ibGUoKSwgW3tcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnLCAnZ2VuZGVyJ10sXG4gICAgICAgIGZpZWxkOiAncGVvcGxlJyxcbiAgICAgICAgb2Zmc2V0OiAnbm9ybWFsaXplJyxcbiAgICAgICAgc29ydDoge2ZpZWxkOiBbXSBhcyBzdHJpbmdbXSwgb3JkZXI6IFtdIGFzIFZnQ29tcGFyYXRvck9yZGVyW119IGFzIFZnU29ydCxcbiAgICAgICAgYXM6IFtcInZhbFwiLCBcInZhbF9lbmRcIl1cbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXRlIFwic29ydFwiJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHN0YWNrIDogJ3Blb3BsZScsXG4gICAgICAgIGdyb3VwYnk6IFsnYWdlJywgJ2dlbmRlciddLFxuICAgICAgICBvZmZzZXQ6ICdub3JtYWxpemUnLFxuICAgICAgICBzb3J0OiBbeydmaWVsZCc6ICdoZWlnaHQnLCAnb3JkZXInOiAnYXNjZW5kaW5nJ30sXG4gICAgICAgICAgICAgICB7J2ZpZWxkJzogJ3dlaWdodCcsICdvcmRlcic6ICdkZXNjZW5kaW5nJ31dLFxuICAgICAgICBhczogJ3ZhbCdcbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihzdGFjay5hc3NlbWJsZSgpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZScsICdnZW5kZXInXSxcbiAgICAgICAgZmllbGQ6ICdwZW9wbGUnLFxuICAgICAgICBvZmZzZXQ6ICdub3JtYWxpemUnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6IFsnaGVpZ2h0JywgJ3dlaWdodCddLCBvcmRlcjogWydhc2NlbmRpbmcnLCAnZGVzY2VuZGluZyddfSxcbiAgICAgICAgYXM6IFtcInZhbFwiLCBcInZhbF9lbmRcIl1cbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluY29tcGxldGUgXCJzb3J0XCIgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgc3RhY2sgOiAncGVvcGxlJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnLCAnZ2VuZGVyJ10sXG4gICAgICAgIG9mZnNldDogJ25vcm1hbGl6ZScsXG4gICAgICAgIHNvcnQ6IFt7J2ZpZWxkJzogJ2hlaWdodCd9XSxcbiAgICAgICAgYXM6ICd2YWwnXG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RhY2sgPSBTdGFja05vZGUubWFrZUZyb21UcmFuc2Zvcm0obnVsbCwgdHJhbnNmb3JtKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihzdGFjay5hc3NlbWJsZSgpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2FnZScsICdnZW5kZXInXSxcbiAgICAgICAgZmllbGQ6ICdwZW9wbGUnLFxuICAgICAgICBvZmZzZXQ6ICdub3JtYWxpemUnLFxuICAgICAgICBzb3J0OiB7ZmllbGQ6IFsnaGVpZ2h0J10sIG9yZGVyOiBbJ2FzY2VuZGluZyddfSxcbiAgICAgICAgYXM6IFtcInZhbFwiLCBcInZhbF9lbmRcIl1cbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICB9KTtcbiAgZGVzY3JpYmUoJ1N0YWNrTm9kZS5wcm9kdWNlZEZpZWxkcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGdpdmUgcHJvZHVjZWRmaWVsZHMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHN0YWNrOiAncGVvcGxlJyxcbiAgICAgICAgZ3JvdXBieTogWydhZ2UnXSxcbiAgICAgICAgYXM6ICdwZW9wbGUnXG5cbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzdGFjay5wcm9kdWNlZEZpZWxkcygpLCB7XG4gICAgICAgIHBlb3BsZTogdHJ1ZSxcbiAgICAgICAgcGVvcGxlX2VuZDogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZ2l2ZSBwcm9kdWNlZEZpZWxkcyBjb3JyZWN0bHkgd2hlbiBpbiBlbmNvZGluZyBjaGFubmVsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3RhY2sucHJvZHVjZWRGaWVsZHMoKSwge1xuICAgICAgICBzdW1fYV9zdGFydDogdHJ1ZSxcbiAgICAgICAgc3VtX2FfZW5kOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==