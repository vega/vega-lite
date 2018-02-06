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
                ancestorParse: {},
                isFaceted: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUc1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRywyQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztnQkFDeEIsbUJBQW1CLHFCQUFBO2dCQUNuQixhQUFhLEVBQUUsRUFBRTtnQkFDakIsU0FBUyxFQUFFLEtBQUs7YUFDakIsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtZQUN4QyxJQUFNLEdBQUcsR0FBRyxJQUFJLG1CQUFVLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztZQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLElBQU0sR0FBRyxHQUFHLElBQUkseUJBQWEsQ0FBQyxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDbEUsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4QyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRywyQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztnQkFDeEIsbUJBQW1CLHFCQUFBO2dCQUNuQixhQUFhLEVBQUUsRUFBRTtnQkFDakIsU0FBUyxFQUFFLEtBQUs7YUFDakIsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBVyxJQUFJLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLEdBQUcsRUFBRSxTQUFTO29CQUNkLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUM7aUJBQ3RCLEVBQUU7b0JBQ0QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFNBQVMsRUFBRSxDQUFDOzRCQUNWLElBQUksRUFBRSxXQUFXOzRCQUNqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7NEJBQ2QsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDOzRCQUNkLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQzs0QkFDYixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUM7eUJBQ2hCLENBQUM7aUJBQUM7YUFDSixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2Fzc2VtYmxlUm9vdERhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtPdXRwdXROb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZURhdGEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBuYW1lZCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNyYyA9IG5ldyBTb3VyY2VOb2RlKHtuYW1lOiAnZm9vJ30pO1xuICAgICAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IHt9O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKCdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gc3JjO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoZGF0YS5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGRhdGFbMF0ubmFtZSwgXCJmb29cIik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFzc2VtYmxlIHJhdyBhbmQgbWFpbiBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcmMgPSBuZXcgU291cmNlTm9kZSh7dXJsOiAnZm9vLmNzdid9KTtcbiAgICAgIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSB7fTtcbiAgICAgIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKCdyYXdPdXQnLCAncmF3Jywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gICAgICByYXcucGFyZW50ID0gc3JjO1xuICAgICAgY29uc3QgYWdnID0gbmV3IEFnZ3JlZ2F0ZU5vZGUoe2E6IHRydWV9LCB7Yjoge2NvdW50OiAnY291bnRfKid9fSk7XG4gICAgICBhZ2cucGFyZW50ID0gcmF3O1xuICAgICAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKCdtYWluT3V0JywgJ21haW4nLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgICAgIG1haW4ucGFyZW50ID0gYWdnO1xuXG4gICAgICBhc3NlcnQuZXF1YWwocmF3LmdldFNvdXJjZSgpLCAncmF3T3V0Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFpbi5nZXRTb3VyY2UoKSwgJ21haW5PdXQnKTtcblxuICAgICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlUm9vdERhdGEoe1xuICAgICAgICBzb3VyY2VzOiB7bmFtZWQ6IHNyY30sXG4gICAgICAgIG91dHB1dE5vZGVzOiB7b3V0OiBtYWlufSxcbiAgICAgICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICAgICAgYW5jZXN0b3JQYXJzZToge30sXG4gICAgICAgIGlzRmFjZXRlZDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRGF0YVtdPihkYXRhLCBbe1xuICAgICAgICBuYW1lOiAnc291cmNlXzAnLFxuICAgICAgICB1cmw6ICdmb28uY3N2JyxcbiAgICAgICAgZm9ybWF0OiB7dHlwZTogJ2Nzdid9XG4gICAgICB9LCB7XG4gICAgICAgIG5hbWU6ICdkYXRhXzAnLFxuICAgICAgICBzb3VyY2U6ICdzb3VyY2VfMCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2EnXSxcbiAgICAgICAgICBvcHM6IFsnY291bnQnXSxcbiAgICAgICAgICBmaWVsZHM6IFsnYiddLFxuICAgICAgICAgIGFzOiBbJ2NvdW50XyonXVxuICAgICAgICB9XX1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19