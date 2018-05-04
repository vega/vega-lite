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
var window_1 = require("../../../src/compile/data/window");
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
        it('should return a WindowTransform Node', function () {
            var transform = {
                window: [
                    {
                        op: 'count',
                        field: 'f',
                        as: 'b',
                    }
                ],
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node with optional properties', function () {
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
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node', function () {
            var transform = {
                window: [
                    {
                        op: 'count',
                        field: 'f',
                        as: 'b',
                    }
                ],
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
        it('should return a WindowTransform Node with optional properties', function () {
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
                ]
            };
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(root, model);
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGlFQUFrRTtBQUNsRSxxREFBc0Q7QUFDdEQsaUVBQWtFO0FBQ2xFLCtEQUFnRTtBQUNoRSwyREFBNEQ7QUFDNUQseURBQW9FO0FBQ3BFLCtEQUFnRTtBQUNoRSwyREFBcUU7QUFFckUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUM7Z0JBQ25FLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBTSxNQUFNLEdBQUcsMkJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hELGFBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSx5QkFBYSxDQUFDLENBQUM7WUFDekQsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLFlBQVks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QUNGLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRTtvQkFDVCxTQUFTO2lCQUNWO2dCQUNELFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsMkJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLGFBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSw0QkFBbUIsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvd2luZG93JztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3BhcnNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VUcmFuc2Zvcm1BcnJheSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgQ2FsY3VsYXRlTm9kZSBhbmQgYSBGaWx0ZXJOb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe2NhbGN1bGF0ZTogJ2NhbGN1bGF0ZScsIGFzOiAnYXMnfSwge2ZpbHRlcjogJ2ZpbHRlcid9XSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgQ2FsY3VsYXRlTm9kZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdCBpbnN0YW5jZW9mIEZpbHRlck5vZGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBCaW5Ob2RlIG5vZGUgYW5kIGEgVGltZVVuaXROb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe2JpbjogdHJ1ZSwgZmllbGQ6ICdmaWVsZCcsIGFzOiAnYSd9LCB7dGltZVVuaXQ6ICdtb250aCcsIGZpZWxkOiAnZmllbGQnLCBhczogJ2InfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQgaW5zdGFuY2VvZiBUaW1lVW5pdE5vZGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBCaW5Ob2RlIGFuZCBhIEFnZ3JlZ2F0ZU5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7YmluOiB0cnVlLCBmaWVsZDogJ2ZpZWxkJywgYXM6ICdhJ30sIHthZ2dyZWdhdGU6IFt7b3A6ICdjb3VudCcsIGZpZWxkOiAnZicsIGFzOiAnYid9LCB7b3A6ICdzdW0nLCBmaWVsZDogJ2YnLCBhczogJ2MnfV0sIGdyb3VwYnk6IFsnZmllbGQnXX1dLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShyb290LCBtb2RlbCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBCaW5Ob2RlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0IGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCByZXR1cm4gYSBXaW5kb3dUcmFuc2Zvcm0gTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBhczogJ2InLFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAgICB0cmFuc2Zvcm1cbiAgICAgICAgXSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUpO1xuICAgIH0pO1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlIHdpdGggb3B0aW9uYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDogIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCByZXR1cm4gYSBXaW5kb3dUcmFuc2Zvcm0gTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBhczogJ2InLFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAgICB0cmFuc2Zvcm1cbiAgICAgICAgXSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUpO1xuICAgIH0pO1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlIHdpdGggb3B0aW9uYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=