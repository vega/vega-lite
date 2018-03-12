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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model).parse, {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model).parse, {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model).parse, {
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
                    color: { type: "quantitative", aggregate: 'count' },
                    size: { field: 'b2', type: "quantitative" },
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model).parse, {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model), null);
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model).parse, {
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
            chai_1.assert.deepEqual(formatparse_1.ParseNode.make(null, model.child).parse, {
                'b': 'date'
            });
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
        it('should show warning for unrecognized types', log.wrap(function (localLogger) {
            var p = new formatparse_1.ParseNode(null, {
                x: 'foo',
            });
            chai_1.assert.deepEqual(p.assembleTransforms(), []);
            chai_1.assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLHFFQUFnRTtBQUVoRSxzQ0FBd0M7QUFDeEMsbUNBQTJEO0FBRTNELFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUNuQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDO2dCQUN6QixXQUFXLEVBQUUsQ0FBQzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFO2dDQUNMLEtBQUssRUFBRSxDQUFDO3dDQUNOLElBQUksRUFBRTs0Q0FDSjtnREFDRSxVQUFVLEVBQUUsTUFBTTtnREFDbEIsT0FBTyxFQUFFLE1BQU07Z0RBQ2YsT0FBTyxFQUFFLElBQUk7NkNBQ2Q7NENBQ0QsYUFBYTt5Q0FDZDtxQ0FDRixDQUFDOzZCQUNIO3lCQUNGO3FCQUNGLENBQUM7Z0JBQ0YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDM0MsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDO29CQUN2QyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQzFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDM0M7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFN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Q0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtQYXJzZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZm9ybWF0cGFyc2UnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIGNvcnJlY3QgcGFyc2UgZm9yIGVuY29kaW5nIG1hcHBpbmcgYW5kIGZpbHRlciB0cmFuc2Zvcm1zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJhLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFt7XG4gICAgICAgICAgXCJmaWx0ZXJcIjoge1xuICAgICAgICAgICAgXCJub3RcIjoge1xuICAgICAgICAgICAgICBcImFuZFwiOiBbe1xuICAgICAgICAgICAgICAgIFwib3JcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInRpbWVVbml0XCI6IFwieWVhclwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImVxdWFsXCI6IDIwMDVcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcImRhdHVtLmEgPiA1XCJcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwic2hhcGVcIjoge1wiZmllbGRcIjogXCJkXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobnVsbCwgbW9kZWwpLnBhcnNlLCB7XG4gICAgICAgIGE6ICdudW1iZXInLFxuICAgICAgICBiOiAnZGF0ZScsXG4gICAgICAgIGRhdGU6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGJpbm5lZCBmaWVsZHMgYXMgbnVtYmVycy4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiYmluXCI6IHRydWV9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZShudWxsLCBtb2RlbCkucGFyc2UsIHtcbiAgICAgICAgYTogJ251bWJlcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGN1c3RvbWl6ZWQgcGFyc2UuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJhLmpzb25cIiwgXCJmb3JtYXRcIjoge1wicGFyc2VcIjoge1wiY1wiOiBcIm51bWJlclwiLCBcImRcIjogXCJkYXRlXCJ9fX0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlKG51bGwsIG1vZGVsKS5wYXJzZSwge1xuICAgICAgICBhOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2RhdGUnLFxuICAgICAgICBjOiAnbnVtYmVyJyxcbiAgICAgICAgZDogJ2RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBwYXJzZSBmb3IgYWxsIGFwcGxpY2FibGUgZmllbGRzLCBhbmQgZXhjbHVkZSBjYWxjdWxhdGVkIGZpZWxkcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIHRyYW5zZm9ybTogW3tjYWxjdWxhdGU6ICdkYXR1bVtcImJcIl0gKiAyJywgYXM6ICdiMid9XSxcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBjb2xvcjoge3R5cGU6IFwicXVhbnRpdGF0aXZlXCIsIGFnZ3JlZ2F0ZTogJ2NvdW50J30sXG4gICAgICAgICAgc2l6ZToge2ZpZWxkOiAnYjInLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobnVsbCwgbW9kZWwpLnBhcnNlLCB7XG4gICAgICAgICdhJzogJ2RhdGUnLFxuICAgICAgICAnYic6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGZpZWxkcyB3aXRoIGFnZ3JlZ2F0ZT1taXNzaW5nL3ZhbGlkL2Rpc3RpbmN0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHthZ2dyZWdhdGU6ICdtaXNzaW5nJywgZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgeToge2FnZ3JlZ2F0ZTogJ3ZhbGlkJywgZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgY29sb3I6IHthZ2dyZWdhdGU6ICdkaXN0aW5jdCcsIGZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlKG51bGwsIG1vZGVsKSwgbnVsbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSB0aGUgc2FtZSBmaWVsZCB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmFsdWVzOiBbXSxcbiAgICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgIGE6ICdudW1iZXInXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlKG51bGwsIG1vZGVsKS5wYXJzZSwge1xuICAgICAgICAnYSc6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlRGF0YSgpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNoaWxkLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UsIHtcbiAgICAgICAgJ2EnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2InOiAnZGF0ZSdcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZXQgdGhlIGFuY2VzdG9yIHBhcnNlIHRvIHNlZSB3aGV0aGVyIGZpZWxkcyBmcm9tIGl0IGFyZSBub3QgcGFyc2VkXG4gICAgICBtb2RlbC5jaGlsZC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlID0ge2E6ICdudW1iZXInfTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2UobnVsbCwgbW9kZWwuY2hpbGQgYXMgTW9kZWxXaXRoRmllbGQpLnBhcnNlLCB7XG4gICAgICAgICdiJzogJ2RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlVHJhbnNmb3JtcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgYXNzZW1ibGUgY29ycmVjdCBwYXJzZSBleHByZXNzaW9ucycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICBuOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2Jvb2xlYW4nLFxuICAgICAgICBzOiAnc3RyaW5nJyxcbiAgICAgICAgZDE6ICdkYXRlJyxcbiAgICAgICAgZDI6ICdkYXRlOlwiJXlcIicsXG4gICAgICAgIGQzOiAndXRjOlwiJXlcIidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVUcmFuc2Zvcm1zKCksIFtcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvTnVtYmVyKGRhdHVtW1wiblwiXSknLCBhczogJ24nfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvQm9vbGVhbihkYXR1bVtcImJcIl0pJywgYXM6ICdiJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0b1N0cmluZyhkYXR1bVtcInNcIl0pJywgYXM6ICdzJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0b0RhdGUoZGF0dW1bXCJkMVwiXSknLCBhczogJ2QxJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd0aW1lUGFyc2UoZGF0dW1bXCJkMlwiXSxcIiV5XCIpJywgYXM6ICdkMid9LFxuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndXRjUGFyc2UoZGF0dW1bXCJkM1wiXSxcIiV5XCIpJywgYXM6ICdkMyd9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIGZvciB1bnJlY29nbml6ZWQgdHlwZXMnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUGFyc2VOb2RlKG51bGwsIHtcbiAgICAgICAgeDogJ2ZvbycsXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLmFzc2VtYmxlVHJhbnNmb3JtcygpLCBbXSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVucmVjb2duaXplZFBhcnNlKCdmb28nKSk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIl19