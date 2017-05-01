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
            var agg = aggregate_1.AggregateNode.make(model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin'],
                ops: ['sum', 'count'],
                fields: ['Acceleration', '*']
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
            var agg = aggregate_1.AggregateNode.make(model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin', 'Cylinders'],
                ops: ['mean'],
                fields: ['Displacement']
            });
        });
        it('should add min and max if needed for unaggregated scale domain', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    'x': { 'aggregate': 'mean', 'field': 'Displacement', 'type': "quantitative", scale: { domain: 'unaggregated' } },
                }
            });
            var agg = aggregate_1.AggregateNode.make(model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: [],
                ops: ['mean', 'min', 'max'],
                fields: ['Displacement', 'Displacement', 'Displacement']
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
            var agg = aggregate_1.AggregateNode.make(model);
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
                fields: ['*']
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQWtFO0FBR2xFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxhQUFNLENBQUMsR0FBRyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUNyQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsYUFBTSxDQUFDLEtBQUssWUFBWSx5QkFBYSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMxQixLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsU0FBUyxDQUFZLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFDakYsYUFBTSxDQUFDLFNBQVMsQ0FBWSxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDLENB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