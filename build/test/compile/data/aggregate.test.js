"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var util_1 = require("../../util");
describe('compile/data/summary', function () {
    describe('clone', function () {
        it('should have correct type', function () {
            var agg = new aggregate_1.AggregateNode({}, {});
            chai_1.assert(agg instanceof aggregate_1.AggregateNode);
            var clone = agg.clone();
            chai_1.assert(clone instanceof aggregate_1.AggregateNode);
        });
        it('should have make a deep copy', function () {
            var agg = new aggregate_1.AggregateNode({ foo: true }, {});
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
                    color: { field: '*', type: "quantitative", aggregate: 'count' }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
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
            var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
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
            var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
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
            var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
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
            var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
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
            var agg = aggregate_1.AggregateNode.makeFromTransform(t);
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
            var agg = aggregate_1.AggregateNode.makeFromTransform(t);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQWtFO0FBSWxFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsR0FBRyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUNyQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsYUFBTSxDQUFDLEtBQUssWUFBWSx5QkFBYSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsU0FBUyxDQUFZLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDakYsYUFBTSxDQUFDLFNBQVMsQ0FBWSxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDLENB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RUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDO2dCQUN4RCxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQzthQUNsRSxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYWdncmVnYXRlJztcbmltcG9ydCB7QWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcbmltcG9ydCB7U3RyaW5nU2V0fSBmcm9tICcuLi8uLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge1ZnQWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvc3VtbWFyeScsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ2Nsb25lJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdHlwZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYWdnID0gbmV3IEFnZ3JlZ2F0ZU5vZGUoe30sIHt9KTtcbiAgICAgIGFzc2VydChhZ2cgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKTtcbiAgICAgIGNvbnN0IGNsb25lID0gYWdnLmNsb25lKCk7XG4gICAgICBhc3NlcnQoY2xvbmUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBtYWtlIGEgZGVlcCBjb3B5JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBhZ2cgPSBuZXcgQWdncmVnYXRlTm9kZSh7Zm9vOiB0cnVlfSwge30pO1xuICAgICAgY29uc3QgY2xvbmUgPSBhZ2cuY2xvbmUoKTtcbiAgICAgIGNsb25lLmFkZERpbWVuc2lvbnMoWydiYXInXSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFN0cmluZ1NldD4oY2xvbmUuZGVwZW5kZW50RmllbGRzKCksIHsnZm9vJzogdHJ1ZSwgJ2Jhcic6IHRydWV9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8U3RyaW5nU2V0PihhZ2cuZGVwZW5kZW50RmllbGRzKCksIHsnZm9vJzogdHJ1ZX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VVbml0JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIHRoZSBjb3JyZWN0IHN1bW1hcnkgY29tcG9uZW50IGZvciBzdW0oQWNjZWxlcmF0aW9uKSBhbmQgY291bnQoKiknICwgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAneSc6IHtcbiAgICAgICAgICAgICdhZ2dyZWdhdGUnOiAnc3VtJyxcbiAgICAgICAgICAgICdmaWVsZCc6ICdBY2NlbGVyYXRpb24nLFxuICAgICAgICAgICAgJ3R5cGUnOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAneCc6IHtcbiAgICAgICAgICAgICdmaWVsZCc6ICdPcmlnaW4nLFxuICAgICAgICAgICAgJ3R5cGUnOiBcIm9yZGluYWxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29sb3I6IHtmaWVsZDogJyonLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBhZ2dyZWdhdGU6ICdjb3VudCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFsnT3JpZ2luJ10sXG4gICAgICAgIG9wczogWydzdW0nLCAnY291bnQnXSxcbiAgICAgICAgZmllbGRzOiBbJ0FjY2VsZXJhdGlvbicsICcqJ10sXG4gICAgICAgIGFzOiBbXG4gICAgICAgICAgXCJzdW1fQWNjZWxlcmF0aW9uXCIsXG4gICAgICAgICAgXCJjb3VudF8qXCJcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgdGhlIGNvcnJlY3Qgc3VtbWFyeSBjb21wb25lbnQgZm9yIGFnZ3JlZ2F0ZWQgcGxvdCB3aXRoIGRldGFpbCBhcnJheXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgJ3gnOiB7J2FnZ3JlZ2F0ZSc6ICdtZWFuJywgJ2ZpZWxkJzogJ0Rpc3BsYWNlbWVudCcsICd0eXBlJzogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgJ2RldGFpbCc6IFtcbiAgICAgICAgICAgIHsnZmllbGQnOiAnT3JpZ2luJywgJ3R5cGUnOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICB7J2ZpZWxkJzogJ0N5bGluZGVycycsICd0eXBlJzogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFsnT3JpZ2luJywgJ0N5bGluZGVycyddLFxuICAgICAgICBvcHM6IFsnbWVhbiddLFxuICAgICAgICBmaWVsZHM6IFsnRGlzcGxhY2VtZW50J10sXG4gICAgICAgIGFzOiBbJ21lYW5fRGlzcGxhY2VtZW50J11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIGNvbmRpdGlvbmFsIGZpZWxkIGluIHRoZSBzdW1tYXJ5IGNvbXBvbmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAneCc6IHsnYWdncmVnYXRlJzogJ21lYW4nLCAnZmllbGQnOiAnRGlzcGxhY2VtZW50JywgJ3R5cGUnOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAnYScsIGZpZWxkOiAnT3JpZ2luJywgJ3R5cGUnOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICB2YWx1ZTogJ3JlZCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFsnT3JpZ2luJ10sXG4gICAgICAgIG9wczogWydtZWFuJ10sXG4gICAgICAgIGZpZWxkczogWydEaXNwbGFjZW1lbnQnXSxcbiAgICAgICAgYXM6IFsnbWVhbl9EaXNwbGFjZW1lbnQnXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBtaW4gYW5kIG1heCBpZiBuZWVkZWQgZm9yIHVuYWdncmVnYXRlZCBzY2FsZSBkb21haW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgJ3gnOiB7J2FnZ3JlZ2F0ZSc6ICdtZWFuJywgJ2ZpZWxkJzogJ0Rpc3BsYWNlbWVudCcsICd0eXBlJzogXCJxdWFudGl0YXRpdmVcIiwgc2NhbGU6IHtkb21haW46ICd1bmFnZ3JlZ2F0ZWQnfX0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFtdLFxuICAgICAgICBvcHM6IFsnbWVhbicsICdtaW4nLCAnbWF4J10sXG4gICAgICAgIGZpZWxkczogWydEaXNwbGFjZW1lbnQnLCAnRGlzcGxhY2VtZW50JywgJ0Rpc3BsYWNlbWVudCddLFxuICAgICAgICBhczogW1xuICAgICAgICAgIFwibWVhbl9EaXNwbGFjZW1lbnRcIixcbiAgICAgICAgICBcIm1pbl9EaXNwbGFjZW1lbnRcIixcbiAgICAgICAgICBcIm1heF9EaXNwbGFjZW1lbnRcIlxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGNvcnJlY3QgZGltZW5zaW9ucyB3aGVuIGJpbm5pbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgJ3gnOiB7J2Jpbic6IHRydWUsICdmaWVsZCc6ICdEaXNwbGFjZW1lbnQnLCAndHlwZSc6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICd5JzogeydiaW4nOiB0cnVlLCAnZmllbGQnOiAnQWNjZWxlcmF0aW9uJywgJ3R5cGUnOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgJ2NvbG9yJzogeydhZ2dyZWdhdGUnOiAnY291bnQnLCAndHlwZSc6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFtcbiAgICAgICAgICAnYmluX21heGJpbnNfMTBfRGlzcGxhY2VtZW50JyxcbiAgICAgICAgICAnYmluX21heGJpbnNfMTBfRGlzcGxhY2VtZW50X2VuZCcsXG4gICAgICAgICAgJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbicsXG4gICAgICAgICAgJ2Jpbl9tYXhiaW5zXzEwX0FjY2VsZXJhdGlvbl9lbmQnLFxuICAgICAgICAgICdiaW5fbWF4Ymluc18xMF9BY2NlbGVyYXRpb25fcmFuZ2UnXG4gICAgICAgIF0sXG4gICAgICAgIG9wczogWydjb3VudCddLFxuICAgICAgICBmaWVsZHM6IFsnKiddLFxuICAgICAgICBhczogWydjb3VudF8qJ11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIHRoZSBjb3JyZWN0IHN1bW1hcnkgY29tcG9uZW50IGZyb20gdHJhbnNmb3JtIGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0OiBBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICAgIGFnZ3JlZ2F0ZTogW1xuICAgICAgICAgIHtvcDogJ21lYW4nLCBmaWVsZDogJ0Rpc3BsYWNlbWVudCcsIGFzOiAnRGlzcGxhY2VtZW50X21lYW4nfSxcbiAgICAgICAgICB7b3A6ICdzdW0nLCBmaWVsZDogJ0FjY2VsZXJhdGlvbicsIGFzOiAnQWNjZWxlcmF0aW9uX3N1bSd9XG4gICAgICAgIF0sXG4gICAgICAgIGdyb3VwYnk6IFsnRGlzcGxhY2VtZW50X21lYW4nLCAnQWNjZWxlcmF0aW9uX3N1bSddfTtcblxuICAgICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbVRyYW5zZm9ybSh0KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdBZ2dyZWdhdGVUcmFuc2Zvcm0+KGFnZy5hc3NlbWJsZSgpLCB7XG4gICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICBncm91cGJ5OiBbJ0Rpc3BsYWNlbWVudF9tZWFuJywgJ0FjY2VsZXJhdGlvbl9zdW0nXSxcbiAgICAgICAgb3BzOiBbJ21lYW4nLCAnc3VtJ10sXG4gICAgICAgIGZpZWxkczogWydEaXNwbGFjZW1lbnQnLCAnQWNjZWxlcmF0aW9uJ10sXG4gICAgICAgIGFzOiBbJ0Rpc3BsYWNlbWVudF9tZWFuJywgJ0FjY2VsZXJhdGlvbl9zdW0nXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgdGhlIGNvcnJlY3Qgc3VtbWFyeSBjb21wb25lbnQgZnJvbSB0cmFuc2Zvcm0gYXJyYXkgd2l0aCBkaWZmZXJlbnQgYWdncmVncmF0aW9ucyBmb3IgdGhlIHNhbWUgZmllbGQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHQ6IEFnZ3JlZ2F0ZVRyYW5zZm9ybSA9IHthZ2dyZWdhdGU6IFtcbiAgICAgICAge29wOiAnbWVhbicsIGZpZWxkOiAnRGlzcGxhY2VtZW50JywgYXM6ICdEaXNwbGFjZW1lbnRfbWVhbid9LFxuICAgICAgICB7b3A6ICdtYXgnLCBmaWVsZDogJ0Rpc3BsYWNlbWVudCcsIGFzOiAnRGlzcGxhY2VtZW50X21heCd9LFxuICAgICAgICB7b3A6ICdzdW0nLCBmaWVsZDogJ0FjY2VsZXJhdGlvbicsIGFzOiAnQWNjZWxlcmF0aW9uX3N1bSd9XSxcbiAgICAgICAgZ3JvdXBieTogWydEaXNwbGFjZW1lbnRfbWVhbicsICdBY2NlbGVyYXRpb25fc3VtJ119O1xuXG4gICAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKHQpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4oYWdnLmFzc2VtYmxlKCksIHtcbiAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgIGdyb3VwYnk6IFsnRGlzcGxhY2VtZW50X21lYW4nLCAnQWNjZWxlcmF0aW9uX3N1bSddLFxuICAgICAgICBvcHM6IFsnbWVhbicsICdtYXgnLCAnc3VtJ10sXG4gICAgICAgIGZpZWxkczogWydEaXNwbGFjZW1lbnQnLCAnRGlzcGxhY2VtZW50JywgJ0FjY2VsZXJhdGlvbiddLFxuICAgICAgICBhczogWydEaXNwbGFjZW1lbnRfbWVhbicsICdEaXNwbGFjZW1lbnRfbWF4JywgJ0FjY2VsZXJhdGlvbl9zdW0nXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=