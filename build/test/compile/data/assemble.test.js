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
            chai_1.assert.equal(data[0].name, "foo");
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
            chai_1.assert.deepEqual(data, [{
                    name: 'source_0',
                    url: 'foo.csv',
                    format: { type: 'csv' }
                }, {
                    name: 'data_0',
                    source: 'source_0',
                    transform: [{
                            type: 'aggregate',
                            groupby: ['a'],
                            ops: ['count'],
                            fields: ['b'],
                            as: ['count_*']
                        }]
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
                        as: 'ordered_row_number',
                    },
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
            chai_1.assert.deepEqual(data, [{
                    name: 'source_0',
                    url: 'foo.csv',
                    format: { type: 'csv' }
                }, {
                    name: 'data_0',
                    source: 'source_0',
                    transform: [{
                            type: 'window',
                            ops: ['row_number'],
                            fields: [null],
                            params: [null],
                            sort: {
                                field: ["f"],
                                order: ["ascending"],
                            },
                            ignorePeers: false,
                            as: ['ordered_row_number'],
                            frame: [null, 0],
                            groupby: ['f']
                        }]
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
            chai_1.assert.deepEqual(data, [{
                    name: 'foo',
                    values: [1, 2, 3]
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUM1RCwyREFBcUU7QUFJckUsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLElBQU0sR0FBRyxHQUFHLElBQUksbUJBQVUsQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQU0sSUFBSSxHQUFHLElBQUkscUJBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRWxCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTFDLElBQU0sSUFBSSxHQUFHLDJCQUFnQixDQUFDO2dCQUM1QixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUNyQixXQUFXLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO2dCQUN4QixtQkFBbUIscUJBQUE7Z0JBQ25CLFNBQVMsRUFBRSxLQUFLO2FBQ2pCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFUCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMs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QUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtPdXRwdXROb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UnO1xuaW1wb3J0IHtXaW5kb3dUcmFuc2Zvcm1Ob2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3dpbmRvdyc7XG5pbXBvcnQge1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9hc3NlbWJsZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlRGF0YScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIG5hbWVkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe25hbWU6ICdmb28nfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBzcmM7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtYWluLmdldFNvdXJjZSgpLCAnbWFpbk91dCcpO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVSb290RGF0YSh7XG4gICAgICAgIHNvdXJjZXM6IHtuYW1lZDogc3JjfSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHtvdXQ6IG1haW59LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChkYXRhLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoZGF0YVswXS5uYW1lLCBcImZvb1wiKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgcmF3IGFuZCBtYWluIG91dHB1dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHt1cmw6ICdmb28uY3N2J30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgcmF3ID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ3Jhd091dCcsICdyYXcnLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIHJhdy5wYXJlbnQgPSBzcmM7XG4gICAgICBjb25zdCBhZ2cgPSBuZXcgQWdncmVnYXRlTm9kZShudWxsLCB7YTogdHJ1ZX0sIHtiOiB7Y291bnQ6ICdjb3VudF8qJ319KTtcbiAgICAgIGFnZy5wYXJlbnQgPSByYXc7XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBhZ2c7XG5cbiAgICAgIGFzc2VydC5lcXVhbChyYXcuZ2V0U291cmNlKCksICdyYXdPdXQnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYWluLmdldFNvdXJjZSgpLCAnbWFpbk91dCcpO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVSb290RGF0YSh7XG4gICAgICAgIHNvdXJjZXM6IHtuYW1lZDogc3JjfSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHtvdXQ6IG1haW59LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdzb3VyY2VfMCcsXG4gICAgICAgIHVybDogJ2Zvby5jc3YnLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2RhdGFfMCcsXG4gICAgICAgIHNvdXJjZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYSddLFxuICAgICAgICAgIG9wczogWydjb3VudCddLFxuICAgICAgICAgIGZpZWxkczogWydiJ10sXG4gICAgICAgICAgYXM6IFsnY291bnRfKiddXG4gICAgICAgIH1dfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIHdpbmRvdyB0cmFuc2Zvcm0gbm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHt1cmw6ICdmb28uY3N2J30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgcmF3ID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ3Jhd091dCcsICdyYXcnLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIHJhdy5wYXJlbnQgPSBzcmM7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgd2luZG93OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICAgIHNvcnQ6XG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICAgIH07XG4gICAgICBjb25zdCBhZ2cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYWdnLnBhcmVudCA9IHJhdztcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IGFnZztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHJhdy5nZXRTb3VyY2UoKSwgJ3Jhd091dCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHt9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RhdGFbXT4oZGF0YSwgW3tcbiAgICAgICAgbmFtZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdXJsOiAnZm9vLmNzdicsXG4gICAgICAgIGZvcm1hdDoge3R5cGU6ICdjc3YnfVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnZGF0YV8wJyxcbiAgICAgICAgc291cmNlOiAnc291cmNlXzAnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ3dpbmRvdycsXG4gICAgICAgICAgb3BzOiBbJ3Jvd19udW1iZXInXSxcbiAgICAgICAgICBmaWVsZHM6IFtudWxsXSxcbiAgICAgICAgICBwYXJhbXM6IFtudWxsXSxcbiAgICAgICAgICBzb3J0IDoge1xuICAgICAgICAgICAgZmllbGQ6IFtcImZcIl0sXG4gICAgICAgICAgICBvcmRlcjogW1wiYXNjZW5kaW5nXCJdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICAgIGFzOiBbJ29yZGVyZWRfcm93X251bWJlciddLFxuICAgICAgICAgIGZyYW1lOiBbbnVsbCwgMF0sXG4gICAgICAgICAgZ3JvdXBieTogWydmJ11cbiAgICAgICAgfV19XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgbmFtZWQgZGF0YXNldHMgd2l0aCBkYXRhc3RvcmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7bmFtZTogJ2Zvbyd9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IHNyYztcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgaXNGYWNldGVkOiBmYWxzZVxuICAgICAgfSwge1xuICAgICAgICBmb286IFsxLDIsM11cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRGF0YVtdPihkYXRhLCBbe1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgICAgdmFsdWVzOiBbMSwyLDNdXG4gICAgICB9XSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=