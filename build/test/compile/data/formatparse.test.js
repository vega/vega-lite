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
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', bin: true },
                    y: { field: 'b', type: 'ordinal' }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                a: 'number'
            });
        });
        it('should flatten nested fields that are used to sort domains', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: { field: 'foo.bar', op: 'mean' } }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                'foo.bar': 'flatten'
            });
        });
        it('should return a correct customized parse.', function () {
            var model = util_1.parseUnitModel({
                data: { url: 'a.json', format: { parse: { c: 'number', d: 'date' } } },
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'temporal' },
                    color: { field: 'c', type: 'ordinal' },
                    shape: { field: 'c', type: 'nominal' }
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
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal' },
                    y: { field: 'b', type: 'quantitative' },
                    color: { type: 'quantitative', aggregate: 'count' },
                    size: { field: 'b2', type: 'quantitative' }
                }
            });
            var ancestorParse = new data_1.AncestorParse();
            var parent = new dataflow_1.DataFlowNode(null);
            parse_1.parseTransformArray(parent, model, ancestorParse);
            chai_1.assert.deepEqual(ancestorParse.combine(), { b2: 'derived' });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, ancestorParse).parse, {
                a: 'date',
                b: 'number'
            });
        });
        it('should not parse fields with aggregate=missing/valid/distinct', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { aggregate: 'missing', field: 'b', type: 'quantitative' },
                    y: { aggregate: 'valid', field: 'b', type: 'quantitative' },
                    color: { aggregate: 'distinct', field: 'b', type: 'quantitative' }
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
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'quantitative' },
                        y: { field: 'b', type: 'temporal' }
                    }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse()).parse, {
                a: 'number'
            });
            model.parseScale();
            model.parseData();
            chai_1.assert.deepEqual(model.child.component.data.ancestorParse.combine(), {
                a: 'number',
                b: 'date'
            });
            // set the ancestor parse to see whether fields from it are not parsed
            model.child.component.data.ancestorParse = new data_1.AncestorParse({ a: 'number' });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model.child, model.child.component.data.ancestorParse).parse, {
                b: 'date'
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
                mark: 'point',
                encoding: {}
            });
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse the same field twice in implicit', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            chai_1.assert.isNull(formatparse_1.ParseNode.makeExplicit(null, model, new data_1.AncestorParse({ a: 'number' }, {})));
        });
        it('should not parse counts', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { aggregate: 'sum', field: 'foo', type: 'quantitative' },
                    y: { aggregate: 'count', type: 'quantitative' }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                foo: 'number'
            });
        });
        it('should add flatten for nested fields', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'foo.bar', type: 'quantitative' },
                    y: { field: 'foo.baz', type: 'ordinal' }
                }
            });
            chai_1.assert.deepEqual(formatparse_1.ParseNode.makeImplicitFromEncoding(null, model, new data_1.AncestorParse()).parse, {
                'foo.bar': 'number',
                'foo.baz': 'flatten'
            });
        });
        it('should not parse if parse is disabled for a field', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                data: {
                    values: [],
                    format: {
                        parse: {
                            b: null
                        }
                    }
                },
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
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
                mark: 'point',
                data: {
                    values: [],
                    format: {
                        parse: null // implies AncestorParse.makeExplicit = true
                    }
                },
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
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
                x: 'foo'
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
//# sourceMappingURL=formatparse.test.js.map