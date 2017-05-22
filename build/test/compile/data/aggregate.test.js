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
                    'bin_maxbins_10_Displacement_start',
                    'bin_maxbins_10_Displacement_end',
                    'bin_maxbins_10_Acceleration_start',
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
                summarize: [
                    { aggregate: 'mean', field: 'Displacement', as: 'Displacement_mean' },
                    { aggregate: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['Displacement_mean', 'Acceleration_sum']
            };
            var model = util_1.parseUnitModel({
                mark: "point",
                transform: [t],
                encoding: {
                    'x': { 'field': 'Displacement', 'type': "quantitative" }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromTransform(model, t);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Displacement_mean', 'Acceleration_sum'],
                ops: ['mean', 'sum'],
                fields: ['Displacement', 'Acceleration'],
                as: ['Displacement_mean', 'Acceleration_sum']
            });
        });
        it('should produce the correct summary component from transform array with different aggregrations for the same field', function () {
            var t = { summarize: [
                    { aggregate: 'mean', field: 'Displacement', as: 'Displacement_mean' },
                    { aggregate: 'max', field: 'Displacement', as: 'Displacement_max' },
                    { aggregate: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['Displacement_mean', 'Acceleration_sum'] };
            var model = util_1.parseUnitModel({
                mark: "point",
                transform: [t],
                encoding: {
                    'x': { 'field': 'Displacement', 'type': "quantitative" }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromTransform(model, t);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQWtFO0FBSWxFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsR0FBRyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUNyQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsYUFBTSxDQUFDLEtBQUssWUFBWSx5QkFBYSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsU0FBUyxDQUFZLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDakYsYUFBTSxDQUFDLFNBQVMsQ0FBWSxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDLENB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