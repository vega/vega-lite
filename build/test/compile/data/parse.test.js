"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var calculate_1 = require("../../../src/compile/data/calculate");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var filter_1 = require("../../../src/compile/data/filter");
var formatparse_1 = require("../../../src/compile/data/formatparse");
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
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof calculate_1.CalculateNode);
            chai_1.assert.isTrue(result instanceof filter_1.FilterNode);
        });
        it('should add a parse node for filter transforms with time unit', function () {
            var model = util_1.parseUnitModel({
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
            var root = new dataflow_1.DataFlowNode(null);
            var parse = new data_1.AncestorParse();
            var result = parse_1.parseTransformArray(root, model, parse);
            chai_1.assert.isTrue(root.children[0] instanceof formatparse_1.ParseNode);
            chai_1.assert.isTrue(result instanceof filter_1.FilterNode);
            chai_1.assert.deepEqual(root.children[0].parse, {
                date: 'date'
            });
            chai_1.assert.deepEqual(parse.combine(), { date: 'date' });
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
            var parse = new data_1.AncestorParse();
            var result = parse_1.parseTransformArray(root, model, parse);
            chai_1.assert.isTrue(root.children[0] instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result instanceof timeunit_1.TimeUnitNode);
            chai_1.assert.deepEqual(parse.combine(), { a: 'number', b: 'date' });
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
            var result = parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
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
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
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
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
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
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
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
            parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
            chai_1.assert.isTrue(root.children[0] instanceof window_1.WindowTransformNode);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGtEQUF3RDtBQUN4RCxpRUFBa0U7QUFDbEUscURBQXNEO0FBQ3RELGlFQUFrRTtBQUNsRSwrREFBZ0U7QUFDaEUsMkRBQTREO0FBQzVELHFFQUFnRTtBQUNoRSx5REFBb0U7QUFDcEUsK0RBQWdFO0FBQ2hFLDJEQUFxRTtBQUVyRSxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDbkQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDbEIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsU0FBUyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQztnQkFDbkUsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFNLE1BQU0sR0FBRywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksb0JBQWEsRUFBRSxDQUFDLENBQUM7WUFDckUsYUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLHlCQUFh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Q0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLDRCQUFtQixDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QW5jZXN0b3JQYXJzZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmlsdGVyJztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvd2luZG93JztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdHJhbnNmb3JtJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3BhcnNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VUcmFuc2Zvcm1BcnJheSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgQ2FsY3VsYXRlTm9kZSBhbmQgYSBGaWx0ZXJOb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbe2NhbGN1bGF0ZTogJ2NhbGN1bGF0ZScsIGFzOiAnYXMnfSwge2ZpbHRlcjogJ2ZpbHRlcid9XSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgQ2FsY3VsYXRlTm9kZSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJlc3VsdCBpbnN0YW5jZW9mIEZpbHRlck5vZGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgYSBwYXJzZSBub2RlIGZvciBmaWx0ZXIgdHJhbnNmb3JtcyB3aXRoIHRpbWUgdW5pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiYS5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbe1xuICAgICAgICAgIFwiZmlsdGVyXCI6IHtcbiAgICAgICAgICAgIFwibm90XCI6IHtcbiAgICAgICAgICAgICAgXCJhbmRcIjogW3tcbiAgICAgICAgICAgICAgICBcIm9yXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ0aW1lVW5pdFwiOiBcInllYXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJlcXVhbFwiOiAyMDA1XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJkYXR1bS5hID4gNVwiXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiZFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIGNvbnN0IHBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2UoKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIHBhcnNlKTtcblxuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgUGFyc2VOb2RlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocmVzdWx0IGluc3RhbmNlb2YgRmlsdGVyTm9kZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKChyb290LmNoaWxkcmVuWzBdIGFzIFBhcnNlTm9kZSkucGFyc2UsIHtcbiAgICAgICAgZGF0ZTogJ2RhdGUnXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UuY29tYmluZSgpLCB7ZGF0ZTogJ2RhdGUnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIEJpbk5vZGUgbm9kZSBhbmQgYSBUaW1lVW5pdE5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge3ZhbHVlczogW119LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICB0cmFuc2Zvcm06IFt7YmluOiB0cnVlLCBmaWVsZDogJ2ZpZWxkJywgYXM6ICdhJ30sIHt0aW1lVW5pdDogJ21vbnRoJywgZmllbGQ6ICdmaWVsZCcsIGFzOiAnYid9XSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3RlbXBvcmFsJywgdGltZVVuaXQ6ICdtb250aCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIGNvbnN0IHBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2UoKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIHBhcnNlKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQgaW5zdGFuY2VvZiBUaW1lVW5pdE5vZGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwYXJzZS5jb21iaW5lKCksIHthOiAnbnVtYmVyJywgYjogJ2RhdGUnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIEJpbk5vZGUgYW5kIGEgQWdncmVnYXRlTm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW3tiaW46IHRydWUsIGZpZWxkOiAnZmllbGQnLCBhczogJ2EnfSwge2FnZ3JlZ2F0ZTogW3tvcDogJ2NvdW50JywgZmllbGQ6ICdmJywgYXM6ICdiJ30sIHtvcDogJ3N1bScsIGZpZWxkOiAnZicsIGFzOiAnYyd9XSwgZ3JvdXBieTogWydmaWVsZCddfV0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgcm9vdCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKTtcbiAgICAgIGFzc2VydC5pc1RydWUocm9vdC5jaGlsZHJlblswXSBpbnN0YW5jZW9mIEJpbk5vZGUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyZXN1bHQgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAnY291bnQnLFxuICAgICAgICAgICAgZmllbGQ6ICdmJyxcbiAgICAgICAgICAgIGFzOiAnYicsXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG4gICAgaXQgKCdzaG91bGQgcmV0dXJuIGEgV2luZG93VHJhbnNmb3JtIE5vZGUgd2l0aCBvcHRpb25hbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBzb3J0OiAgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpZWxkOidmJyxcbiAgICAgICAgICAgIG9yZGVyOidhc2NlbmRpbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgdHJhbnNmb3JtXG4gICAgICAgIF0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgcGFyc2VUcmFuc2Zvcm1BcnJheShyb290LCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBXaW5kb3dUcmFuc2Zvcm1Ob2RlKTtcbiAgICB9KTtcblxuICAgIGl0ICgnc2hvdWxkIHJldHVybiBhIFdpbmRvd1RyYW5zZm9ybSBOb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAnY291bnQnLFxuICAgICAgICAgICAgZmllbGQ6ICdmJyxcbiAgICAgICAgICAgIGFzOiAnYicsXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7dmFsdWVzOiBbXX0sXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIHRyYW5zZm9ybTogW1xuICAgICAgICAgIHRyYW5zZm9ybVxuICAgICAgICBdLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAndGVtcG9yYWwnLCB0aW1lVW5pdDogJ21vbnRoJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShyb290LmNoaWxkcmVuWzBdIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSk7XG4gICAgfSk7XG4gICAgaXQgKCdzaG91bGQgcmV0dXJuIGEgV2luZG93VHJhbnNmb3JtIE5vZGUgd2l0aCBvcHRpb25hbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHJhbnNmb3JtOiBUcmFuc2Zvcm0gPSB7XG4gICAgICAgIHdpbmRvdzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9wOiAncm93X251bWJlcicsXG4gICAgICAgICAgICBhczogJ29yZGVyZWRfcm93X251bWJlcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgaWdub3JlUGVlcnM6IGZhbHNlLFxuICAgICAgICBzb3J0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGZpZWxkOidmJyxcbiAgICAgICAgICAgICAgb3JkZXI6J2FzY2VuZGluZydcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICB9O1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHt2YWx1ZXM6IFtdfSxcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgdHJhbnNmb3JtOiBbXG4gICAgICAgICAgdHJhbnNmb3JtXG4gICAgICAgIF0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICd0ZW1wb3JhbCcsIHRpbWVVbml0OiAnbW9udGgnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgcGFyc2VUcmFuc2Zvcm1BcnJheShyb290LCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSk7XG4gICAgICBhc3NlcnQuaXNUcnVlKHJvb3QuY2hpbGRyZW5bMF0gaW5zdGFuY2VvZiBXaW5kb3dUcmFuc2Zvcm1Ob2RlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==