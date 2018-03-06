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
                ancestorParse: {},
                isFaceted: false
            }, {});
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
            var main = new dataflow_1.OutputNode('mainOut', 'main', outputNodeRefCounts);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUc1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRywyQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztnQkFDeEIsbUJBQW1CLHFCQUFBO2dCQUNuQixhQUFhLEVBQUUsRUFBRTtnQkFDakIsU0FBUyxFQUFFLEtBQUs7YUFDakIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVQLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJ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QUFNLENBQUMsU0FBUyxDQUFXLElBQUksRUFBRSxDQUFDO29CQUNoQyxJQUFJLEVBQUUsS0FBSztvQkFDWCxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztpQkFDaEIsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtPdXRwdXROb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZURhdGEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBuYW1lZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHtuYW1lOiAnZm9vJ30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKCdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gc3JjO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0sIHt9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGEubGVuZ3RoLCAxKTtcbiAgICAgIGFzc2VydC5lcXVhbChkYXRhWzBdLm5hbWUsIFwiZm9vXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSByYXcgYW5kIG1haW4gb3V0cHV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe3VybDogJ2Zvby5jc3YnfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZSgncmF3T3V0JywgJ3JhdycsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgcmF3LnBhcmVudCA9IHNyYztcbiAgICAgIGNvbnN0IGFnZyA9IG5ldyBBZ2dyZWdhdGVOb2RlKHthOiB0cnVlfSwge2I6IHtjb3VudDogJ2NvdW50XyonfX0pO1xuICAgICAgYWdnLnBhcmVudCA9IHJhdztcbiAgICAgIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZSgnbWFpbk91dCcsICdtYWluJywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICBtYWluLnBhcmVudCA9IGFnZztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHJhdy5nZXRTb3VyY2UoKSwgJ3Jhd091dCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1haW4uZ2V0U291cmNlKCksICdtYWluT3V0Jyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9LFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7fSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdzb3VyY2VfMCcsXG4gICAgICAgIHVybDogJ2Zvby5jc3YnLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0sIHtcbiAgICAgICAgbmFtZTogJ2RhdGFfMCcsXG4gICAgICAgIHNvdXJjZTogJ3NvdXJjZV8wJyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYSddLFxuICAgICAgICAgIG9wczogWydjb3VudCddLFxuICAgICAgICAgIGZpZWxkczogWydiJ10sXG4gICAgICAgICAgYXM6IFsnY291bnRfKiddXG4gICAgICAgIH1dfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIG5hbWVkIGRhdGFzZXRzIHdpdGggZGF0YXN0b3JlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3JjID0gbmV3IFNvdXJjZU5vZGUoe25hbWU6ICdmb28nfSk7XG4gICAgICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0ge307XG4gICAgICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUoJ21haW5PdXQnLCAnbWFpbicsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICAgICAgbWFpbi5wYXJlbnQgPSBzcmM7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhc3NlbWJsZVJvb3REYXRhKHtcbiAgICAgICAgc291cmNlczoge25hbWVkOiBzcmN9LFxuICAgICAgICBvdXRwdXROb2Rlczoge291dDogbWFpbn0sXG4gICAgICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgICAgIGFuY2VzdG9yUGFyc2U6IHt9LFxuICAgICAgICBpc0ZhY2V0ZWQ6IGZhbHNlXG4gICAgICB9LCB7XG4gICAgICAgIGZvbzogWzEsMiwzXVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdEYXRhW10+KGRhdGEsIFt7XG4gICAgICAgIG5hbWU6ICdmb28nLFxuICAgICAgICB2YWx1ZXM6IFsxLDIsM11cbiAgICAgIH1dKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==