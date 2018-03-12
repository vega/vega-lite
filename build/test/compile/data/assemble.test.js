"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var assemble_1 = require("../../../src/compile/data/assemble");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var source_1 = require("../../../src/compile/data/source");
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
                ancestorParse: {},
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
                ancestorParse: {},
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
        it('should assemble named datasets with datastore', function () {
            var src = new source_1.SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new dataflow_1.OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                ancestorParse: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUc1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFFbEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFMUMsSUFBTSxJQUFJLEdBQUcsMkJBQWdCLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQ3JCLFdBQVcsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUM7Z0JBQ3hCLG1CQUFtQixxQkFBQTtnQkFDbkIsYUFBYSxFQUFFLEVBQUU7Z0JBQ2pCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFUCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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QUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzthQUNiLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQVcsSUFBSSxFQUFFLENBQUM7b0JBQ2hDLElBQUksRUFBRSxLQUFLO29CQUNYLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2lCQUNoQixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYWdncmVnYXRlJztcbmltcG9ydCB7YXNzZW1ibGVSb290RGF0YX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hc3NlbWJsZSc7XG5pbXBvcnQge091dHB1dE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZGF0YWZsb3cnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3NvdXJjZSc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9hc3NlbWJsZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlRGF0YScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIG5hbWVkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe25hbWU6ICdmb28nfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBzcmM7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtYWluLmdldFNvdXJjZSgpLCAnbWFpbk91dCcpO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVSb290RGF0YSh7XG4gICAgICAgIHNvdXJjZXM6IHtuYW1lZDogc3JjfSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHtvdXQ6IG1haW59LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgICAgICBhbmNlc3RvclBhcnNlOiB7fSxcbiAgICAgICAgaXNGYWNldGVkOiBmYWxzZVxuICAgICAgfSwge30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoZGF0YS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGFbMF0ubmFtZSwgXCJmb29cIik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIHJhdyBhbmQgbWFpbiBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7dXJsOiAnZm9vLmNzdid9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdyYXdPdXQnLCAncmF3Jywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICByYXcucGFyZW50ID0gc3JjO1xuICAgICAgY29uc3QgYWdnID0gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwge2E6IHRydWV9LCB7Yjoge2NvdW50OiAnY291bnRfKid9fSk7XG4gICAgICBhZ2cucGFyZW50ID0gcmF3O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gYWdnO1xuXG4gICAgICBhc3NlcnQuZXF1YWwocmF3LmdldFNvdXJjZSgpLCAncmF3T3V0Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHt9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RhdGFbXT4oZGF0YSwgW3tcbiAgICAgICAgbmFtZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdXJsOiAnZm9vLmNzdicsXG4gICAgICAgIGZvcm1hdDoge3R5cGU6ICdjc3YnfVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnZGF0YV8wJyxcbiAgICAgICAgc291cmNlOiAnc291cmNlXzAnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydhJ10sXG4gICAgICAgICAgb3BzOiBbJ2NvdW50J10sXG4gICAgICAgICAgZmllbGRzOiBbJ2InXSxcbiAgICAgICAgICBhczogWydjb3VudF8qJ11cbiAgICAgICAgfV19XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgbmFtZWQgZGF0YXNldHMgd2l0aCBkYXRhc3RvcmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7bmFtZTogJ2Zvbyd9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IHNyYztcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZm9vOiBbMSwyLDNdXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RhdGFbXT4oZGF0YSwgW3tcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHZhbHVlczogWzEsMiwzXVxuICAgICAgfV0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19