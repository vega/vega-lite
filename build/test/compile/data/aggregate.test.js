"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var util_1 = require("../../util");
describe('compile/data/summary', function () {
    describe('clone', function () {
        it('should have correct type', function () {
            var agg = new aggregate_1.AggregateNode(null, {}, {});
            chai_1.assert(agg instanceof aggregate_1.AggregateNode);
            var clone = agg.clone();
            chai_1.assert(clone instanceof aggregate_1.AggregateNode);
        });
        it('should have make a deep copy', function () {
            var agg = new aggregate_1.AggregateNode(null, { foo: true }, {});
            var clone = agg.clone();
            clone.addDimensions(['bar']);
            chai_1.assert.deepEqual(clone.dependentFields(), { 'foo': true, 'bar': true });
            chai_1.assert.deepEqual(agg.dependentFields(), { 'foo': true });
        });
    });
    describe('parseUnit', function () {
        it('should produce the correct summary component for sum(Acceleration) and count(*)', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'y': {
                        'aggregate': 'sum',
                        'field': 'Acceleration',
                        'type': "quantitative"
                    },
                    'x': {
                        'field': 'Origin',
                        'type': "ordinal"
                    },
                    color: { type: "quantitative", aggregate: 'count' }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin'],
                ops: ['sum', 'count'],
                fields: ['Acceleration', '*'],
                as: [
                    "sum_Acceleration",
                    "count_*"
                ]
            });
        });
        it('should produce the correct summary component for aggregated plot with detail arrays', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative" },
                    'detail': [
                        { 'field': 'Origin', 'type': "ordinal" },
                        { 'field': 'Cylinders', 'type': "quantitative" }
                    ]
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin', 'Cylinders'],
                ops: ['mean'],
                fields: ['Displacement'],
                as: ['mean_Displacement']
            });
        });
        it('should include conditional field in the summary component', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative" },
                    color: {
                        condition: { selection: 'a', field: 'Origin', 'type': "ordinal" },
                        value: 'red'
                    }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin'],
                ops: ['mean'],
                fields: ['Displacement'],
                as: ['mean_Displacement']
            });
        });
        it('should add min and max if needed for unaggregated scale domain', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative", scale: { domain: 'unaggregated' } },
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: [],
                ops: ['mean', 'min', 'max'],
                fields: ['Displacement', 'Displacement', 'Displacement'],
                as: [
                    "mean_Displacement",
                    "min_Displacement",
                    "max_Displacement"
                ]
            });
        });
        it('should add correct dimensions when binning', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'bin': true, 'field': 'Displacement', 'type': "quantitative" },
                    'y': { 'bin': true, 'field': 'Acceleration', 'type': "ordinal" },
                    'color': { 'aggregate': 'count', 'type': "quantitative" }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: [
                    'bin_maxbins_10_Displacement',
                    'bin_maxbins_10_Displacement_end',
                    'bin_maxbins_10_Acceleration',
                    'bin_maxbins_10_Acceleration_end',
                    'bin_maxbins_10_Acceleration_range'
                ],
                ops: ['count'],
                fields: ['*'],
                as: ['count_*']
            });
        });
        it('should produce the correct summary component from transform array', function () {
            var t = {
                aggregate: [
                    { op: 'mean', field: 'Displacement', as: 'Displacement_mean' },
                    { op: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['Displacement_mean', 'Acceleration_sum']
            };
            var agg = aggregate_1.AggregateNode.makeFromTransform(null, t);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Displacement_mean', 'Acceleration_sum'],
                ops: ['mean', 'sum'],
                fields: ['Displacement', 'Acceleration'],
                as: ['Displacement_mean', 'Acceleration_sum']
            });
        });
        it('should produce the correct summary component from transform array with different aggregrations for the same field', function () {
            var t = { aggregate: [
                    { op: 'mean', field: 'Displacement', as: 'Displacement_mean' },
                    { op: 'max', field: 'Displacement', as: 'Displacement_max' },
                    { op: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['Displacement_mean', 'Acceleration_sum'] };
            var agg = aggregate_1.AggregateNode.makeFromTransform(null, t);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Displacement_mean', 'Acceleration_sum'],
                ops: ['mean', 'max', 'sum'],
                fields: ['Displacement', 'Displacement', 'Acceleration'],
                as: ['Displacement_mean', 'Displacement_max', 'Acceleration_sum']
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQWtFO0FBSWxFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUMsYUFBTSxDQUFDLEdBQUcsWUFBWSx5QkFBYSxDQUFDLENBQUM7WUFDckMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLGFBQU0sQ0FBQyxLQUFLLFlBQVkseUJBQWEsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLElBQU0sR0FBRyxHQUFHLElBQUkseUJBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGFBQU0sQ0FBQyxTQUFTLENBQVksS0FBSyxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUNqRixhQUFNLENBQUMsU0FBUyxDQUFZLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FB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LENBQUM7Z0JBQ2xELEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQztnQkFDeEQsRUFBRSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUM7YUFDbEUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge1N0cmluZ1NldH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3N1bW1hcnknLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdjbG9uZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHR5cGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGFnZyA9IG5ldyBBZ2dyZWdhdGVOb2RlKG51bGwsIHt9LCB7fSk7XG4gICAgICBhc3NlcnQoYWdnIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSk7XG4gICAgICBjb25zdCBjbG9uZSA9IGFnZy5jbG9uZSgpO1xuICAgICAgYXNzZXJ0KGNsb25lIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgbWFrZSBhIGRlZXAgY29weScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYWdnID0gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwge2ZvbzogdHJ1ZX0sIHt9KTtcbiAgICAgIGNvbnN0IGNsb25lID0gYWdnLmNsb25lKCk7XG4gICAgICBjbG9uZS5hZGREaW1lbnNpb25zKFsnYmFyJ10pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxTdHJpbmdTZXQ+KGNsb25lLmRlcGVuZGVudEZpZWxkcygpLCB7J2Zvbyc6IHRydWUsICdiYXInOiB0cnVlfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFN0cmluZ1NldD4oYWdnLmRlcGVuZGVudEZpZWxkcygpLCB7J2Zvbyc6IHRydWV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSB0aGUgY29ycmVjdCBzdW1tYXJ5IGNvbXBvbmVudCBmb3Igc3VtKEFjY2VsZXJhdGlvbikgYW5kIGNvdW50KCopJyAsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgJ3knOiB7XG4gICAgICAgICAgICAnYWdncmVnYXRlJzogJ3N1bScsXG4gICAgICAgICAgICAnZmllbGQnOiAnQWNjZWxlcmF0aW9uJyxcbiAgICAgICAgICAgICd0eXBlJzogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3gnOiB7XG4gICAgICAgICAgICAnZmllbGQnOiAnT3JpZ2luJyxcbiAgICAgICAgICAgICd0eXBlJzogXCJvcmRpbmFsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbG9yOiB7dHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYWdncmVnYXRlOiAnY291bnQnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbJ09yaWdpbiddLFxuICAgICAgICBvcHM6IFsnc3VtJywgJ2NvdW50J10sXG4gICAgICAgIGZpZWxkczogWydBY2NlbGVyYXRpb24nLCAnKiddLFxuICAgICAgICBhczogW1xuICAgICAgICAgIFwic3VtX0FjY2VsZXJhdGlvblwiLFxuICAgICAgICAgIFwiY291bnRfKlwiXG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIHRoZSBjb3JyZWN0IHN1bW1hcnkgY29tcG9uZW50IGZvciBhZ2dyZWdhdGVkIHBsb3Qgd2l0aCBkZXRhaWwgYXJyYXlzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICd4JzogeydhZ2dyZWdhdGUnOiAnbWVhbicsICdmaWVsZCc6ICdEaXNwbGFjZW1lbnQnLCAndHlwZSc6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICdkZXRhaWwnOiBbXG4gICAgICAgICAgICB7J2ZpZWxkJzogJ09yaWdpbicsICd0eXBlJzogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgeydmaWVsZCc6ICdDeWxpbmRlcnMnLCAndHlwZSc6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbJ09yaWdpbicsICdDeWxpbmRlcnMnXSxcbiAgICAgICAgb3BzOiBbJ21lYW4nXSxcbiAgICAgICAgZmllbGRzOiBbJ0Rpc3BsYWNlbWVudCddLFxuICAgICAgICBhczogWydtZWFuX0Rpc3BsYWNlbWVudCddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBjb25kaXRpb25hbCBmaWVsZCBpbiB0aGUgc3VtbWFyeSBjb21wb25lbnQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgJ3gnOiB7J2FnZ3JlZ2F0ZSc6ICdtZWFuJywgJ2ZpZWxkJzogJ0Rpc3BsYWNlbWVudCcsICd0eXBlJzogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogJ2EnLCBmaWVsZDogJ09yaWdpbicsICd0eXBlJzogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgdmFsdWU6ICdyZWQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbJ09yaWdpbiddLFxuICAgICAgICBvcHM6IFsnbWVhbiddLFxuICAgICAgICBmaWVsZHM6IFsnRGlzcGxhY2VtZW50J10sXG4gICAgICAgIGFzOiBbJ21lYW5fRGlzcGxhY2VtZW50J11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgbWluIGFuZCBtYXggaWYgbmVlZGVkIGZvciB1bmFnZ3JlZ2F0ZWQgc2NhbGUgZG9tYWluJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICd4JzogeydhZ2dyZWdhdGUnOiAnbWVhbicsICdmaWVsZCc6ICdEaXNwbGFjZW1lbnQnLCAndHlwZSc6IFwicXVhbnRpdGF0aXZlXCIsIHNjYWxlOiB7ZG9tYWluOiAndW5hZ2dyZWdhdGVkJ319LFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbXSxcbiAgICAgICAgb3BzOiBbJ21lYW4nLCAnbWluJywgJ21heCddLFxuICAgICAgICBmaWVsZHM6IFsnRGlzcGxhY2VtZW50JywgJ0Rpc3BsYWNlbWVudCcsICdEaXNwbGFjZW1lbnQnXSxcbiAgICAgICAgYXM6IFtcbiAgICAgICAgICBcIm1lYW5fRGlzcGxhY2VtZW50XCIsXG4gICAgICAgICAgXCJtaW5fRGlzcGxhY2VtZW50XCIsXG4gICAgICAgICAgXCJtYXhfRGlzcGxhY2VtZW50XCJcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBjb3JyZWN0IGRpbWVuc2lvbnMgd2hlbiBiaW5uaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICd4JzogeydiaW4nOiB0cnVlLCAnZmllbGQnOiAnRGlzcGxhY2VtZW50JywgJ3R5cGUnOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAneSc6IHsnYmluJzogdHJ1ZSwgJ2ZpZWxkJzogJ0FjY2VsZXJhdGlvbicsICd0eXBlJzogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICdjb2xvcic6IHsnYWdncmVnYXRlJzogJ2NvdW50JywgJ3R5cGUnOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKG51bGwsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbXG4gICAgICAgICAgJ2Jpbl9tYXhiaW5zXzEwX0Rpc3BsYWNlbWVudCcsXG4gICAgICAgICAgJ2Jpbl9tYXhiaW5zXzEwX0Rpc3BsYWNlbWVudF9lbmQnLFxuICAgICAgICAgICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb24nLFxuICAgICAgICAgICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fZW5kJyxcbiAgICAgICAgICAnYmluX21heGJpbnNfMTBfQWNjZWxlcmF0aW9uX3JhbmdlJ1xuICAgICAgICBdLFxuICAgICAgICBvcHM6IFsnY291bnQnXSxcbiAgICAgICAgZmllbGRzOiBbJyonXSxcbiAgICAgICAgYXM6IFsnY291bnRfKiddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSB0aGUgY29ycmVjdCBzdW1tYXJ5IGNvbXBvbmVudCBmcm9tIHRyYW5zZm9ybSBhcnJheScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdDogQWdncmVnYXRlVHJhbnNmb3JtID0ge1xuICAgICAgICBhZ2dyZWdhdGU6IFtcbiAgICAgICAgICB7b3A6ICdtZWFuJywgZmllbGQ6ICdEaXNwbGFjZW1lbnQnLCBhczogJ0Rpc3BsYWNlbWVudF9tZWFuJ30sXG4gICAgICAgICAge29wOiAnc3VtJywgZmllbGQ6ICdBY2NlbGVyYXRpb24nLCBhczogJ0FjY2VsZXJhdGlvbl9zdW0nfVxuICAgICAgICBdLFxuICAgICAgICBncm91cGJ5OiBbJ0Rpc3BsYWNlbWVudF9tZWFuJywgJ0FjY2VsZXJhdGlvbl9zdW0nXX07XG5cbiAgICAgIGNvbnN0IGFnZyA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21UcmFuc2Zvcm0obnVsbCwgdCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnQWdncmVnYXRlVHJhbnNmb3JtPihhZ2cuYXNzZW1ibGUoKSwge1xuICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgZ3JvdXBieTogWydEaXNwbGFjZW1lbnRfbWVhbicsICdBY2NlbGVyYXRpb25fc3VtJ10sXG4gICAgICAgIG9wczogWydtZWFuJywgJ3N1bSddLFxuICAgICAgICBmaWVsZHM6IFsnRGlzcGxhY2VtZW50JywgJ0FjY2VsZXJhdGlvbiddLFxuICAgICAgICBhczogWydEaXNwbGFjZW1lbnRfbWVhbicsICdBY2NlbGVyYXRpb25fc3VtJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIHRoZSBjb3JyZWN0IHN1bW1hcnkgY29tcG9uZW50IGZyb20gdHJhbnNmb3JtIGFycmF5IHdpdGggZGlmZmVyZW50IGFnZ3JlZ3JhdGlvbnMgZm9yIHRoZSBzYW1lIGZpZWxkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0OiBBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7YWdncmVnYXRlOiBbXG4gICAgICAgIHtvcDogJ21lYW4nLCBmaWVsZDogJ0Rpc3BsYWNlbWVudCcsIGFzOiAnRGlzcGxhY2VtZW50X21lYW4nfSxcbiAgICAgICAge29wOiAnbWF4JywgZmllbGQ6ICdEaXNwbGFjZW1lbnQnLCBhczogJ0Rpc3BsYWNlbWVudF9tYXgnfSxcbiAgICAgICAge29wOiAnc3VtJywgZmllbGQ6ICdBY2NlbGVyYXRpb24nLCBhczogJ0FjY2VsZXJhdGlvbl9zdW0nfV0sXG4gICAgICAgIGdyb3VwYnk6IFsnRGlzcGxhY2VtZW50X21lYW4nLCAnQWNjZWxlcmF0aW9uX3N1bSddfTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShudWxsLCB0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbJ0Rpc3BsYWNlbWVudF9tZWFuJywgJ0FjY2VsZXJhdGlvbl9zdW0nXSxcbiAgICAgICAgb3BzOiBbJ21lYW4nLCAnbWF4JywgJ3N1bSddLFxuICAgICAgICBmaWVsZHM6IFsnRGlzcGxhY2VtZW50JywgJ0Rpc3BsYWNlbWVudCcsICdBY2NlbGVyYXRpb24nXSxcbiAgICAgICAgYXM6IFsnRGlzcGxhY2VtZW50X21lYW4nLCAnRGlzcGxhY2VtZW50X21heCcsICdBY2NlbGVyYXRpb25fc3VtJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19