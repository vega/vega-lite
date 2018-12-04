/* tslint:disable:quotemark */
import { assert } from 'chai';
import { AggregateNode } from '../../../src/compile/data/aggregate';
import { assembleRootData } from '../../../src/compile/data/assemble';
import { OutputNode } from '../../../src/compile/data/dataflow';
import { SourceNode } from '../../../src/compile/data/source';
import { WindowTransformNode } from '../../../src/compile/data/window';
describe('compile/data/assemble', function () {
    describe('assembleData', function () {
        it('should assemble named data source', function () {
            var src = new SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            assert.equal(main.getSource(), 'mainOut');
            var data = assembleRootData({
                sources: [src],
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.equal(data.length, 1);
            assert.equal(data[0].name, 'foo');
        });
        it('should assemble raw and main output', function () {
            var src = new SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
            raw.parent = src;
            var agg = new AggregateNode(null, { a: true }, { b: { count: { 'count_*': true } } });
            agg.parent = raw;
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            assert.equal(raw.getSource(), 'rawOut');
            assert.equal(main.getSource(), 'mainOut');
            var data = assembleRootData({
                sources: [src],
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.deepEqual(data, [
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
            var src = new SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
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
            var agg = new WindowTransformNode(null, transform);
            agg.parent = raw;
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            assert.equal(raw.getSource(), 'rawOut');
            assert.equal(main.getSource(), 'mainOut');
            var data = assembleRootData({
                sources: [src],
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.deepEqual(data, [
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
            var src = new SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            var data = assembleRootData({
                sources: [src],
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {
                foo: [1, 2, 3]
            });
            assert.deepEqual(data, [
                {
                    name: 'foo',
                    values: [1, 2, 3]
                }
            ]);
        });
    });
});
//# sourceMappingURL=assemble.test.js.map