"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var parse_1 = require("../../../src/compile/data/parse");
var log = tslib_1.__importStar(require("../../../src/log"));
var util_1 = require("../../util");
describe('compile/data/formatparse', function () {
    describe('parseUnit', function () {
        it('should parse binned fields as numbers', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal", "bin": true },
                    "y": { "field": "b", "type": "ordinal" }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                a: 'number'
            });
        });
        it('should flatten nested fields that are used to sort domains', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {
                    x: { field: 'a', type: 'ordinal', sort: { field: 'foo.bar', op: 'mean' } },
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                'foo.bar': 'flatten'
            });
        });
        it('should return a correct customized parse.', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json", "format": { "parse": { "c": "number", "d": "date" } } },
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "c", "type": "nominal" }
                }
            });
            var ancestorParese = new data_1.AncestorParse();
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, ancestorParese).parse, {
                a: 'number',
                b: 'date'
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeExplicit(null, model, ancestorParese).parse, {
                c: 'number',
                d: 'date'
            });
        });
        it('should include parse for all applicable fields, and exclude calculated fields', function () {
            var model = util_1.parseUnitModel({
                transform: [{ calculate: 'datum["b"] * 2', as: 'b2' }],
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "temporal" },
                    y: { field: 'b', type: "quantitative" },
                    color: { type: "quantitative", aggregate: 'count' },
                    size: { field: 'b2', type: "quantitative" },
                }
            });
            var ancestorParse = new data_1.AncestorParse();
            var parent = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(parent, model, ancestorParse);
            chai_1.assert.deepEqual(ancestorParse.combine(), { 'b2': 'derived' });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
                'a': 'date',
                'b': 'number'
            });
        });
        it('should not parse fields with aggregate=missing/valid/distinct', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { aggregate: 'missing', field: 'b', type: "quantitative" },
                    y: { aggregate: 'valid', field: 'b', type: "quantitative" },
                    color: { aggregate: 'distinct', field: 'b', type: "quantitative" }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()), null);
        });
        it('should not parse the same field twice', function () {
            var model = util_1.parseFacetModel({
                data: {
                    values: [],
                    format: {
                        parse: {
                            a: 'number'
                        }
                    }
                },
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: "point",
                    encoding: {
                        x: { field: 'a', type: "quantitative" },
                        y: { field: 'b', type: "temporal" }
                    }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse()).parse, {
                'a': 'number'
            });
            model.parseScale();
            model.parseData();
            chai_1.assert.deepEqual(model.child.component.data.ancestorParse.combine(), {
                'a': 'number',
                'b': 'date'
            });
            // set the ancestor parse to see whether fields from it are not parsed
            model.child.component.data.ancestorParse = new data_1.AncestorParse({ a: 'number' });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model.child, model.child.component.data.ancestorParse).parse, {
                'b': 'date'
            });
        });
        it('should not parse the same field twice in explicit', function () {
            var model = util_1.parseUnitModel({
                data: {
                    values: [],
                    format: {
                        parse: {
                            a: 'number'
                        }
                    }
                },
                mark: "point",
                encoding: {}
            });
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse the same field twice in implicit', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse counts', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "foo", "type": "quantitative" },
                    "y": { "aggregate": "count", "type": "quantitative" }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                "foo": "number"
            });
        });
        it('should add flatten for nested fields', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "field": "foo.bar", "type": "quantitative" },
                    "y": { "field": "foo.baz", "type": "ordinal" }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                "foo.bar": "number",
                "foo.baz": "flatten"
            });
        });
        it('should not parse if parse is disabled for a field', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "data": {
                    "values": [],
                    "format": {
                        "parse": {
                            "b": null
                        }
                    }
                },
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            var ancestorParse = new data_1.AncestorParse();
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, ancestorParse), null);
            chai_1.assert.deepEqual(ancestorParse.combine(), {
                b: null
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
                a: 'number'
            });
        });
        it('should not parse if parse is disabled', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "data": {
                    "values": [],
                    "format": {
                        "parse": null // implies AncestorParse.makeExplicit = true
                    }
                },
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse({}, {}, true)));
        });
    });
    describe('assembleTransforms', function () {
        it('should assemble correct parse expressions', function () {
            var p = new formatparse_1.ParseNode(null, {
                n: 'number',
                b: 'boolean',
                s: 'string',
                d1: 'date',
                d2: 'date:"%y"',
                d3: 'utc:"%y"'
            });
            chai_1.assert.deepEqual(p.assembleTransforms(), [
                { type: 'formula', expr: 'toNumber(datum["n"])', as: 'n' },
                { type: 'formula', expr: 'toBoolean(datum["b"])', as: 'b' },
                { type: 'formula', expr: 'toString(datum["s"])', as: 's' },
                { type: 'formula', expr: 'toDate(datum["d1"])', as: 'd1' },
                { type: 'formula', expr: 'timeParse(datum["d2"],"%y")', as: 'd2' },
                { type: 'formula', expr: 'utcParse(datum["d3"],"%y")', as: 'd3' }
            ]);
        });
        it('should assemble flatten for nested fields', function () {
            var p = new formatparse_1.ParseNode(null, {
                flat: 'number',
                'nested.field': 'flatten'
            });
            chai_1.assert.deepEqual(p.assembleTransforms(true), [
                { type: 'formula', expr: 'datum["nested"] && datum["nested"]["field"]', as: 'nested.field' }
            ]);
        });
        it('should show warning for unrecognized types', log.wrap(function (localLogger) {
            var p = new formatparse_1.ParseNode(null, {
                x: 'foo',
            });
            chai_1.assert.deepEqual(p.assembleTransforms(), []);
            chai_1.assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
        }));
    });
    describe('assembleFormatParse', function () {
        it('should assemble correct parse', function () {
            var p = new formatparse_1.ParseNode(null, {
                n: 'number',
                b: 'boolean',
                'nested.field': 'flatten'
            });
            chai_1.assert.deepEqual(p.assembleFormatParse(), {
                n: 'number',
                b: 'boolean'
            });
        });
    });
    describe('producedFields', function () {
        it('should produce the correct fields', function () {
            var p = new formatparse_1.ParseNode(null, {
                n: 'number',
                b: 'boolean',
                'nested.field': 'flatten'
            });
            chai_1.assert.deepEqual(p.producedFields(), { n: true, b: true, 'nested.field': true });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUM1QixrREFBd0Q7QUFDeEQsK0RBQWdFO0FBQ2hFLHFFQUFnRTtBQUNoRSx5REFBb0U7QUFFcEUsNERBQXdDO0FBQ3hDLG1DQUEyRDtBQUUzRCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDO29CQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQ3ZDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyx1QkFBUyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxvQkFBYSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNGLENBQUMsRUFBRSxRQUFRO2FBQ1osQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNERBQTRELEVBQUU7WUFDL0QsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFB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LENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtZQUN0QyxJQUFNLENBQUMsR0FBRyxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFO2dCQUM1QixDQUFDLEVBQUUsUUFBUTtnQkFDWCxDQUFDLEVBQUUsU0FBUztnQkFDWixjQUFjLEVBQUUsU0FBUzthQUMxQixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QW5jZXN0b3JQYXJzZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge3BhcnNlVHJhbnNmb3JtQXJyYXl9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIGJpbm5lZCBmaWVsZHMgYXMgbnVtYmVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIiwgXCJiaW5cIjogdHJ1ZX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpLnBhcnNlLCB7XG4gICAgICAgIGE6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmxhdHRlbiBuZXN0ZWQgZmllbGRzIHRoYXQgYXJlIHVzZWQgdG8gc29ydCBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNvcnQ6IHtmaWVsZDogJ2Zvby5iYXInLCBvcDogJ21lYW4nfX0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpLnBhcnNlLCB7XG4gICAgICAgICdmb28uYmFyJzogJ2ZsYXR0ZW4nXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBjdXN0b21pemVkIHBhcnNlLicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiYS5qc29uXCIsIFwiZm9ybWF0XCI6IHtcInBhcnNlXCI6IHtcImNcIjogXCJudW1iZXJcIiwgXCJkXCI6IFwiZGF0ZVwifX19LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYW5jZXN0b3JQYXJlc2UgPSBuZXcgQW5jZXN0b3JQYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcmVzZSkucGFyc2UsIHtcbiAgICAgICAgYTogJ251bWJlcicsXG4gICAgICAgIGI6ICdkYXRlJ1xuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VFeHBsaWNpdChudWxsLCBtb2RlbCwgYW5jZXN0b3JQYXJlc2UpLnBhcnNlLCB7XG4gICAgICAgIGM6ICdudW1iZXInLFxuICAgICAgICBkOiAnZGF0ZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIHBhcnNlIGZvciBhbGwgYXBwbGljYWJsZSBmaWVsZHMsIGFuZCBleGNsdWRlIGNhbGN1bGF0ZWQgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgdHJhbnNmb3JtOiBbe2NhbGN1bGF0ZTogJ2RhdHVtW1wiYlwiXSAqIDInLCBhczogJ2IyJ31dLFxuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7dHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYWdncmVnYXRlOiAnY291bnQnfSxcbiAgICAgICAgICBzaXplOiB7ZmllbGQ6ICdiMicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYW5jZXN0b3JQYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBjb25zdCBwYXJlbnQgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgcGFyc2VUcmFuc2Zvcm1BcnJheShwYXJlbnQsIG1vZGVsLCBhbmNlc3RvclBhcnNlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYW5jZXN0b3JQYXJzZS5jb21iaW5lKCksIHsnYjInOiAnZGVyaXZlZCd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgYW5jZXN0b3JQYXJzZSkucGFyc2UsIHtcbiAgICAgICAgJ2EnOiAnZGF0ZScsXG4gICAgICAgICdiJzogJ251bWJlcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2UgZmllbGRzIHdpdGggYWdncmVnYXRlPW1pc3NpbmcvdmFsaWQvZGlzdGluY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2FnZ3JlZ2F0ZTogJ21pc3NpbmcnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICB5OiB7YWdncmVnYXRlOiAndmFsaWQnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBjb2xvcjoge2FnZ3JlZ2F0ZTogJ2Rpc3RpbmN0JywgZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSksIG51bGwpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgdHdpY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZhbHVlczogW10sXG4gICAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICBhOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiBcInRlbXBvcmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKS5wYXJzZSwge1xuICAgICAgICAnYSc6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlRGF0YSgpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNoaWxkLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UuY29tYmluZSgpLCB7XG4gICAgICAgICdhJzogJ251bWJlcicsXG4gICAgICAgICdiJzogJ2RhdGUnXG4gICAgICB9KTtcblxuICAgICAgLy8gc2V0IHRoZSBhbmNlc3RvciBwYXJzZSB0byBzZWUgd2hldGhlciBmaWVsZHMgZnJvbSBpdCBhcmUgbm90IHBhcnNlZFxuICAgICAgbW9kZWwuY2hpbGQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKHthOiAnbnVtYmVyJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLmNoaWxkIGFzIE1vZGVsV2l0aEZpZWxkLCBtb2RlbC5jaGlsZC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlKS5wYXJzZSwge1xuICAgICAgICAnYic6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSB0aGUgc2FtZSBmaWVsZCB0d2ljZSBpbiBleHBsaWNpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2YWx1ZXM6IFtdLFxuICAgICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgcGFyc2U6IHtcbiAgICAgICAgICAgICAgYTogJ251bWJlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmlzTnVsbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSh7YTogJ251bWJlcid9LCB7fSkpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIHRoZSBzYW1lIGZpZWxkIHR3aWNlIGluIGltcGxpY2l0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc051bGwoUGFyc2VOb2RlLm1ha2VFeHBsaWNpdChudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2Uoe2E6ICdudW1iZXInfSwge30pKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSBjb3VudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpLnBhcnNlLCB7XG4gICAgICAgIFwiZm9vXCI6IFwibnVtYmVyXCJcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgZmxhdHRlbiBmb3IgbmVzdGVkIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJmb28uYmFyXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJmb28uYmF6XCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgXCJmb28uYmFyXCI6IFwibnVtYmVyXCIsXG4gICAgICAgIFwiZm9vLmJhelwiOiBcImZsYXR0ZW5cIlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSBpZiBwYXJzZSBpcyBkaXNhYmxlZCBmb3IgYSBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidmFsdWVzXCI6IFtdLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwicGFyc2VcIjoge1xuICAgICAgICAgICAgICBcImJcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFuY2VzdG9yUGFyc2UgPSBuZXcgQW5jZXN0b3JQYXJzZSgpO1xuICAgICAgYXNzZXJ0LmlzTnVsbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcnNlKSwgbnVsbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGFuY2VzdG9yUGFyc2UuY29tYmluZSgpLCB7XG4gICAgICAgIGI6IG51bGxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcnNlKS5wYXJzZSwge1xuICAgICAgICBhOiAnbnVtYmVyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSBpZiBwYXJzZSBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidmFsdWVzXCI6IFtdLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwicGFyc2VcIjogbnVsbCAgLy8gaW1wbGllcyBBbmNlc3RvclBhcnNlLm1ha2VFeHBsaWNpdCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNOdWxsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKHt9LCB7fSwgdHJ1ZSkpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlVHJhbnNmb3JtcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgY29ycmVjdCBwYXJzZSBleHByZXNzaW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICBuOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2Jvb2xlYW4nLFxuICAgICAgICBzOiAnc3RyaW5nJyxcbiAgICAgICAgZDE6ICdkYXRlJyxcbiAgICAgICAgZDI6ICdkYXRlOlwiJXlcIicsXG4gICAgICAgIGQzOiAndXRjOlwiJXlcIidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVUcmFuc2Zvcm1zKCksIFtcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvTnVtYmVyKGRhdHVtW1wiblwiXSknLCBhczogJ24nfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvQm9vbGVhbihkYXR1bVtcImJcIl0pJywgYXM6ICdiJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0b1N0cmluZyhkYXR1bVtcInNcIl0pJywgYXM6ICdzJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0b0RhdGUoZGF0dW1bXCJkMVwiXSknLCBhczogJ2QxJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0aW1lUGFyc2UoZGF0dW1bXCJkMlwiXSxcIiV5XCIpJywgYXM6ICdkMid9LFxuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndXRjUGFyc2UoZGF0dW1bXCJkM1wiXSxcIiV5XCIpJywgYXM6ICdkMyd9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgZmxhdHRlbiBmb3IgbmVzdGVkIGZpZWxkcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICBmbGF0OiAnbnVtYmVyJyxcbiAgICAgICAgJ25lc3RlZC5maWVsZCc6ICdmbGF0dGVuJ1xuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocC5hc3NlbWJsZVRyYW5zZm9ybXModHJ1ZSksIFtcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ2RhdHVtW1wibmVzdGVkXCJdICYmIGRhdHVtW1wibmVzdGVkXCJdW1wiZmllbGRcIl0nLCBhczogJ25lc3RlZC5maWVsZCd9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIGZvciB1bnJlY29nbml6ZWQgdHlwZXMnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUGFyc2VOb2RlKG51bGwsIHtcbiAgICAgICAgeDogJ2ZvbycsXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLmFzc2VtYmxlVHJhbnNmb3JtcygpLCBbXSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVucmVjb2duaXplZFBhcnNlKCdmb28nKSk7XG4gICAgfSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVGb3JtYXRQYXJzZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgY29ycmVjdCBwYXJzZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICBuOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2Jvb2xlYW4nLFxuICAgICAgICAnbmVzdGVkLmZpZWxkJzogJ2ZsYXR0ZW4nXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLmFzc2VtYmxlRm9ybWF0UGFyc2UoKSwge1xuICAgICAgICBuOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2Jvb2xlYW4nXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Byb2R1Y2VkRmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIHRoZSBjb3JyZWN0IGZpZWxkcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICBuOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2Jvb2xlYW4nLFxuICAgICAgICAnbmVzdGVkLmZpZWxkJzogJ2ZsYXR0ZW4nXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLnByb2R1Y2VkRmllbGRzKCksIHtuOiB0cnVlLCBiOiB0cnVlLCAnbmVzdGVkLmZpZWxkJzogdHJ1ZX0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19