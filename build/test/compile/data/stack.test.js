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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUEwRTtBQUkxRSxtQ0FBbUQ7QUFFbkQsZUFBZSxLQUFnQjtJQUM3QixPQUFPLGlCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDM0MsQ0FBQztBQUVELGtCQUFrQixLQUFnQjtJQUNoQyxPQUFPLGlCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoRCxDQUFDO0FBRUQsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLEVBQUUsQ0FBQywyREFBMkQsRUFBRTtRQUM5RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztZQUNwQyxNQUFNLEVBQUUsS0FBSztZQUNiLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztnQkFDL0QsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUN0QyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUU7YUFDNUM7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFpQixLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDN0MsaUJBQWlCLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7WUFDaEQsT0FBTyxFQUFFLEVBQUU7WUFDWCxLQUFLLEVBQUUsT0FBTztZQUNkLE9BQU8sRUFB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QUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxJQUFJO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBZ0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9DO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLElBQUksRUFBRSxpRUFBaUU7Z0JBQ3ZFLEVBQUUsRUFBRSxzQkFBc0I7YUFDM0I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsT0FBTztnQkFDZCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2QsR0FBRyxFQUFFLHNCQUFzQjtnQkFDM0IsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsS0FBSyxFQUFFLENBQUM7YUFDVDtZQUNEO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2dCQUNqQyxLQUFLLEVBQUUsT0FBTztnQkFDZCxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNaLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDdEI7Z0JBQ0QsRUFBRSxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQztnQkFDaEMsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge1N0YWNrQ29tcG9uZW50LCBTdGFja05vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc3RhY2snO1xuXG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge1ZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIHBhcnNlKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgcmV0dXJuIFN0YWNrTm9kZS5tYWtlKG51bGwsIG1vZGVsKS5zdGFjaztcbn1cblxuZnVuY3Rpb24gYXNzZW1ibGUobW9kZWw6IFVuaXRNb2RlbCkge1xuICByZXR1cm4gU3RhY2tOb2RlLm1ha2UobnVsbCwgbW9kZWwpLmFzc2VtYmxlKCk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvc3RhY2snLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgYmFyIHdpdGggY29sb3InLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZjoge2ZpZWxkOiAnYicsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICB9LFxuICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICBpbXB1dGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCB3aXRoIGJvdGggc3RhcnQgYW5kIGVuZCBvZiB0aGUgYmlubmVkIGZpZWxkIGZvciBiYXIgd2l0aCBjb2xvciBhbmQgYmlubmVkIHknLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIix9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7XCJiaW5cIjoge21heGJpbnM6IDEwfSwgXCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgIHN0YWNrYnk6IFsnYyddLFxuICAgICAgc29ydDoge1xuICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgfSxcbiAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgaW1wdXRlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIDFEIGJhciB3aXRoIGNvbG9yJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIix9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB1bmRlZmluZWQsXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICB9LFxuICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICBpbXB1dGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KGFzc2VtYmxlKG1vZGVsKSwgW3tcbiAgICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgICAgZ3JvdXBieTogW10sXG4gICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXSxcbiAgICAgICAgb2Zmc2V0OiAnemVybydcbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBhcmVhIHdpdGggY29sb3IgYW5kIG9yZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgXCJvcmRlclwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsIFwiZmllbGRcIjogXCJkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZjoge2ZpZWxkOiAnYicsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbJ21lYW5fZCddLFxuICAgICAgICBvcmRlcjogWydhc2NlbmRpbmcnXVxuICAgICAgfSxcbiAgICAgIG9mZnNldDogJ3plcm8nLFxuICAgICAgaW1wdXRlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnVHJhbnNmb3JtW10+KGFzc2VtYmxlKG1vZGVsKSwgW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIGdyb3VwYnk6IFsnYyddLFxuICAgICAgICBrZXk6ICdiJyxcbiAgICAgICAgbWV0aG9kOiBcInZhbHVlXCIsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2InXSxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydtZWFuX2QnXSxcbiAgICAgICAgICBvcmRlcjogWydhc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXSxcbiAgICAgICAgb2Zmc2V0OiAnemVybydcbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBhcmVhIHdpdGggY29sb3IgYW5kIGJpbm5lZCBkaW1lbnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtcImJpblwiOiB7bWF4YmluczogMTB9LCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICB9LFxuICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICBpbXB1dGU6IHRydWVcbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgZXhwcjogJyhkYXR1bVtcXFwiYmluX21heGJpbnNfMTBfYlxcXCJdK2RhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9iX2VuZFxcXCJdKS8yJyxcbiAgICAgICAgYXM6ICdiaW5fbWF4Ymluc18xMF9iX21pZCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgZ3JvdXBieTogWydjJ10sXG4gICAgICAgIGtleTogJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJyxcbiAgICAgICAgbWV0aG9kOiBcInZhbHVlXCIsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJ10sXG4gICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICAgIG9yZGVyOiBbJ2Rlc2NlbmRpbmcnXVxuICAgICAgICB9LFxuICAgICAgICBhczogWydzdW1fYV9zdGFydCcsICdzdW1fYV9lbmQnXSxcbiAgICAgICAgb2Zmc2V0OiAnemVybydcbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG59KTtcbiJdfQ==