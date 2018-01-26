"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var log = require("../../../src/log");
var util_1 = require("../../util");
describe('compile/data/formatparse', function () {
    describe('parseUnit', function () {
        it('should return a correct parse for encoding mapping and filter transforms', function () {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model).parse, {
                a: 'number',
                b: 'date',
                date: 'date'
            });
        });
        it('should parse binned fields as numbers.', function () {
            var model = util_1.parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal", "bin": true },
                    "y": { "field": "b", "type": "ordinal" }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model).parse, {
                a: 'number'
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model).parse, {
                a: 'number',
                b: 'date',
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
                    color: { field: '*', type: "quantitative", aggregate: 'count' },
                    size: { field: 'b2', type: "quantitative" },
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model).parse, {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model), null);
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model).parse, {
                'a': 'number'
            });
            model.parseScale();
            model.parseData();
            chai_1.assert.deepEqual(model.child.component.data.ancestorParse, {
                'a': 'number',
                'b': 'date'
            });
            // set the ancestor parse to see whether fields from it are not parsed
            model.child.component.data.ancestorParse = { a: 'number' };
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(model.child).parse, {
                'b': 'date'
            });
        });
    });
    describe('assembleTransforms', function () {
        it('should assemble correct parse expressions', function () {
            var p = new formatparse_1.ParseNode({
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
        it('should show warning for unrecognized types', log.wrap(function (localLogger) {
            var p = new formatparse_1.ParseNode({
                x: 'foo',
            });
            chai_1.assert.deepEqual(p.assembleTransforms(), []);
            chai_1.assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLHFFQUFnRTtBQUVoRSxzQ0FBd0M7QUFDeEMsbUNBQTJEO0FBRTNELFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUNuQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDO2dCQUN6QixXQUFXLEVBQUUsQ0FBQzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFO2dDQUNMLEtBQUssRUFBRSxDQUFDO3dDQUNOLElBQUksRUFBRTs0Q0FDSjtnREFDRSxVQUFVLEVBQUUsTUFBTTtnREFDbEIsT0FBTyxFQUFFLE1BQU07Z0RBQ2YsT0FBTyxFQUFFLElBQUk7NkNBQ2Q7NENBQ0QsYUFBYTt5Q0FDZDtxQ0FDRixDQUFDOzZCQUNIO3lCQUNGO3FCQUNGLENBQUM7Z0JBQ0YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDM0MsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDO29CQUN2QyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQzFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDM0M7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFN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b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VVbml0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgY29ycmVjdCBwYXJzZSBmb3IgZW5jb2RpbmcgbWFwcGluZyBhbmQgZmlsdGVyIHRyYW5zZm9ybXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImEuanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW3tcbiAgICAgICAgICBcImZpbHRlclwiOiB7XG4gICAgICAgICAgICBcIm5vdFwiOiB7XG4gICAgICAgICAgICAgIFwiYW5kXCI6IFt7XG4gICAgICAgICAgICAgICAgXCJvclwiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidGltZVVuaXRcIjogXCJ5ZWFyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZXF1YWxcIjogMjAwNVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwiZGF0dW0uYSA+IDVcIlxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJzaGFwZVwiOiB7XCJmaWVsZFwiOiBcImRcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZShtb2RlbCkucGFyc2UsIHtcbiAgICAgICAgYTogJ251bWJlcicsXG4gICAgICAgIGI6ICdkYXRlJyxcbiAgICAgICAgZGF0ZTogJ2RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgYmlubmVkIGZpZWxkcyBhcyBudW1iZXJzLicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIiwgXCJiaW5cIjogdHJ1ZX0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlKG1vZGVsKS5wYXJzZSwge1xuICAgICAgICBhOiAnbnVtYmVyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgY3VzdG9taXplZCBwYXJzZS4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImEuanNvblwiLCBcImZvcm1hdFwiOiB7XCJwYXJzZVwiOiB7XCJjXCI6IFwibnVtYmVyXCIsIFwiZFwiOiBcImRhdGVcIn19fSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwic2hhcGVcIjoge1wiZmllbGRcIjogXCJjXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobW9kZWwpLnBhcnNlLCB7XG4gICAgICAgIGE6ICdudW1iZXInLFxuICAgICAgICBiOiAnZGF0ZScsXG4gICAgICAgIGM6ICdudW1iZXInLFxuICAgICAgICBkOiAnZGF0ZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIHBhcnNlIGZvciBhbGwgYXBwbGljYWJsZSBmaWVsZHMsIGFuZCBleGNsdWRlIGNhbGN1bGF0ZWQgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgdHJhbnNmb3JtOiBbe2NhbGN1bGF0ZTogJ2RhdHVtW1wiYlwiXSAqIDInLCBhczogJ2IyJ31dLFxuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICcqJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIiwgYWdncmVnYXRlOiAnY291bnQnfSxcbiAgICAgICAgICBzaXplOiB7ZmllbGQ6ICdiMicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZShtb2RlbCkucGFyc2UsIHtcbiAgICAgICAgJ2EnOiAnZGF0ZScsXG4gICAgICAgICdiJzogJ251bWJlcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2UgZmllbGRzIHdpdGggYWdncmVnYXRlPW1pc3NpbmcvdmFsaWQvZGlzdGluY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2FnZ3JlZ2F0ZTogJ21pc3NpbmcnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICB5OiB7YWdncmVnYXRlOiAndmFsaWQnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBjb2xvcjoge2FnZ3JlZ2F0ZTogJ2Rpc3RpbmN0JywgZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobW9kZWwpLCBudWxsKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIHRoZSBzYW1lIGZpZWxkIHR3aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB2YWx1ZXM6IFtdLFxuICAgICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgcGFyc2U6IHtcbiAgICAgICAgICAgICAgYTogJ251bWJlcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogXCJ0ZW1wb3JhbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobW9kZWwpLnBhcnNlLCB7XG4gICAgICAgICdhJzogJ251bWJlcidcbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VEYXRhKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZSwge1xuICAgICAgICAnYSc6ICdudW1iZXInLFxuICAgICAgICAnYic6ICdkYXRlJ1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHNldCB0aGUgYW5jZXN0b3IgcGFyc2UgdG8gc2VlIHdoZXRoZXIgZmllbGRzIGZyb20gaXQgYXJlIG5vdCBwYXJzZWRcbiAgICAgIG1vZGVsLmNoaWxkLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UgPSB7YTogJ251bWJlcid9O1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZShtb2RlbC5jaGlsZCBhcyBNb2RlbFdpdGhGaWVsZCkucGFyc2UsIHtcbiAgICAgICAgJ2InOiAnZGF0ZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVUcmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBjb3JyZWN0IHBhcnNlIGV4cHJlc3Npb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZSh7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgIHM6ICdzdHJpbmcnLFxuICAgICAgICBkMTogJ2RhdGUnLFxuICAgICAgICBkMjogJ2RhdGU6XCIleVwiJyxcbiAgICAgICAgZDM6ICd1dGM6XCIleVwiJ1xuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocC5hc3NlbWJsZVRyYW5zZm9ybXMoKSwgW1xuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9OdW1iZXIoZGF0dW1bXCJuXCJdKScsIGFzOiAnbid9LFxuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9Cb29sZWFuKGRhdHVtW1wiYlwiXSknLCBhczogJ2InfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvU3RyaW5nKGRhdHVtW1wic1wiXSknLCBhczogJ3MnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvRGF0ZShkYXR1bVtcImQxXCJdKScsIGFzOiAnZDEnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RpbWVQYXJzZShkYXR1bVtcImQyXCJdLFwiJXlcIiknLCBhczogJ2QyJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd1dGNQYXJzZShkYXR1bVtcImQzXCJdLFwiJXlcIiknLCBhczogJ2QzJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgZm9yIHVucmVjb2duaXplZCB0eXBlcycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUoe1xuICAgICAgICB4OiAnZm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVUcmFuc2Zvcm1zKCksIFtdKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UoJ2ZvbycpKTtcbiAgICB9KSk7XG4gIH0pO1xufSk7XG4iXX0=