"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var transforms_1 = require("../../../src/compile/data/transforms");
var util_1 = require("../../util");
describe('compile/data/transform', function () {
    describe('parseTransformArray()', function () {
        it('should return a CalculateNode and a FilterNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ calculate: 'calculate', as: 'as' }, { filter: 'filter' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof transforms_1.CalculateNode);
            chai_1.assert.isTrue(result.last instanceof transforms_1.FilterNode);
        });
        it('should return a BinNode node and a TimeUnitNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { timeUnit: 'month', field: 'field', as: 'b' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result.last instanceof timeunit_1.TimeUnitNode);
        });
        it('should return a BinNode and a AggregateNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { summarize: [{ aggregate: 'count', field: 'f', as: 'b' }, { aggregate: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result.last instanceof aggregate_1.AggregateNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS90cmFuc2Zvcm0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixpRUFBa0U7QUFDbEUscURBQXNEO0FBQ3RELCtEQUFnRTtBQUNoRSxtRUFBb0c7QUFFcEcsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtJQUNqQyxRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUM7Z0JBQ25FLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRyxnQ0FBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksMEJBQWEsQ0FBQyxDQUFDO1lBQ3JELGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSx1QkFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsQ0FBQztnQkFDL0YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLGdDQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssWUFBWSxhQUFPLENBQUMsQ0FBQztZQUMvQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksdUJBQVksQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDO2dCQUN4SyxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxNQUFNLEdBQUcsZ0NBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxZQUFZLGFBQU8sQ0FBQyxDQUFDO1lBQy9DLGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSx5QkFBYSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=