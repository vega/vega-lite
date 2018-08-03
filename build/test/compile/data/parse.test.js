"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var calculate_1 = require("../../../src/compile/data/calculate");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var filter_1 = require("../../../src/compile/data/filter");
var flatten_1 = require("../../../src/compile/data/flatten");
var fold_1 = require("../../../src/compile/data/fold");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var impute_1 = require("../../../src/compile/data/impute");
var parse_1 = require("../../../src/compile/data/parse");
var sample_1 = require("../../../src/compile/data/sample");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var window_1 = require("../../../src/compile/data/window");
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
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof calculate_1.CalculateNode);
            chai_1.assert.isTrue(result instanceof filter_1.FilterNode);
        });
        it('should add a parse node for filter transforms with time unit', function () {
            var model = util_1.parseUnitModel({
                data: { url: 'a.json' },
                transform: [
                    {
                        filter: {
                            not: {
                                and: [
                                    {
                                        or: [
                                            {
                                                timeUnit: 'year',
                                                field: 'date',
                                                equal: 2005
                                            },
                                            'datum.a > 5'
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'temporal' },
                    color: { field: 'c', type: 'ordinal' },
                    shape: { field: 'd', type: 'nominal' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var parse = new data_1.AncestorParse();
            var result = parse_1.parseTransformArray(root, model, parse);
            chai_1.assert.isTrue(root.children[0] instanceof formatparse_1.ParseNode);
            chai_1.assert.isTrue(result instanceof filter_1.FilterNode);
            chai_1.assert.deepEqual(root.children[0].parse, {
                date: 'date'
            });
            chai_1.assert.deepEqual(parse.combine(), { date: 'date' });
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
            var root = new dataflow_1.DataFlowNode(null);
            var parse = new data_1.AncestorParse();
            var result = parse_1.parseTransformArray(root, model, parse);
            expect(root.children[0] instanceof bin_1.BinNode);
            expect(result instanceof timeunit_1.TimeUnitNode);
            expect(parse.combine()).toEqual({ a: 'number', a_end: 'number', b: 'date' });
        });
        it('should return a BinNode and a AggregateNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    { bin: true, field: 'field', as: 'a' },
                    { aggregate: [{ op: 'count', field: 'f', as: 'b' }, { op: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof aggregate_1.AggregateNode);
        });
        it('should return a ImputeTransform Node', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ impute: 'x', key: 'y', method: 'mean' }],
                encoding: {
                    x: { field: 'a', type: 'temporal' },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof impute_1.ImputeNode);
            chai_1.assert.isTrue(result instanceof impute_1.ImputeNode);
        });
        it('should return a WindowTransform Node', function () {
            var transform = {
                window: [
                    {
                        op: 'count',
                        field: 'f',
                        as: 'b'
                    }
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node with optional properties', function () {
            var transform = {
                window: [
                    {
                        op: 'row_number',
                        as: 'ordered_row_number'
                    }
                ],
                ignorePeers: false,
                sort: [
                    {
                        field: 'f',
                        order: 'ascending'
                    }
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node', function () {
            var transform = {
                window: [
                    {
                        op: 'count',
                        field: 'f',
                        as: 'b'
                    }
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node with optional properties', function () {
            var transform = {
                window: [
                    {
                        op: 'row_number',
                        as: 'ordered_row_number'
                    }
                ],
                ignorePeers: false,
                sort: [
                    {
                        field: 'f',
                        order: 'ascending'
                    }
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a FoldTransformNode', function () {
            var transform = {
                fold: ['a', 'b'],
                as: ['A', 'B']
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'A', type: 'temporal' },
                    y: { field: 'B', type: 'quantitative' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof fold_1.FoldTransformNode);
            chai_1.assert.isTrue(result instanceof fold_1.FoldTransformNode);
        });
        it('should return a FlattenTransformNode', function () {
            var transform = {
                flatten: ['a', 'b']
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'a', type: 'temporal' },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof flatten_1.FlattenTransformNode);
            chai_1.assert.isTrue(result instanceof flatten_1.FlattenTransformNode);
        });
        it('should return a SampleTransformNode', function () {
            var transform = {
                sample: 1000
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'A', type: 'temporal' },
                    y: { field: 'B', type: 'quantitative' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof sample_1.SampleTransformNode);
            chai_1.assert.isTrue(result instanceof sample_1.SampleTransformNode);
        });
        it('should return a 3 Transforms from an Impute', function () {
            var transform = {
                impute: 'y',
                key: 'x',
                method: 'max',
                groupby: ['a', 'b'],
                frame: [-2, 2]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [transform],
                encoding: {
                    x: { field: 'x', type: 'quantitative' },
                    y: { field: 'y', type: 'quantitative' },
                    color: { field: 'c', type: 'nominal' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof impute_1.ImputeNode);
            chai_1.assert.isTrue(result instanceof impute_1.ImputeNode);
        });
    });
});
//# sourceMappingURL=parse.test.js.map