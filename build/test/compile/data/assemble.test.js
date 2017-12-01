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
            var main = new dataflow_1.OutputNode('mainOut', 'main', outputNodeRefCounts);
            main.parent = src;
            chai_1.assert.equal(main.getSource(), 'mainOut');
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                ancestorParse: {}
            });
            chai_1.assert.equal(data.length, 1);
            chai_1.assert.equal(data[0].name, "foo");
        });
        it('should assemble raw and main output', function () {
            var src = new source_1.SourceNode({ url: 'foo.csv' });
            var outputNodeRefCounts = {};
            var raw = new dataflow_1.OutputNode('rawOut', 'raw', outputNodeRefCounts);
            raw.parent = src;
            var agg = new aggregate_1.AggregateNode({ a: true }, { b: { count: 'count_*' } });
            agg.parent = raw;
            var main = new dataflow_1.OutputNode('mainOut', 'main', outputNodeRefCounts);
            main.parent = agg;
            chai_1.assert.equal(raw.getSource(), 'rawOut');
            chai_1.assert.equal(main.getSource(), 'mainOut');
            var data = assemble_1.assembleRootData({
                sources: { named: src },
                outputNodes: { out: main },
                outputNodeRefCounts: outputNodeRefCounts,
                ancestorParse: {}
            });
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
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUc1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRywyQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztnQkFDeEIsbUJBQW1CLHFCQUFBO2dCQUNuQixhQUFhLEVBQUUsRUFBRTthQUNsQixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sR0FBRyxHQUFHLElBQUksbUJBQVUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQU0sR0FBRyxHQUFHLElBQUkscUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDakUsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxFQUFDLENBQUMsQ0FBQztZQUNsRSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFNLElBQUksR0FBRyxJQUFJLHFCQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRWxCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTFDLElBQU0sSUFBSSxHQUFHLDJCQUFnQixDQUFDO2dCQUM1QixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUNyQixXQUFXLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO2dCQUN4QixtQkFBbUIscUJBQUE7Z0JBQ25CLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQVcsSUFBSSxFQUFFLENBQUM7b0JBQ2hDLElBQUksRUFBRSxVQUFVO29CQUNoQixHQUFHLEVBQUUsU0FBUztvQkFDZCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO2lCQUN0QixFQUFFO29CQUNELElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxVQUFVO29CQUNsQixTQUFTLEVBQUUsQ0FBQzs0QkFDVixJQUFJLEVBQUUsV0FBVzs0QkFDakIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDOzRCQUNkLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQzs0QkFDZCxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUM7NEJBQ2IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDO3lCQUNoQixDQUFDO2lCQUFDO2FBQ0osQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUnO1xuaW1wb3J0IHthc3NlbWJsZVJvb3REYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlJztcbmltcG9ydCB7T3V0cHV0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc291cmNlJztcbmltcG9ydCB7VmdEYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2Fzc2VtYmxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXNzZW1ibGVEYXRhJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgbmFtZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7bmFtZTogJ2Zvbyd9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZSgnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IHNyYztcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGEubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRhWzBdLm5hbWUsIFwiZm9vXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSByYXcgYW5kIG1haW4gb3V0cHV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe3VybDogJ2Zvby5jc3YnfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZSgncmF3T3V0JywgJ3JhdycsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgcmF3LnBhcmVudCA9IHNyYztcbiAgICAgIGNvbnN0IGFnZyA9IG5ldyBBZ2dyZWdhdGVOb2RlKHthOiB0cnVlfSwge2I6IHtjb3VudDogJ2NvdW50XyonfX0pO1xuICAgICAgYWdnLnBhcmVudCA9IHJhdztcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZSgnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IGFnZztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHJhdy5nZXRTb3VyY2UoKSwgJ3Jhd091dCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0RhdGFbXT4oZGF0YSwgW3tcbiAgICAgICAgbmFtZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdXJsOiAnZm9vLmNzdicsXG4gICAgICAgIGZvcm1hdDoge3R5cGU6ICdjc3YnfVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnZGF0YV8wJyxcbiAgICAgICAgc291cmNlOiAnc291cmNlXzAnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydhJ10sXG4gICAgICAgICAgb3BzOiBbJ2NvdW50J10sXG4gICAgICAgICAgZmllbGRzOiBbJ2InXSxcbiAgICAgICAgICBhczogWydjb3VudF8qJ11cbiAgICAgICAgfV19XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==