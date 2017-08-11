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
        it('should show warning for unrecognized types', function () {
            log.runLocalLogger(function (localLogger) {
                var p = new formatparse_1.ParseNode({
                    x: 'foo',
                });
                chai_1.assert.deepEqual(p.assembleTransforms(), []);
                chai_1.assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLHFFQUFnRTtBQUVoRSxzQ0FBd0M7QUFDeEMsbUNBQTJEO0FBRTNELFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUNuQyxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDO2dCQUN6QixXQUFXLEVBQUUsQ0FBQzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFO2dDQUNMLEtBQUssRUFBRSxDQUFDO3dDQUNOLElBQUksRUFBRTs0Q0FDSjtnREFDRSxVQUFVLEVBQUUsTUFBTTtnREFDbEIsT0FBTyxFQUFFLE1BQU07Z0RBQ2YsT0FBTyxFQUFFLElBQUk7NkNBQ2Q7NENBQ0QsYUFBYTt5Q0FDZDtxQ0FDRixDQUFDOzZCQUNIO3lCQUNGO3FCQUNGLENBQUM7Z0JBQ0YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDM0MsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFDO29CQUN2QyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQzFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDM0M7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFN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