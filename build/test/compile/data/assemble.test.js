"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var assemble_1 = require("../../../src/compile/data/assemble");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var source_1 = require("../../../src/compile/data/source");
var window_1 = require("../../../src/compile/data/window");
describe('compile/data/assemble', function () {
    describe('assembleData', function () {
        it('should assemble named data source', function () {
            var src = new source_1.SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new dataflow_1.OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            chai_1.assert.equal(main.getSource(), 'mainOut');
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            chai_1.assert.equal(data.length, 1);
            chai_1.assert.equal(data[0].name, 'foo');
        });
        it('should assemble raw and main output', function () {
            var src = new source_1.SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new dataflow_1.OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
            raw.parent = src;
            var agg = new aggregate_1.AggregateNode(null, { a: true }, { b: { count: 'count_*' } });
            agg.parent = raw;
            var main = new dataflow_1.OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            chai_1.assert.equal(raw.getSource(), 'rawOut');
            chai_1.assert.equal(main.getSource(), 'mainOut');
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            chai_1.assert.deepEqual(data, [
                {
                    name: 'source_0',
                    url: 'foo.csv',
                    format: { type: 'csv' }
                },
                {
                    name: 'data_0',
                    source: 'source_0',
                    transform: [
                        {
                            type: 'aggregate',
                            groupby: ['a'],
                            ops: ['count'],
                            fields: ['b'],
                            as: ['count_*']
                        }
                    ]
                }
            ]);
        });
        it('should assemble window transform node', function () {
            var src = new source_1.SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new dataflow_1.OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
            raw.parent = src;
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
                ],
                groupby: ['f'],
                frame: [null, 0]
            };
            var agg = new window_1.WindowTransformNode(null, transform);
            agg.parent = raw;
            var main = new dataflow_1.OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            chai_1.assert.equal(raw.getSource(), 'rawOut');
            chai_1.assert.equal(main.getSource(), 'mainOut');
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            chai_1.assert.deepEqual(data, [
                {
                    name: 'source_0',
                    url: 'foo.csv',
                    format: { type: 'csv' }
                },
                {
                    name: 'data_0',
                    source: 'source_0',
                    transform: [
                        {
                            type: 'window',
                            ops: ['row_number'],
                            fields: [null],
                            params: [null],
                            sort: {
                                field: ['f'],
                                order: ['ascending']
                            },
                            ignorePeers: false,
                            as: ['ordered_row_number'],
                            frame: [null, 0],
                            groupby: ['f']
                        }
                    ]
                }
            ]);
        });
        it('should assemble named datasets with datastore', function () {
            var src = new source_1.SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new dataflow_1.OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {
                foo: [1, 2, 3]
            });
            chai_1.assert.deepEqual(data, [
                {
                    name: 'foo',
                    values: [1, 2, 3]
                }
            ]);
        });
    });
});
//# sourceMappingURL=assemble.test.js.map