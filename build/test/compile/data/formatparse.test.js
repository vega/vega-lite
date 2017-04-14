"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var util_1 = require("../../util");
function parse(model) {
    return formatparse_1.ParseNode.make(model).assemble();
}
describe('compile/data/formatparse', function () {
    describe('parseUnit', function () {
        it('should return a correct parse for encoding mapping', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json" },
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "d", "type": "nominal" }
                }
            });
            chai_1.assert.deepEqual(parse(model), {
                a: 'number',
                b: 'date'
            });
        });
        it('should return a correct parse for filtered fields', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "a.json" },
                "transform": [{
                        "filter": [
                            { "field": "a", "equal": { year: 2000 } },
                            { "field": "b", "oneOf": ["a", "b"] },
                            { "field": "c", "range": [{ year: 2000 }, { year: 2001 }] },
                            { "field": "d", "range": [1, 2] }
                        ]
                    }],
                "mark": "point",
                encoding: {}
            });
            chai_1.assert.deepEqual(parse(model), {
                a: 'date',
                b: 'string',
                c: 'date',
                d: 'number'
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
            chai_1.assert.deepEqual(parse(model), {
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
            chai_1.assert.deepEqual(parse(model), {
                'a': 'date',
                'b': 'number'
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLHFFQUFnRTtBQUVoRSxtQ0FBMEM7QUFFMUMsZUFBZSxLQUFZO0lBQ3pCLE1BQU0sQ0FBQyx1QkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxQyxDQUFDO0FBRUQsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO1lBQ3ZELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUM7Z0JBQ3pCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQzNDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQztvQkFDdkMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO29CQUMxQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzNDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzdCLENBQUMsRUFBRSxRQUFRO2dCQUNYLENBQUMsRUFBRSxNQUFNO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbURB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