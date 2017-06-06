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
        var model = util_1.parseUnitModel({
            "mark": "bar",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "y": { "field": "b", "type": "nominal" },
                "color": { "field": "c", "type": "ordinal", }
            }
        });
        chai_1.assert.deepEqual(parse(model), {
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
        chai_1.assert.deepEqual(parse(model), {
            groupby: ["bin_maxbins_10_b_start", "bin_maxbins_10_b_end"],
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
        chai_1.assert.deepEqual(parse(model), {
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
        var model = util_1.parseUnitModel({
            "mark": "area",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "y": { "field": "b", "type": "nominal" },
                "color": { "field": "c", "type": "nominal" },
                "order": { "aggregate": "mean", "field": "d", "type": "quantitative" }
            }
        });
        chai_1.assert.deepEqual(parse(model), {
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
        chai_1.assert.deepEqual(assemble(model), [
            {
                type: 'impute',
                field: 'sum_a',
                groupby: ['c'],
                orderby: ['b'],
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3N0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUEwRTtBQUkxRSxtQ0FBMEM7QUFFMUMsZUFBZSxLQUFnQjtJQUM3QixNQUFNLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxrQkFBa0IsS0FBZ0I7SUFDaEMsTUFBTSxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFDLENBQUM7QUFFRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsRUFBRSxDQUFDLDJEQUEyRCxFQUFFO1FBQzlELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQy9ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDdEMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxHQUFFO2FBQzVDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBaUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNkLEtBQUssRUFBRSxPQUFPO1lBQ2QsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2QsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQztn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