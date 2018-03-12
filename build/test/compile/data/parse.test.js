"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var calculate_1 = require("../../../src/compile/data/calculate");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var filter_1 = require("../../../src/compile/data/filter");
var parse_1 = require("../../../src/compile/data/parse");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var util_1 = require("../../util");
describe('compile/data/parse', function () {
    describe('parseTransformArray()', function () {
        it('should return a CalculateNode and a FilterNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ calculate: 'calculate', as: 'as' }, { filter: 'filter' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof calculate_1.CalculateNode);
            chai_1.assert.isTrue(result instanceof filter_1.FilterNode);
        });
        it('should return a BinNode node and a TimeUnitNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { timeUnit: 'month', field: 'field', as: 'b' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof timeunit_1.TimeUnitNode);
        });
        it('should return a BinNode and a AggregateNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { aggregate: [{ op: 'count', field: 'f', as: 'b' }, { op: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            var result = parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof aggregate_1.AggregateNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSxxREFBc0Q7QUFDdEQsaUVBQWtFO0FBQ2xFLCtEQUFnRTtBQUNoRSwyREFBNEQ7QUFDNUQseURBQW9FO0FBQ3BFLCtEQUFnRTtBQUNoRSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQztnQkFDbkUsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLHlCQUFhLENBQUMsQ0FBQztZQUN6RCxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sWUFBWSxtQkFBVSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUMsQ0FBQztnQkFDL0YsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLGFBQU8sQ0FBQyxDQUFDO1lBQ25ELGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxZQUFZLHVCQUFZLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQztnQkFDMUosUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLGFBQU8sQ0FBQyxDQUFDO1lBQ25ELGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxZQUFZLHlCQUFhLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZGF0YWZsb3cnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZpbHRlcic7XG5pbXBvcnQge3BhcnNlVHJhbnNmb3JtQXJyYXl9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdGltZXVuaXQnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvcGFyc2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdwYXJzZVRyYW5zZm9ybUFycmF5KCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBDYWxjdWxhdGVOb2RlIGFuZCBhIEZpbHRlck5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7Y2FsY3VsYXRlOiAnY2FsY3VsYXRlJywgYXM6ICdhcyd9LCB7ZmlsdGVyOiAnZmlsdGVyJ31dLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShyb290LCBtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBDYWxjdWxhdGVOb2RlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0IGluc3RhbmNlb2YgRmlsdGVyTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIEJpbk5vZGUgbm9kZSBhbmQgYSBUaW1lVW5pdE5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7YmluOiB0cnVlLCBmaWVsZDogJ2ZpZWxkJywgYXM6ICdhJ30sIHt0aW1lVW5pdDogJ21vbnRoJywgZmllbGQ6ICdmaWVsZCcsIGFzOiAnYid9XSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgQmluTm9kZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdCBpbnN0YW5jZW9mIFRpbWVVbml0Tm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIEJpbk5vZGUgYW5kIGEgQWdncmVnYXRlTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tiaW46IHRydWUsIGZpZWxkOiAnZmllbGQnLCBhczogJ2EnfSwge2FnZ3JlZ2F0ZTogW3tvcDogJ2NvdW50JywgZmllbGQ6ICdmJywgYXM6ICdiJ30sIHtvcDogJ3N1bScsIGZpZWxkOiAnZicsIGFzOiAnYyd9XSwgZ3JvdXBieTogWydmaWVsZCddfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==