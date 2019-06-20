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
var formatparse_1 = require("../../../src/compile/data/formatparse");
var parse_1 = require("../../../src/compile/data/parse");
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
                "data": { "url": "a.json" },
                "transform": [{
                        "filter": {
                            "not": {
                                "and": [{
                                        "or": [
                                            {
                                                "timeUnit": "year",
                                                "field": "date",
                                                "equal": 2005
                                            },
                                            "datum.a > 5"
                                        ]
                                    }]
                            }
                        }
                    }],
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "d", "type": "nominal" }
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
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof timeunit_1.TimeUnitNode);
            chai_1.assert.deepEqual(parse.combine(), { a: 'number', a_end: 'number', b: 'date' });
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
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof aggregate_1.AggregateNode);
        });
        it('should return a WindowTransform Node', function () {
            var transform = {
                window: [
                    {
                        op: 'count',
                        field: 'f',
                        as: 'b',
                    }
                ],
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
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
                        as: 'ordered_row_number',
                    },
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
                transform: [
                    transform
                ],
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
                        as: 'b',
                    }
                ],
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
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
                        as: 'ordered_row_number',
                    },
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
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
    });
});
//# sourceMappingURL=parse.test.js.map