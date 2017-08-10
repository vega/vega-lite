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
            chai_1.assert.deepEqual(data, [{
                    name: 'foo'
                }]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSwrREFBb0U7QUFDcEUsK0RBQThEO0FBQzlELDJEQUE0RDtBQUk1RCxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7WUFDMUMsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUxQyxJQUFNLElBQUksR0FBRywyQkFBZ0IsQ0FBQztnQkFDNUIsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztnQkFDckIsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQztnQkFDeEIsbUJBQW1CLHFCQUFBO2dCQUNuQixhQUFhLEVBQUUsRUFBRTthQUNsQixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN0QixJQUFJLEVBQUUsS0FBSztpQkFDWixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sR0FBRyxHQUFHLElBQUksbUJBQVUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQy9CLElBQU0sR0FBRyxHQUFHLElBQUkscUJBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7WUFDakUsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsSUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBYSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBQyxFQUFDLENBQUMsQ0FBQztZQUNsRSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNqQixJQUFNLElBQUksR0FBRyxJQUFJLHFCQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRWxCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTFDLElBQU0sSUFBSSxHQUFHLDJCQUFnQixDQUFDO2dCQUM1QixPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDO2dCQUNyQixXQUFXLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDO2dCQUN4QixtQkFBbUIscUJBQUE7Z0JBQ25CLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQVcsSUFBSSxFQUFFLENBQUM7b0JBQ2hDLElBQUksRUFBRSxVQUFVO29CQUNoQixHQUFHLEVBQUUsU0FBUztvQkFDZCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDO2lCQUN0QixFQUFFO29CQUNELElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxVQUFVO29CQUNsQixTQUFTLEVBQUUsQ0FBQzs0QkFDVixJQUFJLEVBQUUsV0FBVzs0QkFDakIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDOzRCQUNkLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQzs0QkFDZCxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUM7NEJBQ2IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDO3lCQUNoQixDQUFDO2lCQUFDO2FBQ0osQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=