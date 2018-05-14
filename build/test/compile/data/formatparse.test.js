/* tslint:disable:quotemark */
import { assert } from 'chai';
import { AncestorParse } from '../../../src/compile/data';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { ParseNode } from '../../../src/compile/data/formatparse';
import { parseTransformArray } from '../../../src/compile/data/parse';
import * as log from '../../../src/log';
import { parseFacetModel, parseUnitModel } from '../../util';
describe('compile/data/formatparse', function () {
    describe('parseUnit', function () {
        it('should parse binned fields as numbers', function () {
            var model = parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal", "bin": true },
                    "y": { "field": "b", "type": "ordinal" }
                }
            });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
                a: 'number'
            });
        });
        it('should return a correct customized parse.', function () {
            var model = parseUnitModel({
                "data": { "url": "a.json", "format": { "parse": { "c": "number", "d": "date" } } },
                "mark": "point",
                "encoding": {
                    "x": { "field": "a", "type": "quantitative" },
                    "y": { "field": "b", "type": "temporal" },
                    "color": { "field": "c", "type": "ordinal" },
                    "shape": { "field": "c", "type": "nominal" }
                }
            });
            var ancestorParese = new AncestorParse();
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParese).parse, {
                a: 'number',
                b: 'date'
            });
            assert.deepEqual(ParseNode.makeExplicit(null, model, ancestorParese).parse, {
                c: 'number',
                d: 'date'
            });
        });
        it('should include parse for all applicable fields, and exclude calculated fields', function () {
            var model = parseUnitModel({
                transform: [{ calculate: 'datum["b"] * 2', as: 'b2' }],
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "temporal" },
                    y: { field: 'b', type: "quantitative" },
                    color: { type: "quantitative", aggregate: 'count' },
                    size: { field: 'b2', type: "quantitative" },
                }
            });
            var ancestorParse = new AncestorParse();
            var parent = new DataFlowNode(null);
            parseTransformArray(parent, model, ancestorParse);
            assert.deepEqual(ancestorParse.combine(), { 'b2': 'derived' });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
                'a': 'date',
                'b': 'number'
            });
        });
        it('should not parse fields with aggregate=missing/valid/distinct', function () {
            var model = parseUnitModel({
                mark: "point",
                encoding: {
                    x: { aggregate: 'missing', field: 'b', type: "quantitative" },
                    y: { aggregate: 'valid', field: 'b', type: "quantitative" },
                    color: { aggregate: 'distinct', field: 'b', type: "quantitative" }
                }
            });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()), null);
        });
        it('should not parse the same field twice', function () {
            var model = parseFacetModel({
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
            assert.deepEqual(ParseNode.makeExplicit(null, model, new AncestorParse()).parse, {
                'a': 'number'
            });
            model.parseScale();
            model.parseData();
            assert.deepEqual(model.child.component.data.ancestorParse.combine(), {
                'a': 'number',
                'b': 'date'
            });
            // set the ancestor parse to see whether fields from it are not parsed
            model.child.component.data.ancestorParse = new AncestorParse({ a: 'number' });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model.child, model.child.component.data.ancestorParse).parse, {
                'b': 'date'
            });
        });
        it('should not parse the same field twice in explicit', function () {
            var model = parseUnitModel({
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
            assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse the same field twice in implicit', function () {
            var model = parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse counts', function () {
            var model = parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "aggregate": "sum", "field": "foo", "type": "quantitative" },
                    "y": { "aggregate": "count", "type": "quantitative" }
                }
            });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
                "foo": "number"
            });
        });
        it('should add flatten for nested fields', function () {
            var model = parseUnitModel({
                "mark": "point",
                "encoding": {
                    "x": { "field": "foo.bar", "type": "quantitative" },
                    "y": { "field": "foo.baz", "type": "ordinal" }
                }
            });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, new AncestorParse()).parse, {
                "foo.bar": "number",
                "foo.baz": "flatten"
            });
        });
        it('should not parse if parse is disabled for a field', function () {
            var model = parseUnitModel({
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
            var ancestorParse = new AncestorParse();
            assert.isNull(ParseNode.makeExplicit(null, model, ancestorParse), null);
            assert.deepEqual(ancestorParse.combine(), {
                b: null
            });
            assert.deepEqual(ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
                a: 'number'
            });
        });
        it('should not parse if parse is disabled', function () {
            var model = parseUnitModel({
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
            assert.isNull(ParseNode.makeExplicit(null, model, new AncestorParse({}, {}, true)));
        });
    });
    describe('assembleTransforms', function () {
        it('should assemble correct parse expressions', function () {
            var p = new ParseNode(null, {
                n: 'number',
                b: 'boolean',
                s: 'string',
                d1: 'date',
                d2: 'date:"%y"',
                d3: 'utc:"%y"'
            });
            assert.deepEqual(p.assembleTransforms(), [
                { type: 'formula', expr: 'toNumber(datum["n"])', as: 'n' },
                { type: 'formula', expr: 'toBoolean(datum["b"])', as: 'b' },
                { type: 'formula', expr: 'toString(datum["s"])', as: 's' },
                { type: 'formula', expr: 'toDate(datum["d1"])', as: 'd1' },
                { type: 'formula', expr: 'timeParse(datum["d2"],"%y")', as: 'd2' },
                { type: 'formula', expr: 'utcParse(datum["d3"],"%y")', as: 'd3' }
            ]);
        });
        it('should assemble flatten for nested fields', function () {
            var p = new ParseNode(null, {
                flat: 'number',
                'nested.field': 'flatten'
            });
            assert.deepEqual(p.assembleTransforms(true), [
                { type: 'formula', expr: 'datum["nested"] && datum["nested"]["field"]', as: 'nested.field' }
            ]);
        });
        it('should show warning for unrecognized types', log.wrap(function (localLogger) {
            var p = new ParseNode(null, {
                x: 'foo',
            });
            assert.deepEqual(p.assembleTransforms(), []);
            assert.equal(localLogger.warns[0], log.message.unrecognizedParse('foo'));
        }));
    });
    describe('assembleFormatParse', function () {
        it('should assemble correct parse', function () {
            var p = new ParseNode(null, {
                n: 'number',
                b: 'boolean',
                'nested.field': 'flatten'
            });
            assert.deepEqual(p.assembleFormatParse(), {
                n: 'number',
                b: 'boolean'
            });
        });
    });
    describe('producedFields', function () {
        it('should produce the correct fields', function () {
            var p = new ParseNode(null, {
                n: 'number',
                b: 'boolean',
                'nested.field': 'flatten'
            });
            assert.deepEqual(p.producedFields(), { n: true, b: true, 'nested.field': true });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0cGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBQzlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ3hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUNoRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDaEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFcEUsT0FBTyxLQUFLLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUUzRCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7b0JBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztpQkFDdkM7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksYUFBYSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQzNGLENBQUMsRUFBRSxRQUFRO2FBQ1osQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQyxFQUFDLEVBQUM7Z0JBQzVFLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQzNDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBQztvQkFDdkMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO29CQUMxQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzNDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxjQUFjLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUMzQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDdEYsQ0FBQyxFQUFFLFFBQVE7Z0JBQ1gsQ0FBQyxFQUFFLE1BQU07YUFDVixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQzFFLENBQUMsRUFBRSxRQUFRO2dCQUNYLENBQUMsRUFBRSxNQUFNO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0VBQStFLEVBQUU7WUFDbEYsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLENBQUM7Z0JBQ3BELElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7b0JBQ2pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDO29CQUNqRCxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUMxQyxJQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3JGLEdBQUcsRUFBRSxNQUFNO2dCQUNYLEdBQUcsRUFBRSxRQUFRO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUU7WUFDbEUsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7b0JBQzNELENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO29CQUN6RCxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDakU7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksYUFBYSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7Z0JBQzVCLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsRUFBRTtvQkFDVixNQUFNLEVBQUU7d0JBQ04sS0FBSyxFQUFFOzRCQUNMLENBQUMsRUFBRSxRQUFRO3lCQUNaO3FCQUNGO2lCQUNGO2dCQUNELEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ25DO2dCQUNELElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3dCQUNyQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7cUJBQ2xDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDL0UsR0FBRyxFQUFFLFFBQVE7YUFDZCxDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRWxCLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDbkUsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsR0FBRyxFQUFFLE1BQU07YUFDWixDQUFDLENBQUM7WUFFSCxzRUFBc0U7WUFDdEUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsS0FBdUIsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUN4SSxHQUFHLEVBQUUsTUFBTTthQUNaLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1lBQ3RELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRSxFQUFFO29CQUNWLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUU7NEJBQ0wsQ0FBQyxFQUFFLFFBQVE7eUJBQ1o7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEVBQUU7YUFDYixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLGFBQWEsQ0FBQyxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUU7WUFDdEQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksYUFBYSxDQUFDLEVBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixJQUFNLEtBQUssR0FBRyxjQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDakUsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUNwRDthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDM0YsS0FBSyxFQUFFLFFBQVE7YUFDaEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNqRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJBQzdDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUMzRixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLFNBQVM7YUFDckIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUU7WUFDdEQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsT0FBTztnQkFDZixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLEVBQUU7b0JBQ1osUUFBUSxFQUFFO3dCQUNSLE9BQU8sRUFBRTs0QkFDUCxHQUFHLEVBQUUsSUFBSTt5QkFDVjtxQkFDRjtpQkFDRjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUMzQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7aUJBQzVDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUMxQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDeEMsQ0FBQyxFQUFFLElBQUk7YUFDUixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDckYsQ0FBQyxFQUFFLFFBQVE7YUFDWixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUM7Z0JBQzNCLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsRUFBRTtvQkFDWixRQUFRLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLElBQUksQ0FBRSw0Q0FBNEM7cUJBQzVEO2lCQUNGO2dCQUNELFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQzNDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQztpQkFDNUM7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLENBQUMsRUFBRSxRQUFRO2dCQUNYLENBQUMsRUFBRSxTQUFTO2dCQUNaLENBQUMsRUFBRSxRQUFRO2dCQUNYLEVBQUUsRUFBRSxNQUFNO2dCQUNWLEVBQUUsRUFBRSxXQUFXO2dCQUNmLEVBQUUsRUFBRSxVQUFVO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDdkMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFDO2dCQUN4RCxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUM7Z0JBQ3pELEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBQztnQkFDeEQsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDO2dCQUN4RCxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLDZCQUE2QixFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUM7Z0JBQ2hFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsNEJBQTRCLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBQzthQUNoRSxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxJQUFNLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLElBQUksRUFBRSxRQUFRO2dCQUNkLGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLDZDQUE2QyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUM7YUFDM0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDcEUsSUFBTSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO2dCQUM1QixDQUFDLEVBQUUsS0FBSzthQUNULENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQ2xDLElBQU0sQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtnQkFDNUIsQ0FBQyxFQUFFLFFBQVE7Z0JBQ1gsQ0FBQyxFQUFFLFNBQVM7Z0JBQ1osY0FBYyxFQUFFLFNBQVM7YUFDMUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtnQkFDeEMsQ0FBQyxFQUFFLFFBQVE7Z0JBQ1gsQ0FBQyxFQUFFLFNBQVM7YUFDYixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtZQUN0QyxJQUFNLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLENBQUMsRUFBRSxRQUFRO2dCQUNYLENBQUMsRUFBRSxTQUFTO2dCQUNaLGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBbmNlc3RvclBhcnNlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge01vZGVsV2l0aEZpZWxkfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VVbml0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFyc2UgYmlubmVkIGZpZWxkcyBhcyBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImJpblwiOiB0cnVlfSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgYTogJ251bWJlcidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBjb3JyZWN0IGN1c3RvbWl6ZWQgcGFyc2UuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJhLmpzb25cIiwgXCJmb3JtYXRcIjoge1wicGFyc2VcIjoge1wiY1wiOiBcIm51bWJlclwiLCBcImRcIjogXCJkYXRlXCJ9fX0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcImZpZWxkXCI6IFwiY1wiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhbmNlc3RvclBhcmVzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyZXNlKS5wYXJzZSwge1xuICAgICAgICBhOiAnbnVtYmVyJyxcbiAgICAgICAgYjogJ2RhdGUnXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcmVzZSkucGFyc2UsIHtcbiAgICAgICAgYzogJ251bWJlcicsXG4gICAgICAgIGQ6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgcGFyc2UgZm9yIGFsbCBhcHBsaWNhYmxlIGZpZWxkcywgYW5kIGV4Y2x1ZGUgY2FsY3VsYXRlZCBmaWVsZHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICB0cmFuc2Zvcm06IFt7Y2FsY3VsYXRlOiAnZGF0dW1bXCJiXCJdICogMicsIGFzOiAnYjInfV0sXG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgY29sb3I6IHt0eXBlOiBcInF1YW50aXRhdGl2ZVwiLCBhZ2dyZWdhdGU6ICdjb3VudCd9LFxuICAgICAgICAgIHNpemU6IHtmaWVsZDogJ2IyJywgdHlwZTogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhbmNlc3RvclBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2UoKTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IG5ldyBEYXRhRmxvd05vZGUobnVsbCk7XG4gICAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHBhcmVudCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhbmNlc3RvclBhcnNlLmNvbWJpbmUoKSwgeydiMic6ICdkZXJpdmVkJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBhbmNlc3RvclBhcnNlKS5wYXJzZSwge1xuICAgICAgICAnYSc6ICdkYXRlJyxcbiAgICAgICAgJ2InOiAnbnVtYmVyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSBmaWVsZHMgd2l0aCBhZ2dyZWdhdGU9bWlzc2luZy92YWxpZC9kaXN0aW5jdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7YWdncmVnYXRlOiAnbWlzc2luZycsIGZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIHk6IHthZ2dyZWdhdGU6ICd2YWxpZCcsIGZpZWxkOiAnYicsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIGNvbG9yOiB7YWdncmVnYXRlOiAnZGlzdGluY3QnLCBmaWVsZDogJ2InLCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKSwgbnVsbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBwYXJzZSB0aGUgc2FtZSBmaWVsZCB0d2ljZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdmFsdWVzOiBbXSxcbiAgICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgIGE6ICdudW1iZXInXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6IFwidGVtcG9yYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKCkpLnBhcnNlLCB7XG4gICAgICAgICdhJzogJ251bWJlcidcbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgbW9kZWwucGFyc2VEYXRhKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZS5jb21iaW5lKCksIHtcbiAgICAgICAgJ2EnOiAnbnVtYmVyJyxcbiAgICAgICAgJ2InOiAnZGF0ZSdcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZXQgdGhlIGFuY2VzdG9yIHBhcnNlIHRvIHNlZSB3aGV0aGVyIGZpZWxkcyBmcm9tIGl0IGFyZSBub3QgcGFyc2VkXG4gICAgICBtb2RlbC5jaGlsZC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlID0gbmV3IEFuY2VzdG9yUGFyc2Uoe2E6ICdudW1iZXInfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwuY2hpbGQgYXMgTW9kZWxXaXRoRmllbGQsIG1vZGVsLmNoaWxkLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UpLnBhcnNlLCB7XG4gICAgICAgICdiJzogJ2RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIHRoZSBzYW1lIGZpZWxkIHR3aWNlIGluIGV4cGxpY2l0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHZhbHVlczogW10sXG4gICAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICBhOiAnbnVtYmVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge31cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuaXNOdWxsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIG5ldyBBbmNlc3RvclBhcnNlKHthOiAnbnVtYmVyJ30sIHt9KSkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgdHdpY2UgaW4gaW1wbGljaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmlzTnVsbChQYXJzZU5vZGUubWFrZUV4cGxpY2l0KG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSh7YTogJ251bWJlcid9LCB7fSkpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGNvdW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJmb29cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2UoKSkucGFyc2UsIHtcbiAgICAgICAgXCJmb29cIjogXCJudW1iZXJcIlxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBmbGF0dGVuIGZvciBuZXN0ZWQgZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImZvby5iYXJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImZvby5iYXpcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSgpKS5wYXJzZSwge1xuICAgICAgICBcImZvby5iYXJcIjogXCJudW1iZXJcIixcbiAgICAgICAgXCJmb28uYmF6XCI6IFwiZmxhdHRlblwiXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGlmIHBhcnNlIGlzIGRpc2FibGVkIGZvciBhIGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW10sXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJwYXJzZVwiOiB7XG4gICAgICAgICAgICAgIFwiYlwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYW5jZXN0b3JQYXJzZSA9IG5ldyBBbmNlc3RvclBhcnNlKCk7XG4gICAgICBhc3NlcnQuaXNOdWxsKFBhcnNlTm9kZS5tYWtlRXhwbGljaXQobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpLCBudWxsKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoYW5jZXN0b3JQYXJzZS5jb21iaW5lKCksIHtcbiAgICAgICAgYjogbnVsbFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcobnVsbCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpLnBhcnNlLCB7XG4gICAgICAgIGE6ICdudW1iZXInXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHBhcnNlIGlmIHBhcnNlIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW10sXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJwYXJzZVwiOiBudWxsICAvLyBpbXBsaWVzIEFuY2VzdG9yUGFyc2UubWFrZUV4cGxpY2l0ID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5pc051bGwoUGFyc2VOb2RlLm1ha2VFeHBsaWNpdChudWxsLCBtb2RlbCwgbmV3IEFuY2VzdG9yUGFyc2Uoe30sIHt9LCB0cnVlKSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVUcmFuc2Zvcm1zJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBjb3JyZWN0IHBhcnNlIGV4cHJlc3Npb25zJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgIHM6ICdzdHJpbmcnLFxuICAgICAgICBkMTogJ2RhdGUnLFxuICAgICAgICBkMjogJ2RhdGU6XCIleVwiJyxcbiAgICAgICAgZDM6ICd1dGM6XCIleVwiJ1xuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocC5hc3NlbWJsZVRyYW5zZm9ybXMoKSwgW1xuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9OdW1iZXIoZGF0dW1bXCJuXCJdKScsIGFzOiAnbid9LFxuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAndG9Cb29sZWFuKGRhdHVtW1wiYlwiXSknLCBhczogJ2InfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvU3RyaW5nKGRhdHVtW1wic1wiXSknLCBhczogJ3MnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RvRGF0ZShkYXR1bVtcImQxXCJdKScsIGFzOiAnZDEnfSxcbiAgICAgICAge3R5cGU6ICdmb3JtdWxhJywgZXhwcjogJ3RpbWVQYXJzZShkYXR1bVtcImQyXCJdLFwiJXlcIiknLCBhczogJ2QyJ30sXG4gICAgICAgIHt0eXBlOiAnZm9ybXVsYScsIGV4cHI6ICd1dGNQYXJzZShkYXR1bVtcImQzXCJdLFwiJXlcIiknLCBhczogJ2QzJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBmbGF0dGVuIGZvciBuZXN0ZWQgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIGZsYXQ6ICdudW1iZXInLFxuICAgICAgICAnbmVzdGVkLmZpZWxkJzogJ2ZsYXR0ZW4nXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwLmFzc2VtYmxlVHJhbnNmb3Jtcyh0cnVlKSwgW1xuICAgICAgICB7dHlwZTogJ2Zvcm11bGEnLCBleHByOiAnZGF0dW1bXCJuZXN0ZWRcIl0gJiYgZGF0dW1bXCJuZXN0ZWRcIl1bXCJmaWVsZFwiXScsIGFzOiAnbmVzdGVkLmZpZWxkJ31cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgZm9yIHVucmVjb2duaXplZCB0eXBlcycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBQYXJzZU5vZGUobnVsbCwge1xuICAgICAgICB4OiAnZm9vJyxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVUcmFuc2Zvcm1zKCksIFtdKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5yZWNvZ25pemVkUGFyc2UoJ2ZvbycpKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZUZvcm1hdFBhcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBhc3NlbWJsZSBjb3JyZWN0IHBhcnNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgICduZXN0ZWQuZmllbGQnOiAnZmxhdHRlbidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAuYXNzZW1ibGVGb3JtYXRQYXJzZSgpLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncHJvZHVjZWRGaWVsZHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgdGhlIGNvcnJlY3QgZmllbGRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwID0gbmV3IFBhcnNlTm9kZShudWxsLCB7XG4gICAgICAgIG46ICdudW1iZXInLFxuICAgICAgICBiOiAnYm9vbGVhbicsXG4gICAgICAgICduZXN0ZWQuZmllbGQnOiAnZmxhdHRlbidcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHAucHJvZHVjZWRGaWVsZHMoKSwge246IHRydWUsIGI6IHRydWUsICduZXN0ZWQuZmllbGQnOiB0cnVlfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=