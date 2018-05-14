/* tslint:disable:quotemark */
import { assert } from 'chai';
import { AncestorParse } from '../../../src/compile/data';
import { AggregateNode } from '../../../src/compile/data/aggregate';
import { BinNode } from '../../../src/compile/data/bin';
import { CalculateNode } from '../../../src/compile/data/calculate';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { FilterNode } from '../../../src/compile/data/filter';
import { ParseNode } from '../../../src/compile/data/formatparse';
import { parseTransformArray } from '../../../src/compile/data/parse';
import { TimeUnitNode } from '../../../src/compile/data/timeunit';
import { WindowTransformNode } from '../../../src/compile/data/window';
import { parseUnitModel } from '../../util';
describe('compile/data/parse', function () {
    describe('parseTransformArray()', function () {
        it('should return a CalculateNode and a FilterNode', function () {
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ calculate: 'calculate', as: 'as' }, { filter: 'filter' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            var result = parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof CalculateNode);
            assert.isTrue(result instanceof FilterNode);
        });
        it('should add a parse node for filter transforms with time unit', function () {
            var model = parseUnitModel({
                "data": { "url": "a.json" },
                "transform": [{
                        "filter": {
                            "not": {
                                "and": [{
                                        "or": [
                                            {
                                                "timeUnit": "year",
                                                "field": "date",
                                                "equal": 2005
                                            },
                                            "datum.a > 5"
                                        ]
                                    }]
                            }
                        }
                    }],
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "d", "type": "nominal" }
                }
            });
            var root = new DataFlowNode(null);
            var parse = new AncestorParse();
            var result = parseTransformArray(root, model, parse);
            assert.isTrue(root.children[0] instanceof ParseNode);
            assert.isTrue(result instanceof FilterNode);
            assert.deepEqual(root.children[0].parse, {
                date: 'date'
            });
            assert.deepEqual(parse.combine(), { date: 'date' });
        });
        it('should return a BinNode node and a TimeUnitNode', function () {
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { timeUnit: 'month', field: 'field', as: 'b' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            var parse = new AncestorParse();
            var result = parseTransformArray(root, model, parse);
            assert.isTrue(root.children[0] instanceof BinNode);
            assert.isTrue(result instanceof TimeUnitNode);
            assert.deepEqual(parse.combine(), { a: 'number', b: 'date' });
        });
        it('should return a BinNode and a AggregateNode', function () {
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { aggregate: [{ op: 'count', field: 'f', as: 'b' }, { op: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            var result = parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof BinNode);
            assert.isTrue(result instanceof AggregateNode);
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
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof WindowTransformNode);
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
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof WindowTransformNode);
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
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof WindowTransformNode);
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
            var model = parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [
                    transform
                ],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var root = new DataFlowNode(null);
            parseTransformArray(root, model, new AncestorParse());
            assert.isTrue(root.children[0] instanceof WindowTransformNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sK0JBQStCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNoRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDNUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNoRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUVyRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxJQUFJ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TUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFO29CQUNULFNBQVM7aUJBQ1Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FuY2VzdG9yUGFyc2V9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEnO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZGF0YWZsb3cnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZpbHRlcic7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge3BhcnNlVHJhbnNmb3JtQXJyYXl9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdGltZXVuaXQnO1xuaW1wb3J0IHtXaW5kb3dUcmFuc2Zvcm1Ob2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3dpbmRvdyc7XG5pbXBvcnQge1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vLi4vc3JjL3RyYW5zZm9ybSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9wYXJzZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlVHJhbnNmb3JtQXJyYXkoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIENhbGN1bGF0ZU5vZGUgYW5kIGEgRmlsdGVyTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tjYWxjdWxhdGU6ICdjYWxjdWxhdGUnLCBhczogJ2FzJ30sIHtmaWx0ZXI6ICdmaWx0ZXInfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIENhbGN1bGF0ZU5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQgaW5zdGFuY2VvZiBGaWx0ZXJOb2RlKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVyIHRyYW5zZm9ybXMgd2l0aCB0aW1lIHVuaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImEuanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW3tcbiAgICAgICAgICBcImZpbHRlclwiOiB7XG4gICAgICAgICAgICBcIm5vdFwiOiB7XG4gICAgICAgICAgICAgIFwiYW5kXCI6IFt7XG4gICAgICAgICAgICAgICAgXCJvclwiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGltZVVuaXRcIjogXCJ5ZWFyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZXF1YWxcIjogMjAwNVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwiZGF0dW0uYSA+IDVcIlxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImRcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCBwYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBwYXJzZSk7XG5cbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIFBhcnNlTm9kZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdCBpbnN0YW5jZW9mIEZpbHRlck5vZGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCgocm9vdC5jaGlsZHJlblswXSBhcyBQYXJzZU5vZGUpLnBhcnNlLCB7XG4gICAgICAgIGRhdGU6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlLmNvbWJpbmUoKSwge2RhdGU6ICdkYXRlJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBCaW5Ob2RlIG5vZGUgYW5kIGEgVGltZVVuaXROb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe2JpbjogdHJ1ZSwgZmllbGQ6ICdmaWVsZCcsIGFzOiAnYSd9LCB7dGltZVVuaXQ6ICdtb250aCcsIGZpZWxkOiAnZmllbGQnLCBhczogJ2InfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCBwYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBwYXJzZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBCaW5Ob2RlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0IGluc3RhbmNlb2YgVGltZVVuaXROb2RlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UuY29tYmluZSgpLCB7YTogJ251bWJlcicsIGI6ICdkYXRlJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBCaW5Ob2RlIGFuZCBhIEFnZ3JlZ2F0ZU5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7YmluOiB0cnVlLCBmaWVsZDogJ2ZpZWxkJywgYXM6ICdhJ30sIHthZ2dyZWdhdGU6IFt7b3A6ICdjb3VudCcsIGZpZWxkOiAnZicsIGFzOiAnYid9LCB7b3A6ICdzdW0nLCBmaWVsZDogJ2YnLCBhczogJ2MnfV0sIGdyb3VwYnk6IFsnZmllbGQnXX1dLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShyb290LCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBCaW5Ob2RlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0IGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCByZXR1cm4gYSBXaW5kb3dUcmFuc2Zvcm0gTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBhczogJ2InLFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAgICB0cmFuc2Zvcm1cbiAgICAgICAgXSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUpO1xuICAgIH0pO1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlIHdpdGggb3B0aW9uYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDogIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICBvcmRlcjonYXNjZW5kaW5nJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpdCAoJ3Nob3VsZCByZXR1cm4gYSBXaW5kb3dUcmFuc2Zvcm0gTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ2NvdW50JyxcbiAgICAgICAgICAgIGZpZWxkOiAnZicsXG4gICAgICAgICAgICBhczogJ2InLFxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgIH07XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFtcbiAgICAgICAgICB0cmFuc2Zvcm1cbiAgICAgICAgXSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUpO1xuICAgIH0pO1xuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlIHdpdGggb3B0aW9uYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybTogVHJhbnNmb3JtID0ge1xuICAgICAgICB3aW5kb3c6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBvcDogJ3Jvd19udW1iZXInLFxuICAgICAgICAgICAgYXM6ICdvcmRlcmVkX3Jvd19udW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGlnbm9yZVBlZXJzOiBmYWxzZSxcbiAgICAgICAgc29ydDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBmaWVsZDonZicsXG4gICAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=