"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var calculate_1 = require("../../../src/compile/data/calculate");
var filter_1 = require("../../../src/compile/data/filter");
var parse_1 = require("../../../src/compile/data/parse");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
describe('compile/data/parse', function () {
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
            var result = parse_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof calculate_1.CalculateNode);
            chai_1.assert.isTrue(result.last instanceof filter_1.FilterNode);
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
            var result = parse_1.parseTransformArray(model);
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
            var result = parse_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result.last instanceof aggregate_1.AggregateNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSxxREFBc0Q7QUFDdEQsaUVBQWtFO0FBQ2xFLDJEQUE0RDtBQUM1RCx5REFBb0U7QUFDcEUsK0RBQWdFO0FBQ2hFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDO2dCQUNuRSxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxNQUFNLEdBQUcsMkJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUNyRCxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksbUJBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLENBQUM7Z0JBQy9GLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksYUFBTyxDQUFDLENBQUM7WUFDL0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxZQUFZLHVCQUFZLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQztnQkFDeEssUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDJCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssWUFBWSxhQUFPLENBQUMsQ0FBQztZQUMvQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVkseUJBQWEsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9