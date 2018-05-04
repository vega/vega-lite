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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUM1RCwyREFBcUU7QUFJckUsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLElBQU0sR0FBRyxHQUFHLElBQUksbUJBQVUsQ0FBQyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQU0sSUFBSSxHQUFHLElBQUkscUJBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRWxCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTFDLElBQU0sSUFBSSxHQUFHLDJCQUFnQixDQUFDO2dCQUM1QixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUNyQixXQUFXLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO2dCQUN4QixtQkFBbUIscUJBQUE7Z0JBQ25CLGFBQWEsRUFBRSxFQUFFO2dCQUNqQixTQUFTLEVBQUUsS0FBSzthQUNqQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRVAsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFB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TUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7aUJBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7T3V0cHV0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc291cmNlJztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS93aW5kb3cnO1xuaW1wb3J0IHtUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy90cmFuc2Zvcm0nO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZURhdGEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBuYW1lZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHtuYW1lOiAnZm9vJ30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKG51bGwsICdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gc3JjO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHt9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGEubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRhWzBdLm5hbWUsIFwiZm9vXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSByYXcgYW5kIG1haW4gb3V0cHV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe3VybDogJ2Zvby5jc3YnfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAncmF3T3V0JywgJ3JhdycsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgcmF3LnBhcmVudCA9IHNyYztcbiAgICAgIGNvbnN0IGFnZyA9IG5ldyBBZ2dyZWdhdGVOb2RlKG51bGwsIHthOiB0cnVlfSwge2I6IHtjb3VudDogJ2NvdW50XyonfX0pO1xuICAgICAgYWdnLnBhcmVudCA9IHJhdztcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IGFnZztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHJhdy5nZXRTb3VyY2UoKSwgJ3Jhd091dCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9LFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdzb3VyY2VfMCcsXG4gICAgICAgIHVybDogJ2Zvby5jc3YnLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2RhdGFfMCcsXG4gICAgICAgIHNvdXJjZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYSddLFxuICAgICAgICAgIG9wczogWydjb3VudCddLFxuICAgICAgICAgIGZpZWxkczogWydiJ10sXG4gICAgICAgICAgYXM6IFsnY291bnRfKiddXG4gICAgICAgIH1dfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIHdpbmRvdyB0cmFuc2Zvcm0gbm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHt1cmw6ICdmb28uY3N2J30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgcmF3ID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ3Jhd091dCcsICdyYXcnLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIHJhdy5wYXJlbnQgPSBzcmM7XG4gICAgICBjb25zdCB0cmFuc2Zvcm06IFRyYW5zZm9ybSA9IHtcbiAgICAgICAgd2luZG93OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgb3A6ICdyb3dfbnVtYmVyJyxcbiAgICAgICAgICAgIGFzOiAnb3JkZXJlZF9yb3dfbnVtYmVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpZ25vcmVQZWVyczogZmFsc2UsXG4gICAgICAgIHNvcnQ6XG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgZ3JvdXBieTogWydmJ10sXG4gICAgICAgIGZyYW1lOiBbbnVsbCwgMF1cbiAgICAgIH07XG4gICAgICBjb25zdCBhZ2cgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShudWxsLCB0cmFuc2Zvcm0pO1xuICAgICAgYWdnLnBhcmVudCA9IHJhdztcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShudWxsLCAnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IGFnZztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHJhdy5nZXRTb3VyY2UoKSwgJ3Jhd091dCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9LFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdzb3VyY2VfMCcsXG4gICAgICAgIHVybDogJ2Zvby5jc3YnLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2RhdGFfMCcsXG4gICAgICAgIHNvdXJjZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICd3aW5kb3cnLFxuICAgICAgICAgIG9wczogWydyb3dfbnVtYmVyJ10sXG4gICAgICAgICAgZmllbGRzOiBbbnVsbF0sXG4gICAgICAgICAgcGFyYW1zOiBbbnVsbF0sXG4gICAgICAgICAgc29ydCA6IHtcbiAgICAgICAgICAgIGZpZWxkOiBbXCJmXCJdLFxuICAgICAgICAgICAgb3JkZXI6IFtcImFzY2VuZGluZ1wiXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgICBhczogWydvcmRlcmVkX3Jvd19udW1iZXInXSxcbiAgICAgICAgICBmcmFtZTogW251bGwsIDBdLFxuICAgICAgICAgIGdyb3VwYnk6IFsnZiddXG4gICAgICAgIH1dfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIG5hbWVkIGRhdGFzZXRzIHdpdGggZGF0YXN0b3JlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe25hbWU6ICdmb28nfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobnVsbCwgJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBzcmM7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9LFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGZvbzogWzEsMiwzXVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICB2YWx1ZXM6IFsxLDIsM11cbiAgICAgIH1dKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==