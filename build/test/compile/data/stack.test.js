"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var stack_1 = require("../../../src/compile/data/stack");
var util_1 = require("../../util");
function parse(model) {
    return stack_1.StackNode.make(model).stack;
}
function assemble(model) {
    return stack_1.StackNode.make(model).assemble();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUEwRTtBQUkxRSxtQ0FBbUQ7QUFFbkQsZUFBZSxLQUFnQjtJQUM3QixNQUFNLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxrQkFBa0IsS0FBZ0I7SUFDaEMsTUFBTSxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFFRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1FBQzlELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQ3RDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRTthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWlCLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QyxpQkFBaUIsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztZQUNoRCxPQUFPLEVBQUUsRUFBRTtZQUNYLEtBQUssRUFBRSxPQUFPO1lBQ2QsT0FBTyxFQUFFLENBQUMsR0FB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QUFNO1lBQ2QsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsU0FBUyxDQUFnQixRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0M7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFLGlFQUFpRTtnQkFDdkUsRUFBRSxFQUFFLHNCQUFzQjthQUMzQjtZQUNEO2dCQUNFLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxPQUFPO2dCQUNkLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDZCxHQUFHLEVBQUUsc0JBQXNCO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixLQUFLLEVBQUUsQ0FBQzthQUNUO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7Z0JBQ2pDLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ1osS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN0QjtnQkFDRCxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDO2dCQUNoQyxNQUFNLEVBQUUsTUFBTTthQUNmO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7U3RhY2tDb21wb25lbnQsIFN0YWNrTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zdGFjayc7XG5cbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS91bml0JztcbmltcG9ydCB7VmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZnVuY3Rpb24gcGFyc2UobW9kZWw6IFVuaXRNb2RlbCkge1xuICByZXR1cm4gU3RhY2tOb2RlLm1ha2UobW9kZWwpLnN0YWNrO1xufVxuXG5mdW5jdGlvbiBhc3NlbWJsZShtb2RlbDogVW5pdE1vZGVsKSB7XG4gIHJldHVybiBTdGFja05vZGUubWFrZShtb2RlbCkuYXNzZW1ibGUoKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9zdGFjaycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IGZvciBiYXIgd2l0aCBjb2xvcicsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIix9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7ZmllbGQ6ICdiJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgIGltcHV0ZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3Qgc3RhY2sgY29tcG9uZW50IHdpdGggYm90aCBzdGFydCBhbmQgZW5kIG9mIHRoZSBiaW5uZWQgZmllbGQgZm9yIGJhciB3aXRoIGNvbG9yIGFuZCBiaW5uZWQgeScsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWY6IHtcImJpblwiOiB7bWF4YmluczogMTB9LCBcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgc3RhY2tieTogWydjJ10sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbJ2MnXSxcbiAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICB9LFxuICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICBpbXB1dGU6IGZhbHNlXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IHN0YWNrIGNvbXBvbmVudCBmb3IgMUQgYmFyIHdpdGggY29sb3InLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8U3RhY2tDb21wb25lbnQ+KHBhcnNlKG1vZGVsKSwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWY6IHVuZGVmaW5lZCxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgIGltcHV0ZTogZmFsc2VcbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbe1xuICAgICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgICBncm91cGJ5OiBbXSxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIGFyZWEgd2l0aCBjb2xvciBhbmQgb3JkZXInLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICBcIm9yZGVyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJmaWVsZFwiOiBcImRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFN0YWNrQ29tcG9uZW50PihwYXJzZShtb2RlbCksIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmOiB7ZmllbGQ6ICdiJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFsnbWVhbl9kJ10sXG4gICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICB9LFxuICAgICAgb2Zmc2V0OiAnemVybycsXG4gICAgICBpbXB1dGU6IHRydWVcbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdUcmFuc2Zvcm1bXT4oYXNzZW1ibGUobW9kZWwpLCBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgZ3JvdXBieTogWydjJ10sXG4gICAgICAgIGtleTogJ2InLFxuICAgICAgICBtZXRob2Q6IFwidmFsdWVcIixcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFsnYiddLFxuICAgICAgICBmaWVsZDogJ3N1bV9hJyxcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIGZpZWxkOiBbJ21lYW5fZCddLFxuICAgICAgICAgIG9yZGVyOiBbJ2FzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgfVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBzdGFjayBjb21wb25lbnQgZm9yIGFyZWEgd2l0aCBjb2xvciBhbmQgYmlubmVkIGRpbWVuc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxTdGFja0NvbXBvbmVudD4ocGFyc2UobW9kZWwpLCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZjoge1wiYmluXCI6IHttYXhiaW5zOiAxMH0sIFwiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICBzdGFja2J5OiBbJ2MnXSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFsnYyddLFxuICAgICAgICBvcmRlcjogWydkZXNjZW5kaW5nJ11cbiAgICAgIH0sXG4gICAgICBvZmZzZXQ6ICd6ZXJvJyxcbiAgICAgIGltcHV0ZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ1RyYW5zZm9ybVtdPihhc3NlbWJsZShtb2RlbCksIFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICBleHByOiAnKGRhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9iXFxcIl0rZGF0dW1bXFxcImJpbl9tYXhiaW5zXzEwX2JfZW5kXFxcIl0pLzInLFxuICAgICAgICBhczogJ2Jpbl9tYXhiaW5zXzEwX2JfbWlkJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgICAgIGZpZWxkOiAnc3VtX2EnLFxuICAgICAgICBncm91cGJ5OiBbJ2MnXSxcbiAgICAgICAga2V5OiAnYmluX21heGJpbnNfMTBfYl9taWQnLFxuICAgICAgICBtZXRob2Q6IFwidmFsdWVcIixcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICAgIGdyb3VwYnk6IFsnYmluX21heGJpbnNfMTBfYl9taWQnXSxcbiAgICAgICAgZmllbGQ6ICdzdW1fYScsXG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBmaWVsZDogWydjJ10sXG4gICAgICAgICAgb3JkZXI6IFsnZGVzY2VuZGluZyddXG4gICAgICAgIH0sXG4gICAgICAgIGFzOiBbJ3N1bV9hX3N0YXJ0JywgJ3N1bV9hX2VuZCddLFxuICAgICAgICBvZmZzZXQ6ICd6ZXJvJ1xuICAgICAgfVxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19