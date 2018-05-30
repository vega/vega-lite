"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var parse_1 = require("../../../src/compile/data/parse");
var log = require("../../../src/log");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBQzVCLGtEQUF3RDtBQUN4RCwrREFBZ0U7QUFDaEUscUVBQWdFO0FBQ2hFLHlEQUFvRTtBQUVwRSxzQ0FBd0M7QUFDeEMsbUNBQTJEO0FBRTNELFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUNuQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDdkM7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLHVCQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLG9CQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDM0YsQ0FBQyxFQUFFLFFBQVE7YUFDWixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtZQUMvRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFD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Q0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLElBQU0sQ0FBQyxHQUFHLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLENBQUMsRUFBRSxRQUFRO2dCQUNYLENBQUMsRUFBRSxTQUFTO2dCQUNaLGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBbmNlc3RvclBhcnNlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VVbml0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFyc2UgYmlubmVkIGZpZWxkcyBhcyBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImJpblwiOiB0cnVlfSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgYTogJ251bWJlcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBmbGF0dGVuIG5lc3RlZCBmaWVsZHMgdGhhdCBhcmUgdXNlZCB0byBzb3J0IGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDoge2ZpZWxkOiAnZm9vLmJhcicsIG9wOiAnbWVhbid9fSxcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgJ2Zvby5iYXInOiAnZmxhdHRlbidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGN1c3RvbWl6ZWQgcGFyc2UuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJhLmpzb25cIiwgXCJmb3JtYXRcIjoge1wicGFyc2VcIjoge1wiY1wiOiBcIm51bWJlclwiLCBcImRcIjogXCJkYXRlXCJ9fX0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhbmNlc3RvclBhcmVzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyZXNlKS5wYXJzZSwge1xuICAgICAgICBhOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2RhdGUnXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcmVzZSkucGFyc2UsIHtcbiAgICAgICAgYzogJ251bWJlcicsXG4gICAgICAgIGQ6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgcGFyc2UgZm9yIGFsbCBhcHBsaWNhYmxlIGZpZWxkcywgYW5kIGV4Y2x1ZGUgY2FsY3VsYXRlZCBmaWVsZHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICB0cmFuc2Zvcm06IFt7Y2FsY3VsYXRlOiAnZGF0dW1bXCJiXCJdICogMicsIGFzOiAnYjInfV0sXG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgY29sb3I6IHt0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBhZ2dyZWdhdGU6ICdjb3VudCd9LFxuICAgICAgICAgIHNpemU6IHtmaWVsZDogJ2IyJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhbmNlc3RvclBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2UoKTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHBhcmVudCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhbmNlc3RvclBhcnNlLmNvbWJpbmUoKSwgeydiMic6ICdkZXJpdmVkJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcnNlKS5wYXJzZSwge1xuICAgICAgICAnYSc6ICdkYXRlJyxcbiAgICAgICAgJ2InOiAnbnVtYmVyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSBmaWVsZHMgd2l0aCBhZ2dyZWdhdGU9bWlzc2luZy92YWxpZC9kaXN0aW5jdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7YWdncmVnYXRlOiAnbWlzc2luZycsIGZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIHk6IHthZ2dyZWdhdGU6ICd2YWxpZCcsIGZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7YWdncmVnYXRlOiAnZGlzdGluY3QnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKSwgbnVsbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSB0aGUgc2FtZSBmaWVsZCB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmFsdWVzOiBbXSxcbiAgICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgIGE6ICdudW1iZXInXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpLnBhcnNlLCB7XG4gICAgICAgICdhJzogJ251bWJlcidcbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VEYXRhKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZS5jb21iaW5lKCksIHtcbiAgICAgICAgJ2EnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2InOiAnZGF0ZSdcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZXQgdGhlIGFuY2VzdG9yIHBhcnNlIHRvIHNlZSB3aGV0aGVyIGZpZWxkcyBmcm9tIGl0IGFyZSBub3QgcGFyc2VkXG4gICAgICBtb2RlbC5jaGlsZC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2Uoe2E6ICdudW1iZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwuY2hpbGQgYXMgTW9kZWxXaXRoRmllbGQsIG1vZGVsLmNoaWxkLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UpLnBhcnNlLCB7XG4gICAgICAgICdiJzogJ2RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIHRoZSBzYW1lIGZpZWxkIHR3aWNlIGluIGV4cGxpY2l0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZhbHVlczogW10sXG4gICAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICBhOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge31cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNOdWxsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKHthOiAnbnVtYmVyJ30sIHt9KSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgdHdpY2UgaW4gaW1wbGljaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmlzTnVsbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSh7YTogJ251bWJlcid9LCB7fSkpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGNvdW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJmb29cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgXCJmb29cIjogXCJudW1iZXJcIlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmbGF0dGVuIGZvciBuZXN0ZWQgZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImZvby5iYXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImZvby5iYXpcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKS5wYXJzZSwge1xuICAgICAgICBcImZvby5iYXJcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJmb28uYmF6XCI6IFwiZmxhdHRlblwiXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGlmIHBhcnNlIGlzIGRpc2FibGVkIGZvciBhIGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW10sXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJwYXJzZVwiOiB7XG4gICAgICAgICAgICAgIFwiYlwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYW5jZXN0b3JQYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBhc3NlcnQuaXNOdWxsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpLCBudWxsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYW5jZXN0b3JQYXJzZS5jb21iaW5lKCksIHtcbiAgICAgICAgYjogbnVsbFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpLnBhcnNlLCB7XG4gICAgICAgIGE6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGlmIHBhcnNlIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW10sXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJwYXJzZVwiOiBudWxsICAvLyBpbXBsaWVzIEFuY2VzdG9yUGFyc2UubWFrZUV4cGxpY2l0ID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc051bGwoUGFyc2VOb2RlLm1ha2VFeHBsaWNpdChudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2Uoe30sIHt9LCB0cnVlKSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVUcmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBjb3JyZWN0IHBhcnNlIGV4cHJlc3Npb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgIHM6ICdzdHJpbmcnLFxuICAgICAgICBkMTogJ2RhdGUnLFxuICAgICAgICBkMjogJ2RhdGU6XCIleVwiJyxcbiAgICAgICAgZDM6ICd1dGM6XCIleVwiJ1xuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocC5hc3NlbWJsZVRyYW5zZm9ybXMoKSwgW1xuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9OdW1iZXIoZGF0dW1bXCJuXCJdKScsIGFzOiAnbid9LFxuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9Cb29sZWFuKGRhdHVtW1wiYlwiXSknLCBhczogJ2InfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvU3RyaW5nKGRhdHVtW1wic1wiXSknLCBhczogJ3MnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvRGF0ZShkYXR1bVtcImQxXCJdKScsIGFzOiAnZDEnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RpbWVQYXJzZShkYXR1bVtcImQyXCJdLFwiJXlcIiknLCBhczogJ2QyJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd1dGNQYXJzZShkYXR1bVtcImQzXCJdLFwiJXlcIiknLCBhczogJ2QzJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBmbGF0dGVuIGZvciBuZXN0ZWQgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIGZsYXQ6ICdudW1iZXInLFxuICAgICAgICAnbmVzdGVkLmZpZWxkJzogJ2ZsYXR0ZW4nXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLmFzc2VtYmxlVHJhbnNmb3Jtcyh0cnVlKSwgW1xuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAnZGF0dW1bXCJuZXN0ZWRcIl0gJiYgZGF0dW1bXCJuZXN0ZWRcIl1bXCJmaWVsZFwiXScsIGFzOiAnbmVzdGVkLmZpZWxkJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgZm9yIHVucmVjb2duaXplZCB0eXBlcycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICB4OiAnZm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVUcmFuc2Zvcm1zKCksIFtdKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UoJ2ZvbycpKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZUZvcm1hdFBhcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBjb3JyZWN0IHBhcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgICduZXN0ZWQuZmllbGQnOiAnZmxhdHRlbidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVGb3JtYXRQYXJzZSgpLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncHJvZHVjZWRGaWVsZHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgdGhlIGNvcnJlY3QgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgICduZXN0ZWQuZmllbGQnOiAnZmxhdHRlbidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAucHJvZHVjZWRGaWVsZHMoKSwge246IHRydWUsIGI6IHRydWUsICduZXN0ZWQuZmllbGQnOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=