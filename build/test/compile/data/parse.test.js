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
                transform: [{ bin: true, field: 'field', as: 'a' }, { aggregate: [{ op: 'count', field: 'f', as: 'b' }, { op: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSxxREFBc0Q7QUFDdEQsaUVBQWtFO0FBQ2xFLDJEQUE0RDtBQUM1RCx5REFBb0U7QUFDcEUsK0RBQWdFO0FBQ2hFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDO2dCQUNuRSxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxNQUFNLEdBQUcsMkJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUNyRCxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksbUJBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLENBQUM7Z0JBQy9GLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksYUFBTyxDQUFDLENBQUM7WUFDL0MsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxZQUFZLHVCQUFZLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQztnQkFDMUosUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLDJCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssWUFBWSxhQUFPLENBQUMsQ0FBQztZQUMvQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVkseUJBQWEsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9wYXJzZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlVHJhbnNmb3JtQXJyYXkoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIENhbGN1bGF0ZU5vZGUgYW5kIGEgRmlsdGVyTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tjYWxjdWxhdGU6ICdjYWxjdWxhdGUnLCBhczogJ2FzJ30sIHtmaWx0ZXI6ICdmaWx0ZXInfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdC5maXJzdCBpbnN0YW5jZW9mIENhbGN1bGF0ZU5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQubGFzdCBpbnN0YW5jZW9mIEZpbHRlck5vZGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBCaW5Ob2RlIG5vZGUgYW5kIGEgVGltZVVuaXROb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe2JpbjogdHJ1ZSwgZmllbGQ6ICdmaWVsZCcsIGFzOiAnYSd9LCB7dGltZVVuaXQ6ICdtb250aCcsIGZpZWxkOiAnZmllbGQnLCBhczogJ2InfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdC5maXJzdCBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQubGFzdCBpbnN0YW5jZW9mIFRpbWVVbml0Tm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIEJpbk5vZGUgYW5kIGEgQWdncmVnYXRlTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tiaW46IHRydWUsIGZpZWxkOiAnZmllbGQnLCBhczogJ2EnfSwge2FnZ3JlZ2F0ZTogW3tvcDogJ2NvdW50JywgZmllbGQ6ICdmJywgYXM6ICdiJ30sIHtvcDogJ3N1bScsIGZpZWxkOiAnZicsIGFzOiAnYyd9XSwgZ3JvdXBieTogWydmaWVsZCddfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdC5maXJzdCBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQubGFzdCBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZU5vZGUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19