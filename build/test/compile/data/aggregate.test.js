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
            chai_1.assert.deepEqual(clone.dependentFields(), { foo: true, bar: true });
            chai_1.assert.deepEqual(agg.dependentFields(), { foo: true });
        });
    });
    describe('hash', function () {
        it('should generate the correct hash', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'Acceleration',
                        type: 'quantitative'
                    },
                    x: {
                        field: 'Origin',
                        type: 'ordinal'
                    },
                    color: { type: 'quantitative', aggregate: 'count' }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.hash(), 'Aggregate -97616516');
        });
    });
    describe('parseUnit', function () {
        it('should produce the correct summary component for sum(Acceleration) and count(*)', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    y: {
                        aggregate: 'sum',
                        field: 'Acceleration',
                        type: 'quantitative'
                    },
                    x: {
                        field: 'Origin',
                        type: 'ordinal'
                    },
                    color: { type: 'quantitative', aggregate: 'count' }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: ['Origin'],
                ops: ['sum', 'count'],
                fields: ['Acceleration', '*'],
                as: ['sum_Acceleration', 'count_*']
            });
        });
        it('should produce the correct summary component for aggregated plot with detail arrays', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { aggregate: 'mean', field: 'Displacement', type: 'quantitative' },
                    detail: [{ field: 'Origin', type: 'ordinal' }, { field: 'Cylinders', type: 'quantitative' }]
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
                mark: 'point',
                encoding: {
                    x: { aggregate: 'mean', field: 'Displacement', type: 'quantitative' },
                    color: {
                        condition: { selection: 'a', field: 'Origin', type: 'ordinal' },
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
                mark: 'point',
                encoding: {
                    x: { aggregate: 'mean', field: 'Displacement', type: 'quantitative', scale: { domain: 'unaggregated' } }
                }
            });
            var agg = aggregate_1.AggregateNode.makeFromEncoding(null, model);
            chai_1.assert.deepEqual(agg.assemble(), {
                type: 'aggregate',
                groupby: [],
                ops: ['mean', 'min', 'max'],
                fields: ['Displacement', 'Displacement', 'Displacement'],
                as: ['mean_Displacement', 'min_Displacement', 'max_Displacement']
            });
        });
        it('should add correct dimensions when binning', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { bin: true, field: 'Displacement', type: 'quantitative' },
                    y: { bin: true, field: 'Acceleration', type: 'ordinal' },
                    color: { aggregate: 'count', type: 'quantitative' }
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
            var t = {
                aggregate: [
                    { op: 'mean', field: 'Displacement', as: 'Displacement_mean' },
                    { op: 'max', field: 'Displacement', as: 'Displacement_max' },
                    { op: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['Displacement_mean', 'Acceleration_sum']
            };
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
    describe('producedFields', function () {
        it('should produce the correct fields', function () {
            var t = {
                aggregate: [
                    { op: 'mean', field: 'Displacement', as: 'AvgDisplacement' },
                    { op: 'sum', field: 'Acceleration', as: 'Acceleration_sum' }
                ],
                groupby: ['AvgDisplacement', 'Acceleration_sum']
            };
            var agg = aggregate_1.AggregateNode.makeFromTransform(null, t);
            expect(agg.producedFields()).toEqual({
                AvgDisplacement: true,
                Acceleration_sum: true
            });
        });
    });
});
//# sourceMappingURL=aggregate.test.js.map