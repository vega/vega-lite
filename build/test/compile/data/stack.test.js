"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var stack_1 = require("../../../src/compile/data/stack");
var util_1 = require("../../util");
function parse(model) {
    return stack_1.StackNode.make(null, model).stack;
}
function assemble(model) {
    return stack_1.StackNode.make(null, model).assemble();
}
describe('compile/data/stack', function () {
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
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['c'],
                order: ['descending']
            },
            offset: 'zero',
            impute: false
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
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['mean_d'],
                order: ['ascending']
            },
            offset: 'zero',
            impute: true
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
            field: 'sum_a',
            stackby: ['c'],
            sort: {
                field: ['c'],
                order: ['descending']
            },
            offset: 'zero',
            impute: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUEwRTtBQUkxRSxtQ0FBbUQ7QUFFbkQsZUFBZSxLQUFnQjtJQUM3QixNQUFNLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMzQyxDQUFDO0FBRUQsa0JBQWtCLEtBQWdCO0lBQ2hDLE1BQU0sQ0FBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEQsQ0FBQztBQUVELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixFQUFFLENBQUMsMkRBQTJELEVBQUU7UUFDOUQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7WUFDcEMsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQy9ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDdEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFFO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBaUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdDLGlCQUFpQixFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO1lBQ2hELE9BQU8sRUFBRSxFQUFFO1lBQ1gsS0FBSyxFQUFFLE9BQU87WUFD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Q3RCO1lBQ0QsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWdCLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMvQztnQkFDRSxJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsaUVBQWlFO2dCQUN2RSxFQUFFLEVBQUUsc0JBQXNCO2FBQzNCO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNkLEdBQUcsRUFBRSxzQkFBc0I7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLEtBQUssRUFBRSxDQUFDO2FBQ1Q7WUFDRDtnQkFDRSxJQUFJLEVBQUUsT0FBTztnQkFDYixPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDakMsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDWixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQ3RCO2dCQUNELEVBQUUsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUM7Z0JBQ2hDLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtTdGFja0NvbXBvbmVudCwgU3RhY2tOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrJztcblxuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtWZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBwYXJzZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIHJldHVybiBTdGFja05vZGUubWFrZShudWxsLCBtb2RlbCkuc3RhY2s7XG59XG5cbmZ1bmN0aW9uIGFzc2VtYmxlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIFN0YWNrTm9kZS5tYWtlKG51bGwsIG1vZGVsKS5hc3NlbWJsZSgpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3N0YWNrJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIGJhciB3aXRoIGNvbG9yJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgfSxcbiAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgaW1wdXRlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgd2l0aCBib3RoIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGJpbm5lZCBmaWVsZCBmb3IgYmFyIHdpdGggY29sb3IgYW5kIGJpbm5lZCB5JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZjoge1wiYmluXCI6IHttYXhiaW5zOiAxMH0sIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgIGltcHV0ZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciAxRCBiYXIgd2l0aCBjb2xvcicsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZjogdW5kZWZpbmVkLFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgfSxcbiAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgaW1wdXRlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihhc3NlbWJsZShtb2RlbCksIFt7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFtdLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ10sXG4gICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgYXJlYSB3aXRoIGNvbG9yIGFuZCBvcmRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwib3JkZXJcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcImZpZWxkXCI6IFwiZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogWydtZWFuX2QnXSxcbiAgICAgICAgb3JkZXI6IFsnYXNjZW5kaW5nJ11cbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgIGltcHV0ZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihhc3NlbWJsZShtb2RlbCksIFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBncm91cGJ5OiBbJ2MnXSxcbiAgICAgICAga2V5OiAnYicsXG4gICAgICAgIG1ldGhvZDogXCJ2YWx1ZVwiLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgZ3JvdXBieTogWydiJ10sXG4gICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnbWVhbl9kJ10sXG4gICAgICAgICAgb3JkZXI6IFsnYXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ10sXG4gICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgYXJlYSB3aXRoIGNvbG9yIGFuZCBiaW5uZWQgZGltZW5zaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7XCJiaW5cIjoge21heGJpbnM6IDEwfSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgfSxcbiAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgaW1wdXRlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KGFzc2VtYmxlKG1vZGVsKSwgW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgIGV4cHI6ICcoZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX2JcXFwiXStkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfYl9lbmRcXFwiXSkvMicsXG4gICAgICAgIGFzOiAnYmluX21heGJpbnNfMTBfYl9taWQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIGdyb3VwYnk6IFsnYyddLFxuICAgICAgICBrZXk6ICdiaW5fbWF4Ymluc18xMF9iX21pZCcsXG4gICAgICAgIG1ldGhvZDogXCJ2YWx1ZVwiLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgZ3JvdXBieTogWydiaW5fbWF4Ymluc18xMF9iX21pZCddLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgICAgfSxcbiAgICAgICAgYXM6IFsnc3VtX2Ffc3RhcnQnLCAnc3VtX2FfZW5kJ10sXG4gICAgICAgIG9mZnNldDogJ3plcm8nXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=