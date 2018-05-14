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
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.equal(data.length, 1);
            assert.equal(data[0].name, "foo");
        });
        it('should assemble raw and main output', function () {
            var src = new SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
            raw.parent = src;
            var agg = new AggregateNode(null, { a: true }, { b: { count: 'count_*' } });
            agg.parent = raw;
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            assert.equal(raw.getSource(), 'rawOut');
            assert.equal(main.getSource(), 'mainOut');
            var data = assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.deepEqual(data, [{
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
            var src = new SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new OutputNode(null, 'rawOut', 'raw', outputNodeRefCounts);
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
            var agg = new WindowTransformNode(null, transform);
            agg.parent = raw;
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            assert.equal(raw.getSource(), 'rawOut');
            assert.equal(main.getSource(), 'mainOut');
            var data = assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {});
            assert.deepEqual(data, [{
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
            var src = new SourceNode({ name: 'foo' });
            var outputNodeRefCounts = {};
            var main = new OutputNode(null, 'mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            var data = assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                isFaceted: false
            }, {
                foo: [1, 2, 3]
            });
            assert.deepEqual(data, [{
                    name: 'foo',
                    values: [1, 2, 3]
                }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUM5RCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDNUQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFJckUsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLElBQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztn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Q2IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBVyxJQUFJLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxFQUFFLEtBQUs7b0JBQ1gsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7aUJBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7T3V0cHV0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc291cmNlJztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZURhdGEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBuYW1lZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHtuYW1lOiAnZm9vJ30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gc3JjO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgaXNGYWNldGVkOiBmYWxzZVxuICAgICAgfSwge30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoZGF0YS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGFbMF0ubmFtZSwgXCJmb29cIik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIHJhdyBhbmQgbWFpbiBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7dXJsOiAnZm9vLmNzdid9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdyYXdPdXQnLCAncmF3Jywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICByYXcucGFyZW50ID0gc3JjO1xuICAgICAgY29uc3QgYWdnID0gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwge2E6IHRydWV9LCB7Yjoge2NvdW50OiAnY291bnRfKid9fSk7XG4gICAgICBhZ2cucGFyZW50ID0gcmF3O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gYWdnO1xuXG4gICAgICBhc3NlcnQuZXF1YWwocmF3LmdldFNvdXJjZSgpLCAncmF3T3V0Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgaXNGYWNldGVkOiBmYWxzZVxuICAgICAgfSwge30pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRGF0YVtdPihkYXRhLCBbe1xuICAgICAgICBuYW1lOiAnc291cmNlXzAnLFxuICAgICAgICB1cmw6ICdmb28uY3N2JyxcbiAgICAgICAgZm9ybWF0OiB7dHlwZTogJ2Nzdid9XG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdkYXRhXzAnLFxuICAgICAgICBzb3VyY2U6ICdzb3VyY2VfMCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2EnXSxcbiAgICAgICAgICBvcHM6IFsnY291bnQnXSxcbiAgICAgICAgICBmaWVsZHM6IFsnYiddLFxuICAgICAgICAgIGFzOiBbJ2NvdW50XyonXVxuICAgICAgICB9XX1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSB3aW5kb3cgdHJhbnNmb3JtIG5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7dXJsOiAnZm9vLmNzdid9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdyYXdPdXQnLCAncmF3Jywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICByYXcucGFyZW50ID0gc3JjO1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBzb3J0OlxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZmllbGQ6J2YnLFxuICAgICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIGdyb3VwYnk6IFsnZiddLFxuICAgICAgICBmcmFtZTogW251bGwsIDBdXG4gICAgICB9O1xuICAgICAgY29uc3QgYWdnID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUobnVsbCwgdHJhbnNmb3JtKTtcbiAgICAgIGFnZy5wYXJlbnQgPSByYXc7XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBhZ2c7XG5cbiAgICAgIGFzc2VydC5lcXVhbChyYXcuZ2V0U291cmNlKCksICdyYXdPdXQnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYWluLmdldFNvdXJjZSgpLCAnbWFpbk91dCcpO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVSb290RGF0YSh7XG4gICAgICAgIHNvdXJjZXM6IHtuYW1lZDogc3JjfSxcbiAgICAgICAgb3V0cHV0Tm9kZXM6IHtvdXQ6IG1haW59LFxuICAgICAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdzb3VyY2VfMCcsXG4gICAgICAgIHVybDogJ2Zvby5jc3YnLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2RhdGFfMCcsXG4gICAgICAgIHNvdXJjZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgICAgIG9wczogWydyb3dfbnVtYmVyJ10sXG4gICAgICAgICAgZmllbGRzOiBbbnVsbF0sXG4gICAgICAgICAgcGFyYW1zOiBbbnVsbF0sXG4gICAgICAgICAgc29ydCA6IHtcbiAgICAgICAgICAgIGZpZWxkOiBbXCJmXCJdLFxuICAgICAgICAgICAgb3JkZXI6IFtcImFzY2VuZGluZ1wiXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgICBhczogWydvcmRlcmVkX3Jvd19udW1iZXInXSxcbiAgICAgICAgICBmcmFtZTogW251bGwsIDBdLFxuICAgICAgICAgIGdyb3VwYnk6IFsnZiddXG4gICAgICAgIH1dfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIG5hbWVkIGRhdGFzZXRzIHdpdGggZGF0YXN0b3JlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe25hbWU6ICdmb28nfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBzcmM7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHtcbiAgICAgICAgZm9vOiBbMSwyLDNdXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RhdGFbXT4oZGF0YSwgW3tcbiAgICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICAgIHZhbHVlczogWzEsMiwzXVxuICAgICAgfV0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19